# Pump.fun-style token bonding curves and Solana launch mechanics

**Scope and date.** This memo covers the mechanism, not investment advice. It separates facts directly documented by Solana, Pump.fun, Metaplex, or Bitquery from design hypotheses for a proposed Solana-native gaming/web ecosystem. Pump.fun’s documentation is client-rendered; its public HTML was inspected directly on 2026-10-01, and the accessible technical facts are cross-checked against Bitquery’s on-chain data documentation. Product parameters and fees can change.

## Mechanisms (3–6)

### 1. Deterministic curve pricing replaces an initially seeded order book

**Verified facts.** Pump.fun describes every coin as starting on an on-chain bonding curve that quotes buy/sell prices from reserves. Bitquery documents the current Pump.fun model as a fixed 1 billion-token supply, with approximately 800 million tokens available to the curve, and gives a progress calculation based on the curve balance. The key UX property is continuous quoting without a creator having to seed a conventional pool. Metaplex’s official Genesis implementation makes the general design explicit: a constant-product `x × y = k` curve uses virtual SOL and token reserves to set a finite starting price and make a complete sell-out practical; real SOL and remaining real tokens are tracked separately from virtual reserves. **Do not infer that Pump.fun uses exactly Metaplex’s parameters or formula**—the Metaplex document is a comparable primary implementation, not Pump.fun’s contract specification.

**Hypothesis for the ecosystem.** A game asset launch can expose a transparent, bounded price schedule and a visible curve-progress state, reducing the “empty pool” problem while retaining permissionless discovery. This is useful for cosmetic/community tokens, but it is not a guarantee of fair distribution or value.

**Risks / falsifiers.** The hypothesis fails if curve prices create unacceptable slippage for ordinary players, if bots capture most early supply, or if users misunderstand curve progress as a promise of future liquidity. Falsify with replayed simulations and devnet measurements across trade sizes, latency, and adversarial ordering.

### 2. Graduation is a state transition from curve trading to an AMM pool

**Verified facts.** Bitquery documents that when the curve reaches 100% (the sellable curve allocation is exhausted), Pump.fun automatically creates a PumpSwap pool: curve trading stops and trading resumes as an AMM pair, without a manual listing. Pump.fun’s public fee page says graduated Pump.fun coins have an associated PumpSwap “canonical pool,” and calculates market cap using current price multiplied by 1 billion tokens. Metaplex’s analogous Genesis lifecycle is `Created → Active → Graduated`, with automatic migration of accumulated real SOL to a Raydium CPMM pool and closure of the curve. Again, this is evidence for a robust launch pattern, not proof that Pump.fun uses Raydium or identical state fields today.

**Hypothesis for the ecosystem.** Treat graduation as an explicit, indexable lifecycle event: `created`, `active`, `graduated`, `paused/failed` (if the product adds one). A game can change UI, rewards, and liquidity warnings at the transition rather than pretending curve and AMM markets are interchangeable.

**Risks / falsifiers.** Migration can produce a discontinuity in price, routing, fees, or available liquidity; a low-quality token can graduate and still have no durable demand. Falsify any claim of “automatic liquidity sufficiency” by measuring post-graduation depth, spreads, and failed swaps—not merely whether a pool exists.

### 3. Fee policy is part of market design, not an implementation detail

**Verified facts.** Pump.fun’s official fee page currently states a **1.25% bonding-curve fee** for SOL- and USDC-denominated tokens: 0.300% creator, 0.950% protocol, and 0% LP fee. Its PumpSwap canonical-pool schedule is tiered by market cap; the page gives, for example, 1.25% total at the lowest SOL tier (0.300% creator, 0.930% protocol, 0.020% LP) and lower total rates at higher tiers. The page also warns that blockchain/wallet/third-party interface fees are separate and that smart-contract fees can change. Metaplex’s Genesis reference demonstrates another defensible pattern: protocol and optional creator fees are charged on the SOL side, calculated independently on gross amount, and do not compound.

**Hypothesis for the ecosystem.** Prefer a simple, displayed fee schedule with a hard protocol cap, separately itemized creator/revenue-share and LP components, and a governance-controlled change process. In a game, consider fee rebates for meaningful gameplay utility only if they cannot be farmed by wash trading.

**Risks / falsifiers.** Fees can make small player trades uneconomic, incentivize churn or sybil volume, and create conflicts if creators can change economics after launch. Falsify “healthy fee design” with cohort retention, net-of-fee player outcomes, and adversarial volume tests; never use artificial volume or price manipulation as a validation method.

### 4. Solana launch execution is a contention and account-initialization problem

**Verified facts.** Solana’s official fee docs state that each transaction pays a 5,000-lamport-per-signature base fee plus an optional prioritization fee. For legacy/v0 transactions, priority fee is `ceil(CU price × CU limit / 1,000,000)` lamports; it is charged even when the transaction fails, and priority is influenced by validator reward relative to scheduler cost. Solana’s token docs state that a mint stores supply, decimals, mint authority, and freeze authority; token accounts hold one mint for one owner. An ATA is deterministically derived from wallet, token-program, and mint; creation requires a refundable minimum balance, and `CreateIdempotent` succeeds if the ATA already exists.

**Hypothesis for the ecosystem.** A launch transaction should be bounded and retry-safe: precompute PDAs/ATAs, use idempotent account creation, simulate, set a measured CU limit, quote slippage and expiry, and use an explicit user-controlled priority-fee ceiling. A launch service can sponsor ATA rent only with clear disclosure and rate limits.

**Risks / falsifiers.** Congestion, write-lock contention, stale blockhashes, failed-but-charged fees, and Token-2022 account-size differences can make a “one-click” launch unreliable. Falsify reliability claims with load tests on devnet/mainnet-like replay, reporting confirmation latency, failure rate, fee paid on failures, and recovery time.

### 5. On-chain observability is a product primitive

**Verified facts.** Bitquery documents streams for token creation (name, symbol, mint, creator, timestamp), trade side, volume, trader address, market cap, supply, curve progress, and Pump.fun-to-PumpSwap migration. It also documents that post-migration activity is ordinary AMM-pair trading. This makes lifecycle state independently queryable rather than dependent on a frontend label.

**Hypothesis for the ecosystem.** Publish a compact event schema and index it from day one: mint, curve PDA, creator, reserve/supply snapshots, quote asset, fee basis points, buy/sell, graduation transaction, destination pool, and authority changes. The game UI should show source transaction links, effective fees, and “curve vs AMM” status.

**Risks / falsifiers.** An indexer can lag, misclassify forks/failed transactions, or expose trader data in ways users did not expect. Falsify data quality with reconciliation against finalized RPC state and an independent indexer; privacy claims should be narrow because public Solana account activity is observable.

## Evidence-backed design conclusions

1. **A curve is a pricing and distribution mechanism, not a fairness guarantee.** Early access, latency, capital, and automation remain advantages; “permissionless” does not mean equal outcomes.
2. **Graduation must be modeled as a market migration.** Quote source, pool address, fee schedule, and slippage behavior change; clients must not silently carry over curve assumptions.
3. **Supply and authorities are security-critical.** A fixed supply requires removing mint authority; freeze authority and Token-2022 extensions need an explicit product policy and wallet disclosure. The Solana token model makes these authorities inspectable, but it does not choose the policy for the application.
4. **Priority fees are not a lawful or ethical bypass.** They are a network scheduling mechanism. The prototype must not offer “sniping,” front-running, wash trading, or other market-manipulation features; user-visible ceilings and fair retry behavior are preferable.

## Defensible whitespace

- **Game-native graduation semantics:** graduate based on a documented utility/readiness condition (or use a fixed, transparent threshold) and show what changes in the player economy; do not imply that graduation predicts success.
- **Player-protection defaults:** max slippage, max SOL/USDC spend, transaction expiry, simulation, idempotent retries, fee/authority disclosure, and a cancel/withdraw path where the contract permits it.
- **Verifiable launch provenance:** signed metadata, immutable launch parameters, authority status, creator allocation disclosure, and a public event log that distinguishes primary curve trades from secondary AMM trades.
- **Sustainable utility over meme velocity:** use curves for opt-in community coordination or cosmetic access, while keeping core gameplay playable without speculative token exposure. This is a product thesis, not an observed market fact.

## Prototype implications

1. Build a devnet-only minimal program or adapter with explicit `initialize → buy/sell → graduate` states; parameterize virtual/real reserves rather than hard-coding a third party’s values.
2. Make all arithmetic integer-safe, round in a documented direction, enforce max input/min output and per-wallet limits only if policy-justified, and test reserve conservation plus boundary trades.
3. Use the original Token Program first unless a required Token-2022 extension is documented; if Token-2022 is used, calculate ATA/storage sizes dynamically and expose all extensions/authorities in UI.
4. Construct transactions with simulation, bounded CU limit, user-selected priority-fee ceiling, recent-blockhash expiry, idempotent ATA creation, and clear handling for fees charged on failed transactions.
5. Implement an indexer/reconciliation job that consumes finalized transactions, records migration and pool addresses, and compares event-derived balances with RPC account state.
6. Test with adversarial but non-manipulative scenarios: simultaneous buys, partial-fill-at-threshold, failed migration, stale quotes, RPC disagreement, duplicate retries, and extreme SOL/USDC price changes. Do not test by creating fake demand or attempting to move a public market.
7. Before production, obtain legal/compliance review for token distribution, consumer disclosures, game monetization, creator fees, geofencing, age restrictions, and market-abuse controls.

## References

1. [Pump.fun — The Pump.fun bonding curve](https://pump.fun/docs/bonding-curve) (official; client-rendered documentation inspected 2026-10-01).
2. [Pump.fun — Fees](https://pump.fun/docs/fees) (official; current fee schedule inspected 2026-10-01).
3. [Bitquery — Pump.fun to PumpSwap API: Token Migration Tracking](https://docs.bitquery.io/docs/blockchain/Solana/Pumpfun/pump-fun-to-pump-swap/) (technical secondary source; lifecycle and observable fields).
4. [Metaplex — Genesis Bonding Curve: Theory of Operation](https://www.metaplex.com/docs/smart-contracts/genesis/bonding-curve-theory) (official comparable implementation; constant-product, virtual-reserve, fee, and graduation mechanics).
5. [Solana — Fees](https://solana.com/docs/core/fees) (official protocol documentation).
6. [Solana — Fee Structure](https://solana.com/docs/core/fees/fee-structure) (official protocol documentation; formulas and scheduling).
7. [Solana — Assets on Solana](https://solana.com/docs/tokens) (official token/mint/account/authority documentation).
8. [Solana — Create a Token Account](https://solana.com/docs/tokens/basics/create-token-account) (official ATA derivation, idempotency, and storage-cost documentation).
