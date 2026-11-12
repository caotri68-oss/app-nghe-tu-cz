const LANGS={cs:['Tiếng Séc','cs-CZ','ces'],vi:['Tiếng Việt','vi-VN','vie'],en:['Tiếng Anh','en-US','eng'],ja:['Tiếng Nhật','ja-JP','jpn'],de:['Tiếng Đức','de-DE','deu'],fr:['Tiếng Pháp','fr-FR','fra'],es:['Tây Ban Nha','es-ES','spa'],ko:['Tiếng Hàn','ko-KR','kor'],zh:['Tiếng Trung','zh-CN','chi_sim'],ru:['Tiếng Nga','ru-RU','rus'],pl:['Tiếng Ba Lan','pl-PL','pol'],sk:['Tiếng Slovak','sk-SK','slk']};

const face=(x,y,s=1)=>`<circle cx="${x-3*s}" cy="${y}" r="${1.1*s}" fill="#3b2f55"/><circle cx="${x+3*s}" cy="${y}" r="${1.1*s}" fill="#3b2f55"/><path d="M${x-1.5*s} ${y+2*s}q${1.5*s} ${1.5*s} ${3*s} 0" stroke="#3b2f55" stroke-width="${.9*s}" fill="none" stroke-linecap="round"/><circle cx="${x-5*s}" cy="${y+1.8*s}" r="${1.3*s}" fill="#FF8FB8" opacity=".75"/><circle cx="${x+5*s}" cy="${y+1.8*s}" r="${1.3*s}" fill="#FF8FB8" opacity=".75"/>`;
const svg=b=>`<svg class="ic" viewBox="0 0 32 32" aria-hidden="true">${b}</svg>`;
const st=(c,w=3.4)=>`stroke="${c}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"`;
const ln=(w=2.2)=>`stroke="currentColor" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"`;
const I={
 speaker:svg(`<path d="M5 12.5h4l7-5.5v18l-7-5.5H5z" ${ln()}/><path d="M20.5 12a5.5 5.5 0 010 8M24 8.5a10.5 10.5 0 010 15" ${ln()}/>`),
 pencil:svg(`<path d="M5 27l1.2-5.5L21.5 6.2a2.4 2.4 0 013.4 0l.9.9a2.4 2.4 0 010 3.4L10.5 25.8z" ${ln()}/><path d="M19 8.8l4.2 4.2" ${ln()}/>`),
 trash:svg(`<path d="M6 9h20M12 9V6h8v3M8.5 9l1.3 17a2 2 0 002 1.8h8.4a2 2 0 002-1.8L23.5 9M13.5 14v8M18.5 14v8" ${ln()}/>`),
 play:svg(`<path d="M10 7l14 9-14 9z" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>`),
 pause:svg(`<rect x="8" y="7" width="5.5" height="18" rx="2" fill="currentColor"/><rect x="18.5" y="7" width="5.5" height="18" rx="2" fill="currentColor"/>`),
 back:svg(`<path d="M20 6l-10 10 10 10" ${ln(3)}/>`),
 next:svg(`<path d="M12 6l10 10-10 10" ${ln(3)}/>`),
 plus:svg(`<path d="M16 6v20M6 16h20" ${ln(3)}/>`),
 shuffle:svg(`<path d="M4 9h5c8 0 8 14 16 14h3M4 23h5c3 0 5-2 6.5-4.5M17 12.5C18.5 10.5 20.5 9 23.5 9H28" ${ln(2.2)}/><path d="M24.5 5.5l3.5 3.5-3.5 3.5M24.5 19.5l3.5 3.5-3.5 3.5" ${ln(2.2)}/>`),
 flash:svg(`<rect x="4" y="9" width="20" height="16" rx="3" ${ln()}/><path d="M9 5h18a1 1 0 011 1v15" ${ln()}/>`),
 flower:svg(`<path d="M5 9h12M23 9h4M5 23h4M15 23h12" ${ln()}/><circle cx="20" cy="9" r="3" ${ln()}/><circle cx="12" cy="23" r="3" ${ln()}/>`),
 sparkle:svg(`<path d="M14 4l2.2 7.3L24 13.5l-7.8 2.2L14 23l-2.2-7.3L4 13.5l7.8-2.2z" ${ln()}/><path d="M25 21l.9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9z" ${ln(1.6)}/>`),
 doc:svg(`<path d="M8 4h11l6 6v16a2 2 0 01-2 2H8a2 2 0 01-2-2V6a2 2 0 012-2z" ${ln()}/><path d="M19 4v6h6M10.5 17h11M10.5 22h8" ${ln()}/>`),
 image:svg(`<rect x="4" y="6" width="24" height="20" rx="3" ${ln()}/><circle cx="21" cy="12.5" r="2" ${ln()}/><path d="M5 23l7-7 6 6 3-3 6 6" ${ln()}/>`),
 link:svg(`<path d="M13.5 18.5a5 5 0 007 0l4-4a5 5 0 00-7-7l-1.5 1.5M18.5 13.5a5 5 0 00-7 0l-4 4a5 5 0 007 7l1.5-1.5" ${ln()}/>`),
 search:svg(`<circle cx="14" cy="14" r="8" ${ln(2.4)}/><path d="M20 20l7 7" ${ln(2.6)}/>`),
 book:svg(`<path d="M5 6.5A2.5 2.5 0 017.5 4H26v20H8a3 3 0 00-3 3z" ${ln()}/><path d="M5 27a3 3 0 013-3h18v4H8" ${ln()}/>`),
 story:svg(`<path d="M16 8c-3.5-2.5-8-3-12-1.5V25c4-1.5 8.5-1 12 1.5 3.5-2.5 8-3 12-1.5V6.5C24 5 19.5 5.5 16 8z" ${ln()}/><path d="M16 8v18" ${ln()}/>`),
 dots:svg(`<circle cx="7" cy="16" r="2.4" fill="currentColor"/><circle cx="16" cy="16" r="2.4" fill="currentColor"/><circle cx="25" cy="16" r="2.4" fill="currentColor"/>`),
 check:svg(`<circle cx="16" cy="16" r="12" stroke="#12A37F" stroke-width="2.2" fill="none"/><path d="M10.5 16.5l4 4 7-8" stroke="#12A37F" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`),
 star:svg(`<path d="M16 4l3.6 7.6 8.4 1-6.2 5.8 1.7 8.3L16 22.5l-7.5 4.2 1.7-8.3L4 12.6l8.4-1z" fill="#F5A623" stroke="#F5A623" stroke-width="1.6" stroke-linejoin="round"/>`),
 pin:svg(`<path d="M12 4h8l-1 8 4 5H9l4-5z" ${ln()}/><path d="M16 17v10" ${ln()}/>`),
 reset:svg(`<path d="M7 16a9 9 0 109-9H11" ${ln(2.4)}/><path d="M13 3l-3.5 4 3.5 4" ${ln(2.4)}/>`),
 phones:svg(`<path d="M6 21v-5a10 10 0 0120 0v5" ${ln()}/><rect x="4" y="18" width="5" height="9" rx="2.5" ${ln()}/><rect x="23" y="18" width="5" height="9" rx="2.5" ${ln()}/>`),
};
const ANIM=[
 c=>svg(`<path d="M6 14L5 3l8 6zM26 14l1-11-8 6z" fill="${c}"/><circle cx="16" cy="18" r="12" fill="${c}"/>${face(16,18,1.1)}`),
 c=>svg(`<ellipse cx="11" cy="8" rx="3.500" ry="8" fill="${c}"/><ellipse cx="21" cy="8" rx="3.500" ry="8" fill="${c}"/><circle cx="16" cy="19" r="11.500" fill="${c}"/>${face(16,19,1.1)}`),
 c=>svg(`<circle cx="7" cy="9" r="4.500" fill="${c}"/><circle cx="25" cy="9" r="4.500" fill="${c}"/><circle cx="16" cy="18" r="12" fill="${c}"/><ellipse cx="16" cy="21" rx="4.500" ry="3.500" fill="#fff" opacity=".6"/>${face(16,17,1.1)}`),
 c=>svg(`<circle cx="16" cy="18" r="12" fill="${c}"/><path d="M13 5q3 5 6 0" ${st('#FFB347',2.2)}/><path d="M14.500 20.500l1.500 2 1.500-2z" fill="#FF9F43"/><circle cx="11.500" cy="16" r="1.300" fill="#3b2f55"/><circle cx="20.500" cy="16" r="1.300" fill="#3b2f55"/><circle cx="8" cy="19.500" r="2" fill="#FF8FB8" opacity=".7"/><circle cx="24" cy="19.500" r="2" fill="#FF8FB8" opacity=".7"/>`),
 c=>svg(`<path d="M7 13L8 4l7 5zM25 13l-1-9-7 5z" fill="${c}"/><circle cx="16" cy="18" r="12" fill="${c}"/><ellipse cx="16" cy="21.500" rx="5" ry="3.800" fill="#FFC1D8"/><circle cx="14.300" cy="21.500" r=".8" fill="#3b2f55"/><circle cx="17.700" cy="21.500" r=".8" fill="#3b2f55"/><circle cx="10.500" cy="15.500" r="1.200" fill="#3b2f55"/><circle cx="21.500" cy="15.500" r="1.200" fill="#3b2f55"/>`),
];
const PAL=['#FFB3D1','#B8A9FF','#FFD86B','#9BD8FF','#B5F0D0','#FFB38A'];
const avatar=id=>ANIM[id%ANIM.length](PAL[id%PAL.length]);

const STAR=`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1.5l2.6 7.9 7.9 2.6-7.9 2.6L12 22.5l-2.6-7.9L1.5 12l7.9-2.6z" fill="currentColor"/><path d="M12 6.5l1.1 3.4 3.4 1.1-3.4 1.1L12 15.5l-1.1-3.4L7.5 11l3.4-1.1z" fill="#fff" opacity=".85"/></svg>`;
const ROBERT=`<svg viewBox="0 0 32 32" aria-hidden="true"><defs><radialGradient id="rbG" cx="35%" cy="28%" r="85%"><stop offset="0" stop-color="#E9C49A"/><stop offset="1" stop-color="#B07A52"/></radialGradient><radialGradient id="rbM" cx="40%" cy="30%" r="80%"><stop offset="0" stop-color="#FFF0DC"/><stop offset="1" stop-color="#F0C79B"/></radialGradient><linearGradient id="rbS" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5A78F2"/><stop offset="1" stop-color="#2F4BC4"/></linearGradient></defs>
<circle cx="7.5" cy="8" r="4.6" fill="url(#rbG)"/><circle cx="7.5" cy="8" r="2.3" fill="#F0C79B"/><circle cx="24.5" cy="8" r="4.6" fill="url(#rbG)"/><circle cx="24.5" cy="8" r="2.3" fill="#F0C79B"/>
<circle cx="16" cy="17" r="12" fill="url(#rbG)"/><ellipse cx="12.5" cy="9.5" rx="4" ry="2.3" fill="#fff" opacity=".22"/>
<path d="M12.2 5.2q3.8-2.4 7.6 0" stroke="#8A5A3A" stroke-width="1.5" fill="none" stroke-linecap="round"/>
<ellipse cx="16" cy="20.6" rx="5.4" ry="4.1" fill="url(#rbM)"/><ellipse cx="16" cy="19" rx="1.8" ry="1.25" fill="#4A2F22"/><path d="M16 20.2v1.5M14 21.9q2 1.5 4 0" stroke="#4A2F22" stroke-width=".85" fill="none" stroke-linecap="round"/>
<circle cx="11.7" cy="14.3" r="1.6" fill="#2B1E2F"/><circle cx="20.3" cy="14.3" r="1.6" fill="#2B1E2F"/><circle cx="12.2" cy="13.7" r=".55" fill="#fff"/><circle cx="20.8" cy="13.7" r=".55" fill="#fff"/>
<circle cx="8.6" cy="18.4" r="1.8" fill="#FF8FB8" opacity=".5"/><circle cx="23.4" cy="18.4" r="1.8" fill="#FF8FB8" opacity=".5"/>
<path d="M5.5 25.4c3.4 3.6 17.6 3.6 21 0l1 3.2c-4.4 4.2-19 4.2-23 0z" fill="url(#rbS)"/><path d="M8 27.2c2.5 1.6 13.5 1.6 16 0" stroke="#fff" stroke-width=".8" fill="none" opacity=".45" stroke-linecap="round"/></svg>`;
function greeting(){const h=new Date().getHours();return h<11?'Chào buổi sáng':h<14?'Chào buổi trưa':h<18?'Chào buổi chiều':'Chào buổi tối'}
const FAIRY={
 star:{n:'Sao',c:'',svg:STAR},
 fly:{n:'Đom đóm',c:'f-fly',svg:`<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9.5" fill="currentColor" opacity=".25"/><circle cx="12" cy="12" r="5.2" fill="currentColor"/><circle cx="10.3" cy="10.3" r="1.6" fill="#fff" opacity=".8"/></svg>`},
 but:{n:'Bướm',c:'f-but',svg:`<svg viewBox="0 0 24 24"><path d="M12 12C8 3 2 4 3 10c.6 4 5 4.5 9 2zM12 12c4-9 10-8 9-2-.6 4-5 4.5-9 2z" fill="currentColor"/><path d="M12 12C7 13 4 20 8.5 20c3 0 3.5-4 3.5-8zM12 12c5 1 8 8 3.5 8-3 0-3.5-4-3.5-8z" fill="currentColor" opacity=".7"/><rect x="11.2" y="8" width="1.6" height="10" rx=".8" fill="#6B4A7A"/></svg>`},
 cloud:{n:'Mây',c:'f-cloud',svg:`<svg viewBox="0 0 24 24"><path d="M7 19a4.6 4.6 0 01-.7-9.1A6.2 6.2 0 0118.2 11 4 4 0 0117.6 19z" fill="currentColor"/></svg>`},
 flow:{n:'Hoa',c:'f-flow',svg:`<svg viewBox="0 0 24 24"><g fill="currentColor"><circle cx="12" cy="5.5" r="4"/><circle cx="18.2" cy="10" r="4"/><circle cx="15.8" cy="17.3" r="4"/><circle cx="8.2" cy="17.3" r="4"/><circle cx="5.8" cy="10" r="4"/></g><circle cx="12" cy="12" r="3.3" fill="#FFD84D"/></svg>`},
};
const IMGF=(n)=>`<img class="fimg" src="fairy-${n}.png" alt="">`;
FAIRY.star.svg=IMGF('star');FAIRY.fly.svg=IMGF('fly');FAIRY.but.svg=IMGF('but');FAIRY.cloud.svg=IMGF('cloud');FAIRY.flow.svg=IMGF('flow');
const CH={
 bear:{img:'gau',n:'Gấu',c1:'#B98258',ink:'#3B2418',dy:-.9,
  ears:`<circle cx="7.5" cy="8" r="4.6" fill="#B98258"/><circle cx="7.5" cy="8" r="2.3" fill="#F0C79B"/><circle cx="24.5" cy="8" r="4.6" fill="#B98258"/><circle cx="24.5" cy="8" r="2.3" fill="#F0C79B"/>`,
  face:`<ellipse cx="16" cy="21" rx="5.4" ry="4.1" fill="#FFEBD2"/><ellipse cx="16" cy="19.2" rx="1.8" ry="1.25" fill="#3B2418"/>`,
  front:`<path d="M5.5 25.4c3.4 3.6 17.6 3.6 21 0l1 3.2c-4.4 4.2-19 4.2-23 0z" fill="#4A68E8"/><path d="M8 27.2c2.5 1.6 13.5 1.6 16 0" stroke="#fff" stroke-width=".8" fill="none" opacity=".5" stroke-linecap="round"/>`},
 cat:{img:'meo',n:'Mèo',c1:'#FFB45E',ink:'#4A2A14',dy:-.4,
  ears:`<path d="M5 15L6.2 3.2 14.2 8.6z" fill="#FFB45E"/><path d="M27 15L25.8 3.2 17.8 8.6z" fill="#FFB45E"/><path d="M7.4 11L7.8 6.4 11.4 8.9z" fill="#FF9FB5"/><path d="M24.6 11L24.2 6.4 20.6 8.9z" fill="#FF9FB5"/>`,
  face:`<path d="M16 5.2v3.2M12.4 5.8l.7 2.5M19.6 5.8l-.7 2.5" stroke="#E08A2E" stroke-width="1.2" stroke-linecap="round"/><ellipse cx="16" cy="21.4" rx="5" ry="3.5" fill="#FFF3E0"/><path d="M14.7 19l1.3 1.5 1.3-1.5z" fill="#FF8FA8"/><path d="M4 19.5l5 .8M4.3 22.3l4.8-.9M28 19.5l-5 .8M27.7 22.3l-4.8-.9" stroke="#8A6A4A" stroke-width=".6" stroke-linecap="round"/>`,front:''},
 rabbit:{img:'tho',n:'Thỏ',c1:'#F8EEF6',ink:'#4B3350',dy:0,stroke:'#E3CFE0',
  ears:`<ellipse cx="11" cy="6" rx="3" ry="7.6" fill="#F8EEF6" stroke="#E3CFE0" stroke-width=".7"/><ellipse cx="11" cy="6.6" rx="1.5" ry="5.2" fill="#FFB7CF"/><ellipse cx="21" cy="6" rx="3" ry="7.6" fill="#F8EEF6" stroke="#E3CFE0" stroke-width=".7"/><ellipse cx="21" cy="6.6" rx="1.5" ry="5.2" fill="#FFB7CF"/>`,
  face:`<path d="M14.8 19.3q1.2-1 2.4 0l-1.2 1.3z" fill="#FF8FB0"/><rect x="15.2" y="22.6" width="1.6" height="2" rx=".5" fill="#fff" stroke="#D9C2D6" stroke-width=".4" class="x x-n"/>`,front:''},
 fox:{img:'cao',n:'Cáo',c1:'#F2813A',ink:'#3A1E10',dy:1.4,
  ears:`<path d="M4.6 14L5.4 2.6 14 8.4z" fill="#F2813A"/><path d="M27.4 14L26.6 2.6 18 8.4z" fill="#F2813A"/><path d="M5.2 7.2L5.4 2.6 8.8 4.9z" fill="#3A2A2A"/><path d="M26.8 7.2L26.6 2.6 23.2 4.9z" fill="#3A2A2A"/>`,
  face:`<path d="M4.4 19.5c4 0 8 4.2 11.6 4.2s7.6-4.2 11.6-4.2c-.6 5.2-5.6 9.5-11.6 9.5S5 24.700 4.400 19.500z" fill="#FFF3E4"/><ellipse cx="16" cy="22.6" rx="1.7" ry="1.2" fill="#3A1E10"/>`,front:''},
 owl:{img:'cu',n:'Cú',c1:'#A47F5E',ink:'#3B2A1E',dy:1.6,nomouth:true,
  ears:`<path d="M5.5 11L4.6 2.8 11.4 7z" fill="#8A6745"/><path d="M26.5 11L27.4 2.8 20.6 7z" fill="#8A6745"/>`,
  face:`<circle cx="11.4" cy="15" r="5" fill="#FFF6E6"/><circle cx="20.6" cy="15" r="5" fill="#FFF6E6"/><path d="M16 17.4l-2.1 2.9 2.1 2.3 2.1-2.3z" fill="#F5A623"/><path d="M11 25q5-2.500 10 0" stroke="#8A6745" stroke-width="1" fill="none" stroke-linecap="round" opacity=".5"/>`,front:''},
 dragon:{img:'rong',n:'Rồng',c1:'#6FCB8B',ink:'#1E3A2A',dy:.4,
  ears:`<path d="M8.6 7.6L6.4 1.6 12.4 5.4z" fill="#F7C568"/><path d="M23.4 7.6L25.6 1.6 19.6 5.4z" fill="#F7C568"/><path d="M3.5 13.5q-3 1-2.200 4.200 2.300-.3 3.600-2.200z" fill="#4FB171"/><path d="M28.5 13.5q3 1 2.200 4.200-2.300-.3-3.600-2.200z" fill="#4FB171"/>`,
  face:`<ellipse cx="16" cy="21.3" rx="5.7" ry="4.1" fill="#BFEFCB"/><circle cx="14.2" cy="20" r=".8" fill="#2E6A47"/><circle cx="17.8" cy="20" r=".8" fill="#2E6A47"/>`,front:''},
 dino:{img:'khunglong',n:'Khủng long',c1:'#5EC3D6',ink:'#16394A',dy:.4,
  ears:`<path d="M9.4 7.4L11.2 2l2.600 4.200zM13.6 5.800L16 .6l2.400 5.200zM18.200 6.200L20.800 2l1.800 5.400z" fill="#FFB45E"/>`,
  face:`<ellipse cx="16" cy="21.3" rx="5.7" ry="4.1" fill="#C5EEF5"/><circle cx="14.2" cy="20" r=".8" fill="#2A7C8E"/><circle cx="17.8" cy="20" r=".8" fill="#2A7C8E"/><circle cx="23" cy="10.200" r="1.500" fill="#3FA5BA" opacity=".7"/><circle cx="8.800" cy="11.400" r="1" fill="#3FA5BA" opacity=".7"/>`,front:''},
 peng:{img:'canhcut',n:'Cánh cụt',c1:'#41507A',ink:'#1F2A48',dy:1.6,
  ears:`<ellipse cx="4.200" cy="19.500" rx="2.200" ry="4.600" fill="#41507A" transform="rotate(14 4.200 19.500)"/><ellipse cx="27.800" cy="19.500" rx="2.200" ry="4.600" fill="#41507A" transform="rotate(-14 27.800 19.500)"/>`,
  face:`<path d="M5.600 16.500c0-3.200 3.600-4.800 6.400-3.600l4 1.500 4-1.500c2.800-1.200 6.400.4 6.400 3.600 0 6-4.800 10.500-10.400 10.500S5.600 22.500 5.600 16.500z" fill="#fff"/><path d="M16 17.800l-2.300 2.200 2.300 1.900 2.300-1.900z" fill="#F5A623"/>`,front:'',nomouth:true}
};
const EY=(c)=>`<g class="ey x x-n"><g class="bl"><circle cx="11.700" cy="14.800" r="1.700" fill="${c}"/><circle cx="20.300" cy="14.800" r="1.700" fill="${c}"/><circle cx="12.300" cy="14.100" r=".6" fill="#fff"/><circle cx="20.900" cy="14.100" r=".6" fill="#fff"/></g></g>
<g class="x x-h"><path d="M9.900 15.600q1.800-2.600 3.600 0M18.500 15.600q1.800-2.600 3.600 0" stroke="${c}" stroke-width="1.200" fill="none" stroke-linecap="round"/></g>
<g class="x x-s"><path d="M9.900 14.800q1.800 2 3.600 0M18.500 14.800q1.800 2 3.600 0" stroke="${c}" stroke-width="1.100" fill="none" stroke-linecap="round"/></g>
<g class="x x-d"><circle cx="11.700" cy="15.200" r="1.600" fill="${c}"/><circle cx="20.300" cy="15.200" r="1.600" fill="${c}"/><circle cx="12.200" cy="14.600" r=".55" fill="#fff"/><circle cx="20.800" cy="14.600" r=".55" fill="#fff"/><path d="M9.600 12l3.600 1.100M22.400 12l-3.600 1.100" stroke="${c}" stroke-width=".9" stroke-linecap="round"/><path d="M12.500 17.500q.9 1.400 0 2.100-.9-.7 0-2.100z" fill="#7FC8FF"/></g>`;
const MO=(c,dy)=>`<g transform="translate(0,${dy})"><path class="x x-n" d="M14 22q2 1.800 4 0" stroke="${c}" stroke-width=".95" fill="none" stroke-linecap="round"/><path class="x x-h" d="M13.500 21.500q2.500 4.200 5 0z" fill="#D9475A" stroke="${c}" stroke-width=".8" stroke-linejoin="round"/><ellipse class="x x-s" cx="16" cy="22.500" rx="1" ry="1.200" fill="${c}"/><path class="x x-d" d="M14 23.200q2-1.900 4 0" stroke="${c}" stroke-width=".95" fill="none" stroke-linecap="round"/></g>`;
function charSvg(k){const C=CH[k]||CH.bear;if(C.img)return `<span class="chr-img"><img class="p p1" src="${C.img}-1.png" alt=""><img class="p p2" src="${C.img}-2.png" alt=""><img class="p p3" src="${C.img}-3.png" alt=""></span>`;
 return `<svg class="chr" viewBox="0 0 32 32" aria-hidden="true">${C.ears}<circle cx="16" cy="17" r="12" fill="${C.c1}"${C.stroke?` stroke="${C.stroke}" stroke-width=".7"`:''}/><ellipse cx="12.500" cy="9.500" rx="4" ry="2.300" fill="#fff" opacity=".22"/>${C.face}${EY(C.ink)}${C.nomouth?'':MO(C.ink,C.dy||0)}<ellipse cx="8.400" cy="19.600" rx="1.800" ry="1.300" fill="#FF8FB8" opacity=".5"/><ellipse cx="23.600" cy="19.600" rx="1.800" ry="1.300" fill="#FF8FB8" opacity=".5"/>${C.front}<text class="zz" x="23" y="8" font-size="6.500" font-weight="800" fill="#8B93C9" font-family="system-ui">z</text></svg>`}
function moodNow(){const t=S.last||0;return t&&Date.now()-t>36*36e5?'s':'n'}
function mood(m,ms){const a=document.querySelector('.av3d');if(!a)return;a.className='av3d m-'+m;if(ms)setTimeout(()=>{const b=document.querySelector('.av3d');if(b)b.className='av3d m-'+moodNow()},ms)}
function dartAll(){document.querySelectorAll('.hero .spark').forEach((el,i)=>{const a=(i/4)*6.283+Math.random()*.6,d=54+Math.random()*26;el.style.setProperty('--dx',Math.cos(a)*d+'px');el.style.setProperty('--dy',Math.sin(a)*d+'px');el.classList.remove('dart');void el.offsetWidth;el.classList.add('dart');setTimeout(()=>el.classList.remove('dart'),950)})}
function burst(){const w=document.querySelector('.avwrap');if(!w)return;const cols=['#FFC83D','#FF9FD0','#9FD2FF','#9BE3B8'];for(let i=0;i<10;i++){const e=document.createElement('span');e.className='bst';const a=i/10*6.283;e.style.cssText='--dx:'+Math.cos(a)*64+'px;--dy:'+Math.sin(a)*64+'px;color:'+cols[i%4];e.innerHTML=STAR;w.appendChild(e);setTimeout(()=>e.remove(),900)}}
function heroHtml(){const F=FAIRY[S.fairy]||FAIRY.star,m=moodNow(),f=F.svg;
 return `<div class="hero ${F.c} ${m==='s'?'sleepy':''}" id="hero"><div class="avwrap"><div class="orbit o2"><span class="spark s1">${f}</span><span class="spark s3">${f}</span></div><div class="orbit"><span class="spark s1">${f}</span><span class="spark s2">${f}</span><span class="spark s3">${f}</span><span class="spark s4">${f}</span></div><div class="av3d m-${m}">${charSvg(S.char)}</div></div></div>`}
function pickChar(){
 let c=S.char||'bear',fr=S.fairy||'star',nm=S.name||DEFNAME;
 const o=document.createElement('div');o.className='kp';
 const draw=()=>{o.innerHTML=`<div class="ks"><h3>Chọn bạn đồng hành</h3><p class="ksub">Bạn nhỏ này sẽ cùng học với bạn mỗi ngày.</p><div class="kg">${Object.keys(CH).map(k=>`<button class="kc ${k===c?'on':''}" data-c="${k}"><span class="av3d m-n" style="position:static;display:block;background:none;box-shadow:none;width:100%">${charSvg(k)}</span>${CH[k].n}</button>`).join('')}</div><div class="kl">Tinh linh bay quanh</div><div class="kg fg">${Object.keys(FAIRY).map(k=>`<button class="kc fc ${k===fr?'on':''}" data-f="${k}"><span class="fi hero ${FAIRY[k].c}" style="display:block;position:static;margin:0;color:${k==='star'?'#FFC83D':''}"><span class="spark" style="position:static;display:block;width:30px;height:30px;animation:none">${FAIRY[k].svg}</span></span>${FAIRY[k].n}</button>`).join('')}</div><div class="kl">Tên của bạn</div><input type="text" id="kpn" maxlength="20" value="${esc(nm)}"><div class="row"><button class="btn sec" id="kpc">Huỷ</button><button class="btn" id="kpo">Xong</button></div></div>`;
  o.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{nm=o.querySelector('#kpn').value;c=b.dataset.c;draw()});
  o.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{nm=o.querySelector('#kpn').value;fr=b.dataset.f;draw()});
  o.querySelector('#kpc').onclick=()=>o.remove();
  o.querySelector('#kpo').onclick=()=>{S.char=c;S.fairy=fr;S.name=o.querySelector('#kpn').value.trim()||DEFNAME;persistS();o.remove();home();setTimeout(()=>{mood('h',1800);burst()},60);toast('Chào '+S.name+'!')};
  o.onclick=e=>{if(e.target===o)o.remove()};
 };
 draw();document.body.appendChild(o);
}
const hydrate=()=>document.querySelectorAll('[data-ic]').forEach(e=>{e.outerHTML=I[e.dataset.ic]});

const $=s=>document.querySelector(s);
const load=(k,d)=>{try{return JSON.parse(localStorage.getItem(profileKey(k)))??d}catch{return d}};
const save=(k,v)=>{try{localStorage.setItem(profileKey(k),JSON.stringify(v))}catch{}};
const norm=it=>Array.isArray(it)?{w:it[0],m:it[1],ex:''}:it;
let lessons=(load('lessons',null)||[{id:1,title:'Mẫu: Chào hỏi',a:'cs',b:'vi',items:[['Dobrý den','Xin chào'],['Děkuji','Cảm ơn'],['Prosím','Làm ơn / Xin mời'],['Na shledanou','Tạm biệt'],['Jak se máte?','Bạn khỏe không?'],['Nerozumím','Tôi không hiểu']]}]);
lessons.forEach(l=>l.items=l.items.map(norm));
let pendingEx={};
let S=Object.assign({loop:false,batAsked:false,say:'both',order:'cs',name:DEFNAME,char:'bear',fairy:'star',last:0,days:[],bd:[],lastId:0,srv:'',tok:'',rate:1,rep:1,gap:1,ex:false,lang:'cs',voices:{}},load('settings',{}));
if(S.rep>3)S.rep=3;
if(!S.tok&&!TYNA)S.tok='nghe-9ce853e98f5c';
if(!S.srv&&window.Capacitor&&Capacitor.isNativePlatform&&Capacitor.isNativePlatform())S.srv='https://nghe-tu-vung.onrender.com';
let cur=null,playing=false,token=0,idx=-1,voicesList=[],mode='cards',fc={i:0,flip:false,order:null},editIt=null,filter='all',sel=null;
const persist=()=>{save('lessons',lessons);if(typeof schedulePush==='function')schedulePush()},persistS=()=>save('settings',S);

// ---------- Đồng bộ từ vựng từ Google Sheet ----------
const SHEET_ID='1Frm1ooddUFjFST6kHQmBKfd9Hnv_u5gvfgE3ndfBCG0',SHEET_GID='0';
function csvParse(t){const rows=[];let r=[],f='',q=false;t=t.replace(/^﻿/,'');
  for(let i=0;i<t.length;i++){const c=t[i];
    if(q){if(c==='"'){if(t[i+1]==='"'){f+='"';i++}else q=false}else f+=c}
    else if(c==='"')q=true;
    else if(c===','){r.push(f);f=''}
    else if(c==='\n'||c==='\r'){if(c==='\r'&&t[i+1]==='\n')i++;r.push(f);f='';rows.push(r);r=[]}
    else f+=c}
  if(f!==''||r.length){r.push(f);rows.push(r)}
  return rows.filter(x=>x.some(v=>String(v).trim()))}
async function sheetText(){
  const urls=[`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${SHEET_GID}`,`https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${SHEET_GID}`];
  let err;for(const u of urls){try{const r=await fetch(u,{cache:'no-store'});if(!r.ok)throw new Error('HTTP '+r.status);const t=await r.text();if(/^\s*<(!doctype|html)/i.test(t))throw new Error('Sheet chưa được chia sẻ công khai');return t}catch(e){err=e}}
  throw err}
function hashId(s){let h=7;for(const c of s)h=(h*31+c.charCodeAt(0))>>>0;return 1000000+h%900000000}
function sheetToLessons(rows){const out=new Map();
  rows.slice(1).forEach(r=>{const [title,a,b,w,m,...ex]=r.map(x=>String(x||'').trim());
    if(!title||!w)return;const la=(a||'cs').toLowerCase(),lb=(b||'vi').toLowerCase();
    if(!LANGS[la])return;
    const k=title+'|'+la;if(!out.has(k))out.set(k,{id:hashId(k),title,a:la,b:lb,sheet:true,items:[]});
    out.get(k).items.push({w,m:m||'',ex:ex.filter(Boolean).join(', ')})});
  return [...out.values()]}
// ---- Cầu nối Google Sheet: đọc + ghi hai chiều ----
const BRIDGE=TYNA?'':'https://script.google.com/macros/s/AKfycbyfjpFinRbigdNHqRpLOzzAwWq9yiGQiUcaQLXC4ds6bYCMLp5H_w1TqoYGptkQYGau/exec',BKEY_EMBED='',SNAPK='snap',SEP='\u0001';
var pushT=0,pushing=false;
const bkey=()=>S.bkey||BKEY_EMBED;
const isSample=l=>l.id===1&&l.title==='Mẫu: Chào hỏi';
function rowsOf(list){const m=new Map();
  list.forEach(l=>{if(isSample(l))return;const t=String(l.title||'').trim(),a=l.a||'cs';
    l.items.forEach(it=>{const w=String(it.w||'').trim();if(!w)return;
      m.set([t,a,w].join(SEP),{title:t,a,b:l.b||'vi',w,m:String(it.m||'').trim(),ex:String(it.ex||'').trim()})})});
  return m}
const sigOf=r=>r.b+'\t'+r.m+'\t'+r.ex;
function saveSnap(map){const o={};map.forEach((r,k)=>o[k]=sigOf(r));save(SNAPK,o)}
function diffOps(){const snap=load(SNAPK,null);if(snap===null)return null;
  const cur=rowsOf(lessons),ops=[];
  cur.forEach((r,k)=>{if(snap[k]!==sigOf(r))ops.push(Object.assign({op:'upsert'},r))});
  Object.keys(snap).forEach(k=>{if(!cur.has(k)){const [t,a,w]=k.split(SEP);ops.push({op:'delete',title:t,a,w})}});
  return ops}
function schedulePush(){clearTimeout(pushT);pushT=setTimeout(()=>pushNow(false),1500)}
async function pushNow(manual){
  if(pushing||!BRIDGE||!bkey())return 0;
  const ops=diffOps();if(!ops||!ops.length)return 0;
  pushing=true;
  try{
    for(let i=0;i<ops.length;i+=250){
      const r=await fetch(BRIDGE,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({key:bkey(),ops:ops.slice(i,i+250)})});
      const j=await r.json();if(!j.ok)throw new Error(j.error||'lỗi cầu nối')}
    saveSnap(rowsOf(lessons));
    if(manual)toast(`Đã lưu ${ops.length} thay đổi lên Google Sheet`);
    return ops.length}
  catch(e){if(manual)toast('Chưa lưu được lên Sheet: '+(e&&e.message||e));return -1}
  finally{pushing=false}}
async function sheetRows(){
  if(BRIDGE){try{const r=await fetch(BRIDGE+'?action=read&t='+Date.now(),{cache:'no-store'});const j=await r.json();
    if(!j.ok)throw new Error(j.error||'lỗi cầu nối');return j.rows}catch(e){var be=e}}
  try{return csvParse(await sheetText())}catch(e){throw be||e}}
let syncing=false;
async function syncSheet(manual){
  if(TYNA||syncing)return;syncing=true;
  try{
    await pushNow(false);                       // đẩy thay đổi còn dở trước khi kéo về
    const rows=await sheetRows(),fresh=sheetToLessons(rows);
    if(!fresh.length){                          // Sheet trống: giữ dữ liệu trong máy và đẩy lên
      save(SNAPK,{});const n=await pushNow(manual);
      if(manual&&!n)toast('Sheet chưa có từ nào');
      syncing=false;return}
    const byKey=new Map(lessons.filter(l=>!isSample(l)).map(l=>[String(l.title||'').trim()+'|'+(l.a||'cs'),l]));
    fresh.forEach(l=>{const o=byKey.get(l.title+'|'+l.a);if(!o)return;
      const km=new Map(o.items.map(x=>[String(x.w||'').trim(),x]));
      l.items.forEach(it=>{const p=km.get(it.w);if(p)Object.keys(p).forEach(k=>{if(!(k in it))it[k]=p[k]})});
      ['grammar','stories'].forEach(k=>{if(o[k])l[k]=o[k]})});
    const fk=new Map(fresh.map(l=>[l.title+'|'+l.a,l]));
    const next=[];
    lessons.forEach(l=>{if(isSample(l))return;
      const k=String(l.title||'').trim()+'|'+(l.a||'cs'),f=fk.get(k);
      if(f){next.push(f);fk.delete(k)}else if(!l.sheet)next.push(l)});   // bài chỉ có trong máy thì giữ lại, sẽ đẩy lên
    fk.forEach(f=>next.push(f));
    lessons=next;
    saveSnap(rowsOf(fresh));                    // mốc = đúng nội dung Sheet vừa kéo
    save('lessons',lessons);
    const n=await pushNow(false);               // bài chỉ có trong máy → đẩy lên Sheet
    if(!cur)home();
    if(manual)toast(n>0?`Đã đồng bộ, lưu thêm ${n} thay đổi lên Sheet`:`Đã đồng bộ ${fresh.length} bài từ Google Sheet`)}
  catch(e){if(manual)toast('Không đồng bộ được: '+(e&&e.message||e))}
  syncing=false}
function toast(m){const t=$('#toast');t.textContent=m;t.style.display='block';clearTimeout(toast.h);toast.h=setTimeout(()=>t.style.display='none',2800)}
function esc(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}

