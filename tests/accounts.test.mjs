import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {createServer} from '../scripts/serve.mjs';
import {accountSettings,accountIdentity,createProgressStore,normalizeProgress,progressDatabaseSettings,progressLimit} from '../scripts/accounts.mjs';
import {inject} from '../scripts/inject.mjs';
import {blank,attempt} from '../site/state.js';
import {mergeProgress,mergeAnonymous} from '../site/account-state.js';
const tenant='11111111-1111-4111-8111-111111111111',object='22222222-2222-4222-8222-222222222222',other='33333333-3333-4333-8333-333333333333';
const env={AUTH_ENABLED:'true',WEBSITE_INSTANCE_ID:'unit-test',WEBSITE_AUTH_ENABLED:'true',AUTH_UNIVERSITY_TENANT_IDS:tenant,AUTH_ORIGIN:'https://algebra.example.test'};
const principal=(email='student@s.unibuc.ro',objectId=object,extra=[])=>Buffer.from(JSON.stringify({auth_typ:'aad',claims:[{typ:'tid',val:tenant},{typ:'oid',val:objectId},{typ:'preferred_username',val:email},{typ:'name',val:'Student Test'},...extra]})).toString('base64');
const copy=value=>JSON.parse(JSON.stringify(value));
function progress(id='resturi-1',value='-2'){const s=blank();attempt(s,id).value=value;return s;}
test('Microsoft university identity is accepted only behind configured Easy Auth',()=>{
 assert.equal(accountSettings({}),null);
 for(const overrides of [{WEBSITE_INSTANCE_ID:''},{WEBSITE_AUTH_ENABLED:'false'},{AUTH_ORIGIN:'http://algebra.example.test'},{AUTH_ORIGIN:''},{AUTH_UNIVERSITY_TENANT_IDS:''}])assert.throws(()=>accountSettings({...env,...overrides}));
 const settings=accountSettings(env);
 assert.equal(accountIdentity({'x-ms-client-principal':principal()},settings).id,tenant+':'+object);
 assert.equal(accountIdentity({'x-ms-client-principal':principal()},null),null);
 assert.equal(accountIdentity({'x-ms-client-principal-name':'student@s.unibuc.ro'},settings),null);
 for(const email of ['user@gmail.com','student@s.unibuc.ro.attacker.test','student@sub.unibuc.ro','name#EXT#@unibuc.ro','student@s.unibuc.ro\n'])assert.throws(()=>accountIdentity({'x-ms-client-principal':principal(email)},settings));
 assert.throws(()=>accountIdentity({'x-ms-client-principal':principal(undefined,object,[{typ:'tid',val:other}])},settings));
 assert.throws(()=>accountIdentity({'x-ms-client-principal':principal(undefined,object,[{typ:'acct',val:'1'}])},settings));
 const mapped=JSON.parse(Buffer.from(principal(),'base64'));mapped.claims=mapped.claims.map(c=>({...c,typ:({tid:'http://schemas.microsoft.com/identity/claims/tenantid',oid:'http://schemas.microsoft.com/identity/claims/objectidentifier',preferred_username:'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn'})[c.typ]||c.typ}));
 assert.equal(accountIdentity({'x-ms-client-principal':Buffer.from(JSON.stringify(mapped)).toString('base64')},settings).name,'Student Test');
 const db=progressDatabaseSettings({PROGRESS_USE_AZURE_POSTGRESQL:'true',AZURE_POSTGRESQL_HOST:'test',AZURE_POSTGRESQL_USER:'test',AZURE_POSTGRESQL_PASSWORD:'test',AZURE_POSTGRESQL_DATABASE:'test'});
 assert.deepEqual(db.connectionOptions.ssl,{rejectUnauthorized:true});
});
test('progress validation preserves algebra data and refuses foreign IDs and malformed simulations',()=>{
 assert.deepEqual(normalizeProgress(progress()),progress());
 for(const value of [{version:2,records:{}},{...blank(),attempts:{unknown:{value:'x'}}},progress('resturi-1','x'.repeat(8001)),{...progress(),exam:{status:'running',ids:['unknown'],start:1,end:60001}}])assert.throws(()=>normalizeProgress(value));
 const value=progress();value.attempts['resturi-1'].level=5;assert.throws(()=>normalizeProgress(value));
});
test('account API uses real isolated SQL, atomic versions, ownership checks and request validation',async t=>{
 const {PGlite}=createRequire(import.meta.url)('@electric-sql/pglite');
 const database=new PGlite();await database.waitReady;
 const store=createProgressStore({database}),handler=createServer({env,progressStore:store}).listeners('request')[0];
 const headers={'X-MS-CLIENT-PRINCIPAL':principal(),'X-SAI-Account':tenant+':'+object,'X-SAI-Progress':'1',Origin:env.AUTH_ORIGIN,'Content-Type':'application/json'};
 const request=(path='/api/progress',method='GET',value,extra={})=>inject(handler,{path,method,body:value===undefined?undefined:typeof value==='string'?value:JSON.stringify(value),headers:{...headers,...extra}});
 try{
  let r=await request('/api/account');assert.equal(r.status,200);assert.equal(JSON.parse(r.body).user.name,'Student Test');
  r=await request();assert.deepEqual(JSON.parse(r.body),{version:0,progress:blank()});assert.equal(r.headers['cache-control'],'no-store');
  const payload=progress('resturi-1',"'); DROP TABLE sai_account_progress; --");
  r=await request('/api/progress','PUT',{version:0,progress:payload});assert.equal(r.status,200);assert.equal(JSON.parse(r.body).version,1);
  const stale=await request('/api/progress','PUT',{version:0,progress:payload});assert.equal(stale.status,409);assert.equal(JSON.parse(stale.body).version,1);
  const requests=await Promise.all([1,2].map(n=>request('/api/progress','PUT',{version:1,progress:progress('resturi-1',String(n))})));assert.deepEqual(requests.map(r=>r.status).sort(),[200,409]);
  r=await request('/api/progress','GET',undefined,{'X-MS-CLIENT-PRINCIPAL':principal('second@s.unibuc.ro',other),'X-SAI-Account':tenant+':'+other});assert.deepEqual(JSON.parse(r.body).progress,blank());
  assert.equal((await request('/api/progress','PUT',{version:2,progress:payload},{Origin:'https://evil.test'})).status,403);
  assert.equal((await request('/api/progress','PUT',{version:2,progress:payload},{'X-SAI-Progress':''})).status,403);
  assert.equal((await request('/api/progress','PUT',{version:2,progress:payload},{'Content-Type':'text/plain'})).status,415);
  assert.equal((await request('/api/progress','GET',undefined,{'X-MS-CLIENT-PRINCIPAL':''})).status,401);
  assert.equal((await request('/api/progress','GET',undefined,{'X-SAI-Account':tenant+':'+other})).status,409);
  assert.equal((await request('/api/progress','PUT','{')).status,400);
  assert.equal((await request('/api/progress','PUT',{version:2,progress:{version:2,records:{}}})).status,400);
  assert.equal((await request('/api/progress','PUT','x'.repeat(progressLimit+1))).status,413);
  r=await request('/account/logout','POST');assert.equal(r.status,303);assert.equal(r.headers.location,'/');assert.ok(r.headers['set-cookie'].every(c=>c.includes('Max-Age=0')&&c.includes('HttpOnly; Secure')));
  assert.equal((await request('/account/logout','POST',undefined,{Origin:'https://evil.test'})).status,403);
  const tables=await database.query("SELECT tablename FROM pg_tables WHERE schemaname='public'");assert.deepEqual(tables.rows.map(r=>r.tablename),['sai_account_progress']);
  const disabled=createServer({env:{}}).listeners('request')[0];r=await inject(disabled,{path:'/api/account',headers});assert.equal(JSON.parse(r.body).enabled,false);assert.equal(JSON.parse(r.body).user,null);
  const unavailable=createServer({env,progressStore:{read(){throw Error('SECRET_DATABASE_VALUE');}}}).listeners('request')[0];r=await inject(unavailable,{path:'/api/progress',headers});assert.equal(r.status,503);assert.ok(!r.body.includes('SECRET_DATABASE_VALUE'));
 }finally{await database.close();}
});
const clientSource=(await readFile(new URL('../site/account.js',import.meta.url),'utf8')).replace(/^import .*;\r?\n/gm,'');
function fixture({id=tenant+':'+object,storage=new Map(),api,anonymous=false,enabled=true}={}){
 const elements=new Map(),events={},timers=new Map();let next=0,state=blank();const downloads=[];
 const element=()=>({children:[],textContent:'',hidden:false,listeners:{},append(el){this.children.push(el);},replaceChildren(){this.children=[];},addEventListener(name,fn){this.listeners[name]=fn;}});
 for(const key of ['#account-panel','#account-controls','#account-status','#account-actions','#account-signin-hint'])elements.set(key,element());
 const context=vm.createContext({blank,mergeProgress,mergeAnonymous,AbortSignal,console,confirm:()=>true,window:{addEventListener:(name,fn)=>events[name]=fn},document:{querySelector:key=>elements.get(key),createElement:element,addEventListener:(name,fn)=>events[name]=fn},location:{protocol:'https:'},localStorage:{getItem:key=>storage.get(key)??null,setItem:(key,value)=>storage.set(key,value)},setTimeout:fn=>{timers.set(++next,fn);return next;},clearTimeout:id=>timers.delete(id),fetch:async(path,options)=>{const result=path==='/api/account'?{status:200,value:{enabled,user:anonymous||!enabled?null:{id,email:'student@s.unibuc.ro',name:'Student Test'}}}:await api(path,options);return {ok:result.status<400,status:result.status,json:async()=>copy(result.value)};}});
 vm.runInContext(clientSource,context);
 const controller=context.window.SAI_ACCOUNTS.create({storageKey:'sai-test',normalize:normalizeProgress,getState:()=>state,setState:value=>state=copy(value),refresh(){},download:(name,value)=>downloads.push(JSON.parse(value))});
 return {controller,elements,storage,downloads,get state(){return state;},set state(value){state=copy(value);}};
}
function cloud(){let remote={version:0,progress:blank()},writes=0;return {get remote(){return remote;},get writes(){return writes;},api:async(path,options)=>{assert.equal(path,'/api/progress');if(options.method!=='PUT')return {status:200,value:remote};assert.ok(options.headers['X-SAI-Account']);assert.equal(options.headers['X-SAI-Progress'],'1');const input=JSON.parse(options.body);if(input.version!==remote.version)return {status:409,value:remote};writes++;remote={version:remote.version+1,progress:copy(input.progress)};return {status:200,value:remote};}};}
test('shipped client restores devices, merges different exercises and stops on conflicting answers',async()=>{
 const server=cloud(),first=fixture({api:server.api});await first.controller.start();first.state=progress();assert.equal(first.controller.save(),true);await first.controller.flush();
 const second=fixture({api:server.api});await second.controller.start();assert.deepEqual(second.state,first.state);
 first.state.attempts['resturi-2']=progress('resturi-2','da').attempts['resturi-2'];first.controller.save();await first.controller.flush();
 second.state.attempts['invers-1']=progress('invers-1','46').attempts['invers-1'];second.controller.save();await second.controller.flush();await second.controller.flush();
 assert.ok(server.remote.progress.attempts['resturi-2']);assert.ok(server.remote.progress.attempts['invers-1']);
 const third=fixture({api:server.api});await third.controller.start();third.state.attempts['resturi-1'].value='remote';third.controller.save();await third.controller.flush();
 second.state.attempts['resturi-1'].value='local';second.controller.save();await second.controller.flush();
 assert.ok(second.elements.get('#account-status').textContent.includes('Am oprit sincronizarea'));const count=server.writes;await second.controller.flush();assert.equal(server.writes,count);assert.equal(server.remote.progress.attempts['resturi-1'].value,'remote');
 assert.equal(JSON.parse(second.storage.get('sai-test:account:'+tenant+':'+object)).progress.attempts['resturi-1'].value,'local');
 const offline=fixture({storage:second.storage,api:async()=>{throw Error('offline');}});await offline.controller.start();assert.equal(offline.state.attempts['resturi-1'].value,'local');
 const switched=fixture({storage:second.storage,id:tenant+':'+other,api:cloud().api});await switched.controller.start();assert.deepEqual(switched.state,blank());
 const signout=first.elements.get('#account-controls').children.find(el=>el.action==='/account/logout');assert.equal(signout.method,'post');assert.equal(signout.children[0].children[0].textContent,'Student Test');signout.listeners.submit();const prior=server.writes;first.state.attempts['resturi-1'].value='after logout';await first.controller.flush();assert.equal(server.writes,prior);
});
test('anonymous migration is owned once, survives a failed save and never copies a different account',async()=>{
 const storage=new Map([['sai-test',JSON.stringify(progress())]]),server=cloud();let fail=true;
 const api=async(path,options)=>{if(fail&&options.method==='PUT')throw Error('offline');return server.api(path,options);};
 const first=fixture({storage,api});await first.controller.start();assert.deepEqual(first.state,progress());assert.equal(storage.get('sai-test:anonymous-owner'),tenant+':'+object);
 fail=false;const restored=fixture({storage,api});await restored.controller.start();assert.deepEqual(server.remote.progress,progress());
 const otherAccount=fixture({storage,id:tenant+':'+other,api:cloud().api});await otherAccount.controller.start();assert.deepEqual(otherAccount.state,blank());
 const guest=fixture({anonymous:true,api});await guest.controller.start();assert.ok(guest.elements.get('#account-controls').children.some(e=>e.href?.startsWith('/.auth/login/aad')));
 const local=fixture({enabled:false,api});await local.controller.start();assert.ok(local.elements.get('#account-controls').children.every(e=>e.disabled));assert.equal(local.elements.get('#account-signin-hint').hidden,false);assert.equal(local.elements.get('#account-signin-hint').textContent,'Conectează-te cu Microsoft pentru a salva progresul în cont.');assert.equal(first.elements.get('#account-signin-hint').hidden,true);
});
test('concurrent changes to a simulation are preserved as a conflict, never merged into a submitted exam',()=>{
 const base=blank();base.exam={status:'running',ids:['resturi-1'],start:1,end:60001,answers:{},notes:{},label:'Test'};
 const ours=copy(base),theirs=copy(base);ours.exam.answers['resturi-1']='2';theirs.exam.status='submitted';
 const result=mergeProgress(base,ours,theirs);assert.deepEqual(result.conflicts,['exam']);assert.equal(result.progress.exam.status,'submitted');assert.equal(ours.exam.answers['resturi-1'],'2');
});

