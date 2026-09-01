import {readFile} from 'node:fs/promises';
const state=JSON.parse(await readFile(new URL('../.project/PROJECT_STATE.json',import.meta.url),'utf8'));
if(state.version!==3)throw new Error('Project state version must be 3');
if(state.repository!=='knugget929/eth-5000-dashboard')throw new Error('Unexpected source repository');
if(state.production.provider!=='github-pages'||state.production.status!=='live')throw new Error('Production must be live on GitHub Pages');
if(state.delivery.mode!=='direct-main'||state.delivery.reviewRequired!==false)throw new Error('Expected lightweight direct-main delivery');
console.log('Validated project state and release surface.');
