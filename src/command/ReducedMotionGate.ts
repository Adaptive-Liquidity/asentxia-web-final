// Reduced-motion and no-WebGL path: a static, fully formed ring (plus a hint of
// the stream) rendered as SVG. No animation, no rAF, no WebGL.
import {createField, circlePos, streamPosJS} from './paths';

export function renderStaticField(root: HTMLElement) {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 1440 1350');
  svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
  svg.setAttribute('aria-hidden', 'true');
  const R = 360, cx = 720, cy = 675;
  const {stream, ring} = createField(1600);
  for (let i = 0; i < 1600; i++) {
    const j = i * 4, layer = stream[j + 2];
    const onLap = stream[j] >= 0.7;
    const p = onLap ? circlePos(ring[j], stream[j + 1]) : streamPosJS(stream[j], stream[j + 1]);
    const c = document.createElementNS(ns, 'circle');
    c.setAttribute('cx', String(cx + p[0] * R));
    c.setAttribute('cy', String(cy - p[1] * R));
    c.setAttribute('r', String(0.5 + ring[j + 2] * 1.3));
    c.setAttribute('fill', layer < 2 ? '#F7F8FA' : '#8FA0C8');
    c.setAttribute('opacity', String(layer < 2 ? 0.16 + ring[j + 2] * 0.3 : 0.05 + ring[j + 2] * 0.16));
    svg.append(c);
  }
  root.replaceChildren(svg);
}

export class ReducedMotionGate {
  media = matchMedia('(prefers-reduced-motion: reduce)');
  manual = false;
  onChange: () => void;
  constructor(public change: (reduced: boolean) => void) {
    this.onChange = () => change(this.reduced);
    this.media.addEventListener('change', this.onChange);
  }
  get reduced() { return this.media.matches || this.manual; }
  toggle() { this.manual = !this.reduced; this.change(this.reduced); }
  dispose() { this.media.removeEventListener('change', this.onChange); }
}
