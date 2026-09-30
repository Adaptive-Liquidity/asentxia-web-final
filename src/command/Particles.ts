// Hero particle field — raw WebGL2, single gl.POINTS draw call.
// Original implementation for Asentxia Systems (no third-party runtime code).
// Behavior: ~148k round points (desktop) flow along an S-curve stream that joins
// a 22.5°-tilted ring for one lap; 36 bands switch on with staggered delays over
// ~5s while the canvas fades in (CSS); scroll morphs each point from its stream
// position to its ring position, each of the 10 circles closing between progress
// 0.70–0.80; further scroll rotates the ring. Wobble/noise fade as points
// converge; brightness and size pulse along the strands.
import {GLSL_PATH, createField} from './paths';

const VERT = `
precision highp float;
attribute vec4 aStream; // s0, r, layer(0|1 core, 2|3 cloud), circleIdx
attribute vec4 aRing;   // phi0, wobbleSeed, weight, strandOffset
uniform vec2 uRes; uniform float uScale; uniform vec2 uCenter;
uniform float uDpr; uniform float uTime; uniform float uFlow;
uniform float uProgress; uniform float uRot; uniform float uLoad; uniform float uAlpha;
varying vec3 vColor; varying float vFade;
${GLSL_PATH}
float hash(float n){return fract(sin(n)*43758.5453123);}
void main(){
  float s0=aStream.x, r=aStream.y, layer=aStream.z, circle=aStream.w;
  float phi0=aRing.x, seed=aRing.y, weight=aRing.z, strand=aRing.w;
  // ---- load-in: 36 bands along the stream switch on over ~5s
  float band=floor(s0*36.0);
  float delay=(band/36.0)*0.80+hash(seed*1.3)*0.10;
  float ld=smoothstep(delay,delay+0.10,uLoad);
  float lde=ld*ld*(3.0-2.0*ld);
  // ---- stream position (one coherent ribbon at r=1 + strand offset)
  float s=fract(s0+uFlow-(1.0-lde)*0.05);
  vec3 ps=streamPos(s,1.0)+vec3(0.0,strand,strand*0.55);
  // ---- ring position (tilted circle; uRot rotates the ring)
  vec3 pr=circlePos(phi0+uRot,r);
  // ---- per-circle close window: circle i closes across 0.70..0.80
  float cs=0.70+circle*0.0105+hash(seed*3.7)*0.012;
  float m=smoothstep(cs,cs+0.052,uProgress);
  float me=m*m*(3.0-2.0*m);
  vec3 p=mix(ps,pr,me);
  // ---- wobble + noise scatter, fading as points converge
  float cloud=step(1.5,layer);
  float wamp=mix(0.008,0.034,cloud)*(1.0-me);
  p+=vec3(sin(s*30.0+uTime*1.35+seed*7.0),cos(s*23.0-uTime*1.12+seed*13.0),sin(s*37.0+uTime*0.9+seed*5.0))*wamp;
  p+=(vec3(hash(seed*1.7),hash(seed*2.3),hash(seed*3.1))-0.5)*mix(0.016,0.06,cloud)*(1.0-me);
  // ---- projection: ring radius 1.0 == 1/4 viewport width
  vec2 px=uCenter+p.xy*uScale;
  vec2 clip=vec2(px.x/uRes.x*2.0-1.0,1.0-px.y/uRes.y*2.0);
  gl_Position=vec4(clip,0.0,1.0);
  float atten=clamp(1.0-p.z*0.30,0.70,1.18);
  gl_PointSize=clamp((0.6+weight*1.5)*uDpr*atten,0.5,4.5*uDpr);
  // ---- color: warm-white core strands; structural-gray/blue cloud layers
  vec3 core=vec3(0.969,0.973,0.980);
  vec3 cloudc=mix(vec3(0.886,0.898,0.922),vec3(0.114,0.306,0.847),0.30);
  float pulse=0.66+0.34*sin(s*44.0-uTime*2.4+seed*6.2831);
  float bright=mix(pulse,0.55+0.15*sin(uTime*0.8+seed*6.2831),cloud);
  float alpha=mix(0.40+0.48*weight,0.06+0.15*weight,cloud)*bright;
  vColor=mix(core,cloudc,cloud)*vec3(bright);
  vFade=alpha*ld*uAlpha*atten;
}`;
const FRAG = `
precision mediump float;
varying vec3 vColor; varying float vFade;
void main(){
  float d=length(gl_PointCoord-vec2(0.5));
  float a=smoothstep(0.5,0.16,d)*vFade;
  if(a<0.003) discard;
  gl_FragColor=vec4(vColor*a,a);
}`;

export class ParticleField {
  canvas=document.createElement('canvas');
  gl:WebGL2RenderingContext;
  prog:WebGLProgram; u:Record<string,WebGLUniformLocation|null>={};
  count=0; disposed=false;
  constructor(root:HTMLElement){
    const gl=this.canvas.getContext('webgl2',{alpha:true,antialias:false,depth:false,stencil:false,powerPreference:'high-performance'});
    if(!gl) throw new Error('webgl2 unavailable');
    this.gl=gl; this.canvas.setAttribute('aria-hidden','true');
    root.replaceChildren(this.canvas);
    const sh=(type:number,src:string)=>{const s=gl.createShader(type)!;gl.shaderSource(s,src);gl.compileShader(s);
      if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)||'shader'); return s;};
    this.prog=gl.createProgram();
    gl.attachShader(this.prog,sh(gl.VERTEX_SHADER,VERT));
    gl.attachShader(this.prog,sh(gl.FRAGMENT_SHADER,FRAG));
    gl.linkProgram(this.prog);
    if(!gl.getProgramParameter(this.prog,gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(this.prog)||'link');
    gl.useProgram(this.prog);
    for(const n of ['uRes','uScale','uCenter','uDpr','uTime','uFlow','uProgress','uRot','uLoad','uAlpha']) this.u[n]=gl.getUniformLocation(this.prog,n);
    const mobile=matchMedia('(max-width:800px)').matches;
    const {count,stream,ring}=createField(mobile?42000:148000);
    this.count=count;
    const buf=(data:Float32Array,name:string)=>{const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);
      gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);
      const loc=gl.getAttribLocation(this.prog,name);gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc,4,gl.FLOAT,false,0,0);};
    buf(stream,'aStream'); buf(ring,'aRing');
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE,gl.ONE); // additive; colors premultiplied in shader
    gl.clearColor(0,0,0,0);
    this.resize();
  }
  resize(){
    if(this.disposed) return;
    const dpr=Math.min(devicePixelRatio||1,2);
    const w=this.canvas.clientWidth||innerWidth, h=this.canvas.clientHeight||innerHeight*1.5;
    this.canvas.width=Math.round(w*dpr); this.canvas.height=Math.round(h*dpr);
    this.gl.viewport(0,0,this.canvas.width,this.canvas.height);
    this.gl.uniform2f(this.u.uRes,this.canvas.width,this.canvas.height);
    this.gl.uniform1f(this.u.uScale,this.canvas.width*0.25);
    this.gl.uniform2f(this.u.uCenter,this.canvas.width*0.5,this.canvas.height*0.5);
    this.gl.uniform1f(this.u.uDpr,dpr);
  }
  update(o:{time:number;load:number;progress:number;rot:number;flow:number;alpha:number}){
    if(this.disposed) return;
    const gl=this.gl;
    gl.uniform1f(this.u.uTime,o.time); gl.uniform1f(this.u.uLoad,o.load);
    gl.uniform1f(this.u.uProgress,o.progress); gl.uniform1f(this.u.uRot,o.rot);
    gl.uniform1f(this.u.uFlow,o.flow); gl.uniform1f(this.u.uAlpha,o.alpha);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS,0,this.count);
  }
  dispose(){
    if(this.disposed) return; this.disposed=true;
    const ext=this.gl.getExtension('WEBGL_lose_context'); ext?.loseContext();
    this.canvas.remove();
  }
}
export function createParticleField(root:HTMLElement){
  try{ return new ParticleField(root); }catch{ return null; }
}
