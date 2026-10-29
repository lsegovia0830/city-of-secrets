import http from 'node:http';
import {randomUUID} from 'node:crypto';
import {pathToFileURL} from 'node:url';
export class MemoryBucket {
 constructor(){this.data=new Map()}
 async get(key){const o=this.data.get(key);return o?{etag:o.etag,json:async()=>JSON.parse(o.value)}:null}
 async put(key,value,{onlyIf}={}){const old=this.data.get(key);if(onlyIf?.etagDoesNotMatch==='*'&&old)return null;if(onlyIf?.etagMatches&&old?.etag!==onlyIf.etagMatches)return null;const etag=randomUUID();this.data.set(key,{value,etag});return {etag}}
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const bucket=new MemoryBucket();
 http.createServer(async(req,res)=>{try{const chunks=[];for await(const c of req)chunks.push(c);const body=Buffer.concat(chunks);const worker=(await import('../worker/index.js?'+Date.now())).default;const response=await worker.fetch(new Request('http://'+req.headers.host+req.url,{method:req.method,headers:req.headers,...(body.length?{body}: {})}),{BUCKET:bucket});res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()))}catch(e){console.error(e);res.writeHead(500);res.end('Development server error')}}).listen(Number(process.env.PORT)||(process.argv.includes('--port')?Number(process.argv[process.argv.indexOf('--port')+1]):0)||3000,'0.0.0.0',()=>console.log('City of Secrets development server ready'));
}
