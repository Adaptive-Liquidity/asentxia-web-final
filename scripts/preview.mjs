import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
const root=resolve('dist');
const args=process.argv.slice(2),port=Number(args[args.indexOf('--port')+1]||4173);
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.json':'application/json','.woff2':'font/woff2'};
createServer(async(req,res)=>{try{let file=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!file.startsWith(root+'/')&&file!==root)throw Error();if((await stat(file)).isDirectory())file+='/index.html';const body=await readFile(file);res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(body)}catch{res.writeHead(404);res.end('Not found')}}).listen(port,'0.0.0.0',()=>console.log('Static preview ready'));
