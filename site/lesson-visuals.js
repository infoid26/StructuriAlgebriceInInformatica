import {esc} from './ui.js';

export const flow=(title,items,caption)=>({type:'flow',title,items,caption});
export const table=(title,headers,rows,caption)=>({type:'table',title,headers,rows,caption});
export const matrices=(title,items,caption)=>({type:'matrices',title,items,caption});
export const cycle=(title,labels,caption)=>({type:'cycle',title,labels,caption});
export const sieve=(title,limit,divisors,caption)=>({type:'sieve',title,limit,divisors,caption});

export function visualHtml(visual){
 if(!visual)return '';
 let body='';
 if(visual.type==='flow')body=`<ol class="visual-flow">${visual.items.map(([label,detail])=>`<li><strong>${esc(label)}</strong>${detail?`<span>${esc(detail)}</span>`:''}</li>`).join('')}</ol>`;
 else if(visual.type==='table')body=`<div class="visual-scroll" tabindex="0"><table><thead><tr>${visual.headers.map(h=>`<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${visual.rows.map(row=>`<tr>${row.map((cell,i)=>`<${i?'td':'th scope="row"'}>${esc(cell)}</${i?'td':'th'}>`).join('')}</tr>`).join('')}</tbody></table></div>`;
 else if(visual.type==='matrices')body=`<div class="visual-matrices">${visual.items.map(item=>`<div class="visual-matrix-item"><strong>${esc(item.label)}</strong><div class="visual-matrix" role="table" aria-label="${esc(item.label)}">${item.rows.map((row,i)=>`<div role="row">${row.map((cell,j)=>`<span role="cell" class="${item.cross&&(i===item.cross[0]||j===item.cross[1])?'matrix-crossed':item.diagonal&&i===j?'matrix-focus':''}">${esc(cell)}</span>`).join('')}</div>`).join('')}</div></div>`).join('')}</div>`;
 else if(visual.type==='cycle'){
  const n=visual.labels.length,r=83,c=118,point=(angle,radius)=>[c+radius*Math.cos(angle),c+radius*Math.sin(angle)];
  const nodes=visual.labels.map((label,i)=>{
   const angle=-Math.PI/2+i*2*Math.PI/n,[x,y]=point(angle,r);
   const start=angle+0.30,end=angle+2*Math.PI/n-0.30,[sx,sy]=point(start,r),[ex,ey]=point(end,r);
   const arrow=point(end-0.07,r-7),arrow2=point(end-0.07,r+7);
   return `<path class="cycle-edge" d="M${sx},${sy} A${r},${r} 0 0 1 ${ex},${ey}"/><path class="cycle-edge" d="M${arrow} L${ex},${ey} L${arrow2}"/><circle class="cycle-node" cx="${x}" cy="${y}" r="22"/><text x="${x}" y="${y}" dy=".35em" text-anchor="middle">${esc(label)}</text>`;
  }).join('');
  body=`<svg class="visual-cycle" viewBox="0 0 236 236" role="img" aria-label="${esc(visual.labels.join(' → ')+' → '+visual.labels[0])}">${nodes}</svg>`;
 }else if(visual.type==='sieve')body=`<div class="visual-sieve">${Array.from({length:visual.limit},(_,i)=>i+1).map(n=>{const excluded=visual.divisors.some(d=>n%d===0);return `<span class="${excluded?'sieve-excluded':'sieve-kept'}" aria-label="${n}: ${excluded?'exclus':'păstrat'}">${n}</span>`;}).join('')}</div><p class="visual-key">${esc('Păstrăm numerele fără multiplii indicați; cele tăiate sunt excluse.')}</p>`;
 else throw Error('Unknown lesson visual: '+visual.type);
 return `<figure class="lesson-visual"><h3>${esc(visual.title)}</h3>${body}<figcaption>${esc(visual.caption)}</figcaption></figure>`;
}
