const D=window.PORTFOLIO,$=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const CATS={all:'All',robotics:'Robotics',cv:'Computer vision',ai:'AI / ML',data:'Data',tools:'Software tools'};
let cat='all',q='';
/* ---------- static links ---------- */
['resume1','resume2'].forEach(i=>$('#'+i).href=D.resume);
$('#mail').href='mailto:'+D.email;$('#li').href=D.linkedin;$('#gh').href=D.github;
$('#leadlist').insertAdjacentHTML('beforeend',D.leadership.map(l=>`<li><b>${esc(l.t)}</b><span>${esc(l.d)}</span></li>`).join(''));
$('#copy').onclick=async()=>{try{await navigator.clipboard.writeText(D.email);$('#msg').textContent='Copied '+D.email}catch{$('#msg').textContent='Copy failed — email: '+D.email}};
/* ---------- project explorer ---------- */
function drawProjects(open){
  const t=q.trim().toLowerCase();
  const list=D.projects.filter(p=>(cat==='all'||p.cat===cat)&&(!t||[p.name,p.summary,p.built,p.tech.join(' ')].join(' ').toLowerCase().includes(t)));
  $('#count').textContent=list.length+' / '+D.projects.length;$('#none').hidden=list.length>0;
  $('#filters').innerHTML=Object.entries(CATS).map(([k,v])=>`<button type="button" data-c="${k}" aria-pressed="${k===cat}">${v}</button>`).join('');
  $('#plist').innerHTML=list.map(p=>{
    const row=(k,v)=>v?`<dt>${k}</dt><dd>${esc(v)}</dd>`:'';
    return `<li class="proj${p.featured?' feat':''}" id="p-${p.id}" data-cat="${p.cat}"><details${open===p.id?' open':''}><summary><span class="n">${p.id}</span><span class="t">${esc(p.name)}</span><span class="m">${CATS[p.cat]} · ${esc(p.status)}</span></summary><div class="body"><p>${esc(p.summary)}</p><dl>${row('Problem',p.problem)}${row('What I built',p.built)}${row('Results',p.results)}${row('Limits',p.limits)}</dl><div class="chips">${p.tech.map(x=>`<span>${esc(x)}</span>`).join('')}</div><p>${p.links.map(l=>`<a href="${l[1]}" rel="noopener">${esc(l[0])} ↗</a>`).join(' &nbsp; ')||'<span class="mono">No public link yet</span>'}</p></div></details></li>`}).join('');
}
$('#filters').onclick=e=>{const b=e.target.closest('button');if(b){cat=b.dataset.c;drawProjects()}};
$('#search').oninput=e=>{q=e.target.value;drawProjects()};
function find(term,c){cat=c||'all';q=term;$('#search').value=term;drawProjects();$('#work').scrollIntoView();}
drawProjects();
/* ---------- skills map ---------- */
$('#skillmap').innerHTML=Object.entries(D.skills).map(([g,a])=>`<div><h3>${esc(g)}</h3>${a.map(s=>`<button type="button" data-s="${esc(s)}">${esc(s)}</button>`).join('')}</div>`).join('');
$('#skillmap').onclick=e=>{const b=e.target.closest('button');if(b)find(b.dataset.s)};
/* ---------- differential-drive simulation ---------- */
const cv=$('#cv'),g=cv.getContext('2d'),W=cv.width,H=cv.height,S=80,L=0.4,R=0.08; // px/m, track width m, wheel radius m
const WM=W/S,HM=H/S;let st,trail,playing,last;
const ink='#171C1B',cu='#8A4B30',bl='#597A8C',gr='#C9CCC4';
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
function reset(){st={x:WM/2,y:HM/2,th:0};trail=[];last=null;playing=!reduce;$('#play').textContent=playing?'Pause':'Play';draw();}
const P=()=>({v:+$('#sv').value,w:+$('#sw').value,k:+$('#sk').value});
function step(dt){const{v,w,k}=P();dt*=k;
  st.th+=w*dt;st.x+=v*Math.cos(st.th)*dt;st.y+=v*Math.sin(st.th)*dt; // dx=v cosθ dt, dy=v sinθ dt, dθ=ω dt
  st.x=Math.min(WM-.2,Math.max(.2,st.x));st.y=Math.min(HM-.2,Math.max(.2,st.y)); // arena walls
  trail.push([st.x,st.y]);if(trail.length>1800)trail.shift();}
function draw(){const{v,w}=P();g.clearRect(0,0,W,H);g.lineWidth=1;g.strokeStyle=gr;g.font='10px ui-monospace,monospace';g.fillStyle=bl;
  for(let i=0;i<=WM;i++){g.beginPath();g.moveTo(i*S,0);g.lineTo(i*S,H);g.stroke();if(i<WM)g.fillText(i+' m',i*S+3,H-4)}
  for(let j=0;j<=HM;j++){g.beginPath();g.moveTo(0,j*S);g.lineTo(W,j*S);g.stroke()}
  g.strokeStyle=cu;g.lineWidth=1.5;g.beginPath();trail.forEach((p,i)=>i?g.lineTo(p[0]*S,p[1]*S):g.moveTo(p[0]*S,p[1]*S));g.stroke();
  g.save();g.translate(st.x*S,st.y*S);g.rotate(st.th);g.strokeStyle=ink;g.lineWidth=2;g.fillStyle='#F8F6F0';
  g.fillRect(-18,-L*S/2,36,L*S);g.strokeRect(-18,-L*S/2,36,L*S);g.fillStyle=ink;
  [-1,1].forEach(s=>g.fillRect(-9,s*L*S/2-(s>0?0:5)-(s>0?2.5:0),18,5)); // wheels
  g.lineWidth=2;g.strokeStyle='#C0392B';g.beginPath();g.moveTo(0,0);g.lineTo(34,0);g.stroke();g.strokeStyle=bl;g.beginPath();g.moveTo(0,0);g.lineTo(0,34);g.stroke();g.restore();
  const vl=v-w*L/2,vr=v+w*L/2,deg=((st.th*180/Math.PI)%360+360)%360;
  $('#ov').textContent=v.toFixed(2)+' m/s';$('#ow').textContent=w.toFixed(2)+' rad/s';$('#ok').textContent=P().k;
  $('#tel').textContent=`x ${st.x.toFixed(2)} m   y ${st.y.toFixed(2)} m   θ ${deg.toFixed(0)}°\nv_L ${vl.toFixed(2)}  v_R ${vr.toFixed(2)} m/s   ${Math.abs(w)>.01&&Math.abs(v)>.01?'turn radius '+Math.abs(v/w).toFixed(2)+' m':'v_R = v + ωL/2, v_L = v − ωL/2'}`;}
function loop(t){if(playing){if(last!==null)step(Math.min((t-last)/1000,.05));last=t;draw()}else last=null;requestAnimationFrame(loop)}
['sv','sw','sk'].forEach(i=>$('#'+i).addEventListener('input',draw));
$('#play').onclick=()=>{playing=!playing;$('#play').textContent=playing?'Pause':'Play'};$('#reset').onclick=reset;
reset();requestAnimationFrame(loop);
/* ---------- command palette ---------- */
const go=id=>()=>$(id).scrollIntoView(),open_=u=>()=>window.open(u,'_blank','noopener');
const CMDS=[['Open selected projects',go('#work')],['Search technical skills',go('#skills')],['View resume',open_(D.resume)],['Jump to robotics projects',()=>find('','robotics')],['Jump to computer vision projects',()=>find('','cv')],['Open LinkedIn',open_(D.linkedin)],['Open GitHub',open_(D.github)],['Go to contact',go('#contact')]];
const pal=$('#pal');let sel=0,shown=CMDS;
function drawPal(){const t=$('#pq').value.toLowerCase();shown=CMDS.filter(c=>c[0].toLowerCase().includes(t));sel=Math.min(sel,Math.max(0,shown.length-1));
  $('#pl').innerHTML=shown.map((c,i)=>`<li role="option" data-i="${i}" aria-selected="${i===sel}">${c[0]}</li>`).join('')||'<li>No command found</li>';}
function openPal(){$('#pq').value='';sel=0;drawPal();pal.showModal();$('#pq').focus()}
function run(i){const c=shown[i];if(c){pal.close();c[1]()}}
addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();pal.open?pal.close():openPal()}});
$('#kbtn').onclick=openPal;$('#pq').oninput=drawPal;
$('#pq').onkeydown=e=>{if(e.key==='ArrowDown'){e.preventDefault();sel=(sel+1)%Math.max(1,shown.length);drawPal()}else if(e.key==='ArrowUp'){e.preventDefault();sel=(sel-1+shown.length)%Math.max(1,shown.length);drawPal()}else if(e.key==='Enter')run(sel)};
$('#pl').onclick=e=>{const li=e.target.closest('li[data-i]');if(li)run(+li.dataset.i)};
pal.addEventListener('click',e=>{if(e.target===pal)pal.close()});
