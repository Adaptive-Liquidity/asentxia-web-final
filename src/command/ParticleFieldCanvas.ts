import * as THREE from 'three';
import {createGeometry} from './geometry';
export class ParticleFieldCanvas{
 renderer:THREE.WebGLRenderer; scene=new THREE.Scene(); camera=new THREE.PerspectiveCamera(43,1,.1,80);
 geometry=new THREE.BufferGeometry(); material:THREE.ShaderMaterial; points:THREE.Points;
 disposed=false; uniforms={uMorph:{value:0},uDisperse:{value:0},uAlpha:{value:0},uDpr:{value:1}};
 constructor(root:HTMLElement,canvas:HTMLCanvasElement,context:WebGL2RenderingContext){
  this.renderer=new THREE.WebGLRenderer({canvas,context,alpha:true,antialias:false,powerPreference:'low-power'});
  this.renderer.setClearColor(0x0a0a0a,0);root.replaceChildren(this.renderer.domElement);
  const g=createGeometry(matchMedia('(max-width:800px)').matches?4000:12000);
  this.geometry.setAttribute('position',new THREE.BufferAttribute(g.field,3));
  this.geometry.setAttribute('aTorus',new THREE.BufferAttribute(g.torus,3));
  this.geometry.setAttribute('aBloom',new THREE.BufferAttribute(g.bloom,3));
  this.geometry.setAttribute('aWeight',new THREE.BufferAttribute(g.weight,1));
  this.material=new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms:this.uniforms,
   vertexShader:`attribute vec3 aTorus;attribute vec3 aBloom;attribute float aWeight;uniform float uMorph;uniform float uDisperse;uniform float uDpr;varying float vWeight;
   void main(){float m=uMorph*uMorph*(3.0-2.0*uMorph);float d=uDisperse*uDisperse*(3.0-2.0*uDisperse);vec3 p=mix(position,aTorus,m);p=mix(p,aBloom,d);vec4 mv=modelViewMatrix*vec4(p,1.0);gl_Position=projectionMatrix*mv;gl_PointSize=clamp((1.15+aWeight*.85)*uDpr*(10.0/-mv.z),1.0,3.5);vWeight=aWeight;}`,
   fragmentShader:`uniform float uAlpha;varying float vWeight;void main(){float d=length(gl_PointCoord-.5);float a=(1.0-smoothstep(.25,.5,d))*(.22+vWeight*.6)*uAlpha;gl_FragColor=vec4(mix(vec3(.36,.40,.34),vec3(.88,.88,.83),vWeight),a);}`});
  this.points=new THREE.Points(this.geometry,this.material);this.points.frustumCulled=false;this.points.rotation.x=.37;this.scene.add(this.points);this.camera.position.z=11;
  this.resize();
 }
 resize(){if(this.disposed)return;const w=innerWidth,h=innerHeight;this.camera.aspect=w/h;this.camera.position.z=w<800?18:11;this.camera.updateProjectionMatrix();const dpr=Math.min(devicePixelRatio,1.5);this.renderer.setPixelRatio(dpr);this.renderer.setSize(w,h);this.uniforms.uDpr.value=dpr;this.render()}
 render(){if(!this.disposed)this.renderer.render(this.scene,this.camera)}
 dispose(){if(this.disposed)return;this.disposed=true;this.geometry.dispose();this.material.dispose();this.scene.clear();this.renderer.dispose();this.renderer.forceContextLoss();this.renderer.domElement.remove()}
}

// Software fallback shares the point correspondence and projection with the shader path.
// Rendered only on entrance/scroll/resize, never with a separate requestAnimationFrame.
export class SoftwareParticleField{
 disposed=false;canvas=document.createElement('canvas');context:CanvasRenderingContext2D;
 uniforms={uMorph:{value:0},uDisperse:{value:0},uAlpha:{value:0},uDpr:{value:1}};
 points={position:{y:0},rotation:{x:.37}};
 data=createGeometry(4000);
 constructor(root:HTMLElement){this.context=this.canvas.getContext('2d')!;root.replaceChildren(this.canvas);this.resize()}
 resize(){if(this.disposed)return;const dpr=Math.min(devicePixelRatio,1.5);this.uniforms.uDpr.value=dpr;this.canvas.width=innerWidth*dpr;this.canvas.height=innerHeight*dpr;this.render()}
 render(){if(this.disposed)return;const ctx=this.context,w=this.canvas.width,h=this.canvas.height,dpr=this.uniforms.uDpr.value,raw=this.uniforms.uMorph.value,m=raw*raw*(3-2*raw),d0=this.uniforms.uDisperse.value,d=d0*d0*(3-2*d0),alpha=this.uniforms.uAlpha.value,rx=this.points.rotation.x,cs=Math.cos(rx),sn=Math.sin(rx),cam=innerWidth<800?18:11,focal=h/(2*Math.tan(43*Math.PI/360));
 ctx.clearRect(0,0,w,h);if(alpha<=0)return;
 const {field,torus,bloom,weight}=this.data;
 for(let i=0;i<4000;i++){const j=i*3;let x=(field[j]*(1-m)+torus[j]*m)*(1-d)+bloom[j]*d,y=(field[j+1]*(1-m)+torus[j+1]*m)*(1-d)+bloom[j+1]*d,z=(field[j+2]*(1-m)+torus[j+2]*m)*(1-d)+bloom[j+2]*d;const yy=y*cs-z*sn+this.points.position.y,zz=y*sn+z*cs,depth=cam-zz;if(depth<.1)continue;const px=w/2+x*focal/depth,py=h/2-yy*focal/depth,size=Math.min(3.5,Math.max(1,(1.15+weight[i]*.85)*dpr*10/depth));ctx.fillStyle=`rgba(205,210,198,${(.22+weight[i]*.6)*alpha})`;ctx.fillRect(px,py,size*.65,size*.65)}
 }
 dispose(){this.disposed=true;this.canvas.remove();this.canvas.width=0;this.canvas.height=0}
}
export function createParticleField(root:HTMLElement){
 const canvas=document.createElement('canvas');const context=canvas.getContext('webgl2',{alpha:true,antialias:false,powerPreference:'low-power'});
 if(context){document.body.dataset.renderer='webgl2';return new ParticleFieldCanvas(root,canvas,context)}
 document.body.dataset.renderer='canvas2d';return new SoftwareParticleField(root);
}
