import {grade} from './math-core.js';
import {isExercisePassed} from './state.js';
export const MATHLIVE_VERSION='0.111.1';
export const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const stepsHtml=steps=>`<ol class="steps">${steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol>`;
export function editorMarkup(id,value='',readOnly=false,kind='number',help=''){
 const templates=[['frac','a/b','Inserează o fracție'],['power','xⁿ','Inserează o putere'],['paren','( )','Inserează paranteze']];
 if(kind==='poly')templates.push(['x','x','Inserează necunoscuta x']);
 if(kind==='set')templates.push(['set','{ }','Inserează o mulțime'],['empty','∅','Inserează mulțimea vidă']);
 if(kind==='set'||kind==='tuple')templates.push(['comma',',','Separă două valori']);
 return `<div class="answer-host" data-editor="${esc(id)}" data-kind="${kind}" data-preferred="text">${!readOnly?`<div class="editor-controls"><div class="editor-modes" aria-label="Modul de introducere"><button type="button" data-editor-mode="visual" aria-pressed="false" disabled>Vizual</button><button type="button" data-editor-mode="text" aria-pressed="true">Text</button></div></div><div class="math-toolbar" role="group" aria-label="Scriere matematică">${templates.map(([key,label,title])=>`<button type="button" data-insert="${key}" title="${title}" aria-label="${title}">${label}</button>`).join('')}<button type="button" data-keyboard hidden>Tastatură matematică</button></div>`:''}<textarea id="answer-${esc(id)}" class="text-answer" rows="1" ${readOnly?'readonly':''} spellcheck="false" autocomplete="off" aria-label="Răspuns matematic" ${help?`aria-describedby="${esc(help)}"`:''}>${esc(value)}</textarea></div>`;
}
export function exerciseHtml(ex,a={},mode='learn'){
 const locked=mode==='result',exam=mode==='exam';
 const choiceLocked=locked||(!exam&&ex.kind==='choice'&&isExercisePassed(ex,a));
 const label=ex.kind==='set'?'Scrie valorile separate prin virgulă; ordinea nu contează. Pentru nicio soluție: ∅.':ex.kind==='tuple'?'Scrie valorile în ordinea cerută, separate prin virgulă.':ex.kind==='poly'?'Poți scrie x^2, (x+1)(x−1), fracții și produse.':ex.kind==='proof'?'Scrie argumentul în propoziții, apoi verifică pașii după criterii.':'';
 let input='';
 if(ex.kind==='choice')input=`<div class="choice-list">${ex.options.map((o,index)=>`<label class="choice"><input type="radio" name="answer-${esc(ex.id)}" value="${esc(o.id)}" ${a.value===o.id?'checked':''} ${choiceLocked?'disabled':''}><span class="option-letter" aria-hidden="true">${String.fromCharCode(65+index)}</span><span>${esc(o.label)}</span></label>`).join('')}</div>`;
 else if(ex.kind==='proof')input=`<label class="answer-label" for="answer-${esc(ex.id)}">Demonstrația ta</label><textarea id="answer-${esc(ex.id)}" class="text-answer proof-answer" rows="5" ${locked?'readonly':''} aria-describedby="help-${esc(ex.id)}">${esc(a.value||'')}</textarea>`;
 else input=`<label class="answer-label" for="answer-${esc(ex.id)}">Răspunsul tău</label>${editorMarkup(ex.id,a.value||'',locked,ex.kind,label?'help-'+ex.id:'')}`;
 const result=locked||(!exam&&a.status&&ex.kind!=='proof')?grade(ex,a.value||''):null;
 const help=`<div class="exercise-help">${!locked&&!exam?`<div class="help-buttons"><button type="button" data-action="hint" aria-controls="hint-${esc(ex.id)}" aria-expanded="false">Indiciu</button><button type="button" data-action="solution" aria-controls="solution-${esc(ex.id)}" aria-expanded="false">Rezolvare</button></div>`:''}<div id="hint-${esc(ex.id)}" class="hint" hidden><p>${esc(ex.hint)}</p></div><div id="solution-${esc(ex.id)}" class="solution" ${locked?'':'hidden'}>${stepsHtml(ex.steps)}${ex.rubric?`<strong>Criterii de verificare</strong><ul class="rubric">${ex.rubric.map(r=>`<li>${esc(r)}</li>`).join('')}</ul>`:''}${!locked&&ex.kind==='proof'?`<label class="self-review"><input type="checkbox" data-action="reviewed" ${a.reviewed?'checked':''}>Am verificat fiecare criteriu al demonstrației.</label>`:''}</div></div>`;
 return `<article class="exercise" data-ex="${esc(ex.id)}" data-mode="${mode}" data-status="${esc(a.status||result?.status||'')}"><h2>Cerința</h2><p class="exercise-prompt">${esc(ex.prompt)}</p>${help}${label?`<div id="help-${esc(ex.id)}" class="input-help">${label}</div>`:''}${input}${!locked&&!exam&&ex.kind!=='proof'&&ex.kind!=='choice'?'<div class="workspace-actions exercise-actions"><button class="button exercise-check" data-action="check">Verifică</button></div>':''}<div class="feedback ${result?.status||''}" role="status" ${result?'':'hidden'}>${result?esc(result.message):''}</div>${exam?`<label class="answer-label" for="note-${esc(ex.id)}">Justificarea pașilor</label><textarea id="note-${esc(ex.id)}" class="exam-note" data-note="${esc(ex.id)}" placeholder="Ce regulă folosești și de ce se aplică?"></textarea>`:''}</article>`;
}
let mathReady=false,mathFailed=false;
const bindings=new WeakMap();
const templates={frac:['\\frac{#0}{#?}','\\frac{}{}'],power:['#@^{#?}','^{}'],paren:['\\left(#0\\right)','()'],x:['x','x'],set:['\\left\\{#0\\right\\}','{}'],empty:['\\varnothing','∅'],comma:[',',',']};
export function upgradeEditors(container,onChange,exById){
 for(const host of container.querySelectorAll('[data-editor]')){
  const ex=exById.get(host.dataset.editor);if(!ex||ex.kind==='proof')continue;
  bindings.set(host,onChange);
  const control=()=>host.querySelector('math-field,textarea');
  const notify=()=>bindings.get(host)?.(ex.id,control()?.value||'');
  const updateModes=()=>{
   const visual=!!host.querySelector('math-field');
   for(const button of host.querySelectorAll('[data-editor-mode]')){button.disabled=button.dataset.editorMode==='visual'&&!mathReady;button.setAttribute('aria-pressed',String(button.dataset.editorMode===(visual?'visual':'text')));}
   const info=host.querySelector('.editor-state');if(info)info.textContent=visual?'MathLive · formule vizuale':mathReady?'Text · notație simplă sau LaTeX':mathFailed?'Text activ · editor vizual indisponibil':'Se încarcă editorul vizual';
   const kb=host.querySelector('[data-keyboard]');if(kb)kb.hidden=!visual;
  };
  const switchMode=(visual,focus=false)=>{
   const old=control();if(!old||visual===!!host.querySelector('math-field')){updateModes();return;}
   if(visual&&!mathReady)return;
   const next=document.createElement(visual?'math-field':'textarea');next.id=old.id;next.value=old.value;next.readOnly=old.readOnly;
   next.setAttribute('aria-label','Răspuns matematic');if(old.getAttribute('aria-describedby'))next.setAttribute('aria-describedby',old.getAttribute('aria-describedby'));
   if(visual){next.mathVirtualKeyboardPolicy='auto';next.smartFence=true;next.smartMode=false;}
   else{next.className='text-answer';next.rows=1;next.spellcheck=false;next.autocomplete='off';}
   next.addEventListener('input',notify);old.replaceWith(next);updateModes();if(focus)next.focus();
  };
  if(!host.dataset.bound){
   host.dataset.bound='true';
   for(const button of host.querySelectorAll('[data-editor-mode]'))button.addEventListener('click',()=>{host.dataset.preferred=button.dataset.editorMode;switchMode(button.dataset.editorMode==='visual',true);});
   for(const button of host.querySelectorAll('[data-insert]'))button.addEventListener('click',()=>{
    const editor=control();if(!editor||editor.readOnly)return;
    const [latex,text]=templates[button.dataset.insert];editor.focus();
    if(host.querySelector('math-field'))editor.insert(latex);
    else{const start=editor.selectionStart??editor.value.length,end=editor.selectionEnd??start;editor.setRangeText(text,start,end,'end');const pos=text.indexOf('{}');if(pos>=0)editor.setSelectionRange(start+pos+1,start+pos+1);else if(text==='()')editor.setSelectionRange(start+1,start+1);}
    notify();
   });
   host.querySelector('[data-keyboard]')?.addEventListener('click',()=>{control()?.focus();window.mathVirtualKeyboard?.show();});
  }
  if(mathReady&&host.dataset.preferred==='visual'&&!host.querySelector('math-field')){
   if(document.activeElement===control())control().addEventListener('blur',()=>upgradeEditors(container,onChange,exById),{once:true});
   else try{switchMode(true);}catch{host.dataset.preferred='text';}
  }
  updateModes();
 }
}
export async function loadMathLive(onReady){
 const addScript=src=>new Promise((resolve,reject)=>{
  const script=document.createElement('script');script.src=src;script.async=true;let finished=false;
  const finish=(ok)=>{if(finished)return;finished=true;clearTimeout(timer);if(ok)resolve();else{script.remove();reject(Error('Editor indisponibil'));}};
  const timer=setTimeout(()=>finish(false),10000);script.onload=()=>finish(true);script.onerror=()=>finish(false);document.head.append(script);
 });
 try{
  let loaded=false;const local=new URL('../vendor/mathlive.min.js',import.meta.url);
  try{const response=await fetch(local,{method:'HEAD'});if(response.ok){await addScript(local.href);loaded=true;}}catch{/* Editorul text rămâne activ cât timp verificăm alternativa. */}
  if(!loaded)await addScript(`https://cdn.jsdelivr.net/npm/mathlive@${MATHLIVE_VERSION}/mathlive.min.js`);
  if(!customElements.get('math-field')||!window.MathfieldElement)throw Error('Editor indisponibil');
  window.MathfieldElement.fontsDirectory=loaded?new URL('../vendor/fonts/',import.meta.url).href:`https://cdn.jsdelivr.net/npm/mathlive@${MATHLIVE_VERSION}/fonts/`;
  window.MathfieldElement.soundsDirectory=null;mathReady=true;onReady(true);
 }catch{mathFailed=true;onReady(false);}
}







