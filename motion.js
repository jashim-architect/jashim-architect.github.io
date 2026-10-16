/* Scroll-driven architectural promenade. Native scrolling is preserved. */
(()=>{
const walk=document.querySelector('#walk'),stage=walk.querySelector('.walk-stage');
const chapters=[
 {id:8,label:'01 / ARRIVE',title:'Cross the<br><em>threshold.</em>',text:'A home begins before the front door. Approach through light, proportion and shade.',image:'assets/hero-8.webp'},
 {id:9,label:'02 / INHABIT',title:'Step into<br><em>the atmosphere.</em>',text:'Move closer. Warm textures, layered light and quiet detail turn a room into an experience.',image:'assets/hero-9.webp'},
 {id:4,label:'03 / WANDER',title:'Let the path<br><em>unfold.</em>',text:'Follow curved timber paths between sculptural trees, reflected light and water.',image:'assets/hero-4.webp'},
 {id:6,label:'04 / REFLECT',title:'Walk across<br><em>the reflections.</em>',text:'A floating path brings a new perspective to the water. Pause, look closer, continue.',image:'assets/hero-6.webp'},
 {id:15,label:'05 / CONNECT',title:'Return to<br><em>the city.</em>',text:'Architecture meets everyday life. Public spaces connect people and make journeys possible.',image:'assets/hero-15.webp'}
];
const reduced=matchMedia('(prefers-reduced-motion: reduce)');let paused=reduced.matches,index=-1,scheduled=false;
walk.querySelector('.walk-scenes').innerHTML=chapters.map((c,i)=>`<img src="${c.image}" alt="${c.text}" class="walk-scene" ${i?'loading="lazy"':''}>`).join('');
walk.querySelector('.walk-stops').innerHTML=chapters.map((c,i)=>`<button aria-label="Go to ${c.label.slice(5)}" data-stop="${i}"><span>${String(i+1).padStart(2,'0')}</span></button>`).join('');
const scenes=[...walk.querySelectorAll('.walk-scene')],stops=[...walk.querySelectorAll('[data-stop]')],copy=walk.querySelector('.walk-copy');
function select(n){if(n===index)return;index=n;const c=chapters[n];document.querySelector('#walk-kicker').textContent=c.label;document.querySelector('#walk-title').innerHTML=c.title;document.querySelector('#walk-description').textContent=c.text;document.querySelector('#walk-enter').dataset.project=c.id;document.querySelector('#walk-position').textContent=`${String(n+1).padStart(2,'0')} / 05`;stops.forEach((s,i)=>{s.classList.toggle('active',i===n);s.setAttribute('aria-current',i===n?'step':'false')});if(!paused)copy.animate([{opacity:0,transform:'translateY(calc(-35% + 26px))'},{opacity:1,transform:'translateY(-35%)'}],{duration:700,easing:'cubic-bezier(.2,.7,.3,1)'});}
function update(){scheduled=false;const rect=walk.getBoundingClientRect(),range=walk.offsetHeight-stage.offsetHeight;const progress=Math.max(0,Math.min(1,-rect.top/Math.max(1,range)));const n=Math.min(4,Math.floor(progress*5));const local=progress===1?1:progress*5-n;select(n);scenes.forEach((im,i)=>{im.style.opacity=i===n?'1':'0';im.style.transform=paused?'none':`scale(${i===n?1.03+local*.19:1.03}) translate3d(${i%2===0?-local*1.2:local*1.2}%,${-local*1.5}%,0)`});walk.querySelector('.walk-track i').style.transform=`scaleX(${progress})`;if(!paused){const hero=document.querySelector('.hero'),h=hero.getBoundingClientRect();if(h.bottom>0){hero.querySelector('img').style.transform=`translateY(${Math.max(0,-h.top)*.18}px) scale(${1+Math.max(0,-h.top)/innerHeight*.12})`;}}}
function request(){if(!scheduled){scheduled=true;requestAnimationFrame(update)}}
function mode(){document.documentElement.classList.toggle('motion-paused',paused);document.querySelector('#motion-toggle').textContent=paused?'Enable motion':'Pause motion';document.querySelector('#motion-toggle').setAttribute('aria-pressed',String(paused));request()}
document.querySelector('#motion-toggle').onclick=()=>{paused=!paused;mode()};reduced.addEventListener('change',e=>{paused=e.matches;mode()});
stops.forEach((b,i)=>b.onclick=()=>{const range=walk.offsetHeight-stage.offsetHeight;scrollTo({top:walk.getBoundingClientRect().top+scrollY+range*((i+.15)/5),behavior:paused?'instant':'smooth'})});
window.addEventListener('scroll',request,{passive:true});window.addEventListener('resize',request);mode();
// Reveal architectural layers as visitors move into them, including dynamically opened projects.
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target)}}),{threshold:.07});
function observe(root=document){root.querySelectorAll('.intro-grid>*,.route button,.feature>*,.section-heading>*,.project-card,.drawing-section>*,.portrait,.career article,.about h2,.skills,footer h2,.detail-intro>*,.mood-images img,.swatch,.gallery button').forEach((el,i)=>{if(el.dataset.reveal)return;el.dataset.reveal='true';el.style.setProperty('--reveal-delay',`${Math.min(i%3,2)*75}ms`);observer.observe(el)})}
observe();new MutationObserver(()=>observe()).observe(document.querySelector('main'),{childList:true,subtree:true});new MutationObserver(()=>observe(document.querySelector('#detail'))).observe(document.querySelector('#detail'),{childList:true});
})();
