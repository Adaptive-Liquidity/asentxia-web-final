# Telegram mini-apps and chat-native game distribution with Solana

## Mechanisms

### 1. Chat message → instant playable surface

**Verified mechanism.** Telegram supports HTML5 games as a native content type that bots can send into one-on-one chats and groups. A game message has a Play button; the bot receives a callback and returns the URL, which Telegram opens in its in-app browser. Games can also be offered through inline mode, so a user can insert a game into another chat without first navigating to a separate website. [1]

**Why it matters for Solana.** A Solana game can make the first session custodial or account-light, then offer wallet connection only for ownership, rewards, or settlement. This keeps the distribution unit a message, not an app-store install. This is a product hypothesis, not a Telegram guarantee: Telegram’s game APIs do not provide Solana identity or custody.

**Risks / falsifiers.** If game callbacks, inline insertion, or in-app browser behavior are unreliable on the target Telegram clients, the distribution advantage collapses. The hypothesis is falsified if wallet prompts on first launch reduce activation below a conventional web funnel, or if most meaningful sessions require users to leave Telegram.

### 2. Deep links and referral parameters create measurable social loops

**Verified mechanism.** Telegram offers seven Mini App launch paths, including inline buttons, menu buttons, a main Mini App, inline mode, direct links, and the attachment menu. A main Mini App direct link can carry a `startapp` parameter that is passed to the app as `start_param`; Telegram also supports sharing media and referral codes to any chat. [2] [3]

**Defensible hypothesis.** A game can encode an invite, match, guild, campaign, or content identifier in the launch parameter, attribute the resulting session server-side, and return a shareable challenge to the originating chat. This is a stronger native loop than a generic “copy link” because the distribution artifact is already a Telegram message.

**Risks / falsifiers.** Parameters are not proof of a human referral; they can be copied, replayed, or farmed. The loop fails if anti-sybil costs exceed player value, if deep-link attribution is lost across clients, or if sharing is perceived as spam. Do not use token rewards to induce deceptive or manipulative distribution.

### 3. Telegram identity as a low-friction account layer, with Solana as an optional settlement layer

**Verified mechanism.** Telegram requires Mini App `initData` to be sent to a backend and validated using an HMAC-SHA-256 construction; the documentation also describes third-party Ed25519 signature validation. The backend can check `auth_date` to reject stale data. [2] Solana’s official documentation separately recommends nonce-based message signing for wallet authentication, with server-side verification and one-time nonce consumption; off-chain signing requires no transaction or network fee. [4]

**Prototype implication.** Create a server account keyed to validated Telegram user/chat identifiers. Offer “play now” without a wallet. When a player needs an on-chain action, request a clearly worded Solana sign-in message or transaction, and bind the resulting public key to the Telegram account only after server verification. This supports progressive onboarding and avoids asking users to sign a transaction merely to log in.

**Risks / falsifiers.** Telegram user identity is not a substitute for wallet ownership, and a Telegram account may be compromised or shared. A wallet signature proves control of an address, not the truth of game claims. The design is falsified if target wallets do not expose a usable mobile/browser handoff inside the Telegram webview or if users cannot distinguish a sign-in message from a spend transaction.

### 4. Social competition and stateful re-entry are built into the client

**Verified mechanism.** Telegram’s Gaming Platform supports chat high scores and service messages when a new high score is set. Mini Apps can be minimized into a compact app bar and reopened without waiting for a full reload. Mini Apps 2.0 adds full-screen portrait/landscape mode, motion tracking, home-screen shortcuts, and media/referral sharing. [1] [3] [5]

**Defensible hypothesis.** A game can use chat-visible score events as a recurring re-entry trigger: a player posts a challenge, friends open it, and the app returns to an existing session. Solana is most useful for scarce or portable state—such as a verified achievement, tournament escrow, or collectible—not for every tap.

**Risks / falsifiers.** Chat scoreboards can encourage botting and do not themselves provide tamper-proof ranking. Full-screen and motion features vary by client, OS, and permission state. The hypothesis fails if frequent on-chain state writes add enough latency or cost to damage the game loop.

### 5. In-Telegram monetization is Stars-first, not Solana-first

**Verified fact.** For digital goods and services sold inside Telegram apps, Telegram requires Telegram Stars (`XTR`). The official documentation says cryptocurrency and other currencies cannot be used for those in-app digital purchases, and Telegram may not display a bot or Mini App to mobile users that uses another payment path. Telegram invoices can be sent to private chats, groups, or channels, and inline invoices can be shared. [6]

**Implication.** A compliant Solana-native game should separate Telegram-native digital consumables from blockchain settlement. Use Stars for in-Telegram digital goods where required; use Solana only for a legally reviewed, clearly disclosed external/on-chain use case, such as user-owned assets or withdrawals, without presenting a crypto payment as a substitute for Stars inside Telegram. This is a compliance constraint, not a recommendation to evade platform rules.

**Risks / falsifiers.** App-store policy, Telegram terms, jurisdictional rules, and token classification can change. A business model that depends on routing Stars through an on-chain token, or on selling a speculative token as the core game loop, is fragile. The model fails if Stars economics, refunds, support obligations, or regulatory review make the expected margin unattractive.

## Evidence statements

- Telegram reported that more than 400 million users interacted with bots and Mini Apps monthly in June 2024, including to play games; in a June 30, 2024 update it reported more than 500 million monthly Mini App users. These are Telegram’s own aggregate claims and are not equivalent to unique game players, retention, or Solana users. [7] [3]
- Telegram’s official game documentation confirms message-based HTML5 games, inline distribution, chat high scores, and a user-initiated share-score function. [1]
- Telegram’s Mini App documentation confirms multiple launch surfaces, direct-link parameters, and server-side validation of Telegram-provided initialization data. [2]
- Solana’s current official frontend guidance favors Wallet Standard/Kit for new apps and identifies Phantom, Solflare, Backpack, and others as Wallet Standard wallets; it also documents a fallback from off-chain message signing to raw message signing. [4] [8]
- Solana Mobile Wallet Adapter is designed for dapps to invoke native wallet authorization and signing on mobile, but its specification describes URI and local-WebSocket handoffs and notes that iOS support is planned for a future version in the cited specification. A Telegram in-app browser therefore needs explicit device/client testing rather than an assumption of seamless wallet handoff. [9]
- Telegram’s Stars documentation places responsibility for delivery, refunds, disputes, terms, and customer support on the merchant bot. [6]

## Risks and falsifiers

1. **Platform policy risk:** Stars-only treatment of in-app digital goods can prevent a Solana-token checkout from being compliant. A policy or app-store review change is a hard constraint, not an engineering problem. [6]
2. **Webview-wallet risk:** Deep links, pop-ups, cookie/storage behavior, and native wallet handoff differ across Android, iOS, Telegram Desktop, and Telegram Web. Measure successful connect/sign rates by client before committing to wallet-gated gameplay. [9]
3. **Sybil and incentive risk:** Telegram virality can produce many low-value accounts. Test retained cohorts and fraud-adjusted value, not installs or bot commands. Treat referral rewards as an abuse surface.
4. **Custody and key-management risk:** Avoid silently creating or controlling wallets for users. If a custodial mode is considered, disclose custody, recovery, withdrawal, and jurisdictional implications and obtain legal review.
5. **Game-economy risk:** On-chain items and rewards can turn a game into a financial product in some jurisdictions and can attract farming rather than play. Falsify the product hypothesis with a no-token control cohort.
6. **Integrity risk:** Telegram high scores are social UX, not cryptographic proof. Server-authoritative game events and replay-resistant signed claims are needed before minting or paying rewards.

## Defensible whitespace

- **Wallet-optional competitive games:** Most of the value can be delivered before wallet connection, while Solana is reserved for portable achievements, tournament settlement, or user-owned items. The whitespace is the transition design—Telegram identity first, wallet proof only at a meaningful moment—not another tap-to-earn clone.
- **Chat-native tournament infrastructure:** Build reusable match links, group challenges, server-authoritative scoring, and optional Solana escrow/settlement. Telegram provides distribution and social context; Solana provides verifiable settlement. This separation is a hypothesis that must be validated with latency, fraud, and policy tests.
- **Portable achievement graph:** Issue selectively verifiable on-chain attestations for milestones that matter outside one game, while keeping routine progression off-chain. The differentiated product is a trust and portability layer, not speculative asset issuance.
- **Cross-client reliability as a moat:** A compatibility harness covering Telegram iOS, Android, Desktop, and Web plus major Wallet Standard wallets is more defensible than assuming one wallet flow works everywhere. Publish observed success rates and graceful fallbacks.

## Prototype implications

1. Build a 60–90 second multiplayer or score-attack game launched from a bot message and a `startapp` deep link. Include an inline-share challenge and a chat-visible result.
2. Keep the first session walletless. Validate Telegram `initData` on the backend; never trust a client-supplied Telegram user object or score.
3. Add a second-stage “claim achievement” flow using a server-issued, single-use Solana sign-in nonce. Prefer readable off-chain signing where supported; fall back only with explicit UI, and never use a no-op transaction as the default login method. [4]
4. Test Wallet Standard discovery and mobile wallet handoff inside Telegram webviews across Android/iOS/Desktop/Web. Record launch, connect, sign, return-to-app, and cancellation rates by wallet and client. [8] [9]
5. Use Stars for any in-Telegram digital consumable in the prototype. Treat any Solana payment, mint, or withdrawal path as a separate legal/product review track. [6]
6. Run a control experiment with no token rewards. Success metrics should be D1/D7 retention, completed matches per retained user, invite conversion, fraud rate, median time to first play, and successful wallet-claim rate—not token volume.

## References

[1]: https://core.telegram.org/bots/games "Telegram Gaming Platform"
[2]: https://core.telegram.org/bots/webapps "Telegram Mini Apps"
[3]: https://telegram.org/blog/mini-app-bar-paid-media-and-more "Mini App Bar, Paid Media, Story Search & More"
[4]: https://solana.com/docs/frontend/messages-and-auth "Sign Messages & Authenticate Users"
[5]: https://telegram.org/blog/fullscreen-miniapps-and-more "Mini Apps 2.0: Full-Screen Mode, Home Screen Icons, Geolocation and 10 more features"
[6]: https://core.telegram.org/bots/payments-stars "Bot Payments API for Digital Goods and Services"
[7]: https://telegram.org/blog/telegram-stars "Telegram Stars: Pay for Digital Goods and More"
[8]: https://solana.com/docs/frontend/web3-compat "Migrating to Kit"
[9]: https://solana-mobile.github.io/mobile-wallet-adapter/spec/spec.html "Mobile Wallet Adapter 2.0 specification"
