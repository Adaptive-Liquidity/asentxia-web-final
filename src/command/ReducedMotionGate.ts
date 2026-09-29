import {createGeometry} from './geometry';
export function renderStaticField(root:HTMLElement){
 const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 1440 900');svg.setAttribute('preserveAspectRatio','xMidYMid slice');
 const {torus,weight}=createGeometry(1300);
 for(let i=0;i<1300;i++){const x=torus[i*3],y=torus[i*3+1],z=torus[i*3+2],c=document.createElementNS(ns,'circle');c.setAttribute('cx',String(720+x*190));c.setAttribute('cy',String(580+(y*.9-z*.37)*150));c.setAttribute('r',String(.4+weight[i]*.45));c.setAttribute('fill','#8c929c');c.setAttribute('opacity',String(.13+weight[i]*.22));svg.append(c)}
 root.replaceChildren(svg);
}
export class ReducedMotionGate{
 media=matchMedia('(prefers-reduced-motion: reduce)');manual=false;onChange:()=>void;
 constructor(public change:(reduced:boolean)=>void){this.onChange=()=>change(this.reduced);this.media.addEventListener('change',this.onChange)}
 get reduced(){return this.media.matches||this.manual}
 toggle(){this.manual=!this.reduced;this.change(this.reduced)}
 dispose(){this.media.removeEventListener('change',this.onChange)}
}
