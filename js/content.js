// ---------- Ngữ pháp & Câu chuyện: đọc từng đoạn (tiếng Việt xen tiếng Séc) ----------
let segCb=null,lastSeg=-1;
function segHL(i){
  document.querySelectorAll('[data-seg]').forEach(e=>e.classList.toggle('on',i>=0&&(' '+e.dataset.seg+' ').includes(' '+i+' ')));
  const e=document.querySelector('[data-seg].on');if(e&&i>=0)e.scrollIntoView({block:'center',behavior:'smooth'});
}
async function askBat(){
  if(S.batAsked||!TTS)return;S.batAsked=true;persistS();
  try{const r=await TTS.askBattery();if(!r.ok)toast('Hãy chọn "Cho phép" để app đọc tiếp khi bạn tắt màn hình hoặc mở app khác')}catch(e){}
}
async function sayWord(t,key){stopPlay();segCb=null;const tk=++token;await speak(t,key,tk)}
// segs: [{text, lang:'cs'|'vi'|..., pause(ms), i}]
async function playSegs(segs,title){
  if(!segs.length)return toast('Chưa có nội dung để đọc');
  stopPlay();segCb=segHL;lastSeg=-1;
  if(TTS){
    hookNative();
    const steps=[];
    segs.forEach(s=>{const lang=LANGS[s.lang][1],label=s.text.slice(0,80);
      steps.push({t:'s',text:s.text,lang,i:s.i,label});steps.push({t:'w',ms:s.pause+1,i:s.i,label})});
    playing=true;updPlay();
    await askBat();
    try{await TTS.playList({steps,start:0,loop:false,rate:S.rate,title})}
    catch(e){playing=false;updPlay();toast('Không phát được: '+(e&&e.message||e))}
    return;
  }
  if(srvUrl())return playSegAudio(segs,title);
  return playSegSpeech(segs);
}
async function playSegSpeech(segs){
  stopPlay();segCb=segHL;const tk=++token;playing=true;updPlay();
  for(const s of segs){if(tk!==token)break;segHL(s.i);await speak(s.text,s.lang,tk);if(tk!==token)break;await wait(s.pause,tk)}
  if(tk===token){playing=false;updPlay();segHL(-1)}
}
async function playSegAudio(segs,title){
  const a=getAu();a.loop=false;lastSeg=-1;
  const body={segs:segs.map(s=>({text:s.text,lang:s.lang,pause:s.pause,i:s.i}))},key='g'+hashStr(JSON.stringify(body));
  a._silent=true;a.src=SILENT;a.play().catch(()=>{});
  playing=true;updPlay();
  let res;
  try{res=await lessonAudio(body,key,'/api/tts-segments')}
  catch(e){a._silent=false;playing=false;updPlay();toast('Chưa tạo được âm thanh ('+e.message+'). Đọc tạm bằng giọng của máy, khoá màn hình sẽ dừng.');return playSegSpeech(segs)}
  if(!playing)return;
  if(a._url)URL.revokeObjectURL(a._url);
  a._url=URL.createObjectURL(res.blob);auKey=key;auMarks=res.marks;auList=segs.map(s=>({w:s.text,m:''}));auTitle=title;
  a.src=a._url;a._silent=false;a.defaultPlaybackRate=S.rate;a.playbackRate=S.rate;a.loop=false;
  const go=()=>{try{a.currentTime=0}catch(e){}a.playbackRate=S.rate;a.play().catch(()=>{playing=false;updPlay();toast('Bấm ▶ lần nữa để nghe nhé')})};
  if(a.readyState>=1)go();else a.addEventListener('loadedmetadata',go,{once:true});
  setMeta(0);
}

const hasLetter=t=>/[\p{L}\p{N}]/u.test(t);
// ----- Ngữ pháp -----
function gramBuild(L){
  const segs=[],ranges=[];
  const add=(text,lang,pause,ids)=>{text=(text||'').trim();if(!hasLetter(text))return;const i=segs.length;segs.push({text,lang,pause,i});ids.push(i)};
  const html=(L.grammar||[]).map((p,gi)=>{
    const a=segs.length,idT=[],idB=[];
    add(p.title,L.b,500,idT);
    (p.body||'').split(/\n+/).forEach(par=>add(par,L.b,500,idB));
    const exs=(p.ex||[]).map(e=>{const ids=[];add(e.cs,L.a,700,ids);add(e.vi,L.b,900,ids);
      return `<div class="gex" data-seg="${ids.join(' ')}"><div class="cs">${esc(e.cs)}</div><div class="vi">${esc(e.vi||'')}</div></div>`}).join('');
    ranges.push([a,segs.length]);
    return `<div class="card gp"><div class="gh"><b data-seg="${idT.join(' ')}">${esc(p.title)}</b><span class="gact"><button data-gs="${gi}">${I.speaker}</button><button data-ge="${gi}">${I.pencil}</button></span></div><div class="gbody" data-seg="${idB.join(' ')}">${esc(p.body||'')}</div>${exs}</div>`}).join('');
  return {segs,ranges,html};
}
// ----- Câu chuyện: [ngoặc vuông] + tự nhận biết từ có trong bài -----
function storyWords(L){
  return [...new Set((L.items||[]).map(x=>(x.w||'').trim()).filter(w=>w&&(w.includes(' ')||w.length>=4)))].sort((a,b)=>b.length-a.length);
}
function storyTokens(text,L,auto){
  const toks=[],vi=t=>{if(t)toks.push({text:t,lang:L.b})};
  let re=null;
  if(auto){const ws=storyWords(L);if(ws.length){
    try{re=new RegExp('(?<![\\p{L}\\p{N}])(?:'+ws.map(w=>w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')+')(?![\\p{L}\\p{N}])','giu')}catch(e){re=null}}}
  const plain=t=>{
    if(!re||!t)return vi(t);
    let last=0,m;re.lastIndex=0;
    while((m=re.exec(t))){vi(t.slice(last,m.index));toks.push({text:m[0],lang:L.a});last=m.index+m[0].length}
    vi(t.slice(last));
  };
  const br=/\[([^\[\]]+)\]/g;let last=0,m;
  while((m=br.exec(text))){plain(text.slice(last,m.index));toks.push({text:m[1],lang:L.a});last=br.lastIndex}
  plain(text.slice(last));
  return toks;
}
function storyBuild(L){
  const segs=[],ranges=[];
  const html=(L.stories||[]).map((s,si)=>{
    const a=segs.length,toks=storyTokens(s.text||'',L,s.auto!==false);
    const body=toks.map(t=>{
      if(!hasLetter(t.text))return esc(t.text);
      const i=segs.length,end=/[.!?…:;]\s*$|\n\s*$/.test(t.text);
      let txt=t.text.trim();const lead=txt.match(/^[.!?…:;,]+/);
      if(lead){if(/[.!?…:;]/.test(lead[0])&&segs.length>a)segs[segs.length-1].pause=650;txt=txt.slice(lead[0].length).trim()}
      segs.push({text:txt,lang:t.lang,pause:end?650:200,i});
      return `<span data-seg="${i}" class="${t.lang===L.a?'sc':'sv'}">${esc(t.text)}</span>`}).join('');
    ranges.push([a,segs.length]);
    return `<div class="card sp2"><div class="gh"><b>${esc(s.title||'Câu chuyện')}</b><span class="gact"><button data-ss="${si}">${I.speaker}</button><button data-se="${si}">${I.pencil}</button></span></div><div class="story">${body}</div></div>`}).join('');
  return {segs,ranges,html};
}
function bindModes(){
  $('#bk').onclick=home;
  $('#mCards').onclick=()=>{mode='cards';lesson()};
  $('#mFc').onclick=()=>{mode='fc';sel=null;fc.flip=false;lesson()};
  if($('#mGram'))$('#mGram').onclick=()=>{mode='gram';sel=null;lesson()};
  if($('#mStory'))$('#mStory').onclick=()=>{mode='story';sel=null;lesson()};
}
function lessonExtra(head,modes,L){
  const isG=mode==='gram',B=isG?gramBuild(L):storyBuild(L),list=isG?(L.grammar||[]):(L.stories||[]);
  const hint=isG?'Bấm "Dán & tự sắp xếp" để dán ghi chú thô, AI tự chia thành từng điểm (giải thích tiếng Việt + 2 ví dụ tiếng Séc). Bấm loa để nghe.':'Bấm "Dán & tự sắp xếp" để dán các phần truyện, AI tự gom thành câu chuyện. Hoặc tự viết, đặt từ tiếng Séc trong ngoặc vuông [ ]; từ có trong bài cũng được tự nhận biết. Chạm chữ Séc (màu tím) để nghe riêng.';
  const empty=`<div class="empty"><span class="kao">${isG?'(・・ ) ?':''}</span>${isG?'Chưa có điểm ngữ pháp nào trong bài này.':'Chưa có câu chuyện nào trong bài này.'}<br>Bấm nút bên trên để thêm nhé!</div>`;
  $('#app').innerHTML=head+`<main>${modes}<div style="display:flex;gap:8px;margin-bottom:10px"><button class="btn sec" style="flex:1;padding:12px 8px" id="xAdd">${I.plus} Thêm tay</button><button class="btn" style="flex:1;padding:12px 8px" id="xOrg">${I.sparkle} Dán &amp; tự sắp xếp</button></div><p class="hint" style="margin:0 0 12px">${hint}</p>${list.length?B.html:empty}</main>
  <div class="player"><div class="row"><button class="btn play" id="playBtn">${I.play}</button><div class="grow"><label>Tốc độ <b id="rv">${S.rate}x</b> · chậm ⇄ nhanh</label><input type="range" id="rate" min="0.3" max="1.6" step="0.1" value="${S.rate}"></div></div></div>`;
  bindModes();
  $('#rate').oninput=e=>{S.rate=+e.target.value;if(au)au.playbackRate=S.rate;$('#rv').textContent=S.rate+'x';persistS()};
  $('#playBtn').onclick=()=>playing?stopPlay():playSegs(B.segs,L.title+(isG?' · Ngữ pháp':' · Truyện'));
  $('#xAdd').onclick=()=>isG?openGram(-1):openStory(-1);
  $('#xOrg').onclick=openOrg;
  const part=(attr,fn)=>document.querySelectorAll('['+attr+']').forEach(b=>b.onclick=()=>fn(+b.getAttribute(attr)));
  part(isG?'data-gs':'data-ss',k=>{const r=B.ranges[k];playSegs(B.segs.slice(r[0],r[1]),L.title)});
  part(isG?'data-ge':'data-se',k=>isG?openGram(k):openStory(k));
  document.querySelectorAll('.story .sc').forEach(e=>e.onclick=()=>sayWord(e.textContent,L.a));
}
// ----- Dán văn bản thô -> máy chủ tự sắp xếp thành ngữ pháp / câu chuyện -----
let orgKind='',orgItems=null;
function openOrg(){
  orgKind=mode==='gram'?'grammar':'story';orgItems=null;
  $('#oTitle').innerHTML=I.sparkle+(orgKind==='grammar'?' Dán ngữ pháp, tự sắp xếp':' Dán truyện, tự sắp xếp');
  $('#oHint').textContent=orgKind==='grammar'
    ?'Dán ghi chú ngữ pháp thô (nhiều điểm lẫn lộn cũng được). AI sẽ tách thành từng điểm, viết giải thích tiếng Việt và 2 ví dụ.'
    :'Dán các phần truyện (phần 1, phần 2...). AI sẽ gom thành các câu chuyện đúng thứ tự và đặt từ tiếng Séc vào ngoặc vuông.';
  $('#oText').value='';$('#oRes').innerHTML='';$('#oSave').style.display='none';$('#oGo').disabled=false;
  $('#orgModal').classList.add('show');
}
function updOrgSave(){
  const n=orgItems.filter(x=>x.on).length,b=$('#oSave');
  b.style.display='';b.textContent='Lưu '+n+' mục đã chọn';b.disabled=!n;
}
function renderOrg(){
  $('#oRes').innerHTML='<p class="hint">Xem lại kết quả, bỏ chọn mục không muốn lưu. Sau khi lưu bạn vẫn sửa được bằng nút bút chì.</p>'
    +orgItems.map((x,k)=>`<label class="card oi" style="display:block;cursor:pointer"><div style="display:flex;gap:10px;align-items:flex-start"><input type="checkbox" data-k="${k}" ${x.on?'checked':''} style="width:20px;height:20px;margin-top:2px;flex:none;accent-color:var(--p)"><div style="flex:1;min-width:0"><b>${esc(x.title||'')}</b>${
      orgKind==='grammar'
        ?`<div class="gbody">${esc(x.body)}</div>${x.ex.map(e=>`<div class="gex"><div class="cs">${esc(e.cs)}</div><div class="vi">${esc(e.vi)}</div></div>`).join('')}`
        :`<div class="story" style="font-size:15px;line-height:1.7">${esc(x.text)}</div>`}</div></div></label>`).join('');
  $('#oRes').querySelectorAll('input[type=checkbox]').forEach(c=>c.onchange=()=>{orgItems[+c.dataset.k].on=c.checked;updOrgSave()});
  updOrgSave();
}
$('#oCancel').onclick=()=>$('#orgModal').classList.remove('show');
$('#oGo').onclick=async()=>{
  const text=$('#oText').value.trim();
  if(!text)return toast('Hãy dán nội dung vào ô trước nhé');
  if(!srvUrl())return toast('Chưa có địa chỉ máy chủ. Hãy mở app bằng địa chỉ trên Render, hoặc điền ở tab Link > Máy chủ.');
  $('#oGo').disabled=true;$('#oRes').innerHTML='<p class="hint">Đang sắp xếp... khoảng 10-30 giây</p>';$('#oSave').style.display='none';
  const ctl=new AbortController(),to=setTimeout(()=>ctl.abort(),90000);
  try{
    const r=await fetch(srvUrl()+'/api/organize',{method:'POST',headers:{'Content-Type':'application/json','X-Token':S.tok},signal:ctl.signal,
      body:JSON.stringify({kind:orgKind,text,lang_name:LANGS[cur.a][0].toLowerCase(),words:orgKind==='story'?(cur.items||[]).map(x=>x.w):[]})});
    let j;try{j=await r.json()}catch(e){throw new Error('máy chủ đang khởi động, thử lại sau 1 phút')}
    if(!r.ok)throw new Error(j.detail||('lỗi '+r.status));
    if(!j.items||!j.items.length)throw new Error('AI không tìm thấy nội dung phù hợp, hãy kiểm tra lại văn bản');
    orgItems=j.items.map(x=>Object.assign({on:true},x));renderOrg();
  }catch(e){$('#oRes').innerHTML='';toast('Lỗi: '+(e.name==='AbortError'?'quá thời gian chờ':e.message))}
  clearTimeout(to);$('#oGo').disabled=false;
};
$('#oSave').onclick=()=>{
  const pick=(orgItems||[]).filter(x=>x.on);if(!pick.length)return;
  if(orgKind==='grammar'){cur.grammar=cur.grammar||[];pick.forEach(x=>cur.grammar.push({title:x.title,body:x.body,ex:x.ex}))}
  else{cur.stories=cur.stories||[];pick.forEach(x=>cur.stories.push({title:x.title||'Câu chuyện',text:x.text,auto:true}))}
  persist();$('#orgModal').classList.remove('show');lesson();toast('Đã lưu '+pick.length+' mục');
};

// ----- Soạn ngữ pháp -----
let gIdx=-1,sIdx=-1;
function openGram(i){
  gIdx=i;const p=i>=0?cur.grammar[i]:{title:'',body:'',ex:[]},e=p.ex||[];
  $('#gTitle').innerHTML=I.book+(i>=0?' Sửa ngữ pháp':' Thêm ngữ pháp');
  $('#gT').value=p.title;$('#gB').value=p.body||'';
  $('#gE1c').value=e[0]?e[0].cs:'';$('#gE1v').value=e[0]?e[0].vi:'';$('#gE2c').value=e[1]?e[1].cs:'';$('#gE2v').value=e[1]?e[1].vi:'';
  $('#gDel').style.display=i>=0?'':'none';$('#gramModal').classList.add('show');
}
$('#gCancel').onclick=()=>$('#gramModal').classList.remove('show');
$('#gSave').onclick=()=>{
  const t=$('#gT').value.trim(),b=$('#gB').value.trim();
  if(!t||!b)return toast('Cần nhập tên điểm ngữ pháp và phần giải thích');
  const ex=[['gE1c','gE1v'],['gE2c','gE2v']].map(([c,v])=>({cs:$('#'+c).value.trim(),vi:$('#'+v).value.trim()})).filter(e=>e.cs);
  if(!ex.length)return toast('Hãy nhập ví dụ tiếng Séc (nên có đủ 2 ví dụ)');
  cur.grammar=cur.grammar||[];
  if(gIdx>=0)Object.assign(cur.grammar[gIdx],{title:t,body:b,ex});else cur.grammar.push({title:t,body:b,ex});
  persist();$('#gramModal').classList.remove('show');lesson();
};
$('#gDel').onclick=async()=>{
  $('#gramModal').classList.remove('show');
  if(!await dlg({title:'Xoá điểm ngữ pháp này?',msg:cur.grammar[gIdx].title,ok:'Xoá',danger:true}))return;
  cur.grammar.splice(gIdx,1);persist();lesson();
};
// ----- Soạn câu chuyện -----
function openStory(i){
  sIdx=i;const s=i>=0?cur.stories[i]:{title:'',text:'',auto:true};
  $('#sTitle').innerHTML=I.story+(i>=0?' Sửa câu chuyện':' Thêm câu chuyện');
  $('#sT').value=s.title||'';$('#sX').value=s.text||'';$('#sA').checked=s.auto!==false;
  $('#sDel').style.display=i>=0?'':'none';$('#storyModal').classList.add('show');
}
$('#sCancel').onclick=()=>$('#storyModal').classList.remove('show');
$('#sSave').onclick=()=>{
  const text=$('#sX').value.trim();if(!text)return toast('Hãy viết nội dung câu chuyện');
  const o={title:$('#sT').value.trim()||'Câu chuyện',text,auto:$('#sA').checked};
  cur.stories=cur.stories||[];
  if(sIdx>=0)Object.assign(cur.stories[sIdx],o);else cur.stories.push(o);
  persist();$('#storyModal').classList.remove('show');lesson();
};
$('#sDel').onclick=async()=>{
  $('#storyModal').classList.remove('show');
  if(!await dlg({title:'Xoá câu chuyện này?',msg:cur.stories[sIdx].title,ok:'Xoá',danger:true}))return;
  cur.stories.splice(sIdx,1);persist();lesson();
};

// ---------- Hộp thoại & menu ----------
function dlg({title,msg='',input=null,ok='OK',danger=false}){
  return new Promise(res=>{
    $('#dlgTitle').textContent=title;$('#dlgMsg').textContent=msg;$('#dlgMsg').style.display=msg?'':'none';
    const inp=$('#dlgIn');inp.style.display=input===null?'none':'';inp.value=input||'';
    $('#dlgOk').textContent=ok;$('#dlgOk').style.background=danger?'linear-gradient(135deg,#e84393,#fd79a8)':'';
    const close=v=>{$('#dlgModal').classList.remove('show');res(v)};
    $('#dlgOk').onclick=()=>close(input===null?true:inp.value.trim());$('#dlgNo').onclick=()=>close(null);
    $('#dlgModal').classList.add('show');if(input!==null)setTimeout(()=>inp.focus(),100);
  });
}
function menu(title,opts){
  $('#menuTitle').textContent=title;
  $('#menuBody').innerHTML=opts.map((o,k)=>`<button data-k="${k}" class="${o.danger?'danger':''}">${I[o.ic]}${o.t}</button>`).join('');
  $('#menuBody').querySelectorAll('button').forEach(b=>b.onclick=()=>{$('#menuModal').classList.remove('show');opts[+b.dataset.k].fn()});
  $('#menuModal').classList.add('show');
}
$('#menuClose').onclick=()=>$('#menuModal').classList.remove('show');

function lessonMenu(l){
  menu(l.title,[
    {ic:'pencil',t:'Đổi tên bài',fn:async()=>{const v=await dlg({title:'Đổi tên bài',input:l.title,ok:'Lưu'});if(v){l.title=v;persist();home();toast('Đã đổi tên')}}},
    {ic:'pin',t:'Đưa lên đầu danh sách',fn:()=>{lessons.splice(lessons.indexOf(l),1);lessons.unshift(l);persist();home()}},
    {ic:'star',t:'Thêm cả bài vào Sổ ôn riêng',fn:()=>{l.items.forEach(x=>x.star=true);persist();home();toast('Đã thêm vào Sổ ôn')}},
    {ic:'reset',t:'Học lại từ đầu (bỏ đánh dấu đã thuộc)',fn:async()=>{if(await dlg({title:'Học lại từ đầu?',msg:'Tất cả từ trong bài sẽ chuyển về "chưa thuộc".',ok:'Đồng ý'})){l.items.forEach(x=>x.known=false);persist();home()}}},
    {ic:'trash',t:'Xoá bài',danger:true,fn:async()=>{if(await dlg({title:'Xoá bài "'+l.title+'"?',msg:'Bài và các từ trong bài sẽ bị xoá, kể cả trong Sổ ôn riêng.',ok:'Xoá',danger:true})){lessons.splice(lessons.indexOf(l),1);persist();home();toast('Đã xoá bài')}}},
  ]);
}

