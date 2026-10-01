# Solana Technical Primitives for a Game Platform

**Scope and method.** This memo evaluates five Solana-native primitives for a proposed game and web-platform ecosystem: Token-2022, compressed NFTs/state compression, Solana Actions, priority fees, and swap integration. The evidence statements below are limited to facts read from current official Solana or Jupiter technical documentation. Product strategy, whitespace, and prototype recommendations are hypotheses, not verified facts.

## 1. Token-2022: programmable asset policy at the mint/account layer

**Mechanism.** Token-2022 (the Token Extensions Program) adds optional extensions to token mints and token accounts. The official extension set includes transfer fees, non-transferability, transfer hooks, metadata, groups, confidential-transfer components, permanent delegates, pausing, and scaled UI amounts. Extension state is stored in TLV data after the base account state and is deserialized according to the enabled extensions ([Solana Token Extensions docs](https://solana.com/docs/tokens/extensions)).

**Evidence (verified facts).** Extensions are generally initialized during mint or token-account creation, and most cannot be added after initialization; some extensions are mutually incompatible (the official example is NonTransferable with TransferFeeConfig). A transfer hook requires a CPI to a program implementing the transfer-hook interface. These constraints are explicit in the official docs, so mint design is an up-front schema decision rather than a later configuration toggle.

**Risks / falsifiers.** The platform should not assume every wallet, exchange, indexer, or game SDK supports every extension equally. The hypothesis that transfer hooks or transfer fees improve game economies is falsified if integration coverage, compute cost, or user comprehension causes materially worse completion rates than plain SPL tokens. Confidential-transfer and authority features also create operational/audit complexity; they are not substitutes for legal or accounting review.

**Defensible whitespace (hypothesis).** A game-specific asset policy layer could use a small, documented subset of extensions—e.g., Token Metadata/Group plus a transfer hook for game-rule checks—while exposing a plain-token fallback for interoperability. The defensible angle is not “another token”; it is lifecycle policy (mint, bind, pause, retire, or gate) that is explicit and testable.

**Prototype implications.** Build a devnet mint matrix before choosing production semantics: (a) fungible currency with no exotic extension, (b) non-transferable achievement token, and (c) transfer-hook-controlled item receipt. Record account sizes, rent, transaction compute, wallet display behavior, and failure modes. Freeze the extension set in a versioned mint spec and test incompatible combinations at initialization.

## 2. Compressed NFTs: cheap, high-cardinality game state with proof/RPC dependencies

**Mechanism.** State compression stores Merkle roots on-chain while ledger updates make a large off-chain data set verifiable and permissionless. Compressed NFTs (cNFTs) use concurrent Merkle trees; Bubblegum handles mint, transfer, and replace operations. Solana’s technical explainer says trees have configurable depth/capacity, buffer size for concurrent updates, and canopy height to keep part of the proof path on-chain ([Solana cNFT explainer](https://solana.com/news/how-to-use-compressed-nfts-on-solana)).

**Evidence (verified facts).** The explainer reports 2,400–24,000x lower minting cost than uncompressed NFTs in its cited context and describes capacities from 2^3 to 2^30 leaves. Minting does not require proofs, but modifications such as transfer or metadata updates require a current Merkle proof and owner/delegate signature. RPC support is important for a usable read path; the page names Helius, SimpleHash, and Triton as supporting providers. Concurrent trees can fast-forward stale proofs within the configured buffer, and tree design affects write-lock contention and composability.

**Risks / falsifiers.** A cNFT design is a poor fit if gameplay needs arbitrary per-item synchronous mutation, because proof retrieval, tree contention, canopy/rent choices, and RPC/indexer dependence add latency and failure modes. The low-cost claim should be re-measured under current fees and the intended tree configuration, not copied as a guaranteed unit cost. Falsify the “mass onboarding” hypothesis if proof freshness or indexer availability produces unacceptable transfer/claim failure rates.

**Defensible whitespace (hypothesis).** Use cNFTs for large, mostly append/read collections—season passes, map discoveries, cosmetic drops, attendance, or achievement leaves—and reserve ordinary accounts/Token-2022 for hot mutable balances. A hybrid ownership model can make the cNFT the durable receipt while the game server or a separate on-chain program tracks short-lived combat state.

**Prototype implications.** Prototype a tree-per-season or tree-per-campaign rather than one global tree. Measure mint batch throughput, proof fetch latency, stale-proof recovery, tree write-lock contention, canopy rent, and behavior across at least two DAS/cNFT-capable RPC providers. Treat the RPC/indexer adapter as a replaceable interface and keep a re-sync path from on-chain roots/ledger history.

## 3. Solana Actions: transaction intent as a portable web endpoint

**Mechanism.** Actions define an HTTP request/response flow that returns a transaction for a wallet/client to preview, sign, and submit. The official specification requires Action URLs to be absolute HTTPS URLs; endpoints must support CORS preflight, GET metadata, and POST requests carrying the user’s base58 account. A successful POST returns a base64 serialized transaction and optional user-facing message or next Action link ([Solana Actions docs](https://solana.com/docs/tools/actions)).

**Evidence (verified facts).** The client should not identify wallet/user on GET; POST includes `{ "account": "<account>" }`. The returned transaction is untrusted: the client/wallet must validate it. If the transaction is unsigned or not partially signed, the client sets fee payer to the requesting account and refreshes the recent blockhash. The specification also requires `Access-Control-Allow-Origin: *` and specified allowed methods/headers for broad client compatibility.

**Risks / falsifiers.** An Action endpoint is not authorization to trust arbitrary transaction bytes. Phishing, misleading metadata, unsafe account metas, replay/expiry mistakes, server-side parameter tampering, and permissive CORS are material risks. The distribution hypothesis is falsified if intended surfaces do not render Actions/Blinks or if users cannot understand the domain and transaction message before signing. Do not design Actions to bypass wallet consent or market controls.

**Defensible whitespace (hypothesis).** Game “intent endpoints” can turn a web page, QR code, support flow, or social post into a wallet-mediated claim, ticket purchase, reward redemption, or tournament entry. The differentiated layer is safe, human-readable, domain-bound transaction construction—not a hidden auto-signing path.

**Prototype implications.** Build one narrow Action: claim a devnet quest reward. Implement GET metadata, OPTIONS CORS, POST account validation, server-side allowlists for program IDs/accounts, fresh blockhashes, transaction simulation, bounded parameters, and clear messages. Test malformed URLs, replay, expired blockhashes, wrong network, oversized inputs, and wallet rejection. Log request IDs without treating the wallet public key as proof of off-chain identity.

## 4. Priority fees: an inclusion-control knob, not a throughput guarantee

**Mechanism.** Solana fees have a base fee and an optional prioritization fee. The official fee documentation states that the priority fee increases the likelihood that the current leader schedules a transaction ahead of competing transactions. For legacy/v0 transactions, it is `ceil(compute_unit_price * compute_unit_limit / 1,000,000)` lamports; the page lists a 5,000-lamport base fee per signature, a 200,000 default CU limit per instruction, and a 1,400,000 maximum CU limit per transaction ([Solana Fees docs](https://solana.com/docs/core/fees)).

**Evidence (verified facts).** The base fee is split 50% burned/50% validator; the prioritization fee is 100% to the validator. The fee is based on the requested compute limit, not merely measured execution, so over-requesting CU can overpay. Solana also exposes recent prioritization-fee samples via `getRecentPrioritizationFees`, including filtering by writable accounts ([RPC method](https://solana.com/docs/rpc/http/getrecentprioritizationfees)).

**Risks / falsifiers.** Priority fees do not guarantee inclusion, finality, or a good user experience; congestion, stale blockhashes, account locks, RPC latency, and failed simulation still matter. A naive fixed “high fee” policy is falsified if it increases cost without improving confirmation SLAs. Overestimating CU directly increases the priority fee under the documented formula, while underestimating can cause compute failure.

**Defensible whitespace (hypothesis).** A game platform can offer policy-based fee budgets by action class—free/low-priority background claims, bounded priority for time-sensitive match settlement, and explicit user consent for expensive bursts—rather than exposing raw micro-lamports. This is an operations/product layer over the protocol, not a promise of fee-free execution.

**Prototype implications.** Instrument simulation CU, requested CU, priority fee, slot-to-confirmation, retries, and failure reason. Sample recent fees for the actual writable accounts, cap the fee budget, and retry only with refreshed blockhash and bounded escalation. Separate UX messaging for “submitted,” “processed,” and “finalized.”

## 5. Swap integration: Jupiter routing with a deliberate control boundary

**Mechanism.** Jupiter’s current Swap API offers a Meta-Aggregator path and a Router path at `https://api.jup.ag/swap/v2`. Meta-Aggregator returns an assembled transaction and uses `/order` + `/execute`; Router returns raw swap instructions through `/build` for custom transactions, CPI, and composability. Jupiter’s official docs say all endpoints require an API key and distinguish managed landing, platform/referral fees, gasless options, and whether transaction modification is allowed ([Jupiter Swap API](https://developers.jup.ag/docs/swap)).

**Evidence (verified facts).** Meta-Aggregator lets multiple routing engines compete and is positioned by Jupiter as the default for most integrations; Router is the choice when the integrator must add custom instructions or CPI. Meta-Aggregator transactions cannot be modified after return; Router gives full transaction control. Jupiter documents slippage, compute-unit/priority-fee, gasless, and transaction-size topics as advanced integration concerns. These are vendor-documented capabilities, not independent guarantees of best execution.

**Risks / falsifiers.** Swaps expose users to price impact, slippage, token risk, route changes, API availability, key/quotas, malicious or unsupported mints, and legal/compliance obligations. Never promise a price or encourage manipulative trading. The claim that “aggregator integration is best” is falsified for a use case requiring deterministic custom instructions, guaranteed account metas, or a route that cannot tolerate managed execution; use Router or a dedicated audited program then.

**Defensible whitespace (hypothesis).** Integrate swaps only where they serve a clear game utility—e.g., onboarding a supported currency, converting rewards under explicit user consent, or treasury rebalancing with caps—not as a speculative casino mechanic. A policy adapter can enforce supported mints, minimum received amount, maximum price impact, per-wallet limits, cooldowns, and a transparent fee schedule before invoking Jupiter.

**Prototype implications.** Start with a devnet/test-token swap or a mainnet read-only quote screen. For execution, pin supported mint allowlists, slippage and price-impact caps, quote expiry, exact-decimal handling, and simulation checks. Compare Meta-Aggregator and Router on the same flows; retain raw quote/route/transaction metadata for audit and user receipts. Keep the Jupiter API key server-side and make provider replacement possible.

## Cross-primitive architecture hypothesis

Use **Token-2022 for policy-rich fungible/non-transferable assets**, **cNFTs for high-cardinality durable receipts**, **Actions for portable wallet-mediated intents**, **priority-fee policy for bounded inclusion**, and **Jupiter Router/Meta-Aggregator behind a risk-controlled swap adapter**. The key design principle is to keep hot gameplay state off the cNFT path, keep transaction construction reviewable, and treat RPC/indexing, wallets, liquidity providers, and fee markets as replaceable dependencies.

## References

1. https://solana.com/docs/tokens/extensions
2. https://solana.com/news/how-to-use-compressed-nfts-on-solana
3. https://solana.com/docs/tools/actions
4. https://solana.com/docs/core/fees
5. https://solana.com/docs/rpc/http/getrecentprioritizationfees
6. https://developers.jup.ag/docs/swap
