const $=id=>document.getElementById(id), P=window.PROMPTS;
const opts=JSON.parse(localStorage.getItem('hv-practice:opts')||'{"ignorePunct":false,"strict":false,"live":true,"normNum":true}');
let profile, cur=null; // cur: {prompt, mode, dailyKey, t0, ops, timer}
const todayKey=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
function dailyPrompt(k){let h=2166136261;for(const c of k)h=Math.imul(h^c.charCodeAt(0),16777619)>>>0;return P[h%P.length]}
const PASS=()=>opts.strict?1:0.9;
const fmtAcc=a=>(a*100).toFixed(a===1?0:1)+'%';
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

function go(v){document.querySelectorAll('main>section').forEach(s=>s.classList.toggle('hidden',s.id!=='v-'+v));
 document.querySelectorAll('#tabs button').forEach(b=>b.classList.toggle('active',b.dataset.go===v||(!['board','history','lib'].includes(v)&&b.dataset.go==='home')));
 if(v==='board')renderBoard(); if(v==='history')renderHistory(); if(v==='lib')renderLib(); if(v==='home')renderHome(); scrollTo(0,0);}
document.addEventListener('click',e=>{const g=e.target.closest('[data-go]');if(g){stopTimer();go(g.dataset.go)}});
const nav=document.querySelector('.nav');addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>8),{passive:true});

async function renderHome(){
 profile=await Store.getProfile(); $('nick').value=profile.nickname||'';
 $('campDesc').textContent=`共 ${P.length} 关，已通过 ${profile.campaignLevel||0} 关。准确率达到 ${opts.strict?'100%':'90%'} 解锁下一关。`;
 const k=todayKey(), b=(await Store.leaderboard({dailyKey:k})).find(r=>r.nickname===nick());
 $('dailyDesc').textContent=`${k} · ${LEVELS[dailyPrompt(k).level]}${b?` · 今日最佳 ${b.score} 分`:' · 今天还没挑战'}`;
 $('optPunct').checked=opts.ignorePunct;$('optStrict').checked=opts.strict;$('optLive').checked=opts.live;$('optNum').checked=opts.normNum!==false;
}
const nick=()=>($('nick').value.trim()||'我');
$('nick').onchange=async()=>{profile.nickname=$('nick').value.trim();await Store.saveProfile(profile)};
for(const[id,k]of[['optPunct','ignorePunct'],['optStrict','strict'],['optLive','live'],['optNum','normNum']])$(id).onchange=e=>{opts[k]=e.target.checked;localStorage.setItem('hv-practice:opts',JSON.stringify(opts));renderHome()};

document.querySelectorAll('[data-mode]').forEach(c=>c.onclick=()=>{const m=c.dataset.mode;
 if(m==='daily'){const k=todayKey();start(dailyPrompt(k),'daily',k,hashStr('kind'+k)%2?'edit':'say')} else if(m==='edit') renderPick('practice','edit'); else if(m==='lib') go('lib'); else renderPick(m)});

async function renderPick(mode,kind='say'){
 $('pickTitle').textContent=mode==='campaign'?'闯关':kind==='edit'?'修改训练 · 选一题':'自由练习';
 const lv=profile.campaignLevel||0; let html='';
 for(const L of [1,2,3,4,5,6]){ html+=`<div><div class="lbl">${LEVELS[L]}</div><div class="panel">`;
  for(const p of P.filter(p=>p.level===L)){const idx=P.indexOf(p), locked=mode==='campaign'&&idx>lv, best=await Store.bestFor(p.id);
   html+=`<div class="row click ${locked?'lock':''}" data-pid="${p.id}"><span class="tag">${mode==='campaign'?'第 '+(idx+1)+' 关'+(campKind(idx)==='edit'?' · 修改':''):p.text.length+' 字'}</span><div class="t">${esc(p.text)}</div>${p.src?'<span class="m hide-sm">@'+esc(p.src.user)+'</span>':''}<span class="m">${best?'最佳 '+best.score:locked?'未解锁':''}</span></div>`}
  html+='</div></div>'}
 $('pickList').innerHTML=html; $('pickList').onclick=e=>{const r=e.target.closest('[data-pid]');if(r&&!r.classList.contains('lock')){const p=P.find(p=>p.id===r.dataset.pid);start(p,mode,null,mode==='campaign'?campKind(P.indexOf(p)):kind)}};
 go('pick');
}

const KINDS=['extra','wrong','missing','mixed'];
const campKind=i=>i%3===2?'edit':'say';
function srcHTML(p){return p.src?`<a class="src" href="${p.src.url}" target="_blank" rel="noopener">来源 @${esc(p.src.user)}${p.src.note==='tr'?' · 英译中':p.src.note==='adapt'?' · 节选':''}</a>`:''}
async function start(prompt,mode,dailyKey=null,kind='say'){
 stopTimer(); cur={prompt,mode,dailyKey,kind,t0:0,ops:{backspace:0,left:0,right:0,other:0},hinted:false};
 $('target').textContent=prompt.text; $('live').innerHTML='';
 if(kind==='edit'){
  const seed=hashStr((mode==='practice'?String(Date.now()):(dailyKey||'camp'))+prompt.id);
  const type=KINDS[seed%4]; cur.edit=corrupt(prompt.text,seed,type); cur.edit.type=type;
  $('input').value=cur.edit.broken; $('editHint').textContent=EDIT_TYPES[type]+' · '+editHint(cur.edit.counts);
 } else $('input').value='';
 $('editBar').classList.toggle('hidden',kind!=='edit'); $('live').classList.toggle('hidden',kind==='edit'||!opts.live);
 $('input').placeholder=kind==='edit'?'':'点这里，按耳机中间键开始说话…说完按下键（回车）提交';
 const modeName={practice:kind==='edit'?'修改训练':'自由练习',campaign:'闯关 · 第 '+(P.indexOf(prompt)+1)+' 关',daily:'每日挑战 · '+dailyKey}[mode];
 $('playMeta').innerHTML=`${modeName}${mode!=='practice'&&kind==='edit'?' · 修改':''} · ${LEVELS[prompt.level]} · ${prompt.text.length} 字 ${srcHTML(prompt)}`;
 const b=await Store.bestFor(prompt.id); $('playBest').textContent=b?'本题最佳 '+b.score+' 分':'';
 updStats(); go('play'); setTimeout(()=>{const i=$('input');i.focus();i.setSelectionRange(i.value.length,i.value.length)},50);
}
function startTimer(){ if(cur.t0) return; cur.t0=performance.now(); cur.timer=setInterval(()=>$('sTime').textContent=((performance.now()-cur.t0)/1000).toFixed(1),100); }
function stopTimer(){ if(cur&&cur.timer){clearInterval(cur.timer);cur.timer=null} }
function updStats(){ const o=cur.ops; $('sOps').textContent=o.backspace+o.left+o.right+o.other; $('sBs').textContent=`${o.backspace} / ${o.left} / ${o.right}`;
 const v=$('input').value; if(!v){$('sAcc').textContent='—';$('live').innerHTML='';return}
 const ev=evaluate(cur.prompt.text,v,opts); $('sAcc').textContent=fmtAcc(ev.accuracy);
 if(opts.live||cur.kind==='edit'){ // 末尾的漏字视为"还没说到"，灰色显示
  let last=ev.ops.length; while(last>0&&ev.ops[last-1].t==='del')last--;
  $('live').innerHTML=diffHTML(ev.ops.slice(0,last))+ev.ops.slice(last).map(o=>`<span class="d-del pend">${esc(o.a)}</span>`).join('');}
}
$('input').addEventListener('keydown',e=>{
 if(!cur)return;
 if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();submit();return}
 const m={Backspace:'backspace',Delete:'backspace',ArrowLeft:'left',ArrowRight:'right',ArrowUp:'other',ArrowDown:'other'}[e.key];
 if(m){startTimer();cur.ops[m]++;updStats()}
});
$('input').addEventListener('input',()=>{startTimer();updStats()});
$('showPos').onclick=()=>{cur.hinted=true;$('live').classList.remove('hidden');updStats()};
$('submit').onclick=()=>submit(); $('reset').onclick=()=>start(cur.prompt,cur.mode,cur.dailyKey,cur.kind);

async function submit(){
 const v=$('input').value; if(!v.trim()){$('input').focus();return}
 stopTimer(); const timeMs=cur.t0?performance.now()-cur.t0:0;
 const ev=evaluate(cur.prompt.text,v,opts); let sc=score(ev.accuracy,timeMs,ev.chars); const passed=ev.accuracy>=PASS();
 const opsN=Object.values(cur.ops).reduce((x,y)=>x+y,0); let eff=null;
 if(cur.kind==='edit'){ eff=Math.min(1,cur.edit.ideal/Math.max(opsN,1)); const budget=4000+2500*cur.edit.edits;
  sc={cpm:sc.cpm,score:Math.round(1000*ev.accuracy**4*(0.5*Math.min(1,budget/Math.max(timeMs,1))+0.5*eff)*(cur.hinted?0.8:1))}; }
 const r={kind:cur.kind,editType:cur.edit&&cur.kind==='edit'?cur.edit.type:null,efficiency:eff,hinted:cur.hinted,id:Date.now().toString(36)+Math.random().toString(36).slice(2,6),promptId:cur.prompt.id,mode:cur.mode,dailyKey:cur.dailyKey,nickname:nick(),
  timeMs:Math.round(timeMs),chars:ev.chars,accuracy:+ev.accuracy.toFixed(4),cpm:sc.cpm,ops:{...cur.ops},score:passed||!opts.strict?sc.score:0,passed,strict:opts.strict,ignorePunct:opts.ignorePunct,text:v,at:new Date().toISOString()};
 const prev=await Store.bestFor(cur.prompt.id); await Store.addResult(r);
 if(cur.mode==='campaign'&&passed){const idx=P.indexOf(cur.prompt);if(idx>=(profile.campaignLevel||0)){profile.campaignLevel=idx+1;await Store.saveProfile(profile)}}
 $('rMeta').textContent=$('playMeta').textContent; $('rScore').textContent=r.score+' 分';
 $('rPass').innerHTML=passed?`<span class="pass">通过${!prev||r.score>prev.score?' · 新纪录':''}</span>`:`<span class="fail">未通过 · 需要准确率 ${fmtAcc(PASS())}</span>`;
 $('rTime').textContent=(timeMs/1000).toFixed(1); $('rAcc').textContent=fmtAcc(ev.accuracy); $('rCpm').textContent=eff===null?sc.cpm:Math.round(eff*100)+'%'; $('rCpmL').textContent=eff===null?'字 / 分钟':'操作效率（理想 '+cur.edit.ideal+' 次 / 实际 '+opsN+' 次）'; $('rOps').textContent=`${r.ops.backspace} / ${r.ops.left} / ${r.ops.right}`;
 $('rDiff').innerHTML=diffHTML(ev.ops);
 const idx=P.indexOf(cur.prompt); $('next').classList.toggle('hidden',cur.mode==='daily'||(cur.mode==='campaign'&&!passed)||idx===P.length-1);
 $('rSrc').innerHTML=srcHTML(cur.prompt);
 go('result'); $('next').focus();
}
$('again').onclick=()=>start(cur.prompt,cur.mode,cur.dailyKey,cur.kind);
$('next').onclick=()=>{const i=P.indexOf(cur.prompt)+1;start(P[i],cur.mode,null,cur.mode==='campaign'?campKind(i):cur.kind)};
document.addEventListener('keydown',e=>{ if(e.key==='Enter'&&!$('v-result').classList.contains('hidden')&&document.activeElement.tagName!=='BUTTON'){e.preventDefault();$('again').click()} });

let boardKind='total';
$('boardSeg').onclick=e=>{const b=e.target.closest('button');if(!b)return;boardKind=b.dataset.b;$('boardSeg').querySelectorAll('button').forEach(x=>x.classList.toggle('active',x===b));renderBoard()};
$('boardPrompt').innerHTML=P.map(p=>`<option value="${p.id}">${esc(p.text.slice(0,24))}</option>`).join(''); $('boardPrompt').onchange=()=>renderBoard();
async function renderBoard(){
 $('boardPrompt').classList.toggle('hidden',boardKind!=='prompt');
 const q=boardKind==='daily'?{dailyKey:todayKey()}:boardKind==='prompt'?{promptId:$('boardPrompt').value}:{};
 const L=await Store.leaderboard(q);
 $('boardList').innerHTML=L.length?L.map((r,i)=>`<div class="row"><span class="tag ${i<3?'acc':''}">${i+1}</span><div class="t">${esc(r.nickname)}</div><span class="m">${boardKind==='total'?r.count+' 题':fmtAcc(r.accuracy)+' · '+(r.timeMs/1000).toFixed(1)+' 秒'}</span><span class="m" style="min-width:64px;text-align:right;font-weight:600;color:var(--text)">${r.score}</span></div>`).join(''):'<div class="row"><span class="hint">还没有记录</span></div>';
}
async function renderHistory(){
 const H=await Store.history(100);
 $('histList').innerHTML=H.length?H.map(r=>{const p=P.find(x=>x.id===r.promptId);return `<div class="row"><span class="tag">${(r.kind==='edit'?'修改·':'')+{practice:'练习',campaign:'闯关',daily:'每日'}[r.mode]}</span><div class="t">${esc(p?p.text:r.promptId)}</div><span class="m hide-sm">${new Date(r.at).toLocaleString('zh-CN',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'})}</span><span class="m">${fmtAcc(r.accuracy)} · ${(r.timeMs/1000).toFixed(1)}s</span><span class="m" style="min-width:52px;text-align:right;font-weight:600;color:var(--text)">${r.score}</span></div>`}).join(''):'<div class="row"><span class="hint">还没有记录</span></div>';
}
$('clearAll').onclick=async()=>{if(confirm('确定清空本机所有练习记录？')){await Store.clear();renderHistory()}};
renderHome();

// 提示词库
let libFilter='all';
$('libSeg').onclick=e=>{const b=e.target.closest('button');if(!b)return;libFilter=b.dataset.f;$('libSeg').querySelectorAll('button').forEach(x=>x.classList.toggle('active',x===b));renderLib()};
async function renderLib(){
 const favs=await Store.getFavs(); const L=P.filter(p=>p.src&&(libFilter==='all'||favs.includes(p.id)));
 $('libCount').textContent=`共 ${P.filter(p=>p.src).length} 条，收藏 ${favs.length} 条`;
 $('libList').innerHTML=L.length?L.map(p=>`<div class="lrow" data-pid="${p.id}"><div class="lt">${esc(p.text)}</div><div class="la">${srcHTML(p)}<span style="flex:1"></span>
  <button class="mini" data-a="fav">${favs.includes(p.id)?'★ 已收藏':'☆ 收藏'}</button><button class="mini" data-a="copy">复制</button><button class="mini" data-a="say">练说</button><button class="mini" data-a="edit">练改</button></div></div>`).join(''):'<div class="row"><span class="hint">还没有收藏</span></div>';
}
$('libList').onclick=async e=>{const b=e.target.closest('button[data-a]');if(!b)return;const p=P.find(x=>x.id===b.closest('[data-pid]').dataset.pid);
 if(b.dataset.a==='fav'){await Store.toggleFav(p.id);renderLib()}
 else if(b.dataset.a==='copy'){try{await navigator.clipboard.writeText(p.text)}catch{const t=document.createElement('textarea');t.value=p.text;document.body.append(t);t.select();document.execCommand('copy');t.remove()}b.textContent='已复制';setTimeout(()=>b.textContent='复制',1200)}
 else start(p,'practice',null,b.dataset.a)};
