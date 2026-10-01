# Solana Actions and Blinks: technical distribution mechanics

**Scope.** This memo treats an **Action** as the API/protocol surface that composes a signable Solana operation, and a **Blink** as a shareable, metadata-rich URL that lets an Action-aware client render that operation in another surface. The distinction is important: a Blink is distribution and presentation; the Action server remains the transaction-construction and business-logic endpoint. This is a verified description of the current specification, followed by clearly labeled hypotheses for a proposed Solana-native gaming and web-platform ecosystem.

## Mechanisms

### 1. A website URL is mapped to an Action API through `actions.json`

The specification defines `actions.json` as a root-domain file whose `rules` map a website `pathPattern` to an Action API `apiPath`. The official type declarations describe this as the rule that tells clients “what website URLs support Solana Actions” and how Blink URLs reach the API. Relative paths are preferred, but absolute paths are supported. [1]

This is a distribution primitive rather than a blockchain primitive: the same canonical game URL can be rendered as a normal web page for non-aware clients and as an executable Blink for clients that understand the protocol. Solana’s product documentation says that an `actions.json` file must be published at the domain root to self-register a Blink, while trusted-client unfurling can still require registry verification. [2]

**Evidence statement (verified):** URL-to-API mapping lets a game product attach Actions to existing item, quest, governance, or checkout routes without forcing every user through a separate dApp route. The protocol does not itself guarantee that a social network, wallet, or browser will unfurl the URL; each client decides whether and how to do so. [1] [2]

**Risk / falsifier:** A prototype that assumes every URL surface will unfurl is falsified by the official documentation’s explicit client-specific allow-list behavior. Measure actual render and click-through rates separately for wallet extensions, mobile wallets, Discord/bots, QR scanners, and ordinary browsers.

### 2. GET metadata, then POST account-bound transaction construction

An Action-aware client first performs a CORS-compatible GET to obtain metadata: title, icon, description, button label, and optional linked actions. The client then POSTs an `account` public key (and, in the v2 type declarations, optional user-input `data`) to obtain the operation for that wallet. [1] [3]

For a transaction Action, the POST response contains a base64-encoded serialized transaction. The client decodes and deserializes it, sets the fee payer and recent blockhash when the transaction is not already partially signed, validates signatures, and asks the wallet to sign only for the requested account. The specification explicitly treats server-returned transactions as untrusted and requires rejection if an unexpected signature is required. [1]

**Evidence statement (verified):** The server can retain complex off-chain and on-chain business logic while the client supplies the user’s account and controls final signing. The official announcement describes Actions as API endpoints returning serialized transaction messages, and the specification defines the GET/POST exchange and transaction validation rules. [1] [4]

**Risk / falsifier:** Transaction simulation and wallet review are necessary but not sufficient safety guarantees. A malicious or compromised Action server can return a transaction whose instructions differ from the UI copy. A game prototype should compare intended asset IDs, amounts, recipients, and program IDs against the decoded transaction and treat simulation failures, unexpected account changes, or stale blockhashes as hard errors.

### 3. Linked actions turn one Blink into a compact, parameterized UI

A GET response may include multiple `LinkedAction` entries. Each entry supplies a label, an endpoint, and optional typed parameters. The official examples show fixed buttons such as “Stake 1 SOL” and “Stake 5 SOL,” plus an input whose value is substituted into an endpoint path or query parameter. The v2 type declarations add transaction, message, POST, and external-link action types, as well as client-side validation hints such as required fields, patterns, min/max values, and selectable options. [1] [3]

**Evidence statement (verified):** A Blink can expose a small action surface—such as buy, claim, equip, vote, or trade—without shipping a full application UI into every host surface. The host client chooses how to render the metadata and inputs; the Action API remains responsible for validating all inputs server-side. [1] [3]

**Risk / falsifier:** Client feature parity is not assured. Some clients may ignore newer parameter types, external links, or multiple buttons. Falsify the assumption of “write once, identical UI everywhere” by testing the same response in at least one desktop extension, one mobile wallet/interstitial, one bot/client, and a plain browser fallback.

### 4. Action chaining supports post-confirmation game flows

A POST response can include `links.next`. The next link can be an inline action or a same-origin POST callback. After confirmation, a client can send the transaction signature, account, and optional server state to obtain the next action. The specification lists chaining uses including multiple sequential transactions, wallet-specific metadata refresh, server-side confirmation/validation, and a customized success state. [1] [3]

**Evidence statement (verified):** Chaining is a protocol-level way to express a multi-step flow while keeping each step separately previewable and signable. For a game this could represent “purchase item → claim receipt → equip item,” but the protocol does not make the flow atomic: an earlier transaction can confirm while a later step fails or is abandoned. [1]

**Risk / falsifier:** A server that treats a callback as proof without independently checking the signature and on-chain state is vulnerable to replay, incorrect network assumptions, or stale state. A prototype should make callbacks idempotent, verify the signature against the expected account and cluster, bind any opaque state to a nonce/session, and provide a recovery path after partial completion.

### 5. Distribution is mediated by client trust, registries, and interstitial fallbacks

Blinks are ordinary URLs when no Blink-aware wallet or client is present. With an extension or integrated client, the URL may render an interactive preview and invoke a wallet; otherwise it can fall back to the existing dApp/site or an interstitial signing page. [2] [4]

The official documentation says clients may use allow lists and that Dialect maintains a public pre-verification registry. At launch, only registered Actions were to unfurl in certain social feeds; unregistered links could render as ordinary URLs, while the Dialect interstitial could still render and show registry status. [1] [2] The product FAQ also warns that the Blink is executed from a different origin (for example, a social network) than the Action endpoint, so users should exercise care. [2]

**Evidence statement (verified):** Distribution is therefore a two-sided adoption problem: developers publish compliant endpoints and metadata, while wallets, social clients, bots, and interstitial providers decide which URLs to preview and how much trust friction to add. The protocol does not grant universal distribution or wallet support. [1] [2] [4]

**Risk / falsifier:** Registry approval, allow-list inclusion, or an extension install does not establish that a transaction is economically safe. Measure the conversion impact of trust prompts and fallback pages, and never use “unfurl rate” as a proxy for user comprehension or transaction safety.

## Defensible whitespace for the proposed ecosystem

The strongest defensible opportunity is not another generic “tip” or “buy” Blink. It is a **game-domain action layer** that combines verifiable item intent, server-authoritative inventory rules, and recovery-aware chained flows. The protocol already standardizes transport and signing, but it does not standardize game semantics such as item schemas, entitlement proofs, rental/escrow state, cooldowns, anti-replay policy, or human-readable instruction inspection. **Hypothesis:** a compatibility layer that emits standard Actions while also publishing a machine-readable game intent and a client-side transaction-policy check could reduce integration and support costs across many games.

A second, narrower whitespace is **distribution observability**. The official sources describe registries, clients, and interstitials, but do not provide a cross-client guarantee or a universal funnel metric. **Hypothesis:** a self-hosted gateway that records GET-to-POST-to-confirmation outcomes, client capability/version, simulation rejection reasons, and fallback usage—without collecting private keys—could become valuable infrastructure for game publishers and platform operators.

These are hypotheses, not claims that the protocol promises such a product or that adoption will follow. They should be falsified by testing whether existing SDKs and registries already solve the relevant problem at acceptable cost, and by measuring whether users understand the transaction preview better with the additional game-intent layer.

## Prototype implications

1. Implement one canonical HTTPS Action endpoint plus a root `actions.json` mapping for a narrow loop: **claim a test item → confirm receipt → equip**. Keep the normal webpage as the fallback for non-aware clients.
2. Return minimal, explicit GET metadata and two or three linked actions. Validate all values again on POST; never trust client-side `pattern`, `min`, or `max` hints.
3. Decode and inspect the returned transaction in the prototype before signing. Assert expected program IDs, mint/asset IDs, recipient accounts, token amounts, fee payer, cluster, and signer set. Simulate before requesting approval.
4. Use a same-origin callback for the next step. Make callback processing idempotent and keyed by transaction signature plus account; independently verify finality and expected state transition.
5. Build a wallet/interstitial/browser fallback matrix. Record whether each surface renders a Blink, shows a trust prompt, falls back to a webpage, or fails CORS. Treat registry/client support as an integration dependency, not a protocol guarantee.
6. Add abuse controls at the Action server: rate limits, replay-resistant state/nonces where appropriate, expiration for quotes, deterministic error messages, and an audit log that contains transaction metadata but never signing secrets.

## References

[1]: https://solana.com/docs/tools/actions "Solana Actions and Blinks specification documentation"
[2]: https://solana.com/solutions/actions "Solana Actions product overview and distribution FAQ"
[3]: https://github.com/solana-developers/solana-actions/blob/main/packages/actions-spec/index.d.ts "Solana Actions v2.0 TypeScript specification declarations"
[4]: https://solana.com/news/blinks-blockchain-links-solana-actions "Solana Foundation announcement: Blockchain Links and Solana Actions"
[5]: https://github.com/solana-developers/solana-actions "Official Solana Actions SDK and examples repository"
