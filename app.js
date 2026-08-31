const DATA_URL = './data/thesis.json';
const PRICE_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&include_24hr_change=true';

let thesis;
let activeTarget = '5000';

const $ = (s) => document.querySelector(s);
const modal = $('#detailModal');

async function loadThesis(){
  const res = await fetch(DATA_URL, {cache:'no-store'});
  thesis = await res.json();
  render(thesis);
  loadLivePrice(thesis.market);
}

function getForecast(){ return thesis.targets[activeTarget]; }

function render(data){
  $('#updatedAt').textContent = new Date(`${data.updatedAt}T12:00:00Z`).toLocaleDateString('en-US',{month:'short',day:'numeric'});
  renderPrice(data.market.price, data.market.change24h, 'Snapshot');
  renderTargetCards();
  renderActiveTarget();
}

function renderTargetCards(){
  const f5 = thesis.targets['5000'];
  const f10 = thesis.targets['10000'];
  $('#prob5k').textContent = `${f5.probability}%`;
  $('#prob10k').textContent = `${f10.probability}%`;
  $('#horizon5k').textContent = f5.shortHorizon;
  $('#horizon10k').textContent = f10.shortHorizon;
  document.querySelectorAll('.target-card').forEach(b => b.classList.toggle('selected', b.dataset.target === activeTarget));
}

function renderActiveTarget(){
  const f = getForecast();
  $('#probability').textContent = `${f.probability}%`;
  $('#forecastRing').style.setProperty('--p', f.probability);
  $('#forecastLabel').textContent = f.label;
  $('#forecastHorizon').textContent = f.horizon;
  $('#marketCap').textContent = f.marketCap;
  $('#catalystHeading').textContent = `What gets ETH to ${f.display}?`;
  $('#pathHeading').textContent = `The shortest route to ${f.display}`;

  const grid = $('#catalystGrid');
  grid.innerHTML = '';
  const counts = {green:0,yellow:0,red:0};
  thesis.catalysts.forEach(c => {
    const view = c.targets[activeTarget];
    counts[view.status]++;
    const card = document.createElement('button');
    card.type='button'; card.className=`catalyst ${view.status}`;
    card.innerHTML = `<div class="catalyst-top"><span class="catalyst-icon">${c.icon}</span><span class="score">${Math.round(view.score*100)}/100</span></div><h3>${c.title}</h3><p>${view.short}</p><span class="catalyst-bottom">Details →</span>`;
    card.addEventListener('click',()=>openCatalyst(c, view));
    grid.appendChild(card);
  });
  $('#greenCount').textContent = counts.green;
  $('#yellowCount').textContent = counts.yellow;
  $('#redCount').textContent = counts.red;

  $('#path').innerHTML = f.path.map(p=>`<div class="path-step ${p.active?'active':''}"><strong>${p.label}</strong><span>${p.note}</span></div>`).join('');
  renderPrice(thesis.market.price, thesis.market.change24h, $('#priceStatus').textContent || 'Snapshot');
}

async function loadLivePrice(fallback){
  try{
    const res = await fetch(PRICE_URL, {headers:{accept:'application/json'}});
    if(!res.ok) throw new Error('Price API unavailable');
    const json = await res.json();
    thesis.market.price = json.ethereum.usd;
    thesis.market.change24h = json.ethereum.usd_24h_change;
    renderPrice(json.ethereum.usd, json.ethereum.usd_24h_change, 'Live CoinGecko');
  }catch(e){
    renderPrice(fallback.price, fallback.change24h, 'Snapshot fallback');
  }
}

function renderPrice(price, change, source){
  const safePrice = Number.isFinite(+price) ? +price : 0;
  const safeChange = Number.isFinite(+change) ? +change : 0;
  const target = Number(activeTarget);
  $('#price').textContent = safePrice.toLocaleString('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0});
  const ch = $('#change');
  ch.textContent = `${safeChange>=0?'+':''}${safeChange.toFixed(1)}%`;
  ch.className = `change ${safeChange>0.15?'up':safeChange<-0.15?'down':'neutral'}`;
  const progress = Math.max(0,Math.min(100,(safePrice/10000)*100));
  $('#targetFill').style.width = `${progress}%`;
  const remaining = Math.max(0, 100 - Math.min(100,(safePrice/target)*100));
  $('#distance').textContent = safePrice >= target ? `${getForecast().display} reached` : `${Math.round(remaining)}% to ${getForecast().display}`;
  $('#priceStatus').textContent = source;
}

function openCatalyst(c, view){
  $('#modalStatus').className=`status-pill ${view.status}`;
  $('#modalStatus').textContent=view.status.toUpperCase();
  $('#modalTitle').textContent=c.title;
  $('#modalSummary').textContent=view.summary;
  $('#modalBody').innerHTML=`<div class="fact"><b>Why it matters for ${getForecast().display}</b><span>${view.why}</span></div><div class="fact"><b>What turns greener</b><span>${view.greenTrigger}</span></div><div class="fact"><b>What turns redder</b><span>${view.redTrigger}</span></div><div class="fact"><b>Weight in this thesis</b><span>${view.weight}%</span></div>`;
  renderSources(c.sources || []);
  modal.showModal();
}

function openSpecial(kind){
  const f=getForecast();
  $('#modalStatus').className='status-pill yellow';
  $('#modalStatus').textContent='MODEL';
  if(kind==='forecast'){
    $('#modalTitle').textContent=`How the ${f.display} prediction works`;
    $('#modalSummary').textContent=`${f.probability}% is my current thesis probability, not a market-implied probability.`;
    $('#modalBody').innerHTML=`<div class="fact"><b>Horizon</b><span>${f.horizon}</span></div><div class="fact"><b>Current base case</b><span>${f.baseCase}</span></div><div class="fact"><b>Implied valuation</b><span>${f.marketCap} at roughly current circulating supply.</span></div><div class="fact"><b>Scoring</b><span>${f.methodology}</span></div>`;
  }else{
    $('#modalTitle').textContent='Methodology';
    $('#modalSummary').textContent='A compact decision dashboard, not a trading signal.';
    $('#modalBody').innerHTML=`<div class="fact"><b>Green</b><span>Currently supportive of the selected target.</span></div><div class="fact"><b>Yellow</b><span>Mixed, early, or dependent on a future event.</span></div><div class="fact"><b>Red</b><span>Currently a meaningful headwind.</span></div><div class="fact"><b>Target logic</b><span>$5K and $10K use the same core catalysts but different thresholds. $10K requires materially stronger adoption, liquidity, and ETH value capture.</span></div><div class="fact"><b>Important</b><span>This is opinionated scenario analysis, not financial advice. Crypto is volatile and the forecast can change quickly.</span></div>`;
  }
  renderSources(f.sources || []);
  modal.showModal();
}

function renderSources(sources){
  $('#modalSources').innerHTML = sources.map(s=>`<a href="${s.url}" target="_blank" rel="noreferrer">${s.label} ↗</a>`).join('');
}

document.querySelectorAll('.target-card').forEach(b=>b.addEventListener('click',()=>{
  activeTarget = b.dataset.target;
  renderTargetCards();
  renderActiveTarget();
}));
document.querySelectorAll('[data-modal]').forEach(b=>b.addEventListener('click',()=>openSpecial(b.dataset.modal)));
$('#closeModal').addEventListener('click',()=>modal.close());
modal.addEventListener('click',(e)=>{if(e.target===modal) modal.close()});

loadThesis().catch(console.error);
