// ---------- Views ----------
const dstr=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
Object.assign(I,{
 gear:svg(`<circle cx="16" cy="16" r="4.6" ${ln()}/><path d="M16 3.5v4M16 24.5v4M3.5 16h4M24.5 16h4M7.2 7.2l2.8 2.8M22 22l2.8 2.8M24.8 7.2L22 10M10 22l-2.8 2.8" ${ln()}/>`),
 home:svg(`<path d="M5 15L16 5l11 10M8 13v13h6v-7h4v7h6V13" ${ln()}/>`),
 chart:svg(`<path d="M7 26V16M14 26V8M21 26V13M27 26H4" ${ln(3)}/>`),
 trophy:svg(`<path d="M10 5h12v7a6 6 0 01-12 0zM10 8H5c0 5 2 7 5 7M22 8h5c0 5-2 7-5 7M16 18v5M11 27h10M13 23h6" ${ln()}/>`),
 heart:svg(`<path d="M16 27S5 20 5 12.5A5.5 5.5 0 0116 10a5.5 5.5 0 0111 2.5C27 20 16 27 16 27z" ${ln()}/>`),
 heartF:svg(`<path d="M16 27S5 20 5 12.5A5.5 5.5 0 0116 10a5.5 5.5 0 0111 2.5C27 20 16 27 16 27z" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>`),
 bolt:svg(`<path d="M18 3L7 18h8l-2 11 12-16h-8z" fill="#FFC83D" stroke="#F5A623" stroke-width="1.5" stroke-linejoin="round"/>`),
 flame:svg(`<path d="M16 4c1 5 7 7 7 14a7 7 0 01-14 0c0-3 2-5 3-7 .5 2 1.5 3 2.5 3.5C15 10 14.5 7 16 4z" fill="#FF8A3D" stroke="#F0662B" stroke-width="1.5" stroke-linejoin="round"/>`),
 lock:svg(`<rect x="8" y="14" width="16" height="12" rx="3" ${ln()}/><path d="M11 14v-3a5 5 0 0110 0v3" ${ln()}/>`),
 chev:svg(`<path d="M12 6l10 10-10 10" ${ln(3)}/>`),
});
const HUES=[265,330,150,28,200,45];
function navHtml(a){return `<nav class="nav4" id="nav">${[['home','Trang chủ',I.home],['stats','Thống kê',I.chart],['trophy','Thành tích',I.trophy],['fav','Yêu thích',I.heart]].map(x=>`<button data-t="${x[0]}" class="${a===x[0]?'on':''}">${x[2]}${x[1]}</button>`).join('')}</nav>`}
function bindNav(){document.querySelectorAll('#nav button').forEach(b=>b.onclick=()=>go(b.dataset.t))}
function go(t){({home:home,stats:statsView,trophy:trophyView,fav:favView})[t]()}
function topBar(title,sub){return `<div class="top slim"><div class="trow"><div class="brand">${I.phones} Nghe Từ Vựng</div><button class="gear" id="openSet">${I.gear}</button></div><h2 class="ptitle">${title}</h2><p class="psub">${sub}</p></div>`}
function stats(){
 const L=lessons;let tot=0,kn=0,stars=0,perfect=false;
 L.forEach(l=>{const n=l.items.length,k=l.items.filter(x=>x.known).length;tot+=n;kn+=k;stars+=l.items.filter(x=>x.star).length;if(n&&k===n)perfect=true});
 const days=new Set(S.days||[]);let streak=0,d=new Date();if(!days.has(dstr(d)))d.setDate(d.getDate()-1);
 while(days.has(dstr(d))){streak++;d.setDate(d.getDate()-1)}
 const week=[];for(let i=6;i>=0;i--){const x=new Date();x.setDate(x.getDate()-i);week.push({on:days.has(dstr(x)),lb:['CN','T2','T3','T4','T5','T6','T7'][x.getDay()],today:i===0})}
 return{L,tot,kn,stars,perfect,streak,week,days:days.size}}
const BADGES=[
 {id:'b1',t:'Bước đầu tiên',d:'Học ngày đầu tiên',h:265,p:s=>[Math.min(s.days,1),1]},
 {id:'b2',t:'10 từ đầu tiên',d:'Thuộc 10 từ',h:330,p:s=>[s.kn,10]},
 {id:'b3',t:'50 từ',d:'Thuộc 50 từ',h:200,p:s=>[s.kn,50]},
 {id:'b4',t:'100 từ',d:'Thuộc 100 từ',h:150,p:s=>[s.kn,100]},
 {id:'b5',t:'300 từ',d:'Thuộc 300 từ',h:28,p:s=>[s.kn,300]},
 {id:'b6',t:'500 từ',d:'Thuộc 500 từ',h:45,p:s=>[s.kn,500]},
 {id:'b7',t:'3 ngày liền',d:'Học 3 ngày liên tiếp',h:20,p:s=>[s.streak,3]},
 {id:'b8',t:'Một tuần liền',d:'Học 7 ngày liên tiếp',h:300,p:s=>[s.streak,7]},
 {id:'b9',t:'30 ngày liền',d:'Học 30 ngày liên tiếp',h:175,p:s=>[s.streak,30]},
 {id:'b10',t:'Bài hoàn hảo',d:'Thuộc hết một bài',h:120,p:s=>[s.perfect?1:0,1]},
 {id:'b11',t:'Người sưu tầm',d:'Thêm 5 từ vào Sổ ôn',h:350,p:s=>[s.stars,5]},
 {id:'b12',t:'Chăm chỉ',d:'Học tổng cộng 10 ngày',h:215,p:s=>[s.days,10]},
];
function checkBadges(){const st=stats(),have=new Set(S.bd||[]),nw=[];
 BADGES.forEach(b=>{const [c,n]=b.p(st);if(c>=n&&!have.has(b.id)){have.add(b.id);nw.push(b)}});
 if(nw.length){S.bd=[...have];persistS()}return nw}
function homeShell(){return ''}
function goStudy(){
 let l=lessons.find(x=>x.id===S.lastId&&x.a===S.lang&&x.b==='vi')||langLessons()[0];
 if(!l)return toast('Chưa có bài nào. Bấm nút + để thêm bài, hoặc cập nhật từ Google Sheet');
 cur=l;mode='cards';fc={i:0,flip:false,order:null};lesson()}
function home(){
  stopPlay();cur=null;sel=null;filter='all';
  const list=langLessons(),star=makeStar(),sk=star.items.filter(x=>x.known).length,st=stats(),m=moodNow();
  const card=(l,i)=>{const k=l.items.filter(x=>x.known).length,n=l.items.length,ic=Math.abs(l.id)%8+1;
    return `<div class="card lesson" data-i="${i}" style="--h:${HUES[Math.abs(l.id)%6]}"><div class="em"><span>${esc(((l.title||'').trim()[0]||'•').toUpperCase())}</span><img class="lic" src="ic-${ic}.png" alt="" onload="this.parentNode.classList.add('hasimg')" onerror="this.remove()"></div><div><b>${esc(l.title)}</b><small>${n} từ · Đã thuộc ${k}</small><div class="prog"><i style="width:${n?k/n*100:0}%"></i></div></div><button class="x" data-m="${i}">${I.dots}</button></div>`};
  const short=k=>LANGS[k][0].replace('Tiếng ','');
  $('#app').innerHTML=`<div class="top"><div class="trow"><div class="brand">${I.phones} Nghe Từ Vựng</div><button class="gear" id="openSet">${I.gear}</button></div>
  <div class="tgrid"><div class="acol">${heroHtml()}<button class="chg" id="chg">Đổi bạn</button></div><div class="bcol"><div class="bubble"><small>${greeting()}!</small><b>${esc(S.name||'Robert')}</b><span>${m==='s'?'Học cùng mình nhé!':'Hôm nay học gì nào?'}</span></div><button class="cta" id="goBtn">${I.play} Bắt đầu học ngay</button></div></div></div>
  <main><div class="rowtools"><button class="pillprog" id="goStats">${I.bolt}<span>Tiến độ: ${st.kn}/${st.tot} từ</span></button><div class="langsel"><select id="langSel">${Object.keys(LANGS).filter(k=>k!=='vi').map(k=>`<option value="${k}" ${k===S.lang?'selected':''}>${short(k)} ⇄ Việt</option>`).join('')}</select></div></div>
  ${list.length?`<div class="card lesson star" id="starCard" style="--h:45"><div class="em"><span>${I.star}</span><img class="lic" src="fairy-star.png" alt="" onload="this.parentNode.classList.add('hasimg')" onerror="this.remove()"></div><div><b>Sổ ôn riêng</b><small>${star.items.length?`${star.items.length} từ cần ôn lại · Đã thuộc ${sk}`:'Vào bài, bấm "Chọn" để thêm từ chưa thuộc'}</small>${star.items.length?`<div class="prog"><i style="width:${sk/star.items.length*100}%"></i></div>`:''}</div><span class="go">${I.chev}</span></div>`:''}
  ${list.length?list.map(l=>card(l,lessons.indexOf(l))).join(''):`<div class="empty2"><div class="big2"><div class="av3d m-${m}">${charSvg(S.char)}</div></div>Chưa có bài ${LANGS[S.lang][0]} nào.<br>Bấm nút + để thêm bài đầu tiên nhé!</div>`}
  <button class="btn sec" style="width:100%;margin-bottom:10px" id="syncBtn">${I.search} Đồng bộ với Google Sheet</button></main>
  <button class="btn fab" id="fabAdd">${I.plus}</button>${navHtml('home')}`;
  $('#langSel').onchange=e=>{S.lang=e.target.value;persistS();home()};
  $('#fabAdd').onclick=openAdd;$('#openSet').onclick=openSet;$('#syncBtn').onclick=async()=>{if(!bkey()){const v=await dlg({title:'Nhập mã ghi để lưu từ vựng lên Google Sheet',msg:'Chỉ nhập một lần trên máy này. Bỏ trống nếu chỉ muốn tải từ vựng về.',input:'',ok:'Lưu'});if(v){S.bkey=v;persistS()}}syncSheet(true)};
  $('#goBtn').onclick=goStudy;$('#goStats').onclick=()=>go('stats');
  $('#hero').onclick=()=>{mood('h',1800);burst();dartAll()};
  $('#chg').onclick=e=>{e.stopPropagation();pickChar()};
  bindNav();
  const sc=$('#starCard');if(sc)sc.onclick=()=>{if(!makeStar().items.length)return toast('Sổ ôn đang trống. Vào một bài, bấm "Chọn" rồi chọn từ nhé');cur=makeStar();mode='cards';fc={i:0,flip:false,order:null};lesson()};
  document.querySelectorAll('.lesson[data-i]').forEach(e=>e.onclick=ev=>{
    const mm=ev.target.closest('[data-m]');
    if(mm){ev.stopPropagation();return lessonMenu(lessons[+mm.dataset.m])}
    cur=lessons[+e.dataset.i];mode='cards';fc={i:0,flip:false,order:null};lesson()});
  const nb=checkBadges();if(nb.length){setTimeout(()=>{toast(nb.length===1?'Huy hiệu mới: '+nb[0].t+'!':'Bạn mở khóa '+nb.length+' huy hiệu mới!');mood('h',1800);burst()},500)}
}
function statsView(){
  stopPlay();cur=null;const s=stats(),pct=s.tot?Math.round(s.kn/s.tot*100):0;
  $('#app').innerHTML=topBar('Thống kê','Xem bạn tiến bộ được bao nhiêu')+`<main style="padding-top:18px">
  <div class="card big"><div class="ring" style="--v:${pct}"><b>${pct}%</b></div><div><b>${s.kn} / ${s.tot} từ đã thuộc</b><small>${s.L.length} bài · ${s.stars} từ trong Sổ ôn</small></div></div>
  <div class="card"><div class="gh2"><b>Chuỗi ngày học</b><span class="flame">${I.flame} ${s.streak} ngày</span></div><div class="week">${s.week.map(d=>`<div class="${d.today?'today':''}"><i class="${d.on?'on':''}">${d.on?I.check:''}</i><span>${d.lb}</span></div>`).join('')}</div><small style="color:var(--mut)">${s.streak?'Giỏi quá! Cứ học đều mỗi ngày nhé.':'Học hôm nay để bắt đầu chuỗi ngày nhé!'}</small></div>
  <div class="card"><b style="font-size:17px">Theo từng bài</b>${s.L.length?s.L.map(l=>{const n=l.items.length,k=l.items.filter(x=>x.known).length;return `<div class="lrow" style="--h:${HUES[Math.abs(l.id)%6]}"><div class="t"><b style="font-weight:700">${esc(l.title)}</b><span>${k}/${n}</span></div><div class="prog"><i style="width:${n?k/n*100:0}%"></i></div></div>`}).join(''):'<p class="hint">Chưa có bài nào.</p>'}</div></main>${navHtml('stats')}`;
  $('#openSet').onclick=openSet;bindNav();
}
function trophyView(){
  stopPlay();cur=null;checkBadges();const s=stats(),have=new Set(S.bd||[]);
  $('#app').innerHTML=topBar('Thành tích','Sưu tầm huy hiệu bằng cách học mỗi ngày')+`<main style="padding-top:18px">
  <div class="sumbar"><b>Đã mở ${have.size} / ${BADGES.length} huy hiệu</b></div>
  <div class="bgrid">${BADGES.map(b=>{const [c,n]=b.p(s),ok=have.has(b.id);return `<div class="card badge ${ok?'':'lock'}"><div class="medal" style="--h:${b.h}">${ok?I.star:I.lock}</div><b>${b.t}</b><small>${b.d}</small>${ok?'':`<div class="prog"><i style="width:${Math.min(100,c/n*100)}%;background:var(--p)"></i></div><small>${Math.min(c,n)}/${n}</small>`}</div>`}).join('')}</div></main>${navHtml('trophy')}`;
  $('#openSet').onclick=openSet;bindNav();
}
function favView(){
  stopPlay();cur=null;const items=langLessons().flatMap(l=>l.items.filter(x=>x.star).map(x=>({x,l})));
  $('#app').innerHTML=topBar('Yêu thích','Những từ bạn đã đánh dấu để ôn lại')+`<main style="padding-top:18px">
  ${items.length?`<button class="cta" id="favGo" style="margin:0 0 14px">${I.play} Học các từ này (${items.length})</button>${items.map((o,k)=>`<div class="card favrow"><div class="w"><b>${esc(o.x.w)}</b><span>${esc(o.x.m)}</span></div><button data-s="${k}">${I.speaker}</button><button class="hrt" data-u="${k}">${I.heartF}</button></div>`).join('')}`
  :`<div class="empty2"><div class="big2"><div class="av3d m-${moodNow()}">${charSvg(S.char)}</div></div>Chưa có từ yêu thích nào.<br>Vào một bài, bấm "Chọn", chọn từ rồi thêm vào Sổ ôn nhé!</div>`}</main>${navHtml('fav')}`;
  $('#openSet').onclick=openSet;bindNav();
  const g=$('#favGo');if(g)g.onclick=()=>{cur=makeStar();mode='cards';filter='all';fc={i:0,flip:false,order:null};lesson()};
  document.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{const o=items[+b.dataset.s];stopPlay();const tk=++token;sayItem(o.x,o.l,tk,false)});
  document.querySelectorAll('[data-u]').forEach(b=>b.onclick=()=>{const o=items[+b.dataset.u];o.x.star=false;persist();toast('Đã bỏ khỏi Yêu thích');favView()});
}
function lesson(){S.last=Date.now();{const t=dstr(new Date());S.days=S.days||[];if(S.days[S.days.length-1]!==t){S.days.push(t);S.days=S.days.slice(-400)}if(cur&&!cur.virtual)S.lastId=cur.id}try{persistS()}catch{}
  stopPlay();segCb=null;
  if(cur.virtual)cur=makeStar();
  const L=cur,list=view(),all=L.items,kn=all.filter(x=>x.known).length;
  const head=`<header><button class="back" id="bk">${I.back} Quay lại</button><h1>${L.virtual?I.star+' ':''}${esc(L.title)}</h1><p>${LANGS[L.a][0]} ⇄ ${LANGS[L.b][0]} · ${all.length} từ${L.virtual?' từ mọi bài':''} · đã thuộc ${kn}</p></header>`;
  const modes=`<div class="mode m4"><button class="btn ${mode==='cards'?'':'sec'}" id="mCards">${I.speaker} Nghe</button><button class="btn ${mode==='fc'?'':'sec'}" id="mFc">${I.flash} Thẻ</button>${L.virtual?'':`<button class="btn ${mode==='gram'?'':'sec'}" id="mGram">${I.book} Ngữ pháp</button><button class="btn ${mode==='story'?'':'sec'}" id="mStory">${I.story} Truyện</button>`}</div>`;
  const chips=`<div class="chips"><button class="chip ${filter==='all'?'on':''}" data-f="all">Tất cả ${all.length}</button><button class="chip ${filter==='todo'?'on':''}" data-f="todo">Chưa thuộc ${all.length-kn}</button><button class="chip ${filter==='known'?'on':''}" data-f="known">Đã thuộc ${kn}</button>${mode==='cards'&&!L.virtual?`<button class="chip selbtn" id="mAdd" style="margin-left:auto">${I.plus} Từ</button>`:''}${mode==='cards'?`<button class="chip ${mode==='cards'&&!L.virtual?'':'selbtn'}" style="${mode==='cards'&&!L.virtual?'border:2px solid var(--p);color:var(--p);background:transparent;font-weight:600':''}" id="selBtn">${sel?'Xong':'Chọn'}</button>`:''}</div>`;
  if(mode==='gram'||mode==='story'){if(L.virtual)mode='cards';else return lessonExtra(head,modes,L)}
  if(mode==='cards'){
    const cardsHtml=list.length?`<div class="grid">${list.map((p,k)=>`<div class="pair ${sel&&sel.has(p)?'sel':''}"><span class="n">${k+1}</span>${sel?`<span class="tick">${sel.has(p)?'✓':''}</span>`:`<span class="badges">${p.star?I.star:''}${p.known?I.check:''}</span>`}<div class="w"><b class="${!sel&&S.say==='b'?'hid':''}">${esc(p.w)}</b><span class="${!sel&&S.say==='a'?'hid':''}">${esc(p.m)}</span>${p.ex?`<i class="${!sel&&S.say==='b'?'hid':''}">${esc(p.ex)}</i>`:''}</div>${sel?'':`<div class="acts"><button data-k="${k}" class="sp">${I.speaker}</button><button data-e="${k}" class="ed">${I.pencil}</button></div>`}</div>`).join('')}</div>`
      :`<div class="empty"><span class="kao"></span>${filter==='todo'?'Bạn đã thuộc hết rồi, giỏi quá!':filter==='known'?'Chưa có từ nào được đánh dấu đã thuộc.':'Bài này chưa có từ nào.'}</div>`;
    const bottom=sel?`<div class="selbar"><div class="top"><b>Đã chọn ${sel.size}</b><button id="sAll">${sel.size===list.length&&list.length?'Bỏ chọn hết':'Chọn hết'}</button></div><div class="g">
      ${L.virtual?`<button class="btn sec" id="sUnstar">${I.star} Bỏ khỏi Sổ ôn</button>`:`<button class="btn" id="sStar">${I.star} Thêm vào Sổ ôn</button>`}
      <button class="btn okc" id="sKnown">${I.check} Đã thuộc</button><button class="btn sec" id="sTodo">${I.reset} Chưa thuộc</button><button class="btn sec" id="sDone">Xong</button></div></div>`
      :`<div class="player"><div style="display:flex;gap:6px;max-width:640px;margin:0 auto"><button class="loopbtn ${S.loop?'on':''}" id="loopBtn">${I.reset} Lặp bài</button><div class="seg" style="flex:1;margin:0 0 8px">${[['both','Cả hai'],['a','Chỉ '+LANGS[L.a][0].replace('Tiếng ','')],['b','Chỉ Việt']].map(([k,t])=>`<button data-s="${k}" class="${S.say===k?'on':''}">${t}</button>`).join('')}</div></div><div class="row"><button class="btn play" id="playBtn">${I.play}</button>
    <div class="grow"><label>Tốc độ <b id="rv">${S.rate}x</b> · lặp ${S.rep} lần · chậm ⇄ nhanh</label><input type="range" id="rate" min="0.3" max="1.6" step="0.1" value="${S.rate}"></div></div></div>`;
    $('#app').innerHTML=head+`<main style="${sel?'padding-bottom:150px':''}">${modes}${chips}${cardsHtml}</main>`+bottom;
    if(sel){
      const act=f=>{if(!sel.size){toast('Hãy chạm vào thẻ để chọn từ trước nhé');return 0}sel.forEach(f);persist();const n=sel.size;sel=null;lesson();return n};
      document.querySelectorAll('.pair').forEach((p,k)=>p.onclick=()=>{const it=list[k];sel.has(it)?sel.delete(it):sel.add(it);lesson()});
      $('#sAll').onclick=()=>{sel=sel.size===list.length?new Set():new Set(list);lesson()};
      if($('#sStar'))$('#sStar').onclick=()=>{const n=act(x=>x.star=true);if(n)toast(`Đã thêm ${n} từ vào Sổ ôn riêng`)};
      if($('#sUnstar'))$('#sUnstar').onclick=()=>{const n=act(x=>x.star=false);if(n)toast(`Đã bỏ ${n} từ khỏi Sổ ôn`)};
      $('#sKnown').onclick=()=>{const n=act(x=>x.known=true);if(n)toast(`Đánh dấu ${n} từ đã thuộc`)};
      $('#sTodo').onclick=()=>{const n=act(x=>x.known=false);if(n)toast(`Đánh dấu ${n} từ chưa thuộc`)};
      $('#sDone').onclick=()=>{sel=null;lesson()};
    }else{
      $('#rate').oninput=e=>{S.rate=+e.target.value;if(au)au.playbackRate=S.rate;$('#rv').textContent=S.rate+'x';persistS()};
      $('#playBtn').onclick=()=>playing?stopPlay():playFrom(Math.max(idx,0));
      $('#loopBtn').onclick=()=>{S.loop=!S.loop;persistS();if(au)au.loop=S.loop;if(TTS)TTS.setLoop({loop:S.loop}).catch(()=>{});const b=$('#loopBtn');b.classList.toggle('on',S.loop);toast(S.loop?'Lặp lại cả bài: BẬT, đọc hết bài sẽ tự quay lại từ đầu':'Lặp lại cả bài: TẮT')};
      document.querySelectorAll('.seg button').forEach(b=>b.onclick=()=>{S.say=b.dataset.s;persistS();lesson();toast(S.say==='both'?'Đọc cả hai thứ tiếng':S.say==='a'?'Chỉ đọc '+LANGS[cur.a][0]+', nghĩa được làm mờ để bạn tự đoán':'Chỉ đọc tiếng Việt, từ gốc được làm mờ để bạn tự nhớ')});
      document.querySelectorAll('.pair .hid').forEach(e=>e.onclick=ev=>{ev.stopPropagation();e.classList.remove('hid')});
      document.querySelectorAll('.pair .sp').forEach(b=>b.onclick=e=>{e.stopPropagation();speakOne(+b.dataset.k)});
      document.querySelectorAll('.pair .ed').forEach(b=>b.onclick=e=>{e.stopPropagation();openEdit(list[+b.dataset.e])});
      document.querySelectorAll('.pair').forEach((p,k)=>p.onclick=()=>playFrom(k));
    }
    $('#selBtn').onclick=()=>{sel=sel?null:new Set();lesson()};
  }else{
    const fl=fc.order?fc.order.filter(x=>list.includes(x)):list;
    if(!fl.length){$('#app').innerHTML=head+`<main>${modes}${chips}<div class="empty">Không còn thẻ nào trong mục này.</div></main>`}
    else{
    fc.i=Math.min(fc.i,fl.length-1);const it=fl[fc.i];
    $('#app').innerHTML=head+`<main>${modes}${chips}<div class="cnt">${fc.i+1} / ${fl.length} · chạm thẻ để lật</div>
    <div class="fc"><div class="fcin ${fc.flip?'flip':''}" id="fcin"><div class="face f"><b>${esc(it.w)}</b>${it.known?'<div class="ex">✓ đã thuộc</div>':''}</div><div class="face b"><b>${esc(it.m)}</b>${it.ex?`<div class="ex">${esc(it.ex)}</div>`:''}</div></div></div>
    <div class="fcnav"><button class="btn sec" id="fPrev">${I.back}</button><button class="btn" id="fSpk">${I.speaker}</button><button class="btn sec" id="fEd">${I.pencil}</button><button class="btn sec" id="fShuf">${I.shuffle}</button><button class="btn sec" id="fNext">${I.next}</button></div>
    <div class="fcmark"><button class="btn sec" id="fTodo">Chưa thuộc</button><button class="btn okc" id="fKnown">Đã thuộc</button></div>
    <div class="fcnav" style="margin-top:10px"><button class="btn sec" id="fStar" style="flex:1">${I.star} ${it.star?'Bỏ khỏi Sổ ôn':'Thêm vào Sổ ôn'}</button></div></main>`;
    const go=d=>{fc.i=(fc.i+d+fl.length)%fl.length;fc.flip=false;lesson()};
    const markIt=v=>{it.known=v;persist();const still=view().includes(it);fc.flip=false;if(still)fc.i++;if(fc.i>=fl.length-(still?0:1))fc.i=0;lesson()};
    $('#fcin').onclick=()=>{fc.flip=!fc.flip;$('#fcin').classList.toggle('flip',fc.flip);if(fc.flip)fcSpeak(it,true)};
    $('#fPrev').onclick=()=>go(-1);$('#fNext').onclick=()=>go(1);
    $('#fSpk').onclick=()=>fcSpeak(it,false);
    $('#fEd').onclick=()=>openEdit(it);
    $('#fShuf').onclick=()=>{const a=[...list];for(let k=a.length-1;k>0;k--){const j=Math.floor(Math.random()*(k+1));[a[k],a[j]]=[a[j],a[k]]}fc={i:0,flip:false,order:a};lesson();toast('Đã xáo trộn')};
    $('#fKnown').onclick=()=>markIt(true);$('#fTodo').onclick=()=>markIt(false);
    $('#fStar').onclick=()=>{it.star=!it.star;persist();toast(it.star?'Đã thêm vào Sổ ôn':'Đã bỏ khỏi Sổ ôn');lesson()};
    }
  }
  document.querySelectorAll('.chip[data-f]').forEach(c=>c.onclick=()=>{filter=c.dataset.f;idx=-1;fc.i=0;fc.flip=false;if(sel)sel=new Set();lesson()});
  bindModes();
  if($('#mAdd'))$('#mAdd').onclick=()=>openEdit(null);
}
async function fcSpeak(it,back){stopPlay();const tk=++token;if(back){await speak(it.m,cur.b,tk);if(it.ex&&tk===token)await speak(it.ex,cur.a,tk)}else await speak(it.w,cur.a,tk)}

// ---------- Edit word ----------
function openEdit(it){
  editIt=it;const v=it||{w:'',m:'',ex:''};
  $('#editTitle').innerHTML=I.pencil+(it?' Sửa từ':' Thêm từ mới');
  $('#eW').value=v.w;$('#eM').value=v.m;$('#eX').value=v.ex||'';
  $('#eDel').style.display=it?'':'none';$('#editModal').classList.add('show');
}
$('#eCancel').onclick=()=>$('#editModal').classList.remove('show');
$('#eSave').onclick=()=>{
  const w=$('#eW').value.trim(),m=$('#eM').value.trim(),ex=$('#eX').value.trim();
  if(!w||!m)return toast('Cần nhập cả từ và nghĩa');
  if(editIt)Object.assign(editIt,{w,m,ex});else cur.items.push({w,m,ex});
  persist();$('#editModal').classList.remove('show');lesson();
};
$('#eDel').onclick=async()=>{
  $('#editModal').classList.remove('show');
  if(!await dlg({title:'Xoá từ "'+editIt.w+'"?',msg:cur.virtual?'Từ sẽ bị xoá khỏi bài gốc. Nếu chỉ muốn bỏ khỏi Sổ ôn, hãy dùng nút "Bỏ khỏi Sổ ôn".':'',ok:'Xoá',danger:true}))return;
  const o=owner(editIt);if(o)o.items.splice(o.items.indexOf(editIt),1);persist();lesson();
};

// ---------- Settings ----------
function openSet(){
  if(NATIVE)refreshVoices=()=>{};
  refreshVoices();
  $('#voiceList').innerHTML=Object.keys(LANGS).map(k=>{
    const code=LANGS[k][1].slice(0,2),vs=voicesList.filter(v=>v.lang.toLowerCase().startsWith(code));
    return `<label class="hint">${LANGS[k][0]} ${vs.length?'':'(chưa có giọng, xem hướng dẫn bên trên)'}</label><select data-l="${k}"><option value="">Tự động</option>${vs.map(v=>`<option value="${esc(v.voiceURI)}" ${(S.voices[k]===v.voiceURI)?'selected':''}>${esc(v.name)} (${v.lang})</option>`).join('')}</select>`}).join('');
  document.querySelectorAll('#voiceList select').forEach(s=>s.onchange=()=>{S.voices[s.dataset.l]=s.value||undefined;persistS();speak('Test',s.dataset.l,token)});
  if(NATIVE)$('#voiceList').innerHTML='<p class="hint">App đang dùng giọng đọc của Android. Muốn đổi giọng: Cài đặt Android > Quản lý chung > Chuyển văn bản thành giọng nói.</p>';
  $('#orderSel').value=S.order;$('#orderSel').onchange=e=>{S.order=e.target.value;persistS();toast(S.order==='vi'?'Đọc tiếng Việt trước, tiếng Séc sau':'Đọc tiếng Séc trước, tiếng Việt sau')};
  $('#rep').value=S.rep;$('#repV').textContent=S.rep;$('#gap').value=S.gap;$('#gapV').textContent=S.gap;$('#exOn').checked=S.ex;
  $('#rep').oninput=e=>{S.rep=+e.target.value;$('#repV').textContent=S.rep;persistS()};
  $('#gap').oninput=e=>{S.gap=+e.target.value;$('#gapV').textContent=S.gap;persistS()};
  $('#exOn').onchange=e=>{S.ex=e.target.checked;persistS()};
  $('#setModal').classList.add('show');
}
$('#expBtn').onclick=exportData;$('#impBtn').onclick=()=>$('#impIn').click();
$('#impIn').onchange=e=>{const f=e.target.files[0];if(f)importData(f);e.target.value=''};
$('#closeSet').onclick=()=>{$('#setModal').classList.remove('show');if(cur)lesson()};

// ---------- Add lesson ----------
let srcTab='text';
function openAdd(){pendingEx={};$('#srvUrl').value=S.srv;$('#srvTok').value=S.tok;$('#title').value='';$('#raw').value='';$('#pairInfo').textContent='Bài sẽ lưu vào: '+LANGS[S.lang][0]+' ⇄ Tiếng Việt';$('#addModal').classList.add('show')}
$('#cancelAdd').onclick=()=>$('#addModal').classList.remove('show');
document.querySelectorAll('#srcTabs button').forEach(b=>b.onclick=()=>{srcTab=b.dataset.t;document.querySelectorAll('#srcTabs button').forEach(x=>x.classList.toggle('on',x===b));['text','file','img','link'].forEach(t=>$('#pane-'+t).hidden=t!==srcTab)});
function splitCols(line){
  const l=line.replace(/[｜¦]/g,'|'); // dấu gạch đứng kiểu rộng (bộ gõ tiếng Việt, Zalo)
  if(l.includes('|'))return l.split('|').map(s=>s.trim());
  if(l.includes('\t'))return l.split('\t').map(s=>s.trim());
  const parts=l.split(/\s[-–—]\s/).map(s=>s.trim()); // chữ - nghĩa - ví dụ
  if(parts.length>=3)return [parts[0],parts[1],parts.slice(2).join(' - ')];
  return null;
}
function parse(text){
  const out=[];
  for(let line of text.split(/\r?\n/)){
    line=line.trim().replace(/^[\d]+[.)]\s+/,'');if(!line)continue;
    const c=splitCols(line);
    if(c){
      if(c[0]&&c[1])out.push({w:c[0],m:c[1],ex:c.slice(2).filter(Boolean).join(' | ')||pendingEx[c[0]]||''});
      continue;
    }
    const m=line.match(/^(.+?)\s*(?:\s?[:=;]\s?|\s{3,})\s*(.+)$/)||line.match(/^(.+?)[-–—](.+)$/);
    if(m&&m[1].trim()&&m[2].trim())out.push({w:m[1].trim(),m:m[2].trim(),ex:pendingEx[m[1].trim()]||''});
  }
  return out;
}
function append(t){const r=$('#raw');r.value=(r.value?r.value+'\n':'')+t}
$('#fileIn').onchange=async e=>{
  const f=e.target.files[0];if(!f)return;toast('Đang đọc file...');
  try{
    const ext=f.name.split('.').pop().toLowerCase();
    if(ext==='docx'){const r=await mammoth.extractRawText({arrayBuffer:await f.arrayBuffer()});append(r.value)}
    else if(ext==='pdf'){
      pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      const pdf=await pdfjsLib.getDocument({data:await f.arrayBuffer()}).promise;let all='';
      for(let p=1;p<=pdf.numPages;p++){const c=await(await pdf.getPage(p)).getTextContent();
        let y=null,line='';for(const it of c.items){if(y!==null&&Math.abs(it.transform[5]-y)>3){all+=line.trim()+'\n';line=''}line+=it.str+' ';y=it.transform[5]}all+=line.trim()+'\n'}
      if(!all.trim())toast('PDF này là ảnh scan, hãy dùng tab Ảnh');else append(all)
    } else append(await f.text());
    toast('Đã đọc xong, kiểm tra rồi bấm Lưu');document.querySelector('#srcTabs [data-t=text]').click();
  }catch(err){toast('Không đọc được file: '+err.message)}
};
$('#imgIn').onchange=async e=>{
  const fs=[...e.target.files];if(!fs.length)return;
  const lg=LANGS[S.lang][2]+'+vie';
  try{
    for(let i=0;i<fs.length;i++){
      toast(`Đang đọc ảnh ${i+1}/${fs.length}... (có thể mất 10-30 giây)`);
      const r=await Tesseract.recognize(fs[i],lg);append(r.data.text);
    }
    toast('Đã đọc xong, hãy kiểm tra và sửa lỗi chữ nếu có');document.querySelector('#srcTabs [data-t=text]').click();
  }catch(err){toast('Lỗi đọc ảnh (cần mạng lần đầu): '+err.message)}
};
$('#saveAdd').onclick=()=>{
  const items=parse($('#raw').value);
  if(!items.length)return toast('Chưa có cặp từ nào. Mỗi dòng dạng: từ - nghĩa');
  lessons.unshift({id:Date.now(),title:$('#title').value.trim()||'Bài '+new Date().toLocaleDateString('vi-VN'),a:S.lang,b:'vi',items});
  persist();$('#addModal').classList.remove('show');home();toast(`Đã lưu ${items.length} từ`);
};
$('#linkGo').onclick=async()=>{
  const u=($('#linkIn').value.match(/https?:\/\/\S+/)||[''])[0];
  S.srv=$('#srvUrl').value.trim().replace(/\/$/,'');S.tok=$('#srvTok').value.trim();persistS();
  if(!u)return toast('Hãy dán một link hợp lệ');
  if(!S.srv)return toast('Chưa có địa chỉ máy chủ (mục Máy chủ)');
  $('#linkGo').disabled=true;toast('Đang xử lý video... có thể mất 1-2 phút');
  try{
    const r=await fetch(S.srv+'/extract',{method:'POST',headers:{'Content-Type':'application/json','X-Token':S.tok},body:JSON.stringify({url:u,lang_name:LANGS[S.lang][0].toLowerCase()})});
    const j=await r.json();if(!r.ok)throw new Error(j.detail||r.status);
    if(!j.items.length)throw new Error('Không tìm thấy từ vựng nào');
    j.items.forEach(i=>{append(i.w+' | '+i.m+(i.ex?' | '+i.ex:''))});
    toast(`Tìm được ${j.items.length} từ, kiểm tra rồi bấm Lưu`);document.querySelector('#srcTabs [data-t=text]').click();
  }catch(err){toast('Lỗi: '+err.message)}
  $('#linkGo').disabled=false;
};
// ---- Nút Back: đóng cửa sổ đang mở trước; ở màn hình chính thì hỏi có muốn thoát không ----
let exiting=false;
function armBack(){history.pushState({g:1},'')}
window.addEventListener('popstate',async()=>{
  if(exiting)return;
  const open=document.querySelector('.modal.show');
  if(open){open.classList.remove('show');armBack();return}
  if(cur){cur=null;home();armBack();return}
  armBack();
  const ok=await dlg({title:'Thoát ứng dụng?',msg:'Bạn có muốn thoát Nghe Từ Vựng không?',ok:'Thoát'});
  if(ok){exiting=true;const App=window.Capacitor&&Capacitor.Plugins&&Capacitor.Plugins.App;
    if(App&&App.exitApp){App.exitApp()}else{history.go(-2)}}
});
armBack();
hydrate();home();
syncSheet(false);
window.addEventListener('online',()=>syncSheet(false));
document.addEventListener('visibilitychange',()=>{if(!document.hidden)syncSheet(false)});
if(TTS){hookNative();TTS.info().then(o=>{if(o.playing){playing=true;updPlay()}}).catch(()=>{})}
// nhận link được chia sẻ từ app khác (Facebook, TikTok, YouTube...)
{const q=new URLSearchParams(location.search),sh=(q.get('url')||'')+' '+(q.get('text')||'');
 const u=(sh.match(/https?:\/\/\S+/)||[''])[0];
 if(u){openAdd();document.querySelector('#srcTabs [data-t=link]').click();$('#linkIn').value=u;history.replaceState(null,'','index.html')}}
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
