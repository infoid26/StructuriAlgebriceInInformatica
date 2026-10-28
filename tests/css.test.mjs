import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const sass=require('sass');
test('every stylesheet loaded by the page parses as plain CSS',()=>{
 const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
 const styles=[...html.matchAll(/<link[^>]*href="([^"?]+\.css)(?:\?[^"]*)?"/g)].map(match=>match[1]);
 assert.ok(styles.length);
 for(const name of styles){const url=new URL('../'+name,import.meta.url);sass.compileString(fs.readFileSync(url,'utf8'),{syntax:'css',url,logger:{warn(){},debug(){}}});}
});
test('CSS validation rejects unterminated import URLs',()=>{
 assert.throws(()=>sass.compileString("@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;\n:root{--bg:#10141f}",{syntax:'css',logger:{warn(){},debug(){}}}));
});
