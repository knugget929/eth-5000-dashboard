import {readFile} from 'node:fs/promises';
const data=JSON.parse(await readFile(new URL('../data/thesis.json',import.meta.url),'utf8'));
const targets=['5000','10000'];
if(!/^\d{4}-\d{2}-\d{2}$/.test(data.updatedAt))throw new Error('updatedAt must be YYYY-MM-DD');
for(const target of targets){
  const item=data.targets[target];
  if(!item||item.probability<0||item.probability>100)throw new Error(`Invalid ${target} probability`);
  if(!Array.isArray(item.probabilityHistory)||!item.probabilityHistory.length)throw new Error(`Missing ${target} history`);
  if(item.probabilityHistory.at(-1).probability!==item.probability)throw new Error(`${target} latest history must match probability`);
}
for(const catalyst of data.catalysts){
  for(const target of targets){
    const view=catalyst.targets[target];
    if(!view||!['green','yellow','red'].includes(view.status))throw new Error(`Invalid ${catalyst.id}/${target} status`);
    if(view.score<0||view.score>1)throw new Error(`Invalid ${catalyst.id}/${target} score`);
  }
}
console.log(`Validated ${data.catalysts.length} catalysts, ${data.changes.length} change entries, and both target histories.`);
