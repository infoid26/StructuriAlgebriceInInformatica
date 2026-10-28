import {addPracticeBank} from './practice-bank.js';
import {addFoundations} from './fundamente.js';
import {extendCourse} from './completari.js';
const N=(prompt,answer,hint,steps)=>({kind:'number',prompt,answer,hint,steps});
const S=(prompt,answer,hint,steps)=>({kind:'set',prompt,answer,hint,steps});
const T=(prompt,answer,hint,steps)=>({kind:'tuple',prompt,answer,hint,steps});
const P=(prompt,answer,hint,steps,modulus)=>({kind:'poly',prompt,answer,hint,steps,modulus});
const C=(prompt,options,answer,hint,steps)=>({kind:'choice',prompt,options,answer,hint,steps});
const D=(prompt,rubric,steps)=>({kind:'proof',prompt,rubric,steps,hint:rubric[0]});
const L=(id,chapter,title,goal,theory,worked,exercises,trap,prerequisites=[])=>({id,chapter,title,goal,theory,worked,exercises,trap,prerequisites,minutes:12});
export const chapters=[
{id:'limbaj',title:'Limbajul algebrei',subtitle:'Mulțimi, funcții și operații. Începem de la simboluri.',icon:'∈',priority:false},
{id:'modulo',title:'Aritmetica modulară',subtitle:'Resturi, Euclid și inversul modular. Prima familie de subiecte.',icon:'≡',priority:true},
{id:'grupuri',title:'Grupuri și ordine',subtitle:'De ce funcționează formulele și când le poți aplica.',icon:'G',priority:true},
{id:'permutari',title:'Permutări',subtitle:'Cicluri, compunere, ordin și signatură.',icon:'σ',priority:true},
{id:'structura',title:'Structura grupurilor',subtitle:'Subgrupuri, Lagrange, morfisme și demonstrații.',icon:'H',priority:false},
{id:'inele',title:'Inele, corpuri și polinoame',subtitle:'Calcul în corpuri finite și rădăcinile din examen.',icon:'𝔽',priority:true},
{id:'matrice',title:'Determinanți și sisteme',subtitle:'De la ad − bc la matrice 0/1 și discuții după parametru.',icon:'Δ',priority:true},
{id:'aplicatii',title:'Congruențe și aplicații',subtitle:'Resturi chinezești, RSA și numărare din rezumat.',icon:'↗',priority:false}
];
export const lessons=[
L('multimi','limbaj','Cum citim o mulțime','Să poți citi ∈, ⊆, ∩ și ∪ fără să ghicești.',[
['Sensul simbolurilor','O mulțime este o colecție de elemente distincte. x ∈ A înseamnă că x este un element al lui A. A ⊆ B înseamnă că fiecare element din A se află și în B. |A| este numărul elementelor, dacă A este finită.'],
['Operații','A ∩ B păstrează elementele comune. A ∪ B adună elementele din ambele mulțimi, fiecare o singură dată. A ∖ B păstrează elementele din A care nu sunt în B. ∅ este mulțimea fără elemente.'],
['Exemplu mic','Pentru A={1,2,3} și B={3,4}, intersecția este {3}, reuniunea este {1,2,3,4}, iar A ∖ B={1,2}. Ordinea elementelor nu contează.']
],{prompt:'A={0,1,2,3}, B={2,3,4}. Găsește A ∩ B.',steps:['Verificăm pe rând elementele lui A.','2 și 3 apar și în B.','A ∩ B={2,3}.']},[
S('A={1,2,3,4}, B={2,4,6}. Scrie A ∩ B.',[2,4],'Păstrează doar elementele prezente în ambele mulțimi.',['2 și 4 se află în A și în B. Rezultatul este {2,4}.']),
N('Câte elemente are {1,1,2,2,3}?',3,'Repetarea unui element nu mărește mulțimea.',['Elementele distincte sunt 1,2,3. Cardinalul este 3.'])
],'Un element și o submulțime sunt lucruri diferite: 2 ∈ A, dar {2} ⊆ A.'),
L('functii','limbaj','Funcții și bijecții','Să distingi injectivitatea, surjectivitatea și inversa unei funcții.',[
['Intrare și ieșire','O funcție f:A→B asociază fiecărui element din A exact un element din B. A este domeniul; B este codomeniul. Imaginea este mulțimea valorilor efectiv obținute.'],
['Trei proprietăți','Injectivă: două intrări diferite au ieșiri diferite. Surjectivă: fiecare element din codomeniu este atins. Bijectivă: ambele proprietăți. Numai o bijecție are o funcție inversă pe întreg codomeniul.'],
['Compunere','(f ∘ g)(x)=f(g(x)): aplici mai întâi funcția din dreapta. Pentru f(x)=x+1 și g(x)=2x, f(g(3))=7.']
],{prompt:'f:{1,2,3}→{1,2,3}, f(1)=2, f(2)=3, f(3)=1. Cât este f⁻¹(2)?',steps:['Inversa caută intrarea care produce 2.','f(1)=2, deci f⁻¹(2)=1.']},[
N('f(x)=x+1, g(x)=2x pe ℤ. Calculează (f ∘ g)(4).',9,'Aplică g, apoi f.',['g(4)=8; f(8)=9.']),
C('Funcția f:ℤ→ℤ, f(x)=2x este:',[{id:'a',label:'Injectivă, dar nu surjectivă'},{id:'b',label:'Bijectivă'},{id:'c',label:'Surjectivă, dar nu injectivă'}],'a','Poți obține un număr impar ca ieșire?',['Din 2x=2y rezultă x=y. Dar 1 nu este imaginea niciunui întreg.'])
],'Ordinea compunerii contează. Citește f ∘ g de la dreapta la stânga.',['multimi']),
L('echivalenta','limbaj','Relații și clase de echivalență','Să înțelegi de ce numere diferite pot reprezenta aceeași clasă.',[
['O relație','O relație pe A spune care perechi de elemente sunt legate. O echivalență este reflexivă (a∼a), simetrică (a∼b ⇒ b∼a) și tranzitivă (a∼b, b∼c ⇒ a∼c).'],
['Clase','Clasa lui a conține toate elementele echivalente cu a. Clasele sunt disjuncte sau identice și acoperă mulțimea inițială.'],
['Congruența','a≡b (mod n) înseamnă n | (a−b). Astfel 2,7,12 sunt în aceeași clasă modulo 5. Reprezentanții canonici sunt 0,1,…,n−1.']
],{prompt:'În ce clasă modulo 4 se află 14?',steps:['14=3·4+2.','Clasa lui 14 este aceeași cu a lui 2.']},[
N('Scrie reprezentantul din {0,1,2,3,4} al clasei lui 17 modulo 5.',2,'Împarte cu rest: 17=3·5+?.',['17=3·5+2, deci 17≡2 (mod 5).']),
C('Relația a∼b ⇔ a≤b pe ℤ este o echivalență?',[{id:'a',label:'Da'},{id:'b',label:'Nu, nu este simetrică'}],'b','1≤2, dar este adevărat și 2≤1?',['Reflexivitatea și tranzitivitatea nu sunt suficiente: simetria lipsește.'])
],'Egalitatea claselor nu înseamnă egalitatea reprezentanților ca întregi.',['multimi']),
L('operatii','limbaj','Operații, neutru și invers','Să identifici operația înainte să calculezi inversul.',[
['Închidere','O operație pe G este o funcție G×G→G. Dacă rezultatul iese din G, nu este o operație internă pe G. Scăderea nu este internă pe ℕ.'],
['Asociativ și comutativ','Asociativ: (a*b)*c=a*(b*c). Comutativ: a*b=b*a. Sunt proprietăți diferite. În compunerea funcțiilor există asociativitate, dar nu întotdeauna comutativitate.'],
['Neutrul și inversul','Neutrul e satisface e*a=a*e=a. Inversul lui a este b cu a*b=b*a=e. La adunare, neutrul este 0 și inversul este opusul; la înmulțire, neutrul este 1.']
],{prompt:'Pe ℤ, a*b=a+b+2. Găsește neutrul.',steps:['Cerem a*e=a.','a+e+2=a ⇒ e=−2.','Verificăm și e*a=a.']},[
N('Pentru a*b=a+b+2 pe ℤ, care este inversul lui 3?',-7,'Produsul trebuie să fie neutrul −2.',['3+b+2=−2 ⇒ b=−7.']),
C('Care condiție exprimă asociativitatea?',[{id:'a',label:'(a*b)*c=a*(b*c)'},{id:'b',label:'a*b=b*a'},{id:'c',label:'a*a=a'}],'a','Se mută parantezele, fără să schimbi ordinea elementelor.',['Prima condiție este asociativitatea; a doua este comutativitatea.'])
],'Inversul depinde de operație. Nu înlocui automat „invers” cu 1/a.',['functii']),
L('resturi','modulo','Calculăm modulo n','Să reduci numere pozitive și negative la un rest corect.',[
['Ce păstrăm','Modulo n păstrăm doar restul împărțirii la n. Pentru n>0, reprezentantul cerut este între 0 și n−1.'],
['Numere negative','−7≡3 (mod 5), fiindcă −7=(−2)·5+3. Poți aduna multipli ai modulului până intri în interval.'],
['Calcul scurt','Reduci după fiecare adunare sau înmulțire: 17·19≡2·4≡3 (mod 5). La puteri folosești același principiu. Împărțirea necesită un invers și nu este întotdeauna permisă.']
],{prompt:'Calculează −23 modulo 7.',steps:['−23+28=5.','5 se află între 0 și 6, deci acesta este reprezentantul canonic.']},[
N('Care este reprezentantul canonic al lui −38 modulo 11?',6,'Adună un multiplu al lui 11.',['−38+44=6.']),
N('Calculează 17·19+8 modulo 7. Scrie restul canonic.',2,'Redu 17, 19 și 8 modulo 7.',['17≡3, 19≡5, 8≡1; 3·5+1=16≡2.'])
],'Un rest canonic nu este negativ. Pentru modulul 7, răspunsul este în {0,…,6}.',['echivalenta']),
L('euclid','modulo','CMDC și algoritmul lui Euclid','Să găsești cel mai mare divizor comun fără factorizări lungi.',[
['Divizibilitate','d | a înseamnă a=d·k pentru un întreg k. CMDC(a,b), notat și gcd(a,b), este cel mai mare divizor comun pozitiv, când a și b nu sunt ambele zero.'],
['Algoritmul','Dacă a=q·b+r, atunci gcd(a,b)=gcd(b,r). Repeți până când restul devine 0. Ultimul rest nenul este CMDC.'],
['Bézout','Există întregi u,v astfel încât ua+vb=gcd(a,b). Îi obții prin substituție înapoi. Dacă CMDC este 1, numerele sunt prime între ele.']
],{prompt:'Găsește gcd(75,223).',steps:['223=2·75+73.','75=1·73+2.','73=36·2+1.','2=2·1+0, deci gcd=1.']},[
N('Calculează gcd(84,30).',6,'84=2·30+24. Continuă.',['30=1·24+6; 24=4·6. Ultimul rest nenul este 6.']),
N('Calculează gcd(52,100).',4,'100=1·52+48.',['52=1·48+4; 48=12·4. CMDC=4.'])
],'Nu confunda CMDC (divizor) cu CMMMC (multiplu).',['resturi']),
L('opus','modulo','Inversul aditiv','Să rezolvi a+x≡0 fără algoritmi inutili.',[
['Grupul aditiv','În (ℤₙ,+), neutrul este clasa lui 0. Inversul aditiv al lui a este clasa lui −a. Există pentru orice clasă, indiferent dacă n este prim.'],
['Metoda','Pentru a+x≡0 (mod n), scrii x≡−a și reduci în {0,…,n−1}.'],
['Deosebirea esențială','a+x≡0 cere opusul. a·x≡1 cere inversul multiplicativ. Citește semnul operației înainte de a folosi formula.']
],{prompt:'75+x≡0 (mod 223), 0≤x≤222.',steps:['x≡−75 (mod 223).','−75+223=148.','75+148=223≡0.']},[
N('11+x≡0 (mod 101). Scrie x în {0,…,100}.',90,'Cauți opusul lui 11, apoi îl reduci.',['x≡−11≡90; 11+90=101.']),
N('8+x≡0 (mod 12). Scrie x în {0,…,11}.',4,'Nu trebuie ca 8 să fie prim cu 12 pentru un invers aditiv.',['−8+12=4.'])
],'Orice element are invers aditiv în ℤₙ; nu orice element are invers multiplicativ.',['resturi']),
L('invers','modulo','Inversul multiplicativ, pas cu pas','Să calculezi a⁻¹ modulo n prin Euclid și substituție.',[
['Când există','Inversul lui a modulo n este x cu ax≡1 (mod n). Există exact când gcd(a,n)=1. Elementele inversabile formează U(ℤₙ).'],
['Substituția înapoi','Scrii împărțirile lui Euclid până la restul 1. Izolezi ultimul rest 1, apoi înlocuiești resturile precedente până exprimi 1 ca ua+vn. Atunci x≡u (mod n).'],
['Verificarea finală','Înlocuiești răspunsul și verifici ax≡1. Dacă intervalul este 0,…,n−1, reduci și coeficientul u la reprezentantul canonic.']
],{prompt:'Găsește inversul lui 75 modulo 223.',steps:['223=2·75+73; 75=73+2; 73=36·2+1.','1=73−36·2.','Înlocuim 2=75−73: 1=37·73−36·75.','Înlocuim 73=223−2·75: 1=37·223−110·75.','x≡−110≡113 (mod 223). Verificare: 75·113=8475=38·223+1.']},[
N('Calculează inversul lui 11 modulo 101, în {0,…,100}.',46,'101=9·11+2; 11=5·2+1.',['1=11−5·2=11−5(101−9·11)=46·11−5·101. Inversul este 46.']),
N('Calculează inversul lui 17 modulo 107, în {0,…,106}.',63,'107=6·17+5; 17=3·5+2; 5=2·2+1.',['1=5−2·2=7·5−2·17=7·107−44·17. −44≡63.']),
C('Există inversul multiplicativ al lui 6 modulo 15?',[{id:'a',label:'Da'},{id:'b',label:'Nu'}],'b','Calculează gcd(6,15).',['gcd(6,15)=3≠1; inversul nu există.'])
],'Nu lua pur și simplu 1/75 ca număr real: lucrezi în clase de resturi.',['euclid','opus']),
L('congruente','modulo','Ecuații ax≡b și împărțirea corectă','Să recunoști când există mai multe soluții.',[
['Condiția','Pentru ax≡b (mod n), notezi d=gcd(a,n). Există soluții dacă și numai dacă d divide b. Dacă există, sunt exact d clase de soluții modulo n.'],
['Reducerea','Împarți a,b și n la d, nu numai a și b. Rezolvi (a/d)x≡b/d (mod n/d), unde a/d este inversabil. Ridici soluțiile la modulul inițial.'],
['Exemplu','6x≡8 (mod 14). d=2; reducem la 3x≡4 (mod 7). Inversul lui 3 este 5, deci x≡6 (mod 7). În 0,…,13 obținem x=6 și x=13.']
],{prompt:'Rezolvă 4x≡2 (mod 6).',steps:['d=gcd(4,6)=2, iar 2 divide 2.','Împărțim inclusiv modulul: 2x≡1 (mod 3).','x≡2 (mod 3), deci soluțiile canonice modulo 6 sunt {2,5}.']},[
S('Rezolvă 6x≡8 (mod 14). Scrie toate soluțiile în {0,…,13}.',[6,13],'După împărțirea la 2, modulul devine 7.',['3x≡4 (mod 7) ⇒ x≡6 (mod 7). Reprezentanții sunt 6,13.']),
S('Rezolvă 6x≡5 (mod 15). Scrie ∅ dacă nu există soluții.',[],'gcd(6,15)=3. Divide 3 termenul 5?',['3 nu divide 5, deci nu există soluții.'])
],'Din 2x≡2y (mod 6) nu rezultă x≡y (mod 6). Poți anula 2 numai schimbând modulul la 3.',['invers']),
L('grup','grupuri','Ce este un grup?','Să verifici definiția cu exemple și contraexemple.',[
['Definiția','Un grup (G,*) are o operație internă asociativă, un element neutru și un invers pentru fiecare element. Dacă operația este și comutativă, grupul este abelian.'],
['Exemple','(ℤ,+) este grup. (ℕ,+) nu este grup: lipsesc inversele aditive ale numerelor pozitive. (ℤ∖{0},·) nu este grup: inversul lui 2 nu este întreg. (ℚ∖{0},·) este grup.'],
['Monoizi','Un monoid are asociativitate și neutru, dar nu cere inverse pentru toate elementele. De exemplu (ℕ₀,+) este monoid. Un semigrup cere doar asociativitate.']
],{prompt:'Este (ℤ₈,+) un grup?',steps:['Adunarea claselor este internă și asociativă.','Neutrul este 0. Inversul aditiv al lui a este −a modulo 8.','Da; în plus, este abelian.']},[
C('Care structură este grup?',[{id:'a',label:'(ℤ,+)'},{id:'b',label:'(ℤ,·)'},{id:'c',label:'(ℕ₀,+)'}],'a','Verifică existența inversului pentru fiecare element.',['În (ℤ,+), inversul lui a este −a. În celelalte variante există elemente fără invers.']),
N('Care este neutrul grupului (U(ℤ₁₂),·)?',1,'Neutrul trebuie să lase fiecare element neschimbat la înmulțire.',['Neutrul multiplicativ este clasa lui 1.'])
],'Comutativitatea nu face parte din definiția oricărui grup.',['operatii','invers']),
L('ordin-aditiv','grupuri','Ordinul într-un grup aditiv','Să găsești cel mai mic număr de repetări până la 0.',[
['Ce număr căutăm','Ordinul lui a în (ℤₙ,+) este cel mai mic k>0 cu k·a≡0 (mod n). Nu este valoarea lui a și nu este întotdeauna n.'],
['Formula explicată','ord(a)=n/gcd(a,n). Dacă a=d·a′ și n=d·n′ cu gcd(a′,n′)=1, condiția n | ka este echivalentă cu n′ | k. Cel mai mic k pozitiv este n′.'],
['Zero','Elementul neutru are ordinul 1: o singură adunare a lui 0 produce 0.']
],{prompt:'Calculează ord(52) în (ℤ₁₀₀,+).',steps:['gcd(52,100)=4.','ord(52)=100/4=25.','25·52=1300 este multiplu de 100, iar formula garantează minimalitatea.']},[
N('Calculează ord(6) în (ℤ₃₀,+).',5,'Aplică n/gcd(a,n), după ce verifici operația +.',['gcd(6,30)=6 ⇒ ord=30/6=5.']),
N('Calculează ord(75) în (ℤ₂₂₃,+).',223,'223 este prim și nu divide 75.',['gcd(75,223)=1 ⇒ ord=223.']),
N('Care este ordinul lui 0 în (ℤ₁₂,+)?',1,'Ordinul este strict pozitiv.',['Neutrul are ordinul 1.'])
],'Formula n/gcd(a,n) este pentru grupul aditiv ℤₙ; nu o aplica ordinului multiplicativ.',['grup','euclid']),
L('ordin-multiplicativ','grupuri','Ordinul multiplicativ','Să demonstrezi că un exponent este cel mai mic posibil.',[
['Definiție','În U(ℤₙ), ord(a) este cel mai mic k>0 cu aᵏ≡1 (mod n). Întâi verifici gcd(a,n)=1. Dacă nu este 1, a nu este în acest grup.'],
['Lista scurtă de candidați','Ordinul divide φ(n), cardinalul lui U(ℤₙ). Pentru p prim, φ(p)=p−1. Testezi divizorii, nu toate numerele până la n.'],
['Minimalitate','Dacă a³⁷≡1 și 37 este prim, ordinul divide 37. Excluzi ordinul 1 prin a≢1 și obții ordinul 37. Un exponent care produce 1 nu este automat ordinul.']
],{prompt:'Calculează ord(2) în U(ℤ₂₂₃).',steps:['φ(223)=222=2·3·37.','Prin ridicări succesive: 2⁸≡33, 2¹⁶≡197≡−26, 2³²≡7 (mod 223).','2³⁷=2³²·2⁴·2≡7·16·2=224≡1.','Ordinul divide 37. Cum 2≢1 și 37 este prim, ord(2)=37.']},[
N('Calculează ord(6) în U(ℤ₂₃).',11,'Divizorii lui 22 sunt 1,2,11,22.',['6²≡13, 6⁴≡8, 6⁸≡18; 6¹¹≡18·13·6≡1. Cum 11 este prim și 6≢1, ordinul este 11.']),
N('Calculează ord(2) în U(ℤ₇).',3,'Calculează 2, 2² și 2³ modulo 7.',['2≢1; 4≢1; 8≡1. Ordinul este 3.'])
],'La înmulțire te întorci la 1. La adunare te întorci la 0.',['grup']),
L('puteri','grupuri','Puteri mari, calcule mici','Să reduci exponenți și să folosești ridicarea la pătrat.',[
['Pătrate succesive','Calculezi a², a⁴, a⁸, a¹⁶,… reducând modulo n la fiecare pas. Scrii exponentul ca sumă de puteri ale lui 2.'],
['Reducerea exponentului','Dacă ord(a)=d, atunci aᵏ=aʳ în grup, unde r este restul lui k la d. Trebuie să lucrezi cu un element al grupului.'],
['Ordinul unei puteri','Dacă ord(a)=d finit, atunci ord(aᵏ)=d/gcd(d,k). Exemplu: din ord(a)=12 rezultă ord(a⁸)=3.']
],{prompt:'Calculează 2¹⁰⁰ modulo 7.',steps:['ord(2)=3 în U(ℤ₇).','100≡1 (mod 3), deci 2¹⁰⁰≡2.']},[
N('Calculează restul lui 3²⁰ la împărțirea cu 7.',2,'3⁶≡1 (mod 7), iar 20=3·6+2.',['3²⁰≡3²≡9≡2.']),
N('Dacă ord(a)=12, cât este ord(a⁸)?',3,'Folosește d/gcd(d,k).',['12/gcd(12,8)=12/4=3.'])
],'Nu calcula întâi un număr uriaș ca număr în virgulă mobilă; redu după fiecare pas.',['ordin-multiplicativ']),
L('euler-fermat','grupuri','Euler, Fermat și Wilson','Să alegi teorema potrivită și să-i verifici ipotezele.',[
['Euler','Dacă gcd(a,n)=1, atunci a^φ(n)≡1 (mod n). Formula φ(n)=n·∏(1−1/p) folosește fiecare divizor prim distinct o singură dată.'],
['Fermat','Pentru p prim și p∤a, a^(p−1)≡1 (mod p). Este cazul particular al lui Euler pentru un modul prim. Fără condiția p∤a, forma a^p≡a rămâne valabilă.'],
['Wilson','Pentru p prim, (p−1)!≡−1 (mod p). În (p−1)! numerele se pot împerechea cu inversele lor; rămân 1 și −1.']
],{prompt:'Care sunt ultimele două cifre ale lui 37⁷⁹?',steps:['gcd(37,100)=1; φ(100)=40.','37⁸⁰≡1, deci 37⁷⁹ este inversul lui 37 modulo 100.','37·73=2701≡1 ⇒ ultimele două cifre sunt 73.']},[
N('Calculează φ(100).',40,'100=2²·5², deci folosești p=2 și p=5 o singură dată.',['φ(100)=100(1−1/2)(1−1/5)=40.']),
N('Care este restul lui 10! la împărțirea cu 11?',10,'11 este prim. Aplică Wilson.',['10!≡−1≡10 (mod 11).']),
N('Care este restul lui 2¹⁰ la împărțirea cu 11?',1,'11 este prim și 11 nu divide 2.',['Din Fermat, 2¹⁰≡1.'])
],'φ(n) nu este n−1 decât dacă n este prim. Verifică și coprimalitatea înainte de Euler.',['puteri']),
L('cicluri','permutari','Citim o permutare în cicluri','Să urmărești traseul fiecărui element.',[
['Ce este o permutare','O permutare din Sₙ este o bijecție a mulțimii {1,…,n} cu ea însăși. Pe linia a doua a unui tabel găsești imaginea fiecărui element de pe prima linie.'],
['Construirea ciclului','Pornești de la un element: urmărești imaginea lui, apoi imaginea imaginii, până revii la început. Repeți cu un element încă nefolosit.'],
['Cicluri disjuncte','(1 3 2) înseamnă 1→3, 3→2, 2→1. Un element care rămâne pe loc este un ciclu de lungime 1, uneori omis în scriere. Ciclurile disjuncte comută.']
],{prompt:'σ are imaginile [2,3,1,5,4]. Descompune în cicluri.',steps:['1→2→3→1 produce (1 2 3).','4→5→4 produce (4 5).','σ=(1 2 3)(4 5).']},[
N('Pentru σ=(1 3 2)(4 5), cât este σ(3)?',2,'Urmărește următorul element din ciclul care conține 3.',['În (1 3 2), 3 este trimis în 2.']),
T('σ are imaginile [2,3,1]. Scrie imaginile lui σ⁻¹, în ordinea intrărilor 1,2,3.',[3,1,2],'Întreabă-te cine ajunge în 1, cine în 2 și cine în 3.',['σ(3)=1, σ(1)=2, σ(2)=3; inversa are imaginile [3,1,2].'])
],'Ciclul (1 2 3) nu este o listă de valori independente; descrie săgeți.',['functii','grup']),
L('compunere','permutari','Compunem de la dreapta la stânga','Să calculezi produsul a două permutări care nu sunt disjuncte.',[
['Convenția','În acest curs (σ ∘ τ)(i)=σ(τ(i)). Întâi τ, apoi σ. Dacă la examen se anunță altă convenție, adaptezi calculul explicit.'],
['Metoda sigură','Construiești un tabel: intrare i, valoare τ(i), apoi valoare σ(τ(i)). Din ultima coloană poți scrie ciclurile.'],
['Nu concatena','Pentru σ=(1 2), τ=(2 3), produsul σ ∘ τ este ciclul (1 2 3), nu două cicluri disjuncte.']
],{prompt:'σ=(1 2), τ=(2 3) în S₃. Calculează σ ∘ τ.',steps:['1→τ(1)=1→σ(1)=2.','2→3→3.','3→2→1.','Imaginile sunt [2,3,1], deci (1 2 3).']},[
T('σ=(1 2), τ=(2 3). Scrie imaginile lui τ ∘ σ pentru intrările 1,2,3.',[3,1,2],'Aplici de această dată întâi σ.',['1→2→3; 2→1→1; 3→3→2. Imaginile sunt [3,1,2].']),
N('σ=(1 2 3). Cât este σ²(1)?',3,'Aplică σ de două ori.',['1→2→3, deci σ²(1)=3.'])
],'Nu folosi CMMMC al lungimilor unor cicluri care se intersectează, înainte să compui.',['cicluri']),
L('ordin-permutare','permutari','Ordinul unei permutări','Să folosești CMMMC pe cicluri disjuncte.',[
['Fiecare ciclu revine separat','Un ciclu de lungime k revine la identitate după exact k aplicări. Pentru toate ciclurile simultan, exponentul trebuie să fie multiplu al fiecărei lungimi.'],
['Formula','Ordinul unei permutări este CMMMC al lungimilor ciclurilor disjuncte. De exemplu, lungimi 4 și 6 dau ordin 12, nu 24.'],
['Permutări definite modular','Dacă σ(i) este restul lui a·i modulo p, pentru i=1,…,p−1, cu p prim și a nenul modulo p, atunci σᵏ(i)≡aᵏi. Ordinul lui σ este ord(a) în U(ℤₚ).']
],{prompt:'Calculează ord((1 5)(2 4 3)) în S₅.',steps:['Ciclurile sunt disjuncte, de lungimi 2 și 3.','CMMMC(2,3)=6.','După 6 aplicări toate elementele revin pe loc.']},[
N('σ are cicluri disjuncte de lungimi 4,6 și 1. Care este ordinul?',12,'Cauți cel mai mic multiplu comun.',['CMMMC(4,6,1)=12.']),
N('Pe {1,…,6}, σ(i)≡2i (mod 7). Care este ordinul lui σ?',3,'σᵏ(i)≡2ᵏi; folosește i=1 pentru necesitate.',['ord(σ)=ord(2 mod 7)=3.'])
],'Ordinul nu este suma lungimilor și nici produsul lor în toate cazurile.',['compunere','ordin-multiplicativ']),
L('signatura','permutari','Signatura și inversiunile','Să decizi dacă o permutare este pară sau impară.',[
['Din cicluri','Un ciclu de lungime k are signatura (−1)^(k−1). Înmulțești semnele ciclurilor. O transpoziție are signatura −1.'],
['Din tabel','O inversiune este o pereche i<j pentru care σ(i)>σ(j). Dacă există m inversiuni, signatura este (−1)^m.'],
['Proprietăți','sgn(σ ∘ τ)=sgn(σ)·sgn(τ). Un ciclu de lungime 3 este par, chiar dacă numărul 3 este impar: exponentul formulei este k−1.']
],{prompt:'Calculează signatura lui (1 5)(2 4 3).',steps:['Ciclul de lungime 2 are semnul −1.','Ciclul de lungime 3 are semnul +1.','Produsul semnelor este −1.']},[
N('Care este signatura unui ciclu de lungime 4?',-1,'Folosește (−1)^(4−1).',['(−1)³=−1.']),
N('Permutarea are imaginile [3,1,2]. Care este signatura?',1,'Inversiunile sunt perechile cu o valoare mai mare înaintea uneia mai mici.',['Perechile sunt (1,2) și (1,3): două inversiuni, semn +1.'])
],'„Pară” descrie paritatea numărului de transpoziții, nu a ordinului permutării.',['cicluri'])
];
lessons.push(
L('subgrup','structura','Recunoaștem un subgrup','Să verifici un subgrup fără să repeți toate axiomele.',[
['Criteriul','O submulțime nevidă H⊆G este subgrup dacă pentru orice a,b∈H avem ab⁻¹∈H. În notație aditivă verifici a−b∈H.'],
['Un exemplu','2ℤ este subgrup al lui (ℤ,+): este nevid și diferența a două numere pare este pară. Numerele impare nu formează subgrup: nu conțin 0.'],
['Subgrup generat','⟨g⟩ conține puterile întregi ale lui g. Într-un grup aditiv, ⟨a⟩ conține multiplii întregi ai lui a.']
],{prompt:'Ce elemente are ⟨4⟩ în (ℤ₁₂,+)?',steps:['Adunăm repetat 4 modulo 12.','0,4,8, apoi 12≡0.','Subgrupul este {0,4,8}.']},[
S('Scrie ⟨6⟩ în (ℤ₁₈,+), folosind reprezentanți canonici.',[0,6,12],'Pornește de la 0 și adună 6 până revii.',['0→6→12→0, deci {0,6,12}.']),
C('Numerele impare formează subgrup al lui (ℤ,+)?',[{id:'a',label:'Da'},{id:'b',label:'Nu'}],'b','Orice subgrup trebuie să conțină neutrul.',['0 nu este impar; în plus, suma a două numere impare este pară.'])
],'H trebuie să fie nevid; închiderea scrisă pentru mulțimea vidă nu este suficientă.',['grup']),
L('lagrange','structura','Clase laterale și Lagrange','Să folosești divizibilitatea și să nu inversezi teorema.',[
['Clase laterale','Pentru H≤G, clasa stângă aH={ah:h∈H}. Toate clasele au |H| elemente și formează o partiție a grupului. Numărul claselor este indicele [G:H].'],
['Lagrange','Pentru G finit, |G|=[G:H]·|H|. În particular, |H| divide |G|, iar ordinul oricărui element divide |G|.'],
['Atenție la reciprocă','Teorema nu spune că pentru fiecare divizor d al lui |G| există un subgrup de ordin d. În grupuri ciclice această existență este adevărată, dar necesită un rezultat separat.']
],{prompt:'Un grup G are 30 de elemente, iar H are 5. Care este indicele?',steps:['[G:H]=|G|/|H|=30/5=6.','Există 6 clase laterale, fiecare cu 5 elemente.']},[
N('Dacă |G|=42 și |H|=7, calculează [G:H].',6,'Împarte cardinalul grupului la cardinalul subgrupului.',['42/7=6.']),
S('Care pot fi ordinele elementelor unui grup cu 15 elemente, conform restricției Lagrange?',[1,3,5,15],'Scrie toți divizorii pozitivi ai lui 15.',['Ordinul divide 15; candidații sunt {1,3,5,15}. Nu afirmăm că toți apar în orice grup.'])
],'Din gᵏ=e rezultă ord(g) | k, nu neapărat ord(g)=k.',['subgrup','ordin-multiplicativ']),
L('ciclic','structura','Grupuri ciclice și generatori','Să identifici elementele care generează tot grupul.',[
['Un singur generator','G este ciclic dacă G=⟨g⟩ pentru un element g. Un grup ciclic este abelian. Orice grup cu ordin prim este ciclic: un element nenul/neidentic cu neutrul are ordinul acelui prim.'],
['În ℤₙ','Grupul aditiv ℤₙ este ciclic. Clasa lui a este generator dacă gcd(a,n)=1, deoarece ordinul ei trebuie să fie n. Numărul generatorilor este φ(n).'],
['Subgrupuri','Un grup ciclic finit de ordin n are exact un subgrup de ordin d pentru fiecare divizor d al lui n. Acesta este generat de g^(n/d).']
],{prompt:'Generatorii aditivi ai lui ℤ₈?',steps:['Căutăm a din {0,…,7} cu gcd(a,8)=1.','Sunt 1,3,5,7.']},[
S('Scrie toți generatorii grupului aditiv ℤ₁₀.',[1,3,7,9],'Generatorii sunt clasele prime cu 10.',['1,3,7,9 sunt exact reprezentanții cu gcd(a,10)=1.']),
N('Câți generatori are un grup ciclic de ordin 12?',4,'Numărul este φ(12).',['φ(12)=12(1−1/2)(1−1/3)=4.'])
],'„Abelian” nu implică „ciclic”; de exemplu ℤ₂×ℤ₂ nu are element de ordin 4.',['lagrange']),
L('morfisme','structura','Morfisme, nucleu și imagine','Să urmărești ce păstrează o aplicație între grupuri.',[
['Operația se păstrează','Un morfism f:G→K satisface f(ab)=f(a)f(b). În grupuri aditive: f(a+b)=f(a)+f(b). Un izomorfism este un morfism bijectiv.'],
['Nucleu și imagine','ker(f)={g:f(g)=e_K}; Im(f)={f(g):g∈G}. Nucleul este subgrup normal, imaginea este subgrup. f este injectiv exact când ker(f)={e_G}.'],
['Exemplu finit','f:ℤ₁₂→ℤ₄, f([a]₁₂)=[a]₄ este bine definit și surjectiv, fiindcă 4 divide 12. Nucleul conține clasele 0,4,8.']
],{prompt:'Nucleul reducerii ℤ₁₂→ℤ₄?',steps:['f(a)=0 exact când a este multiplu de 4.','În reprezentanții lui ℤ₁₂, obținem {0,4,8}.']},[
S('f:ℤ₁₈→ℤ₆, f([a]₁₈)=[a]₆. Scrie nucleul.',[0,6,12],'Caută clasele care devin 0 modulo 6.',['Sunt 0,6,12.']),
C('Un morfism de grupuri cu nucleul {e} este:',[{id:'a',label:'Injectiv'},{id:'b',label:'Întotdeauna surjectiv'},{id:'c',label:'Întotdeauna constant'}],'a','Dacă f(a)=f(b), aplică morfismul lui ab⁻¹.',['f(ab⁻¹)=e, deci ab⁻¹=e și a=b. Surjectivitatea nu rezultă.'])
],'O formulă pe reprezentanți trebuie verificată ca bine definită pe clase.',['subgrup','functii']),
L('factor','structura','Subgrup normal, grup factor și indice 2','Să construiești o demonstrație scurtă și corectă.',[
['Normalitate','H este normal în G dacă gH=Hg pentru orice g∈G. Echivalent, gHg⁻¹=H. Numai atunci înmulțirea claselor (aH)(bH)=abH este bine definită.'],
['Grupul factor','Elementele lui G/H sunt clase laterale, nu elementele individuale ale lui G. Pentru G finit, |G/H|=[G:H]. Primul izomorfism: G/ker(f) este izomorf cu Im(f).'],
['Indice 2','Orice subgrup de indice 2 este normal. Există numai H și complementul său. În factorul de ordin 2, clasa netrivială c satisface c²=H. De aceea a,b∉H implică ab∈H.']
],{prompt:'H≤G, [G:H]=2, a,b∉H. De ce ab∈H?',steps:['Indicele 2 implică H normal.','G/H are două elemente: H și c.','aH=bH=c, deci (aH)(bH)=c²=H.','abH=H, adică ab∈H.']},[
C('Dacă [G:H]=2 și a,b∉H, unde se află ab?',[{id:'a',label:'În H'},{id:'b',label:'În afara lui H'},{id:'c',label:'Nu se poate determina'}],'a','Lucrează în grupul factor de ordin 2.',['Clasele lui a și b sunt aceeași clasă netrivială, al cărei pătrat este clasa H.']),
D('Demonstrează că orice subgrup de indice 2 este normal.',['Identifică cele două clase stângi.','Observă că pentru g∉H, atât gH cât și Hg sunt complementul lui H.','Tratează separat g∈H și g∉H.'],['Dacă g∈H, gH=H=Hg.','Dacă g∉H, gH este unica clasă stângă diferită de H, deci G∖H.','Analog, Hg este unica clasă dreaptă diferită de H, deci G∖H.','Prin urmare gH=Hg pentru orice g: H este normal.'])
],'Nu folosi înmulțirea din G/H înainte să justifici că H este normal.',['lagrange','morfisme']),
L('corp','inele','Inele, corpuri și unități','Să știi când ai voie să împarți într-o structură finită.',[
['Inel','Un inel are două operații: adunarea formează un grup abelian, înmulțirea este asociativă și se distribuie față de adunare. Aici lucrăm cu inele cu 1. Comutativitatea înmulțirii este precizată separat.'],
['Unități și corp','O unitate este un element inversabil multiplicativ. Un corp comutativ are inverse pentru toate elementele nenule și 0≠1. ℤₙ este corp exact când n este prim.'],
['Divizori ai lui zero','În ℤ₆, 2·3=0, deși 2 și 3 sunt nenule. Într-un corp, ab=0 implică a=0 sau b=0. De aceea o factorizare se interpretează diferit într-un inel cu divizori ai lui zero.']
],{prompt:'Găsește U(ℤ₁₂).',steps:['a este unitate dacă gcd(a,12)=1.','Reprezentanții sunt {1,5,7,11}.']},[
S('Scrie U(ℤ₁₀), cu reprezentanți canonici.',[1,3,7,9],'Caută numerele prime cu 10.',['gcd(a,10)=1 pentru a=1,3,7,9.']),
C('Care dintre ℤ₇ și ℤ₈ este corp?',[{id:'a',label:'Doar ℤ₇'},{id:'b',label:'Ambele'},{id:'c',label:'Doar ℤ₈'}],'a','ℤₙ este corp dacă și numai dacă n este prim.',['7 este prim; 8 este compus și are elemente nenule neinversabile.'])
],'Nu anula un factor nenul într-un inel fără să știi că este inversabil sau că nu este divizor al lui zero.',['invers','grup']),
L('ideale','inele','Ideale și inele factor','Să legi clasele modulo n de ideea generală de factor.',[
['Idealul','Într-un inel comutativ R, un ideal I este subgrup aditiv și absoarbe înmulțirea: r·a∈I pentru orice r∈R, a∈I. În ℤ, idealul nℤ este mulțimea multiplilor lui n.'],
['Factorul','R/I conține clasele a+I, iar operațiile sunt induse de cele din R. ℤ/nℤ este exact inelul ℤₙ.'],
['Morfisme de inele','Un morfism păstrează adunarea, înmulțirea și, în convenția cu 1, unitatea. Nucleul este un ideal. Un ideal maximal propriu produce un corp factor; în ℤ, pℤ este maximal pentru p prim.']
],{prompt:'Ce clasă reprezintă 17 în ℤ/5ℤ?',steps:['17−2=15 aparține lui 5ℤ.','17+5ℤ=2+5ℤ.']},[
N('Care este reprezentantul canonic al lui 23+6ℤ în ℤ/6ℤ?',5,'Scade multipli ai lui 6.',['23=3·6+5.']),
C('Idealul 4ℤ este maximal în ℤ?',[{id:'a',label:'Da'},{id:'b',label:'Nu'}],'b','Factorul ℤ/4ℤ este corp?',['Nu: clasa lui 2 este nenulă și 2·2=0. De asemenea 4ℤ⊊2ℤ⊊ℤ.'])
],'Un subgrup aditiv nu este automat ideal într-un inel arbitrar.',['corp','factor']),
L('polinoame','inele','Polinoame în ℤₚ[X]','Să calculezi coeficienții în corpul corect.',[
['Ce reprezintă X','Un polinom este o sumă finită a₀+a₁X+…+a_dXᵈ. Gradul este cel mai mare exponent cu coeficient nenul. În ℤₚ[X], fiecare coeficient se reduce modulo p.'],
['Operații','Aduni coeficienții cu aceeași putere a lui X. La înmulțire folosești distributivitatea. Identitatea de polinoame cere egalitatea coeficienților, nu doar coincidența în câteva puncte.'],
['O diferență subtilă','În ℤ₅[X], X⁵−X nu este polinomul zero, deși valoarea sa este 0 pentru fiecare element din ℤ₅. Funcția polinomială și polinomul formal nu sunt același obiect.']
],{prompt:'Dezvoltă (X+2)(X+3) în ℤ₅[X].',steps:['Înainte de reducere: X²+5X+6.','Reducem coeficienții modulo 5: X²+1.']},[
P('Dezvoltă (x+1)² în ℤ₅[x].','x^2+2*x+1','Aplică formula pătratului unei sume.',['(x+1)²=x²+2x+1.'],5),
P('Dezvoltă (x+2)(x+3) în ℤ₅[x].','x^2+1','Înmulțește întâi, apoi redu coeficienții.',['x²+5x+6≡x²+1.'],5)
],'Semnul „=” între polinoame nu înseamnă doar că au aceleași rădăcini.',['corp']),
L('impartire-polinoame','inele','Împărțire, rădăcini și ireductibilitate','Să folosești teorema restului și criteriul pentru gradele 2 și 3.',[
['Împărțire cu rest','În K[X], pentru g≠0 există unice q,r cu f=qg+r și grad(r)<grad(g), dacă r≠0. Metoda elimină pe rând termenul de grad maxim.'],
['Teorema restului','Restul împărțirii lui f la X−a este f(a). Deci a este rădăcină dacă și numai dacă X−a divide f.'],
['Ireductibilitate','Peste un corp, un polinom de grad 2 sau 3 este ireductibil exact când nu are rădăcini în acel corp. La grad 4 nu este suficient: se poate descompune în două pătrate de grad 2 fără rădăcini. Algoritmul lui Euclid funcționează și în K[X].']
],{prompt:'Este X²+1 ireductibil în ℤ₃[X]?',steps:['Verificăm toate elementele corpului: f(0)=1, f(1)=2, f(2)=2.','Nu există rădăcini. Gradul este 2, deci polinomul este ireductibil.']},[
N('Care este restul împărțirii lui f(x)=x³−2x+4 la x−2, peste ℚ?',8,'Restul este f(2).',['f(2)=8−4+4=8.']),
P('Scrie câtul împărțirii lui x³−1 la x−1, peste ℚ.','x^2+x+1','Folosește diferența de cuburi sau împărțirea termen cu termen.',['x³−1=(x−1)(x²+x+1).']),
C('Un polinom de grad 4 fără rădăcini în corp este obligatoriu ireductibil?',[{id:'a',label:'Da'},{id:'b',label:'Nu'}],'b','Gândește-te la un produs a două polinoame ireductibile de grad 2.',['De exemplu (x²+1)² peste ℝ nu are rădăcini reale, dar este reductibil.'])
],'Criteriul „fără rădăcini ⇒ ireductibil” este suficient numai pentru gradele 2 și 3.',['polinoame']),
L('patratice','inele','Ecuații de gradul 2 în corpuri finite','Să adaptezi formula de gradul 2 la aritmetica modulară.',[
['Formula, cu ipoteze','Pentru ax²+bx+c=0 în ℤₚ, cu p prim impar și a≠0, calculezi Δ=b²−4ac. Dacă Δ are rădăcină s în corp, soluțiile sunt (−b±s)·(2a)⁻¹.'],
['Pătrate modulo p','Un reziduu pătratic este un element de forma y². Pentru p prim impar și d≠0, criteriul lui Euler spune: d^((p−1)/2)≡1 dacă d este pătrat, respectiv −1 dacă nu. Δ=0 dă o singură rădăcină distinctă.'],
['Cazul p=2','2=0 în ℤ₂, deci nu împarți la 2. Verifici direct x=0 și x=1. În corpuri mici, verificarea tuturor elementelor este și o metodă sigură pentru orice polinom.']
],{prompt:'Rezolvă x²+x+1=0 în ℤ₁₀₃.',steps:['Δ=1−4=−3≡100. O rădăcină a lui Δ este 10.','2⁻¹≡52 (mod 103).','x=(−1+10)·52≡56 și x=(−1−10)·52≡46.','Verificarea directă confirmă ambele rădăcini.']},[
S('Scrie rădăcinile lui x²+x+1 în ℤ₁₀₃.',[46,56],'Δ=100, cu rădăcini ±10; inversul lui 2 este 52.',['(−1+10)·52≡56; (−1−10)·52≡46.']),
S('Scrie rădăcinile lui x²+x+1 în ℤ₁₀₁. Folosește ∅ dacă nu există.',[],'O rădăcină ar avea ordin 3, dar 3 nu divide 100.',['Dacă x²+x+1=0, atunci x³=1. x=1 nu este rădăcină, deoarece 3≠0 în ℤ₁₀₁.','Ar trebui ord(x)=3, imposibil deoarece ord(x) divide 100.']),
S('Rezolvă x²+x+1=0 în ℤ₂.',[],'Verifică direct 0 și 1.',['f(0)=1, f(1)=1, deci ∅.'])
],'Împărțirea la 2 înseamnă înmulțire cu inversul modular. Formula nu se aplică în caracteristica 2.',['impartire-polinoame','ordin-multiplicativ']),
L('grad-patru','inele','Gradul 4: găsim structura înainte de calcul','Să folosești factorizarea și substituția t=x².',[
['Produsul potrivit','x⁴+x³+2x²+x+1=(x²+1)(x²+x+1). Într-un corp, un produs este 0 dacă unul dintre factori este 0. Astfel rezolvi două ecuații de gradul 2.'],
['Bipătratică','Pentru x⁴+bx²+c=0 pui t=x². Rezolvi t²+bt+c=0, apoi x²=t pentru fiecare t. O valoare t găsită nu este automat pătrat în corp.'],
['Pătratul lui −1','Pentru p prim impar, −1 este pătrat modulo p exact când p≡1 (mod 4). Pentru rădăcinile lui x²+x+1, când p≠3, folosești elemente de ordin 3.']
],{prompt:'Rădăcinile lui x⁴+x³+2x²+x+1 în ℤ₃₇?',steps:['Factorizăm în (x²+1)(x²+x+1).','x²=−1≡36 dă x=6,31.','Pentru x²+x+1: Δ≡34, iar 16²≡34.','(−1±16)·19 dă 26 și 10. Reuniunea este {6,10,26,31}.']},[
P('Scrie o expresie echivalentă cu x⁴+x³+2x²+x+1, folosind factorizarea de mai sus, peste ℚ.','(x^2+1)*(x^2+x+1)','Încearcă să separi factorul x²+1.',['(x²+1)(x²+x+1)=x⁴+x³+2x²+x+1.']),
S('Scrie rădăcinile acestui polinom de grad 4 în ℤ₈₉.',[34,55],'89≡1 (mod 4), dar 89≡2 (mod 3).',['x²+x+1 nu are rădăcini: ordinul 3 nu divide 88.','34²≡−1, deci rădăcinile lui x²+1 sunt 34 și −34≡55.']),
S('Rezolvă x⁴−5x²+4=0 în ℤ₇.',[1,2,5,6],'Pune t=x² și factorizează (t−1)(t−4).',['t=1 sau t=4.','x²=1 dă 1,6; x²=4 dă 2,5. Reuniunea este {1,2,5,6}.'])
],'După substituția t=x² mai ai o ecuație de rezolvat. Nu raporta valorile lui t ca rădăcini x.',['patratice']),
L('viete','inele','Viète și expresii simetrice','Să calculezi sume de puteri fără să găsești rădăcinile.',[
['Pentru gradul 2','Dacă ax²+bx+c are rădăcinile r,s în corp (cu multiplicitate), atunci r+s=−b/a și rs=c/a. Împărțirile cer a≠0 într-un corp.'],
['O expresie utilă','r²+s²=(r+s)²−2rs. Pentru gradul 3, dacă rădăcinile sunt r,s,t, sumele simetrice sunt r+s+t=−b/a, rs+rt+st=c/a, rst=−d/a.'],
['Unde lucrezi','Aceleași identități funcționează în corpuri finite, dar toate coeficientele se reduc în acel corp. Rădăcinile pot exista doar într-o extensie; formulele nu demonstrează singure existența lor în corpul de bază.']
],{prompt:'r,s sunt rădăcinile lui x²−5x+6 peste ℝ. Calculează r²+s².',steps:['r+s=5 și rs=6.','r²+s²=25−12=13.']},[
N('r,s sunt rădăcinile lui x²−7x+10 peste ℝ. Calculează r²+s².',29,'Folosește (r+s)²−2rs.',['7²−2·10=49−20=29.']),
N('r,s sunt rădăcinile lui x²+3x+2 în ℤ₇. Scrie r+s ca reprezentant canonic.',4,'Suma este opusul coeficientului lui x.',['r+s=−3≡4 (mod 7).'])
],'La suma rădăcinilor semnul este minus; la produsul de grad 2 semnul este plus.',['patratice'])
);
lessons.push(
L('det2','matrice','Determinantul începe cu ad − bc','Să citești o matrice și să calculezi primul determinant.',[
['Linii și coloane','aᵢⱼ este elementul de pe linia i, coloana j. O matrice pătratică are același număr de linii și coloane. Determinantul asociază unei astfel de matrice un scalar.'],
['Formula de ordin 2','Pentru matricea cu liniile (a,b) și (c,d), determinantul este ad−bc: produsul diagonalei principale minus produsul celeilalte diagonale.'],
['Legătura cu inversabilitatea','Peste un corp, matricea este inversabilă dacă și numai dacă determinantul este nenul. În ℤₙ cu n compus, determinantul trebuie să fie o unitate, nu doar nenul.']
],{prompt:'A are liniile (2,3), (1,4). Calculează det A.',steps:['a=2,b=3,c=1,d=4.','det A=2·4−3·1=8−3=5.']},[
N('Calculează determinantul matricei cu liniile (3,2), (5,4).',2,'Produsul diagonalei principale minus produsul diagonalei secundare.',['3·4−2·5=12−10=2.']),
N('Calculează determinantul matricei cu liniile (1,2), (2,4).',0,'A doua linie este dublul primei.',['1·4−2·2=0.'])
],'Ordinea scăderii contează: ad−bc, nu bc−ad.',['operatii']),
L('det3','matrice','Dezvoltarea unui determinant','Să calculezi un determinant de ordin 3 și să alegi linia potrivită.',[
['Dezvoltare Laplace','Pe linia i: det A=Σ aᵢⱼ(−1)^(i+j) det Aᵢⱼ. Minorul Aᵢⱼ se obține ștergând linia i și coloana j.'],
['Semnele','Pe prima linie semnele sunt +,−,+. Pe a doua: −,+,−. Alege o linie sau coloană cu multe zerouri.'],
['Sarrus','Regula lui Sarrus funcționează numai la ordinul 3. Nu o extinde copiind diagonale pentru o matrice 4×4.']
],{prompt:'A are liniile (1,2,0), (0,3,1), (2,0,1). Calculează det A.',steps:['Dezvoltăm pe prima linie.','det A=1·(3·1−1·0)−2·(0·1−1·2).','=3−2·(−2)=7.']},[
N('A are liniile (1,2,3), (0,4,5), (0,0,6). Calculează det A.',24,'Matricea este triunghiulară.',['Determinantul triunghiular este produsul diagonalei: 1·4·6=24.']),
N('A are liniile (1,1,0), (1,0,1), (0,1,1). Calculează det A.',-2,'Dezvoltă pe prima linie.',['1·(0−1)−1·(1−0)=−2.'])
],'La dezvoltare, semnul cofactorului se aplică și elementului, și minorului.',['det2']),
L('operatii-linii','matrice','Transformări pe linii','Să reduci calculul fără să pierzi semnul sau factorii.',[
['Operația care păstrează','Lᵢ←Lᵢ+cLⱼ, pentru i≠j, nu schimbă determinantul. Aceeași regulă este valabilă pe coloane.'],
['Operații care schimbă','Schimbarea a două linii inversează semnul. Înmulțirea unei linii cu c înmulțește determinantul cu c. Pentru c=0 rezultatul este 0.'],
['Cazuri rapide','O linie zero sau două linii egale dau determinant 0. Pentru o matrice triunghiulară, determinantul este produsul diagonalei. det(AB)=det(A)det(B).']
],{prompt:'det A=5. Din A schimbi două linii, apoi dublezi prima linie. Care este noul determinant?',steps:['Schimbul produce −5.','Dublarea unei singure linii produce −10.']},[
N('det A=7. Aplici L₂←L₂−3L₁. Care este noul determinant?',7,'Adăugarea unui multiplu al altei linii păstrează determinantul.',['Determinantul rămâne 7.']),
N('A este 3×3 și det A=2. Cât este det(3A)?',54,'Toate cele 3 linii sunt înmulțite cu 3.',['det(3A)=3³ det A=27·2=54.'])
],'Când înmulțești întreaga matrice n×n cu c, determinantul se înmulțește cu cⁿ.',['det3']),
L('max01','matrice','Maximul pentru matrice cu 0 și 1','Să separi exemplul care atinge maximul de demonstrarea limitei.',[
['Ce trebuie demonstrat','Se cere valoarea maximă a determinantului pentru matrice 0/1 de ordine 3 și 4. Un exemplu cu determinant mare arată numai o limită inferioară. Ai nevoie și de o limită superioară.'],
['Bordarea','Construiești o matrice B de ordin n+1 cu prima linie și prima coloană numai 1, iar blocul rămas J−2A. Scăzând prima linie din celelalte obții det B=(−2)ⁿdet A. Toate intrările lui B sunt ±1.'],
['Limita Hadamard','Fiecare linie din B are norma √(n+1). Inegalitatea Hadamard dă |det B|≤(n+1)^((n+1)/2). Deci |det A|≤(n+1)^((n+1)/2)/2ⁿ. Pentru n=3 rezultă ≤2; pentru n=4 rezultă <4, deci ≤3, determinantul fiind întreg.'],
['Atingerea limitei','Pentru n=3, liniile (1,1,0),(0,1,1),(1,0,1) dau determinant 2. Pentru n=4, liniile (1,0,1,1),(0,1,1,1),(1,1,0,1),(1,1,1,0) dau determinant 3. Atât limita, cât și un exemplu sunt necesare.']
],{prompt:'De ce maximul pozitiv la n=4 nu poate fi 4?',steps:['Hadamard și bordarea dau |det A|≤5^(5/2)/16≈3,494.','Determinantul unei matrice întregi este întreg, deci |det A|≤3.','Exemplul de mai sus are determinant 3, deci maximul este 3.']},[
N('Care este valoarea maximă a determinantului unei matrice 0/1 de ordin 3?',2,'Ai atât o limită superioară, cât și un exemplu care o atinge.',['Limita Hadamard este 2 și matricea dată are determinant 2.']),
N('Care este valoarea maximă a determinantului unei matrice 0/1 de ordin 4?',3,'Limita este strict sub 4, iar determinantul este întreg.',['Limita întreagă este 3; exemplul dat o atinge.']),
D('Explică de ce găsirea unei matrice cu determinant 3 nu dovedește singură maximul la ordinul 4.',['Distinge o limită inferioară de una superioară.','Justifică de ce nicio altă matrice nu depășește 3.','Arată un exemplu care atinge 3.'],['Un exemplu dovedește maxim≥3.','Bordarea și Hadamard dovedesc |det A|<4.','Integritatea determinantului dă det A≤3.','Împreună rezultă maxim=3.'])
],'Enumerarea pe calculator verifică aceste ordine mici; la examen scrii justificarea matematică.',['operatii-linii']),
L('rang','matrice','Rangul și pivotul','Să numări informațiile independente dintr-o matrice.',[
['Definiție','Rangul este numărul maxim de linii liniar independente; echivalent, ordinul celui mai mare minor nenul. Rangul matricei zero este 0.'],
['Eliminare','Aplici operații elementare pe linii până obții o formă în scară. Numărul pivoturilor este rangul. Peste un corp, poți împărți o linie la un pivot nenul.'],
['Exemplu','Liniile (1,2,3), (2,4,6), (0,1,1) au rang 2: a doua este dependentă de prima, iar a treia este independentă de prima.']
],{prompt:'Rangul matricei cu liniile (1,2), (2,4)?',steps:['Scădem de pe a doua linie dublul primei.','Rămân (1,2), (0,0). Există un singur pivot: rang 1.']},[
N('Ce rang are matricea cu liniile (1,0,1), (0,1,1), (1,1,2)?',2,'A treia linie este suma primelor două.',['Primele două sunt independente; a treia nu adaugă o direcție. Rang 2.']),
N('Ce rang are matricea zero 3×3?',0,'Nu există niciun minor nenul de ordin pozitiv.',['Rangul matricei zero este 0.'])
],'Determinantul 0 spune doar rang<n pentru o matrice n×n, nu spune automat rang 0.',['operatii-linii']),
L('sisteme','matrice','Sisteme: Cramer și Kronecker–Capelli','Să alegi metoda după determinant și rang.',[
['Scriere matricială','Un sistem liniar se scrie Ax=b. Matricea extinsă [A|b] se obține alipind coloana termenilor liberi.'],
['Cramer','Pentru A pătratică peste un corp, dacă det A≠0, soluția este unică: xⱼ=det Aⱼ/det A, unde Aⱼ înlocuiește coloana j cu b.'],
['Când determinantul este 0','Sistemul este compatibil exact când rang A=rang[A|b]. Dacă rangurile sunt egale cu numărul necunoscutelor, soluția este unică. Dacă sunt egale și mai mici, există parametri liberi; peste ℝ sau ℚ apar infinit de multe soluții. Dacă rangurile diferă, nu există soluție. Peste un corp finit cu q elemente, un sistem compatibil de rang r cu n necunoscute are q^(n−r) soluții.']
],{prompt:'Rezolvă x+y=3, 2x−y=0 peste ℝ.',steps:['A are liniile (1,1),(2,−1); det A=−3≠0.','Adunând ecuațiile obținem 3x=3, deci x=1.','y=2. Soluția este (1,2).']},[
T('Rezolvă x+y=5 și 2x−y=1 peste ℝ. Scrie (x,y).',[2,3],'Adună ecuațiile.',['3x=6 ⇒ x=2; y=5−2=3.']),
C('x+y=1, 2x+2y=3, peste ℝ:',[{id:'a',label:'Nu are soluții'},{id:'b',label:'Are o soluție unică'},{id:'c',label:'Are infinit de multe soluții'}],'a','Compară a doua ecuație cu dublul primei.',['Dublul primei cere 2x+2y=2, dar a doua cere 3. Rangurile sunt diferite.'])
],'det A=0 nu înseamnă automat „nu există soluții”. Verifică rangurile.',['rang']),
L('parametri','matrice','Sisteme cu parametru: nu pierdem cazuri','Să discuți separat valorile care anulează determinantul.',[
['Strategia','Calculezi determinantul în funcție de parametru. Rezolvi întâi cazul determinantului nenul. Valorile care îl anulează se înlocuiesc în sistemul original, una câte una.'],
['Exemplul din fișă','mx+my+z=m; x+my+z=1; x+y+mz=m. Determinantul este (m−1)²(m+1). Valorile speciale sunt m=1 și m=−1.'],
['Discuția','Pentru m≠±1: x=1, y=−1/(m+1), z=m/(m+1). Pentru m=1: toate ecuațiile devin x+y+z=1, deci doi parametri liberi. Pentru m=−1: sistemul este incompatibil.']
],{prompt:'De ce formula y=−1/(m+1) nu tratează toate cazurile?',steps:['Formula a fost dedusă folosind det A≠0.','m=−1 o face nedefinită și trebuie analizat separat.','m=1 este exclus de determinant, chiar dacă formula simplificată are sens acolo.','La m=1 sistemul are o familie de soluții, nu o singură soluție.']},[
S('Pentru sistemul din lecție, ce valori ale lui m anulează determinantul?',[-1,1],'Rezolvă (m−1)²(m+1)=0.',['m=1 sau m=−1.']),
C('La m=1, sistemul din lecție are, peste ℝ:',[{id:'a',label:'O infinitate de soluții, cu doi parametri liberi'},{id:'b',label:'O singură soluție'},{id:'c',label:'Nicio soluție'}],'a','Înlocuiește m=1 în toate cele trei ecuații.',['Toate devin x+y+z=1. Poți alege y=s,z=t și x=1−s−t.'])
],'După simplificarea unei fracții, condițiile inițiale de existență rămân valabile.',['sisteme']),
L('crt','aplicatii','Teorema chineză a resturilor','Să combini congruențele într-o singură clasă.',[
['Module prime între ele','Dacă n₁,…,nₖ sunt prime între ele două câte două, sistemul x≡aᵢ (mod nᵢ) are o soluție unică modulo produsul N.'],
['Metoda substituției','Din prima congruență scrii x=a₁+n₁t. Înlocuiești în a doua, rezolvi pentru t și continui. La final reduci modulo N.'],
['Module care nu sunt coprime','Pentru două module m,n, compatibilitatea cere a≡b (mod gcd(m,n)). Dacă există soluții, clasa finală este unică modulo CMMMC(m,n), nu neapărat modulo produs.']
],{prompt:'x≡1 (mod 3), x≡3 (mod 5), x≡5 (mod 7).',steps:['x=1+3t. Din a doua: 3t≡2 (mod 5), deci t≡4.','x=13+15u. Din a treia: 13+15u≡5 (mod 7), deci u≡6.','x=103 modulo 105. Verificăm resturile 1,3,5.']},[
N('Găsește x în {0,…,104}: x≡1 (mod 3), x≡3 (mod 5), x≡5 (mod 7).',103,'Folosește substituția din exemplu.',['x=13+15u și u≡6 (mod 7), deci x=103.']),
N('Găsește x în {0,…,14}: x≡2 (mod 3), x≡4 (mod 5).',14,'Scrie x=2+3t.',['3t≡2 (mod 5), deci t≡4. x=14.'])
],'Unicitatea cere precizarea modulului final și a ipotezelor de coprimalitate.',['congruente']),
L('rsa','aplicatii','RSA ca aplicație de aritmetică','Să legi puterile și inversele de un exemplu concret.',[
['Datele exemplului','Alegi două prime distincte p,q și n=pq. Calculezi φ(n)=(p−1)(q−1). Alegi e prim cu φ(n), apoi d inversul lui e modulo φ(n).'],
['Criptare și decriptare','Pentru 0≤m<n, calculezi c≡mᵉ (mod n), iar m≡cᵈ (mod n). Aceste numere mici sunt un exemplu didactic al calculelor modulare.'],
['De ce funcționează','ed≡1 (mod p−1) și modulo q−1. Pentru mesajele nenule modulo acel prim aplici Fermat, iar mesajele 0 modulo prim rămân 0. Apoi teorema resturilor chinezești reconstruiește mesajul modulo n.']
],{prompt:'p=3,q=11,e=3. Găsește d și criptează m=2.',steps:['n=33 și φ(n)=20.','3·7≡1 (mod 20), deci d=7.','c=2³ mod 33=8.','8⁷ mod 33=2.']},[
N('Pentru p=3,q=11,e=3, care este d în {0,…,19}?',7,'Calculează inversul lui 3 modulo 20.',['3·7=21≡1 (mod 20).']),
N('Calculează 2¹⁴⁹ modulo 323 (exemplul din rezumat).',32,'323=17·19, φ(323)=288. Poți folosi pătrate succesive sau CRT.',['Modulo 17: 149≡5 (mod 8), deci 2¹⁴⁹≡15.','Modulo 19: 149≡5 (mod 18), deci 2¹⁴⁹≡13.','32 are resturile 15 la 17 și 13 la 19. CRT dă 32 modulo 323.'])
],'Inversul pentru cheia d se calculează modulo φ(n), nu modulo n.',['crt','euler-fermat']),
L('numarare','aplicatii','Numărare: submulțimi fără vecini','Să transformi o problemă de mulțimi într-o recurență simplă.',[
['Separăm două cazuri','Fie aₙ numărul submulțimilor lui {1,…,n} care nu conțin două numere consecutive. Dacă n lipsește, ai aₙ₋₁ posibilități. Dacă n apare, n−1 lipsește și ai aₙ₋₂ posibilități.'],
['Recurența','aₙ=aₙ₋₁+aₙ₋₂ pentru n≥2. Cazurile de bază sunt a₀=1 (mulțimea vidă) și a₁=2 (∅ și {1}).'],
['Un alt tip din rezumat','Pentru numere prime cu un produs de prime mici, folosești incluziunea-excluziunea. De exemplu, între 1 și 30 sunt φ(30)=8 numere prime cu 30.']
],{prompt:'Câte submulțimi fără vecini are {1,2,3}?',steps:['a₀=1, a₁=2.','a₂=3; a₃=5.','Ele sunt ∅,{1},{2},{3},{1,3}.']},[
N('Câte submulțimi fără vecini are {1,2,3,4,5,6}? Include mulțimea vidă.',21,'Construiește șirul de la a₀=1, a₁=2.',['a₂=3,a₃=5,a₄=8,a₅=13,a₆=21.']),
N('Câte submulțimi fără vecini are {1,…,10}? Include mulțimea vidă.',144,'Continuă aceeași recurență.',['a₆=21,a₇=34,a₈=55,a₉=89,a₁₀=144.'])
],'Nu omite mulțimea vidă: lipsa ei schimbă toate cazurile de bază.',['multimi'])
);

addFoundations(chapters,lessons);
extendCourse(lessons);
addPracticeBank(lessons);
for(const lesson of lessons){lesson.exercises.forEach((e,i)=>{e.id=`${lesson.id}-${i+1}`;e.chapter=lesson.chapter;e.lesson=lesson.id;});}
export const exercises=lessons.flatMap(l=>l.exercises);





