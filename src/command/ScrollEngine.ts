// Scroll and scene engine — vanilla rAF, no animation libraries.
// One loop drives: smoothed scroll progress, the particle field, hero copy fade,
// ring labels, the glyph-mask title zoom, background glows, the canvas slide,
// and the pinned horizontal walkthrough. All thresholds in viewport-height units.
import {ParticleField, createParticleField} from './Particles';

const clamp = (n: number, a = 0, b = 1) => Math.max(a, Math.min(b, n));
const ease = (t: number) => t * t * (3 - 2 * t);

export class ScrollEngine {
  field: ParticleField | null = null;
  disposed = false;
  raf = 0; last = 0; startT = 0; sp = 0; flow = 0;
  opening!: HTMLElement; wrap!: HTMLElement; hero!: HTMLElement; foot!: HTMLElement;
  labels!: HTMLElement[]; titleMask!: HTMLElement; titleSvg!: HTMLElement;
  walk!: HTMLElement; walkTrack!: HTMLElement; stage!: HTMLElement;
  walkTop = 0; walkRange = 1; vh = innerHeight;
  heroOut = false;
  constructor(private activate: (i: number) => void) {
    const root = document.querySelector<HTMLElement>('#particle-root')!;
    this.opening = document.querySelector<HTMLElement>('#opening')!;
    this.wrap = document.querySelector<HTMLElement>('#particle-wrap')!;
    this.hero = document.querySelector<HTMLElement>('.hero')!;
    this.foot = document.querySelector<HTMLElement>('.scene-foot')!;
    this.labels = [...document.querySelectorAll<HTMLElement>('[data-label]')];
    this.titleMask = document.querySelector<HTMLElement>('.title-mask')!;
    this.titleSvg = document.querySelector<HTMLElement>('.title-mask svg')!;
    this.walk = document.querySelector<HTMLElement>('#staxions')!;
    this.walkTrack = document.querySelector<HTMLElement>('.walk-track')!;
    this.stage = document.querySelector<HTMLElement>('.walk-stage')!;
    this.field = createParticleField(root);
    document.body.dataset.renderer = this.field ? 'webgl2' : 'none';
    if (!this.field) {
      import('./ReducedMotionGate').then(m => m.renderStaticField(root));
      document.body.dataset.renderer = 'static';
    }
    this.measure();
    addEventListener('resize', () => this.measure(), {passive: true});
    addEventListener('load', () => this.measure(), {once: true});
    requestAnimationFrame(() => requestAnimationFrame(() => this.measure()));
    if (document.fonts) document.fonts.ready.then(() => this.measure()).catch(() => {});
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { cancelAnimationFrame(this.raf); this.raf = 0; this.last = 0; }
      else if (!this.raf && !this.disposed) this.raf = requestAnimationFrame(this.frame);
    });
    this.raf = requestAnimationFrame(this.frame);
  }
  measure() {
    this.vh = innerHeight;
    this.walkTop = this.walk.offsetTop;
    this.walkRange = Math.max(1, this.walk.offsetHeight - this.vh);
    this.field?.resize();
  }
  frame = (now: number) => {
    if (this.disposed) return;
    this.raf = requestAnimationFrame(this.frame);
    if (!this.startT) { this.startT = now; this.last = now; }
    const dt = clamp((now - this.last) / 1000, 0, 0.05);
    this.last = now;
    const time = (now - this.startT) / 1000;
    const raw = scrollY / this.vh;
    this.sp += (raw - this.sp) * (1 - Math.exp(-dt * 7)); // smoothed per frame
    const sp = this.sp;
    this.flow += dt * 0.0045;
    // ---- hero particle field
    if (this.field) {
      const alpha = clamp(time / 1.2) * (1 - clamp((sp - 2.2) / 0.45));
      if (alpha <= 0 && sp > 2.2) { if (!this.heroOut) { this.heroOut = true; this.wrap.style.visibility = 'hidden'; } }
      else {
        if (this.heroOut) { this.heroOut = false; this.wrap.style.visibility = 'visible'; }
        this.field.update({
          time, load: clamp(time / 5), progress: sp,
          rot: Math.max(0, sp - 0.85) * 1.7, flow: this.flow, alpha,
        });
      }
      // canvas wrapper slides up half a viewport as the ring forms
      const slide = ease(clamp((sp - 1.05) / 0.5)) * this.vh * 0.5;
      this.wrap.style.transform = slide ? `translateY(${-slide}px)` : '';
    }
    // ---- hero copy + scene furniture
    const heroFade = clamp((sp - 0.12) / 0.18);
    this.hero.style.opacity = String(1 - heroFade);
    this.hero.style.transform = heroFade ? `translateY(${-36 * heroFade}px)` : '';
    this.hero.inert = sp > 0.45;
    this.foot.style.opacity = String(1 - clamp((sp - 0.08) / 0.14));
    // ---- background glows fade in across 0.70–0.90
    const de = document.documentElement.style;
    de.setProperty('--g1', String(ease(clamp((sp - 0.70) / 0.12))));
    de.setProperty('--g2', String(ease(clamp((sp - 0.76) / 0.12))));
    de.setProperty('--g3', String(ease(clamp((sp - 0.82) / 0.12))));
    // ---- ring labels: appear only after the ring closes (0.80+), step every 0.09
    this.labels.forEach((label, i) => {
      const on = sp >= 0.80 + i * 0.09 && sp < 0.80 + (i + 1) * 0.09 || (i === this.labels.length - 1 && sp >= 0.80 + i * 0.09 && sp < 1.42);
      label.classList.toggle('active', on);
    });
    // ---- glyph-mask title zoom: ring stays visible through the letters
    const t = clamp((sp - 1.05) / 0.5);
    this.titleMask.style.opacity = String(0.18 + 0.82 * ease(t));
    this.titleSvg.style.transform = `scale(${6 - 5 * ease(t)})`;
    this.titleMask.style.visibility = sp > 0.95 && sp < 2.45 ? 'visible' : 'hidden';
    // ---- pinned horizontal walkthrough
    const q = clamp((scrollY - this.walkTop) / this.walkRange);
    if (scrollY > this.walkTop - this.vh && scrollY < this.walkTop + this.walkRange + this.vh) {
      const x = -ease(q) * Math.max(0, this.walkTrack.scrollWidth - this.stage.clientWidth);
      this.walkTrack.style.transform = `translateX(${x}px)`;
      this.activate(Math.min(2, Math.floor(q * 3)));
    }
  };
  scrollToStep(i: number) {
    scrollTo({top: this.walkTop + this.walkRange * ((i + 0.25) / 3), behavior: 'instant' as ScrollBehavior});
  }
  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.field?.dispose();
  }
}
