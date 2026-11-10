// 打分与差异：先把文本切成 token（普通字符一个 token；连续数字/中文数字合成一个 token），
// 比较用 token.k（规范化后的值），显示用 token.d（用户原文），所以「九」和「9」不会被标错。
const PUNCT_RE=/[，。！？、；：“”‘’（）《》【】…—,.!?;:'"()\[\]<>\-~·]/;
const HALF2FULL={',':'，','?':'？','!':'！',':':'：',';':'；','(':'（',')':'）'};
const CN_D={'零':0,'〇':0,'一':1,'二':2,'两':2,'三':3,'四':4,'五':5,'六':6,'七':7,'八':8,'九':9};
const CN_U={'十':10,'百':100,'千':1000,'万':10000};
const NUM_RE=/[0-9０-９]+|[零〇一二两三四五六七八九十百千万]+/y;
function cnToNum(s){
  if(![...s].some(c=>c in CN_U)) return [...s].map(c=>CN_D[c]).join(''); // 二零二六 → 2026
  let total=0,sec=0,n=0;
  for(const c of s){
    if(c in CN_D){ n=CN_D[c]; }
    else if(c==='万'){ total+=(sec+n)*10000; sec=0; n=0; }
    else { sec+=(n||1)*CN_U[c]; n=0; } // 十二 → 12，一百零五 → 105
  }
  return String(total+sec+n);
}
function tokenize(s,{ignorePunct=false,normNum=true}={}){
  const out=[]; let i=0;
  while(i<s.length){
    const c=s[i];
    if(/\s/.test(c)){ i++; continue; }
    if(normNum){ NUM_RE.lastIndex=i; const m=NUM_RE.exec(s);
      if(m){ const d=m[0]; const k=/[0-9０-９]/.test(d[0])?d.replace(/[０-９]/g,x=>String.fromCharCode(x.charCodeAt(0)-0xFEE0)):cnToNum(d);
        out.push({k:'#'+k,d}); i+=d.length; continue; } }
    let k=HALF2FULL[c]||c;
    if(/[０-９]/.test(k)) k=String.fromCharCode(k.charCodeAt(0)-0xFEE0);
    if(ignorePunct&&PUNCT_RE.test(c)){ i++; continue; }
    out.push({k,d:c}); i++;
  }
  return out;
}
// Levenshtein over tokens; ops: eq/sub/del(少写)/ins(多写)，a=目标原文 b=输入原文
function diffTokens(A,B){
  const n=A.length,m=B.length,d=Array.from({length:n+1},()=>new Uint16Array(m+1));
  for(let i=0;i<=n;i++)d[i][0]=i; for(let j=0;j<=m;j++)d[0][j]=j;
  for(let i=1;i<=n;i++)for(let j=1;j<=m;j++) d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(A[i-1].k===B[j-1].k?0:1));
  const ops=[];let i=n,j=m;
  while(i>0||j>0){
    if(i>0&&j>0&&d[i][j]===d[i-1][j-1]+(A[i-1].k===B[j-1].k?0:1)){ops.push({t:A[i-1].k===B[j-1].k?'eq':'sub',a:A[i-1].d,b:B[j-1].d});i--;j--;}
    else if(i>0&&d[i][j]===d[i-1][j]+1){ops.push({t:'del',a:A[i-1].d});i--;}
    else{ops.push({t:'ins',b:B[j-1].d});j--;}
  }
  return {ops:ops.reverse(),dist:d[n][m]};
}
function evaluate(target,input,opts={}){
  const o={ignorePunct:!!opts.ignorePunct,normNum:opts.normNum!==false};
  const T=tokenize(target,o),I=tokenize(input,o),{ops,dist}=diffTokens(T,I);
  return {ops,dist,accuracy:T.length?Math.max(0,1-dist/T.length):0,chars:[...target.replace(/\s/g,'')].length};
}
// 分数：准确率^2 × 速度分。速度 = 字/分钟（封顶 300），满分约 1000
function score(acc,timeMs,chars){
  const cpm=chars/(Math.max(timeMs,1000)/60000);
  return {cpm:Math.round(cpm),score:Math.round(1000*acc*acc*(0.4+0.6*Math.min(cpm,300)/300))};
}
function diffHTML(ops){
  const esc=c=>c.replace(/&/g,'&amp;').replace(/</g,'&lt;');
  return ops.map(o=>o.t==='eq'?`<span class="d-eq">${esc(o.b)}</span>`
    :o.t==='sub'?`<span class="d-sub" title="应为「${esc(o.a)}」">${esc(o.b)}</span>`
    :o.t==='del'?`<span class="d-del">${esc(o.a)}</span>`
    :`<span class="d-ins">${esc(o.b)}</span>`).join('');
}
