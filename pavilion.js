/* A real perspective projection of an illustrative architectural model.
   Canvas rendering keeps the experience portable without a GPU/library dependency. */
(()=>{
const section=document.querySelector('#pavilion'),stage=section.querySelector('.pavilion-stage'),canvas=document.querySelector('#pavilion-canvas'),ctx=canvas.getContext('2d');if(!ctx)return;
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(pointer:fine)');let width=1,height=1,angle=-.55,pitch=.53,rotation=true,manualLayers=null,layer=0,visible=false,raf=0,last=0,drag=null,phase='';
const control=document.querySelector('#pavilion-layers'),auto=document.querySelector('#pavilion-auto');
const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));const off=()=>reduced.matches||document.documentElement.classList.contains('motion-paused');
function box(x,y,z,w,h,d,color){return {points:[[x,y,z],[x+w,y,z],[x+w,y+h,z],[x,y+h,z],[x,y,z+d],[x+w,y,z+d],[x+w,y+h,z+d],[x,y+h,z+d]],color}}
function model(t){const parts=[];const add=(...a)=>parts.push(box(...a));
 add(-3,-.25,-2.1,6,.22,4.2,'#676c58');add(-2.7,0,-1.8,5.4,.16,3.6,'#c1b693');
 add(.9,.17,-1.4,1.35,.03,2.7,'#408b8c');
 for(let i=0;i<5;i++)add(.85,.22,-1.2+i*.5,1.45,.07,.22,'#d9d1b6');
 add(-2.2,.17,-1.35,2.6,.18,2.7,'#9c7953');
 for(const x of [-2.12,.22])for(const z of [-1.26,1.15])add(x,.35,-.0+z,.14,1.65,.14,'#b8b29d');
 add(-2.25,2.04+t*1.5,-1.4,2.7,.16,2.9,'#ddd7bf');
 for(let i=0;i<8;i++)add(-2.13+i*.34,2.23+t*2.4,-1.45,.12,.12,3,'#6d735b');
 add(-2,.45,-1.15,1.6,.18,.52,'#d7c8a6');add(-2,.63,-1.2,1.6,.4,.1,'#b8a588');
 add(-1.7,.35,.4,.7,.35,.55,'#706c54');
 for(const x of [-2.4,2.2])for(const z of [-1.5,1.2]){add(x,.17,z,.42,.35,.42,'#7f846a');add(x-.12,.52,z-.1,.66,.36,.62,'#4f6746');add(x-.03,.88,z,.45,.3,.43,'#789062')}
 // Fine edges and surrounding landscape are part of this illustrative model only.
 return parts;
}
function rotate(p){const c=Math.cos(angle),s=Math.sin(angle),x=p[0]*c-p[2]*s,z=p[0]*s+p[2]*c,cy=Math.cos(pitch),sy=Math.sin(pitch);return [x,p[1]*cy+z*sy,-p[1]*sy+z*cy]}
function project(p){const k=Math.min(width/10,height/10.5),depth=11/(11+p[2]);return [width*.5+p[0]*k*depth,height*.72-p[1]*k*depth]}
function draw(){ctx.clearRect(0,0,width,height);const background=ctx.createRadialGradient(width*.5,height*.5,0,width*.5,height*.5,width*.7);background.addColorStop(0,'#26392f');background.addColorStop(1,'#10201b');ctx.fillStyle=background;ctx.fillRect(0,0,width,height);
 ctx.strokeStyle='#adc3a315';ctx.lineWidth=1;for(let i=-5;i<=5;i++){for(const pts of [[[i,-.3,-5],[i,-.3,5]],[[-5,-.3,i],[5,-.3,i]]]){const a=project(rotate(pts[0])),b=project(rotate(pts[1]));ctx.beginPath();ctx.moveTo(...a);ctx.lineTo(...b);ctx.stroke()}}
 const faces=[],indexes=[[0,1,2,3],[4,7,6,5],[0,4,5,1],[3,2,6,7],[0,3,7,4],[1,5,6,2]];
 for(const solid of model(layer)){const points=solid.points.map(rotate);indexes.forEach((ids,i)=>{const pts=ids.map(j=>points[j]);faces.push({pts,color:solid.color,depth:pts.reduce((a,p)=>a+p[2],0)/4,shade:[.67,.84,.55,1,.76,.9][i]})})}
 faces.sort((a,b)=>b.depth-a.depth);for(const f of faces){const pts=f.pts.map(project),rgb=f.color.match(/\w\w/g).map(v=>Math.round(parseInt(v,16)*f.shade));ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();ctx.fillStyle=`rgb(${rgb.join(',')})`;ctx.fill();ctx.strokeStyle='#101d1935';ctx.lineWidth=.6;ctx.stroke()}
}
function scrollProgress(){const r=section.getBoundingClientRect();return clamp(-r.top/Math.max(1,section.offsetHeight-stage.offsetHeight))}
function tick(now){raf=0;if(!visible||document.hidden)return;const dt=Math.min(45,now-(last||now));last=now;const p=scrollProgress();layer=manualLayers===null?(off()?0:Math.sin(p*Math.PI)):manualLayers;control.value=Math.round(layer*100);if(rotation&&!off()&&!drag)angle+=dt*.00012;draw();const next=layer>.6?'STRUCTURE & SHADE':layer>.12?'REVEALING THE LAYERS':'FORM & SPACE';if(phase!==next){phase=next;document.querySelector('#pavilion-phase').textContent=next}if(rotation&&!off()&&!drag)raf=requestAnimationFrame(tick)}
function request(){if(!raf&&visible){last=0;raf=requestAnimationFrame(tick)}}
function resize(){const r=canvas.getBoundingClientRect();width=Math.max(1,r.width);height=Math.max(1,r.height);const dpr=Math.min(devicePixelRatio||1,1.75);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);request()}
new ResizeObserver(resize).observe(canvas);new IntersectionObserver(es=>{visible=es[0].isIntersecting;if(visible)request();else if(raf){cancelAnimationFrame(raf);raf=0}}, {rootMargin:'100px'}).observe(section);
canvas.addEventListener('pointerdown',e=>{drag={x:e.clientX,id:e.pointerId};canvas.setPointerCapture(e.pointerId)});canvas.addEventListener('pointermove',e=>{if(!drag)return;angle+=(e.clientX-drag.x)*.008;drag.x=e.clientX;request()});const end=()=>{drag=null;request()};canvas.addEventListener('pointerup',end);canvas.addEventListener('pointercancel',end);
document.querySelector('#rotate-left').onclick=()=>{angle-=.25;request()};document.querySelector('#rotate-right').onclick=()=>{angle+=.25;request()};auto.onclick=()=>{rotation=!rotation;auto.setAttribute('aria-pressed',String(rotation));auto.textContent=rotation?'Auto rotate':'Rotation paused';request()};control.oninput=()=>{manualLayers=Number(control.value)/100;request()};document.querySelector('#pavilion-reset').onclick=()=>{angle=-.55;manualLayers=null;rotation=true;auto.textContent='Auto rotate';auto.setAttribute('aria-pressed','true');request()};addEventListener('scroll',request,{passive:true});document.addEventListener('visibilitychange',request);reduced.addEventListener('change',request);new MutationObserver(request).observe(document.documentElement,{attributes:true,attributeFilter:['class']});resize();
// A compact progress map gives visitors an exit from every cinematic section.
const map=document.createElement('nav');map.className='journey-map';map.setAttribute('aria-label','Page journey');const destinations=[['home','Start'],['walk','Journey'],['pavilion','3D study'],['atlas','Projects'],['about','About'],['contact','Contact']];map.innerHTML=destinations.map(([id,label])=>`<a href="#${id}" aria-label="${label}"><i></i><span>${label}</span></a>`).join('');document.body.append(map);const links=[...map.querySelectorAll('a')];const marker=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){links.forEach(a=>{const active=a.hash==='#'+e.target.id;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')})}}),{rootMargin:'-20% 0px -45% 0px'});destinations.forEach(([id])=>marker.observe(document.getElementById(id)));
})();


