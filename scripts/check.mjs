import {spawnSync} from 'node:child_process';
import {readdirSync} from 'node:fs';
for(const folder of ['site','scripts'])for(const file of readdirSync(folder).filter(f=>/\.(m?js)$/.test(f))){const result=spawnSync(process.execPath,['--check',`${folder}/${file}`],{stdio:'inherit'});if(result.status!==0)process.exit(result.status||1);}
const tests=readdirSync('tests').filter(f=>f.endsWith('.test.mjs')).map(f=>'tests/'+f);
const result=spawnSync(process.execPath,['--test',...tests],{stdio:'inherit'});process.exit(result.status||0);
