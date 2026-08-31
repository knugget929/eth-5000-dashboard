import {cp,mkdir,rm,copyFile} from 'node:fs/promises';
const out=new URL('../dist/',import.meta.url);
await rm(out,{recursive:true,force:true});
await mkdir(new URL('./data/',out),{recursive:true});
await mkdir(new URL('./.openai/',out),{recursive:true});
for(const file of ['index.html','styles.css','app.js'])await copyFile(new URL(`../${file}`,import.meta.url),new URL(file,out));
await cp(new URL('../data/',import.meta.url),new URL('./data/',out),{recursive:true});
await copyFile(new URL('../.openai/hosting.json',import.meta.url),new URL('./.openai/hosting.json',out));
