import {esc,stepsHtml,exerciseHtml} from './ui.js';
import {isComplete,isExercisePassed} from './state.js';
export function lessonSteps(lesson){
 return [...lesson.theory.map(([,text])=>({kind:'theory',text})),{kind:'worked'},...lesson.exercises.map((exercise,index)=>({kind:'exercise',exercise,index})),{kind:'finish'}];
}
export function resolveLessonStep(lesson,state,value){
 const steps=lessonSteps(lesson),offset=lesson.theory.length+1;
 const pending=lesson.exercises.findIndex(ex=>!isExercisePassed(ex,state.attempts[ex.id]));
 const limit=pending<0?steps.length-1:offset+pending;
 if(typeof value==='string'&&/^\d{1,5}$/.test(value))return Math.min(Number(value),limit);
 if(!state.read[lesson.id]&&!lesson.exercises.some(ex=>{const a=state.attempts[ex.id];return a&&(a.value||a.everCorrect||a.reviewed||a.hints||a.revealed);}))return 0;
 return limit;
}
export function lessonHtml({lesson,index,total,chapter,state,step,nextLesson,lessonMap,coursePercent}){
 const steps=lessonSteps(lesson),item=steps[step],last=step===steps.length-1;
 const canContinue=item.kind==='exercise'?isExercisePassed(item.exercise,state.attempts[item.exercise.id]):!last||lesson.exercises.every(ex=>isExercisePassed(ex,state.attempts[ex.id]));
 const route=position=>`#lesson/${lesson.id}/${position}`;
 const previous=step?route(step-1):'#home';
 const next=last?(nextLesson?`#lesson/${nextLesson.id}`:'#home'):route(step+1);
 const kind={theory:'ÎNȚELEGE',worked:'EXEMPLU REZOLVAT',exercise:'EXERSEAZĂ',finish:'RECAPITULARE'}[item.kind];
 let body='';
 if(item.kind==='theory'){
  const prerequisites=step===0&&lesson.prerequisites.length?`<p class="lesson-prerequisite">Pasul anterior: ${lesson.prerequisites.map(id=>`<a href="#lesson/${id}">${esc(lessonMap.get(id).title)}</a>`).join(' · ')}</p>`:'';
  body=`${step===0?`<p class="goal">${esc(lesson.goal)}</p>${prerequisites}`:''}<div class="lesson-body"><p>${esc(item.text)}</p></div>`;
 }else if(item.kind==='worked'){
  body=`<h2>Exemplu rezolvat</h2><p>${esc(lesson.worked.prompt)}</p>${stepsHtml(lesson.worked.steps)}<p class="common-mistake"><strong>De reținut:</strong> ${esc(lesson.trap)}</p>`;
 }else if(item.kind==='exercise'){
  body=`<div class="question-kicker">EXERCIȚIUL ${item.index+1} DIN ${lesson.exercises.length}</div>${exerciseHtml(item.exercise,state.attempts[item.exercise.id]||{})}`;
 }else{
  body=`<h2>${isComplete(state,lesson)?'Lecție finalizată':'Lecție incompletă'}</h2><div class="lesson-result-progress"><strong>${coursePercent}%</strong><span>din curs</span><progress max="100" value="${coursePercent}" aria-label="Progresul cursului"></progress></div>`;
 }
 return `<div class="lesson"><a class="text-link back-link" href="#home">← Lecții</a><div class="lesson-player ${item.kind==='exercise'?'has-editor':''}"><div class="lesson-top"><div><div class="eyebrow">${esc(chapter.title)} · LECȚIA ${index+1}/${total} · ${kind}</div><h1 class="player-title">${esc(lesson.title)}</h1></div><span class="lesson-step-counter">${step+1} / ${steps.length}</span></div><div class="lesson-progress" role="progressbar" aria-label="Parcurgerea lecției" aria-valuemin="0" aria-valuemax="${steps.length}" aria-valuenow="${step+1}"><span style="width:${(step+1)/steps.length*100}%"></span></div><article class="lesson-screen">${body}</article><div class="lesson-controls"><a class="secondary step-back" href="${previous}">← Înapoi</a><a id="lesson-continue" class="button" href="${next}" ${canContinue?'': 'hidden'}>${last?(nextLesson?'Lecția următoare':'Înapoi la traseu'):'Continuă'} →</a></div></div></div>`;
}

