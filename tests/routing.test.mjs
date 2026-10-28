import test from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from '../scripts/serve.mjs';
// Tests static file routing directly through the HTTP handler.
async function request(url,method='GET'){const server=createServer();const handler=server.listeners('request')[0];return await new Promise((resolve,reject)=>{const res={status:0,headers:{},writeHead(status,headers={}){this.status=status;this.headers=headers;},end(body){resolve({status:this.status,headers:this.headers,body:body?.toString()||''});}};Promise.resolve(handler({url,method},res)).catch(reject);});}
test('static request handler routes files and denies paths outside the public tree',async()=>{for(const url of ['/','/site/app.js','/site/style.css','/api/health'])assert.equal((await request(url)).status,200,url);for(const url of ['/sources/document.pdf','/package.json','/tests/math.test.mjs','/site/.hidden','/site/%5C..%5Cpackage.json','/site/missing.js','/sources/image.jpeg'])assert.equal((await request(url)).status,404,url);assert.equal((await request('/','POST')).status,405);assert.equal((await request('/site/app.js','HEAD')).body,'');assert.ok((await request('/')).body.includes('lang="ro"'));});

