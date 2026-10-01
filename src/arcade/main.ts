import {
  ROUND_FRAMES,
  advance,
  advanceToFrame,
  createInitialState,
  createReceiptPreview,
  getDirectionLabel,
  getTargetDirection,
  getTimeRemainingSeconds,
  type Direction,
  type RaidAction,
  type RaidState,
} from './gameState';

const FRAME_MS = 1000 / 60;

function toElement<T extends Element>(root: ParentNode, selector: string): T {
  const element = root.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Missing Relay Raid element: ${selector}`);
  }
  return element;
}

function freshSeed(): number {
  const cryptoSeed = globalThis.crypto?.getRandomValues?.(new Uint32Array(1))[0];
  return cryptoSeed ?? Math.floor(Math.random() * 0xffffffff);
}

function isInteractiveTarget(target: EventTarget | null): boolean {
  return target instanceof Element && Boolean(target.closest('button, a, input, textarea, select, [contenteditable]'));
}

function drawRelay(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  state: RaidState,
  reducedMotion: boolean,
): void {
  context.clearRect(0, 0, width, height);
  const size = Math.min(width, height);
  const centerX = width / 2;
  const centerY = height / 2;
  const target = getTargetDirection(state);
  const radius = size * 0.28;
  const pulse = reducedMotion ? 1 : 0.85 + 0.15 * Math.sin(state.frame / 10);

  const gradient = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, size * 0.6);
  gradient.addColorStop(0, '#162744');
  gradient.addColorStop(1, '#08101d');
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);

  context.strokeStyle = '#274569';
  context.lineWidth = Math.max(1, size * 0.006);
  for (let index = 1; index < 4; index += 1) {
    context.beginPath();
    context.arc(centerX, centerY, radius * (index / 3), 0, Math.PI * 2);
    context.stroke();
  }

  const directionVectors: ReadonlyArray<readonly [number, number]> = [[0, -1], [1, 0], [0, 1], [-1, 0]];
  directionVectors.forEach(([x, y], direction) => {
    const active = direction === target;
    const distance = radius * 1.18;
    const nodeX = centerX + x * distance;
    const nodeY = centerY + y * distance;
    context.beginPath();
    context.fillStyle = active ? `rgba(108, 224, 255, ${pulse})` : '#25415d';
    context.shadowColor = active ? '#6ce0ff' : 'transparent';
    context.shadowBlur = active ? size * 0.06 : 0;
    context.arc(nodeX, nodeY, size * (active ? 0.035 : 0.024), 0, Math.PI * 2);
    context.fill();
    context.shadowBlur = 0;
  });

  context.save();
  context.translate(centerX, centerY);
  context.rotate((state.rotation * Math.PI) / 2);
  context.strokeStyle = '#f6dd88';
  context.lineWidth = size * 0.035;
  context.lineCap = 'round';
  context.beginPath();
  context.moveTo(0, size * 0.12);
  context.lineTo(0, -radius * 0.9);
  context.stroke();
  context.fillStyle = '#f6dd88';
  context.beginPath();
  context.arc(0, 0, size * 0.055, 0, Math.PI * 2);
  context.fill();
  context.restore();

  context.fillStyle = '#8ba0b7';
  context.font = `${Math.max(12, size * 0.035)}px ui-monospace, SFMono-Regular, Menlo, monospace`;
  context.textAlign = 'center';
  context.fillText(`BEACON / ${getDirectionLabel(target).toUpperCase()}`, centerX, height - size * 0.08);
}

export function mountRelayRaid(root: HTMLElement): () => void {
  const canvas = toElement<HTMLCanvasElement>(root, '[data-raid-canvas]');
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Canvas 2D context is unavailable');
  }

  const timeElement = toElement<HTMLElement>(root, '[data-time]');
  const scoreElement = toElement<HTMLElement>(root, '[data-score]');
  const chainElement = toElement<HTMLElement>(root, '[data-chain]');
  const targetElement = toElement<HTMLElement>(root, '[data-target]');
  const statusElement = toElement<HTMLElement>(root, '[data-live-status]');
  const receiptPanel = toElement<HTMLElement>(root, '[data-receipt-panel]');
  const receiptRuleset = toElement<HTMLElement>(root, '[data-receipt-ruleset]');
  const receiptScore = toElement<HTMLElement>(root, '[data-receipt-score]');
  const receiptSeed = toElement<HTMLElement>(root, '[data-receipt-seed]');
  const receiptId = toElement<HTMLElement>(root, '[data-receipt-id]');
  const reducedMotion = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

  let state = createInitialState(freshSeed());
  let startedAt = performance.now();
  let animationFrame = 0;
  let visibleReceipt = false;

  const render = () => {
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.min(globalThis.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.floor(rect.width * ratio));
    const height = Math.max(1, Math.floor(rect.height * ratio));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    drawRelay(context, width, height, state, reducedMotion);
    timeElement.textContent = `${getTimeRemainingSeconds(state)}s`;
    scoreElement.textContent = String(state.score);
    chainElement.textContent = String(state.chain);
    targetElement.textContent = getDirectionLabel(getTargetDirection(state));
  };

  const showReceipt = () => {
    if (visibleReceipt) {
      return;
    }
    visibleReceipt = true;
    receiptRuleset.textContent = state.rulesetVersion;
    receiptScore.textContent = String(state.score);
    receiptSeed.textContent = String(state.seed);
    receiptId.textContent = createReceiptPreview(state);
    receiptPanel.hidden = false;
    statusElement.textContent = `Raid complete. Local score ${state.score}. This is not an on-chain claim.`;
  };

  const tick = (now: number) => {
    const targetFrame = Math.min(ROUND_FRAMES, Math.floor((now - startedAt) / FRAME_MS));
    state = advanceToFrame(state, targetFrame);
    render();
    if (state.phase === 'active') {
      animationFrame = requestAnimationFrame(tick);
    } else {
      showReceipt();
    }
  };

  const perform = (action: RaidAction) => {
    if (state.phase !== 'active') {
      return;
    }
    try {
      state = advance(state, {sequence: state.sequence + 1, frame: state.frame, action});
      const latestEvent = state.events.at(-1);
      statusElement.textContent = latestEvent ? `${latestEvent.detail}. Score ${state.score}.` : `Score ${state.score}.`;
      render();
    } catch (error) {
      statusElement.textContent = error instanceof Error ? error.message : 'Relay input was not accepted.';
    }
  };

  const restart = () => {
    cancelAnimationFrame(animationFrame);
    state = createInitialState(freshSeed());
    startedAt = performance.now();
    visibleReceipt = false;
    receiptPanel.hidden = true;
    statusElement.textContent = 'New relay raid started. Route the active beacon.';
    render();
    animationFrame = requestAnimationFrame(tick);
  };

  const actionButtons = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-raid-action]'));
  const onButtonClick = (event: Event) => {
    const button = event.currentTarget as HTMLButtonElement;
    perform(button.dataset.raidAction as RaidAction);
  };
  actionButtons.forEach((button) => button.addEventListener('click', onButtonClick));

  const onKeyDown = (event: KeyboardEvent) => {
    if (state.phase !== 'active' || event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey || isInteractiveTarget(event.target)) {
      return;
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      perform('rotate_left');
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      perform('rotate_right');
    } else if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      perform('boost');
    }
  };
  window.addEventListener('keydown', onKeyDown);

  const restartButton = toElement<HTMLButtonElement>(root, '[data-raid-restart]');
  restartButton.addEventListener('click', restart);
  const shareButton = toElement<HTMLButtonElement>(root, '[data-raid-share]');
  const onShare = async () => {
    const url = `${location.origin}/arcade/`;
    try {
      await navigator.clipboard.writeText(url);
      statusElement.textContent = 'Challenge link copied. Share it with a squad.';
    } catch {
      statusElement.textContent = `Copy this challenge link: ${url}`;
    }
  };
  const onShareClick = () => void onShare();
  shareButton.addEventListener('click', onShareClick);

  const resizeObserver = new ResizeObserver(render);
  resizeObserver.observe(canvas);
  render();
  animationFrame = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(animationFrame);
    resizeObserver.disconnect();
    actionButtons.forEach((button) => button.removeEventListener('click', onButtonClick));
    window.removeEventListener('keydown', onKeyDown);
    restartButton.removeEventListener('click', restart);
    shareButton.removeEventListener('click', onShareClick);
  };
}

const root = document.querySelector<HTMLElement>('[data-arcade-root]');
if (root) {
  mountRelayRaid(root);
}
