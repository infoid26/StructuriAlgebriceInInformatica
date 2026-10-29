export function chooseQuestions(exercises,chapters,mode='mixed',random=Math.random){
 const pool=exercises.filter(e=>e.kind!=='proof'&&e.stage!=='Înțelegerea cerinței'&&(mode!=='foundations'||e.chapter==='modulo'));
 const shuffle=values=>{const out=[...values];for(let i=out.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;};
 const chosen=[];
 if(mode==='mixed')for(const chapter of chapters){const group=pool.filter(e=>e.chapter===chapter.id);if(group.length)chosen.push(shuffle(group)[0]);}
 for(const ex of shuffle(pool))if(chosen.length<10&&!chosen.some(e=>e.id===ex.id))chosen.push(ex);
 return shuffle(chosen).map(e=>e.id);
}
