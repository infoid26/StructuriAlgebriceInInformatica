import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {chapters,lessons,exercises} from '../site/content.js';
import * as stateApi from '../site/state.js';
import * as mathApi from '../site/math-core.js';
import * as uiApi from '../site/ui.js';
import {lessonHtml,resolveLessonStep,lessonSteps} from '../site/lesson-view.js';
import {homeHtml} from '../site/home-view.js';
import {chooseQuestions} from '../site/exam-bank.js';
const source=readFileSync(new URL('../site/app.js',import.meta.url),'utf8').replace(/^import .*;\r?\n/gm,'');
const answer=ex=>Array.isArray(ex.answer)?ex.answer.length?ex.answer.join(','):'∅':String(ex.answer);
function solve(state,ex){
 const a=stateApi.attempt(state,ex.id);
 if(ex.kind==='proof'){a.value='Argument verificat.';a.reviewed=true;a.status='manual';}
 else{a.value=answer(ex);stateApi.recordGrade(state,ex.id,mathApi.grade(ex,a.value));}
}
function harness(ex,{saved,mode='learn'}={}){
 const lesson=lessons.find(l=>l.id===ex.lesson),step=lesson.theory.length+1+lesson.exercises.indexOf(ex);
 const state=saved||stateApi.blank();
 if(!saved)for(const previous of lesson.exercises){if(previous===ex)break;solve(state,previous);}
 if(mode==='exam')state.exam={status:'running',ids:[ex.id],answers:{},notes:{},start:Date.now(),end:Date.now()+60000,label:'Test'};
 const storage=new Map([[stateApi.STORAGE_KEY,JSON.stringify(state)]]),listeners={};
 function node(){return {hidden:false,disabled:false,checked:false,value:'',dataset:{},textContent:'',className:'',events:{},classList:{toggle(){}},setAttribute(){},focus(){this.focused=true;},addEventListener(name,fn){this.events[name]=fn;},fire(name){this.events[name]?.({target:this,currentTarget:this});}};}
 const next=node(),feedback=node(),status=node(),text=node(),check=ex.kind==='choice'||ex.kind==='proof'?null:node(),reviewed=node(),hint=node(),solution=node(),hintButton=node(),solutionButton=node(),note=node();
 text.value=state.attempts[ex.id]?.value||'';reviewed.checked=!!state.attempts[ex.id]?.reviewed;hint.hidden=true;solution.hidden=true;
 const radios=(ex.options||[]).map(option=>Object.assign(node(),{value:option.id,checked:state.attempts[ex.id]?.value===option.id,disabled:mode==='learn'&&stateApi.isExercisePassed(ex,state.attempts[ex.id])}));
 const article={dataset:{ex:ex.id,mode},querySelectorAll(selector){return selector==='input[type="radio"]'?radios:[];},querySelector(selector){
  if(selector==='input[type="radio"]:checked')return radios.find(r=>r.checked)||null;
  if(selector==='.text-answer')return ex.kind==='choice'?null:text;
  return ({'.feedback':feedback,'.exercise-status':status,'[data-action="check"]':check,'[data-action="reviewed"]':ex.kind==='proof'?reviewed:null,'[data-action="hint"]':hintButton,'[data-action="solution"]':solutionButton,'.hint':hint,'.solution':solution,'[data-note]':note})[selector]||null;
 }};
 let markup='';
 const main={get innerHTML(){return markup;},set innerHTML(value){markup=value;next.hidden=/id="lesson-continue"[^>]*\shidden/.test(value);},querySelectorAll(selector){return selector==='[data-ex]'?[article]:[];},querySelector(selector){return selector==='[data-ex]'||selector===`[data-ex="${ex.id}"]`?article:null;},focus(){}};
 const nodes=new Map([['main',main],['global-progress',node()],['save-status',node()],['toast',node()]]);
 const location={hash:mode==='exam'?'#exam':`#lesson/${lesson.id}/${step}`,protocol:'https:'};
 const context=vm.createContext({...stateApi,...mathApi,...uiApi,chapters,lessons,exercises,homeHtml,lessonView:lessonHtml,resolveLessonStep,chooseQuestions,
  editorDemoHtml:()=>'',bindEditorDemo(){},refreshEditorDemo(){},labHtml:()=>'',bindLab(){},upgradeEditors(){},loadMathLive(){},
  document:{getElementById:id=>id==='lesson-continue'?markup.includes('id="lesson-continue"')?next:null:nodes.get(id)||null,querySelectorAll:()=>[],addEventListener(){},hidden:false,title:''},
  window:{addEventListener:(name,fn)=>listeners[name]=fn,scrollTo(){}},location,
  localStorage:{getItem:key=>storage.get(key)??null,setItem:(key,value)=>storage.set(key,value)},setTimeout:()=>0,clearTimeout(){},setInterval:()=>0
 });
 vm.runInContext(source,context);
 assert.ok(markup.includes(`data-ex="${ex.id}"`));
 return {next,feedback,text,check,reviewed,radios,article,location,markup:()=>markup,state:()=>vm.runInContext('state',context),persisted:()=>JSON.parse(storage.get(stateApi.STORAGE_KEY)),
  select(value){const selected=radios.find(r=>r.value===value);assert.ok(selected);for(const radio of radios)radio.checked=radio===selected;selected.fire('change');}
 };
}
test('choice selection grades immediately, permits retries and locks the correct answer across reloads',()=>{
 const ex=exercises.find(e=>e.kind==='choice'),wrong=ex.options.find(o=>o.id!==ex.answer).id,flow=harness(ex),hash=flow.location.hash;
 assert.ok(!flow.markup().includes('data-action="check"'));assert.equal(flow.next.hidden,true);
 flow.select(wrong);
 assert.equal(flow.state().attempts[ex.id].status,'wrong');assert.equal(flow.next.hidden,true);assert.equal(flow.feedback.hidden,false);assert.ok(flow.radios.every(r=>!r.disabled));
 flow.select(String(ex.answer));
 assert.equal(flow.state().attempts[ex.id].status,'correct');assert.equal(flow.next.hidden,false);assert.ok(flow.radios.every(r=>r.disabled));assert.equal(flow.location.hash,hash);
 assert.equal(flow.persisted().attempts[ex.id].value,String(ex.answer));
 flow.select(wrong);
 assert.equal(flow.state().attempts[ex.id].value,String(ex.answer));
 const restored=harness(ex,{saved:flow.persisted()});assert.equal(restored.next.hidden,false);assert.ok(restored.radios.every(r=>r.disabled));assert.ok(restored.markup().includes('feedback correct'));
 assert.equal([...restored.markup().matchAll(/<input type="radio"[^>]*\sdisabled/g)].length,ex.options.length);
});
test('written answers require verification and editing a correct answer hides Continue again',()=>{
 const ex=exercises.find(e=>e.kind==='number'),flow=harness(ex);
 assert.ok(flow.markup().includes('data-action="check"'));assert.equal(flow.next.hidden,true);
 flow.text.value=answer(ex);flow.text.fire('input');assert.equal(flow.next.hidden,true);
 flow.check.fire('click');assert.equal(flow.next.hidden,false);
 flow.text.value='999999';flow.text.fire('input');assert.equal(flow.next.hidden,true);
 flow.check.fire('click');assert.equal(flow.state().attempts[ex.id].status,'wrong');assert.equal(flow.next.hidden,true);
 flow.text.value=answer(ex);flow.text.fire('input');flow.check.fire('click');assert.equal(flow.next.hidden,false);
});
test('lesson routes stop at the first unsolved exercise and unlock the summary only after every answer passes',()=>{
 const lesson=lessons[0],state=stateApi.blank(),offset=lesson.theory.length+1;
 assert.equal(resolveLessonStep(lesson,state,'99999'),offset);
 for(const [index,ex] of lesson.exercises.entries()){
  assert.equal(resolveLessonStep(lesson,state,'99999'),offset+index);solve(state,ex);
 }
 assert.equal(resolveLessonStep(lesson,state,'99999'),lessonSteps(lesson).length-1);
 const first=lesson.exercises[0];stateApi.answerChanged(state,first.id,'999999');assert.equal(resolveLessonStep(lesson,state,'99999'),offset);
});
test('proof exercises unlock Continue through manual review and relock when review is removed',()=>{
 const ex=exercises.find(e=>e.kind==='proof'),flow=harness(ex);
 assert.equal(flow.next.hidden,true);flow.reviewed.checked=true;flow.reviewed.fire('change');assert.equal(flow.next.hidden,false);
 flow.reviewed.checked=false;flow.reviewed.fire('change');assert.equal(flow.next.hidden,true);
});
test('exam choices remain editable and conceal grading until submission',()=>{
 const ex=exercises.find(e=>e.kind==='choice'),flow=harness(ex,{mode:'exam'}),wrong=ex.options.find(o=>o.id!==ex.answer).id;
 flow.select(String(ex.answer));assert.ok(!flow.state().attempts[ex.id]);assert.ok(flow.radios.every(r=>!r.disabled));assert.equal(flow.state().exam.answers[ex.id],String(ex.answer));
 flow.select(wrong);assert.equal(flow.state().exam.answers[ex.id],wrong);assert.ok(flow.radios.every(r=>!r.disabled));assert.ok(!flow.markup().includes('feedback correct'));
});
