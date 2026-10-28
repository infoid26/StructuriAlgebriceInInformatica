import test from 'node:test';
import assert from 'node:assert/strict';
import {lessons,chapters,exercises} from '../site/content.js';
import {blank,attempt,recordGrade} from '../site/state.js';
import {lessonSteps,resolveLessonStep,lessonHtml} from '../site/lesson-view.js';
import {homeHtml} from '../site/home-view.js';
import {esc} from '../site/ui.js';
const lessonMap=new Map(lessons.map(l=>[l.id,l]));
test('Lesson pages retain every explanation, example and exercise across reachable steps',()=>{
 const seen=[];
 for(const [index,lesson] of lessons.entries()){
  const state=blank(),steps=lessonSteps(lesson);
  for(const [step,item] of steps.entries()){
   const html=lessonHtml({lesson,index,total:lessons.length,chapter:chapters.find(c=>c.id===lesson.chapter),state,step,nextLesson:lessons[index+1],lessonMap,coursePercent:0});
   assert.ok(html.indexOf('class="lesson-controls"')>html.lastIndexOf('</article>'));
   assert.ok(html.includes(step?`href="#lesson/${lesson.id}/${step-1}"`:'href="#home"'));
   if(item.kind==='theory')assert.ok(html.includes(esc(item.text)));
   if(item.kind==='worked')for(const text of lesson.worked.steps)assert.ok(html.includes(esc(text)));
   if(item.kind==='exercise'){
    seen.push(item.exercise.id);assert.ok(html.includes('data-ex="'+item.exercise.id+'"'));
    assert.ok(!html.includes('class="lesson-body"'));
   }else assert.ok(!html.includes('data-ex='));
   if(step<steps.length-1)assert.ok(html.includes(`href="#lesson/${lesson.id}/${step+1}"`));
  }
 }
 assert.deepEqual(seen,exercises.map(ex=>ex.id));
});
test('existing answers resume at the pending exercise and reading alone never completes a lesson',()=>{
 const lesson=lessons[0],state=blank(),offset=lesson.theory.length+1;
 assert.equal(resolveLessonStep(lesson,state),0);
 attempt(state,lesson.exercises[0].id).value='saved draft';
 assert.equal(resolveLessonStep(lesson,state),offset);
 attempt(state,lesson.exercises[0].id).value=String(lesson.exercises[0].answer);
 recordGrade(state,lesson.exercises[0].id,{status:'correct'});
 assert.equal(resolveLessonStep(lesson,state),offset+1);
 assert.equal(state.attempts[lesson.exercises[0].id].value,String(lesson.exercises[0].answer));
 assert.equal(resolveLessonStep(lesson,state,'0'),0);
 assert.equal(resolveLessonStep(lesson,state,'99999'),offset+1);
 const html=lessonHtml({lesson,index:0,total:lessons.length,chapter:chapters[0],state,step:lessonSteps(lesson).length-1,nextLesson:lessons[1],lessonMap,coursePercent:0});
 assert.ok(html.includes('Lecție incompletă'));assert.ok(html.includes('href="#lesson/'+lessons[1].id+'"'));
});
test('home includes course notes, path units and footer context without manual progress controls',()=>{
 const open=new Map([[chapters[0].id,false]]),html=homeHtml(blank(),open);
 assert.ok(html.includes('Ce știm despre evaluare'));
 assert.ok(!html.includes('href="#sources"'));assert.ok(html.includes('class="notice"'));assert.ok(html.includes('class="unit-divider"'));
 assert.ok(html.includes('CONTINUĂ AICI'));assert.ok(html.includes('Traseul capitolului'));
 assert.ok(!html.includes('id="export"'));assert.ok(!html.includes('id="import"'));
 assert.ok(html.includes('data-path="'+chapters[0].id+'" ><summary>'));
});
