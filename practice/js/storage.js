// 存储适配器：阶段 1 用 localStorage；阶段 2 换成 RemoteAdapter（同样的方法签名，返回 Promise）即可。
// 成绩记录结构（Result）:
// {id, promptId, mode:'practice'|'campaign'|'daily', dailyKey, nickname, timeMs, chars,
//  accuracy(0-1), cpm, ops:{backspace,left,right,other}, score, passed, strict, ignorePunct, at(ISO)}
class LocalAdapter {
  constructor(ns='hv-practice'){ this.ns=ns; }
  _get(k,d){ try{ return JSON.parse(localStorage.getItem(this.ns+':'+k)) ?? d }catch{ return d } }
  _set(k,v){ localStorage.setItem(this.ns+':'+k, JSON.stringify(v)); }
  async getProfile(){ return this._get('profile',{nickname:'',campaignLevel:0}); }
  async saveProfile(p){ this._set('profile',p); return p; }
  async addResult(r){ const h=this._get('history',[]); h.push(r); this._set('history',h.slice(-500)); return r; }
  async history(limit=50){ return this._get('history',[]).slice(-limit).reverse(); }
  async bestFor(promptId){ return this._get('history',[]).filter(r=>r.promptId===promptId).sort((a,b)=>b.score-a.score)[0]||null; }
  async leaderboard({promptId=null,dailyKey=null,limit=20}={}){
    let h=this._get('history',[]);
    if(promptId) h=h.filter(r=>r.promptId===promptId);
    if(dailyKey) h=h.filter(r=>r.dailyKey===dailyKey);
    const best={}; for(const r of h){ const k=r.nickname+'|'+(promptId||dailyKey||r.promptId); if(!best[k]||r.score>best[k].score) best[k]=r; }
    if(!promptId&&!dailyKey){ // 总榜：每人每题最佳分之和
      const sum={}; for(const r of Object.values(best)){ sum[r.nickname]=(sum[r.nickname]||{nickname:r.nickname,score:0,count:0}); sum[r.nickname].score+=r.score; sum[r.nickname].count++; }
      return Object.values(sum).sort((a,b)=>b.score-a.score).slice(0,limit);
    }
    return Object.values(best).sort((a,b)=>b.score-a.score).slice(0,limit);
  }
  async clear(){ ['history','profile'].forEach(k=>localStorage.removeItem(this.ns+':'+k)); }
}
window.Store = new LocalAdapter();
// 收藏（提示词库）
LocalAdapter.prototype.getFavs=async function(){return this._get('favs',[])};
LocalAdapter.prototype.toggleFav=async function(id){let f=this._get('favs',[]);f=f.includes(id)?f.filter(x=>x!==id):[...f,id];this._set('favs',f);return f};
