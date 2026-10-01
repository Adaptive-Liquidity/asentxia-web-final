# Relay Raid Anchor receipt contract

_Uncompiled source scaffold and contract-level invariants — 2026-10-01_

---

## 🎯 Contract purpose

`relay_raid` records a single, attested round receipt. It does not operate a token, transfer SOL, hold escrow, settle wagers, mint an NFT, or create a redeemable entitlement. The narrow surface is deliberate: the on-chain program records a portable audit point while the authoritative game service remains responsible for score computation.

> **Status:** Source scaffold only. Rust, Cargo, Solana CLI, and Anchor are not installed in the active Sandbox, so this program has not been compiled, tested against a validator, deployed, or audited.

## 🧱 Accounts and authority

| Account | PDA | Authority | Safety purpose |
| --- | --- | --- | --- |
| `Season` | `['season', season_id_le]` | season authority initializes/closes | Fixes attestor, ruleset epoch, and active window |
| `PlayerProfile` | `['player', season, player]` | player creates; authority may revoke future claims | Binds player to season and supports targeted claim pause |
| `RoundReceipt` | `['receipt', season, player, nonce]` | player and configured attestor both sign | Prevents duplicate claims for the same nonce |

The program ID `5sCw7dCGrtqKvbs84UPqvGsBYgmYUruqYADnUUpgCJHH` is a generated development identifier. A production deployment must use a generated, controlled keypair and update `declare_id!`, `Anchor.toml`, tested client constants, governance records, and deployment evidence in one reviewed change.

## 🔐 Instruction contract

| Instruction | Signers | Core checks | Effect |
| --- | --- | --- | --- |
| `initialize_season` | authority | duration positive; attestor non-default | Stores fixed season authority/attestor/window |
| `create_profile` | payer, player | season active | Creates one player profile per season |
| `claim_receipt` | player, attestor | season active/window; profile match/not revoked; bounded score; unexpired grant; unique nonce PDA | Creates immutable receipt record |
| `set_profile_revoked` | authority | `Season.authority` match | Allows future claim eligibility to change; keeps past records |
| `close_season` | authority | current time at/after configured end | Blocks new claims |

`claim_receipt` uses a partially signed transaction model in a later server implementation: the game service/attestor validates a replayed receipt grant, signs the transaction with its protected attestor key, and returns it to the player wallet. The player wallet reviews and adds the player signature. The service must never transmit or expose its attestor private key.

## ⚠️ Invariants and recovery

1. **One claim:** PDA initialization makes duplicate `(season, player, nonce)` claims fail atomically.
2. **Two authorities:** a player signature proves account control; an attestor signature is the explicit trust boundary for score truth.
3. **Bounded replay window:** `expires_at` must not be in the past or beyond the season end.
4. **No value movement:** no instruction invokes a SOL/token transfer or holds liability.
5. **Auditable revocation:** profile revocation blocks future claims but cannot erase an issued receipt.
6. **Closed season:** authority cannot close early under this scaffold. Emergency pause would be a separate, explicitly reviewed instruction with a documented governance and recovery policy.

## 🔧 Reproducible toolchain installation and checks

Install a pinned Solana/Anchor/Rust toolchain in a dedicated development environment before treating this source as executable. The exact version compatibility must be confirmed against Anchor release notes and the lockfile produced by the installation.

```bash
# In a dedicated development environment, not a production signing host.
rustup toolchain install stable
sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)"
cargo install --locked anchor-cli --version 0.30.1

solana-test-validator --reset
anchor build
anchor test
```

Before devnet deployment, add integration tests that assert PDA derivation, duplicate nonce rejection, wrong-attestor rejection, expired-grant rejection, profile-revocation behavior, season-close behavior, and no unexpected lamport/token movement. Use a new controlled program keypair; do not reuse the documented development identifier.
