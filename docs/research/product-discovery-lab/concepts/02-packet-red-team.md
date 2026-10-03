# Red team: Proofstep Packet

**Verdict: reframe, not advance.** The concept identifies a real comprehension problem, but its proposed consumer product is not yet simpler than the issuer’s statement, dispute channel, or CFPB escalation path. It is a sensitive translation-and-record layer inserted before a workflow that already has legally meaningful deadlines, notice rules, investigation, and status. The strongest counterexample is not a competing app. It is the existing combination of a card issuer’s statement and secure dispute process, plus the FTC’s plain-language instructions and the CFPB complaint route. Those mechanisms already provide the consequential action and an official receipt; Proofstep must prove that its cited explanation changes behavior enough to justify another party copying, storing, redacting, and interpreting financial documents.

## 🧪 The strongest counterexample: the incumbent workflow is already the authority

For a genuine billing error, the consumer must reach the creditor through the address or electronic method the creditor specifies. The notice must arrive within 60 days of the statement that first showed the alleged error, identify the consumer and account, and indicate the type, date, amount, and reason for the alleged error. The creditor must acknowledge the notice within 30 days and resolve it within two complete billing cycles, and no later than 90 days.[^1] The FTC describes the same path in consumer language and supplies a sample letter. It also tells consumers to keep copies and supporting records.[^2]

That makes the proposed five-minute outcome misleading if interpreted as “resolve the problem.” The product can locate evidence and prepare a draft, but the issuer still determines whether an error occurred. A prepared packet is not a billing-error notice unless the user sends it through an accepted channel, and it is not a legal finding, correction, credit, or completed dispute. The concept does state “prepared/not submitted,” which is good, but the distinction must be the product’s primary interaction rather than a receipt footnote.

There is also a simpler alternative for many users: call the issuer or use the issuer’s authenticated website, where the issuer already has the account, statement, transaction history, identity, and case status. The FTC recommends contacting the issuer right away and explains what evidence to retain.[^2] The CFPB complaint form is another established escalation path: it says online submission usually takes less than 10 minutes, generally permits only one complaint about the same problem, sends the complaint to the company, and offers status tracking.[^3] Proofstep is therefore competing against a workflow with authority, data access, a recipient, and a response obligation—not merely against a blank document.

The product may still be valuable for a narrower problem: a counselor helping a client understand a statement before the client decides whether to contact the issuer. That is a different promise from a consumer “action packet.”

## 🔍 Alternatives and why the claimed simplicity is unproven

The nearest alternatives are:

- **The issuer’s own statement and authenticated support/dispute flow.** It has first-party context and is the only place where the account can be corrected. A third-party upload requires the user to find, download, and trust another system, then possibly re-enter information into the issuer workflow.
- **The FTC’s sample letter and guidance.** This is a free, authoritative explanation of what to include, the 60-day timing, supporting copies, and investigation stages.[^2] It may be less polished than a packet, but it has no new account, upload, retention policy, or interpretation layer.
- **A counselor or trusted helper.** The proposed partner wedge already exists as a human service. A counselor can ask for the missing page, distinguish fraud from a billing error, and decide when not to produce a draft. Proofstep adds value only if it reduces repeated reading and transcription without creating review work.
- **The CFPB complaint process.** When issuer handling fails, it provides a recognized escalation channel and company response loop.[^3] The packet could help prepare a complaint, but it cannot guarantee that the company or CFPB will accept the packet as sufficient evidence.
- **Ordinary records.** A downloaded statement, a saved issuer case number, a dated email, and a user-edited note may already satisfy the user’s need for a private receipt. The proposed receipt must beat this low-tech bundle on completion time or downstream reuse, not just look more organized.

The design is only simpler if the user reaches a correct next decision faster than those alternatives **including** upload, OCR failure, source verification, redaction, correction, export, and re-entry into the issuer’s channel. A five-minute test that ends at “draft prepared” measures interface novelty, not workflow improvement.

## ⚠️ Agency is bounded, but the durable value can be fake

The design correctly prohibits autonomous sending, payment, cancellation, and dispute. That is a strong baseline. But the user’s agency is narrower than the hook suggests: they can approve a draft, while the issuer controls the actual outcome. A “no action” choice may be sensible, but the product cannot know that no action is safe when it lacks account context, merchant communication, fraud signals, or the user’s broader financial situation.

The source line proves what the document says; it does not prove why the amount changed, whether the change is permitted, or which action protects the user. OCR and comparison can also fail on scanned statements, changed layouts, missing prior periods, duplicate-looking transactions, pending versus posted amounts, credits, fees, or a statement whose relevant explanation appears on another page. “Confidence” is not enough unless each confidence state has an observable basis and a safe fallback.

The receipt is durable only if someone uses it later. A signed export proves that a file was signed, not that the issuer agrees with its interpretation. A private packet can preserve user edits and deletion state, but it cannot make a disputed fact true. The durable artifact should therefore be framed as **the user’s review record**, not an evidence record that implies adjudication.

## 🧱 Cold start, host dependence, and partner risk

The first-30-seconds flow assumes the user has a statement ready, can safely upload it, and trusts an unfamiliar browser link with account data. The “Start without an account” choice reduces friction but increases recovery and retention complexity: where does the user retrieve the packet, correct it, or delete it after the session? A temporary link is easy to lose; an account is friction and a new identity/security burden.

The partner wedge is more credible than direct-to-consumer acquisition, but it makes the product dependent on counselors or credit-union support desks. Those partners must train staff, define escalation boundaries, review outputs, maintain privacy and deletion processes, and fit packet handling into case-management systems. If the packet cannot be attached to an existing case without copy/paste, the partner receives another document to manage. If it can be attached automatically, integration and data-governance costs rise.

The product also depends on a recipient using the packet without requesting a recreated summary. That is a strong and appropriate gate, but it may expose the central weakness: issuers and CFPB staff may require their own fields, channels, or evidence, while counselors may prefer a short human note over a generated packet. The test must measure recipient editing and acceptance, not merely whether a recipient opens a link.

## 🛡️ Safety, rights, privacy, and operations

A financial statement is highly sensitive even when account numbers are partially masked. The system would hold documents, extracted transactions, inferred changes, user corrections, named helpers, sharing history, and deletion status. “Ordinary encrypted storage” is necessary but not a sufficient operating model. The team must specify access separation, link expiry, recipient authentication, audit visibility, backup deletion, vendor retention, OCR/LLM subprocessors, incident handling, and what happens when a user uploads the wrong person’s statement.

Redaction is not a cosmetic preview. It can fail through repeated values, page-level metadata, image layers, OCR text, filenames, or an unredacted source accidentally included in an export. A named helper may still be the wrong recipient, and a user under financial abuse or coercive control may need a local-only flow rather than sharing. Sharing must be explicit, revocable where technically possible, and accompanied by a clear view of exactly what was shared and for how long.

The concept must also handle correction and contestability. If the user says the extracted amount or source line is wrong, the original extraction must not silently persist as if it were verified. The receipt should preserve the distinction between source text, system interpretation, user correction, and unresolved disagreement. Accessibility cannot be deferred: scanned PDFs, visual highlights, color-coded confidence, and dense financial tables need keyboard access, screen-reader labels, zoom/reflow, plain-language explanations, and a non-visual way to navigate from claim to source.

The highest-risk deception is not an autonomous send. It is a calm, authoritative-looking card that causes a user to miss a deadline or believe that “prepared” means “protected.” The product must show the relevant deadline, say when it cannot determine one, and stop rather than guess. It must never imply savings, eligibility, refund likelihood, legal sufficiency, or issuer acceptance.

## 💸 Economics: a credible payer is not yet demonstrated

The stated partner-funded model is directionally safer than charging on refunds or disputes, but the economic hypothesis is still thin. A nonprofit counselor may value reduced re-creation, yet may have little budget for software and substantial liability sensitivity. A credit union may already have secure messaging, document storage, statement data, case management, and support staff; its incentive may be to improve first-party service rather than pay for an independent upload layer.

The proposed paid surfaces—redaction, retention, export, accessibility, and operational reporting—are costly features, not proven willingness-to-pay triggers. They also create support and compliance work. If manual review is needed for unreadable or ambiguous cases, cost rises exactly where trust is most important. If review is not provided, the product must demonstrate that users can safely self-serve without over-trusting the output.

Do not infer a payer from partner enthusiasm. Require a partner to provide a real case, let staff use the packet in their normal workflow, quantify minutes saved after correction and escalation, and state what budget or existing line item would pay. A signed pilot letter or a request for another packet is weaker evidence than a paid pilot or explicit procurement path.

## 🧪 Why the proposed experiment may mistake novelty for value

The current concierge test is a good safety probe but is not a clean value test. Staff guiding people through a novel interface can inflate source-line location, completion, and satisfaction. Synthetic statements can make OCR and source navigation look better than messy real statements. A participant who accepts a draft may do so because a facilitator is present. Receipt retention and sharing may measure curiosity rather than downstream utility.

The experiment also bundles too many hypotheses: extraction accuracy, change comprehension, action choice, drafting, redaction, recipient sharing, deletion, repeat use, and partner economics. A failure can be hard to interpret, and a pass can be driven by the facilitator’s intervention. The proposed gate’s “8/10 complete unaided” and “7/10 locate the cited line” are useful safety thresholds, but they do not establish that the packet is better than the incumbent workflow.

A fair comparison needs a randomized or counterbalanced within-person test with the same document and task. One condition uses the current issuer/FTC workflow; the other uses Proofstep. Measure time to correct decision, source-line accuracy, deadline recognition, unnecessary escalation, user corrections, and downstream recipient rework. Keep facilitators silent during the task and log every hint. Test real or consented redacted statements, not only fixtures. The product should lose if it is slower, less accurate, or more confusing than the incumbent, even if participants say they like it.

## 🎯 Narrower fair test

Reframe Proofstep as **a counselor-assisted statement-change review record**, not a general consumer financial control layer.

Scope one document type and one non-consequential first decision: “Is this change clearly explained by the statement, or should the user ask the issuer for clarification?” Exclude fraud claims, eligibility, savings, credit-report disputes, payment withholding, cancellations, debt collection, and any action that could affect a deadline. Use a browser session with no long-term account. Store the minimum necessary data, default to no sharing, and export a user-owned PDF or plain-text record containing:

1. the exact source excerpt and page reference;
2. a separate, visibly labeled system interpretation;
3. the user’s correction or rejection;
4. “no action,” “ask issuer a clarification question,” or “needs human review”;
5. any visible statement date and a warning that the tool does not determine legal deadlines; and
6. a prepared/not-submitted receipt with deletion confirmation.

Recruit 12–16 people through one named nonprofit counseling partner. Use at least four messy, consented statement cases: a true material change, a no-change case, an unreadable/missing-prior case, and a duplicate-looking or pending-versus-posted case. Counterbalance the incumbent comparison. Have two independent counselor recipients use the resulting record during a real or simulated next workflow and record whether they reuse it without recreating the summary.

Advance only if the narrow review record is faster or more accurate than the current process, users can explain that it is not a dispute or legal finding, counselors demonstrably reuse it, and the partner can operate deletion, correction, access, and incident handling within a predeclared per-case budget. Do not build automated account connections, public sharing, chain anchoring, or a consumer retention loop before this result.

## ⛔ Hard kill conditions

- In a counterbalanced test, Proofstep is not at least as accurate as the incumbent workflow on source-line identification and material-change classification, or it adds more than two minutes of median task time after facilitator effects are removed.
- At least 2 of 10 users mistake a prepared packet for a submitted dispute, issuer acknowledgment, legal finding, completed correction, or likely refund; or any user misses a deadline because of product wording.
- Any high-severity privacy, financial-safety, coercive-control, unauthorized-sharing, rights, accessibility, or deceptive-confidence incident remains unresolved.
- The system cannot reliably preserve the distinction between source text, system interpretation, user correction, and unresolved disagreement in every exported receipt.
- More than 20% of cases require staff correction or explanation before the user can make the bounded decision, or manual review exceeds the predeclared per-case budget.
- Two independent recipient workflows request a recreated human summary in more than half of cases, showing that the packet is not portable enough to remove work.
- The partner cannot commit a named owner, deletion/correction process, and a credible budget or procurement path after the pilot.
- Fewer than 6 of 10 target users choose either a justified no-action decision or a bounded clarification step without facilitator action, or fewer than 4 of 10 voluntarily use the review record for a second relevant statement within 14 days without reminders, prizes, fear-of-loss messaging, or referral incentives.
- Users prefer the issuer’s raw statement or secure support flow after seeing an accurate packet, and the measured preference is not explained by a specific accessibility or comprehension gap that the narrow reframe can fix.
- The team proposes public immutability, tokenization, wallet custody, chain anchoring, autonomous sending, payment, cancellation, or dispute submission as a prerequisite. None establishes source truth or legal correctness, and each conflicts with the stated priority of correction, deletion, privacy, and revocable sharing.

## Conclusion

Proofstep Packet should not advance as a standalone consumer product or as a generic “evidence-to-action” layer. Its strongest defensible wedge is a restricted, counselor-assisted comparison and review record that makes a statement change understandable while leaving the issuer’s authority and the user’s consequential choice intact. If it cannot beat the existing statement-plus-issuer/FTC workflow on accuracy, time, recipient reuse, and safe interpretation, the honest decision is to kill the product rather than add retention mechanics or cryptographic theater.

## References

[^1]: Consumer Financial Protection Bureau, “§ 1026.13 Billing error resolution,” https://www.consumerfinance.gov/rules-policy/regulations/1026/13
[^2]: Federal Trade Commission, “Using Credit Cards and Disputing Charges,” https://consumer.ftc.gov/articles/using-credit-cards-and-disputing-charges
[^3]: Consumer Financial Protection Bureau, “Submit a complaint about a financial product or service,” https://www.consumerfinance.gov/complaint/
[^4]: Consumer Financial Protection Bureau, “Required Rulemaking on Personal Financial Data Rights,” https://www.consumerfinance.gov/personal-financial-data-rights/
[^5]: Federal Trade Commission, “FTC report shows rise in sophisticated dark patterns designed to trick and trap consumers,” https://www.ftc.gov/news-events/news/press-releases/2022/09/ftc-report-shows-rise-sophisticated-dark-patterns-designed-trick-trap-consumers
