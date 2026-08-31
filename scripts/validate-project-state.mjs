import {readFile} from 'node:fs/promises';
const state=JSON.parse(await readFile(new URL('../.project/PROJECT_STATE.json',import.meta.url),'utf8'));
if(state.version!==2)throw new Error('Project state version must be 2');
if(state.repository!=='knugget929/eth-5000-dashboard')throw new Error('Unexpected source repository');
if(state.production.provider!=='chatgpt-sites')throw new Error('Production provider must be ChatGPT Sites');
console.log('Validated project state and release surface.');
