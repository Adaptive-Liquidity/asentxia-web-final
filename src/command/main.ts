// Asentxia homepage — boot and section behavior. Vanilla TS, no libraries.
import {ScrollEngine} from './ScrollEngine';
import {ReducedMotionGate, renderStaticField} from './ReducedMotionGate';
import {DemoClip} from './DemoClip';

const clamp = (n: number, a = 0, b = 1) => Math.max(a, Math.min(b, n));
let engine: ScrollEngine | undefined;
let clips: DemoClip[] = [];
let ripple: Ripple | null = null;
let rings: Rings | null = null;
let active = 0;
const abort = new AbortController();

function setPanelInert(on: boolean) {
  document.querySelectorAll<HTMLElement>('.walk-panel').forEach((p, j) => { p.inert = on && j !== active; });
}
function activate(i: number) {
  active = i;
  const count = document.querySelector('#walk-count');
  if (count) count.textContent = `0${i + 1} / 03`;
  document.querySelectorAll<HTMLButtonElement>('[data-step]').forEach((b, j) => b.setAttribute('aria-pressed', String(j === i)));
  setPanelInert(document.body.classList.contains('motion-ready'));
}

/* Ambient dot-field card: dots breathe on a slow wave and ripple around the pointer. */
class Ripple {
  ctx: CanvasRenderingContext2D; dots: {x: number; y: number; b: boolean}[] = [];
  t = 0; last = 0; raf = 0; visible = false; px = -9999; py = -9999; w = 0; h = 0; disposed = false;
  constructor(public canvas: HTMLCanvasElement, private reduced: boolean) {
    this.ctx = canvas.getContext('2d')!;
    const ro = new ResizeObserver(() => this.layout()); ro.observe(canvas);
    const io = new IntersectionObserver(([en]) => { this.visible = en.isIntersecting; this.sync(); }, {threshold: 0.05});
    io.observe(canvas);
    if (!reduced) {
      canvas.parentElement!.addEventListener('pointermove', ev => {
        const r = canvas.getBoundingClientRect(); this.px = ev.clientX - r.left; this.py = ev.clientY - r.top;
      }, {passive: true, signal: abort.signal});
      canvas.parentElement!.addEventListener('pointerleave', () => { this.px = this.py = -9999; }, {signal: abort.signal});
    }
    this.layout();
  }
  layout() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    this.w = this.canvas.clientWidth; this.h = this.canvas.clientHeight;
    this.canvas.width = this.w * dpr; this.canvas.height = this.h * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.dots = [];
    const gap = this.w < 700 ? 24 : 28;
    for (let y = gap / 2, row = 0; y < this.h; y += gap, row++)
      for (let x = gap / 2 + (row % 2 ? gap / 2 : 0); x < this.w; x += gap)
        this.dots.push({x, y, b: (row * 7 + Math.round(x / gap)) % 11 === 0});
    if (this.reduced) this.draw(0);
    this.sync();
  }
  sync() {
    if (this.disposed || this.reduced) return;
    if (this.visible && !this.raf && !document.hidden) { this.last = 0; this.raf = requestAnimationFrame(this.frame); }
    if (!this.visible && this.raf) { cancelAnimationFrame(this.raf); this.raf = 0; }
  }
  frame = (now: number) => {
    if (this.disposed) return;
    this.raf = this.visible && !document.hidden ? requestAnimationFrame(this.frame) : 0;
    const dt = this.last ? clamp((now - this.last) / 1000, 0, 0.05) : 0.016;
    this.last = now; this.t += dt;
    this.draw(this.t);
  };
  draw(t: number) {
    const {ctx, dots} = this;
    ctx.clearRect(0, 0, this.w, this.h);
    for (const d of dots) {
      const wave = Math.sin(d.x * 0.018 + d.y * 0.024 + t * 1.15) * 0.5 + 0.5;
      const dist = Math.hypot(this.px - d.x, this.py - d.y);
      const boost = dist < 150 ? (1 - dist / 150) ** 2 : 0;
      const r = 1.05 + wave * 0.55 + boost * 2.3;
      const a = 0.08 + wave * 0.09 + boost * 0.55;
      ctx.fillStyle = d.b ? `rgba(76,123,240,${(a + 0.06).toFixed(3)})` : `rgba(226,229,235,${a.toFixed(3)})`;
      ctx.beginPath(); ctx.arc(d.x, d.y, r, 0, 6.2832); ctx.fill();
    }
  }
  dispose() { this.disposed = true; cancelAnimationFrame(this.raf); }
}

/* Stacked dotted rings, slow counter-rotation, pointer repel, optional chime. */
class Rings {
  ctx: CanvasRenderingContext2D; t = 0; last = 0; raf = 0; visible = false; disposed = false;
  px = -9999; py = -9999; w = 0; h = 0; sound = false; audio: AudioContext | null = null;
  ringsCfg = [
    {rf: 0.40, n: 76, speed: 0.05, size: 1.5, tint: 'rgba(226,229,235,'},
    {rf: 0.29, n: 58, speed: -0.08, size: 1.8, tint: 'rgba(76,123,240,'},
    {rf: 0.18, n: 42, speed: 0.12, size: 2.1, tint: 'rgba(247,248,250,'},
  ];
  constructor(public canvas: HTMLCanvasElement, private reduced: boolean) {
    this.ctx = canvas.getContext('2d')!;
    const ro = new ResizeObserver(() => this.layout()); ro.observe(canvas);
    const io = new IntersectionObserver(([en]) => { this.visible = en.isIntersecting; this.sync(); }, {threshold: 0.05});
    io.observe(canvas);
    if (!reduced) {
      canvas.addEventListener('pointermove', ev => {
        const r = canvas.getBoundingClientRect(); this.px = ev.clientX - r.left; this.py = ev.clientY - r.top;
      }, {passive: true, signal: abort.signal});
      canvas.addEventListener('pointerleave', () => { this.px = this.py = -9999; }, {signal: abort.signal});
      canvas.addEventListener('pointerdown', () => this.chime(), {signal: abort.signal});
    }
    this.layout();
  }
  layout() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    this.w = this.canvas.clientWidth; this.h = this.canvas.clientHeight;
    this.canvas.width = this.w * dpr; this.canvas.height = this.h * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (this.reduced) this.draw(0);
    this.sync();
  }
  setSound(on: boolean) { this.sound = on; }
  chime() {
    if (!this.sound || this.reduced) return;
    try {
      this.audio ??= new AudioContext();
      const t0 = this.audio.currentTime;
      const osc = this.audio.createOscillator(); const gain = this.audio.createGain();
      osc.type = 'sine'; osc.frequency.setValueAtTime(560, t0); osc.frequency.exponentialRampToValueAtTime(840, t0 + 0.09);
      gain.gain.setValueAtTime(0.0001, t0); gain.gain.exponentialRampToValueAtTime(0.055, t0 + 0.02); gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.5);
      osc.connect(gain).connect(this.audio.destination); osc.start(t0); osc.stop(t0 + 0.55);
    } catch { /* audio unavailable */ }
  }
  sync() {
    if (this.disposed || this.reduced) return;
    if (this.visible && !this.raf && !document.hidden) { this.last = 0; this.raf = requestAnimationFrame(this.frame); }
    if (!this.visible && this.raf) { cancelAnimationFrame(this.raf); this.raf = 0; }
  }
  frame = (now: number) => {
    if (this.disposed) return;
    this.raf = this.visible && !document.hidden ? requestAnimationFrame(this.frame) : 0;
    const dt = this.last ? clamp((now - this.last) / 1000, 0, 0.05) : 0.016;
    this.last = now; this.t += dt;
    this.draw(this.t);
  };
  draw(t: number) {
    const {ctx} = this;
    ctx.clearRect(0, 0, this.w, this.h);
    const cx = this.w / 2, cy = this.h / 2, base = Math.min(this.w, this.h);
    for (const ring of this.ringsCfg) {
      const rr = ring.rf * base;
      for (let i = 0; i < ring.n; i++) {
        const a = (i / ring.n) * 6.2832 + t * ring.speed;
        let x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr;
        const dist = Math.hypot(this.px - x, this.py - y);
        let boost = 0;
        if (dist < 90) { boost = (1 - dist / 90) ** 2; const ux = (x - this.px) / (dist || 1), uy = (y - this.py) / (dist || 1); x += ux * boost * 16; y += uy * boost * 16; }
        ctx.fillStyle = ring.tint + (0.14 + boost * 0.5).toFixed(3) + ')';
        ctx.beginPath(); ctx.arc(x, y, ring.size + boost * 1.4, 0, 6.2832); ctx.fill();
      }
    }
  }
  dispose() { this.disposed = true; cancelAnimationFrame(this.raf); }
}

function widgets(reduced: boolean) {
  clips.forEach(c => c.dispose());
  clips = [...document.querySelectorAll<HTMLElement>('[data-clip]')].map(el => new DemoClip(el, reduced));
  ripple?.dispose(); rings?.dispose();
  const rc = document.querySelector<HTMLCanvasElement>('#ripple');
  const rg = document.querySelector<HTMLCanvasElement>('#rings');
  ripple = rc ? new Ripple(rc, reduced) : null;
  rings = rg ? new Rings(rg, reduced) : null;
}

function mode(reduced: boolean) {
  engine?.dispose(); engine = undefined;
  const root = document.querySelector<HTMLElement>('#particle-root')!;
  const motionButton = document.querySelector<HTMLButtonElement>('#motion-toggle')!;
  motionButton.setAttribute('aria-pressed', String(reduced));
  motionButton.textContent = reduced ? 'Motion off' : 'Pause motion';
  if (reduced) {
    document.body.classList.remove('motion-ready', 'loaded');
    document.documentElement.classList.remove('motion-pending');
    renderStaticField(root);
    setPanelInert(false);
    widgets(true);
    return;
  }
  try {
    document.body.classList.add('motion-ready'); // before measuring: layout differs in static mode
    engine = new ScrollEngine(activate);
    requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('loaded')));
    document.documentElement.classList.remove('motion-pending');
    widgets(false);
    setPanelInert(true);
  } catch (err) {
    console.warn('Motion scene unavailable; static experience retained.', err);
    document.body.classList.remove('motion-ready', 'loaded');
    renderStaticField(root);
    widgets(true);
  }
}

const gate = new ReducedMotionGate(mode);
mode(gate.reduced);

document.querySelector<HTMLButtonElement>('#motion-toggle')!.addEventListener('click', () => {
  const sound = document.querySelector<HTMLButtonElement>('#sound-toggle');
  if (sound && sound.getAttribute('aria-pressed') === 'true') { sound.setAttribute('aria-pressed', 'false'); sound.textContent = 'Sound off'; rings?.setSound(false); }
  gate.toggle();
}, {signal: abort.signal});

document.querySelector<HTMLButtonElement>('#sound-toggle')!.addEventListener('click', ev => {
  const b = ev.currentTarget as HTMLButtonElement; const on = b.getAttribute('aria-pressed') !== 'true';
  b.setAttribute('aria-pressed', String(on)); b.textContent = on ? 'Sound on' : 'Sound off';
  rings?.setSound(on);
}, {signal: abort.signal});

document.querySelectorAll<HTMLButtonElement>('[data-step]').forEach(button => button.addEventListener('click', () => {
  const i = Number(button.dataset.step);
  if (engine) engine.scrollToStep(i); else {
    const target = document.querySelector<HTMLElement>(`[data-panel="${i}"]`);
    target?.scrollIntoView({block: 'center'});
  }
  activate(i);
}, {signal: abort.signal}));

/* Accordion */
const accButtons = [...document.querySelectorAll<HTMLButtonElement>('[data-accordion]')];
accButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    accButtons.forEach((b, i) => {
      const open = i === index;
      b.setAttribute('aria-expanded', String(open));
      b.querySelector('.row-icon')!.textContent = open ? '−' : '+';
      document.getElementById(`acc-body-${i}`)!.hidden = !open;
      document.getElementById(`preview-${i}`)!.hidden = !open;
    });
  }, {signal: abort.signal});
  button.addEventListener('keydown', ev => {
    let i = index;
    if (ev.key === 'ArrowDown') i = (i + 1) % accButtons.length;
    else if (ev.key === 'ArrowUp') i = (i + accButtons.length - 1) % accButtons.length;
    else if (ev.key === 'Home') i = 0;
    else if (ev.key === 'End') i = accButtons.length - 1;
    else return;
    ev.preventDefault(); accButtons[i].focus();
  }, {signal: abort.signal});
});

/* Video tiles: play once in view; frosted replay; poster-only until sources exist. */
document.querySelectorAll<HTMLElement>('.tile').forEach(tile => {
  const video = tile.querySelector<HTMLVideoElement>('video')!;
  const replay = tile.querySelector<HTMLButtonElement>('.replay')!;
  if (!video.querySelector('source')) { tile.classList.add('no-source'); return; }
  replay.hidden = false;
  const io = new IntersectionObserver(([en]) => {
    if (en.isIntersecting && video.dataset.played !== '1') { video.dataset.played = '1'; video.play().catch(() => {}); io.disconnect(); }
  }, {threshold: 0.35});
  io.observe(video);
  replay.addEventListener('click', () => { video.currentTime = 0; video.play().catch(() => {}); }, {signal: abort.signal});
});

/* Marquee: pause offscreen. */
const marquee = document.querySelector<HTMLElement>('.marquee-track');
if (marquee) new IntersectionObserver(([en]) => { marquee.style.animationPlayState = en.isIntersecting ? 'running' : 'paused'; }).observe(marquee);

/* Email pill → composes a real email to the locked contact address. */
const form = document.querySelector<HTMLFormElement>('#user-form')!;
const input = form.querySelector<HTMLInputElement>('input')!;
const note = document.querySelector<HTMLElement>('#form-note')!;
form.addEventListener('submit', ev => {
  ev.preventDefault();
  if (!input.value.trim() || !input.checkValidity()) { input.reportValidity(); return; }
  note.textContent = 'Opening your email client — write to contact@asentxia.com and we’ll take it from there.';
  const body = `Hi Asentxia,\n\nI'd like to become a user.\n\nMy email: ${input.value.trim()}\n`;
  location.href = `mailto:contact@asentxia.com?subject=${encodeURIComponent('Staxions — Become a User')}&body=${encodeURIComponent(body)}`;
}, {signal: abort.signal});

/* Mobile navigation */
const header = document.querySelector<HTMLElement>('#site-header')!;
const menuButton = document.querySelector<HTMLButtonElement>('#menu-toggle')!;
menuButton.addEventListener('click', () => {
  const open = header.classList.toggle('nav-open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  if (open) document.querySelector<HTMLElement>('#primary-nav a')?.focus();
}, {signal: abort.signal});
document.addEventListener('keydown', ev => {
  if (ev.key === 'Escape' && header.classList.contains('nav-open')) {
    header.classList.remove('nav-open'); menuButton.setAttribute('aria-expanded', 'false'); menuButton.focus();
  }
}, {signal: abort.signal});
document.addEventListener('click', ev => {
  if (header.classList.contains('nav-open') && !header.contains(ev.target as Node)) {
    header.classList.remove('nav-open'); menuButton.setAttribute('aria-expanded', 'false');
  }
}, {signal: abort.signal});

addEventListener('pagehide', () => { engine?.dispose(); clips.forEach(c => c.dispose()); ripple?.dispose(); rings?.dispose(); gate.dispose(); abort.abort(); }, {once: true});
addEventListener('pageshow', ev => { if (ev.persisted) location.reload(); });
