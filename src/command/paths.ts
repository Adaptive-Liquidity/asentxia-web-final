// Stream + ring path math for the hero particle field.
// Original work for Asentxia Systems. Behavioral target: a particle stream that
// enters top-left, sweeps past the ring's right edge, joins the ring front,
// completes one tilted lap, then scroll-morphs point-by-point into a 10-circle
// ring (2 bands of 5), radius = 1/4 viewport width, tilted 22.5 degrees.
// No third-party code.

export const TILT = 22.5 * Math.PI / 180;
export const COS_T = Math.cos(TILT);
export const SIN_T = Math.sin(TILT);
export const TWO_PI = Math.PI * 2;
// Fraction of the path that is the S-curve; the remainder is one ring lap.
export const JOIN = 0.7;
// Entry angle (radians) where the stream meets the ring front.
export const A_ENTRY = -0.96;
// 10 circles in 2 bands of 5 (radius relative; 1.0 = 1/4 viewport width).
export const CIRCLES = [0.80, 0.845, 0.89, 0.935, 0.98, 1.10, 1.145, 1.19, 1.235, 1.28];

export function circlePos(a: number, r: number): [number, number, number] {
  return [r * Math.cos(a), r * Math.sin(a) * COS_T, r * Math.sin(a) * SIN_T];
}

// GLSL: shared path functions (Bezier S-curve joined C1 to the ring lap).
export const GLSL_PATH = `
const float JOIN=${JOIN.toFixed(4)};
const float A_ENTRY=${A_ENTRY.toFixed(4)};
const float COS_T=${COS_T.toFixed(6)};
const float SIN_T=${SIN_T.toFixed(6)};
const float TWO_PI=6.28318530718;
vec3 circlePos(float a,float r){return vec3(r*cos(a),r*sin(a)*COS_T,r*sin(a)*SIN_T);}
vec3 streamPos(float s,float r){
  if(s>=JOIN){float a=A_ENTRY+(s-JOIN)/(1.0-JOIN)*TWO_PI;return circlePos(a,r);}
  float t=s/JOIN;
  vec3 P0=vec3(-2.30,1.55,0.20);
  vec3 P1=vec3(-1.05,0.66,0.08);
  vec3 P2=vec3(1.45,-0.46,-0.08);
  vec3 E=circlePos(A_ENTRY,r);
  vec3 tang=normalize(vec3(-sin(A_ENTRY),cos(A_ENTRY)*COS_T,cos(A_ENTRY)*SIN_T));
  vec3 P3=E-tang*0.62;
  float u=1.0-t;
  return u*u*u*P0+3.0*u*u*t*P1+3.0*u*t*t*P2+t*t*t*P3;
}`;

export interface FieldData {
  count: number;
  // vec4: s0 (rest position on path), r (circle radius), layer (0|1 core, 2|3 cloud), circleIdx (0..9)
  stream: Float32Array;
  // vec4: phi0 (ring angle), wobbleSeed, weight (size/brightness), strandOffset (lateral stream offset)
  ring: Float32Array;
}

export function createField(count: number): FieldData {
  const stream = new Float32Array(count * 4);
  const ring = new Float32Array(count * 4);
  let seed = 401;
  const rnd = () => { seed = (1664525 * seed + 1013904223) >>> 0; return seed / 4294967296; };
  const gauss = () => (rnd() + rnd() + rnd()) / 1.5 - 1; // approx normal in [-1,1]
  for (let i = 0; i < count; i++) {
    const core = rnd() < 0.66;
    const layer = core ? (i % 2) : 2 + (i % 2);
    const circle = i % 10;
    const rBase = CIRCLES[circle];
    // Radius: core strands hug their circle; clouds scatter around the ring plane.
    const r = core ? rBase + gauss() * 0.006 : rBase + gauss() * 0.05;
    // Rest position on the stream path: the ring must NOT be pre-formed at load.
    // 88% of points rest on the S-curve; 12% trickle onto the lap start so the
    // ring front hints at the gather. The ring itself closes only on scroll.
    let s0: number;
    if (rnd() < 0.88) s0 = 0.04 + rnd() * (JOIN - 0.04);
    else s0 = JOIN + rnd() * (0.97 - JOIN);
    // Ring angle: continuous with the lap when the point rests on it.
    const phi0 = s0 >= JOIN
      ? (A_ENTRY + (s0 - JOIN) / (1 - JOIN) * TWO_PI) % TWO_PI
      : (i * 2.399963 + rnd() * 0.5) % TWO_PI; // golden-angle spread for S-curve points
    // Two tight core strands (fixed lateral offsets) + two loose cloud layers.
    const strand = core ? (layer === 0 ? 0.021 + gauss() * 0.005 : -0.021 + gauss() * 0.005) : gauss() * (layer === 2 ? 0.085 : 0.12);
    const j = i * 4;
    stream[j] = s0; stream[j + 1] = r; stream[j + 2] = layer; stream[j + 3] = circle;
    ring[j] = phi0; ring[j + 1] = rnd() * TWO_PI; ring[j + 2] = core ? 0.45 + rnd() * 0.55 : 0.08 + rnd() * 0.3; ring[j + 3] = strand;
  }
  return { count, stream, ring };
}

// JS mirror of the GLSL stream path (used for the static reduced-motion render).
export function streamPosJS(s: number, r: number): [number, number, number] {
  if (s >= JOIN) return circlePos(A_ENTRY + (s - JOIN) / (1 - JOIN) * TWO_PI, r);
  const t = s / JOIN, u = 1 - t;
  const P0 = [-2.30, 1.55, 0.20], P1 = [-1.05, 0.66, 0.08], P2 = [1.45, -0.46, -0.08];
  const E = circlePos(A_ENTRY, r);
  const tl = Math.hypot(-Math.sin(A_ENTRY), Math.cos(A_ENTRY) * COS_T, Math.cos(A_ENTRY) * SIN_T);
  const tg = [-Math.sin(A_ENTRY) / tl, Math.cos(A_ENTRY) * COS_T / tl, Math.cos(A_ENTRY) * SIN_T / tl];
  const P3 = [E[0] - tg[0] * 0.62, E[1] - tg[1] * 0.62, E[2] - tg[2] * 0.62];
  const P = [P0, P1, P2, P3];
  return [0, 1, 2].map(k =>
    u * u * u * P[0][k] + 3 * u * u * t * P[1][k] + 3 * u * t * t * P[2][k] + t * t * t * P[3][k]
  ) as [number, number, number];
}
