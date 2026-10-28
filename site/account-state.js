import {blank} from './state.js';
const clone=value=>JSON.parse(JSON.stringify(value));
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
export function mergeProgress(base,local,remote){
 const progress=clone(remote),conflicts=[];
 for(const field of ['attempts','read']){
  progress[field]||={};
  for(const id of new Set([...Object.keys(base[field]||{}),...Object.keys(local[field]||{}),...Object.keys(remote[field]||{})])){
   const before=base[field]?.[id],ours=local[field]?.[id],theirs=remote[field]?.[id];
   if(same(ours,before))continue;
   if(!same(theirs,before)&&!same(ours,theirs)){conflicts.push(field+':'+id);continue;}
   if(ours===undefined)delete progress[field][id];else progress[field][id]=clone(ours);
  }
 }
 if(!same(local.exam,base.exam)){
  if(!same(remote.exam,base.exam)&&!same(remote.exam,local.exam))conflicts.push('exam');
  else progress.exam=clone(local.exam??null);
 }
 return {progress,conflicts};
}
export function mergeAnonymous(remote,guest){
 const merged=clone(remote||blank());
 for(const field of ['attempts','read'])for(const [id,value] of Object.entries(guest[field]||{}))if(!Object.hasOwn(merged[field],id))merged[field][id]=clone(value);
 if(!merged.exam&&guest.exam)merged.exam=clone(guest.exam);
 return merged;
}
