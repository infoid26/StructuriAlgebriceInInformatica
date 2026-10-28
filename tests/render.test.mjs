import test from 'node:test';
import assert from 'node:assert/strict';
import {lessons,exercises} from '../site/content.js';
import {lessonSteps} from '../site/lesson-view.js';
// Test de randare a șabloanelor, fără browser sau conexiuni de rețea.
test('every lesson and page renders without runtime errors in a minimal DOM harness',async()=>{
const listeners={},nodes=new Map();
const element=()=>({innerHTML:'',textContent:'',hidden:false,dataset:{},classList:{toggle(){}},querySelectorAll(){return [];},querySelector(){return null;},addEventListener(){},focus(){}});
for(const id of ['main','global-progress','due-count','save-status','toast'])nodes.set(id,element());
globalThis.document={getElementById:id=>nodes.get(id)||null,querySelectorAll:()=>[],addEventListener(){},createElement:()=>({remove(){}}),head:{append(script){queueMicrotask(()=>script.onerror());}},hidden:false,title:''};
globalThis.window={addEventListener:(name,fn)=>listeners[name]=fn,scrollTo(){}};
globalThis.location={hash:'#home',protocol:'http:'};
const completed={version:1,attempts:Object.fromEntries(exercises.map(ex=>[ex.id,{value:ex.kind==='proof'?'Argument verificat.':Array.isArray(ex.answer)?ex.answer.length?ex.answer.join(','):'∅':String(ex.answer),status:ex.kind==='proof'?'manual':'correct',everCorrect:ex.kind!=='proof',reviewed:ex.kind==='proof'}])),read:{},exam:null};
globalThis.localStorage={getItem:()=>JSON.stringify(completed),setItem(){}};
globalThis.customElements={get:()=>undefined};
const oldFetch=globalThis.fetch,oldInterval=globalThis.setInterval;
globalThis.fetch=async()=>({ok:false});globalThis.setInterval=()=>0;
try{await import('../site/app.js');assert.ok(nodes.get('main').innerHTML.includes('Structuri algebrice în informatică'));for(const l of lessons){location.hash='#lesson/'+l.id;listeners.hashchange();assert.ok(nodes.get('main').innerHTML.includes(l.title),l.id);assert.ok(!nodes.get('main').innerHTML.includes('data-ex='));for(let step=0;step<lessonSteps(l).length;step++){location.hash='#lesson/'+l.id+'/'+step;listeners.hashchange();assert.ok(nodes.get('main').innerHTML.includes(l.title),l.id);const item=lessonSteps(l)[step];if(item.kind==='exercise')assert.ok(nodes.get('main').innerHTML.includes('data-ex="'+item.exercise.id+'"'));}}for(const route of ['practice','review','exam','lab','formulas','sources','editor','missing']){location.hash='#'+route;listeners.hashchange();assert.ok(nodes.get('main').innerHTML.length>300,route);}location.hash='#lesson/missing';listeners.hashchange();assert.ok(nodes.get('main').innerHTML.includes('Acest pas nu există.'));}finally{globalThis.fetch=oldFetch;globalThis.setInterval=oldInterval;}
});



