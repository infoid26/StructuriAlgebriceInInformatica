import test from 'node:test';
import assert from 'node:assert/strict';
import {chapters,lessons,exercises} from '../site/content.js';
import {grade,parseNumber,formatR,determinant,permutation} from '../site/math-core.js';
import {chooseQuestions} from '../site/exam-bank.js';
import {blank,sanitize,recordGrade} from '../site/state.js';
import {exerciseHtml} from '../site/ui.js';
const byId=new Map(exercises.map(e=>[e.id,e]));
const chooseInput=e=>Array.isArray(e.answer)?e.answer.length?e.answer.join(','):'∅':String(e.answer);
test('algebra prerequisites, stable progress IDs and complete practice are preserved',()=>{
 assert.equal(lessons[0].id,'impartire-baze');assert.equal(lessons[7].id,'demonstratii-baze');assert.equal(lessons[8].id,'multimi');
 assert.equal(chapters[0].id,'baze');assert.ok(exercises.length>=800);
 for(const l of lessons){assert.ok(l.exercises.length>=15,l.id);assert.equal(new Set(l.exercises.map(e=>e.prompt)).size,l.exercises.length,l.id);assert.ok(l.exercises.some(e=>e.kind==='proof'),l.id);}
 for(const id of ['multimi-1','invers-1','parametri-1','max01-1'])assert.ok(byId.has(id));
 const state=blank();recordGrade(state,'invers-1',{status:'correct'},12345678);const imported=sanitize(JSON.parse(JSON.stringify(state)),new Set(exercises.map(e=>e.id)),new Set(lessons.map(l=>l.id)));
 assert.equal(imported.attempts['invers-1'].everCorrect,true);assert.equal(imported.attempts['invers-1'].lastIndependent,12345678);
});
test('fresh variants reject wrong answers and all feedback paths have explanations',()=>{
 for(const e of exercises){assert.ok(e.hint,e.id);assert.ok(e.steps.length>=1,e.id);if(e.kind==='proof'){assert.ok(e.rubric.length>=3);continue;}
  assert.equal(grade(e,chooseInput(e)).status,'correct',e.id);
  const wrong=e.kind==='choice'?e.options.find(o=>o.id!==e.answer).id:e.kind==='set'?'999999':e.kind==='tuple'?'999999,999999':e.kind==='poly'?'x^30+999999':'999999';
  assert.notEqual(grade(e,wrong).status,'correct',e.id);
 }
});
test('enumeration independently checks counting, modular equations and maximal permutation order',()=>{
 const count=exercises.filter(e=>e.lesson==='congruente'&&e.stage&&e.kind==='set');
 for(const e of count){const [,a,b,n]=e.prompt.match(/^Rezolvă (\d+)x≡(\d+) \(mod (\d+)\)/);const all=Array.from({length:Number(n)},(_,x)=>x).filter(x=>(Number(a)*x-Number(b))%Number(n)===0);assert.deepEqual(e.answer,all,e.id);}
 assert.equal(Number(byId.get('incluziune-excluziune-1').answer),Array.from({length:200},(_,i)=>i+1).filter(x=>x%2&&x%3&&x%5).length);
 for(let n=1;n<=12;n++){let count=0;for(let mask=0;mask<(1<<n);mask++)if(!(mask&(mask<<1)))count++;assert.equal(Number(byId.get('numarare-'+(n+2)).answer),count);}
 let max=0;function partitions(rest,min,parts){if(!rest){let lcm=1;for(const p of parts){let a=lcm,b=p;while(b)[a,b]=[b,a%b];lcm=lcm*p/a;}max=Math.max(max,lcm);return;}for(let i=min;i<=rest;i++)partitions(rest-i,i,[...parts,i]);}partitions(12,1,[]);assert.equal(max,60);
});
test('LaTeX and full unicode exponents are accepted without changing arithmetic meaning',()=>{
 for(const [text,expected] of [['2¹²','4096'],['3⁻²','1/9'],['2¹⁴⁹','713623846352979940529142984724747568191373312'],['\\dfrac{1}{2}+\\frac{1}{3}','5/6']])assert.equal(formatR(parseNumber(text)),expected,text);
 assert.equal(grade({kind:'set',answer:[-1,1]},'\\left\\{-1,1\\right\\}').status,'correct');
 assert.equal(grade({kind:'tuple',answer:['1/3','-1/2']},'\\left(\\frac{1}{3},-\\frac{1}{2}\\right)').status,'correct');
 assert.equal(grade({kind:'set',answer:[]},'\\emptyset').status,'correct');
 assert.equal(grade({kind:'number',answer:1},'\\frac{}{2}').status,'invalid');
});
test('mixed and foundation exams contain ten distinct independent tasks',()=>{
 for(const mode of ['mixed','foundations'])for(const r of [0,0.25,0.75,0.999]){
  const ids=chooseQuestions(exercises,chapters,mode,()=>r);assert.equal(ids.length,10);assert.equal(new Set(ids).size,10);
  const questions=ids.map(id=>byId.get(id));assert.ok(questions.every(e=>e.kind!=='proof'));
  if(mode==='foundations')assert.ok(questions.every(e=>e.chapter==='baze'));else assert.equal(new Set(questions.map(e=>e.chapter)).size,chapters.length);
 }
});
test('math controls, readonly exam results and concealed solutions remain separate',()=>{
 const ex=byId.get('calcul-fractii-1');const learn=exerciseHtml(ex,{});assert.ok(learn.includes('data-insert="frac"'));assert.ok(learn.includes('data-editor-mode="text"'));
 const exam=exerciseHtml(ex,{},'exam');assert.ok(!exam.includes('data-action="hint"'));assert.ok(exam.includes('class="solution" hidden'));
 const locked=exerciseHtml(ex,{value:'5/6'},'result');assert.ok(locked.includes('readonly'));assert.ok(!locked.includes('data-insert='));
 const proof=exerciseHtml(exercises.find(e=>e.kind==='proof'),{});assert.ok(!proof.includes('data-editor='));assert.ok(proof.includes('data-action="reviewed"'));assert.ok(proof.includes('Criterii de verificare'));assert.ok(!proof.includes('data-action="check"'));
});



