// ---------- TTS ----------
function refreshVoices(){voicesList=speechSynthesis.getVoices()}
if('speechSynthesis' in window){refreshVoices();speechSynthesis.onvoiceschanged=refreshVoices}
function pickVoice(lang){
  const code=LANGS[lang][1],pref=S.voices[lang];
  if(pref){const v=voicesList.find(v=>v.voiceURI===pref);if(v)return v}
  const base=code.slice(0,2);
  const m=voicesList.filter(v=>v.lang.replace('_','-').toLowerCase().startsWith(base));
  return m.find(v=>v.lang.toLowerCase().replace('_','-')===code.toLowerCase()&&/google|natural|enhanced/i.test(v.name))||m.find(v=>v.lang.toLowerCase().replace('_','-')===code.toLowerCase())||m[0]||null;
}
const NATIVE=!!(window.Capacitor&&Capacitor.isNativePlatform&&Capacitor.isNativePlatform());
let TTS=null;if(NATIVE){try{TTS=Capacitor.Plugins.NativeTTS||Capacitor.registerPlugin('NativeTTS')}catch(e){}}
const warned={};
async function speakNative(text,lang,tk){
  if(tk!==token)return;
  const wd=setInterval(()=>{if(tk!==token){clearInterval(wd);TTS.stop().catch(()=>{})}},150);
  try{await TTS.speak({text,lang:LANGS[lang][1],rate:S.rate})}
  catch(e){const m=String(e&&e.message||e);
    if(m.includes('LANG_MISSING')&&!warned[lang]){warned[lang]=1;toast('Máy chưa có giọng '+LANGS[lang][0]+'. Vào Cài đặt > Quản lý chung > Chuyển văn bản thành giọng nói > chọn Google > Cài đặt > Cài đặt dữ liệu giọng nói, tải '+LANGS[lang][0]+'.')}
    else if(m.includes('TTS_INIT'))toast('Không mở được bộ đọc giọng nói của máy');}
  clearInterval(wd);
}
function speak(text,lang,tk){
  if(TTS)return speakNative(text,lang,tk);
  return new Promise(res=>{
    if(!('speechSynthesis' in window)){toast('Trình duyệt không hỗ trợ đọc');return res()}
    const u=new SpeechSynthesisUtterance(text);u.lang=LANGS[lang][1];
    const v=pickVoice(lang);if(v)u.voice=v;
    u.rate=S.rate;
    let done=false;const fin=()=>{if(!done){done=true;clearInterval(wd);res()}};
    u.onend=fin;u.onerror=fin;
    const wd=setInterval(()=>{if(tk!==token){speechSynthesis.cancel();fin()}},150);
    speechSynthesis.speak(u);
  });
}
const wait=(ms,tk)=>new Promise(r=>{const t=Date.now();const i=setInterval(()=>{if(tk!==token||Date.now()-t>=ms){clearInterval(i);r()}},50)});
const readFirstVi=()=>S.order==='vi';
async function sayItem(it,L,tk,withEx){
  const wordFirst=!readFirstVi();
  if(S.say==='both'&&!wordFirst){await speak(it.m,L.b,tk);if(tk!==token)return;await wait(400,tk);if(tk!==token)return;await speak(it.w,L.a,tk);if(tk!==token)return}
  else{
    if(S.say!=='b'){await speak(it.w,L.a,tk);if(tk!==token)return}
    if(S.say==='both'){await wait(400,tk);if(tk!==token)return}
    if(S.say!=='a'){await speak(it.m,L.b,tk);if(tk!==token)return}
  }
  if(S.say==='b')return;
  if(withEx&&it.ex){await wait(400,tk);if(tk!==token)return;await speak(it.ex,L.a,tk)}
}
// danh sách đang hiển thị (theo bộ lọc)
function view(){const b=cur.items;return filter==='todo'?b.filter(x=>!x.known):filter==='known'?b.filter(x=>x.known):b}
const owner=it=>lessons.find(l=>l.items.includes(it));
const langLessons=()=>lessons.filter(l=>l.a===S.lang&&l.b==='vi');
const makeStar=()=>({virtual:true,id:0,title:'Sổ ôn riêng',a:S.lang,b:'vi',items:langLessons().flatMap(l=>l.items.filter(x=>x.star))});
// các bước đọc của cả bài (dùng cho bộ phát nền của Android)
function buildSteps(list,L){
  const st=[],A=LANGS[L.a][1],B=LANGS[L.b][1];
  list.forEach((it,i)=>{const label=it.w+'  —  '+it.m;
    for(let r=0;r<S.rep;r++){
      const steps=[];
      if(S.say!=='b')steps.push({t:'s',text:it.w,lang:A,i,label});
      if(S.say==='both')steps.push({t:'w',ms:400,i,label});
      if(S.say!=='a')steps.push({t:'s',text:it.m,lang:B,i,label});
      if(S.say==='both'&&readFirstVi())steps.reverse();
      st.push(...steps);
      if(S.ex&&it.ex&&S.say!=='b'&&r===S.rep-1){st.push({t:'w',ms:400,i,label});st.push({t:'s',text:it.ex,lang:A,i,label})}
      st.push({t:'w',ms:Math.round(S.gap*1000)+1,i,label});
    }});
  return st;
}
let nativeHooked=false;
function hookNative(){
  if(!TTS||nativeHooked)return;nativeHooked=true;
  TTS.addListener('progress',e=>{if(segCb)segCb(e.i);else if(cur&&mode==='cards'&&!sel)mark(e.i)});
  TTS.addListener('state',e=>{playing=e.playing;updPlay();if(e.ended){idx=-1;if(segCb)segCb(-1);else mark(-1)}});
}
async function playFrom(start){
  segCb=null;
  if(TTS){
    stopPlay();hookNative();
    const list=view();if(!list.length)return;
    const steps=buildSteps(list,cur),s0=Math.max(0,steps.findIndex(x=>x.i>=start));
    playing=true;updPlay();mark(start);
    await askBat();
    try{await TTS.playList({steps,start:s0,loop:!!S.loop,rate:S.rate,title:cur.title})}
    catch(e){playing=false;updPlay();toast('Không phát được: '+(e&&e.message||e))}
    return;
  }
  stopPlay();
  if(srvUrl())return playAudio(start);
  return playSpeech(start);
}
async function playSpeech(start){
  stopPlay();const tk=++token;playing=true;updPlay();
  const L=cur,list=view();let s=start;
  while(tk===token&&list.length){
    for(let i=s;i<list.length&&tk===token;i++){
      mark(i);
      for(let r=0;r<S.rep&&tk===token;r++){
        await sayItem(list[i],L,tk,S.ex&&r===S.rep-1);if(tk!==token)break;
        await wait(S.gap*1000,tk);
      }
    }
    if(!S.loop)break;s=0;
  }
  if(tk===token){playing=false;idx=-1;mark(-1);updPlay()}
}
function stopPlay(){token++;playing=false;if(au&&!au.paused){au._silent=false;au.pause()}if(TTS){TTS.stop().catch(()=>{})}else if('speechSynthesis' in window)speechSynthesis.cancel();updPlay()}
function mark(i){idx=i;document.querySelectorAll('.pair').forEach((e,k)=>e.classList.toggle('on',k===i));const e=document.querySelectorAll('.pair')[i];if(e)e.scrollIntoView({block:'center',behavior:'smooth'})}
function updPlay(){const b=$('#playBtn');if(b)b.innerHTML=playing?I.pause:I.play}
async function speakOne(i){stopPlay();const tk=++token;mark(i);await sayItem(view()[i],cur,tk,true)}

// ---------- Phát bằng file âm thanh (bản web/iPhone: nghe được khi khoá màn hình) ----------
const SILENT='data:audio/mpeg;base64,//NkxAAAAANIAAAAAExBTUVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxHwAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
let au=null,auKey='',auMarks=[],auList=[],auTitle='';
const srvUrl=()=>(S.srv||(!NATIVE&&/^https:/.test(location.protocol)?location.origin:'')).replace(/\/$/,'');
const hashStr=s=>{let h=5381,g=52711;for(let i=0;i<s.length;i++){const c=s.charCodeAt(i);h=Math.imul(h,33)^c;g=Math.imul(g,31)^c}return (h>>>0).toString(36)+(g>>>0).toString(36)+s.length.toString(36)};
const audioBody=(list,L)=>({items:list.map(x=>({w:x.w,m:x.m,ex:x.ex||''})),a:L.a,b:L.b,rep:S.rep,say:S.say,gap:S.gap,ex:!!S.ex});
function setMeta(i){
  const it=auList[i];if(!it||!('mediaSession' in navigator))return;
  try{navigator.mediaSession.metadata=new MediaMetadata({title:it.w+(it.m?'  —  '+it.m:''),artist:auTitle,album:'Nghe Từ Vựng',artwork:[{src:'icon-512.png',sizes:'512x512',type:'image/png'}]})}catch(e){}
}
function getAu(){
  if(au)return au;
  au=new Audio();au.preload='auto';
  au.addEventListener('timeupdate',()=>{if(au._silent||!auMarks.length)return;const t=au.currentTime;let i=0;
    for(let k=0;k<auMarks.length;k++){if(auMarks[k].t<=t+0.05)i=k;else break}
    if(segCb){const si=auMarks[i].i;if(si!==lastSeg){lastSeg=si;segCb(si);setMeta(i)}return}
    if(i!==idx){if(cur&&mode==='cards'&&!sel)mark(i);else idx=i;setMeta(i)}});
  au.addEventListener('play',()=>{if(!au._silent){playing=true;updPlay()}});
  au.addEventListener('pause',()=>{if(!au._silent){playing=false;updPlay()}});
  au.addEventListener('ended',()=>{if(!au._silent){playing=false;updPlay();idx=-1;if(segCb)segCb(-1);else mark(-1)}});
  if('mediaSession' in navigator){const ms=navigator.mediaSession;
    const jump=d=>{const i=Math.max(0,Math.min(auMarks.length-1,idx+d));if(auMarks[i])au.currentTime=auMarks[i].t};
    try{ms.setActionHandler('play',()=>au.play());ms.setActionHandler('pause',()=>au.pause());
      ms.setActionHandler('previoustrack',()=>jump(-1));ms.setActionHandler('nexttrack',()=>jump(1))}catch(e){}}
  return au;
}
async function lessonAudio(body,key,path='/api/tts-lesson'){
  let c=null;
  try{c=await caches.open('ntv-audio');const r=await c.match('/__a/'+key),m=await c.match('/__a/'+key+'.json');
    if(r&&m)return {blob:await r.blob(),marks:(await m.json()).marks}}catch(e){}
  toast('Đang tạo file âm thanh cho bài... lần đầu mất 10-30 giây, các lần sau nghe ngay');
  const r=await fetch(srvUrl()+path,{method:'POST',headers:{'Content-Type':'application/json','X-Token':S.tok},body:JSON.stringify(body)});
  let j;try{j=await r.json()}catch(e){throw new Error('máy chủ đang khởi động, thử lại sau 1 phút')}
  if(!r.ok)throw new Error(j.detail||('lỗi '+r.status));
  const bin=Uint8Array.from(atob(j.audio),ch=>ch.charCodeAt(0)),blob=new Blob([bin],{type:'audio/mpeg'});
  try{if(c){await c.put('/__a/'+key,new Response(blob,{headers:{'Content-Type':'audio/mpeg'}}));await c.put('/__a/'+key+'.json',new Response(JSON.stringify({marks:j.marks})))}}catch(e){}
  toast('Đã lưu âm thanh bài này, lần sau nghe ngay');
  return {blob,marks:j.marks};
}
async function playAudio(start){
  const list=view();if(!list.length)return;
  const L=cur,body=audioBody(list,L),key=hashStr(JSON.stringify(body)),a=getAu();
  a.loop=!!S.loop;
  if(key===auKey&&a._url){a._silent=false;a.playbackRate=S.rate;if(auMarks[start])a.currentTime=auMarks[start].t;a.play().catch(()=>toast('Bấm ▶ lần nữa nhé'));return}
  a._silent=true;a.src=SILENT;a.play().catch(()=>{}); // mở khoá âm thanh ngay khi bấm (yêu cầu của iPhone)
  playing=true;updPlay();mark(start);
  let res;
  try{res=await lessonAudio(body,key)}
  catch(e){a._silent=false;playing=false;updPlay();toast('Chưa tạo được âm thanh ('+e.message+'). Đọc tạm bằng giọng của máy, khoá màn hình sẽ dừng.');return playSpeech(start)}
  if(!playing)return;
  if(a._url)URL.revokeObjectURL(a._url);
  a._url=URL.createObjectURL(res.blob);auKey=key;auMarks=res.marks;auList=list;auTitle=L.title;
  a.src=a._url;a._silent=false;a.defaultPlaybackRate=S.rate;a.playbackRate=S.rate;a.loop=!!S.loop;
  const st=auMarks[start]?auMarks[start].t:0;
  const go=()=>{try{a.currentTime=st}catch(e){}a.playbackRate=S.rate;a.play().catch(()=>{playing=false;updPlay();toast('Bấm ▶ lần nữa để nghe nhé')})};
  if(a.readyState>=1)go();else a.addEventListener('loadedmetadata',go,{once:true});
  setMeta(start);
}

// ---------- Xuất / nhập dữ liệu (chuyển bài sang máy khác) ----------
async function exportData(){
  const data=JSON.stringify({app:'nghe-tu-vung',v:1,lessons}),name='nghe-tu-vung-'+new Date().toISOString().slice(0,10)+'.json';
  if(NATIVE){try{const FS=Capacitor.Plugins.Filesystem,SH=Capacitor.Plugins.Share;
    const r=await FS.writeFile({path:name,data,directory:'CACHE',encoding:'utf8'});
    await SH.share({title:'Dữ liệu Nghe Từ Vựng',dialogTitle:'Gửi file dữ liệu',files:[r.uri]});return}
    catch(e){if(/cancel/i.test(String(e&&e.message)))return;toast('Không xuất được: '+(e&&e.message||e));return}}
  const file=new File([data],name,{type:'application/json'});
  if(navigator.canShare&&navigator.canShare({files:[file]})){try{await navigator.share({files:[file],title:'Dữ liệu Nghe Từ Vựng'});return}catch(e){if(e.name==='AbortError')return}}
  const a=document.createElement('a');a.href=URL.createObjectURL(file);a.download=name;document.body.appendChild(a);a.click();a.remove();
}
async function importData(f){
  try{const d=JSON.parse(await f.text()),arr=Array.isArray(d)?d:d.lessons;if(!Array.isArray(arr))throw 0;let n=0;
    arr.forEach(l=>{if(!l||!Array.isArray(l.items)||!l.title)return;l.items=l.items.map(norm);
      const dup=lessons.find(x=>x.title===l.title&&x.a===l.a&&x.items.length===l.items.length&&x.items.every((it,k)=>it.w===l.items[k].w));
      if(dup)return;l.id=Date.now()+n;lessons.push(l);n++});
    persist();$('#setModal').classList.remove('show');home();toast(n?`Đã nhập ${n} bài`:'Các bài này đã có sẵn rồi')}
  catch(e){toast('File không đúng định dạng')}
}

