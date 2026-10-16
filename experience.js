/* A spatial entrance and scroll narrative for every project. */
(()=>{
const dialog=document.querySelector('#project-dialog'),detail=document.querySelector('#detail');
const motionOff=()=>matchMedia('(prefers-reduced-motion: reduce)').matches||document.documentElement.classList.contains('motion-paused');
const originalOpen=openProject;let frame=0,previousStep=-1,returnTarget=null;
openProject=function(id,trigger){
 const p=projects.find(p=>p.id===id);if(!p)return;
 const origin=trigger?.querySelector('img')||trigger;const rect=origin?.getBoundingClientRect();
 if(!dialog.open)returnTarget=trigger||document.activeElement;
 originalOpen(id);dialog.classList.add('immersive-project');
 const hero=detail.querySelector('.detail-hero');const entry=document.createElement('section');entry.className='project-entry';entry.id='project-arrival';hero.replaceWith(entry);
 entry.innerHTML=`<div class="entry-stage"><img class="entry-image" src="${p.hero}" alt="${p.title}"><div class="entry-shade"></div><div class="entry-lines" aria-hidden="true"></div><div class="entry-title"><p class="eyebrow">ENTERING / ${p.category.toUpperCase()}</p><h2>${p.title}</h2><p>${p.subtitle}</p><button data-room="project-story">Walk into the project <span>↓</span></button></div><div class="entry-bottom"><span>SCROLL TO STEP INSIDE</span><span>MOHAMMED JASHIM / ${String(id+1).padStart(2,'0')}</span></div></div>`;
 const body=detail.querySelector('.detail-content');body.id='project-story';
 const route=document.createElement('nav');route.className='project-route';route.setAttribute('aria-label','Inside this project');route.innerHTML=`<span>${p.title}</span><div><button data-room="project-arrival">Arrival</button><button data-room="project-story">Story</button><button data-room="project-walk">Walkthrough</button><button data-room="project-palette">Palette</button><button data-room="project-sheets">Drawings & views</button></div><i></i>`;entry.after(route);
 const mood=body.querySelector('.moodboard');mood.id='project-palette';body.querySelector('.gallery').id='project-sheets';
 const tour=document.createElement('section');tour.id='project-walk';tour.className='project-walk';
 const views=p.gallery.slice(0,5);tour.innerHTML=`<div class="project-view-stage"><div class="view-heading"><p class="eyebrow">MOVE THROUGH THE PROJECT</p><span class="view-counter">01 / ${String(views.length).padStart(2,'0')}</span></div><div class="view-images">${views.map((url,i)=>`<button data-image="${i}" class="tour-view" aria-label="Enlarge project view ${i+1}"><img src="${url}" alt="${p.title} — original portfolio sheet ${i+1}"><span>LOOK CLOSER ＋</span></button>`).join('')}</div><div class="view-caption"><span>VIEWS, SPACES & DETAILS</span><span>SCROLL TO CONTINUE ↓</span></div><div class="view-ticks">${views.map((_,i)=>`<button data-view-step="${i}" aria-label="Go to project view ${i+1}"></button>`).join('')}</div></div>`;
 tour.style.setProperty('--view-count',Math.max(2,views.length));body.querySelector('.detail-intro').after(tour);
 const next=body.querySelector('.next-project'),nextP=projects[(id+1)%projects.length];next.innerHTML=`<img src="${nextP.hero}" alt="${nextP.title}"><span><small>YOUR NEXT DESTINATION</small><strong>${nextP.title}</strong><b>Step into the next project ↗</b></span>`;
 previousStep=-1;dialog.scrollTop=0;update();
 if(!motionOff()){
  const portal=document.createElement('div');portal.className='project-portal';portal.innerHTML=`<img src="${p.hero}" alt="">`;dialog.append(portal);
  const valid=rect&&rect.width>0&&rect.top<innerHeight&&rect.bottom>0;
  const from=valid?{left:rect.left+'px',top:rect.top+'px',width:rect.width+'px',height:rect.height+'px',opacity:1,borderRadius:'3px'}:{left:'10vw',top:'15vh',width:'80vw',height:'70vh',opacity:0,borderRadius:'8px'};
  portal.animate([from,{left:'0px',top:'0px',width:'100vw',height:'100dvh',opacity:1,borderRadius:'0px'}],{duration:850,easing:'cubic-bezier(.16,1,.3,1)',fill:'forwards'}).finished.then(()=>{portal.animate([{opacity:1},{opacity:0}],{duration:350,fill:'forwards'}).finished.then(()=>portal.remove())});
  entry.querySelector('.entry-title').animate([{opacity:0,transform:'translateY(45px)'},{opacity:1,transform:'translateY(0)'}],{duration:1000,delay:650,fill:'backwards',easing:'cubic-bezier(.2,.7,.3,1)'});
 }
};
function relativeTop(el){return el.getBoundingClientRect().top-dialog.getBoundingClientRect().top+dialog.scrollTop}
function scrollRoom(id){const el=document.getElementById(id);if(el)dialog.scrollTo({top:relativeTop(el)-110,behavior:motionOff()?'instant':'smooth'})}
dialog.addEventListener('click',e=>{const room=e.target.closest('[data-room]'),step=e.target.closest('[data-view-step]');if(room)scrollRoom(room.dataset.room);if(step){const t=detail.querySelector('.project-walk'),range=t.offsetHeight-t.querySelector('.project-view-stage').offsetHeight;dialog.scrollTo({top:relativeTop(t)+range*(Number(step.dataset.viewStep)/(Math.max(1,detail.querySelectorAll('.tour-view').length-1))),behavior:motionOff()?'instant':'smooth'})}});
function update(){frame=0;if(!dialog.open||!dialog.classList.contains('immersive-project'))return;
 const entry=detail.querySelector('.project-entry');if(!entry)return;
 const travel=Math.max(0,Math.min(1,dialog.scrollTop/(entry.offsetHeight-innerHeight*.4)));
 entry.querySelector('.entry-image').style.transform=motionOff()?'none':`scale(${1+travel*.38}) translateY(${travel*3}%)`;
 entry.querySelector('.entry-title').style.opacity=motionOff()?1:Math.max(0,1-travel*1.5);
 entry.querySelector('.entry-lines').style.transform=motionOff()?'none':`scale(${1+travel*.8})`;
 const route=detail.querySelector('.project-route');route.querySelector('i').style.transform=`scaleX(${dialog.scrollTop/Math.max(1,dialog.scrollHeight-dialog.clientHeight)})`;
 const tour=detail.querySelector('.project-walk'),stage=tour.querySelector('.project-view-stage'),views=[...tour.querySelectorAll('.tour-view')];const range=tour.offsetHeight-stage.offsetHeight;
 const progress=Math.max(0,Math.min(1,(dialog.scrollTop-relativeTop(tour))/Math.max(1,range)));const n=Math.min(views.length-1,Math.floor(progress*views.length));
 views.forEach((v,i)=>{v.classList.toggle('active',i===n);v.setAttribute('aria-hidden',String(i!==n));v.tabIndex=i===n?0:-1;v.style.transform=motionOff()?'none':`perspective(1400px) rotateY(${i===n?(1-Math.min(1,(progress*views.length-n)*3))*-9:0}deg) translateX(${i===n?(1-Math.min(1,(progress*views.length-n)*3))*3:0}%) scale(${i===n?.96+Math.min(1,(progress*views.length-n)*3)*.04:1})`});
 if(previousStep!==n){previousStep=n;tour.querySelector('.view-counter').textContent=`${String(n+1).padStart(2,'0')} / ${String(views.length).padStart(2,'0')}`;tour.querySelectorAll('[data-view-step]').forEach((b,i)=>{b.classList.toggle('active',i===n);b.setAttribute('aria-pressed',String(i===n))})}
 let current='project-arrival';for(const id of ['project-arrival','project-story','project-walk','project-palette','project-sheets']){if(relativeTop(document.getElementById(id))<=dialog.scrollTop+innerHeight*.4)current=id}route.querySelectorAll('[data-room]').forEach(b=>{b.classList.toggle('active',b.dataset.room===current);b.setAttribute('aria-current',b.dataset.room===current?'location':'false')});
}
dialog.addEventListener('scroll',()=>{if(!frame)frame=requestAnimationFrame(update)},{passive:true});window.addEventListener('resize',update);
const originalDrawings=drawings;drawings=function(){dialog.classList.remove('immersive-project');originalDrawings()};document.querySelector('#drawing-open').onclick=drawings;document.querySelector('#drawing-preview').onclick=drawings;
dialog.addEventListener('close',()=>{dialog.classList.remove('immersive-project');returnTarget?.focus?.({preventScroll:true})});
// Pointer depth is intentionally limited to fine pointers; touch scrolling stays native.
if(matchMedia('(hover:hover) and (pointer:fine)').matches){document.addEventListener('pointermove',e=>{const card=e.target.closest('.project-card');if(!card||motionOff())return;const image=card.querySelector('.card-image'),r=image.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;image.style.transform=`perspective(1000px) rotateX(${-y*5}deg) rotateY(${x*6}deg)`});document.addEventListener('pointerout',e=>{const card=e.target.closest('.project-card');if(card&&!card.contains(e.relatedTarget))card.querySelector('.card-image').style.transform=''})}
if(location.hash.startsWith('#project-'))openProject(Number(location.hash.replace('#project-','')));
})();
