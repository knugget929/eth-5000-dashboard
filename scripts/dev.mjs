import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {extname,join,normalize} from 'node:path';

const root=new URL('../',import.meta.url).pathname;
const port=Number(process.env.PORT||4173);
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.svg':'image/svg+xml'};

createServer(async(req,res)=>{
  try{
    const raw=decodeURIComponent(new URL(req.url,'http://local').pathname);
    const requestPath=raw==='/'?'/index.html':raw;
    const file=normalize(join(root,requestPath));
    if(!file.startsWith(root))throw new Error('invalid path');
    const info=await stat(file);
    if(!info.isFile())throw new Error('not a file');
    res.writeHead(200,{'content-type':types[extname(file)]||'application/octet-stream','cache-control':'no-store'});
    res.end(await readFile(file));
  }catch{
    res.writeHead(404,{'content-type':'text/plain; charset=utf-8'});res.end('Not found');
  }
}).listen(port,'0.0.0.0',()=>console.log(`ETH dashboard preview on ${port}`));
