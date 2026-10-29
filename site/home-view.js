import {chapters,lessons,exercises} from './content.js';
import {isComplete,isIndependent} from './state.js';
import {esc} from './ui.js';
export function homeHtml(state,chapterOpen){
 const next=lessons.find(l=>!isComplete(state,l))||lessons[0],started=Object.keys(state.attempts).length>0;
 return `<section id="acasa" class="dashboard-view"><div class="welcome-layout"><div class="welcome-copy"><h1>Structuri algebrice în informatică</h1><p class="lead">Materia de algebră, explicată pas cu pas: termeni lămuriți înainte de formule, exemple vizuale și rezolvări cu pașii intermediari.</p><a href="#lesson/${next.id}" class="button start-learning">${started?'Continuă lecția':'Începe cu prima lecție'} →</a></div><div class="algebra-hero" aria-hidden="true"><small>DIN CALCUL ÎN REZULTAT</small><div class="algebra-mini-window"><div class="algebra-window-dots">● ● ●</div><pre><code><span class="algebra-demo-number">2</span>x + <span class="algebra-demo-number">3</span> = <span class="algebra-demo-number">11</span>

<span class="algebra-demo-number">2</span>x = <span class="algebra-demo-number">8</span></code></pre></div><div class="algebra-mini-result"><span>REZULTAT</span><strong>x = 4</strong></div></div></div>
 <div class="section-heading"><h2>Lecții și capitole</h2><span>${chapters.length} capitole · ${lessons.length} lecții · ${exercises.length} exerciții</span></div>
 <div class="course-shortcuts"><details class="resource-menu"><summary>Resurse</summary><div class="resource-links"><a href="#exam">Simulare</a><a href="#review">Recapitulare</a><a href="#editor">Editor matematic</a><a href="#lab">Atelier de algebră</a><a href="#formulas">Formular și simboluri</a></div></details></div>
 <div class="unified-map"><div id="course-lesson-list">${chapters.map((chapter,index)=>{
  const group=lessons.filter(l=>l.chapter===chapter.id),completed=group.filter(l=>isComplete(state,l)).length;
  const pending=group.find(l=>!isComplete(state,l))||group[0],current=group.some(l=>l.id===next.id);
  const open=chapterOpen.has(chapter.id)?chapterOpen.get(chapter.id):current;
  return `<article class="path-chapter ${current?'current-chapter':''}"><header class="chapter-banner"><div class="chapter-number">${String(index+1).padStart(2,'0')}</div><div><div class="eyebrow">CAPITOLUL ${index+1}</div><h3>${esc(chapter.title)}</h3><p>${esc(chapter.subtitle)}</p><small>${completed} / ${group.length} lecții finalizate</small><progress aria-label="Progres ${esc(chapter.title)}" max="${group.length}" value="${completed}"></progress></div><a class="button" href="#lesson/${pending.id}">${completed===group.length?'Recapitulează':'Continuă'} →</a></header><details data-path="${chapter.id}" ${open?'open':''}><summary>Traseul capitolului <span>${group.length} lecții</span></summary><div class="unit-path">${group.map((lesson,i)=>{
   const done=isComplete(state,lesson),active=lesson===pending&&!done;
   return `${i%5===0?`<div class="unit-divider"><span>UNITATEA ${Math.floor(i/5)+1}</span><strong>${esc(lesson.title)}</strong></div>`:''}<a class="path-node ${done?'path-done':active?'path-current':'path-future'}" href="#lesson/${lesson.id}" ${active?'aria-current="step"':''}><span class="node-bubble" aria-hidden="true">${done?'✓':i+1}</span><span class="node-label">${esc(lesson.title)}<small>${lesson.exercises.length} exerciții${isIndependent(state,lesson)?' · rezolvate independent':' · explicații și exemple'}</small></span>${active?'<span class="start-tag">CONTINUĂ AICI</span>':''}</a>`;
  }).join('')}</div></details></article>`;
 }).join('')}</div></div>
 <aside class="notice">Material de pregătire pentru INFO ID 26, construit după resursele de studiu din 2025. Traseul începe cu grupuri și clase de resturi. Notațiile și metodele sunt explicate în contextul problemelor.</aside>
 <details class="notice"><summary>Ce știm despre evaluare</summary><p>Cursul folosește materia din 2025. Simulările sunt pentru antrenament; formatul și regulile examenului curent trebuie confirmate cu cadrul didactic.</p></details></section>`;
}
