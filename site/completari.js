const N=(prompt,answer,hint,steps)=>({kind:'number',prompt,answer,hint,steps});
const S=(prompt,answer,hint,steps)=>({kind:'set',prompt,answer,hint,steps});
const T=(prompt,answer,hint,steps)=>({kind:'tuple',prompt,answer,hint,steps});
const C=(prompt,options,answer,hint,steps)=>({kind:'choice',prompt,options,answer,hint,steps});
const D=(prompt,rubric,steps)=>({kind:'proof',prompt,rubric,steps,hint:rubric[0]});
const L=(id,chapter,title,goal,theory,worked,exercises,trap,prerequisites)=>({id,chapter,title,goal,theory,worked,exercises,trap,prerequisites,minutes:15});
export function extendCourse(lessons){
 const additions=[
 ['invers',L('fractii-continue','modulo','Inversul prin fracții continue','Să recunoști metoda câturilor din rezumat și legătura ei cu Bézout.',[
 ['Câturile lui Euclid','Pentru 37 și 100 scrii 100=2·37+26, 37=26+11, 26=2·11+4, 11=2·4+3, 4=3+1, 3=3·1. Astfel 100/37=[2;1,2,2,1,3]. Notația [a₀;a₁,…] înseamnă a₀+1/(a₁+1/(…)).'],
 ['Convergenții','Pornești cu P₋₂=0, P₋₁=1, Q₋₂=1, Q₋₁=0. Pentru fiecare cât aᵢ calculezi Pᵢ=aᵢPᵢ₋₁+Pᵢ₋₂ și Qᵢ=aᵢQᵢ₋₁+Qᵢ₋₂. Fracțiile sunt 2/1, 3/1, 8/3, 19/7, 27/10, 100/37.'],
 ['Cum obții inversul','Penultimul convergent 27/10 dă 100·10−37·27=1. Prin urmare 37·(−27)≡1 (mod 100), iar inversul este 73. Semnul se verifică în identitatea Bézout; nu memora că numărătorul are întotdeauna același semn.']
 ],{prompt:'Găsește inversul lui 13 modulo 101 din câturile 7,1,3,3.',steps:['101/13=[7;1,3,3]. Convergenții sunt 7/1,8/1,31/4,101/13.','101·4−13·31=1. Coeficientul lui 13 este −31.','−31≡70 (mod 101), iar 13·70=9·101+1.']},[
 N('Calculează fracția [2;1,2]=2+1/(1+1/2).', '8/3','Începe din interior: 1+1/2=3/2.',['2+1/(3/2)=2+2/3=8/3.']),
 N('101·4−13·31=1. Găsește inversul lui 13 modulo 101 în {0,…,100}.',70,'Coeficientul lui 13 este −31.',['−31≡70; 13·70=910≡1 (mod 101).'])
 ],'Folosește penultimul convergent; ultimul este chiar raportul n/a și nu produce restul 1.',['invers'])],
 ['ordin-multiplicativ',L('produs-ordine','structura','Ordinul unui produs și ecuația gᵏ=e','Să folosești ipotezele de comutare și coprimalitate.',[
 ['Cazul coprim','Dacă gh=hg, ord(g)=m și ord(h)=n, cu gcd(m,n)=1, atunci ord(gh)=mn. Fără comutare nu poți transforma (gh)ᵏ în gᵏhᵏ. Fără coprimalitate, ordinul poate fi mai mic decât produsul.'],
 ['De ce este minim','Dacă (gh)ᵏ=e, atunci gᵏ=h⁻ᵏ aparține atât subgrupului generat de g, cât și celui generat de h. Ordinul unui element din intersecție divide și m, și n, deci este 1. Rezultă m|k și n|k, așadar mn|k.'],
 ['O ecuație într-un grup finit','Dacă |G|=211 și g³=e, ordinul lui g divide atât 211, cât și 3. Singurul divizor comun este 1; g=e. Mai general, gcd(k,|G|)=1 implică faptul că gᵏ=e are numai soluția e.']
 ],{prompt:'g și h comută, ord(g)=4, ord(h)=9. Găsește ord(gh).',steps:['gcd(4,9)=1 și avem comutare.','Ordinul produsului este 4·9=36.']},[
 N('g și h comută, ord(g)=5, ord(h)=8. Calculează ord(gh).',40,'Verifică gcd(5,8).',['Ordinele sunt coprime; ordinul produsului este 40.']),
 N('Un grup G are 211 elemente. Câte elemente g satisfac g³=e?',1,'Ordinul divide 211 și 3.',['Ordinul este 1; numai neutrul e satisface ecuația.'])
 ],'Din ordinele 2 și 2 nu rezultă ordinul produsului 4: pentru h=g, produsul este e.',['ordin-multiplicativ','ordin-aditiv'])],
 ['signatura',L('puteri-permutari','permutari','Puteri, rădăcini și ordinul maxim','Să rezolvi o ecuație de permutări și să justifici un maxim.',[
 ['Ridicarea unui ciclu la putere','Într-un ciclu de lungime l, σᵏ avansează cu k poziții. Ciclul se desface în gcd(l,k) cicluri de lungime l/gcd(l,k). Astfel pătratul unui ciclu de lungime 4 este produsul a două transpoziții disjuncte.'],
 ['Rădăcina pătrată','O permutare admite o rădăcină pătrată exact când fiecare lungime pară apare într-un număr par de cicluri. Ciclurile impare au rădăcină în același suport; două cicluri pare de aceeași lungime se pot intercala. Un singur ciclu de lungime 4, alături de unul de lungime 5, nu poate fi un pătrat.'],
 ['Maximul în S₁₂','Lungimile ciclurilor formează o partiție a lui 12, iar ordinul este CMMMC-ul lor. Pentru o limită superioară, descompui lungimile în puteri de prime distincte, fără să mărești suma și păstrând CMMMC-ul. Posibilitățile maxime sunt: cu 11, ordin 11; cu 7, restul 5 dă cel mult 6, deci 42; cu 5, restul 7 dă cel mult 12, deci 60; numai cu 2 și 3 obții cel mult 24. Maximul 60 se atinge cu cicluri de lungimi 5,4,3.']
 ],{prompt:'Găsește o rădăcină pătrată pentru τ=(1 2)(3 4).',steps:['Intercalăm cele două cicluri: σ=(1 3 2 4).','σ² trimite 1→2,2→1,3→4,4→3.','Deci σ²=τ. Rădăcina nu este unică.']},[
 N('Care este cel mai mare ordin al unei permutări din S₁₂?',60,'Compară CMMMC-urile partițiilor; 5+4+3=12.',['Un exemplu are cicluri de lungimi 5,4,3 și ordin 60.','Limita superioară se obține din puterile de prime descrise în lecție.']),
 C('În S₉, τ=(1 2 3 4)(5 6 7 8 9). Există σ cu σ²=τ?',[{id:'a',label:'Nu: lungimea pară 4 apare o singură dată'},{id:'b',label:'Da, orice permutare are rădăcină pătrată'}],'a','Privește numărul ciclurilor de lungime pară.',['Un pătrat produce un număr par de cicluri de fiecare lungime pară.','τ are un singur ciclu de lungime 4, deci nu există σ.'])
 ],'Un exemplu de ordin mare dovedește doar că maximul este cel puțin acea valoare. Mai trebuie o limită superioară.',['ordin-permutare','signatura'])],
 ['corp',L('cuaternioni','inele','Cuaternionii și inversul prin conjugat','Să calculezi într-un exemplu în care înmulțirea nu este comutativă.',[
 ['Patru componente','Un cuaternion este q=a+bi+cj+dk, cu a,b,c,d reale. Relațiile sunt i²=j²=k²=−1, ij=k, jk=i, ki=j; în sens invers semnul se schimbă: ji=−k, kj=−i, ik=−j.'],
 ['Conjugatul și norma','Conjugatul este q̄=a−bi−cj−dk. Norma pătratică N(q)=a²+b²+c²+d² satisface qq̄=q̄q=N(q). Pentru q≠0, inversul este q̄/N(q). Norma este un număr real și comută cu toate componentele.'],
 ['Ce structură obținem','Cuaternionii formează un inel cu diviziune: orice element nenul are invers, dar ij≠ji. Dacă folosim termenul corp cu sensul de corp comutativ, ℍ nu este un astfel de corp. Verifică convenția autorului; metoda inversului rămâne aceeași.']
 ],{prompt:'Găsește inversul lui q=2i−j+k.',steps:['Conjugatul este −2i+j−k.','N(q)=4+1+1=6.','q⁻¹=−i/3+j/6−k/6. Produsul cu q este 1.']},[
 N('Pentru q=2xi−j+k și x=2, calculează N(q).',18,'Norma este suma pătratelor componentelor.',['N(q)=4x²+2=4·4+2=18.']),
 T('Scrie componentele (a,b,c,d) ale inversului lui 2i−j+k, în ordinea 1,i,j,k.',[0,'-1/3','1/6','-1/6'],'Împarte componentele conjugatului la 6.',['q⁻¹=0−i/3+j/6−k/6.'])
 ],'Ordinea factorilor contează: ij=k, dar ji=−k.',['corp'])],
 ['viete',L('viete-general','inele','Viète pentru grad mai mare','Să citești sumele de produse din fișa profesorului.',[
 ['Formula generală','Dacă f(X)=aₙXⁿ+…+a₀=aₙ∏(X−rᵢ), cu aₙ≠0, suma produselor de câte k rădăcini distinct indexate este (−1)ᵏaₙ₋ₖ/aₙ. Rădăcinile se numără cu multiplicitate.'],
 ['Gradul trei','Pentru aX³+bX²+cX+d, avem r+s+t=−b/a, rs+rt+st=c/a și rst=−d/a. Semnele alternează: minus, plus, minus. Într-un corp finit, împărțirea este înmulțire cu inversul coeficientului a.'],
 ['Sume de pătrate','Din (r+s+t)²=r²+s²+t²+2(rs+rt+st), rezultă r²+s²+t²=(r+s+t)²−2(rs+rt+st). Nu este necesar să găsești rădăcinile individual.']
 ],{prompt:'r,s,t sunt rădăcinile lui X³−6X²+11X−6. Găsește r²+s²+t².',steps:['Viète dă r+s+t=6 și rs+rt+st=11.','Suma pătratelor este 6²−2·11=14.']},[
 N('r,s,t sunt rădăcinile lui X³−6X²+11X−6. Calculează rst.',6,'Pentru gradul 3, produsul este −d/a.',['−(−6)/1=6.']),
 T('Pentru 2X³−4X²+6X−8, scrie (r+s+t, rs+rt+st, rst), cu rădăcinile numărate cu multiplicitate.',[2,3,4],'Împarte fiecare coeficient la coeficientul dominant 2 și alternează semnele.',['−(−4)/2=2; 6/2=3; −(−8)/2=4.'])
 ],'Viète folosește toate rădăcinile cu multiplicitate într-un corp în care polinomul se descompune.',['viete'])],
 ['det2',L('matrice-modulare','matrice','Matrice inversabile modulo n','Să rezolvi AB=C în inelul matricelor, fără împărțiri nepermise.',[
 ['Condiția corectă','Peste ℤₙ, o matrice pătratică este inversabilă exact când determinantul ei este unitate: gcd(det A,n)=1. Un determinant nenul modulo n nu este suficient când n este compus.'],
 ['Formula 2×2','Pentru A cu liniile (a,b),(c,d), inversa este (ad−bc)⁻¹ înmulțit cu matricea cu liniile (d,−b),(−c,a), toate componentele reduse modulo n. Verifici atât AA⁻¹, cât și A⁻¹A.'],
 ['Ecuația matricială','Din AB=C și B inversabilă, înmulțești la dreapta cu B⁻¹: A=CB⁻¹. Nu schimba ordinea: în general B⁻¹C nu rezolvă ecuația dată.']
 ],{prompt:'B=((3,17),(4,19)), C=((14,11),(10,16)) în M₂(ℤ₂₆). Găsește A cu AB=C.',steps:['det B=3·19−17·4=−11≡15, iar 15⁻¹≡7 (mod 26).','B⁻¹=7·((19,9),(22,3))=((3,11),(24,21)).','A=CB⁻¹=((20,21),(24,4)), calculând fiecare componentă modulo 26.']},[
 N('B are liniile (3,17),(4,19) peste ℤ₂₆. Scrie determinantul în {0,…,25}.',15,'Redu −11 modulo 26.',['−11+26=15.']),
 C('A are liniile (2,0),(0,1) peste ℤ₂₆. Este A inversabilă?',[{id:'a',label:'Nu: determinantul 2 nu este unitate'},{id:'b',label:'Da: determinantul este nenul'}],'a','Calculează gcd(2,26).',['gcd(2,26)=2; nu există inversul multiplicativ al determinantului.'])
 ],'AB=C se rezolvă prin înmulțire la dreapta cu B⁻¹, în această ordine.',['det2','corp','invers'])],
 ['crt',L('primalitate','aplicatii','Ordinul și divizorii unui număr mare','Să transformi o informație despre puteri într-o listă scurtă de divizori.',[
 ['Din congruență în divizibilitate','Dacă aᵏ≡1 (mod p), atunci p divide aᵏ−1. Pentru a demonstra că aᵏ−1 este compus, mai verifici că 1<p<aᵏ−1. De exemplu, ord₂₃(6)=11 implică 23 | 6¹¹−1.'],
 ['Exemplul 65537','Dacă N=2¹⁶+1=65537 ar fi compus, ar avea un divizor prim p≤√N<257. N este impar, deci p≠2; avem 2¹⁶≡−1 și 2³²≡1 (mod p). Ordinul lui 2 divide 32, dar nu divide 16, deci este exact 32. Prin Lagrange, 32|(p−1).'],
 ['Închiderea demonstrației','Primele de forma p=1+32t sub 257 sunt numai 97 și 193. Resturile sunt 65537≡62 (mod 97) și 65537≡110 (mod 193). Niciuna nu divide N, deci 65537 este prim. Un test Fermat reușit singur nu ar fi fost o demonstrație de primalitate.']
 ],{prompt:'De ce 6¹¹−1 nu este prim, știind ord₂₃(6)=11?',steps:['6¹¹≡1 (mod 23), deci 23 divide 6¹¹−1.','6¹¹−1=362797055>23.','Există un divizor propriu 23, deci numărul este compus.']},[
 S('Un prim p<257 divide 65537. Din condiția p≡1 (mod 32), care sunt singurii candidați primi?',[97,193],'Examinează 33,65,97,129,161,193,225.',['33,65,129,161,225 sunt compuse; rămân 97 și 193.']),
 N('Se știe ord₂₃(6)=11. Dă un divizor prim al lui 6¹¹−1.',23,'Reinterpretează congruența 6¹¹≡1.',['23 este prim și divide 6¹¹−1.'])
 ],'O congruență de tip Fermat nu este în general suficientă pentru a dovedi că modulul este prim.',['euler-fermat','ordin-multiplicativ'])],
 ['primalitate',L('logaritm-discret','aplicatii','Ecuații aˣ≡b','Să distingi necunoscuta din exponent de necunoscuta dintr-un produs.',[
 ['Ce se schimbă','ax≡b este o ecuație liniară modulară; aˣ≡b are necunoscuta în exponent. Înmulțirea cu inversul lui a nu scoate exponentul. Căutăm un logaritm discret în subgrupul generat de a.'],
 ['Un ciclu finit','Dacă a este unitate și are ordinul d, puterile a⁰,…,aᵈ⁻¹ sunt distincte și se repetă cu perioada d. Dacă b apare la poziția r, soluțiile întregi sunt x≡r (mod d); dacă b nu apare, nu există soluții.'],
 ['Exemplu din rezumat','Pentru 2ˣ≡29 (mod 59), ord₅₉(2)=58. Pătratele succesive dau 2⁴≡16, 2⁸≡20, 2¹⁶≡46. Atunci 2²⁸≡46·20·16≡29. Unicitatea exponentului în {1,…,58} rezultă din ordinul 58.']
 ],{prompt:'Rezolvă 2ˣ≡4 (mod 7), x întreg.',steps:['Puterile lui 2 sunt 1,2,4,1,…; ordinul este 3.','4 apare la exponentul 2.','Soluțiile sunt x≡2 (mod 3), nu modulo 7.']},[
 N('Găsește x∈{1,…,58} cu 2ˣ≡29 (mod 59).',28,'Folosește 28=16+8+4.',['2²⁸≡46·20·16≡29 (mod 59).']),
 C('Ecuația 2ˣ≡3 (mod 7), cu x întreg, are:',[{id:'a',label:'Nicio soluție'},{id:'b',label:'Soluția x=3'},{id:'c',label:'Soluția x=5'}],'a','Puterile lui 2 parcurg numai 1,2,4.',['3 nu este în subgrupul {1,2,4}, deci nu există soluții.'])
 ],'Perioada exponentului este ordinul bazei, nu modulul congruenței.',['puteri','ordin-multiplicativ'])],
 ['rsa',L('vigenere','aplicatii','Vigenère și alfabetul modulo 26','Să aplici adunarea și scăderea claselor la un text.',[
 ['Codarea literelor','Folosim alfabetul latin A,…,Z cu A=0,B=1,…,Z=25. Pentru fiecare poziție, cifrul Vigenère adună codul literei mesajului cu codul literei din cheia repetată, modulo 26. Decriptarea scade cheia, modulo 26.'],
 ['Un exemplu complet','Mesajul ALGEBRA cu cheia AB folosește cheia ABABABA. Codurile cheii sunt alternativ 0,1. Criptarea produce AMGFBSA. La decriptare, M−B înseamnă 12−1=11, deci L.'],
 ['Când cheia nu este cunoscută','Doar lungimea cheii nu determină unic mesajul. Pentru un text de șase litere și o cheie necunoscută de două litere există 26² chei candidate. Se pot compara frecvențe și cuvinte plauzibile, dar nu prezenta o presupunere lingvistică drept unicitate matematică.']
 ],{prompt:'Decriptează AMGFBSA cu cheia AB și A=0.',steps:['Repetăm cheia: ABABABA.','Scădem alternativ 0 și 1 modulo 26.','Obținem ALGEBRA.']},[
 N('În Vigenère cu A=0, ce cod obții criptând Z cu cheia B?',0,'Z are cod 25, iar B are cod 1.',['25+1≡0 (mod 26), deci litera este A.']),
 C('Pentru DNSDDS se cunoaște numai că cheia are două litere. Mesajul este determinat unic?',[{id:'a',label:'Nu: sunt necesare informații suplimentare despre cheie sau mesaj'},{id:'b',label:'Da: lungimea cheii determină mesajul'}],'a','Fiecare dintre cele 676 de chei produce o decriptare.',['Nu există unicitate doar din lungimea cheii. Un cuvânt plauzibil este o ipoteză suplimentară.'])
 ],'Precizează convenția alfabetului: A=0 și A=1 dau calcule diferite.',['resturi','rsa'])],
 ['numarare',L('incluziune-excluziune','aplicatii','Numere prime cu 30 și incluziune–excluziune','Să numeri fără să enumeri toate valorile.',[
 ['Ce excludem','gcd(x,30)=1 înseamnă că x nu este divizibil nici cu 2, nici cu 3, nici cu 5. Între 1 și N sunt ⌊N/d⌋ multipli ai lui d. ⌊t⌋ este partea întreagă inferioară.'],
 ['Corectăm suprapunerile','Scădem multiplii lui 2,3,5. Am scăzut de două ori multiplii lui 6,10,15, deci îi adunăm. Multiplii lui 30 ajung astfel numărați o dată și trebuie scăzuți. Formula este N−⌊N/2⌋−⌊N/3⌋−⌊N/5⌋+⌊N/6⌋+⌊N/10⌋+⌊N/15⌋−⌊N/30⌋.'],
 ['Pentru N=200','Calculăm 200−100−66−40+33+20+13−6=54. O verificare independentă folosește blocuri de lungime 30: fiecare bloc complet are φ(30)=8 valori, iar în 181,…,200 sunt șase valori prime cu 30.']
 ],{prompt:'Câte numere din {1,…,30} sunt prime cu 30?',steps:['30−15−10−6+5+3+2−1=8.','Valorile sunt 1,7,11,13,17,19,23,29.']},[
 N('Câte numere naturale x≤200 satisfac gcd(x,30)=1?',54,'0 nu este prim cu 30. Aplică formula cu părți întregi.',['200−100−66−40+33+20+13−6=54.']),
 N('Câte numere din {1,…,20} nu sunt divizibile nici cu 2, nici cu 3?',7,'Scade multiplii și adaugă intersecția, multiplii lui 6.',['20−10−6+3=7. Valorile sunt 1,5,7,11,13,17,19.'])
 ],'Nu folosi N·φ(30)/30 dacă N nu este multiplu de 30: trebuie tratat și blocul incomplet.',['numarare','euclid'])]
 ];
 for(const [after,lesson] of additions){const index=lessons.findIndex(l=>l.id===after);if(index<0)throw Error('Lecție de inserare absentă: '+after);lessons.splice(index+1,0,lesson);}
 lessons.find(l=>l.id==='det2').theory.unshift(['Cum arată o matrice','O matrice este un tabel de numere: liniile sunt orizontale, coloanele sunt verticale. Scrierea cu liniile (2,3),(1,4) înseamnă 2 și 3 pe prima linie, 1 și 4 pe a doua. „2×2” spune două linii și două coloane. Un scalar înseamnă aici un număr din mulțimea în care calculăm.']);
 lessons.find(l=>l.id==='matrice-modulare').theory.unshift(['Înmulțirea matricelor','Pentru A=((a,b),(c,d)) și B=((e,f),(g,h)), produsul AB are liniile (ae+bg, af+bh), (ce+dg, cf+dh): fiecare componentă este suma produselor dintre o linie a primei matrice și o coloană a celei de-a doua. Matricea I=((1,0),(0,1)) este neutrul. Inversa A⁻¹ trebuie să satisfacă AA⁻¹=A⁻¹A=I.']);
 const quadratic=lessons.find(l=>l.id==='patratice');
 quadratic.theory.push(['Criteriul lui Euler','Pentru p prim impar și a nenul, a este pătrat modulo p exact când a^((p−1)/2)≡1. Dacă rezultatul este −1, nu există rădăcină. a=0 se tratează separat. Pentru p≡3 (mod 4) și a pătrat nenul, t=a^((p+1)/4) este o rădăcină; cealaltă este −t. Formula se aplică numai după verificarea existenței.']);
 quadratic.exercises.push(
 S('Găsește toate rădăcinile lui x²−5 în ℤ₂₁₁. Poți folosi 5⁵³≡65 (mod 211).',[65,146],'211≡3 (mod 4); verifică 65² modulo 211.',['65²=4225≡5 (mod 211).','Cealaltă rădăcină este −65≡146. Un polinom de grad 2 peste un corp nu are alte rădăcini.']),
 S('Găsește toate rădăcinile lui x²−2 în ℤ₂₁₁, știind 2¹⁰⁵≡−1 (mod 211).',[],'Aplică criteriul lui Euler.',['2 este nenul și 2^((211−1)/2)≡−1, deci nu este pătrat.','Mulțimea rădăcinilor este ∅.'])
 );
 const parameters=lessons.find(l=>l.id==='parametri');
 parameters.exercises[0].prompt='Pentru mx+my+z=m, x+my+z=1, x+y+mz=m, ce valori reale ale lui m anulează determinantul?';
 parameters.exercises[1].prompt='Pentru mx+my+z=m, x+my+z=1, x+y+mz=m, câte soluții reale există la m=1?';
}


