import test from 'node:test';
import assert from 'node:assert/strict';
import {blank,attempt,STORAGE_KEY} from '../site/state.js';
test('application connects its real save state to the Microsoft sync client and retains guest history',async()=>{
 const guest=blank();attempt(guest,'resturi-1').value='-2';guest.attempts['resturi-1'].everCorrect=true;
 const storage=new Map([[STORAGE_KEY,JSON.stringify(guest)]]),nodes=new Map();
 function element(){return {children:[],innerHTML:'',textContent:'',hidden:false,dataset:{},classList:{toggle(){}},querySelectorAll(){return [];},querySelector(){return null;},addEventListener(){},focus(){},setAttribute(){},append(value){this.children.push(value);},replaceChildren(){this.children=[];},remove(){}};}
 for(const id of ['main','global-progress','total-progress','save-status','toast','account-panel','account-controls','account-actions','account-status','account-signin-hint'])nodes.set(id,element());
 const identity='11111111-1111-4111-8111-111111111111:22222222-2222-4222-8222-222222222222';let remote={version:0,progress:blank()},writes=0;
 const originals={document:globalThis.document,window:globalThis.window,location:globalThis.location,localStorage:globalThis.localStorage,customElements:globalThis.customElements,fetch:globalThis.fetch,setInterval:globalThis.setInterval};
 Object.assign(globalThis,{
  document:{getElementById:id=>nodes.get(id)||null,querySelector:key=>nodes.get(key.slice(1)),querySelectorAll:()=>[],addEventListener(){},createElement:element,head:{append:script=>queueMicrotask(()=>script.onerror())},hidden:false,title:''},
  window:{addEventListener(){},scrollTo(){}},location:{hash:'#home',protocol:'https:'},localStorage:{getItem:key=>storage.get(key)??null,setItem:(key,value)=>storage.set(key,value)},customElements:{get:()=>undefined},setInterval:()=>0,
  fetch:async(path,options={})=>{
   const response=value=>({ok:true,status:200,json:async()=>JSON.parse(JSON.stringify(value))});
   if(path==='/api/account')return response({enabled:true,user:{id:identity,name:'Student Test',email:'student@s.unibuc.ro'}});
   if(path==='/api/progress'){
    if(options.method==='PUT'){assert.equal(options.headers['X-SAI-Account'],identity);const body=JSON.parse(options.body);assert.equal(body.version,remote.version);remote={version:remote.version+1,progress:body.progress};writes++;}
    return response(remote);
   }
   return {ok:false,status:404};
  }
 });
 try{
  await import('../site/app.js');
  for(let turn=0;turn<6;turn++)await new Promise(resolve=>setImmediate(resolve));
  assert.equal(writes,1);assert.equal(remote.progress.attempts['resturi-1'].value,'-2');
  assert.equal(JSON.parse(storage.get(STORAGE_KEY)).attempts['resturi-1'].value,'-2');
  const cached=JSON.parse(storage.get(STORAGE_KEY+':account:'+identity));assert.equal(cached.progress.attempts['resturi-1'].value,'-2');
  assert.match(nodes.get('account-status').textContent,/sincronizat/);assert.equal(nodes.get('account-panel').hidden,false);assert.match(nodes.get('global-progress').textContent,/^\d+%$/);
 }finally{Object.assign(globalThis,originals);}
});
