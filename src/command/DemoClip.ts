// Finite, visible-only HTML state machine. No perpetual animation loop.
export class DemoClip{
 index=0;timer:ReturnType<typeof setTimeout>|undefined;visible=false;paused=false;enabled=true;disposed=false;
 observer:IntersectionObserver; beats:HTMLElement[]; toggle:HTMLButtonElement|null;abort=new AbortController();
 constructor(public element:HTMLElement,public reduced:boolean){
  this.beats=[...element.querySelectorAll<HTMLElement>('[data-beat]')];this.toggle=element.querySelector('.clip-toggle');
  this.observer=new IntersectionObserver(([entry])=>{this.visible=entry.isIntersecting&&entry.intersectionRatio>=.35;this.sync()},{threshold:[0,.35,.75]});this.observer.observe(element);
  this.toggle?.addEventListener('click',()=>{if(this.index>=this.beats.length-1){this.index=0;this.paused=false;this.paint()}else this.paused=!this.paused;this.sync()},{signal:this.abort.signal});
  document.addEventListener('visibilitychange',()=>this.sync(),{signal:this.abort.signal});
  if(reduced)this.index=this.beats.length-1;
  this.paint();
 }
 setEnabled(value:boolean){this.enabled=value;this.sync()}
 paint(){this.beats.forEach((beat,i)=>{const show=this.reduced||i<=this.index;beat.style.opacity=show?'1':'0';beat.style.transform=show?'none':'translateY(8px)';beat.style.transition=this.reduced?'none':'opacity .5s ease, transform .5s ease';beat.inert=!show;beat.setAttribute('aria-hidden',String(!show))})}
 sync(){clearTimeout(this.timer);this.timer=undefined;if(this.disposed)return;const playing=!this.reduced&&this.enabled&&this.visible&&!this.paused&&!document.hidden&&this.index<this.beats.length-1;
 this.element.dataset.state=playing?'playing':this.index>=this.beats.length-1?'complete':'paused';
 if(this.toggle){const label=this.index>=this.beats.length-1?'Replay':this.paused?'Play':'Pause';this.toggle.textContent=label;this.toggle.setAttribute('aria-label',`${label} ${this.element.dataset.clip} demonstration`)}
 if(playing)this.timer=setTimeout(()=>{this.index++;this.paint();this.sync()},1400);
 }
 dispose(){this.disposed=true;clearTimeout(this.timer);this.observer.disconnect();this.abort.abort();this.beats.forEach(b=>{b.style.removeProperty('opacity');b.style.removeProperty('transform');b.style.removeProperty('transition');b.inert=false;b.removeAttribute('aria-hidden')})}
}
