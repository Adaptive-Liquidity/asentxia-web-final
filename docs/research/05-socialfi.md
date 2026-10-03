# Tap-to-Earn and Gamified SocialFi Retention Mechanics for a Solana-Native Ecosystem

## Scope and bottom line

This memo isolates retention mechanics—not token-price strategy—for a proposed Solana-native gaming and web-platform ecosystem. The strongest design pattern is to make the first action nearly free and legible, then layer **bounded progression, social coordination, and durable utility** on top. “Tap-to-earn” is best treated as an onboarding primitive, not the product: the tap must quickly lead to a choice, a relationship, a collectible, or a game state that remains valuable when emissions decline.

The examples below separate **verified facts** from **hypotheses**. Notcoin is a TON/Telegram example rather than a Solana example; STEPN is the clearest Solana-adjacent lifestyle example; Jupiter and Solana Foundation materials show native reward infrastructure and campaign patterns.

## Mechanisms

### 1. One-tap daily action with an explicit budget, cooldown, or energy meter

**Verified evidence.** A credible product-history account describes Notcoin as a Telegram game built around a “tap-to-earn” mining mechanic, later extended through Notcoin Explore so users could interact with Web3 products in campaigns and earn from a campaign pool. The same account says projects acquired NOT and contributed it to campaign pools, creating a sponsor-funded engagement loop rather than only an always-on faucet ([CryptoPotato, 2024](https://cryptopotato.com/what-is-notcoin-not-the-viral-token-coming-to-telegram-open-network/)). STEPN’s official whitepaper describes a simple repeated real-world action—walking, jogging, or running—with potential GST/GMT and NFT rewards, and explicitly frames the app as combining game and social elements ([STEPN Whitepaper](https://whitepaper.stepn.com/)).

**Hypothesis.** For Solana, the equivalent should be an off-chain or session-level tap/action that resolves instantly, while only meaningful checkpoints settle on-chain. A finite daily energy budget, cooldown, or action deck can create anticipation and prevent an unlimited bot-friendly faucet. The tap should reveal a next decision (choose a quest, challenge a friend, upgrade a collectible), not merely increment a balance.

**Risk / falsifier.** If day-7 retention does not improve over a non-rewarded control, the tap is probably empty stimulation. If bot-adjusted activity dominates verified-human activity, the mechanic is not defensible. Never promise a financial return; rewards should be discretionary utility or points until a compliant, sustainable distribution is established.

### 2. Quest chains, streaks, milestones, and badges instead of a single emission

**Verified evidence.** Jupiter’s official Rewards page presents “real incentives from real projects,” with live/ended campaigns and a user-facing view of total disbursed, earned, and claimable rewards ([Jupiter Rewards](https://jup.ag/rewards)). Solana Foundation’s official open-source Rewards program supports authority-managed points and describes points as non-transferable loyalty/reputation rewards; it also supports direct, Merkle, and continuous reward distributions ([Solana Foundation Rewards repository](https://github.com/solana-foundation/rewards)). Solana Mobile’s official search result describes app quests that issue badges stamped with the app, quest, and day earned; the page was not extractable in this environment, so treat that detail as a reported product description and verify before implementation ([Solana Mobile announcement](https://solanamobile.com/blog/solana-mobile-heads-into-summer-with-apps-quests-and-builders)).

**Hypothesis.** A three-layer cadence is likely stronger than raw taps: (a) a short daily action, (b) a weekly quest chain that requires varied play/social actions, and (c) milestone badges that unlock access, cosmetics, reputation, or creator privileges. Streaks should have recovery tokens or grace windows so one missed day does not permanently erase progress. Use points/badges for most progression and reserve transferable assets for earned, legible moments.

**Risk / falsifier.** Streak pressure can feel extractive and produce low-quality check-ins. Measure completed quests per active user, week-4 retention, social actions that persist after rewards, and complaint/opt-out rates. A falsifier is high quest completion but no increase in non-incentivized sessions.

### 3. Social squads, referrals, and creator-funded campaigns with shared outcomes

**Verified evidence.** The Notcoin account says users could discover Web3 products, play games, and participate in ecosystem campaigns; developers could offer products to the community, while projects funded campaign pools with NOT. This documents a campaign-marketplace pattern, though not a Solana implementation ([CryptoPotato, 2024](https://cryptopotato.com/what-is-notcoin-not-the-viral-token-coming-to-telegram-open-network/)). STEPN’s official whitepaper calls the product both game and social, while its core repeated activity is externally observable movement ([STEPN Whitepaper](https://whitepaper.stepn.com/)). Friend.tech’s official site exposes “Keys” and “LP” as product primitives, demonstrating access/relationship objects rather than a generic social feed; the presently extractable page is sparse, so do not infer more detailed economics from it ([friend.tech](https://www.friend.tech/)).

**Hypothesis.** Solana-native campaigns should reward a squad for completing complementary roles—play, invite, create, curate, or verify—rather than paying a pure referral bounty. Creator-funded quests can direct users to a specific game or piece of content, with transparent caps and shared unlocks. Referral rewards should be delayed until the referred account completes meaningful, anti-sybil milestones; this makes social growth useful without turning the product into an invitation pyramid.

**Risk / falsifier.** Referral spam, sybil clusters, collusion, and creator vanity metrics are predictable failure modes. Falsify the mechanism if referred users have materially lower 30-day retention than organic users, or if most “social” actions occur only immediately before reward snapshots. Do not use wash trading, fake engagement, or market manipulation as a growth tactic.

### 4. Progression with non-transferable points first; vesting, proofs, and claims for scarce rewards

**Verified evidence.** The Solana Foundation Rewards program is a concrete technical reference: it supports four distribution types—direct allocations with vesting, Merkle-proof claims, continuous proportional pools, and authority-managed points. Its points implementation uses Token-2022 extensions including NonTransferable and PermanentDelegate, with user-cosigned use/burn flows; its continuous pools accrue rewards using a reward-per-token accumulator and permit opt-in/opt-out ([Solana Foundation Rewards README](https://github.com/solana-foundation/rewards)). Notcoin’s documented launch history illustrates the opposite risk: the cited account reports 78% of supply allocated to miners and 100% unlocked on day one, while warning that not all airdropped tokens need enter trading immediately ([CryptoPotato, 2024](https://cryptopotato.com/what-is-notcoin-not-the-viral-token-coming-to-telegram-open-network/)).

**Hypothesis.** Use non-transferable points for experimentation, reputation, access, and anti-farming scoring. Convert only selected milestones into claimable collectibles or vested rewards. Merkle snapshots can make large, periodic campaign claims scalable; continuous pools are better for an ongoing eligible balance or participation program. Keep a public rulebook for eligibility, caps, revocation, and appeals.

**Risk / falsifier.** Non-transferable points can feel worthless if they have no utility, while vesting can reduce perceived reward salience. If users stop engaging once points cannot be sold, the product needs stronger utility—not automatically a liquid token. Security audits, sybil analysis, and clear revocation rules are prerequisites; reward contracts should not be treated as audited merely because the reference program is open source.

### 5. Collectible and identity progression that survives the campaign

**Verified evidence.** STEPN’s official documentation says users may receive NFTs alongside GST/GMT and use or convert game tokens and NFTs within the game or to other token forms ([STEPN Whitepaper](https://whitepaper.stepn.com/)). Solana Foundation’s reward program models on-chain accounts for direct recipients, Merkle claims, reward pools, and points, allowing reward state and claim state to be represented and checked on-chain ([Solana Foundation Rewards repository](https://github.com/solana-foundation/rewards)).

**Hypothesis.** A Solana web-platform should make the durable output of a campaign a portable achievement: a cosmetic, creator edition, access pass, or reputation badge with provenance. The collectible should unlock future play or social status; it should not be marketed as an investment. Progression can be composable across games while preserving user consent and privacy (for example, disclose only a badge tier, not a full activity history).

**Risk / falsifier.** NFT issuance can create wallet friction, spam, and speculative behavior. Test whether collectibles improve return visits or unlock use; burn or archive low-value artifacts, batch claims where possible, and avoid forcing users to pay fees for every tap. If collectible ownership does not change access, status, or play, it is decorative overhead.

## Defensible whitespace

1. **Proof-of-contribution rather than proof-of-click.** Solana has cheap settlement and a reference reward program with points, vesting, Merkle, and continuous-pool primitives, but the differentiated product opportunity is to reward useful contributions—curation, verified playtest feedback, creator collaboration, or successful cooperative goals—rather than volume of taps.
2. **A campaign operating system for creators and games.** Notcoin demonstrates sponsor-funded campaigns, and Jupiter demonstrates a campaign dashboard, but a Solana-native layer could standardize quest schemas, caps, eligibility proofs, creator attribution, and post-campaign analytics across games without requiring each app to invent tokenomics.
3. **Human-scale social loops with graceful anti-sybil friction.** Use delayed referral eligibility, device/account reputation, rate limits, and challenge diversity while keeping the first action permissionless. The whitespace is a system that feels social and game-like without demanding invasive identity or creating a financialized referral pyramid.
4. **Utility-first portable achievements.** Make badges and collectibles unlock content, access, and status across an ecosystem. This is more defensible than a copy of a liquid “daily mining” token because the value is in networked participation and creator/game integrations.

## Prototype implications

- Build a two-week vertical slice: one instant off-chain tap/action, one daily energy budget, three weekly quests, a squad goal, one creator-funded campaign, and one badge that unlocks a real in-game or web feature.
- Keep action telemetry off-chain initially; settle only quest completion, badge mint, and campaign claim. This tests retention before paying per-action transaction costs.
- Implement reward states explicitly: `unearned → pending verification → earned points → eligible claim → claimed`; expose caps, expiry, vesting, and revocation in the UI.
- Use non-transferable points for the first experiment; do not launch a speculative token. If scarce rewards are needed, use a capped Merkle claim or vesting schedule, and publish the eligibility rule before the campaign starts.
- Instrument cohorts: D1/D7/D28 retention, non-incentivized sessions, quest diversity, referred-user D30 retention, squad completion, bot/sybil flags, cost per retained user, and the share of rewards that unlock actual utility.
- Run randomized tests against (a) no rewards, (b) taps only, (c) quests/badges, and (d) quests plus social coordination. A successful mechanic must retain users after a reward pause or reduction.
- Security and policy gates: rate-limit claims, use replay-resistant proofs, audit any on-chain program, provide an appeal path for false positives, and do not frame rewards as guaranteed profit or encourage wash trading/manipulation.

## References

1. [Solana Foundation — Rewards program repository and README](https://github.com/solana-foundation/rewards)
2. [STEPN — Official Whitepaper overview](https://whitepaper.stepn.com/)
3. [Jupiter — Official Rewards hub](https://jup.ag/rewards)
4. [friend.tech — Official product site](https://www.friend.tech/)
5. [Solana Mobile — Apps, quests, and builders announcement](https://solanamobile.com/blog/solana-mobile-heads-into-summer-with-apps-quests-and-builders)
6. [CryptoPotato — What is Notcoin? (product-history/market-mechanics secondary source)](https://cryptopotato.com/what-is-notcoin-not-the-viral-token-coming-to-telegram-open-network/)
