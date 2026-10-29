import {createAccountHandler,createProgressStore,progressDatabaseSettings} from './accounts.mjs';
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.jpeg':'image/jpeg','.jpg':'image/jpeg','.png':'image/png','.woff2':'font/woff2','.woff':'font/woff','.ttf':'font/ttf','.svg':'image/svg+xml'};
export function runtimeSettings(env=process.env){
 const production=env.NODE_ENV==='production'||Boolean(env.WEBSITE_INSTANCE_ID);
 const port=Number(env.PORT||3000);
 if(!Number.isInteger(port)||port<1||port>65535)throw Error('PORT invalid');
 return {production,port,host:env.HOST||(production?'0.0.0.0':'127.0.0.1')};
}
export function createServer(options={}){const env=options.env||process.env;const store=options.progressStore||createProgressStore(progressDatabaseSettings(env));const account=createAccountHandler({env,store});return http.createServer(async(req,res)=>{try{const accountPath=new URL(req.url,'https://course.example').pathname;if(await account(req,res,accountPath))return;if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{Allow:'GET, HEAD'});res.end();return;}const pathname=decodeURIComponent(new URL(req.url,'https://course.example').pathname);if(pathname==='/api/health'){res.writeHead(200,{'Content-Type':'application/json'});res.end(req.method==='HEAD'?undefined:JSON.stringify({status:'ok',course:'Structuri algebrice'}));return;}const parts=pathname.split('/').filter(Boolean);if(parts.some(p=>p==='..'||p.startsWith('.')||p.includes('\\'))){res.writeHead(404);res.end('Not found');return;}const requested=pathname==='/'||pathname==='/index.html'?'index.html':pathname.slice(1);if(requested!=='index.html'&&!['site','vendor'].includes(parts[0])){res.writeHead(404);res.end('Not found');return;}const target=await fs.realpath(path.join(root,requested));const relative=path.relative(root,target);if(relative.startsWith('..')||path.isAbsolute(relative)){res.writeHead(404);res.end('Not found');return;}const type=types[path.extname(target).toLowerCase()];if(!type){res.writeHead(404);res.end('Not found');return;}const body=await fs.readFile(target);res.writeHead(200,{'Content-Type':type,'Content-Length':body.length,'Cache-Control':'no-cache','X-Content-Type-Options':'nosniff','Referrer-Policy':'same-origin'});res.end(req.method==='HEAD'?undefined:body);}catch(error){res.writeHead(['ENOENT','EISDIR','ENOTDIR'].includes(error.code)?404:error instanceof URIError?400:500);res.end('Request failed');}});}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){const settings=runtimeSettings();const server=createServer();server.on('error',e=>{console.error(e.message);process.exitCode=1;});server.listen(settings.port,settings.host,()=>console.log(`Server started on port ${server.address().port}`));}


