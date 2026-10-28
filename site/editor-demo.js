import {grade} from './math-core.js';
import {esc,stepsHtml,editorMarkup,upgradeEditors} from './ui.js';
const samples=[
 {id:'editor-fraction',title:'O fracție',kind:'number',prompt:'Calculează 1/2+1/3.',answer:'5/6',hint:'Adu ambele fracții la numitorul 6.',steps:['1/2=3/6 și 1/3=2/6.','Suma este 5/6.']},
 {id:'editor-poly',title:'Un polinom',kind:'poly',prompt:'Dezvoltă (x+1)(x−1).',answer:'x^2-1',hint:'Înmulțește fiecare termen; termenii x și −x se reduc.',steps:['x²−x+x−1=x²−1.','Sunt acceptate și forme echivalente, inclusiv produsul inițial.']},
 {id:'editor-set',title:'O mulțime',kind:'set',prompt:'Scrie rădăcinile lui x²=1 în ℝ.',answer:[-1,1],hint:'Verifică atât 1, cât și −1.',steps:['1²=1 și (−1)²=1.','Scrie −1,1 sau {−1,1}; ordinea nu contează.']},
 {id:'editor-tuple',title:'O pereche',kind:'tuple',prompt:'x=2 și y=3. Scrie perechea (x,y).',answer:[2,3],hint:'Aici ordinea componentelor contează.',steps:['Prima valoare este x=2.','A doua este y=3. Scrie 2,3.']}
];
const values={};let selected=0;
export function editorDemoHtml(){const ex=samples[selected];return `<div class="page-heading"><div class="eyebrow">ÎNAINTE DE PRIMUL EXERCIȚIU</div><h1>Scriem matematică în browser</h1><p class="lead">Încearcă editorul fără cronometru. Alegi simbolurile din butoane sau tastezi direct. Această pagină nu schimbă progresul cursului.</p></div><div class="tool-tabs">${samples.map((s,i)=>`<button class="btn ${i===selected?'selected':''}" data-editor-sample="${i}" aria-pressed="${i===selected}">${s.title}</button>`).join('')}</div><section class="panel"><h2>${ex.prompt}</h2>${editorMarkup(ex.id,values[ex.id]||'',false,ex.kind,'editor-help')}<p class="input-help" id="editor-help">Pentru fracții poți scrie 5/6; pentru puteri, x^2. Virgula separă valorile. Punctul separă zecimalele.</p><div class="actions"><button id="editor-check" class="btn primary">Verifică</button><button id="editor-hint" class="btn ghost">Un indiciu</button><button id="editor-solution" class="button-link">Vezi pașii</button></div><p id="editor-feedback" class="feedback" role="status" hidden></p><p id="editor-tip" class="hint" hidden>${esc(ex.hint)}</p><div id="editor-steps" class="solution" hidden>${stepsHtml(ex.steps)}</div></section><section class="panel"><h2>Cum folosești editorul</h2><ol class="steps"><li>Poți rămâne în modul Text: 1/2, 2^3 și parantezele funcționează direct.</li><li>În modul Vizual, butonul a/b construiește fracția. Completează numărătorul și numitorul; săgețile mută cursorul între ele.</li><li>Butonul xⁿ deschide exponentul. După ce îl completezi, săgeata dreapta te întoarce la linia de bază.</li><li>Pentru o mulțime folosește virgule între elemente; pentru nicio soluție, butonul ∅.</li><li>În câmpul de răspuns scrii valoarea cerută. Pașii unei demonstrații se scriu în câmpul separat.</li></ol><a class="btn primary" href="#lesson/numere-baze">Începe de la numere →</a></section>`;}
export function refreshEditorDemo(container){upgradeEditors(container,(id,value)=>values[id]=value,new Map(samples.map(s=>[s.id,s])));}
export function bindEditorDemo(container,render){
 for(const button of container.querySelectorAll('[data-editor-sample]'))button.addEventListener('click',()=>{selected=Number(button.dataset.editorSample);render();});
 const ex=samples[selected];const input=()=>container.querySelector('math-field,textarea');
 input()?.addEventListener('input',()=>values[ex.id]=input().value);
 container.querySelector('#editor-check')?.addEventListener('click',()=>{const result=grade(ex,input()?.value||'');const out=container.querySelector('#editor-feedback');out.hidden=false;out.className='feedback '+result.status;out.textContent=result.message;});
 container.querySelector('#editor-hint')?.addEventListener('click',()=>container.querySelector('#editor-tip').hidden=false);
 container.querySelector('#editor-solution')?.addEventListener('click',()=>container.querySelector('#editor-steps').hidden=false);
 refreshEditorDemo(container);
}
