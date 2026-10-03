# Red team: PivotProof

- **ID:** `04-challenge-design`
- **Territory:** Challenge-to-teach artifacts
- **Concept:** PivotProof
- **Review stance:** Independent challenge to the proposed design, opportunity map, and prototype gate
- **Verdict:** **Reframe** (do not build the proposed capture-and-card platform yet)

## Executive verdict

PivotProof identifies a real instructional pattern—bounded practice, a visible change, and a replayable explanation—but the proposed product is not yet shown to be simpler or better than a raw clip plus a message, an existing coaching/replay tool, or a host's normal demonstration. The most damaging counterexample is not a hypothetical competitor: Trackmania already turns a replay or “ghost” into an inspectable next attempt inside the activity, while Onform already offers capture, slow motion, frame-by-frame analysis, annotation, comparison, sharing, organization, and cloud backup for coaches and athletes. In those workflows, the recipient already knows how to attempt the task; PivotProof adds a challenge schema, turning-point authoring, card editing, recipient questions, approvals, privacy state, and review operations.

The concept therefore has a narrow possible wedge, but only if it stops being a new video-analysis destination. Test a **host-authored, non-public practice brief** for one domain where the hard problem is not seeing the movement but transferring a small, named cue to a comparable attempt. Start with structured evidence (text, still frame, screen state, or an existing video link); treat recording as optional. The artifact must beat a raw clip and a plain written instruction on independent retry and host reuse after controlling for novelty and facilitator prompting.

The current gate is directionally sound, but the proposed concierge test is too easy to pass through facilitator enthusiasm and novelty. “Helpful,” “meaningful turning point,” and “recipient can begin” need blinded, behavioral definitions. A 6/10 retry rate is insufficient if the control performs equally well, if the task is selected for easy transfer, or if recipients are already members of the host's group.

## Strongest counterexample and alternatives

### 1. Existing replay is already an instructional artifact

Trackmania's official documentation explicitly frames replay analysis as a way to learn techniques and racing lines. It supports world-record videos, leaderboard ghosts, spectating a player's record, and local replay files; the viewer can load a ghost into the current session and attempt the same bounded task. This is close to the proposed “watch turning point, then try” loop, but with less authoring and no new social artifact. Its limitation is also the warning for PivotProof: this works because the task, success condition, and comparable attempt are native and objective. A generic practice card has to manufacture that legibility.

**Counterexample:** if a host can send an existing replay/clip and one cue in chat, and the learner can attempt immediately in the original tool, PivotProof's card is overhead rather than a product advantage.

Source: [Trackmania Documentation, “Watching Replays”](https://doc.trackmania.com/play/watch-replays/).

### 2. Existing coaching products already own the hard media workflow

Onform markets a coach/athlete workflow with five recording modes, slow-motion and frame-by-frame review, drawing and voice-over annotation, side-by-side comparison over time, collections/tags, sharing, multi-angle capture, cloud backup, centralized administration, support, and privacy claims. It is not evidence that every niche is served, but it is a direct counterexample to the assumption that a new browser-native capture and replay layer is needed. A coach who already has an athlete library will not migrate merely to obtain a “what changed / what to notice / try next” card.

**Counterexample:** PivotProof wins only where existing coaching tools do not provide a structured, recipient-readable challenge contract, or where a host needs a lightweight cross-domain brief without adopting a sport-specific system.

Source: [Onform, “The Ultimate Mobile Video Coaching Platform”](https://onform.com/).

### 3. Raw clip plus human cue is a very strong control

A phone clip, a timestamp, and a text or voice message can already deliver the core promise: “watch this moment; notice the wrist angle; try it once.” A host can use YouTube unlisted links, a shared drive, Loom, chat, or a learning-management system. The proposed card may improve consistency, but every field is also an authoring and review step. The experiment must compare against this exact low-tech workflow, not against a raw clip with no explanation.

### 4. Badges/credentials do not prove recipient value

Open Badges can package issuer, earner, criteria, evidence, demonstrations, endorsements, and a signed credential. That shows that rich, portable records are technically possible, not that a practice artifact will be used by an independent verifier. The concept correctly rejects chain-first design; it should also reject credential framing unless a real recipient makes a decision based on the record.

Source: [1EdTech, “Open Badges”](https://www.1edtech.org/standards/open-badges).

## Claim-by-claim challenge

| Proposed claim | Red-team finding | What would count as proof |
|---|---|---|
| A turning-point card is better than a clip | Unproven; the card may formalize what a timestamped message already does | In a randomized control, recipients complete a comparable attempt more accurately or with fewer retries than clip-plus-cue, with equal or lower host minutes |
| Performers can identify their meaningful turning point | Self-explanation may be post-hoc, vague, or wrong; a successful moment is not necessarily the causal cue | Independent expert or predeclared rubric agrees with the performer's cue, or the cue predicts recipient improvement over a control |
| Recipient agency is real | “Try it” is a request, not agency; the recipient's action changes only their own practice and may be socially prompted | Recipient chooses to attempt without facilitator prompting, completes a comparable task, and can state what cue they tested |
| A replayable artifact creates durable value | A saved card is not durable value if nobody reopens it or hosts reuse it | Named recipient reuses it in the next real session; performer or host retrieves it for a later task without a reminder |
| Private history beats public rank | Plausible, but there is no demonstrated reason to pay for private history rather than ordinary folders or LMS records | Participants choose private history in a live workflow and hosts report reduced preparation/feedback time |
| AI transcription/labels are optional and safe | Even labeled drafts create correction work and can misread domain language, accessibility cues, or sensitive content | Measure correction minutes and material error rate; allow a fully non-AI path with no quality penalty |
| A host subscription is credible | Host is both purchaser, curriculum author, reviewer, moderator, and distributor; small groups may not have budget or enough volume | Two hosts pay or sign a credible procurement commitment after using it, with quantified labor saved |

## Is it genuinely simpler/better?

**Not on the proposed surface.** The first 30 seconds are link-first, but the end-to-end path is not: define criteria; configure safety/accessibility; attempt; record; mark a moment; transcribe; edit; approve; publish privately; recipient scrub; answer a question; retry; give feedback; revise or withdraw; retain/delete/export. This is a workflow product disguised as a lightweight card.

The concept is simpler only under a narrower constraint:

- one recurring host;
- one bounded task family;
- no public discovery;
- no global profiles, rankings, or credentials;
- structured evidence first;
- one recipient question and one retry;
- host-selected reuse in the next session;
- existing media links accepted rather than re-hosted.

Even then, “card” can be a template in a shared document. The product must earn its existence by reducing host work or increasing transfer, not by making a nicer player.

## Agency, social density, and cold start

### Agency may be performative

The performer chooses the turning point, but the system does not establish that it caused improvement. A recipient can answer the noticing question correctly by guessing, comply because a coach asked, or repeat the task without changing technique. The host still owns the challenge definition and approval gate, so agency is asymmetric: the performer annotates a record inside a host-controlled curriculum; the recipient is a viewer with a prescribed action.

The proposed return loop is healthy in principle, but it depends on a pre-existing relationship and a next session. There is no standalone reason for a cold visitor to create a card, no natural discovery loop (correctly), and no recipient value if the host does not curate the next task. That makes the product a **host workflow tool**, not a consumer product. Acquisition and retention are therefore coupled to recurring clubs, educators, coaches, or creators that already have density.

### Partner dependency is structural

The partner must supply participants, define valid challenges, review artifacts, provide safety context, and reuse cards. If the host stops, the product stops. That is acceptable for a wedge, but not if the economic hypothesis assumes many small hosts will self-serve. A host already has a chat/LMS/video tool and may resist another inbox. The prototype must measure host preparation and review time against baseline, not merely participant completion.

## Operations, moderation, rights, privacy, and safety

### Capture creates a disproportionate operations surface

Optional webcam/screen capture brings identity, voice, faces, locations, bystanders, copyrighted screens, music, code, student work, and accidental sensitive data into storage. “Private” does not remove breach, access-control, deletion, export, backup, support, or incident obligations. A public link and recipient sharing also create forwarding and screenshot risk.

If children under 13 appear in uploaded video, audio, or images, FTC COPPA guidance treats those media as personal information. Covered services need notice, verifiable parental consent (subject to limited exceptions), parental access/deletion, data minimization, security, retention limits, and controls over disclosure. School consent has a restricted school-context scope and does not automatically permit a provider's own commercial use. This is not a claim that COPPA applies to every club; it is a reason to exclude minors from the first test unless the host has an approved process and the test is designed accordingly.

Source: [FTC, “Complying with COPPA: Frequently Asked Questions”](https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions).

Rights are similarly nontrivial: a performer may not own the music, screen content, venue, other people's likeness, or the challenge demonstration. Deletion propagation from an exported HTML/PDF card, cached media, source link, backups, and recipient downloads is a product claim that needs a tested policy, not a checkbox.

### Accessibility is a design constraint, not a caption toggle

WCAG 2.2 requires alternatives for time-based media, including captions for prerecorded synchronized media and an audio description or equivalent for video-only content at the relevant success criteria. Keyboard operation, readable controls, timing, focus, nonvisual noticing, transcript quality, and an equivalent non-video route all matter. A visual turning-point marker can be unusable for blind or low-vision recipients; a fast motor task may be unusable for people with mobility or sensory differences; a “comparable attempt” may need adaptation while preserving the criterion.

Source: [W3C, “Web Content Accessibility Guidelines (WCAG) 2.2”](https://www.w3.org/TR/WCAG22/).

A paper test cannot claim accessibility if the facilitator verbally compensates for an inaccessible artifact. Run the same task with keyboard-only, screen reader, captions/transcript, reduced motion, low vision, and non-video evidence paths; record task success, not satisfaction alone.

### Moderation and safety are domain-specific

A stunt, exercise, tool use, medical practice, driving task, or public-location challenge can cause harm. A host-authored safety note is not an assessment of suitability, and a performer demonstration can normalize unsafe technique. The first domain must exclude high-risk tasks and make adaptation/stop conditions explicit. Do not let “proof” become a dare, skill contest, or implicit pressure to disclose bodily or identity information.

## Economics and viability

The proposed payer (host by active practice group) is plausible but unearned. The willingness-to-pay case depends on measurable labor savings, yet the product adds review, correction, consent, moderation, accessibility remediation, storage, and support. Research on video feedback in online education found video feedback took more time than written feedback and had little to no impact on instructor performance evaluations. That is not a direct estimate for PivotProof, but it is a relevant warning against assuming that richer media reduces host workload.

Source: [Ashford et al., “Video-based Feedback on Student Work: An Investigation into the Instructor Experience, Workload, and Student Evaluations,” Online Learning (2020)](https://olj.onlinelearningconsortium.org/index.php/olj/article/view/2194).

The product has no obvious consumer payer: performers and recipients receive practice value but may have low willingness to pay; hosts may see the card as curriculum labor; niche creators may monetize elsewhere. A free tier can attract exactly the smallest groups with the least budget and highest support variance. Do not forecast subscriptions from pilot enthusiasm. Ask hosts to pay for a second real run, or secure a written budget owner and price objection after measured use.

## Evidence quality and experiment risks

The proposed gates are useful but vulnerable to false positives:

1. **Facilitator contamination:** the same person explains the task, edits the card, and observes the retry. Use a script and independent observers.
2. **Selection bias:** easy, low-risk challenges inflate comprehension and transfer. Pre-register one easy, one ambiguous, and one accessibility-adapted task.
3. **Novelty effect:** recipients may try because a researcher hands them a new artifact. Compare neutral invitation, no repeated reminders, and an existing-tool control.
4. **Demand characteristics:** “helped” feedback is not transfer. Require a delayed, unsupervised comparable attempt.
5. **Control weakness:** compare against raw clip + timestamp + one cue, written instruction + still, and host's normal method—not an unstructured clip.
6. **Unit-of-analysis ambiguity:** 6/10 recipients may come from one tight club. Report per host and per challenge, not only pooled percentages.
7. **Artifact quality confound:** card polish can raise perceived helpfulness without improving performance. Blind the artifact brand and measure behavior.
8. **Repeat metric weakness:** one second use within 14 days can be researcher-prompted. Define “voluntary” as a participant-initiated retrieval or a host-initiated reuse in a scheduled session, with one neutral reminder maximum.

The research literature supports deliberate signaling and segmenting as ways to focus attention and support transfer, but those are instructional design principles, not evidence that PivotProof's software is the necessary delivery vehicle. Brame's review emphasizes cognitive-load management, signaling, segmenting, and weeding; a card that adds fields and controls can violate the same principles it intends to operationalize.

Source: [Brame, “Effective Educational Videos: Principles and Guidelines for Maximizing Student Learning from Video Content,” CBE—Life Sciences Education (2016)](https://www.lifescied.org/doi/10.1187/cbe.16-03-0125).

## Chain and prohibited mechanics

- **No chain is warranted.** The proposed signed export/database is sufficient. Public immutability is a poor fit for correction, deletion, privacy, evolving criteria, and withdrawal.
- Do not turn a practice card into a credential, collectible, token, or publicly ranked proof. A signed export is only useful if a named recipient accepts it for a real purpose.
- Do not add streaks, rank, prizes, scarcity, paid chance, loss-aversion reminders, referral unlocks, or “keep your record alive” pressure. The opportunity map explicitly rules these out, and FTC guidance identifies deceptive scarcity, difficult cancellation, buried terms, and privacy-steering as dark-pattern concerns.
- Do not use AI to publish, grade, certify, or infer a turning point without human approval. Keep draft labels inspectable, editable, rejectable, and reversible.

Source: [FTC, “FTC Report Shows Rise in Sophisticated Dark Patterns Designed to Trick and Trap Consumers”](https://www.ftc.gov/news-events/news/press-releases/2022/09/ftc-report-shows-rise-sophisticated-dark-patterns-designed-trick-trap-consumers).

## Reframe / narrower concept worth testing

### “CueCard Relay” (working name)

A host in one recurring, low-risk practice group creates a **one-screen challenge brief**. The performer submits a short text/still/existing-link proof and one sentence: “what changed” and “what to notice.” A recipient opens the link, answers one noticing question, performs a comparable attempt off-platform, and optionally submits a short result. The host sees only status and reuse; no global profile, public feed, ranking, or built-in media library.

Product surface for the test:

1. Host template: task, success condition, time limit, permitted adaptations, stop/safety note.
2. Performer form: before/after cue, one evidence attachment or link, confidence, consent scope.
3. Recipient page: task, cue, one question, “try now,” adaptation note, and feedback buttons.
4. Host reuse log: whether it was used in the next session and minutes saved/added.
5. Data controls: private by default, one-click withdraw/delete, visible retention date, no minors or high-risk tasks in phase one.

Explicitly omit in phase one: webcam/screen capture, AI transcription, public discovery, social graph, badges, wallet/chain, rankings, complex dashboards, and PDF/HTML export. If a plain document or existing tool performs equally well, that is a valid kill result.

## Fair concierge test

### Design

Run **six challenges across two independent hosts** in one low-risk domain (for example, a coding or craft micro-skill), with 12 performers and 24 recipients. Use three pairs of matched challenges:

- **Treatment:** CueCard Relay card with structured cue and turning point.
- **Control A:** raw clip or existing replay + timestamp + one human sentence.
- **Control B:** ordinary written instruction + still/example.

Randomize recipients within each host and challenge; do not let a performer coach a recipient during the retry. Exclude minors, medical/fitness safety claims, copyrighted third-party media, and tasks where failure could injure someone.

### Measures

Primary:

- unaided task explanation before attempt;
- successful comparable attempt within 24 hours, verified against a predeclared rubric;
- delayed independent attempt without facilitator present;
- host reuse in the next real session;
- host minutes per accepted artifact versus baseline;
- correction/review minutes and material-error rate.

Secondary:

- recipient can identify the intended cue without being told;
- recipient reports accessibility barrier, with observed completion by keyboard/non-video path;
- performer can state a falsifiable cue rather than a retrospective story;
- withdrawal/deletion request completion time;
- incidents, rights questions, and support interventions;
- participant-initiated second relevant use within 14 days after one neutral reminder.

### Decision rule

Advance only if treatment beats **both** controls on independent delayed retry by a practically meaningful margin (target: at least 20 percentage points, with no increase of more than 5 minutes host labor per accepted artifact), at least two hosts reuse it in their next session, and no high-severity privacy, safety, rights, or accessibility incident occurs. If treatment merely improves perceived helpfulness but not retry or reuse, kill the card product and retain only the best-performing instructional template as documentation.

## Hard kill conditions

1. In a blinded or randomized comparison, raw clip + timestamp + cue is non-inferior to the card on delayed comparable attempt and requires less host time.
2. Fewer than 6 of 12 recipients complete an unsupervised comparable attempt, or attempts occur only after facilitator prompting.
3. Treatment does not beat both controls by at least 20 percentage points on the predeclared transfer measure.
4. Either host does not reuse at least two approved artifacts in the next real session, or reuse adds work rather than reducing preparation/feedback burden.
5. Performers cannot produce a specific, falsifiable cue that independent observers can distinguish from generic “practice more” advice in at least 8 of 12 artifacts.
6. Any accessibility path (keyboard, captions/transcript, screen-reader-compatible text, or non-video evidence) is materially worse than the video path and cannot be fixed without making the flow longer than the control.
7. A deletion, withdrawal, consent, or rights request cannot be completed and propagated through copies/exports within the predeclared service window.
8. A high-severity safety, privacy, child-data, harassment, or rights incident occurs, or the team needs public UGC/moderation or risky stunts to generate participation.
9. Manual review, correction, support, and storage cost exceed the host value at a price the host will actually pay.
10. The only way to reach the repeat or sharing threshold is streaks, rank, prizes, scarcity, referral pressure, public status, or other prohibited retention mechanics.
11. No host pays for a second run or provides a credible budget owner after seeing measured labor and transfer results.
12. A plain shared document plus existing media links is equally effective and easier to operate; do not build a proprietary capture or credential rail to defend the concept.

## Sources consulted

1. [Trackmania Documentation — Watching Replays](https://doc.trackmania.com/play/watch-replays/)
2. [Onform — The Ultimate Mobile Video Coaching Platform](https://onform.com/)
3. [W3C — Web Content Accessibility Guidelines (WCAG) 2.2](https://www.w3.org/TR/WCAG22/)
4. [FTC — Complying with COPPA: Frequently Asked Questions](https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions)
5. [Ashford et al. — Video-based Feedback on Student Work](https://olj.onlinelearningconsortium.org/index.php/olj/article/view/2194)
6. [Brame — Effective Educational Videos](https://www.lifescied.org/doi/10.1187/cbe.16-03-0125)
7. [1EdTech — Open Badges](https://www.1edtech.org/standards/open-badges)
8. [FTC — Dark Patterns Report](https://www.ftc.gov/news-events/news/press-releases/2022/09/ftc-report-shows-rise-sophisticated-dark-patterns-designed-trick-trap-consumers)
9. [Opportunity map — Bounded, evidence-carrying participation](/home/ubuntu/asentxia-web-final/docs/research/product-discovery-lab/01-opportunity-map.md)

## Final decision

**Reframe, then test once.** Do not authorize the proposed 2–4 week capture-heavy prototype. Authorize only the narrow, off-platform-friendly CueCard Relay concierge test. Advance to software only if transfer beats strong existing workflows, hosts demonstrably reuse artifacts while saving time, and the non-video/accessibility/privacy paths work without special pleading. Otherwise kill PivotProof as a standalone product; the underlying insight can remain a host-authored instructional template.