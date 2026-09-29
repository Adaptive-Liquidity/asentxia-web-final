(()=>{
  const canvas=document.getElementById('field'); if(!canvas)return;
  const ctx=canvas.getContext('2d',{alpha:false}); if(!ctx)return;
  const isMobile=matchMedia('(max-width:760px)').matches;
  const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
  const count=isMobile?4000:10000, TAU=Math.PI*2;
  const introStarted=performance.now();
  let W=0,H=0,dpr=1,mouseX=0,mouseY=0,scrollIndex=0,sceneProgress=0,openingProgress=0,fieldFrom=0,fieldTo=0,fieldMix=0,clock=0,running=true,ringSpin=0,scrollImpulse=0,lastScrollY=scrollY;
  const sections=[...document.querySelectorAll('[data-scene]')];
  const pageScene={architecture:2,continuum:3,systems:6,holdings:5,company:7}[document.body.dataset.page];
  function rand(n){let x=Math.sin(n*127.1+78.233)*43758.5453;return x-Math.floor(x)}
  function target(scene,i){
    const a=rand(i*3+1)*TAU,b=rand(i*3+2)*TAU,r=rand(i*3+3),ring=i%7, q=i/count;
    let x=0,y=0,z=0,alpha=.8;
    if(scene===0){ // full-bleed mineral particulate: dense, layered, and directional
      const lane=rand(i*17+5),band=Math.sin(q*TAU*3.2)*.075;
      x=(rand(i*7+7)-.5)*3.1;
      y=(rand(i*5+13)-.5)*1.96+band+Math.sin(x*3+lane)*.035;
      z=(rand(i*11+3)-.5)*3.2;
      alpha=.22+.6*r;
    } else if(scene===1){ // five persistent particulate rings
      const layer=i%5,theta=a,minor=(rand(i*19+3)-.5)*.035;
      const radius=.47+minor;
      x=Math.cos(theta)*radius;
      y=(layer-2)*.075+Math.sin(b)*.012;
      z=Math.sin(theta)*radius;
      alpha=.38+.55*r;
    } else if(scene===2){ // seven compact responsibility constellations
      const centers=[[0,-.34],[.27,-.23],[.35,.12],[.16,.36],[-.16,.36],[-.35,.12],[-.27,-.23]],c=centers[ring];
      const radius=.065+.06*r;
      x=c[0]+Math.cos(a)*radius+Math.cos(b)*.025;
      y=c[1]+Math.sin(a)*radius;
      z=Math.sin(b)*.28;
      if(i%24===0){x=0;y=0;z=0;alpha=1}
    } else if(scene===3){ // dense chamber of embedded planes
      const side=.37,u=(rand(i*5+2)-.5)*2,v=(rand(i*7+1)-.5)*2;
      const face=i%6;
      x=.35+(face<2?(face===0?-side:side):u*side);
      y=face===2?-side:face===3?side:v*side;
      z=face===4?-side:face===5?side:(rand(i*19+6)-.5)*.75;
      x+=Math.sin(y*11+z*3)*.018;
      if(i%17===0){x=.35+(r-.5)*.035;y=(rand(i*12)-.5)*.035;z=(rand(i*14)-.5)*.035;alpha=1}
    } else if(scene===4){ // intention and effect separated by a precise gate
      const lane=i%4,step=(rand(i*7+2)-.5)*1.75;
      x=step;y=(lane-1.5)*.14+Math.sin(step*7+lane)*.013;z=(r-.5)*.32;
      if(i%9===0){x=.08+(rand(i*19)-.5)*.018;y=(rand(i*23)-.5)*.68;z=(r-.5)*.4;alpha=.85}
    } else if(scene===5){ // ordered evidence lines with deliberate sequence
      const row=i%14,t=rand(i*9+1);
      x=.18+(t-.5)*.95;y=(row-6.5)*.065;z=(rand(i*4+6)-.5)*.26;
      if(i%23===0){x=-.35+(row/14)*.8;y=(row-6.5)*.065;alpha=1}
    } else if(scene===6){ // related systems as satellite nodes around a source
      const c=i%6,angle=c*TAU/6-.35;
      const cx=Math.cos(angle)*.39,cy=Math.sin(angle)*.28;
      const radial=Math.sqrt(r)*.09;
      x=cx+Math.cos(a)*radial;y=cy+Math.sin(a)*radial;z=(rand(i*11+7)-.5)*.4;
      if(i%23===0){const t=rand(i*5+2);x=cx*t;y=cy*t;z=(r-.5)*.15;alpha=.42}
    } else { // convergence to a singular architectural mark
      const layer=i%3,scale=[.25,.18,.08][layer],k=Math.floor(rand(i*7+12)*4),u=rand(i*5+7)*2-1;
      x=[u*scale,scale,u*scale,-scale][k];y=[-scale,u*scale,scale,u*scale][k];z=(layer-1)*.15;
      const rot=Math.PI/4,ox=x,oy=y;x=ox*Math.cos(rot)-oy*Math.sin(rot);y=ox*Math.sin(rot)+oy*Math.cos(rot);
      if(i%10===0){x=(r-.5)*.014;y=(rand(i*15)-.5)*.44;z=.08;alpha=.9}
    }
    return [x,y,z,alpha];
  }
  const points=Array.from({length:count},(_,i)=>Array.from({length:8},(_,s)=>target(s,i)));
  function resize(){dpr=Math.min(devicePixelRatio||1,1.5);W=innerWidth;H=innerHeight;canvas.width=Math.round(W*dpr);canvas.height=Math.round(H*dpr);canvas.style.width=W+'px';canvas.style.height=H+'px';ctx.setTransform(dpr,0,0,dpr,0,0)}
  function clamp(v){return Math.max(0,Math.min(1,v))}
  function stage(el, amount, direction='up'){
    if(!el || reduced)return;
    const n=clamp(amount), eased=n*n*(3-2*n);
    el.style.opacity=String(.12+.88*eased);
    const offset=(1-eased)*25;
    el.style.transform=el.classList.contains('continuum-visual')&&!isMobile?`translateY(calc(-46% + ${offset}px))`:direction==='left'?`translate3d(${-offset}px,0,0)`:direction==='right'?`translate3d(${offset}px,0,0)`:`translate3d(0,${offset}px,0)`;
    if(el.matches('h2'))el.style.clipPath=`inset(0 0 ${(1-eased)*100}% 0)`;
  }
  function measure(){
    const mid=innerHeight*.52;
    if(pageScene!==undefined){
      scrollIndex=pageScene;fieldFrom=pageScene;fieldTo=pageScene;fieldMix=0;
      document.querySelectorAll('.page-section').forEach(section=>{
        const rect=section.getBoundingClientRect(),t=clamp((innerHeight*.84-rect.top)/(innerHeight*.62));
        stage(section.querySelector('h2'),t);
        stage(section.querySelector('.page-note,.text-list,.inline-link'),clamp((t-.15)/.7),'right');
      });
      return;
    }
    let idx=0;
    for(let i=0;i<sections.length;i++)if(sections[i].getBoundingClientRect().top<=mid)idx=i;
    const rect=sections[idx].getBoundingClientRect();
    const p=clamp((mid-rect.top)/Math.max(1,rect.height));
    scrollIndex=idx;sceneProgress=p;
    // Each object owns a scroll anchor. Interpolate across the whole distance
    // between anchors so neither geometry nor camera jumps at a section edge.
    const y=scrollY,anchors=sections.map((section,i)=>i===0?0:section.offsetTop-innerHeight*.52);
    fieldFrom=0;fieldTo=0;fieldMix=0;
    for(let i=0;i<anchors.length-1;i++){
      if(y>=anchors[i]){fieldFrom=i;fieldTo=i+1;fieldMix=clamp((y-anchors[i])/Math.max(1,anchors[i+1]-anchors[i]));}
    }
    if(y>=anchors[anchors.length-1]){fieldFrom=anchors.length-1;fieldTo=fieldFrom;fieldMix=0;}
    const current=document.getElementById('rail-current'),bar=document.getElementById('rail-progress');
    if(current)current.textContent=String(idx+1).padStart(2,'0')+' / 08';
    if(bar)bar.style.width=((idx+p)/sections.length*100)+'%';
    const hero=document.querySelector('.hero-copy');
    if(hero){
      const heroRange=Math.max(1,sections[0].offsetHeight-innerHeight);
      const heroProgress=clamp(y/heroRange);
      openingProgress=heroProgress;
      const vanish=clamp((heroProgress-.035)/.15);
      hero.style.opacity=String(1-vanish);
      hero.style.transform=`translateY(${-vanish*7}vh) scale(${1-vanish*.025})`;
      hero.style.filter='none';
      const guide=document.querySelector('.hero-bottom');
      if(guide)guide.style.opacity=String(1-clamp((heroProgress-.035)/.12));
      const labels=[...document.querySelectorAll('.hero-ring-labels p')];
      labels.forEach((label,j)=>{
        const center=.23+j*.09,show=clamp((heroProgress-(center-.035))/.035),hide=clamp((heroProgress-(center+.04))/.035);
        label.style.opacity=String(show*(1-hide));
        label.style.transform=`translateY(${(1-show)*10-hide*9}px)`;
      });
      const lock=document.querySelector('.hero-title-lock'),lockTitle=lock&&lock.querySelector('h2');
      if(lock&&lockTitle){
        const enter=clamp((heroProgress-.70)/.1),settle=enter*enter*(3-2*enter),leave=clamp((heroProgress-.93)/.065);
        lock.style.visibility=enter>0&&leave<1?'visible':'hidden';
        lock.style.opacity=String(enter*(1-leave));
        lockTitle.style.opacity=String((.08+.92*settle)*(1-leave));
        lockTitle.style.transform=`scale(${7-6*settle+leave*.5}) translateY(${-leave*14}vh)`;
      }
    }
    sections.forEach((section,i)=>{
      if(i===0)return;
      const box=section.getBoundingClientRect();
      const enter=clamp((innerHeight*.88-box.top)/(innerHeight*.66));
      stage(section.querySelector('h2'),enter,i===1?'left':'up');
      stage(section.querySelector('.copy-block p:not(.eyebrow),.effect-heading p:not(.eyebrow),.evidence-intro p:not(.eyebrow)'),clamp((enter-.08)/.82));
      stage(section.querySelector('.continuum-visual'),clamp((enter-.18)/.76),'right');
      if(i===2)section.querySelectorAll('.responsibility-map span').forEach((item,j)=>stage(item,clamp((enter-.08-j*.055)/.56)));
      if(i===4){
        const flow=section.querySelector('.effect-flow');
        stage(flow,clamp((enter-.22)/.64));
        if(flow)flow.style.setProperty('--gate-translate',`${clamp((enter-.26)/.7)*Math.max(0,flow.clientWidth-2)}px`);
      }
      if(i===5)section.querySelectorAll('.evidence-record li').forEach((item,j)=>stage(item,clamp((enter-.15-j*.07)/.52),'right'));
      if(i===6)section.querySelectorAll('.system-orbit>div').forEach((item,j)=>stage(item,clamp((enter-.15-j*.055)/.55)));
      if(i===7)stage(section.querySelector('.close-wordmark'),clamp((enter-.32)/.55));
    });
  }
  function draw(){if(!running)return;clock++;ctx.fillStyle='#0a0a0a';ctx.fillRect(0,0,W,H);
    const sourceMix=fieldFrom===0&&fieldTo===1?clamp((openingProgress-.08)/.53):fieldMix;
    const m=sourceMix*sourceMix*(3-2*sourceMix);
    scrollImpulse*=.91;
    ringSpin+=.0014+Math.min(.035,Math.abs(scrollImpulse)*.00018);
    const focus=(isMobile?Math.min(W,H)*.89:Math.min(W,H)*1.15)*(1+.045*Math.sin(m*Math.PI));
    const mx=reduced?0:mouseX*.018,my=reduced?0:mouseY*.018;
    const drift=reduced?0:Math.sin(clock*.003)*.007;
    for(let i=0;i<count;i++){
      const p=points[i][fieldFrom],q=points[i][fieldTo];let x=p[0]+(q[0]-p[0])*m,y=p[1]+(q[1]-p[1])*m,z=p[2]+(q[2]-p[2])*m;
      // The assembled rings continue their own slow rotation; wheel momentum accelerates them.
      if((fieldFrom===0&&fieldTo===1)||fieldFrom===1){
        const layer=i%5,angle=ringSpin*(layer%2?.82:-.66),cx=x*Math.cos(angle)-z*Math.sin(angle),cz=x*Math.sin(angle)+z*Math.cos(angle);
        x=cx;y+=Math.sin(ringSpin*.7+layer)*.009;z=cz;
      }
      // spatial compression / depth responds to pointer, but the stable center does not drift
      if(scrollIndex!==1 || i%19!==0){x+=(mx+drift)*(.55+z*.2);y+=my*(.55+z*.2)}
      let depth=2.25+z;let sx=W*.5+x*focus/depth*2,sy=H*.5+y*focus/depth*2;
      if(sx<-3||sx>W+3||sy<-3||sy>H+3)continue;
      let a=(p[3]+(q[3]-p[3])*m)*(fieldFrom===0?(.92+.16*m):1.08)*(1-Math.sin(m*Math.PI)*.1);
      if(fieldFrom===0&&openingProgress<.12){
        const elapsed=reduced?1:clamp((performance.now()-introStarted)/2050);
        const normalized=(p[0]+1.55)/3.1,front=elapsed*1.28-.12;
        a*=clamp((front-normalized)/.18);
        x-=(1-clamp((front-normalized)/.18))*.16;
      }
      if(i%37===0)a=Math.min(1,a*1.5);
      const sz=(i%29===0?1.55:1.02)*(2.15/depth)*(isMobile?.95:1);
      const tint=i%19===0&&scrollIndex!==0?'180,183,217':'213,214,221';
      ctx.fillStyle=`rgba(${tint},${Math.min(.95,a)})`;
      ctx.fillRect(sx,sy,sz,sz);
    }
    if(!reduced)requestAnimationFrame(draw);
  }
  resize();measure();draw();addEventListener('resize',()=>{resize();measure();if(reduced)draw()},{passive:true});addEventListener('scroll',()=>{const next=scrollY;scrollImpulse+=(next-lastScrollY);lastScrollY=next;measure();if(reduced)draw()},{passive:true});addEventListener('pointermove',e=>{mouseX=(e.clientX/innerWidth-.5)*2;mouseY=(e.clientY/innerHeight-.5)*2},{passive:true});document.addEventListener('visibilitychange',()=>{running=!document.hidden;if(running&&!reduced)requestAnimationFrame(draw)});
  const toggle=document.querySelector('.menu-toggle'),nav=document.querySelector('.primary-nav');if(toggle&&nav){toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');nav.classList.toggle('open',open)});nav.addEventListener('click',e=>{if(e.target.closest('a')){nav.classList.remove('open');toggle.setAttribute('aria-expanded','false')}});addEventListener('keydown',e=>{if(e.key==='Escape'){nav.classList.remove('open');toggle.setAttribute('aria-expanded','false')}})}
})();
