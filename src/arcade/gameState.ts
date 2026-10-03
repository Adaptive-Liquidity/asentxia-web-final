export const RULESET_VERSION = 'relay-raid/v1' as const;
export const ROUND_FRAMES = 60 * 90;
export const PULSE_INTERVAL_FRAMES = 90;
export const ROUND_SCORE_MAX = 999_999;

export type Direction = 0 | 1 | 2 | 3;
export type RaidAction = 'rotate_left' | 'rotate_right' | 'boost';
export type RaidPhase = 'active' | 'complete';

export type RaidInput = {
  sequence: number;
  frame: number;
  action: RaidAction;
};

export type RaidEvent = {
  frame: number;
  kind: 'rotate' | 'stable_route' | 'overload' | 'complete';
  detail: string;
};

export type RaidState = {
  rulesetVersion: typeof RULESET_VERSION;
  seed: number;
  frame: number;
  sequence: number;
  rotation: Direction;
  lastResolvedPulse: number;
  stableRoutes: number;
  overloads: number;
  chain: number;
  score: number;
  phase: RaidPhase;
  events: readonly RaidEvent[];
};

const EVENT_LIMIT = 24;

function asDirection(value: number): Direction {
  return ((value % 4) + 4) % 4 as Direction;
}

function requireFiniteInteger(value: number, label: string): void {
  if (!Number.isInteger(value) || !Number.isFinite(value)) {
    throw new Error(`${label} must be a finite integer`);
  }
}

function appendEvent(state: RaidState, event: RaidEvent): RaidEvent[] {
  return [...state.events, event].slice(-EVENT_LIMIT);
}

export function calculateScore(stableRoutes: number, chain: number, overloads: number): number {
  return Math.min(ROUND_SCORE_MAX, Math.max(0, stableRoutes * 10 + chain * 3 - overloads * 7));
}

function pulseRandom(seed: number, pulseIndex: number): number {
  let value = (seed >>> 0) ^ Math.imul(pulseIndex + 1, 0x9e3779b9);
  value ^= value >>> 16;
  value = Math.imul(value, 0x85ebca6b);
  value ^= value >>> 13;
  value = Math.imul(value, 0xc2b2ae35);
  value ^= value >>> 16;
  return value >>> 0;
}

export function getTargetDirection(state: RaidState): Direction {
  const pulseIndex = Math.floor(Math.min(state.frame, ROUND_FRAMES - 1) / PULSE_INTERVAL_FRAMES);
  return (pulseRandom(state.seed, pulseIndex) % 4) as Direction;
}

export function createInitialState(seed: number): RaidState {
  requireFiniteInteger(seed, 'seed');
  return {
    rulesetVersion: RULESET_VERSION,
    seed: seed >>> 0,
    frame: 0,
    sequence: 0,
    rotation: 0,
    lastResolvedPulse: -1,
    stableRoutes: 0,
    overloads: 0,
    chain: 0,
    score: 0,
    phase: 'active',
    events: [],
  };
}

export function advanceToFrame(state: RaidState, targetFrame: number): RaidState {
  requireFiniteInteger(targetFrame, 'targetFrame');
  if (targetFrame < state.frame) {
    throw new Error('targetFrame cannot move backwards');
  }
  if (state.phase === 'complete') {
    return state;
  }

  const frame = Math.min(targetFrame, ROUND_FRAMES);
  if (frame < ROUND_FRAMES) {
    return {...state, frame};
  }

  return {
    ...state,
    frame,
    phase: 'complete',
    events: appendEvent(state, {frame, kind: 'complete', detail: 'Relay window closed'}),
  };
}

export function advance(state: RaidState, input: RaidInput): RaidState {
  requireFiniteInteger(input.sequence, 'input.sequence');
  requireFiniteInteger(input.frame, 'input.frame');
  if (state.phase !== 'active') {
    throw new Error('round is complete');
  }
  if (input.sequence !== state.sequence + 1) {
    throw new Error('input sequence must be strictly increasing');
  }
  if (input.frame < state.frame || input.frame >= ROUND_FRAMES) {
    throw new Error('input frame must be within the active round');
  }

  const advanced = advanceToFrame(state, input.frame);
  const base = {...advanced, sequence: input.sequence};
  if (input.action === 'rotate_left' || input.action === 'rotate_right') {
    const direction = input.action === 'rotate_left' ? base.rotation - 1 : base.rotation + 1;
    return {
      ...base,
      rotation: asDirection(direction),
      events: appendEvent(base, {frame: base.frame, kind: 'rotate', detail: input.action}),
    };
  }

  const pulseIndex = Math.floor(base.frame / PULSE_INTERVAL_FRAMES);
  if (pulseIndex === base.lastResolvedPulse) {
    const overloads = base.overloads + 1;
    return {
      ...base,
      overloads,
      chain: 0,
      score: calculateScore(base.stableRoutes, 0, overloads),
      events: appendEvent(base, {frame: base.frame, kind: 'overload', detail: 'Pulse already resolved'}),
    };
  }

  if (base.rotation === getTargetDirection(base)) {
    const chain = base.chain + 1;
    const stableRoutes = base.stableRoutes + 1;
    return {
      ...base,
      lastResolvedPulse: pulseIndex,
      stableRoutes,
      chain,
      score: calculateScore(stableRoutes, chain, base.overloads),
      events: appendEvent(base, {frame: base.frame, kind: 'stable_route', detail: 'Stable signal routed'}),
    };
  }

  const overloads = base.overloads + 1;
  return {
    ...base,
    lastResolvedPulse: pulseIndex,
    overloads,
    chain: 0,
    score: calculateScore(base.stableRoutes, 0, overloads),
    events: appendEvent(base, {frame: base.frame, kind: 'overload', detail: 'Beacon mismatch'}),
  };
}

export function runScriptedRaid(seed: number, inputs: readonly RaidInput[]): RaidState {
  let state = createInitialState(seed);
  for (const input of inputs) {
    state = advance(state, input);
  }
  return advanceToFrame(state, ROUND_FRAMES);
}

export function getTimeRemainingSeconds(state: RaidState): number {
  return Math.max(0, Math.ceil((ROUND_FRAMES - state.frame) / 60));
}

export function getDirectionLabel(direction: Direction): string {
  return ['North', 'East', 'South', 'West'][direction];
}

export function createReceiptPreview(state: RaidState): string {
  const payload = `${state.rulesetVersion}|${state.seed}|${state.score}|${state.stableRoutes}|${state.overloads}|${state.sequence}`;
  let hash = 0x811c9dc5;
  for (let index = 0; index < payload.length; index += 1) {
    hash ^= payload.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return `local-${(hash >>> 0).toString(16).padStart(8, '0')}`;
}
