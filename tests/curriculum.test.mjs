import test from 'node:test';
import assert from 'node:assert/strict';
import {chapters,lessons} from '../site/content.js';
import {coursePractice} from '../site/curriculum.js';
import {determinant} from '../site/math-core.js';

test('course starts with groups and keeps the documented algebra topics',()=>{
 assert.equal(lessons[0].id,'grup');assert.equal(lessons[1].id,'resturi');
 for(const id of ['baze','limbaj','structura'])assert.ok(!chapters.some(c=>c.id===id));
 for(const id of ['unitati-radical','corp49','det-recurenta','inversa-matrice','numar-matrice'])assert.ok(lessons.some(l=>l.id===id));
 assert.ok(!JSON.stringify(lessons).includes('ireductibil'));
});

test('finite-field inverse answers are confirmed by multiplication',()=>{
 const reduce=x=>((x%7)+7)%7;
 for(let i=1;i<12;i+=2){
  const a=i%7,b=i%6+1,[c,d]=coursePractice.corp49(i).answer;
  assert.equal(reduce(a*c+3*b*d),1);assert.equal(reduce(a*d+b*c),0);
 }
 for(let a=0;a<7;a++)for(let b=0;b<7;b++){
  if(!a&&!b)continue;
  let count=0;
  for(let c=0;c<7;c++)for(let d=0;d<7;d++)if(reduce(a*c+3*b*d)===1&&reduce(a*d+b*c)===0)count++;
  assert.equal(count,1);
 }
});

test('tridiagonal recurrence agrees with independent determinant evaluation',()=>{
 for(let i=0;i<12;i++){
  const a=i%4+1,b=i%3+2,n=i%4+2;
  const matrix=Array.from({length:n},(_,r)=>Array.from({length:n},(_,c)=>r===c?a+b:c===r+1?a*b:r===c+1?1:0));
  assert.equal(BigInt(coursePractice['det-recurenta'](i).answer),determinant(matrix));
 }
});

test('matrix inverse answers satisfy products on both sides',()=>{
 for(let i=0;i<12;i++){
  const a=i+1,b=i%4+1,n=i%2?2:3;
  const matrix=n===2?[[1,a],[0,1]]:[[1,a,0],[0,1,b],[0,0,1]];
  const values=coursePractice['inversa-matrice'](i).answer;
  const candidate=Array.from({length:n},(_,r)=>values.slice(r*n,(r+1)*n));
  for(const [left,right] of [[matrix,candidate],[candidate,matrix]])for(let r=0;r<n;r++)for(let c=0;c<n;c++)assert.equal(left[r].reduce((sum,x,k)=>sum+x*right[k][c],0),r===c?1:0);
 }
});

test('counting invertible matrices agrees with exhaustive small-field enumeration',()=>{
 for(const q of [2,3,5]){
  let count=0;
  for(let a=0;a<q;a++)for(let b=0;b<q;b++)for(let c=0;c<q;c++)for(let d=0;d<q;d++)if(((a*d-b*c)%q+q)%q)count++;
  const index=[2,3,5,7,49].indexOf(q);const i=Array.from({length:15},(_,k)=>k).find(k=>k%5===index&&k%3===0);
  assert.notEqual(i,undefined);assert.equal(Number(coursePractice['numar-matrice'](i).answer),count);
 }
});
