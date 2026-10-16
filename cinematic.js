(()=>{
const walk=document.querySelector('#walk'),stage=walk.querySelector('.walk-stage');
const stops=[{id:8,word:'ARRIVE',image:'assets/hero-8.webp'},{id:9,word:'INHABIT',image:'assets/hero-9.webp'},{id:4,word:'WANDER',image:'assets/hero-4.webp'},{id:6,word:'REFLECT',image:'assets/hero-6.webp'},{id:15,word:'CONNECT',image:'assets/hero-15.webp'}];
const scene=document.createElement('div');scene.className='spatial-scene';scene.setAttribute('aria-hidden','true');scene.innerHTML=`<div class="spatial-camera"><div class="spatial-floor"></div>${stops.map((s,i)=>`<div class="spatial-room" style="--room:${i}"><div class="room-number">${String(i+1).padStart(2,'0')}</div><div class="room-outline"></div><div class="room-main"><img src="${s.image}" alt=""></div><div class="room-wing room-left"><img src="${stops[(i+4)%5].image}" alt=""></div><div class="room-wing room-right"><img src="${stops[(i+1)%5].image}" alt=""></div><span class="room-word">${s.word}</span></div>`).join('')}</div>`;
stage.prepend(scene);walk.classList.add('spatial-enabled');
const camera=scene.querySelector('.spatial-camera'),rooms=[...scene.querySelectorAll('.spatial-room')];let raf=0,mouseX=0,mouseY=0;
const clamp=(n,a=0,b=1)=>Math.min(b,Math.max(a,n));const ease=t=>t*t*(3-2*t);const off=()=>matchMedia('(prefers-reduced-motion: reduce)').matches||document.documentElement.classList.contains('motion-paused');
const evolution=document.querySelector('#evolution'),evoStage=evolution.querySelector('.evolution-stage'),plan=evolution.querySelector('.evolution-plan'),render=evolution.querySelector('.evolution-render');
function draw(){raf=0;const disabled=off();const wr=walk.getBoundingClientRect(),progress=clamp(-wr.top/Math.max(1,walk.offsetHeight-stage.offsetHeight));const travel=progress*5,index=Math.min(4,Math.floor(travel)),local=travel-index;
 scene.classList.toggle('still-scene',disabled);
 if(disabled){camera.style.transform='none';rooms.forEach((r,i)=>{r.style.opacity=i===index?'1':'0';r.style.transform='translate3d(0,0,0)';});}
 else{
  camera.style.transform=`translate3d(${mouseX*12}px,${mouseY*8}px,${travel*1500}px)`;
  rooms.forEach((room,i)=>{const relative=travel-i;room.style.opacity=relative>1.05?'0':String(clamp((relative+1.3)*.8));room.style.transform=`translate3d(0,0,${-i*1500-850}px)`;room.querySelector('.room-main').style.transform=`rotateY(${(i%2===0?1:-1)*(1-clamp(relative))*7}deg)`;});
 }
 stage.style.setProperty('--room-tint',index%2?'#32291e':'#18291e');
 // The large lettering travels separately from the image planes.
 const word=rooms[index].querySelector('.room-word');word.style.transform=`translateX(${disabled?0:(.5-local)*75}px)`;
 const er=evolution.getBoundingClientRect(),ep=clamp(-er.top/Math.max(1,evolution.offsetHeight-evoStage.offsetHeight));const unfold=ease(clamp(ep/.6)),reveal=ease(clamp((ep-.48)/.42));
 if(disabled){plan.style.transform='none';plan.style.opacity=ep<.5?'1':'0';render.style.transform='none';render.style.clipPath='none';render.style.opacity=ep>=.5?'1':'0';}
 else{plan.style.transform=`perspective(1300px) rotateX(${58*(1-unfold)}deg) rotateZ(${-24*(1-unfold)}deg) translateY(${35*(1-unfold)}px) scale(${.78+.22*unfold})`;plan.style.opacity=String(1-reveal);render.style.transform=`scale(${1.12-.12*reveal})`;render.style.opacity='1';render.style.clipPath=`inset(${(1-reveal)*100}% 0 0 0)`;}
 evolution.querySelector('.evolution-grid').style.transform=`perspective(900px) rotateX(${disabled?0:58*(1-unfold)}deg) rotateZ(${disabled?0:-24*(1-unfold)}deg)`;
 const label=ep<.3?'DRAWING THE SPACE':ep<.7?'CHANGING PERSPECTIVE':'ENTERING THE GARDEN';document.querySelector('#evolution-state').textContent=label;evolution.querySelectorAll('.evolution-phases span').forEach((el,i)=>el.classList.toggle('active',i===(ep<.3?0:ep<.7?1:2)));evolution.querySelector('.evolution-progress i').style.transform=`scaleX(${ep})`;
}
function request(){if(!raf)raf=requestAnimationFrame(draw)}
window.addEventListener('scroll',request,{passive:true});window.addEventListener('resize',request);new MutationObserver(request).observe(document.documentElement,{attributes:true,attributeFilter:['class']});
if(matchMedia('(pointer:fine)').matches)stage.addEventListener('pointermove',e=>{mouseX=(e.clientX/innerWidth-.5);mouseY=(e.clientY/innerHeight-.5);request()});
// Give the beginning of the site a visible, slow atmospheric motion before scrolling.
const hero=document.querySelector('.hero');const veil=document.createElement('div');veil.className='light-sweep';veil.setAttribute('aria-hidden','true');hero.append(veil);
const strip=document.createElement('div');strip.className='studio-ribbon';strip.setAttribute('aria-hidden','true');strip.innerHTML='<div>'+Array(4).fill('ARCHITECTURE <i>↗</i> INTERIORS <i>↗</i> LANDSCAPES <i>↗</i> ').join('')+'</div>';document.querySelector('#journey').after(strip);
request();
})();
