import test from 'node:test';
import assert from 'node:assert/strict';
import {lessons} from '../site/content.js';
import {visualHtml,flow,table,matrices,cycle,sieve} from '../site/lesson-visuals.js';
import {exerciseHtml} from '../site/ui.js';
import {determinant} from '../site/math-core.js';

test('every lesson has illustrated explanations with titles, captions and complete visual data',()=>{
 for(const lesson of lessons){
  assert.ok(lesson.theory.length>=3,lesson.id);
  assert.ok(lesson.theory.some(([, ,visual])=>visual),lesson.id);
  for(const [title,text,visual] of lesson.theory){
   assert.ok(title&&text,lesson.id);
   if(!visual)continue;
   assert.ok(visual.title&&visual.caption,lesson.id);
   const html=visualHtml(visual);
   assert.ok(html.includes('<figcaption>'),lesson.id);
   assert.ok(!/NaN|undefined|Infinity/.test(html),lesson.id);
   if(visual.type==='table')for(const row of visual.rows)assert.equal(row.length,visual.headers.length,lesson.id);
   if(visual.type==='matrices')for(const item of visual.items)for(const row of item.rows)assert.equal(row.length,item.rows[0].length,lesson.id);
   if(visual.type==='cycle')assert.ok(visual.labels.length>=3&&visual.labels.length<=8,lesson.id);
  }
 }
});

test('visuals escape labels and provide textual equivalents of graphical information',()=>{
 const value='<img src=x onerror=alert(1)>',caption='Descriere & verificare';
 for(const visual of [flow(value,[[value,value]],caption),table(value,[value],[[value]],caption),matrices(value,[{label:value,rows:[[value]]}],caption),cycle(value,[value,'2','3'],caption),sieve(value,6,[2,3],caption)]){
  const html=visualHtml(visual);
  assert.ok(!html.includes('<img'));assert.ok(html.includes('&lt;img'));
  assert.ok(html.includes('Descriere &amp; verificare'));
 }
 const circular=visualHtml(cycle('Un ciclu',['1','2','3'],'1→2→3→1'));
 assert.ok(circular.includes('aria-label="1 → 2 → 3 → 1"'));
 const excluded=visualHtml(sieve('Prime cu 6',6,[2,3],'Rămân 1 și 5.'));
 assert.equal([...excluded.matchAll(/class="sieve-kept"/g)].length,2);
});

test('illustrated matrix examples give the stated determinants',()=>{
 const visuals=id=>lessons.find(l=>l.id===id).theory.map(([, ,visual])=>visual).filter(v=>v?.type==='matrices');
 assert.equal(determinant(visuals('det2')[0].items[0].rows),5n);
 for(const [index,expected] of [[0,2n],[1,3n]])assert.equal(determinant(visuals('max01').at(-1).items[index].rows),expected);
 const inverse=visuals('inversa-matrice'),a=inverse[1].items[0].rows,b=inverse[2].items[1].rows;
 for(const [left,right] of [[a,b],[b,a]])for(let r=0;r<2;r++)for(let c=0;c<2;c++)assert.equal(left[r].reduce((sum,x,k)=>sum+x*right[k][c],0),r===c?1:0);
});

test('completed exercises omit the independence and assistance labels in every mode',()=>{
 const ex=lessons[0].exercises[0];
 for(const mode of ['learn','exam','result'])for(const lastIndependent of [0,123]){
  const html=exerciseHtml(ex,{value:String(ex.answer),status:'correct',everCorrect:true,lastIndependent},mode);
  assert.ok(!html.includes('exercise-status'));
  assert.ok(!html.includes('✓ Independent'));
  assert.ok(!html.includes('✓ Cu ajutor'));
 }
});
