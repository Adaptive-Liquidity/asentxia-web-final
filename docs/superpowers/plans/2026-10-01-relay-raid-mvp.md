# Relay Raid MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an isolated, runnable `/arcade/` Relay Raid MVP to the existing static TypeScript site, with a deterministic game loop, Action-compatible development endpoints, and an uncompiled Anchor receipt-program scaffold.

**Architecture:** Preserve the current esbuild/static-site structure. The browser game owns visual rendering and local-demo input only; pure TypeScript functions own deterministic game simulation and tests. The Node preview server exposes Action manifest and metadata/message endpoints in development. The Anchor scaffold records only a dual-signed portable receipt and contains no asset transfer, escrow, or payout logic.

**Tech Stack:** TypeScript 5.9, esbuild, HTML canvas, Node HTTP, bounded Base58 public-key validation, Rust/Anchor source scaffold, Mermaid documentation.

**Spec:** `docs/architecture/02-relay-raid-system-design.md`

## Global Constraints

- Preserve existing home and `/command/` build behavior; existing `npm run check` and `npm run build` remain green.
- Build an isolated `/arcade/` route and do not migrate the repository to Next.js, React, Phaser, or a managed Webdev Game project.
- The MVP is wallet-optional, client-side/local-demo only, and has no transfer, swap, token sale, escrow, liquidity pool, payout, real-money wager, or cash-redeemable prize.
- Label all local results as demonstrations; do not represent the Anchor program as compiled, deployed, or wallet-ready.
- `GET /actions.json`, `GET/OPTIONS/POST /api/actions/relay-raid` must return JSON with explicit CORS behavior and ordinary browser fallback.
- New game-state transitions use deterministic integer arithmetic and a versioned seed/ruleset.
- Anchor scaffold enforces dual-signature receipt issuance and a unique `(season, player, nonce)` PDA; it transfers no SOL or tokens.

## Review Focus

- Tampered, duplicated, or out-of-order input sequence must not produce a different accepted deterministic score.
- A game round ending at zero score, time expiry, or collision must reach a visible terminal state without a negative score or an animation loop leak.
- Action APIs must reject malformed `account` inputs and return CORS JSON for `OPTIONS`, rather than silently returning static fallback HTML.
- Browser fallback must still open the game if Actions/Blinks rendering is unsupported.
- Receipt source must require both player and configured attestor signers and bound score/expiry/nonce values; no instruction may move value.

---

### Task 1: Add the arcade route and deterministic simulation kernel

**Files:**
- Create: `content/arcade.ts`
- Create: `src/arcade/gameState.ts`
- Create: `src/arcade/template.ts`
- Create: `src/arcade/arcade.css`
- Create: `scripts/build-arcade.mjs`
- Modify: `package.json`
- Test: `scripts/verify-arcade.mjs`

**Interfaces:**
- Consumes: current `package.json` build/check conventions
- Produces: `createInitialState(seed: number): RaidState`, `advance(state: RaidState, input: RaidInput): RaidState`, `score(state: RaidState): number`, and `dist/arcade/index.html`

- [ ] **Step 1: Write deterministic simulation assertions**

```js
const first = runScriptedRaid(1337, script);
const second = runScriptedRaid(1337, script);
assert.deepEqual(first, second);
assert.equal(score(first), 0);
assert.throws(() => advance(first, {sequence: 1, action: 'boost'}));
```

- [ ] **Step 2: Run the arcade verifier to verify it fails**

Run: `node scripts/verify-arcade.mjs`

Expected: FAIL because `src/arcade/gameState.ts` and the arcade build output do not exist

- [ ] **Step 3: Implement the pure game kernel and static template**

Implement integer-only state updates with `rulesetVersion: 'relay-raid/v1'`, strictly increasing sequence numbers, a 90-second/5,400-frame round budget at 60 FPS, and a non-negative score. Build `dist/arcade/` via esbuild using the existing static-route pattern.

- [ ] **Step 4: Run type check and arcade verifier**

Run: `npm run check && node scripts/verify-arcade.mjs`

Expected: PASS with identical fixed-seed output and built `/arcade/` document

- [ ] **Step 5: Commit**

```bash
git add content/arcade.ts src/arcade scripts/build-arcade.mjs scripts/verify-arcade.mjs package.json package-lock.json dist/arcade
git commit -m "feat: add deterministic Relay Raid kernel"
```

### Task 2: Implement the interactive canvas loop and local receipt UX

**Files:**
- Create: `src/arcade/main.ts`
- Modify: `src/arcade/template.ts`
- Modify: `src/arcade/arcade.css`
- Test: `scripts/verify-arcade.mjs`

**Interfaces:**
- Consumes: `RaidState`, `RaidInput`, `advance`, `score`
- Produces: `mountRelayRaid(root: HTMLElement): () => void` and an accessible local receipt panel

- [ ] **Step 1: Add DOM-level assertions to the verifier**

```js
assert.match(html, /data-arcade-root/);
assert.match(html, /aria-live="polite"/);
assert.match(html, /Local demo — not an on-chain claim/);
assert.match(boot, /mountRelayRaid/);
```

- [ ] **Step 2: Run verifier to verify it fails**

Run: `npm run build && node scripts/verify-arcade.mjs`

Expected: FAIL because the interactive entrypoint and required accessibility labels are absent

- [ ] **Step 3: Implement `mountRelayRaid`**

Render a canvas-based 90-second relay loop with keyboard and touch controls. Keep simulation in `gameState.ts`; use `requestAnimationFrame` only for rendering. Cancel the frame on unmount/round completion, update a polite live region on score and end state, honor `prefers-reduced-motion`, and present a local receipt containing seed, score, ruleset version, and digest preview.

- [ ] **Step 4: Run verifier and type check**

Run: `npm run check && npm run build && node scripts/verify-arcade.mjs`

Expected: PASS with static-accessibility assertions and no failed existing verification

- [ ] **Step 5: Commit**

```bash
git add src/arcade/main.ts src/arcade/template.ts src/arcade/arcade.css scripts/verify-arcade.mjs dist/arcade
git commit -m "feat: add interactive Relay Raid demo"
```

### Task 3: Add Action-compatible development endpoints

**Files:**
- Modify: `scripts/preview.mjs`
- Create: `src/actions/relayRaidAction.ts`
- Modify: `package.json`
- Test: `scripts/verify-actions.mjs`

**Interfaces:**
- Consumes: `validatePublicKey(account: string): boolean`, `createRelayRaidActionMetadata(origin: string): object`
- Produces: root `GET /actions.json`; `GET`, `OPTIONS`, and `POST /api/actions/relay-raid`

- [ ] **Step 1: Write endpoint integration assertions**

```js
assert.equal(actions.status, 200);
assert.equal(actions.body.rules[0].pathPattern, '/arcade/*');
assert.equal(options.headers.get('access-control-allow-methods'), 'GET,POST,OPTIONS');
assert.equal(invalid.status, 400);
assert.equal(valid.body.type, 'message');
```

- [ ] **Step 2: Run endpoint verifier to verify it fails**

Run: `node scripts/verify-actions.mjs`

Expected: FAIL because the preview server serves static 404 responses and no Action routes exist

- [ ] **Step 3: Implement Action manifest and endpoints**

Use bounded Base58 decoding to validate a 32-byte public key without adding a Solana SDK to the demo-only server. Return only Action metadata and a safe development `message` response; do not construct a transaction or claim deployed-program compatibility. Add CORS headers to all Action responses, parse JSON with a bounded body, and reject unexpected methods/malformed body.

- [ ] **Step 4: Run Action and existing verification**

Run: `npm run check && npm run build && node scripts/verify-actions.mjs && node scripts/verify-command.mjs`

Expected: PASS; all routes emit JSON rather than fallback HTML

- [ ] **Step 5: Commit**

```bash
git add scripts/preview.mjs src/actions/relayRaidAction.ts scripts/verify-actions.mjs package.json package-lock.json
git commit -m "feat: add Relay Raid Action endpoints"
```

### Task 4: Add the Anchor receipt-program scaffold

**Files:**
- Create: `programs/relay_raid/src/lib.rs`
- Create: `programs/relay_raid/Cargo.toml`
- Create: `Anchor.toml`
- Create: `Cargo.toml`
- Create: `docs/architecture/03-anchor-receipt-contract.md`
- Test: `scripts/verify-anchor-scaffold.mjs`

**Interfaces:**
- Consumes: `Season`, `PlayerProfile`, `RoundReceipt` PDA seed policy in the system design
- Produces: documented `initialize_season`, `create_profile`, `claim_receipt`, `set_profile_revoked`, and `close_season` interfaces

- [ ] **Step 1: Write static contract-invariant assertions**

```js
assert.match(source, /pub fn claim_receipt/);
assert.match(source, /Signer<'info>/);
assert.match(source, /seeds = \[b"receipt"/);
assert.match(source, /ROUND_SCORE_MAX/);
assert.doesNotMatch(source, /system_program::transfer/);
```

- [ ] **Step 2: Run scaffold verifier to verify it fails**

Run: `node scripts/verify-anchor-scaffold.mjs`

Expected: FAIL because Anchor files do not exist

- [ ] **Step 3: Implement receipt-only Anchor source**

Pin an Anchor version compatible with the source. Enforce authority/attestor/player constraints, bounded score and expiry, `init` receipt PDA uniqueness, season active/closed checks, and explicit error codes. Document that compilation is blocked by the current environment’s missing toolchain and provide exact devnet compilation commands.

- [ ] **Step 4: Run static invariant verifier**

Run: `node scripts/verify-anchor-scaffold.mjs`

Expected: PASS; no transfer/escrow/token instructions exist

- [ ] **Step 5: Commit**

```bash
git add Anchor.toml Cargo.toml programs/relay_raid docs/architecture/03-anchor-receipt-contract.md scripts/verify-anchor-scaffold.mjs
git commit -m "feat: add attested receipt Anchor scaffold"
```

### Task 5: Integrate builds, validate, and document the MVP

**Files:**
- Modify: `package.json`
- Modify: `README.md` or create: `docs/architecture/04-mvp-runbook.md`
- Modify: `docs/architecture/02-relay-raid-system-design.md`
- Test: all existing and new verification scripts

**Interfaces:**
- Consumes: completed route, endpoints, Anchor scaffold
- Produces: one reproducible build/run workflow and accurate limitation disclosure

- [ ] **Step 1: Add an MVP build/run section and limitation assertions**

```text
npm ci
npm run check
npm run build
node scripts/preview.mjs --port 4173
```

The runbook must state that the game is local demo mode, endpoints return a development Action message, and Anchor source is uncompiled until the pinned toolchain is installed.

- [ ] **Step 2: Run the complete validation set**

Run: `npm run check && npm run build && node scripts/verify-command.mjs && node scripts/verify-arcade.mjs && node scripts/verify-actions.mjs && node scripts/verify-anchor-scaffold.mjs`

Expected: every verifier prints PASS and `curl` checks return JSON for `/actions.json` and Action methods

- [ ] **Step 3: Inspect the local route**

Run: `node scripts/preview.mjs --port 4173` then request `/arcade/`, `/actions.json`, and `/api/actions/relay-raid` with `curl`; confirm no route returns SPA/static fallback HTML unexpectedly

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json docs README.md scripts dist
git commit -m "docs: document Relay Raid MVP runbook"
```
