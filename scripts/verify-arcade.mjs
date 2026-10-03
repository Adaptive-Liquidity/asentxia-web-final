import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {readFile} from 'node:fs/promises';

const source = await build({entryPoints: ['src/arcade/gameState.ts'], bundle: true, write: false, format: 'esm'});
const game = await import(`data:text/javascript;base64,${Buffer.from(source.outputFiles[0].text).toString('base64')}`);

const script = [
  {sequence: 1, frame: 1, action: 'boost'},
  {sequence: 2, frame: 91, action: 'rotate_right'},
  {sequence: 3, frame: 92, action: 'boost'},
  {sequence: 4, frame: 181, action: 'rotate_left'},
  {sequence: 5, frame: 182, action: 'boost'},
];
const first = game.runScriptedRaid(1337, script);
const second = game.runScriptedRaid(1337, script);
assert.deepEqual(first, second, 'fixed seed and inputs must replay identically');
assert.equal(first.phase, 'complete');
assert(first.score >= 0, 'score must be non-negative');
assert.equal(game.getTimeRemainingSeconds(first), 0);
assert.throws(() => game.advance(game.createInitialState(1337), {sequence: 2, frame: 1, action: 'boost'}), /strictly increasing/);
assert.throws(() => game.advanceToFrame(game.createInitialState(1337), -1), /cannot move backwards/);
assert.match(game.createReceiptPreview(first), /^local-[a-f0-9]{8}$/);
assert.equal(game.calculateScore(2, 2, 0), 26, 'documented score formula must be exact');
assert.equal(game.calculateScore(0, 0, 1), 0, 'score must clamp at zero');
const routePulse = (state, frame) => {
  let next = game.advanceToFrame(state, frame);
  const target = game.getTargetDirection(next);
  while (next.rotation !== target) {
    next = game.advance(next, {sequence: next.sequence + 1, frame, action: 'rotate_right'});
  }
  return game.advance(next, {sequence: next.sequence + 1, frame, action: 'boost'});
};
let formulaState = game.createInitialState(1337);
formulaState = routePulse(formulaState, 1);
formulaState = routePulse(formulaState, 91);
assert.deepEqual(
  {stableRoutes: formulaState.stableRoutes, chain: formulaState.chain, overloads: formulaState.overloads, score: formulaState.score},
  {stableRoutes: 2, chain: 2, overloads: 0, score: 26},
  'state transition score must match the documented formula',
);

const html = await readFile('dist/arcade/index.html', 'utf8');
const boot = await readFile('dist/arcade/assets/arcade.js', 'utf8');
const controller = await readFile('src/arcade/main.ts', 'utf8');
assert.match(html, /data-arcade-root/);
assert.match(html, /aria-live="polite"/);
assert.match(html, /Local demo — no wallet, reward, or on-chain claim is required/);
assert.match(boot, /mountRelayRaid/);
assert.match(controller, /function isInteractiveTarget/);
assert.match(controller, /state\.phase !== 'active'/);
console.log('PASS: Relay Raid deterministic simulation, accessibility shell, and local receipt boundary.');
