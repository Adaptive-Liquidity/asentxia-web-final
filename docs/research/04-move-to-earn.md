# Move-to-earn incentive loops: STEPN-style mechanisms and failure modes

**Scope.** This memo treats “move-to-earn” as a system that converts verified physical activity into tradeable or redeemable digital rewards. It separates facts documented by STEPN or credible research from hypotheses about a future Solana-native ecosystem. The point is not to label STEPN a fraud or to predict a token price; it is to identify design failure modes that a prototype should make observable and testable.

## Mechanisms, evidence, and design implications

### 1. Emission–sink imbalance creates reflexive token dilution

**Verified mechanism.** STEPN’s official documentation describes GST as an “infinite supply” utility token earned by walking, jogging, or running. It lists sinks including minting, sneaker repair/HP restoration, leveling, gem upgrades, sockets, mystery boxes, and enhancements. GMT, by contrast, is capped at 6 billion and has separate governance/marketplace uses. [1] The design therefore depends on activity-linked issuance being matched by users’ willingness to spend GST on in-game actions; burns alone do not guarantee equilibrium.

**Evidence statement.** A 2024 peer-reviewed study of P2E economies found that token investment value is a core factor affecting active users: rising token prices are associated with rising activity, while slowing growth or falling value can reduce activity. It identifies external stimuli—including in-game incentives, market sentiment, and technological progress—as important drivers of token prices and argues that sustainability requires long-term balance. [3] This is consistent with, but does not by itself prove, a STEPN-specific causal chain.

**Risk / falsifier.** If a system can retain users while token value falls, with sinks funded by non-speculative utility and stable external revenue, the dilution hypothesis is weakened. Falsifying measurements should include net token issuance, sink spend per active user, retention by reward-price cohort, and the percentage of rewards sold rather than consumed. A hard failure is positive issuance plus declining sink spend and retention.

**Defensible whitespace.** Use rewards primarily as bounded, non-cash progression credits or access rights, while making any tradeable emissions a small, budgeted subsidy. The differentiated asset is not “higher APY”; it is auditable utility demand that remains useful when token prices are flat.

**Prototype implication.** Instrument a daily monetary-flow dashboard before adding markets: emissions, burns, treasury subsidy, user purchases, sell pressure, and cohort retention. Run a low-emission control cohort and a reward-price shock test. Do not promise ROI.

### 2. Buy-in plus payback framing turns growth into a reflexive liquidity loop

**Verified mechanism.** STEPN requires at least one sneaker to obtain energy, and all earning actions require energy. More sneakers generally provide more energy, up to a 20-energy maximum; unused energy does not carry over. The official FAQ also says activation codes were designed to prevent spikes in new memberships. [2] These constraints ration earning capacity and make an initial asset purchase, or access to one, economically salient.

**Evidence statement.** Brookings describes NFT-game payouts as vulnerable to boom–bust crypto cycles and says NFT assets may require continuing player growth or additional purchases to maintain value. It characterizes the resulting incentive as prioritizing new-player acquisition and notes the risk that players may not understand it. [5] This is a general analysis of NFT gaming, not proof that STEPN meets a legal definition of a pyramid or Ponzi scheme.

**Risk / falsifier.** The growth-dependence hypothesis is falsified if the system reaches stable retention and payout coverage from recurring non-player revenue—such as subscriptions, brand-funded challenges, or health-program contracts—without requiring new entrants to buy appreciating assets. Test net new deposits versus withdrawals, secondary-market depth, acquisition cost, and payout coverage excluding treasury-funded rewards.

**Defensible whitespace.** Separate “fitness participation” from “financial upside”: provide a free path with meaningful gameplay, make assets optional rather than required for earning, and cap claims to transparent benefits. A sponsor-funded challenge can pay for verified outcomes without implying that later entrants fund earlier users.

**Prototype implication.** Ship a no-buy-in sandbox, an earned-access path, and an asset-holder path. Show a user’s cumulative spend, withdrawals, and subsidy source in plain language. Gate speculation features behind risk disclosures and test whether the core loop remains fun when rewards are zero.

### 3. External shocks can transmit directly into activity and token liquidity

**Verified mechanism.** In May 2022, Bloomberg reported that STEPN’s operator would effectively bar users in China from using the app from July 15. Bloomberg reported GST falling about 10% and GMT falling more than 30% before rebounding after the announcement. [4] The report is a contemporaneous market observation, not an estimate of the app’s full causal fundamentals.

**Evidence statement.** STEPN’s current FAQ documents multiple independent realms: Solana, BSC, and Polygon have separate servers, players, sneakers, economic mechanisms, and prices; GST is not shared across realms, while GMT is shared. [2] This verifies that a move-to-earn economy can be exposed both to jurisdictional shocks and to fragmented liquidity/price surfaces.

**Risk / falsifier.** A multi-rail system may absorb a regional shock if users can move seamlessly, legal access is diversified, and rewards are funded independently of speculative liquidity. Measure activity, spreads, withdrawals, and reward coverage by geography and realm during controlled or historical shocks. Do not infer causation from one price move alone.

**Defensible whitespace.** Design jurisdiction-aware participation with portable reputation and non-financial achievement records, but do not promise that a token or NFT is universally usable. Keep the fitness/game layer functional during chain or market outages and make regional restrictions explicit before users commit funds.

**Prototype implication.** Maintain an off-chain activity ledger with delayed settlement and a circuit breaker for reward payouts. Simulate a 30% regional user loss, a chain halt, and a 50% market-price drawdown. Success means the core game remains usable and obligations are bounded rather than requiring emergency token issuance.

### 4. Parameter control and measurement noise undermine predictable “earnings”

**Verified mechanism.** STEPN’s FAQ says GST returns depend on shoe attributes, count, quality, type, speed, durability, GPS and internet quality, gems, and randomized per-minute calculations. It explicitly declines to provide ROI estimates or optimal sneaker recommendations. [2] The same FAQ says poor GPS or a “moonwalking” determination can reduce or eliminate GST, and a rooted or altered device may earn zero.

**Evidence statement.** These official caveats mean that the apparent wage rate is not a stable function of steps alone. Brookings further notes that NFT-game operators may change economic parameters in attempts to stabilize markets; it describes such interventions as capable of destroying player income and appeal. [5] The latter example concerns Axie Infinity, so it is comparative evidence about governance risk, not a STEPN-specific allegation.

**Risk / falsifier.** If independent replay tests show tight earning distributions across devices, locations, network conditions, and cohorts, measurement risk is smaller. Falsifiers include low variance after controlling for documented inputs and a published, immutable reward function. The practical risk remains if users interpret variable rewards as guaranteed income.

**Defensible whitespace.** Treat movement rewards as probabilistic game feedback, not salary. Publish versioned formulas, confidence intervals, audit logs for anti-cheat decisions, and an appeal path. Keep monetary obligations limited when sensor confidence is low.

**Prototype implication.** Log raw sensor confidence, speed bands, GPS quality, reward version, and adjudication reason. Give users an uncertainty estimate before a session and a dispute export afterward. Conduct device and accessibility testing so anti-cheat does not silently exclude legitimate mobility patterns.

### 5. Fragmented realms and asset requirements add liquidity and lock-in risk

**Verified mechanism.** STEPN says sneakers are realm-specific: a Solana sneaker cannot be used in Binance or Polygon realms, and each realm uses its own GST variant; GMT is shared. The FAQ also describes a 24-hour cooldown after a sneaker reaches a new wallet, and says some iOS purchases have a lock-in period. [2]

**Evidence statement.** Brookings notes that NFT marketplaces can be central points of failure, that blockchain transactions can be irreversible after theft, and that players are exposed to crypto boom–bust cycles and withdrawal restrictions. [5] These are system-level risks, not evidence that every marketplace or chain will fail.

**Risk / falsifier.** Interoperability, deep liquidity, transparent custody, and reliable withdrawals can reduce these risks. Test bridge/settlement failure, forced exit during a cooldown, price spreads between realms, recovery after key loss, and the share of value trapped in non-transferable assets. A system that cannot offer a bounded exit is unsuitable for an “earnings” claim.

**Defensible whitespace.** Keep core identity, achievements, and movement history portable while minimizing mandatory NFTs. Make cross-chain assets optional, use explicit redemption windows, and provide a non-custodial export plus recovery design. Portability should preserve utility, not manufacture speculative scarcity.

**Prototype implication.** Start single-chain on Solana with a server-authoritative activity log and capped settlement reserve. Add cross-chain assets only after proving withdrawal, fraud handling, and price-discovery tests. Publish cooldowns, transfer limits, fees, and failure procedures before sale.

## What a defensible prototype should prove

The first prototype should test **retention without financial expectation**, **payout coverage without new-user deposits**, and **graceful degradation under sensor, chain, jurisdiction, and price shocks**. The key falsifiable metrics are day-30 retention by reward condition, net issuance per retained user, non-speculative revenue per active user, withdrawal success rate, median time to exit, false-positive anti-cheat rate, and the percentage of sessions that remain satisfying with rewards disabled. Any claim that activity “earns money” should be withheld until those metrics are stable and independently reviewable.

## References

[1]: https://whitepaper.stepn.com/other-modules/tokenomic "STEPN Whitepaper: Tokenomic"
[2]: https://support.stepn.com/hc/en-us/articles/5979807297945-Frequently-Asked-Questions "STEPN Help Center: Frequently Asked Questions"
[3]: https://www.mdpi.com/2071-1050/16/15/6587 "Exploring the Sustainable Development of Web3 Game Token Economy"
[4]: https://www.bloomberg.com/news/articles/2022-05-27/nft-app-blocks-users-in-china-sending-digital-tokens-plunging "Bloomberg: NFT App Blocks Users in China, Sending Digital Tokens Plunging"
[5]: https://www.brookings.edu/articles/addressing-the-policy-challenges-raised-by-nft-gaming/ "Brookings: Addressing the Policy Challenges Raised by NFT Gaming"
