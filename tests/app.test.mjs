import test from 'node:test';
import assert from 'node:assert/strict';
import {blank,attempt,recordGrade,freshAttempt,DAY,startExam,expireExam,sanitize,isComplete,dueIds} from '../site/state.js';
import {lessons,exercises} from '../site/content.js';
import {exerciseHtml} from '../site/ui.js';
import {createServer} from '../scripts/serve.mjs';
import {inject} from '../scripts/inject.mjs';
test('assistance is not marked independent; review does not advance repeatedly in one day',()=>{const s=blank(),id=exercises[0].id,now=100*DAY;attempt(s,id).hints=true;recordGrade(s,id,{status:'correct'},now);assert.equal(s.attempts[id].lastIndependent,0);assert.equal(s.attempts[id].everCorrect,true);freshAttempt(s,id);recordGrade(s,id,{status:'correct'},now);assert.equal(s.attempts[id].level,1);assert.equal(s.attempts[id].reviewAt,now+DAY);recordGrade(s,id,{status:'correct'},now+1000);assert.equal(s.attempts[id].level,1);assert.deepEqual(dueIds(s,exercises,now+DAY),[id]);recordGrade(s,id,{status:'correct'},now+DAY);assert.equal(s.attempts[id].level,2);assert.equal(s.attempts[id].reviewAt,now+4*DAY);recordGrade(s,id,{status:'wrong'},now+2*DAY);assert.equal(s.attempts[id].level,0);assert.equal(s.attempts[id].reviewAt,now+3*DAY);});
test('lesson completion needs every exercise and manual proof review',()=>{const s=blank(),l=lessons.find(x=>x.exercises.some(e=>e.kind==='proof'));for(const e of l.exercises){if(e.kind!=='proof')recordGrade(s,e.id,{status:'correct'});}assert.equal(isComplete(s,l),false);for(const e of l.exercises)if(e.kind==='proof')attempt(s,e.id).reviewed=true;assert.equal(isComplete(s,l),true);});
test('exam deadline survives export/import and expiry locks; no course credit from exam',()=>{const s=blank(),now=Date.now();s.exam=startExam(exercises.slice(0,10).map(e=>e.id),60,'Test',now);s.exam.answers[exercises[0].id]='148';const restored=sanitize(JSON.parse(JSON.stringify(s)),new Set(exercises.map(e=>e.id)),new Set(lessons.map(l=>l.id)));assert.equal(restored.exam.end,now+60*60000);assert.equal(restored.exam.answers[exercises[0].id],'148');assert.equal(expireExam(restored,now+60000),false);assert.equal(expireExam(restored,now+60*60000),true);assert.equal(restored.exam.status,'submitted');assert.equal(expireExam(restored,now+61*60000),false);assert.deepEqual(restored.attempts,{});});
test('progress import validates schema and strips unknown IDs',()=>{const ids=new Set([exercises[0].id]);assert.throws(()=>sanitize({version:9},ids,new Set()));const raw={version:1,attempts:{unknown:{value:'<script>'},[exercises[0].id]:{value:'<script>',level:100,status:'invented'}},exam:{status:'running',ids:['unknown'],end:10,start:1}};const s=sanitize(raw,ids,new Set());assert.deepEqual(Object.keys(s.attempts),[exercises[0].id]);assert.equal(s.attempts[exercises[0].id].level,4);assert.equal(s.exam,null);});
test('exercise markup escapes saved input; exam conceals hints and solutions',()=>{const ex=exercises.find(e=>e.kind==='number');const safe=exerciseHtml(ex,{value:'</textarea><script>alert(1)</script>'});assert.ok(!safe.includes('<script>'));assert.ok(safe.includes('&lt;script&gt;'));const exam=exerciseHtml(ex,{},'exam');assert.ok(!exam.includes('data-action="solution"'));assert.ok(exam.includes('class="solution" hidden'));const result=exerciseHtml(ex,{value:String(ex.answer)},'result');assert.ok(result.includes('readonly'));assert.ok(result.includes('feedback correct'));});
test('HTTP serves the interactive course, rejects private files and unsupported methods',async()=>{
 const handler=createServer({env:{}}).listeners('request')[0];
 const request=(path,method='GET')=>inject(handler,{path,method});
 for(const route of ['/','/site/app.js','/site/content.js','/site/style.css','/api/health']){
  const response=await request(route);
  assert.equal(response.status,200,route);
  assert.equal(response.headers['x-content-type-options'],route==='/api/health'?undefined:'nosniff');
 }
 for(const route of ['/sources/document.pdf','/package.json','/tests/math.test.mjs','/site/.hidden','/site/../../package.json','/site/nonexistent.js','/site/%5C..%5Cpackage.json'])assert.equal((await request(route)).status,404,route);
 assert.equal((await request('/','POST')).status,405);
 const head=await request('/site/style.css','HEAD');
 assert.equal(head.status,200);assert.equal(head.body,'');
});

