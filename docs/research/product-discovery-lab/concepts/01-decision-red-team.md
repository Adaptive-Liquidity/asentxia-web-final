# Decision Relay: red-team review

## Verdict: reframe, do not advance as a standalone decision product

Decision Relay has a real job hidden inside it: help a recurring host close a bounded question and carry the result into the next session. The proposed loop is understandable, and the off-chain, editable record is the right default. But the current concept is not yet a differentiated product. Its strongest counterexample is **Loomio**, which already combines context, structured polls and proposals, reasons, an explicit outcome, next steps, searchable history, reusable templates, and a review date.[^1][^2] A host can also use an ordinary poll plus meeting notes, while Doodle demonstrates how far a low-friction group-link workflow can go when the job is simply coordination.[^3]

The proposed card is therefore most likely to become a nicer meeting minute, not a new recurring utility. The host still has to frame the question, choose a rule, interpret disagreement, approve the result, assign an owner, and make the next session happen. The product does not remove the hardest work; it records it. **Reframe** around one narrow host workflow where the retained card changes a subsequent action and where existing tools are demonstrably too cumbersome. Do not build the general-purpose room, social layer, or AI grouping until that case is proven.

## The nearest alternatives are stronger than the concept assumes

| Alternative | What it already does | Where Decision Relay could still win | Counterexample to the thesis |
| --- | --- | --- | --- |
| [Loomio](https://www.loomio.com/) | Discussion context, proposals, polls, reasons, outcomes, next steps, searchable history, templates, and review dates | Faster, no-account, synchronous micro-decisions for a host who will not adopt a deliberation workspace | The proposed atomic outcome is already close to Loomio's documented end-to-end path from question to outcome and review. |
| [Doodle](https://doodle.com/en/) | A link-based group poll that lets people select among options, with a familiar host workflow | Decision Relay could cover non-scheduling questions and retain a richer consequence record | The “open link, choose one option, see progress” experience is not novel; a basic poll may already be sufficient for low-stakes choices. |
| [Jackbox Games](https://support.jackboxgames.com/hc/en-us/articles/15794771245975-How-do-I-get-started-playing-Jackbox-Games) | Room-code, browser participation without player accounts; host-owned screen; audience influence | A calmer, non-game decision ritual with an explicit follow-through card | The friction-light entry pattern is proven, but it depends on a host, a visible shared screen, and a socially assembled group. |
| Existing chat, forms, minutes, and calendar | Already present in the host's workflow and often free or institutionally approved | A compact, reusable state card could reduce repeated explanation | “One more link” loses unless it measurably removes follow-up work rather than merely formatting it. |

Loomio is the decisive comparison because it addresses the full problem rather than only polling. Its documentation explicitly distinguishes simple polls from proposals and says a decision process may include discussion, several response templates, an outcome, and a review date.[^2] The proposed “rule, rationale, owner, first action, and check-back date” is a thinner version of that workflow. The burden of proof is consequently not feature parity; it is a materially lower setup and participation cost for a narrowly defined use case.

Jackbox is a useful operational counterexample. Participants can enter a room code in a browser without an account, but the host must own and run the game and everyone must see the host's screen.[^4] Decision Relay inherits the same distribution dependency while lacking the entertainment payoff that makes the dependency worthwhile. The concept must show that its recap is valuable enough to recruit and retain the host even when the moment itself is not intrinsically fun.

## Agency is conditional, not intrinsic

The claim that a participant “helps a group move forward” is only true when four conditions hold:

1. the declared rule actually governs the decision;
2. the host has authority and willingness to follow it;
3. the selected result causes a visible state change; and
4. the participant can inspect what happened later.

The host-controlled close/edit/approve step breaks the causal chain. A host can lawfully override plurality, reinterpret reasons, change the owner, or leave the card open. That may be appropriate governance, but the interface must call the input **advice**, **consent**, **selection**, or **decision** according to the actual rule. Calling every input a decision creates false agency.

A losing participant may accept a result because the rule was clear, but “legitimate” is not the same as “influential.” If the same host can choose the minority option in all three concierge sessions, comprehension and perceived fairness may pass while agency fails. The proposed test should log the predeclared rule, the result, the host's action, and any deviation with a reason. A card that says “plurality chose A; host selected B because capacity was unavailable” is more trustworthy than a card that silently presents B as the group's decision.

The retained card is also not automatically durable value. Participants may inspect it once because the host sends it, then never use it again. The strongest falsifier in the brief is therefore credible: contribution without recap inspection or next-session use would show a lightly improved poll, not a recurring decision utility. A 40% second-use target is not enough by itself if the second use is another curiosity click rather than a real decision in the same workflow.

## Cold start and social-density risk

This is a host-led product with a two-sided acquisition problem. A participant has no reason to open a blank room, and a host has no reason to configure a room without a real cohort and a question. The “no account” entry reduces friction but does not create demand. Every useful session requires a recurring group, a credible host, enough responses to make the result meaningful, and a next meeting in which someone uses the card.

That dependency is a feature only if the team can reach hosts cheaply. Cohort facilitators, educators, club organizers, and volunteer coordinators are not one channel. They have different authority, privacy expectations, calendars, and procurement paths. An unpaid volunteer may value the artifact but have no budget; an institution may have budget but require an approved tool, accessibility review, data handling review, and support expectations. Do not infer partner distribution from the existence of partner-shaped users.

The product also risks being trapped between two extremes: too little social density for a meaningful group result, or too much participation for a host to moderate reasons and reconcile disagreement. A room with six people may not need a dedicated system. A room with hundreds creates moderation, identity, and representativeness problems that the proposed two-to-four-week prototype should not pretend to solve.

## Operations, privacy, safety, and rights

Optional reasons are the highest-risk surface. They can contain names, health or education information, allegations, protected characteristics, or workplace conflict. Named versus anonymous visibility is not a sufficient control: a small cohort can re-identify an anonymous comment from context. The host's ability to edit or approve the card creates a second risk of selective quotation or misleading summarization. AI grouping increases that risk even when source-linked and human-approved.

The initial scope should prohibit sensitive free text, or constrain reasons to a short, structured reason code plus an optional private note visible only to the host. The prototype needs a plainly visible audience label before submission, an edit/delete path, retention and export controls, correction history, and a way to report harassment or an unsafe prompt. The host must be able to remove a comment without erasing the fact that a concern was raised, while the participant must be able to request deletion of their own contribution where the product's stated policy permits it. These are product requirements for trust, not claims about a particular jurisdiction's law.

Do not add public feeds, reputation, global rankings, prizes, paid chance, scarcity, streaks, referrals, tokens, wallets, mining, or financial promises. Those mechanics would manufacture activity and make consent or privacy harder to interpret. The FTC has specifically described dark patterns that obscure choice, steer data sharing, and use misleading design to trap consumers.[^5] A neutral invitation and an explicit consequence statement are appropriate; fear-of-loss reminders, “your voice will disappear” countdowns, and referral unlocks are not.

The chain decision is sound. Public immutability would not prove that a host used a fair rule or that a rationale is true. It would complicate correction, deletion, confidentiality, and governance. Signed, exportable records should be considered only after independent partners actually request portable verification and an off-chain export fails a demonstrated need.

## Economics are unproven and probably host-led

The proposed payer is plausible only for a host or organization that experiences repeated coordination cost. Participants should remain free. But the value proposition currently saves a few minutes of follow-up per session, while the host still supplies the judgment, moderation, and next-session discipline. For small groups, a form, poll, spreadsheet, chat message, and calendar note are close substitutes. For larger organizations, the sale is not a consumer subscription; it becomes workflow software with onboarding, admin, accessibility, security, retention, support, and procurement costs.

Loomio is a particularly important pricing and scope benchmark: it presents whole-group plans, dedicated decision space, hosting-region choices, and an established organizational use case.[^1] Decision Relay cannot assume that “templates, history, co-hosts, accessibility, admin controls, and exports” are themselves willingness-to-pay features. They may be table stakes once the product is used in a consequential setting. The economic test must measure **host minutes saved and avoided repeated explanation**, not likes, completions, or participant enthusiasm.

A credible payer hypothesis would be narrower: one organization pays for a host-facing recurring workflow because the card replaces a known manual artifact and is used in the next session. Require a real budget conversation or paid pilot only after observed reuse; do not use a price survey or a free trial conversion as proof.

## Why the proposed experiment could produce false positives

The concierge test is directionally right but vulnerable to facilitator effects. The facilitator can explain the consequence, prompt recap inspection, rescue ambiguous rules, and personally bring the card to the next session. That proves the team can operate the service, not that the product creates independent value.

The test also mixes three different jobs: low-stakes choice, contested choice, and deferred choice with a minority concern. A pass on an easy choice can hide failure on governance and follow-through. The experiment should compare Decision Relay with each host's current method, using matched recurring decisions where possible. The host should prepare the same facts and rule in both conditions. Participants should receive the recap through the normal channel, not a researcher reminder. A blinded comprehension check should happen before the result is shown; a later check should ask what changed, who owns it, and what remains unresolved.

### Narrow fair test

Run **six sessions across two independent hosts in one narrow segment**, such as weekly volunteer shift or cohort activity selection. Each host runs three comparable decisions: one current-workflow baseline, one Decision Relay concierge session, and one Decision Relay session with a losing-preference or unresolved-minority case. Keep the group size between 8 and 20 and exclude sensitive topics and minors in the first pass.

Pre-register the rule and the consequence before responses open. Do not allow the facilitator to explain the consequence after a participant answers. Record:

- unaided consequence comprehension before submission;
- completion and abandonment time;
- whether the host followed the declared rule or documented an override;
- whether the result created a state change within seven days;
- whether each participant opened the recap and could identify the result, rationale, owner, first action, and check-back date;
- whether the next session actually used the card without researcher prompting;
- host minutes for setup, moderation, approval, correction, and follow-up;
- privacy/safety incidents, deletion or correction requests, and unresolved disputes; and
- voluntary second use in the same real workflow after one neutral invitation.

Use a concise, structured reason field in the first test. Keep AI grouping off or run it only as a hidden comparison; it is not needed to test whether the core artifact works. Export the record in plain Markdown/PDF and CSV only to test usefulness, not portability theater.

A fair result is not “people liked it.” It is that the card changes the host's next workflow more reliably than the baseline while reducing total coordination effort, and that participants understand the limits of their influence.

## Hard kill conditions

Kill or reframe the concept if any one of these occurs in the same narrow use case:

- Fewer than 8 of 10 participants can state the consequence and governing rule unaided before submitting.
- Fewer than 6 of 10 completed inputs produce a documented state change, accepted handoff, or responsible host action within the agreed window.
- In either host's next session, the card is not used without a researcher or facilitator prompt, or fewer than two independent hosts request another real run.
- Participants cannot distinguish “group result,” “host decision,” “advice,” and “unresolved concern,” or a losing participant reports that the process implied influence that did not exist.
- The Decision Relay flow does not reduce host coordination time or repeated explanation versus the host's existing poll/chat/notes workflow after including setup, moderation, approval, and corrections.
- Voluntary second use in the same workflow is below 40% within 14 days after one neutral invitation, excluding researcher reminders and incentivized behavior.
- Any unresolved high-severity privacy, harassment, safety, rights, or deception incident occurs; or correction/deletion and escalation paths cannot be demonstrated in the test.
- Optional reasons create moderation or support work above the predeclared per-result budget, or the team must add public identity, rankings, streaks, prizes, scarcity, paid chance, tokens, wallets, chain immutability, or autonomous consequential action to obtain participation.
- No credible host or organization will pay for the measured workflow benefit after observing real reuse and receiving a concrete price proposal.

## Reframe if the test is promising

Position this as **a follow-through card for one recurring host workflow**, not as a new place for group decisions. The first product should accept a host-authored question, one structured response, one explicit rule, one approved outcome, and one check-back. It should be deliberately worse than Loomio at deliberation and worse than Doodle at broad scheduling, but better at carrying a small recurring decision into the next meeting with almost no setup.

The product name and hook should make the host's job visible. The participant promise should be narrower: “You will see how this input is used, or why the host chose differently.” That is an honest agency claim. If the test cannot show that the card is used in a subsequent workflow, kill the standalone product and retain only the card template as a feature for an existing host platform.

## References

[^1]: Loomio, “Important decisions need a place of their own,” https://www.loomio.com/
[^2]: Loomio Help, “Proposals and polls,” https://help.loomio.com/en/user_manual/polls/intro_to_decisions/index.html
[^3]: Doodle, “Group Poll and scheduling,” https://doodle.com/en/
[^4]: Jackbox Games Support, “How do I get started playing Jackbox Games?”, https://support.jackboxgames.com/hc/en-us/articles/15794771245975-How-do-I-get-started-playing-Jackbox-Games
[^5]: Federal Trade Commission, “FTC Report Shows Rise in Sophisticated Dark Patterns Designed to Trick and Trap Consumers,” https://www.ftc.gov/news-events/news/press-releases/2022/09/ftc-report-shows-rise-sophisticated-dark-patterns-designed-trick-trap-consumers
