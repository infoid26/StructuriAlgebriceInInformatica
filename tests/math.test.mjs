import test from 'node:test';
import assert from 'node:assert/strict';
import {gcd,inverse,mod,powmod,order,phi,parseNumber,parsePolynomial,formatR,grade,roots,permutation,determinant,rank} from '../site/math-core.js';
import {lessons,exercises} from '../site/content.js';
const number=s=>formatR(parseNumber(s));
test('exact arithmetic: fractions, LaTeX, precedence and invalid input',()=>{
for(const [s,v] of [['1/3+1/6','1/2'],['\\frac{2}{3}+\\frac{1}{6}','5/6'],['\\frac{1}{\\frac{2}{3}}','3/2'],['-2^2','-4'],['(-2)^2','4'],['2^3^2','512'],['2^{-3}','1/8'],['0.1+0.2','3/10'],['\\left(2+3\\right)\\cdot4','20'],['1/(2/3)','3/2']])assert.equal(number(s),v,s);
for(const s of ['1/0','x','alert(1)','2;3','2+','2 3','\\sqrt{4}','2^99999','('.repeat(100)+'1'+')'.repeat(100)])assert.throws(()=>parseNumber(s),s);
assert.equal(grade({kind:'number',answer:'1/3'},'0.3333333333333333').status,'wrong');
});
test('modular inverses and orders are exhaustive for small moduli',()=>{for(let n=2;n<=45;n++)for(let a=0;a<n;a++){const inv=inverse(a,n);if(gcd(a,n)===1n){assert.equal(mod(BigInt(a)*inv,n),1n);const ord=order(a,n);assert.equal(powmod(a,ord,n),1n);for(let k=1n;k<ord;k++)assert.notEqual(powmod(a,k,n),1n);}else{assert.equal(inv,null);assert.equal(order(a,n),null);}const additive=order(a,n,true);assert.equal(mod(additive*BigInt(a),n),0n);for(let k=1n;k<additive;k++)assert.notEqual(mod(k*BigInt(a),n),0n);}assert.equal(phi(100),40n);});
test('polynomial identity is coefficient based, including finite fields',()=>{
assert.equal(grade({kind:'poly',answer:'x^2-1'},'(x+1)(x-1)').status,'correct');
assert.equal(grade({kind:'poly',answer:'x^2+1',modulus:5},'(x+2)*(x+3)').status,'correct');
assert.equal(grade({kind:'poly',answer:'0',modulus:5},'x^5-x').status,'wrong');
assert.equal(grade({kind:'poly',answer:'3*x',modulus:5},'x/2').status,'correct');
assert.equal(grade({kind:'poly',answer:'0',modulus:5},'x/5').status,'invalid');
assert.equal(grade({kind:'poly',answer:'1',modulus:5},'5/5').status,'invalid');
assert.equal(grade({kind:'poly',answer:'1',modulus:5},'5^(-1)*5').status,'invalid');
assert.equal(grade({kind:'poly',answer:'x^5',modulus:5},'x^5').status,'correct');
assert.equal(grade({kind:'number',answer:1},'(x+1)/(x+1)').status,'invalid');
assert.equal(grade({kind:'set',answer:[1,2]},'\\left\\{2,1,1\\right\\}').status,'correct');
assert.equal(grade({kind:'set',answer:[]},'\\varnothing').status,'correct');
assert.equal(grade({kind:'set',answer:[]},'').status,'invalid');
assert.equal(grade({kind:'tuple',answer:[1,2]},'2,1').status,'wrong');
});
test('finite field examples independently verified against direct enumeration',()=>{
assert.equal(inverse(75,223),113n);assert.equal(order(2,223),37n);
for(const [p,expected] of [[37,[6,10,26,31]],[89,[34,55]],[103,[46,56]]]){const independent=Array.from({length:p},(_,x)=>x).filter(x=>(x**4+x**3+2*x*x+x+1)%p===0);assert.deepEqual(roots('x^4+x^3+2*x^2+x+1',p),independent);assert.deepEqual(independent,expected);}
assert.deepEqual(roots('x^2+x+1',101),[]);assert.deepEqual(roots('x^2+x+1',103),[46,56]);
assert.equal(determinant([[1,1,0],[0,1,1],[1,0,1]]),2n);
assert.equal(determinant([[1,0,1,1],[0,1,1,1],[1,1,0,1],[1,1,1,0]]),3n);
});
function* permutations(a){if(!a.length){yield [];return;}for(let i=0;i<a.length;i++)for(const rest of permutations(a.filter((_,j)=>i!==j)))yield [a[i],...rest];}
test('all permutations up to S5: inverse, parity and minimal order',()=>{for(let n=1;n<=5;n++)for(const p of permutations(Array.from({length:n},(_,i)=>i+1))){const r=permutation(p);let inversions=0;for(let i=0;i<n;i++)for(let j=i+1;j<n;j++)if(p[i]>p[j])inversions++;assert.equal(r.sign,inversions%2?-1:1);p.forEach((v,i)=>assert.equal(r.inverse[v-1],i+1));let current=Array.from({length:n},(_,i)=>i+1),count=0;do{current=current.map(x=>p[x-1]);count++;}while(current.some((x,i)=>x!==i+1));assert.equal(r.order,BigInt(count));}for(const p of [[1,1],[0,2],[2],[1,3]])assert.throws(()=>permutation(p));});
test('determinant and rational rank',()=>{assert.equal(determinant([[1,2,0],[0,3,1],[2,0,1]]),7n);assert.equal(rank([[1,0,1],[0,1,1],[1,1,2]]),2);assert.equal(rank([[0,0],[0,0]]),0);assert.equal(rank([[2,1],[1,2]]),2);assert.equal(determinant([[3,2],[5,4]]),2n);});
test('course integrity: prerequisites, unique IDs, correct model answers',()=>{assert.equal(lessons.length,45);const seen=new Set(),ids=new Set();for(const l of lessons){assert.ok(l.theory.length>=3,l.id);assert.ok(l.worked.steps.length>=2,l.id);for(const pre of l.prerequisites)assert.ok(seen.has(pre),`${l.id} requires earlier ${pre}`);seen.add(l.id);for(const e of l.exercises){assert.ok(!ids.has(e.id));ids.add(e.id);assert.ok(e.hint);assert.ok(e.steps.length);if(e.kind==='proof'){assert.ok(e.rubric.length>=3);continue;}const input=Array.isArray(e.answer)?(e.answer.length?e.answer.join(','):'∅'):String(e.answer);assert.equal(grade(e,input).status,'correct',e.id);}}assert.equal(exercises.length,707);});


