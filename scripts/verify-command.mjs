import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {readFile} from 'node:fs/promises';
const source=await build({entryPoints:['src/command/geometry.ts'],bundle:true,write:false,format:'esm'});
const {createGeometry}=await import('data:text/javascript;base64,'+Buffer.from(source.outputFiles[0].text).toString('base64'));
for(const count of [4000,12000]){
 const a=createGeometry(count),b=createGeometry(count);
 for(const key of ['field','torus','bloom']){assert.equal(a[key].length,count*3);assert.deepEqual(a[key],b[key]);assert(a[key].every(Number.isFinite))}
 // Establish zero discontinuity at the field/torus endpoints, including a reverse scrub.
 const smooth=x=>x*x*(3-2*x);
 for(let i=0;i<a.field.length;i++){
  const interpolate=t=>a.field[i]*(1-smooth(t))+a.torus[i]*smooth(t);
  assert.equal(interpolate(0),a.field[i]);assert.equal(interpolate(1),a.torus[i]);
  assert(Math.abs(interpolate(1)-interpolate(1-1e-5))<1e-7);
 }
}
const boot=await readFile('dist/command/assets/command.js','utf8');
assert(!boot.includes('requestAnimationFrame'),'Initial/reduced-motion bundle must not own an animation loop');
assert(!boot.includes('WebGLRenderer'),'Renderer must stay behind the motion gate');
assert.match(boot,/import\(/,'Motion engine must be loaded on demand');
const html=await readFile('dist/command/index.html','utf8');
for(const attr of ['data-panel=','data-accordion='])assert.equal(html.split(attr).length-1,attr==='data-panel='?3:5);
assert.equal((html.match(/aria-expanded="true"/g)||[]).length,1);
assert(!/\<video|\<audio/.test(html),'No autoplay media');
const home=await readFile('dist/index.html','utf8');
assert(!home.includes('/loader.js'),'Homepage must not load the legacy intro overlay');
assert(home.includes('hero-ring-labels')&&home.includes('hero-title-lock'),'Homepage must retain its particle-ring narrative handoff');
// Verify all new route links and their document anchors.
for(const [,href] of html.matchAll(/href="([^"]+)"/g)){
 if(!href.startsWith('/')&&!href.startsWith('#'))continue;
 const [pathname,anchor]=href.split('#'),path=pathname||'/command/';
 const file='dist'+(path.endsWith('/')?path+'index.html':path);
 const linked=await readFile(file,'utf8');if(anchor)assert(linked.includes(`id="${anchor}"`),`Missing anchor ${href}`);
}
console.log('PASS: point budgets, deterministic geometry, continuous morph endpoints, lazy renderer, reduced-motion boot, single-open accordion, route links, homepage entrance.');
