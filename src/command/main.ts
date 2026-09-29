import {DemoClip} from './DemoClip';
import {ReducedMotionGate,renderStaticField} from './ReducedMotionGate';
const root=document.querySelector<HTMLElement>('#particle-root')!;
const motionButton=document.querySelector<HTMLButtonElement>('#motion-toggle')!;
const panels=[...document.querySelectorAll<HTMLElement>('.walk-panel')];
let clips:DemoClip[]=[],scene:{dispose:()=>void}|undefined,epoch=0,active=-1,ended=false;
const abort=new AbortController();
function setPanel(i:number){if(active===i)return;active=i;panels.forEach((panel,j)=>{const selected=j===i;panel.style.opacity=selected?'1':'0';panel.style.visibility=selected?'visible':'hidden';panel.style.transform=selected?'none':'translateY(16px)';panel.style.transition='opacity .45s ease, transform .45s ease';panel.inert=!selected;panel.setAttribute('aria-hidden',String(!selected));clips.find(c=>panel.contains(c.element))?.setEnabled(selected)});document.querySelector('#walk-count')!.textContent=`0${i+1} / 03`;document.querySelectorAll('[data-step]').forEach((button,j)=>button.setAttribute('aria-pressed',String(i===j)))}
function resetPanels(){active=-1;panels.forEach(p=>{p.removeAttribute('style');p.removeAttribute('aria-hidden');p.inert=false});}
async function mode(reduced:boolean){
 const generation=++epoch;scene?.dispose();scene=undefined;clips.forEach(c=>c.dispose());resetPanels();root.replaceChildren();
 clips=[...document.querySelectorAll<HTMLElement>('[data-clip]')].map(el=>new DemoClip(el,reduced));
 motionButton.setAttribute('aria-pressed',String(reduced));motionButton.textContent=reduced?'Motion off':'Pause motion';
 if(reduced){document.documentElement.classList.remove('motion-pending');renderStaticField(root);return;}
 try{const {enableScrollScene,stopMotionEngine}=await import('./ScrollSceneController');if(generation!==epoch||ended){if(gate.reduced||ended)stopMotionEngine();return;}scene=enableScrollScene(setPanel)}catch(error){document.body.classList.remove('motion-ready','loaded');clips.forEach(c=>c.dispose());clips=[...document.querySelectorAll<HTMLElement>('[data-clip]')].map(el=>new DemoClip(el,true));resetPanels();root.replaceChildren();console.warn('Command motion unavailable; static experience retained.',error)}
}
const gate=new ReducedMotionGate(mode);mode(gate.reduced);
motionButton.addEventListener('click',()=>gate.toggle(),{signal:abort.signal});
document.querySelectorAll<HTMLButtonElement>('[data-step]').forEach(button=>button.addEventListener('click',()=>{const i=Number(button.dataset.step),section=document.querySelector<HTMLElement>('#walkthrough')!;setPanel(i);window.scrollTo({top:section.offsetTop+(section.offsetHeight-innerHeight)*((i+.25)/3),behavior:'instant'})},{signal:abort.signal}));
const accordionButtons=[...document.querySelectorAll<HTMLButtonElement>('[data-accordion]')];
accordionButtons.forEach((button,index)=>{button.addEventListener('click',()=>{accordionButtons.forEach((b,i)=>{const isOpen=i===index;b.setAttribute('aria-expanded',String(isOpen));b.querySelector('.row-icon')!.textContent=isOpen?'−':'+';document.getElementById(`acc-body-${i}`)!.hidden=!isOpen;document.getElementById(`preview-${i}`)!.hidden=!isOpen})},{signal:abort.signal});button.addEventListener('keydown',event=>{let i=index;if(event.key==='ArrowDown')i=(i+1)%5;else if(event.key==='ArrowUp')i=(i+4)%5;else if(event.key==='Home')i=0;else if(event.key==='End')i=4;else return;event.preventDefault();accordionButtons[i].focus()},{signal:abort.signal})});
const confirm=document.querySelector<HTMLElement>('[data-clip=confirm]')!,status=confirm.querySelector<HTMLElement>('.confirmation-state')!,editLabel=confirm.querySelector<HTMLElement>('.edit-label')!,input=confirm.querySelector<HTMLInputElement>('input')!;
confirm.querySelectorAll<HTMLButtonElement>('[data-action]').forEach(button=>button.addEventListener('click',()=>{const action=button.dataset.action;const activeClip=clips.find(c=>c.element===confirm)!;activeClip.paused=true;activeClip.sync();
 if(action==='edit'){editLabel.hidden=!editLabel.hidden;if(!editLabel.hidden){input.focus();button.textContent='Save edits';status.textContent='Editing the demonstration proposal. Release is held.';confirm.querySelector<HTMLButtonElement>('[data-action=release]')!.disabled=true}else{button.textContent='Make edits';status.textContent='Revision updated. Review this demonstration before release.';confirm.querySelector<HTMLButtonElement>('[data-action=release]')!.disabled=false}}
 if(action==='cancel'){status.textContent='Demonstration cancelled. No effect was released.';editLabel.hidden=true;confirm.querySelector<HTMLButtonElement>('[data-action=release]')!.disabled=true;button.textContent='Reset demo';button.dataset.action='reset'}
 if(action==='release'){status.textContent=`Demonstration recorded: ${input.value.trim()||'Evidence capsule'}. No external effect occurred.`;button.disabled=true}
 if(action==='reset'){status.textContent='Review the exact proposal before release.';button.dataset.action='cancel';button.textContent='Cancel';confirm.querySelector<HTMLButtonElement>('[data-action=release]')!.disabled=false;confirm.querySelector<HTMLButtonElement>('[data-action=edit]')!.textContent='Make edits'}
},{signal:abort.signal}));
const cleanup=()=>{ended=true;++epoch;scene?.dispose();clips.forEach(c=>c.dispose());gate.dispose();abort.abort()};
window.addEventListener('pagehide',cleanup,{once:true});
window.addEventListener('pageshow',event=>{if(event.persisted)location.reload()});
