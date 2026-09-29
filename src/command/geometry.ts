export function createGeometry(count:number){
 const field=new Float32Array(count*3),torus=new Float32Array(count*3),bloom=new Float32Array(count*3),weight=new Float32Array(count);
 let seed=401;
 const random=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296};
 for(let i=0;i<count;i++){
  const j=i*3,layer=i%5,theta=random()*Math.PI*2,phi=random()*Math.PI*2;
  // Five continuous bands with a particulate cross-section; stable point correspondence.
  const r=2.8+Math.cos(phi)*.065+(random()-.5)*.028;
  torus[j]=Math.cos(theta)*r;torus[j+1]=(layer-2)*.28+Math.sin(phi)*.065;torus[j+2]=Math.sin(theta)*r;
  field[j]=(random()-.5)*15;field[j+1]=(random()-.5)*9;field[j+2]=(random()-.5)*7;
  const spread=2+random()*4,a=theta+spread*.18;
  bloom[j]=Math.cos(a)*spread;bloom[j+1]=(random()-.5)*5;bloom[j+2]=Math.sin(a)*spread;
  weight[i]=.3+random()*.7;
 }
 return {field,torus,bloom,weight};
}
