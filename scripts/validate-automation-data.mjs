import {readFile} from 'node:fs/promises';

const root=new URL('../data/',import.meta.url);
const read=async path=>JSON.parse(await readFile(new URL(path,root),'utf8'));
const [thesis,policy,research,evaluation]=await Promise.all([
  read('thesis.json'),
  read('thesis-policy.json'),
  read('research/latest.json'),
  read('evaluation/current.json')
]);

const targets=['5000','10000'];
const catalystIds=thesis.catalysts.map(item=>item.id);
if(evaluation.policyVersion!==policy.policyVersion)throw new Error('Evaluation policy version is stale');
if(!research.researchedAt||!evaluation.evaluatedAt)throw new Error('Research and evaluation timestamps are required');

for(const target of targets){
  if(evaluation.targets[target].probability!==thesis.targets[target].probability)throw new Error(`${target} evaluation probability does not match thesis.json`);
  const policyIds=Object.keys(policy.catalystWeights[target]);
  if(policyIds.length!==catalystIds.length||policyIds.some(id=>!catalystIds.includes(id)))throw new Error(`${target} policy catalyst set does not match thesis.json`);
  const policyWeight=Object.values(policy.catalystWeights[target]).reduce((sum,value)=>sum+value,0);
  if(policyWeight!==100)throw new Error(`${target} policy weights must total 100`);
  for(const catalyst of thesis.catalysts){
    const current=evaluation.catalysts[catalyst.id]?.[target];
    const rendered=catalyst.targets[target];
    if(!current)throw new Error(`Missing evaluation for ${catalyst.id}/${target}`);
    if(current.status!==rendered.status||current.score!==rendered.score)throw new Error(`Evaluation drift for ${catalyst.id}/${target}`);
    if(rendered.weight!==policy.catalystWeights[target][catalyst.id])throw new Error(`Weight drift for ${catalyst.id}/${target}`);
  }
}

for(const observation of research.observations){
  if(!catalystIds.includes(observation.catalyst))throw new Error(`Unknown research catalyst ${observation.catalyst}`);
  for(const sourceId of observation.sourceIds){
    if(!research.sources[sourceId])throw new Error(`Missing research source ${sourceId}`);
  }
}

console.log('Validated policy, research, evaluation, and rendered thesis alignment.');
