import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {createParticleField} from './ParticleFieldCanvas';
gsap.registerPlugin(ScrollTrigger);
export class ScrollSceneController{
 field:ReturnType<typeof createParticleField>|null=null;ctx:gsap.Context;abort=new AbortController();disposed=false;entrance={alpha:0};resizeObserver:ResizeObserver;
 constructor(private activate:(i:number)=>void){
  const root=document.querySelector<HTMLElement>('#particle-root')!;
  try{this.field=createParticleField(root)}catch{document.body.dataset.webgl='unavailable'}
  document.body.classList.add('motion-ready');
  const render=()=>this.field?.render();
  const field=this.field;
  const paintField=()=>{const hero=document.querySelector<HTMLElement>('.hero')!;hero.inert=scrollY>innerHeight*.7;if(!field)return;const h=innerHeight,y=scrollY,opening=document.querySelector('#opening')! as HTMLElement,galaxy=document.querySelector('#galaxy')! as HTMLElement,closing=document.querySelector('#closing')! as HTMLElement;
   const o=y/Math.max(1,opening.offsetHeight-h),g=(y-galaxy.offsetTop+h)/(galaxy.offsetHeight+h),f=(y-closing.offsetTop+h)/h;
   let alpha=0,morph=1,disperse=0,offset=0,rotation=.37;
   if(o<=1){alpha=this.entrance.alpha*(1-clamp((o-.72)/.17));morph=clamp((o-.08)/.56);rotation=.37+clamp(o)*.12;}
   else if(g>0&&g<1){alpha=clamp(g/.18)*clamp((1-g)/.18);disperse=clamp((g-.1)/.55);rotation=.49;}
   if(f>0){alpha=clamp(f/.6);morph=1;disperse=0;offset=-1.9;rotation=.38;}
   field.uniforms.uMorph.value=morph;field.uniforms.uDisperse.value=disperse;field.uniforms.uAlpha.value=alpha;field.points.position.y=offset;field.points.rotation.x=rotation;render();
  };
  this.ctx=gsap.context(()=>{
   gsap.to(this.entrance,{alpha:1,duration:.8,delay:.2,ease:'power1.inOut',onUpdate:paintField});
   const intro=gsap.timeline({scrollTrigger:{trigger:'#opening',start:'top top',end:'bottom bottom',scrub:true,invalidateOnRefresh:true}});
   intro.to('.hero',{opacity:0,y:-36,duration:.21,ease:'none'},.015)
    .to('.scene-foot',{opacity:0,duration:.12},.12);
   document.querySelectorAll('.ring-labels p').forEach((label,i)=>{intro.fromTo(label,{opacity:0,y:10},{opacity:1,y:0,duration:.035},.31+i*.13).to(label,{opacity:0,y:-8,duration:.04},.40+i*.13)});
   intro.to('.title-wipe',{clipPath:'polygon(-33% 0,100% 0,100% 100%,-33% 100%)',duration:.17,ease:'none'},.73)
    .fromTo('.title-wipe h2',{scale:6,opacity:.18},{scale:1,opacity:1,duration:.20,ease:'power2.out'},.78).to({}, {duration:.02},.98);
   ScrollTrigger.create({trigger:document.body,start:'top top',end:'bottom bottom',onUpdate:paintField,onRefresh:paintField});
   ScrollTrigger.create({trigger:'#walkthrough',start:'top top',end:'bottom bottom',onUpdate:self=>activate(Math.min(2,Math.floor(self.progress*3))),onRefresh:self=>activate(Math.min(2,Math.floor(self.progress*3)))});
   const marquee=document.querySelector<HTMLElement>('.marquee-track')!;
   ScrollTrigger.create({trigger:'#galaxy',start:'top bottom',end:'bottom top',onToggle:self=>{marquee.style.animationPlayState=self.isActive?'running':'paused'}});
  });
  // Let the point field become visible before beginning the copy entrance.
  document.body.classList.add('loaded');document.documentElement.classList.remove('motion-pending');
  const resize=()=>{field?.resize();ScrollTrigger.refresh();paintField()};
  this.resizeObserver=new ResizeObserver(()=>resize());this.resizeObserver.observe(document.documentElement);
  document.addEventListener('visibilitychange',()=>{document.querySelector<HTMLElement>('.marquee-track')!.style.animationPlayState=document.hidden?'paused':'running';if(document.hidden)gsap.globalTimeline.pause();else{gsap.globalTimeline.resume();paintField()}},{signal:this.abort.signal});
  paintField();
 }
 dispose(){if(this.disposed)return;this.disposed=true;this.abort.abort();this.resizeObserver.disconnect();this.ctx.revert();ScrollTrigger.disable();gsap.ticker.sleep();this.field?.dispose();document.body.classList.remove('motion-ready','loaded');document.querySelector<HTMLElement>('.hero')!.inert=false;document.querySelector<HTMLElement>('.marquee-track')!.style.animationPlayState='paused'}
}
function clamp(n:number){return Math.max(0,Math.min(1,n))}
export function enableScrollScene(activate:(i:number)=>void){ScrollTrigger.enable();return new ScrollSceneController(activate)}

export function stopMotionEngine(){ScrollTrigger.disable();gsap.ticker.sleep()}
