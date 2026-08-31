const DATA_URL='./data/thesis.json';
const PRICE_SOURCES=[
  {name:'CoinGecko',url:'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&include_24hr_change=true',parse:j=>({price:j.ethereum.usd,change24h:j.ethereum.usd_24h_change})},
  {name:'CryptoCompare',url:'https://min-api.cryptocompare.com/data/pricemultifull?fsyms=ETH&tsyms=USD',parse:j=>({price:j.RAW.ETH.USD.PRICE,change24h:j.RAW.ETH.USD.CHANGEPCT24HOUR})}
];
const FORCE_SNAPSHOT=new URLSearchParams(location.search).get('snapshot')==='1';
let thesis;let activeTarget='5000';
const $=s=>document.querySelector(s);const modal=$('#detailModal');

async function loadThesis(){
  const response=await fetch(DATA_URL,{cache:'no-store'});
  if(!response.ok)throw new Error('Thesis data unavailable');
  thesis=await response.json();
  render();
  if(FORCE_SNAPSHOT)renderPrice(thesis.market.price,thesis.market.change24h,'Snapshot fallback',false);
  else loadLivePrice(thesis.market);
}

function getForecast(){return thesis.targets[activeTarget]}
function statusLabel(status){return status==='green'?'SUPPORTIVE':status==='red'?'HEADWIND':'MIXED'}
function safeText(value=''){return String(value)}

function render(){
  const date=new Date(`${thesis.updatedAt}T12:00:00Z`);
  $('#updatedAt').textContent=date.toLocaleDateString('en-US',{month:'short',day:'numeric'});
  $('#priceTime').textContent=date.toLocaleDateString('en-US',{month:'short',day:'numeric'});
  renderPrice(thesis.market.price,thesis.market.change24h,'Stored snapshot',false);
  renderTargetCards();
  renderActiveTarget();
}

function renderTargetCards(){
  const f5=thesis.targets['5000'],f10=thesis.targets['10000'];
  $('#tabProb5k').textContent=`${f5.probability}%`;
  $('#tabProb10k').textContent=`${f10.probability}%`;
  document.querySelectorAll('[data-target]').forEach(button=>button.classList.toggle('selected',button.dataset.target===activeTarget));
}

function renderActiveTarget(){
  const forecast=getForecast();
  $('#probability').textContent=`${forecast.probability}%`;
  $('#forecastRing').style.setProperty('--p',forecast.probability);
  $('#forecastRing').style.setProperty('--ring',forecast.probability>=55?'var(--green)':forecast.probability>=35?'var(--yellow)':'var(--red)');
  $('#forecastRing').setAttribute('aria-label',`Current thesis estimate ${forecast.probability} percent`);
  $('#forecastLabel').textContent=forecast.label;
  $('#forecastHorizon').textContent=forecast.horizon;
  $('#marketCap').textContent=forecast.marketCap;
  $('#catalystHeading').textContent=`What gets ETH to ${forecast.display}?`;
  $('#pathHeading').textContent=`The route to ${forecast.display}`;
  $('#overallSignal').textContent=forecast.overallSignal;
  renderTrend(forecast);
  renderCatalysts();
  renderPath(forecast);
  renderHistory(forecast);
  renderChanges();
  renderPrice(thesis.market.price,thesis.market.change24h,$('#priceStatus').textContent||'Stored snapshot',$('.market-meta').classList.contains('live'));
}

function renderTrend(forecast){
  const trend=forecast.trend||{direction:'steady',delta:0,label:'Baseline'};
  const badge=$('#trendBadge');
  badge.className=`trend-badge ${trend.direction}`;
  badge.textContent=`${trend.direction==='up'?'▲':trend.direction==='down'?'▼':'●'} ${safeText(trend.label).toUpperCase()}`;
}

function renderCatalysts(){
  const grid=$('#catalystGrid'),rail=$('#signalRail');grid.innerHTML='';rail.innerHTML='';
  const counts={green:0,yellow:0,red:0};
  thesis.catalysts.forEach(catalyst=>{
    const view=catalyst.targets[activeTarget];counts[view.status]++;
    const card=document.createElement('button');
    card.type='button';card.className=`catalyst ${view.status}`;
    card.setAttribute('aria-label',`${catalyst.title}: ${statusLabel(view.status)}, ${Math.round(view.score*100)} out of 100`);
    card.innerHTML=`<div class="catalyst-top"><span class="catalyst-icon" aria-hidden="true">${catalyst.icon}</span><span class="score">${Math.round(view.score*100)} / 100</span></div><h3>${catalyst.title}</h3><p>${view.short}</p><span class="catalyst-bottom">Inspect →</span>`;
    card.addEventListener('click',()=>openCatalyst(catalyst,view));grid.appendChild(card);
    const chip=document.createElement('button');chip.type='button';chip.className=`signal-chip ${view.status}`;chip.textContent=catalyst.title;chip.dataset.short=catalyst.shortTitle||catalyst.title;chip.addEventListener('click',()=>openCatalyst(catalyst,view));rail.appendChild(chip);
  });
  $('#signalText').textContent=`${counts.green} · ${counts.yellow} · ${counts.red}`;
}

function renderPath(forecast){
  $('#path').innerHTML=forecast.path.map(point=>`<div class="path-step ${point.active?'active':''}"><strong>${point.label}</strong><span>${point.note}</span></div>`).join('');
}

function renderHistory(forecast){
  const history=forecast.probabilityHistory||[{date:thesis.updatedAt,probability:forecast.probability}];
  const first=history[0].probability,last=history[history.length-1].probability,delta=last-first;
  const direction=delta>0?'up':delta<0?'down':'steady';
  $('#historyHeading').textContent=`${forecast.display} thesis · ${history.length===1?'baseline':'recent path'}`;
  const deltaNode=$('#historyDelta');deltaNode.className=`history-delta ${direction}`;deltaNode.textContent=`${delta>0?'+':''}${delta} pts`;
  const width=420,height=90,padX=18,padY=18,min=Math.max(0,Math.min(...history.map(x=>x.probability))-8),max=Math.min(100,Math.max(...history.map(x=>x.probability))+8),range=Math.max(1,max-min);
  const points=history.map((entry,index)=>({x:history.length===1?width/2:padX+(index*(width-padX*2)/(history.length-1)),y:padY+(max-entry.probability)*(height-padY*2)/range,...entry}));
  const line=points.map(p=>`${p.x},${p.y}`).join(' '),area=`${points[0].x},${height} ${line} ${points[points.length-1].x},${height}`;
  $('#sparkline').innerHTML=`<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${forecast.display} probability history"><defs><linearGradient id="sparkGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8d91ff" stop-opacity=".25"/><stop offset="1" stop-color="#8d91ff" stop-opacity="0"/></linearGradient></defs><polygon class="area" points="${area}"/><polyline class="line" points="${line}"/>${points.map(p=>`<circle class="point" cx="${p.x}" cy="${p.y}" r="3.5"/><text class="value" text-anchor="middle" x="${p.x}" y="${Math.max(10,p.y-9)}">${p.probability}%</text>`).join('')}</svg>`;
  $('#historyLabels').innerHTML=history.map(entry=>`<span>${formatCompactDate(entry.date)}</span>`).join('');
}

function renderChanges(){
  const entries=(thesis.changes||[]).filter(entry=>!entry.targets||entry.targets.includes(activeTarget));
  $('#changesList').innerHTML=entries.map(entry=>{
    const impact=entry.impact?.[activeTarget]||{delta:0,direction:'steady'};
    const delta=impact.delta>0?`+${impact.delta}`:`${impact.delta}`;
    return `<article class="change-entry"><time class="change-date">${formatCompactDate(entry.date)}</time><div><h3>${entry.title}</h3><p>${entry.summary}</p></div><div class="change-impact"><span>${entry.catalyst}</span><strong class="${impact.direction}">${delta} pts</strong></div></article>`;
  }).join('')||'<article class="change-entry"><div></div><div><h3>No changes logged yet</h3><p>The next thesis update will appear here.</p></div></article>';
}

async function loadLivePrice(fallback){
  for(const source of PRICE_SOURCES){
    try{
      const response=await fetch(source.url,{headers:{accept:'application/json'},cache:'no-store'});
      if(!response.ok)throw new Error('price response');
      const parsed=source.parse(await response.json());
      if(!Number.isFinite(+parsed.price)||!Number.isFinite(+parsed.change24h))throw new Error('invalid price');
      thesis.market.price=+parsed.price;thesis.market.change24h=+parsed.change24h;
      renderPrice(+parsed.price,+parsed.change24h,`Live · ${source.name}`,true);
      return;
    }catch(error){/* try the next source */}
  }
  renderPrice(fallback.price,fallback.change24h,'Snapshot fallback',false);
}

function renderPrice(price,change,source,isLive){
  const p=Number.isFinite(+price)?+price:0,c=Number.isFinite(+change)?+change:0,target=Number(activeTarget);
  $('#price').textContent=p.toLocaleString('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0});
  $('#currentPriceLabel').textContent=`${formatCompactPrice(p)} current`;
  const changeNode=$('#change');changeNode.textContent=`${c>=0?'+':''}${c.toFixed(1)}%`;changeNode.className=`change ${c>.15?'up':c<-.15?'down':'neutral'}`;
  const progress=Math.max(1.5,Math.min(98,(p/10000)*100));$('#targetFill').style.width=`${progress}%`;$('#currentMarker').style.left=`${progress}%`;
  const rem=Math.max(0,100-Math.min(100,(p/target)*100));$('#distance').textContent=p>=target?`${getForecast().display} reached`:`${Math.round(rem)}% remaining to ${getForecast().display}`;
  $('#distance5k').textContent=p>=5000?'reached':`${Math.round(100-(p/5000*100))}% away`;
  $('#distance10k').textContent=p>=10000?'reached':`${Math.round(100-(p/10000*100))}% away`;
  $('#priceStatus').innerHTML=`<i></i>${source}`;$('.market-meta').classList.toggle('live',isLive);$('#priceFreshness').textContent=isLive?'live market feed':'latest stored snapshot';
  if(isLive)$('#priceTime').textContent=new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
}

function openCatalyst(catalyst,view){
  $('#modalStatus').className=`status-pill ${view.status}`;$('#modalStatus').textContent=statusLabel(view.status);
  $('#modalTitle').textContent=catalyst.title;$('#modalSummary').textContent=view.summary;
  $('#modalBody').innerHTML=`<div class="fact wide"><b>Current evidence</b><span>${view.evidence}</span></div><div class="fact"><b>Why it matters for ${getForecast().display}</b><span>${view.why}</span></div><div class="fact"><b>Weight in this thesis</b><span>${view.weight}% · score ${Math.round(view.score*100)}/100</span></div><div class="fact"><b>What turns greener</b><span>${view.greenTrigger}</span></div><div class="fact"><b>What turns redder</b><span>${view.redTrigger}</span></div>`;
  renderSources(catalyst.sources||[]);modal.showModal();
}

function openSpecial(kind){
  const forecast=getForecast();$('#modalStatus').className='status-pill yellow';$('#modalStatus').textContent='MODEL';
  if(kind==='forecast'){
    $('#modalTitle').textContent=`How the ${forecast.display} estimate works`;$('#modalSummary').textContent=`${forecast.probability}% is the current subjective thesis estimate—not a market-implied probability.`;
    $('#modalBody').innerHTML=`<div class="fact"><b>Horizon</b><span>${forecast.horizon}</span></div><div class="fact"><b>Implied valuation</b><span>${forecast.marketCap} at roughly current circulating supply.</span></div><div class="fact wide"><b>Current base case</b><span>${forecast.baseCase}</span></div><div class="fact wide"><b>Scoring logic</b><span>${forecast.methodology}</span></div>`;
  }else{
    $('#modalTitle').textContent='Methodology';$('#modalSummary').textContent='A compact personal decision dashboard, not a trading signal.';
    $('#modalBody').innerHTML=`<div class="fact"><b>Supportive</b><span>Currently helps the selected target.</span></div><div class="fact"><b>Mixed</b><span>Early, incomplete, or dependent on future evidence.</span></div><div class="fact"><b>Headwind</b><span>Currently works against the selected target.</span></div><div class="fact"><b>Target logic</b><span>$5K and $10K share catalysts but use different thresholds.</span></div><div class="fact wide"><b>Value capture</b><span>Ethereum ecosystem adoption counts only when it creates credible demand for ETH through staking, collateral, settlement, fees, burn, or monetary premium.</span></div><div class="fact wide"><b>Important</b><span>This is opinionated scenario analysis, not financial advice. Crypto is volatile and estimates can change quickly.</span></div>`;
  }
  renderSources(forecast.sources||[]);modal.showModal();
}

function renderSources(sources){$('#modalSources').innerHTML=sources.map(source=>`<a href="${source.url}" target="_blank" rel="noreferrer">${source.label} ↗</a>`).join('')}
function formatCompactDate(value){return new Date(`${value}T12:00:00Z`).toLocaleDateString('en-US',{month:'short',day:'numeric'})}
function formatCompactPrice(value){return value>=1000?`$${(value/1000).toFixed(value%1000?2:0)}K`:`$${Math.round(value)}`}

document.querySelectorAll('[data-target]').forEach(button=>button.addEventListener('click',()=>{activeTarget=button.dataset.target;renderTargetCards();renderActiveTarget()}));
document.querySelectorAll('[data-modal]').forEach(button=>button.addEventListener('click',()=>openSpecial(button.dataset.modal)));
$('#closeModal').addEventListener('click',()=>modal.close());
modal.addEventListener('click',event=>{if(event.target===modal)modal.close()});
loadThesis().catch(()=>{$('#priceFreshness').textContent='data unavailable';$('#priceStatus').innerHTML='<i></i>Unable to load thesis';});
