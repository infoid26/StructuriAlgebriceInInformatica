import {homeHtml} from './home-view.js';
import {lessonHtml as lessonView,resolveLessonStep} from './lesson-view.js';
import './account.js';
import {chooseQuestions} from './exam-bank.js';
import {editorDemoHtml,bindEditorDemo,refreshEditorDemo} from './editor-demo.js';
import {chapters,lessons,exercises} from './content.js';
import {grade} from './math-core.js';
import {STORAGE_KEY,blank,sanitize,attempt,answerChanged,recordGrade,freshAttempt,isComplete,isIndependent,dueIds,startExam,expireExam,isExercisePassed} from './state.js';
import {esc,stepsHtml,exerciseHtml,upgradeEditors,loadMathLive} from './ui.js';
import {labHtml,bindLab} from './lab.js';
const main=document.getElementById('main');
const byId=new Map(exercises.map(e=>[e.id,e]));
const chapterOpen=new Map();
const lessonMap=new Map(lessons.map(l=>[l.id,l])),chapterMap=new Map(chapters.map(c=>[c.id,c]));
let accountSync=null;
let state=blank(),storageWorks=true,loadWarning='',practiceChapter='all',practiceKind='all',practiceStatus='all',practiceId=null,mathStatus='loading';
try{const saved=localStorage.getItem(STORAGE_KEY);if(saved)state=sanitize(JSON.parse(saved),new Set(byId.keys()),new Set(lessonMap.keys()));}catch{try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}catch{storageWorks=false;}loadWarning='Progresul anterior nu a putut fi citit. Poți importa o copie exportată anterior.';}
let toastTimer;
function toast(text){const el=document.getElementById('toast');el.textContent=text;el.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.hidden=true,5000);}
function save(){
 if(accountSync)storageWorks=accountSync.save();
 else try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));storageWorks=true;}catch{storageWorks=false;}
 document.getElementById('save-status').textContent=storageWorks?'Salvare automată locală':'Salvarea nu este disponibilă — exportă progresul';
}
function updateStats(){
 const done=exercises.filter(e=>e.kind==='proof'?state.attempts[e.id]?.reviewed:state.attempts[e.id]?.everCorrect).length;
 const percent=Math.floor(done/exercises.length*100),progress=document.getElementById('total-progress');
 if(progress){progress.max=100;progress.value=percent;progress.setAttribute('aria-label',`Progres total: ${done} din ${exercises.length} exerciții`);}
 document.getElementById('global-progress').textContent=percent+'%';
 const dueCounter=document.getElementById('due-count');if(dueCounter)dueCounter.textContent=dueIds(state,exercises).length;
 document.getElementById('save-status').textContent=storageWorks?'Salvare automată locală':'Salvarea nu este disponibilă — exportă progresul';
}
function pageHeading(eyebrow,title,description){return `<div class="page-heading"><div class="eyebrow">${eyebrow}</div><h1>${title}</h1><p class="lead">${description}</p></div>`;}
function home(){return homeHtml(state,chapterOpen);}
function lessonHtml(id,requested){
 const lesson=lessonMap.get(id);
 if(!lesson)return pageHeading('LECȚIE NEGĂSITĂ','Acest pas nu există.','<a href="#home">Revino la lecții.</a>');
 const step=resolveLessonStep(lesson,state,requested),index=lessons.indexOf(lesson);
 if(step>=lesson.theory.length+1&&!state.read[id]){state.read[id]=true;save();}
 const done=exercises.filter(ex=>ex.kind==='proof'?state.attempts[ex.id]?.reviewed:state.attempts[ex.id]?.everCorrect).length;
 return lessonView({lesson,index,total:lessons.length,chapter:chapterMap.get(lesson.chapter),state,step,nextLesson:lessons[index+1],lessonMap,coursePercent:Math.floor(done/exercises.length*100)});
}
function editorNotice(){return ''; }
function candidateExercises(review=false){const due=new Set(dueIds(state,exercises));return exercises.filter(e=>(!review||due.has(e.id))&&(practiceChapter==='all'||e.chapter===practiceChapter)&&(practiceKind==='all'||(practiceKind==='proof'?e.kind==='proof':e.kind!=='proof'))&&(practiceStatus==='all'||(practiceStatus==='unsolved'?!(e.kind==='proof'?state.attempts[e.id]?.reviewed:state.attempts[e.id]?.everCorrect):practiceStatus==='assisted'?(state.attempts[e.id]?.everCorrect&&!state.attempts[e.id]?.lastIndependent):['wrong','invalid'].includes(state.attempts[e.id]?.status))));}
function practiceHtml(review=false){const candidates=candidateExercises(review);if(!candidates.some(e=>e.id===practiceId))practiceId=candidates[0]?.id||null;const ex=byId.get(practiceId);return pageHeading(review?'REPETIȚIE DISTRIBUITĂ':'DIN IDEE ÎN REZOLVARE',review?'Revino când merită.':'Antrenament, în ritmul tău.',review?'După o reușită fără ajutor, exercițiul revine după 1, 3, 7 și 14 zile. Intervalele sunt un program de practică, nu o măsurătoare a notei la examen.':'Alege un capitol, încearcă o problemă și verifică rezultatul. Pentru pașii pe care nu îi poți justifica, întoarce-te la lecție.')+`<div class="filters"><label class="field">Capitol<select id="practice-chapter"><option value="all">Toate capitolele</option>${chapters.map(c=>`<option value="${c.id}" ${practiceChapter===c.id?'selected':''}>${esc(c.title)}</option>`).join('')}</select></label><label class="field">Tip<select id="practice-kind"><option value="all">Toate tipurile</option><option value="exact" ${practiceKind==='exact'?'selected':''}>Răspuns verificabil</option><option value="proof" ${practiceKind==='proof'?'selected':''}>Demonstrație</option></select></label><label class="field">Stare<select id="practice-status">${[['all','Toate'],['unsolved','Încă nerezolvate'],['assisted','Rezolvate cu ajutor'],['mistakes','Greșeli recente']].map(([v,t])=>`<option value="${v}" ${v===practiceStatus?'selected':''}>${t}</option>`).join('')}</select></label><span class="filter-count">${candidates.length} exerciții</span></div>${ex?`<div class="lesson">${editorNotice()}<p class="compact"><a href="#lesson/${ex.lesson}">Revino la lecția „${esc(lessonMap.get(ex.lesson).title)}” →</a></p>${exerciseHtml(ex,attempt(state,ex.id))}<div class="actions"><button class="btn primary" id="next-practice">Un alt exercițiu →</button><button class="btn ghost" id="fresh-practice">Reîncearcă fără ajutor</button></div><p class="muted compact" style="margin-top:15px">O reușită independentă avansează programul cel mult o dată în 24 de ore.</p></div>`:`<div class="empty">${review?'Nu ai exerciții scadente pentru aceste filtre. Poți continua antrenamentul sau lecțiile.':'Nu sunt exerciții pentru filtrele alese.'}<p><a href="#home">Revino la traseu</a></p></div>`}`;}
function examHtml(){const ex=state.exam;
 if(!ex)return pageHeading('ANTRENAMENT','Simulare','Exerciții din curs, fără indicii în timpul probei. Materialele de studiu sunt din 2025.')+`<div class="panel exam-setup"><div class="filters"><label class="field">Conținut<select id="exam-source"><option value="mixed">Toate capitolele</option><option value="foundations">Clase de resturi și inverse</option></select></label><label class="field">Timp de lucru<select id="exam-duration"><option value="30">30 de minute</option><option value="60" selected>60 de minute</option><option value="90">90 de minute</option></select></label></div><p>10 cerințe. Timpul și răspunsurile se păstrează la reîncărcare; rezolvările apar după predare.</p><button class="btn primary" id="exam-start">Începe simularea →</button><p class="muted compact exam-note-label">Probă de antrenament, fără punctaj oficial.</p></div>`;
 const running=ex.status==='running',questions=ex.ids.map(id=>byId.get(id));
 const good=questions.filter(q=>grade(q,ex.answers[q.id]||'').status==='correct').length;
 return pageHeading('SIMULARE',running?'Rezolvă și justifică pașii.':'Proba s-a încheiat.',running?'Răspunsurile se salvează automat.':'Compară rezolvările și revino la lecțiile care au fost dificile.')+
 (running?`<div class="exam-top"><div><small>TIMP RĂMAS</small><div class="timer" id="timer">—</div></div><small id="exam-filled">Răspunsuri salvate</small><button class="btn primary" id="exam-submit">Predă lucrarea</button></div>`:`<div class="panel"><div class="score">${good} / ${questions.length}</div><p>răspunsuri finale corecte</p><p class="muted compact">Justificările se verifică după pașii model. Acest rezultat nu este o notă oficială.</p><div class="actions"><button class="btn primary" id="exam-new">O nouă simulare</button><a class="btn ghost" href="#practice">Exersează</a></div></div>`)+
 `<div class="lesson">${running?editorNotice():''}${questions.map(q=>exerciseHtml(q,{value:ex.answers[q.id]||''},running?'exam':'result')+(!running?`<div class="panel compact"><strong>Justificarea ta</strong><p class="saved-note">${esc(ex.notes[q.id]||'Nu ai adăugat o justificare.')}</p></div>`:'')).join('')}</div>`;
}
function formulasHtml(){const formulas=[['Congruență','a≡b (mod n) ⇔ n | (a−b)','n este întreg pozitiv; reprezentant canonic 0,…,n−1.'],['Invers modular','ax≡1 (mod n) ⇔ x≡a⁻¹','Există dacă și numai dacă gcd(a,n)=1.'],['Ecuație liniară modulară','ax≡b (mod n)','Cu d=gcd(a,n), există soluții exact când d | b; sunt d clase modulo n.'],['Ordin aditiv','ord([a])=n/gcd(a,n)','În grupul (ℤₙ,+).'],['Ordin multiplicativ','ord(a)=min{k>0:aᵏ≡1 (mod n)}','a∈U(ℤₙ); ordinul divide φ(n).'],['Euler','a^φ(n)≡1 (mod n)','gcd(a,n)=1. φ(n)=n∏(1−1/p), p prim distinct care divide n.'],['Fermat','a^(p−1)≡1 (mod p)','p prim și p∤a.'],['Wilson','(p−1)!≡−1 (mod p)','p prim.'],['Ordinul unei puteri','ord(gᵏ)=ord(g)/gcd(ord(g),k)','g are ordin finit.'],['Permutări','ord(σ)=CMMMC(lungimilor ciclurilor)','Ciclurile trebuie să fie disjuncte.'],['Signatură','sgn(σ)=(−1)^m','m=numărul inversiunilor; un ciclu de lungime k are semnul (−1)^(k−1).'],['Lagrange','|G|=[G:H]·|H|','G finit și H≤G; ord(g) divide |G|.'],['Gradul 2','x=(−b±√Δ)·(2a)⁻¹; Δ=b²−4ac','În ℤₚ, p prim impar, a≠0; Δ trebuie să aibă rădăcină în corp.'],['Viète, gradul 2','r+s=−b/a; rs=c/a','r,s rădăcini cu multiplicitate ale lui ax²+bx+c.'],['Determinant 2×2','det A=ad−bc','Liniile sunt (a,b),(c,d).'],['Cramer','xⱼ=det Aⱼ/det A','A pătratică peste un corp și det A≠0.'],['Compatibilitate','rang A=rang[A|b]','Sisteme liniare peste un corp. Numărul parametrilor liberi: n−rang A.'],['Maxim 0/1','|det A|≤(n+1)^((n+1)/2)/2ⁿ','Bordare cu o matrice ±1 și inegalitatea Hadamard. Pentru n=3: maxim 2; n=4: maxim 3.']];return pageHeading('REFERINȚĂ RAPIDĂ','O formulă are și ipoteze.','Folosește această pagină după ce ai înțeles lecția. Înainte să aplici o teoremă, verifică în ce structură lucrezi.')+`<div class="panel"><h2>Simbolurile pe care le întâlnești</h2><div class="table-wrap"><table><thead><tr><th>Simbol</th><th>Cum îl citești</th></tr></thead><tbody>${[['∈','este element al'],['⊆','este submulțime a'],['∀ / ∃','pentru orice / există'],['|A|','cardinalul mulțimii A'],['d | a','d divide a'],['gcd / CMDC','cel mai mare divizor comun'],['lcm / CMMMC','cel mai mic multiplu comun'],['ℤₙ','inelul claselor de resturi modulo n'],['U(ℤₙ)','grupul unităților, cu înmulțirea'],['Sₙ','grupul permutărilor a n elemente'],['H≤G / H◁G','subgrup / subgrup normal'],['G/H','grupul factor, dacă H este normal']].map(([s,t])=>`<tr><td class="symbol">${s}</td><td>${t}</td></tr>`).join('')}</tbody></table></div></div><div class="details-list">${formulas.map(([title,formula,conditions])=>`<details class="panel"><summary>${title}</summary><div class="formula">${formula}</div><p>${conditions}</p></details>`).join('')}</div>`;}
function inputValue(article){const math=article.querySelector('math-field');if(math)return math.value;const checked=article.querySelector('input[type="radio"]:checked');if(checked)return checked.value;return article.querySelector('.text-answer')?.value||'';}
function updateLessonNavigation(){
 const next=document.getElementById('lesson-continue');
 const article=main.querySelector('[data-ex]');
 if(next&&article?.dataset.mode==='learn')next.hidden=!isExercisePassed(byId.get(article.dataset.ex),state.attempts[article.dataset.ex]);
}
function changeAnswer(id,value){
 const article=main.querySelector(`[data-ex="${id}"]`),ex=byId.get(id);
 if(article?.dataset.mode==='exam'){
  if(state.exam?.status==='running'){if(expireExam(state)){save();render();return;}state.exam.answers[id]=value.slice(0,2000);save();}return;
 }
 if(article?.dataset.mode==='result'||ex?.kind==='choice'&&isExercisePassed(ex,state.attempts[id]))return;
 answerChanged(state,id,value);
 if(article){article.dataset.status='';const feedback=article.querySelector('.feedback');if(feedback)feedback.hidden=true;}
 save();updateLessonNavigation();
}
function checkExercise(article,ex){
 const id=ex.id;
 if(ex.kind==='choice'&&isExercisePassed(ex,state.attempts[id]))return;
 answerChanged(state,id,inputValue(article));
 const result=grade(ex,attempt(state,id).value),a=recordGrade(state,id,result);
 save();updateStats();updateLessonNavigation();
 const feedback=article.querySelector('.feedback');
 article.dataset.status=result.status;feedback.hidden=false;feedback.className='feedback '+result.status;
 feedback.textContent=result.message+(result.status==='correct'?(a.hints||a.revealed?' Rezolvat cu ajutor; revino pentru o încercare independentă.':' Ai rezolvat fără indicii în această încercare.'):'');
 article.querySelector('.exercise-status').textContent=a.lastIndependent?'✓ Independent':a.everCorrect?'✓ Cu ajutor':'';
 if(ex.kind==='choice'&&result.status==='correct')for(const radio of article.querySelectorAll('input[type="radio"]'))radio.disabled=true;
 if(result.status==='correct')document.getElementById('lesson-continue')?.focus({preventScroll:true});
}
function bindExercises(){
 for(const article of main.querySelectorAll('[data-ex]')){
  const id=article.dataset.ex,ex=byId.get(id),mode=article.dataset.mode;
  if(mode==='result')continue;
  article.querySelector('.text-answer')?.addEventListener('input',e=>changeAnswer(id,e.target.value));
  for(const radio of article.querySelectorAll('input[type="radio"]'))radio.addEventListener('change',()=>{
   if(mode==='exam')changeAnswer(id,inputValue(article));else checkExercise(article,ex);
  });
  if(mode==='exam'){
   const note=article.querySelector('[data-note]');note.value=state.exam?.notes[id]||'';
   note.addEventListener('input',()=>{if(state.exam?.status==='running'&&!expireExam(state)){state.exam.notes[id]=note.value.slice(0,8000);save();}else{save();render();}});continue;
  }
  article.querySelector('[data-action="check"]')?.addEventListener('click',()=>checkExercise(article,ex));
  article.querySelector('[data-action="hint"]')?.addEventListener('click',event=>{
   const panel=article.querySelector('.hint');panel.hidden=!panel.hidden;event.currentTarget.setAttribute('aria-expanded',String(!panel.hidden));
   if(!panel.hidden){attempt(state,id).hints=true;save();}
  });
  article.querySelector('[data-action="solution"]')?.addEventListener('click',event=>{
   const panel=article.querySelector('.solution');panel.hidden=!panel.hidden;event.currentTarget.setAttribute('aria-expanded',String(!panel.hidden));
   if(!panel.hidden){attempt(state,id).revealed=true;save();}
  });
  article.querySelector('[data-action="reviewed"]')?.addEventListener('change',e=>{
   const a=attempt(state,id);a.reviewed=e.target.checked;a.status='manual';save();updateStats();updateLessonNavigation();
  });
 }
 upgradeEditors(main,changeAnswer,byId);
}
function bindCommon(route){
 main.querySelectorAll('[data-path]').forEach(details=>details.addEventListener('toggle',()=>chapterOpen.set(details.dataset.path,details.open)));
 document.querySelectorAll('.resource-menu').forEach(menu=>menu.removeAttribute('open'));document.querySelectorAll('[data-nav]').forEach(a=>a.classList.toggle('active',a.dataset.nav===(route==='lesson'?'home':route)));
 for(const [id,setter] of [['practice-chapter',v=>practiceChapter=v],['practice-kind',v=>practiceKind=v],['practice-status',v=>practiceStatus=v]])document.getElementById(id)?.addEventListener('change',e=>{setter(e.target.value);practiceId=null;render(false);});document.getElementById('next-practice')?.addEventListener('click',()=>{const list=candidateExercises(route==='review').filter(e=>e.id!==practiceId);if(!list.length){toast('Nu există alt exercițiu pentru aceste filtre.');return;}practiceId=list[Math.floor(Math.random()*list.length)].id;freshAttempt(state,practiceId);save();render(false);});document.getElementById('fresh-practice')?.addEventListener('click',()=>{freshAttempt(state,practiceId);save();render(false);});
 document.getElementById('exam-start')?.addEventListener('click',()=>{const mode=document.getElementById('exam-source').value;const ids=chooseQuestions(exercises,chapters,mode);const label=mode==='foundations'?'Clase de resturi și inverse':'Probă variată';state.exam=startExam(ids,Number(document.getElementById('exam-duration').value),label);save();render();});document.getElementById('exam-submit')?.addEventListener('click',()=>{if(state.exam?.status==='running'){state.exam.status='submitted';save();render();}});document.getElementById('exam-new')?.addEventListener('click',()=>{state.exam=null;save();render();});if(route==='lab')bindLab(()=>render(false));if(route==='editor')bindEditorDemo(main,()=>render(false));bindExercises();}
function routeNow(){const [name,id,step]=(location.hash.slice(1)||'home').split('/');return [name,id,step];}
function tick(){if(expireExam(state)){save();if(routeNow()[0]==='exam')render(false);}const timer=document.getElementById('timer');if(timer&&state.exam){const secs=Math.max(0,Math.ceil((state.exam.end-Date.now())/1000));timer.textContent=`${Math.floor(secs/60).toString().padStart(2,'0')}:${(secs%60).toString().padStart(2,'0')}`;timer.classList.toggle('urgent',secs<300);const filled=state.exam.ids.filter(id=>state.exam.answers[id]?.trim()).length;document.getElementById('exam-filled').textContent=filled+'/'+state.exam.ids.length+' răspunsuri';}}
function render(scroll=true){if(expireExam(state))save();const [route,id,step]=routeNow();const pages={home,practice:()=>practiceHtml(false),review:()=>practiceHtml(true),lesson:()=>lessonHtml(id,step),exam:examHtml,lab:labHtml,formulas:formulasHtml,editor:editorDemoHtml};main.innerHTML=(pages[route]||home)();document.title=(route==='lesson'&&lessonMap.has(id)?lessonMap.get(id).title+' · ':'')+'Structuri algebrice · Curs interactiv';updateStats();bindCommon(pages[route]?route:'home');tick();if(scroll)window.scrollTo({top:0,behavior:'instant'});}
window.addEventListener('hashchange',()=>{render();main.focus({preventScroll:true});});window.addEventListener('pageshow',()=>{if(expireExam(state)){save();render(false);}});document.addEventListener('visibilitychange',()=>{if(!document.hidden){if(expireExam(state)){save();render(false);}updateStats();}});render();if(loadWarning)toast(loadWarning);setInterval(tick,1000);
loadMathLive(ready=>{mathStatus=ready?'ready':'failed';upgradeEditors(main,changeAnswer,byId);if(routeNow()[0]==='editor')refreshEditorDemo(main);for(const p of main.querySelectorAll('[data-math-status]')){p.innerHTML=editorNotice().replace(/^<p[^>]*>|<\/p>$/g,'');}});








if(document.getElementById('account-controls')){
 accountSync=window.SAI_ACCOUNTS.create({
  storageKey:STORAGE_KEY,getState:()=>state,
  setState:value=>{state=sanitize(value,new Set(byId.keys()),new Set(lessonMap.keys()));expireExam(state);},
  normalize:value=>sanitize(value,new Set(byId.keys()),new Set(lessonMap.keys())),
  refresh:()=>render(false),
  download:(name,content,type)=>{const url=URL.createObjectURL(new Blob([content],{type}));const link=document.createElement('a');link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 });
 void accountSync.start();
}






