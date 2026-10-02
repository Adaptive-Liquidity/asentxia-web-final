# SolMiners reverse-engineering notes

_Observed product mechanics from public product pages — 2 October 2026_

---

## 📋 Verified current loop

1. A creator launches a Pump.fun coin through SolMiners. The product states the creator receives 10% of creator fees, 80% goes to that coin’s SOL reserve, and the platform receives 10%.[^1]
2. A wallet holding at least $50 of the coin receives a mining agent at the next five-minute shift change. Larger holdings map to gear tiers and more power; time held increases level.[^2]
3. Every funded 60-second round draws half of eligible agents without repeats, assigns each winner a random ore, and distributes a fraction of the reserve directly in SOL. The product says a usual round uses 25% of the reserve.[^3]
4. The outcome is replay-verifiable: a commitment to a server seed is published, a later Solana blockhash supplies a public seed, and the browser can replay winners, ores, and payouts after seed reveal.[^3]
5. User-facing objects are a mine, an agent/miner profile, gear/level, ore discoveries, a payout history, a reserve, and a public round proof.[^2][^4]

## 🎯 Confirmed engagement assets

- **One-line hook:** hold a coin and an agent automatically digs SOL.
- **Immediate spectacle:** a mine scene, named miners, rare ores, and a visible payout feed turn fee distribution into a game.
- **Recurring anticipation:** 60-second rounds; new agents become eligible on five-minute shift changes.
- **Status/identity:** public miner names, gear, level, best find, total SOL found, and mine theme.
- **Trust primitive:** independently replayable round mechanics and direct-wallet payouts.
- **Creator wedge:** opening a coin yields an ongoing 10% creator-fee share and a themed mine.

## ⚠️ Structural limitations and product risks

- The primary action is passive holding. Other than entering/opening a mine, the observed loop offers little player agency or skill expression.[^2]
- The visible loop is tied to token value, trading fees, and random payouts. It can be misunderstood as an income or investment proposition; no successor should market low-effort or guaranteed financial gains.
- A high holding threshold and power tiering make engagement capital-weighted. This can produce whale dominance and weak new-user belonging.
- The current design has one main content source: fee flow. If trading falls, reserves and round activity fall. It is not evidence that the core game alone retains users.
- A cryptographic proof verifies the described draw/payout algorithm, but it does not prove a token is valuable, a trade was prudent, or a user should hold it.

## 💡 Product design implication

The valuable primitive to preserve is **a transparent, collectible, recurring distribution event**: a public pool, understandable eligibility, a named/visual agent, a visible result, and a cryptographic audit trail. The next product should add voluntary agency, team coordination, creator missions, fairer access, and non-trading sources of progression; it should not merely increase the frequency or opacity of financial rewards.

## References

[^1]: SolMiners. "Open a mine." https://solminers.xyz/open
[^2]: SolMiners. "SolMiners mine." https://solminers.xyz/mine/8acLTgfVBH5zExB2ez3kE3B7xH2xevsRusii7d8UfdPc
[^3]: SolMiners. "How it works." https://solminers.xyz/how-it-works
[^4]: SolMiners. "Miner profile: Flint Minecart." https://solminers.xyz/miner/Cu1NnAPQZx61rhzZW3syiP4q6TLEk5T9DsjDh5nrBNB3
