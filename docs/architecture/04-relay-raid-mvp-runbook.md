# Relay Raid MVP runbook

_Run, validate, and interpret the local prototype — 2026-10-01_

---

## 🚀 Run locally

```bash
npm ci
npm run check
npm run build
npm run verify
node scripts/preview.mjs --port 4173
```

Open `http://127.0.0.1:4173/arcade/` for the game demonstration. The preview server binds `0.0.0.0`; the Sandbox may expose it at the session URL when started as a service.

## 🔗 Check Action-compatible endpoints

```bash
curl -i http://127.0.0.1:4173/actions.json
curl -i http://127.0.0.1:4173/api/actions/relay-raid
curl -i -X OPTIONS http://127.0.0.1:4173/api/actions/relay-raid
curl -i -X POST http://127.0.0.1:4173/api/actions/relay-raid \
  -H 'content-type: application/json' \
  --data '{"account":"11111111111111111111111111111111","receiptId":"local-00000000","nonce":"valid-nonce-123"}'
```

The POST response is intentionally a `message` Action response. It does **not** submit a transaction, sign with a key, mint an asset, verify a real server receipt, or create a real claim.

## ⚠️ Interpretation boundary

- The browser loop is a local deterministic demo, not a server-authoritative match.
- The Action endpoints are development metadata/message endpoints with explicit CORS behavior and normal-page fallback.
- The Anchor program is source-only because the active environment has no Rust, Solana CLI, or Anchor toolchain.
- No route exposes a token sale, bonding curve, liquidity pool, swap, escrow, wallet requirement, cash prize, real-money wager, or transferable reward.

For the production architecture, accounts, security model, and validated advancement gates, read [the system design](02-relay-raid-system-design.md) and [the Anchor contract guide](03-anchor-receipt-contract.md).
