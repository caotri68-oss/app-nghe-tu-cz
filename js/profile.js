// Hồ sơ: "bo" (dữ liệu cũ, giữ nguyên) và "tyna" (dữ liệu riêng, không nối Google Sheet).
// Mỗi hồ sơ lưu ở khoá localStorage riêng nên không lẫn vào nhau.
const PROFILE=(()=>{try{const p=localStorage.getItem('ntv_profile');return p==='bo'||p==='tyna'?p:null}catch(e){return null}})();
const TYNA=PROFILE==='tyna',DEFNAME=TYNA?'Tyna':'Robert';
const profileKey=k=>TYNA?'tyna:'+k:k;
(function(){
  const pn=document.getElementById('profName');
  if(pn)pn.textContent=TYNA?'Tyna':'Bố';
  const boot=()=>['core','tts','content','views'].forEach(n=>{const s=document.createElement('script');s.src='js/'+n+'.js';s.async=false;document.body.appendChild(s)});
  if(PROFILE)return boot();
  const pick=p=>{try{localStorage.setItem('ntv_profile',p)}catch(e){}location.reload()};
  const o=document.createElement('div');
  o.style.cssText='position:fixed;inset:0;z-index:99;background:var(--bg);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:24px;text-align:center';
  o.innerHTML='<h1 style="margin:0 0 6px;font-size:26px">Nghe Từ Vựng</h1><p style="margin:0 0 14px;color:var(--mut)">Ai đang học?</p>'+
    ['bo|Bố','tyna|Tyna'].map(x=>{const [k,t]=x.split('|');return '<button class="btn" data-p="'+k+'" style="width:100%;max-width:320px;padding:18px;font-size:18px">'+t+'</button>'}).join('')+
    '<p style="margin:10px 0 0;color:var(--mut);font-size:13px;max-width:320px">Mỗi hồ sơ có bài học riêng, không lẫn vào nhau. Đổi hồ sơ trong Cài đặt.</p>';
  o.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>pick(b.dataset.p));
  document.body.appendChild(o);
})();
