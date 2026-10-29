import {inverse,mod} from './math-core.js';
import {applyCourseExplanations} from './course-explanations.js';
const N=(prompt,answer,hint,steps)=>({kind:'number',prompt,answer:String(answer),hint,steps});
const T=(prompt,answer,hint,steps)=>({kind:'tuple',prompt,answer,hint,steps});
const C=(prompt,correct,other,steps)=>({kind:'choice',prompt,options:[{id:'a',label:correct},{id:'b',label:other}],answer:'a',hint:steps[0],steps});
const L=(id,title,theory,worked,exercises,trap)=>({id,title,goal:theory[0][1],theory,worked,exercises,trap,minutes:15});
const plan=[
 ['modulo','Grupuri și clase de resturi','Operația, congruența, inversul și calculul puterilor.',['grup','resturi','opus','euclid','invers','fractii-continue','congruente','puteri','euler-fermat']],
 ['grupuri','Ordinul elementelor','Ordin aditiv, ordin multiplicativ, generatori și aplicații.',['ordin-aditiv','ordin-multiplicativ','produs-ordine','primalitate','logaritm-discret']],
 ['permutari','Permutări','Bijeții, compunere, signatură, ordin și rădăcini.',['cicluri','compunere','signatura','ordin-permutare','puteri-permutari']],
 ['inele','Inele, corpuri și polinoame','Unități, corpuri finite, cuaternioni și rădăcini ale polinoamelor.',['corp','unitati-radical','corp49','cuaternioni','polinoame','impartire-polinoame','patratice','grad-patru','viete','viete-general']],
 ['matrice','Matrice, determinanți și sisteme','Laplace, recurențe, inverse, rang și discuția sistemelor.',['det2','det3','operatii-linii','det-recurenta','max01','rang','sisteme','parametri','matrice-modulare','inversa-matrice','numar-matrice']],
 ['aplicatii','Aplicațiile din lucrări','Resturi chinezești, criptare și numărare.',['crt','rsa','vigenere','numarare','incluziune-excluziune']]
];
const newLessons=[
 L('unitati-radical','Elemente inversabile în ℤ[√23]',[
  ['Forma elementelor','În ℤ[√23] lucrăm cu a+b√23, unde a și b sunt întregi. Nu este suficient ca un număr să aibă invers real: inversul trebuie să aibă tot coeficienți întregi.'],
  ['Conjugatul elimină radicalul','Conjugatul lui a+b√23 este a−b√23. Produsul lor este a²−23b², deoarece termenii cu radical se anulează. Numim acest întreg norma elementului.'],
  ['Când există invers în inel','Dacă u și v sunt inverse, normele lor întregi au produsul 1. Rezultă că norma lui u este 1 sau −1. Reciproc, pentru normă ±1, formula u⁻¹=(a−b√23)/(a²−23b²) are coeficienți întregi.'],
  ['Căutarea unui exemplu','Încercăm b=1,2,… și verificăm dacă 23b²+1 sau 23b²−1 este pătrat perfect. La b=5, 23·25+1=576=24². Obținem unitatea 24+5√23 și inversul 24−5√23.']
 ],{prompt:'Este 24+5√23 inversabil în ℤ[√23]?',steps:['a=24 și b=5.','Norma este 24²−23·5²=576−575=1.','Conjugatul 24−5√23 are coeficienți întregi.','Produsul celor două elemente este 1, deci acesta este inversul.']},[
  N('Calculează norma lui 24+5√23 în ℤ[√23].',1,'Norma este a²−23b².',['24²=576 și 23·5²=575.','Diferența este 1.']),
  T('Scrie coeficienții (a,b) ai inversului lui 24+5√23.',[24,-5],'Norma este 1, deci folosim conjugatul.',['Inversul este 24−5√23.','Coeficienții sunt (24,−5).'])
 ],'Un invers real cu coeficienți fracționari nu este automat un element al lui ℤ[√23].'),
 L('corp49','Calcul în corpul cu 49 de elemente',[
  ['Perechea de coeficienți','Scriem a+bu, cu a,b în ℤ₇ și relația u²=3. Simbolul u joacă rolul lui √3 din notația ℤ₇[√3]. Sunt 7 alegeri pentru a și 7 pentru b: în total 49 de elemente.'],
  ['De ce obținem un corp','Pătratele modulo 7 sunt 0,1,2,4. Numărul 3 nu este pătrat. Dacă a²−3b²=0 și b≠0, atunci (a/b)²=3, contradicție. Dacă b=0, și a=0. Prin urmare norma este nenulă pentru orice pereche nenulă.'],
  ['Produsul și inversul','Înlocuim u² cu 3: (a+bu)(c+du)=(ac+3bd)+(ad+bc)u. Reducem ambii coeficienți modulo 7. Pentru invers înmulțim conjugatul a−bu cu inversul modular al lui a²−3b².'],
  ['Exemplu de invers','Pentru 1+u, norma este 1−3=−2=5 modulo 7. Inversul lui 5 este 3, deoarece 5·3≡1. Așadar (1+u)⁻¹=3(1−u)=3+4u. Produsul dă 1+0u.']
 ],{prompt:'Calculează (2+u)(1+2u) în corpul cu u²=3 peste ℤ₇.',steps:['Înmulțim: 2+4u+u+2u².','Înlocuim u² cu 3: 2+6+5u=8+5u.','Reducem modulo 7: rezultatul este 1+5u.']},[
  T('Cu u²=3 peste ℤ₇, scrie (a,b) pentru (2+u)(1+2u).',[1,5],'Înlocuiește u² cu 3 și redu modulo 7.',['Coeficientul constant este 8≡1.','Coeficientul lui u este 5.']),
  T('În același corp, scrie coeficienții inversei lui 1+u.',[3,4],'Inversul normei 5 modulo 7 este 3.',['3(1−u)=3+4u.','(1+u)(3+4u)=15+7u=1.'])
 ],'Coeficienții se calculează modulo 7; cardinalul 49 nu devine modulul coeficienților.'),
 L('det-recurenta','Determinanți tridiagonali și recurențe',[
  ['Recunoaștem matricea','Pe diagonala principală este a+b, imediat deasupra ei ab, imediat dedesubt 1, iar în rest sunt zerouri. Notăm cu Dₙ determinantul de ordin n.'],
  ['Construim recurența','Dezvoltăm după prima linie. Primul termen este (a+b)Dₙ₋₁. Din al doilea scoatem ab; semnul cofactorului este minus, iar minorul se reduce la Dₙ₋₂. Obținem Dₙ=(a+b)Dₙ₋₁−abDₙ₋₂.'],
  ['Cazurile de început','D₁=a+b și D₂=(a+b)²−ab=a²+ab+b². Convenția D₀=1 permite aceeași recurență de la n=2.'],
  ['Formula și cazul a=b','Dₙ=aⁿ+aⁿ⁻¹b+…+abⁿ⁻¹+bⁿ. Pentru a≠b putem scrie (aⁿ⁺¹−bⁿ⁺¹)/(a−b). Pentru a=b sunt n+1 termeni egali, deci Dₙ=(n+1)aⁿ.']
 ],{prompt:'Calculează D₃ pentru a=2, b=3.',steps:['a+b=5 și ab=6.','D₀=1, D₁=5.','D₂=5·5−6·1=19.','D₃=5·19−6·5=65.','Formula explicită confirmă 8+12+18+27=65.']},[
  N('Pentru diagonalele 5,6,1 descrise în lecție, cât este D₂?',19,'Aplică D₂=5D₁−6D₀.',['D₁=5 și D₀=1.','D₂=25−6=19.']),
  N('În aceeași recurență, cât este D₃?',65,'Folosește D₂=19 și D₁=5.',['D₃=5·19−6·5=65.'])
 ],'Formula cu a−b la numitor cere a≠b; formula ca sumă rămâne valabilă și când a=b.'),
 L('inversa-matrice','Inversa unei matrice prin cofactori',[
  ['Ce căutăm','Inversa lui A este B cu AB=BA=I, unde I are 1 pe diagonală și 0 în rest. Peste ℝ sau ℚ, inversa există exact când det A≠0.'],
  ['Minorul și cofactorul','Pentru poziția (i,j), ștergem linia i și coloana j, calculăm determinantul rămas și îl înmulțim cu (−1)^(i+j). Acesta este cofactorul Cᵢⱼ. Semnele încep cu +,−,+ pe prima linie.'],
  ['Transpunerea','Construim matricea cofactorilor C, apoi schimbăm liniile cu coloanele: Cᵀ. Inversa este A⁻¹=Cᵀ/det A. Modulo n, împărțirea este înmulțirea cu inversul modular al determinantului.'],
  ['Verificarea','Pentru A=((1,2,0),(0,1,3),(0,0,1)), inversa este ((1,−2,6),(0,1,−3),(0,0,1)). Poziția (1,3) din produs este 1·6+2·(−3)+0·1=0. Verificăm astfel toate pozițiile.']
 ],{prompt:'Găsește inversa lui A=((2,1),(1,1)) peste ℚ.',steps:['det A=2·1−1·1=1, deci inversa există.','Cofactorii formează C=((1,−1),(−1,2)).','Transpusa este aceeași în acest exemplu.','A⁻¹=((1,−1),(−1,2)).','Produsul cu A este I.']},[
  T('Pentru A=((2,1),(1,1)), scrie inversa linie cu linie.',[1,-1,-1,2],'Schimbă elementele diagonalei și semnele celorlalte două; det A=1.',['A⁻¹=((1,−1),(−1,2)).','Răspuns: (1,−1,−1,2).']),
  C('După calculul matricei cofactorilor, ce urmează?','O transpun și apoi împart la determinant','Împart direct, fără transpunere',['Elementul (i,j) al inversei folosește cofactorul (j,i).','De aceea apare transpusa.'])
 ],'Cofactorii și transpusa lor sunt diferite în general; verifică rezultatul prin înmulțire.'),
 L('numar-matrice','Câte matrice sunt inversabile peste un corp finit?',[
  ['Coloane independente','GL₂(K) este mulțimea matricelor inversabile de ordin 2 peste corpul K. Dacă K are q elemente, o coloană cu două componente are q² posibilități. Pentru inversabilitate, coloanele trebuie să fie independente.'],
  ['Prima coloană','Prima coloană poate fi orice coloană diferită de (0,0). Rămân q²−1 alegeri. Un vector este aici doar o coloană cu două componente din K.'],
  ['A doua coloană','Multiplii primei coloane sunt q coloane distincte, inclusiv coloana nulă. Le excludem pentru că ar da determinant zero. Rămân q²−q alegeri.'],
  ['Formula','|GL₂(K)|=(q²−1)(q²−q). Peste ℤₚ, q=p prim. Pentru corpul cu 49 de elemente, q=49. ℤ₂₆ nu este corp, deci formula nu se aplică direct matricelor peste ℤ₂₆.']
 ],{prompt:'Câte matrice 2×2 sunt inversabile peste ℤ₃?',steps:['q=3.','Prima coloană: 3²−1=8 alegeri.','A doua: 3²−3=6 alegeri.','În total 8·6=48.']},[
  N('Câte alegeri are prima coloană a unei matrice inversabile 2×2 peste ℤ₃?',8,'Excludem coloana nulă.',['Sunt 9 coloane.','Rămân 9−1=8.']),
  N('Câte matrice inversabile 2×2 sunt peste ℤ₃?',48,'Numără alegerile celor două coloane.',['Prima: 8 alegeri.','A doua: 6 alegeri.','Total: 48.'])
 ],'q este cardinalul unui corp, nu orice modul al unui inel de clase de resturi.')
];
export const coursePractice={
 'unitati-radical':i=>{const a=i+2,b=i%4+1,n=a*a-23*b*b;return i%2?C(`Este ${a}+${b}√23 o unitate a lui ℤ[√23]?`,Math.abs(n)===1?'Da, norma este ±1':'Nu, norma nu este ±1',Math.abs(n)===1?'Nu, radicalul împiedică inversul':'Da, orice element nenul are invers',[`Norma este ${a}²−23·${b}²=${n}.`,Math.abs(n)===1?'Inversul are coeficienți întregi.':'Norma nu este ±1, deci inversul nu aparține inelului.']):N(`Determină norma lui ${a}+${b}√23.`,n,'Norma este a²−23b².',[`${a}²=${a*a}; 23·${b}²=${23*b*b}.`,`Norma este ${n}.`]);},
 'corp49':i=>{const a=i%7,b=i%6+1,c=(i+2)%7,d=(i+3)%7;const u=Number(mod(a*c+3*b*d,7)),v=Number(mod(a*d+b*c,7));if(i%2){const n=Number(mod(a*a-3*b*b,7)),k=Number(inverse(n,7));return T(`În corpul cu u²=3 peste ℤ₇, scrie coeficienții inversei lui ${a}+${b}u.`,[Number(mod(a*k,7)),Number(mod(-b*k,7))],'Inversează norma modulo 7 și înmulțește conjugatul.',[`Norma este ${a*a-3*b*b}≡${n}; inversul ei este ${k}.`,`Conjugatul este ${a}−${b}u.`,`Coeficienții reduși sunt (${mod(a*k,7)},${mod(-b*k,7)}).`]);}return T(`În același corp, scrie coeficienții produsului (${a}+${b}u)(${c}+${d}u).`,[u,v],'Folosește u²=3.',[`Termen constant: ${a}·${c}+3·${b}·${d}≡${u}.`,`Coeficientul lui u: ${a}·${d}+${b}·${c}≡${v}.`]);},
 'det-recurenta':i=>{const a=i%4+1,b=i%3+2,n=i%4+2;let d0=1,d1=a+b;const steps=[`D₀=1 și D₁=${d1}.`];for(let k=2;k<=n;k++){const next=(a+b)*d1-a*b*d0;steps.push(`D${k}=${a+b}·${d1}−${a*b}·${d0}=${next}.`);[d0,d1]=[d1,next];}return N(`Matricea tridiagonală are a=${a}, b=${b} și ordinul ${n}. Calculează D${n}.`,d1,'Păstrează cele două valori precedente în recurență.',steps);},
 'inversa-matrice':i=>{const a=i+1,b=i%4+1;return i%2?T(`A are liniile (1,${a}), (0,1). Scrie inversa linie cu linie.`,[1,-a,0,1],'Aplică formula de ordin 2.',[`det A=1.`,`A⁻¹ are liniile (1,${-a}), (0,1).`]):T(`A are liniile (1,${a},0), (0,1,${b}), (0,0,1). Scrie cele 9 elemente ale inversei, linie cu linie.`,[1,-a,a*b,0,1,-b,0,0,1],'Anulează elementele de deasupra diagonalei în AA⁻¹.',[`Pe diagonală punem 1.`,`Pozițiile (1,2) și (2,3) sunt ${-a} și ${-b}.`,`Pentru (1,3), t+${a}·(${-b})=0, deci t=${a*b}.`,`Produsul este I.`]);},
 'numar-matrice':i=>{const q=[2,3,5,7,49][i%5],part=i%3;const total=(q*q-1)*(q*q-q);return N(part===0?`Corpul K are ${q} elemente. Câte matrice inversabile 2×2 există peste K?`:part===1?`Peste un corp cu ${q} elemente, câte alegeri are prima coloană a unei matrice inversabile 2×2?`:`Peste un corp cu ${q} elemente, după prima coloană nenulă, câte alegeri are a doua pentru inversabilitate?`,part===0?total:part===1?q*q-1:q*q-q,'Exclude coloanele care produc dependență.',[`Prima: ${q*q}-1=${q*q-1} alegeri.`,`A doua: ${q*q}-${q}=${q*q-q} alegeri.`,`Produs: ${total}.`]);}};
export function configureCurriculum(chapters,lessons){
 lessons.push(...newLessons);
 const map=new Map(lessons.map(l=>[l.id,l])),ordered=[];
 chapters.splice(0,chapters.length,...plan.map(([id,title,subtitle])=>({id,title,subtitle,icon:{modulo:'≡',grupuri:'G',permutari:'σ',inele:'K',matrice:'A',aplicatii:'φ'}[id],priority:true})));
 for(const [chapter,,,ids] of plan)for(const id of ids){const lesson=map.get(id);if(!lesson)throw Error('Missing course lesson: '+id);lesson.chapter=chapter;ordered.push(lesson);}
 const seen=new Set();
 for(const lesson of ordered){lesson.prerequisites=(lesson.prerequisites||[]).filter(id=>seen.has(id));seen.add(lesson.id);}
  ordered[0].prerequisites=[];
 const byId=new Map(ordered.map(l=>[l.id,l]));
 const needs={resturi:['grup'],opus:['resturi'],euclid:['resturi'],invers:['euclid','opus'],'ordin-aditiv':['grup','euclid'],'ordin-multiplicativ':['invers','euler-fermat'],'produs-ordine':['ordin-aditiv','ordin-multiplicativ'],primalitate:['produs-ordine'],'logaritm-discret':['ordin-multiplicativ'],cicluri:['grup'],compunere:['cicluri'],signatura:['compunere'],'ordin-permutare':['cicluri','ordin-multiplicativ'],'puteri-permutari':['ordin-permutare','signatura'],corp:['invers','grup'],'unitati-radical':['corp'],corp49:['corp','invers'],polinoame:['corp49'],'impartire-polinoame':['polinoame'],det2:['corp'],det3:['det2'],'det-recurenta':['det3','operatii-linii'],'inversa-matrice':['det3','matrice-modulare'],'numar-matrice':['inversa-matrice','corp49']};
 for(const [id,prerequisites] of Object.entries(needs))byId.get(id).prerequisites=prerequisites;
 byId.get('impartire-polinoame').title='Rădăcini, factori și completitudinea răspunsului';
 map.get('puteri').exercises[0].steps=['3²≡2, 3⁴≡4, 3⁸≡2, 3¹⁶≡4 modulo 7.','20=16+4, deci 3²⁰≡4·4=16≡2.'];
 applyCourseExplanations(ordered);
 lessons.splice(0,lessons.length,...ordered);
}
const guided={
 grup:[C('În grupul (G,★), ce reprezintă ★?','Operația definită pe elementele lui G','Numărul de elemente al lui G',['G este mulțimea.','★ este regula care combină două elemente.']),N('În grupul (ℤ,+), care este elementul neutru?',0,'Caută e cu a+e=a pentru orice a.',['Adunarea lui 0 păstrează orice a.','Neutrul este 0.'])],
 resturi:[C('Cum citim 17≡2 (mod 5)?','17 și 2 au același rest la împărțirea cu 5','17 și 2 sunt același întreg',['17−2=15 este multiplu de 5.','Congruența compară clasele de resturi.']),N('În ℤ₇, ce reprezentant din {0,…,6} are clasa lui −3?',4,'Adaugă 7.',['−3+7=4.','4 este în intervalul cerut.'])],
 opus:[N('Găsește x∈{0,…,222} cu 75+x≡0 (mod 223).',148,'Cauți opusul pentru adunare.',['x≡−75≡148.','75+148=223≡0.'])],
 invers:[C('În 7x≡1 (mod 11), ce căutăm?','Inversul multiplicativ al lui 7 modulo 11','Opusul lui 7 modulo 11',['Produsul trebuie să fie 1.','Opusul rezolvă o sumă egală cu 0.']),N('Care x∈{0,…,10} satisface 7x≡1 (mod 11)?',8,'Caută un produs 7x cu restul 1.',['7·8=56=5·11+1.','Deci x=8.'])],
 'ordin-aditiv':[C('La ordinul lui ā în (ℤₙ,+), ce condiție are primul k>0?','ka≡0 (mod n)','a^k≡1 (mod n)',['Repetăm adunarea.','k repetări dau ka și trebuie să ajungă la 0.'])],
 'ordin-multiplicativ':[N('În U(ℤ₇), ce ordin trebuie să aibă un generator?',6,'Un generator parcurge toate clasele nenule.',['Sunt 7−1=6 clase nenule.','Ordinul cerut este 6.']),C('Ce înseamnă ord(a)=6 într-un grup multiplicativ?','6 este cel mai mic exponent pozitiv cu a⁶=1','a are valoarea numerică 6',['Ordinul numără repetări ale operației.','Nu este valoarea elementului.'])],
 cicluri:[N('Pentru σ=(1 4 2), cât este σ(4)?',2,'Urmărește următoarea poziție din ciclu.',['1 merge la 4, 4 la 2 și 2 la 1.','σ(4)=2.'])],
 compunere:[N('σ=(1 2 3), τ=(1 2). Cât este (σ∘τ)(1)?',3,'Aplici întâi τ.',['τ(1)=2.','σ(2)=3.'])],
 puteri:[N('Pentru a calcula 3^13 prin pătrări, care este cel mai mare exponent dintre 1,2,4,8 folosit în 13=8+4+1?',8,'Descompunerea exponentului arată ce puteri păstrezi.',['13=8+4+1.','Folosim 3⁸,3⁴,3¹.'])],
 signatura:[N('Care este signatura permutării (1 3 5 2)?',-1,'Folosește (−1)^(k−1).',['k−1=3 este impar.','Signatura este −1.'])],
 'ordin-permutare':[N('O permutare are cicluri disjuncte de lungimi 2 și 3. Care este ordinul?',6,'Cauți primul multiplu comun pozitiv.',['Multiplii lui 2: 2,4,6.','Multiplii lui 3: 3,6.','CMMMC=6.'])],
 corp:[C('În ℤ₆, 2·3=0 cu ambii factori nenuli. Ce deducem?','ℤ₆ nu este corp','ℤ₆ este corp fiindcă are elementul 1',['Într-un corp un produs nul are un factor nul.','Exemplul contrazice această proprietate.'])],
 polinoame:[N('Pentru f(X)=X²+1 în ℤ₇, calculează f(3) ca rest canonic.',3,'Înlocuiește X cu 3.',['f(3)=9+1=10.','10≡3 modulo 7, deci 3 nu este rădăcină.'])],
 patratice:[C('Pentru x²=d în ℤₚ, ce verificăm?','Dacă d este pătratul unui element din ℤₚ','Dacă reprezentantul întreg al lui d este pozitiv',['Lucrăm în corpul din cerință.','Semnul reprezentantului nu decide existența rădăcinilor.'])],
 det2:[N('A are liniile (2,1),(3,4). Cât este det A?',5,'Aplică ad−bc.',['2·4=8.','1·3=3.','8−3=5.'])],
 rang:[N('A are liniile (1,2),(2,4). Care este rangul peste ℝ?',1,'A doua linie este de două ori prima.',['Prima este nenulă.','A doua nu adaugă informație independentă.','Rangul este 1.'])],
 sisteme:[C('det A=0. Putem concluziona imediat că sistemul nu are soluții?','Nu; comparăm rangurile lui A și (A|b)','Da; determinantul zero exclude toate soluțiile',['Cramer nu se aplică.','Pot exista fie nicio soluție, fie mai multe soluții.'])],
 'logaritm-discret':[N('Diffie–Hellman: p=23, g=5, a=6, B=19. Ana calculează B^a modulo p. Care este cheia comună?',2,'Calculează 19^6 prin pătrări modulo 23.',['19²≡16; 19⁴≡3.','19⁶≡3·16=48≡2.'])],
 'matrice-modulare':[T('Criptare cu A=((3,3),(2,5)) și coloana mesajului (7,8), modulo 26. Scrie coloana criptată.',[19,2],'Înmulțește fiecare linie cu coloana și redu modulo 26.',['3·7+3·8=45≡19.','2·7+5·8=54≡2.'])],
 crt:[C('x≡2 (mod 3) și x≡1 (mod 5). Ce verifică răspunsul?','Ambele condiții simultan','Este suficientă prima condiție',['Necunoscuta este aceeași.','Căutăm intersecția condițiilor.'])]
};
export function addGuidedExercises(lessons){
  const powers=lessons.find(l=>l.id==='puteri'),product=lessons.find(l=>l.id==='produs-ordine');
 const orderQuestion=powers.exercises.find(e=>e.id==='puteri-2');
 if(orderQuestion){powers.exercises=powers.exercises.filter(e=>e!==orderQuestion);orderQuestion.lesson=product.id;orderQuestion.chapter=product.chapter;product.exercises.push(orderQuestion);}
 for(const lesson of lessons){lesson.exercises=lesson.exercises.filter(ex=>!ex.prompt.includes('obligatoriu ireductibil'));const items=guided[lesson.id]||[];for(const [i,ex] of items.entries()){ex.id=lesson.id+'-guided-'+(i+1);ex.lesson=lesson.id;ex.chapter=lesson.chapter;ex.stage='Înțelegerea cerinței';}lesson.exercises.unshift(...items);}
}
