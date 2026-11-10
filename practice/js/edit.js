// 修改训练：根据种子把目标句"弄坏"，玩家用光标/删除/语音改回原样
function hashStr(s){let h=2166136261;for(const c of s)h=Math.imul(h^c.codePointAt(0),16777619)>>>0;return h}
function rng(seed){let a=seed>>>0;return()=>{a=a+0x6D2B79F5>>>0;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
const FILLERS=[...'的了呢啊吧嗯就那个这'];
const WRONGS={'的':'得','在':'再','做':'作','以':'已','那':'哪','他':'她','是':'事','和':'合','到':'道','会':'回','就':'旧','要':'药','有':'又','一':'衣','个':'各','下':'夏','点':'典','写':'些','给':'几','用':'永','我':'窝','你':'泥','上':'尚','出':'初','可':'课','对':'队','时':'实','后':'候','能':'农'};
const EDIT_TYPES={extra:'删除多余的字',wrong:'改正错别字',missing:'补上漏掉的词',mixed:'综合修改'};
const isHan=c=>/[\u4e00-\u9fff]/.test(c);
function corrupt(text,seed,type){
  const R=rng(seed), a=[...text], n=a.length;
  const k=Math.max(1,Math.min(3,Math.round(n/25)));
  const pick=(f)=>{for(let t=0;t<50;t++){const i=Math.floor(R()*n);if(f(i))return i}return -1};
  const edits=[]; // {pos, kind}
  const used=new Set(); const free=(i,w=1)=>{for(let j=i-1;j<=i+w;j++)if(used.has(j))return false;return true}; const mark=(i,w=1)=>{for(let j=i;j<i+w;j++)used.add(j)};
  const plan=type==='mixed'?['extra','wrong','missing'].slice(0,Math.max(2,k)):Array(k).fill(type);
  for(const kind of plan){
    if(kind==='extra'){const i=pick(i=>free(i)&&isHan(a[i]));if(i<0)continue;mark(i);edits.push({pos:i,kind,ch:FILLERS[Math.floor(R()*FILLERS.length)]})}
    else if(kind==='wrong'){let i=pick(i=>free(i)&&WRONGS[a[i]]);if(i<0)i=pick(i=>free(i)&&isHan(a[i]));if(i<0)continue;mark(i);
      const c=WRONGS[a[i]]||FILLERS.filter(x=>x!==a[i])[Math.floor(R()*9)];edits.push({pos:i,kind,ch:c})}
    else {const w=Math.min(n>12?4:2,2+Math.floor(R()*3));const i=pick(i=>i+w<n&&free(i,w)&&a.slice(i,i+w).every(isHan));if(i<0)continue;mark(i,w);edits.push({pos:i,kind,w})}
  }
  edits.sort((x,y)=>y.pos-x.pos); // 从后往前改，不影响前面位置
  const b=[...a];
  for(const e of edits){ if(e.kind==='extra')b.splice(e.pos,0,e.ch); else if(e.kind==='wrong')b[e.pos]=e.ch; else b.splice(e.pos,e.w); }
  const broken=b.join('');
  const counts={extra:0,wrong:0,missing:0}; edits.forEach(e=>counts[e.kind]++);
  // 理想操作数：从末尾把光标移到最靠前的修改处 + 每处删除次数
  const first=Math.min(...edits.map(e=>e.pos)); const dels=edits.reduce((s,e)=>s+(e.kind==='missing'?0:1),0);
  const ideal=(b.length-first)+dels;
  return {broken,counts,ideal,edits:edits.length};
}
function editHint(c){const p=[];if(c.extra)p.push(`${c.extra} 处多余的字`);if(c.wrong)p.push(`${c.wrong} 处错别字`);if(c.missing)p.push(`${c.missing} 处漏掉的词`);return '有 '+p.join('、')+'，改成和上面一模一样'}
