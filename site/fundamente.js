const N=(prompt,answer,hint,steps)=>({kind:'number',prompt,answer,hint,steps});
const T=(prompt,answer,hint,steps)=>({kind:'tuple',prompt,answer,hint,steps});
const C=(prompt,options,answer,hint,steps)=>({kind:'choice',prompt,options,answer,hint,steps});
const L=(id,title,goal,theory,worked,exercises,trap,prerequisites=[])=>({id,chapter:'baze',title,goal,theory,worked,exercises,trap,prerequisites,minutes:10});
export const foundations=[
L('numere-baze','Pornim de la numere','Să citești numerele și semnele pe care le vom folosi.',[
 ['Numere pentru numărat','Începem cu 0,1,2,3,…: numerele naturale. Zero înseamnă că nu avem niciun obiect. Semnul „…” spune că șirul continuă. Când spunem „trei numere”, numărăm obiectele, nu cifrele cu care sunt scrise.'],
 ['O linie pentru numere','Imaginează-ți o linie cu 0 în centru, 1,2,3 la dreapta și −1,−2,−3 la stânga. Numerele din stânga sunt negative; de exemplu −3 poate reprezenta o datorie de 3 lei. Numerele întregi cuprind zero, pozitivele și negativele.'],
 ['Comparăm','3>1 se citește „3 este mai mare decât 1”. 1<3 se citește „1 este mai mic decât 3”. Deschiderea semnului privește spre numărul mai mare. Pe linie, un număr din dreapta este mai mare: −1>−4. Semnul = înseamnă „are aceeași valoare”; ≠ înseamnă „nu este egal”.'],
 ['De ce apar litere','În matematică, x poate ține locul unui număr pe care îl căutăm sau al unui număr oarecare. În x+2=5, x nu este semnul de înmulțire: este numărul lipsă. Semnele de înmulțire vor fi ·, × sau *. Nu trebuie să știi încă să rezolvi ecuația.']
 ],{prompt:'Dintre −2 și 1, care număr este mai mare?',steps:['−2 se află la stânga lui 0.','1 se află la dreapta lui 0, deci și la dreapta lui −2.','Numărul mai mare este 1.']},[
 N('Care număr este mai mare: −5 sau −2?',-2,'Pe linia numerelor, privește spre dreapta.',['−2 este mai aproape de 0 decât −5 și se află la dreapta lui.']),
 C('Ce spune egalitatea 3=3?',[{id:'a',label:'Cele două părți au aceeași valoare'},{id:'b',label:'Numărul din stânga este mai mare'}],'a','Semnul = compară valorile celor două părți.',['3 și 3 au aceeași valoare.'])
 ],'−5 este mai mic decât −2, chiar dacă 5 este mai mare decât 2.'),
L('adunare-baze','Adunare, scădere și numere negative','Să urmărești semnele fără să memorezi reguli fără sens.',[
 ['Adunarea','3+2=5: pornești de la 3 și mergi două poziții la dreapta. 3+(−2)=1: aduni un număr negativ, deci mergi două poziții la stânga. Zero nu mută poziția: 3+0=3.'],
 ['Scăderea','5−2=3: pornești de la 5 și mergi două poziții la stânga. Dacă scazi mai mult decât ai, treci de zero: 2−5=−3. Semnul minus poate indica o operație sau poate face parte din numărul negativ.'],
 ['Opusul unui număr','Opusul lui 4 este −4: suma lor este 0. Opusul lui −4 este 4. Regula a−b=a+(−b) spune că scăderea este adunarea opusului. Astfel 3−(−2)=3+2=5.'],
 ['Când ai semne diferite','La −7+3, pornești de la −7 și mergi trei poziții la dreapta: ajungi la −4. La 7+(−3), pornești de la 7 și mergi trei poziții la stânga: ajungi la 4.']
 ],{prompt:'Calculează −3−(−5).',steps:['Scădem −5, deci adunăm opusul lui −5, adică +5.','−3−(−5)=−3+5.','De la −3 mergem cinci poziții la dreapta și ajungem la 2.']},[
 N('Calculează 2−7.',-5,'De la 2, mergi șapte poziții la stânga.',['2−2=0; mai mergem cinci poziții la stânga, deci −5.']),
 N('Calculează −4−(−6).',2,'Scăderea unui număr negativ înseamnă adunarea opusului său.',['−4−(−6)=−4+6=2.'])
 ],'Regula celor două minusuri se aplică în 3−(−2); nu transformă −3−2 în +5.',['numere-baze']),
L('inmultire-baze','Înmulțirea și semnul produsului','Să citești un produs și să calculezi cu semne.',[
 ['Grupuri egale','3·4 înseamnă trei grupe a câte patru: 4+4+4=12. Numerele înmulțite se numesc factori; rezultatul este produsul. 3·4=4·3. În expresiile din curs poți întâlni și 3×4 sau 3*4.'],
 ['Factor negativ','3·(−4)=−4−4−4=−12. Un factor negativ și unul pozitiv dau un produs negativ. Doi factori negativi dau un produs pozitiv: (−3)·(−4)=12. Această regulă păstrează legătura dintre adunare și înmulțire.'],
 ['Zero și unu','Orice număr înmulțit cu 0 dă 0. Înmulțirea cu 1 păstrează numărul: 1·7=7. Înmulțirea cu −1 schimbă semnul: (−1)·7=−7.'],
 ['Desfacem paranteza','2·(3+4)=2·3+2·4=14. Numim aceasta distributivitate: factorul din afara parantezei înmulțește fiecare termen. La −2·(x−3), obții −2x+6. Scrierea 2x înseamnă 2·x.']
 ],{prompt:'Calculează −3·(2−5).',steps:['În paranteză: 2−5=−3.','Produsul devine (−3)·(−3).','Doi factori negativi dau un rezultat pozitiv: 9.']},[
 N('Calculează (−4)·3.',-12,'Semne diferite: rezultatul este negativ.',['4·3=12; semnele diferă, deci −12.']),
 N('Calculează 2·(3+5).',16,'Poți calcula întâi paranteza.',['3+5=8; 2·8=16.'])
 ],'2(x+3) este 2x+6, nu 2x+3: înmulțești fiecare termen.',['adunare-baze']),
L('impartire-baze','Împărțirea și restul','Să înțelegi ce înseamnă „împărțim cu rest”.',[
 ['Operația inversă','12:3=4, fiindcă 3·4=12. Semnele „:” și „/” pot indica împărțirea. Numărul împărțit este deîmpărțitul, numărul la care împărțim este împărțitorul, iar rezultatul este câtul.'],
 ['Când nu se împarte exact','17 împărțit la 5 dă câtul 3 și restul 2: 17=5·3+2. Trei grupe de câte cinci consumă 15; rămân 2. Pentru un împărțitor pozitiv, restul este cel puțin 0 și strict mai mic decât împărțitorul.'],
 ['Verificăm','Înmulțim câtul cu împărțitorul și adunăm restul. Trebuie să revenim la numărul inițial. Pentru 23 și 4, câtul 5 și restul 3 sunt corecte fiindcă 4·5+3=23 și 0≤3<4. Semnul ≤ înseamnă „mai mic sau egal”.'],
 ['De ce nu împărțim la zero','Nu există un număr care înmulțit cu 0 să dea 7. De aceea 7/0 nu este definit. Nici 0/0 nu are un rezultat unic. În schimb 0/5=0.']
 ],{prompt:'Găsește câtul și restul lui 29 la împărțirea cu 6.',steps:['6·4=24, iar 6·5=30 depășește 29.','Câtul este 4, restul 29−24=5.','Verificare: 29=6·4+5 și 5<6.']},[
 T('17=5·q+r, cu restul r între 0 și 4. Scrie (q,r).',[3,2],'Câte grupe complete de câte 5 încap în 17?',['5·3=15; 17−15=2. Perechea este (3,2).']),
 N('Care este restul împărțirii lui 23 la 4?',3,'4·5=20; cât rămâne până la 23?',['23=4·5+3; restul este 3.'])
 ],'Restul nu poate fi egal cu împărțitorul: atunci mai încape o grupă.',['inmultire-baze']),
L('paranteze-baze','Ordinea operațiilor','Să citești o expresie pas cu pas.',[
 ['O expresie este un calcul','În 2+3·4 sunt două operații. Calculăm întâi înmulțirea: 3·4=12, apoi 2+12=14. Dacă am aduna întâi, am schimba sensul expresiei.'],
 ['Parantezele sunt prioritare','În (2+3)·4, paranteza cere să adunăm întâi: 2+3=5, apoi 5·4=20. La paranteze în paranteze pornești din interior.'],
 ['Aceeași prioritate','Înmulțirea și împărțirea au aceeași prioritate și se parcurg de la stânga la dreapta. Astfel 12/3·2=(12/3)·2=8. Adunarea și scăderea se parcurg la fel: 10−3+2=9.'],
 ['Scriem fără ambiguitate','Pentru a împărți 12 la întregul produs 3·2, scriem 12/(3·2)=2. O bară de fracție grupează întreg numărătorul și întreg numitorul; în editorul text folosim paranteze.']
 ],{prompt:'Calculează 3·(8−5)+2.',steps:['Paranteza: 8−5=3.','Înmulțirea: 3·3=9.','Adunarea: 9+2=11.']},[
 N('Calculează 2+3·4.',14,'Înmulțirea este înaintea adunării.',['3·4=12, apoi 2+12=14.']),
 N('Calculează 12/(2+4).',2,'Paranteza formează întreg împărțitorul.',['2+4=6; 12/6=2.'])
 ],'Nu calcula automat totul de la stânga la dreapta: verifică întâi parantezele și prioritățile.',['impartire-baze']),
L('fractii-baze','Ce înseamnă o fracție','Să citești numărătorul, numitorul și valoarea lor.',[
 ['Părți egale','În 3/4, împărțim un întreg în patru părți egale și luăm trei. 3 este numărătorul, 4 este numitorul. Fracția este și împărțirea 3:4. Numitorul nu poate fi 0.'],
 ['Aceeași valoare, altă scriere','1/2 și 2/4 au aceeași valoare: dacă împarți fiecare jumătate în două, ai două sferturi. Poți înmulți sau împărți numărătorul și numitorul cu același număr nenul, fără să schimbi fracția.'],
 ['Mai mult decât un întreg','7/3 înseamnă șapte treimi: 6/3+1/3=2+1/3. O fracție nu este obligatoriu mai mică decât 1. Un întreg poate fi scris ca fracție: 3=3/1.'],
 ['Semnul și numerele raționale','−1/2 este opusul lui 1/2. (−1)/2 și 1/(−2) sunt aceeași valoare; (−1)/(−2)=1/2. Numerele care se pot scrie ca fracții de întregi cu numitor nenul se numesc raționale.']
 ],{prompt:'Simplifică 6/8.',steps:['Atât 6, cât și 8 se împart exact la 2.','(6:2)/(8:2)=3/4.','Fracția 3/4 are aceeași valoare ca 6/8.']},[
 N('Scrie o fracție egală cu 2/4 folosind numitorul 2.','1/2','Împarte ambii termeni la 2.',['2/2=1, 4/2=2, deci 1/2.']),
 N('Cât este 9/3?',3,'Fracția este o împărțire.',['9:3=3.'])
 ],'La simplificare împarți ambii termeni cu același număr; nu scazi același număr.',['paranteze-baze']),
L('calcul-fractii','Calculul cu fracții','Să aduni, înmulțești și împarți fracții.',[
 ['Adunare cu același numitor','1/5+2/5=3/5: aduni numărul de părți, iar mărimea părților rămâne aceeași. La scădere procedezi la fel. Nu aduni numitorii.'],
 ['Numitori diferiți','Pentru 1/2+1/3, transformi în părți de aceeași mărime: 1/2=3/6 și 1/3=2/6. Suma este 5/6. Un numitor comun se poate obține înmulțind numitorii inițiali.'],
 ['Înmulțire și împărțire','Înmulțești numărătorii între ei și numitorii între ei: (2/3)·(3/5)=6/15=2/5. Pentru împărțire, înmulțești cu fracția răsturnată: (2/3)/(4/5)=(2/3)·(5/4)=5/6. Împărțitorul trebuie să fie nenul.'],
 ['Zecimale și exactitate','0.5 înseamnă 5/10=1/2. 0.25 înseamnă 25/100=1/4. În editor folosim punctul pentru zecimale și virgula pentru separarea componentelor. 1/3 nu este exact 0.3333: fracția păstrează valoarea exactă.']
 ],{prompt:'Calculează 1/3+1/6.',steps:['Aducem la numitorul 6: 1/3=2/6.','2/6+1/6=3/6.','Simplificăm: 3/6=1/2.']},[
 N('Calculează 1/2+1/3.','5/6','Folosește numitorul comun 6.',['3/6+2/6=5/6.']),
 N('Calculează (2/3)/(4/5).','5/6','Înlocuiește împărțirea cu înmulțirea cu 5/4.',['(2/3)·(5/4)=10/12=5/6.'])
 ],'1/2+1/3 nu este 2/5. Mai întâi aduci fracțiile la același numitor.',['fractii-baze']),
L('puteri-baze','Puteri și rădăcini pătrate','Să distingi exponentul de o înmulțire simplă.',[
 ['Puterea','2³ înseamnă 2·2·2=8. 2 este baza, 3 este exponentul. În editorul text scriem 2^3. Pentru un exponent întreg pozitiv, repetăm înmulțirea. 2³ nu este 2·3.'],
 ['Exponent zero și negativ','Pentru a nenul, a⁰=1. La exponent negativ, a⁻¹=1/a și a⁻²=1/a². De exemplu 2⁻³=1/8. Aceste împărțiri sunt cele obișnuite; mai târziu vom distinge inversul modular.'],
 ['Reguli de calcul','La aceeași bază, aᵐ·aⁿ=aᵐ⁺ⁿ. Puterea unei puteri este (aᵐ)ⁿ=aᵐⁿ. Aceste reguli provin din numărarea factorilor. Parantezele contează: (−2)²=4, dar −2²=−(2²)=−4.'],
 ['Pătrate și rădăcini','Pătratul lui 3 este 9. Simbolul √9 desemnează rădăcina pătrată nenegativă, adică 3. Ecuația x²=9 are însă două soluții reale: 3 și −3. Pentru √2 nu există o fracție exactă de întregi; spunem că este irațional. Numerele reale includ și raționalele, și iraționalele.']
 ],{prompt:'Calculează (−3)² și −3².',steps:['În (−3)², baza este −3: (−3)·(−3)=9.','În −3², puterea se calculează înainte de schimbarea semnului: −(3·3)=−9.']},[
 N('Calculează 2^4.',16,'Sunt patru factori egali cu 2.',['2·2·2·2=16.']),
 N('Calculează 3^(-2).','1/9','Exponentul negativ cere reciprocul.',['3^(-2)=1/(3²)=1/9.'])
 ],'√9=3, în timp ce „rezolvă x²=9” cere atât 3, cât și −3.',['calcul-fractii']),
L('ecuatii-baze','Ecuații și înlocuirea unei litere','Să păstrezi egalitatea când cauți un număr necunoscut.',[
 ['Ce căutăm','O ecuație este o egalitate cu o necunoscută. În x+3=8 căutăm toate numerele care, puse în locul lui x, fac egalitatea adevărată. Aici x=5, fiindcă 5+3=8.'],
 ['Aceeași operație în ambele părți','Din x+3=8 scădem 3 din ambele părți și obținem x=5. Din 2x=6 împărțim ambele părți la 2 și obținem x=3. Împărțirea este permisă numai la un număr nenul. „Mutarea” unui termen este o prescurtare pentru această operație.'],
 ['Verificarea','În 2x+1=7 scădem 1: 2x=6; împărțim la 2: x=3. Înlocuim în ecuația inițială: 2·3+1=7. Verificarea te ajută să găsești o greșeală de semn.'],
 ['O expresie cu literă','În expresia x²+1, dacă x=3, valoarea este 3²+1=10. Aceasta se numește evaluare. A evalua o expresie la o valoare dată este diferit de a găsi toate soluțiile unei ecuații.']
 ],{prompt:'Rezolvă 3x−2=10.',steps:['Adunăm 2 în ambele părți: 3x=12.','Împărțim la 3: x=4.','Verificăm: 3·4−2=10.']},[
 N('Rezolvă 2x+1=9. Scrie valoarea lui x.',4,'Scade 1 din ambele părți, apoi împarte la 2.',['2x=8, deci x=4.']),
 N('Evaluează x²+2x la x=3.',15,'Înlocuiește fiecare x cu 3.',['3²+2·3=9+6=15.'])
 ],'Nu împărți la o expresie care poate fi 0 fără să tratezi separat acel caz.',['puteri-baze']),
L('divizibilitate-baze','Divizori, multipli și numere prime','Să citești expresia „d divide a”.',[
 ['Împărțire exactă','3 divide 12 fiindcă 12=3·4. Scriem 3 | 12. Bara verticală nu este semnul fracției; enunță o proprietate. În acest exemplu, 3 este divizor al lui 12, iar 12 este multiplu al lui 3.'],
 ['Par și impar','Un întreg este par dacă se scrie 2k pentru un întreg k. Este impar dacă se scrie 2k+1. De exemplu −4=2·(−2) este par. Un număr întreg are întotdeauna una dintre aceste două forme.'],
 ['Număr prim','Un număr natural p≥2 este prim dacă singurii săi divizori pozitivi sunt 1 și p. Astfel 2,3,5,7 sunt prime. 1 nu este prim. Un număr ≥2 care nu este prim este compus; de exemplu 6=2·3.'],
 ['Divizori comuni','Divizorii pozitivi ai lui 12 sunt 1,2,3,4,6,12; ai lui 18 sunt 1,2,3,6,9,18. Divizorii comuni sunt 1,2,3,6; cel mai mare este 6. Îl numim CMDC. Dacă singurul divizor comun pozitiv este 1, numerele sunt prime între ele; ele nu trebuie să fie individual prime.']
 ],{prompt:'Sunt 8 și 15 prime între ele?',steps:['Divizorii lui 8 sunt 1,2,4,8.','Divizorii lui 15 sunt 1,3,5,15.','Singurul divizor comun este 1, deci da. Nici 8, nici 15 nu este număr prim.']},[
 N('Care este cel mai mare divizor comun al lui 12 și 18?',6,'Caută cel mai mare număr care le împarte pe ambele exact.',['6 divide și 12, și 18; niciun divizor comun nu este mai mare.']),
 C('Care număr este prim?',[{id:'a',label:'7'},{id:'b',label:'1'},{id:'c',label:'9'}],'a','Numărul trebuie să aibă exact doi divizori pozitivi.',['7 are divizorii 1 și 7. 1 are unul singur, iar 9 are și divizorul 3.'])
 ],'„Prime între ele” descrie o pereche; „număr prim” descrie un singur număr.',['ecuatii-baze']),
L('logica-baze','Cum citim un enunț matematic','Să înțelegi „pentru orice”, „există”, „dacă” și „numai dacă”.',[
 ['O propoziție care poate fi verificată','„4 este par” este adevărată; „5 este par” este falsă. „x este par” depinde de valoarea lui x. O afirmație matematică precizează ce numere sunt permise și ce se susține despre ele.'],
 ['Pentru orice și există','∀ se citește „pentru orice”. Afirmația „pentru orice întreg x, x+0=x” cere toate cazurile. ∃ se citește „există”: ajunge cel puțin un exemplu. „Există un întreg x cu x+2=5” este adevărat, deoarece x=3 funcționează.'],
 ['Implicație','P⇒Q se citește „dacă P, atunci Q”. P este ipoteza, Q este concluzia. „Dacă un întreg este multiplu de 4, atunci este par” este adevărat. Reciproc, un număr par nu este obligatoriu multiplu de 4: 6 este un contraexemplu.'],
 ['Echivalență și negație','P⇔Q înseamnă că ambele implicații sunt adevărate. „n este par dacă și numai dacă 2 divide n” este o echivalență. Negația lui „toate au proprietatea” este „există cel puțin unul care nu o are”. Negația lui „există unul” este „nu există niciunul”.']
 ],{prompt:'Cum respingi afirmația „orice număr prim este impar”?',steps:['Căutăm un singur număr prim care nu este impar.','2 este prim și este par.','Afirmația este falsă.']},[
 C('Ce este suficient pentru a respinge „toți întregii sunt pozitivi”?',[{id:'a',label:'Un contraexemplu, de pildă −1'},{id:'b',label:'O sută de exemple pozitive'}],'a','Pentru „toți”, niciun contraexemplu nu este permis.',['−1 este întreg și nu este pozitiv.']),
 C('Dacă 4 divide n, atunci 2 divide n. Este reciproca mereu adevărată?',[{id:'a',label:'Nu: n=6 este contraexemplu'},{id:'b',label:'Da, orice număr par este multiplu de 4'}],'a','Verifică separat cele două direcții.',['2 divide 6, dar 4 nu divide 6.'])
 ],'Nu confunda o implicație cu reciproca ei.',['divizibilitate-baze']),
L('demonstratii-baze','De la exemplu la demonstrație','Să scrii de ce o afirmație este adevărată pentru toate cazurile cerute.',[
 ['Exemplul nu acoperă toate cazurile','2+4=6 și 6+8=14 sugerează că suma a două numere pare este pară. Dar două exemple nu verifică toate numerele pare. Avem nevoie de un argument pentru două numere pare oarecare.'],
 ['Pornim din definiție','Dacă a și b sunt pare, există întregi r,s cu a=2r și b=2s. Atunci a+b=2r+2s=2(r+s). Cum r+s este întreg, suma este un multiplu de 2. Aceasta este o demonstrație directă.'],
 ['Ce explici în pași','Spui ce presupui, aplici definiția sau o regulă cunoscută și arăți cum ajungi la concluzie. Nu este necesar un vocabular complicat. Este necesar ca fiecare pas să poată fi justificat.'],
 ['Contradicția și criteriile','Într-o demonstrație prin contradicție presupui că afirmația este falsă și deduci ceva imposibil, de exemplu că un număr ar fi simultan par și impar. În exercițiile de demonstrație din curs scrii argumentul, apoi îl compari cu pașii și criteriile model; textul nu este notat automat.']
 ],{prompt:'De ce produsul a două numere impare este impar?',steps:['Scriem numerele ca 2r+1 și 2s+1, cu r,s întregi.','Produsul este 4rs+2r+2s+1=2(2rs+r+s)+1.','Paranteza este un întreg, deci rezultatul are forma unui număr impar.']},[
 C('Ce demonstrează că suma oricăror două numere pare este pară?',[{id:'a',label:'a=2r, b=2s ⇒ a+b=2(r+s), cu r,s întregi'},{id:'b',label:'Doar calculul 2+4=6'}],'a','Argumentul trebuie să acopere numere pare oarecare.',['Prima variantă pornește din definiție și nu depinde de două valori alese.']),
 N('Dacă a=2r și b=2s, iar r=3,s=4, ce valoare are r+s?',7,'În demonstrația generală, r și s sunt întregi; aici primești valori concrete.',['r+s=3+4=7; a+b=2·7 este par.'])
 ],'O listă de exemple poate sugera o regulă, dar nu demonstrează o afirmație despre o infinitate de numere.',['logica-baze'])
];
export function addFoundations(chapters,lessons){
 chapters.unshift({id:'baze',title:'De la zero: numere și calcule',subtitle:'Semne, fracții, puteri, ecuații și citirea enunțurilor. Nu presupunem cunoștințe anterioare.',icon:'0',priority:false});
 lessons.unshift(...foundations);
 const first=lessons.find(l=>l.id==='multimi');first.prerequisites=['demonstratii-baze'];
}
