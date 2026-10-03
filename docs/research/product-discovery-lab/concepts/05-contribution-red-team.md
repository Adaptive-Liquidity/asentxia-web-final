# StewardSignal red-team review

_Independent challenge of the “Partner-acknowledged micro-contributions” concept; decision: reframe before building a software prototype._

---

## 🧭 Verdict

**Reframe, not advance.** The concept has a real operational shape, but the proposed product is currently a coordination wrapper around workflows that already exist: a public accessibility map, a standard form or email intake, a spreadsheet/CSV export, and a steward’s ordinary maintenance queue. The strongest counterexample is not a competing startup. It is the combination of **Wheelmap/OpenStreetMap for place facts** and a partner’s existing reporting channel. Wheelmap already lets people mark wheelchair accessibility, while OpenStreetMap defines explicit values such as `yes`, `limited`, `no`, and `designated`, plus descriptions for uncertainty.[^1] [^2]

StewardSignal becomes defensible only if a named steward has a repeated, narrow review problem that those tools do not solve: for example, a private campus accessibility team needs fresh, consented observations of a specified set of entrances, each tied to a maintenance ticket or visit plan. That is a **private verification queue**, not a general contribution network and not a portable “receipt” product.

The current concept overestimates the contributor’s durable value. A receipt saying “accepted” is not useful unless an independent recipient honors it or the contributor can use it in a real future decision. It also overstates the ease of review. eBird’s mature analogue shows that filters, evidence requirements, expert queues, reviewer communication, and unresolved “unconfirmed” records are a substantial operating system, not a thin status field.[^3]

> **Decision:** Do not build the full vertical slice yet. Run a deliberately low-tech comparison against the steward’s current form/email workflow. Advance only if the partner’s downstream action and review savings are both observed, not merely if contributors enjoy the mission.

## 🔍 Strongest counterexample: existing workflows are already adequate

### Public place information already has a canonical-ish home

For accessibility facts, OpenStreetMap offers a shared, editable data model with location-level tags and a description field. Its own guidance says the tag should be used when the mapper is sure, and that uncertainty should be described rather than collapsed into a binary claim.[^2] This directly covers several proposed receipt attributes: location, observation, uncertainty, and editability. Wheelmap packages that model into a consumer-facing map and asks people to mark public places.[^1]

A new private database therefore has to prove one of three things:

- the steward needs **non-public evidence** that should not be published to OpenStreetMap;
- the steward needs a **workflow state** that the public map does not represent, such as “maintenance ticket opened” or “rechecked after repair”; or
- the existing channel cannot collect the required evidence with a simple form and attachment.

The design currently assumes all three without proving any.

### A simple volunteer program already creates a usable outcome

Adopt-a-Drain is a close structural alternative. It gives people a finite recurring task, a safety-oriented instruction set, a named program, a reporting form, and an aggregate impact view. The California program asks residents to spend about fifteen minutes twice a month, report work, and track collective debris removed; it also gives explicit instructions about what to clear and why.[^4] It does not need a cryptographic receipt, AI extraction, a contributor profile, or a new social graph to create a credible steward outcome.

That is the uncomfortable comparison: if a partner’s job is simply to receive bounded observations and maintain a queue, a shared form plus spreadsheet may be **simpler, more legible, and easier to delete** than StewardSignal. The proposed product must beat that baseline on a measured partner cost or outcome quality, not on interface polish.

### Mature review systems expose the hidden cost

eBird is a stronger counterexample to the idea that structured evidence automatically makes review cheap. Its process uses automated filters for species, count, location, and date; unusual records can be held from public view; reviewers may request more documentation; accepted and unconfirmed states remain distinct; and a volunteer reviewer network maintains local filters and communicates with contributors.[^3] This is a sophisticated, domain-specific operation with years of data and expert participation.

StewardSignal proposes nearly the same state complexity—attempted, needs clarification, corroborated, accepted, acted on, rejected, archived—without a demonstrated source of expert reviewers, a conflict policy, or enough mission volume to amortize them. A status taxonomy can make a small team feel rigorous while merely moving ambiguity into a queue.

## ⚠️ Failure analysis

### The claimed agency may be decorative

The contributor controls whether to attempt a mission and what evidence to share. They do **not** control whether the steward accepts it, changes a place, opens a ticket, or publishes a correction. “Acknowledged” is not agency. A templated thank-you, a receipt, or a human label can create the appearance of consequence without changing the partner’s work.

The durable-value claim is similarly conditional. A receipt is useful to the contributor only if it supports a later action: planning a route, documenting a repeated condition, correcting a public record, or demonstrating a verified contribution to a recipient who recognizes it. Otherwise it is an archive of effort. The proposed repeat target can therefore be gamed by asking people to submit another observation, while the named steward still does nothing consequential.

The current gate also risks false confidence. “At least 6/10 create a meaningful state change” is not enough if the state change is merely a new internal status. The test must define a state change as a ticket, correction, visit-plan change, public data update, maintenance request, or an explicit no-action decision with a reason that the partner actually uses.

### Cold start depends on an acquired steward and local density

The product has no standalone reason to exist. A contributor must be near a relevant place, receive a mission through a partner channel, understand the safety boundary, and believe the result will be used. A steward must repeatedly publish finite missions, review them promptly, and provide closure. This is a two-sided dependency with no organic acquisition loop.

One steward and one city/campus can make the concierge test possible, but they cannot establish that the model travels. If the steward stops publishing, there is no discovery surface. If the missions are too sparse, there is no voluntary return. If the product recruits contributors independently, it risks collecting observations no partner requested.

The proposed sharing loop is healthier than referral rewards, but it is also weak: a redacted receipt is unlikely to be shared unless a recipient already needs the underlying place information. That is a useful constraint, not a growth strategy.

### Evidence quality is not solved by structured fields

A photo may reveal a curb cut while exposing a face, license plate, home, staff member, or geolocation metadata. A contributor may misread an accessibility condition, revisit at a misleading time, or infer a permanent feature from a temporary obstruction. OpenStreetMap’s guidance explicitly distinguishes certainty and description rather than treating one tag as a full accessibility assessment.[^2]

Duplicate evidence is not corroboration. Multiple contributors may copy the same stale map or visit the same location after a temporary cleanup. Conversely, an accurate solitary observation may be rejected because the steward wants independent confirmation. The product needs a domain-specific evidence contract and a rule for when “unknown” is the correct result.

The optional AI adds little value in the first test. Extracting visible text from a photo or drafting a summary does not reduce the hard part: determining whether the observation is safe, current, relevant, and actionable. AI can also create a false aura of verification. Keep it out of the first comparison unless the steward identifies a repeated transcription task and reviews every output.

### Review, support, and rights can overwhelm the loop

The proposed workflow promises correction, deletion, revocation, media retention choices, redacted export, status history, and human review. Those are correct product commitments, but each is an operational obligation. A small team must answer who can see a submission, who can correct a disputed label, how deletion affects exports and backups, how a contributor escalates a safety concern, and whether a partner can retain a photo after the contributor withdraws permission.

A rejected accessibility report can affect a disabled person’s route planning or a site’s reputation. A contributor may be asked to enter a property, photograph a person, or approach a hazardous road edge. “Observe only” is not a sufficient safety boundary unless the mission excludes traffic exposure, trespass, confrontation, nighttime visits, and inaccessible routes, and offers an easy “unsafe / cannot assess” exit.

Access Now’s current work treats data protection, surveillance, cybersecurity, and digital identity as core digital-rights issues, and provides dedicated safety support for people at risk.[^5] That does not impose a specific legal requirement on this product; it is a reminder that a contribution system can expose people and places even when its intent is benign. The design should minimize collection rather than promise that permissions will make sensitive media safe.

### The payer is plausible but unproven

A park district, campus, or accessibility nonprofit might pay for fewer review messages, cleaner maintenance intake, or exportable evidence. But the proposed payer also inherits review labor, incident handling, storage, accessibility support, and partner configuration. The economic hypothesis assumes the product reduces coordination burden before measuring whether it adds another queue.

The correct comparison is not “does a steward like the dashboard?” It is:

- minutes per usable result versus current email/form/spreadsheet;
- share of submissions that require clarification or duplicate handling;
- time from observation to partner action;
- number of actions that would not have happened without the tool; and
- annualized cost of storage, support, review, and incident response.

If the partner cannot name a budget owner and a recurring workflow line item, “partner pays” is an aspiration, not an economic hypothesis.

## ⛓️ Trust and chain decision

The proposed no-chain stance is correct. A public chain would not establish that a contributor was safe, that a photo was current, that a steward reviewed it competently, or that a partner accepted the claim. It would conflict with correction, revocation, deletion, and sensitive media handling. Signed, versioned, role-controlled records are sufficient for the initial test.

Do not add a token, wallet, collectible, leaderboard, prize, referral unlock, streak, or scarcity mechanic. Those mechanics would manufacture repeat behavior and undermine the stated test of truthful acknowledgement. Do not use “signed receipt” as a portable credential unless an independent recipient actually verifies and honors it. Portability is not value by itself.

## 🧪 Narrower fair test

Reframe the product as **StewardSignal: a private verification queue for one recurring accessibility-maintenance workflow**. Pick one mission type, one bounded geography, and one named partner. Examples include checking whether a specified set of campus entrances remain passable, or rechecking a known set of public curb ramps after maintenance. Exclude general discovery, public profiles, AI, chain features, contributor scoring, and open-ended media.

Run 10 missions, not 20 mixed missions, with a pre-registered evidence contract:

1. A contributor can complete the check without entering a property, approaching traffic, confronting anyone, or exposing another person.
2. The minimum evidence is a structured observation plus optional photo only when the scene is safe and no person or sensitive detail is visible.
3. “Cannot safely assess,” “unknown,” “temporary obstruction,” and “duplicate” are valid outcomes.
4. The steward commits to a response time and must choose one outcome: maintenance ticket, public-record correction, scheduled recheck, accepted/no action with reason, or rejected with reason.
5. The partner must provide a closure note that a contributor can inspect and correct; no public sharing is enabled by default.

Use a randomized or alternating baseline: half the missions arrive through the partner’s current form/email workflow and half through the StewardSignal paper/browser flow. Keep mission difficulty and geography comparable. The same person should review both arms. Measure partner minutes per **usable** result, clarification rate, duplicate rate, time to closure, action rate, and contributor comprehension. Only after the baseline comparison should the team test whether a private receipt improves repeat use.

The first version should be a link, a structured form, a private attachment option, and a steward spreadsheet or queue. Add correction and deletion before adding AI. If the browser flow does not beat the existing channel, stop. A polished review dashboard cannot rescue a missing partner outcome.

## 🧱 Hard kill conditions

- Kill the product if fewer than 8 of 10 contributors can explain the task, safety boundary, evidence requested, and likely consequence without facilitator correction.
- Kill or reframe if fewer than 6 of 10 completed missions produce a partner-defined state change, such as a ticket, correction, scheduled recheck, visit-plan change, or explicit reasoned no-action closure.
- Kill if the StewardSignal arm is not at least 25% better than the current form/email baseline on partner minutes per usable result, or if it creates more clarification and duplicate work.
- Kill if the named steward cannot review at least 8 of 10 submissions within the promised response time without unpaid or unsustainable review labor.
- Kill if contributors return only after repeated reminders, rewards, rank, streaks, fear of loss, or referral pressure; a neutral invitation may be used once, but not as a retention crutch.
- Kill if fewer than 3 of 10 contributors can identify a concrete future use for their receipt, or if no independent recipient accepts the receipt outside the pilot.
- Kill immediately for any unresolved high-severity privacy, rights, trespass, harassment, unsafe-location, or sensitive-media incident.
- Kill the public-network framing if the partner cannot supply at least one recurring mission every two weeks or if submissions routinely exceed the partner’s actual maintenance capacity.
- Kill any chain, token, wallet, badge, or public reputation layer unless two independent partners request and honor the same narrowly scoped claim in a real workflow.

## ✅ Final recommendation

**Reframe to a private, partner-owned verification queue and test it against the incumbent form/email workflow.** The concept should advance only if it proves two independent benefits at once: the partner gets a materially cheaper or more actionable result, and contributors receive a truthful consequence they can name and use. If either side fails, the honest conclusion is that StewardSignal is a pleasant intake form with an expensive status trail, not a product with real agency.

## References

[^1]: Wheelmap, “Find wheelchair accessible places,” https://wheelmap.org/
[^2]: OpenStreetMap Wiki, “Key:wheelchair,” https://wiki.openstreetmap.org/wiki/Key:wheelchair
[^3]: eBird Support, “The eBird review process,” https://support.ebird.org/en/support/solutions/articles/48000795278-the-ebird-review-process
[^4]: Adopt-a-Drain California, “How to Adopt A Storm Drain,” https://ca.adopt-a-drain.org/
[^5]: Access Now, “Access Now,” https://accessnow.org/
