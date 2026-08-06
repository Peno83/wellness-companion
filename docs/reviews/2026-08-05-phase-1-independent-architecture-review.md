# Independent Architecture, Security and AI Governance Review

**Subject:** Wellness Companion — Phase 1 and Phase 1.1 documentation package
**Review date:** 2026-08-05
**Reviewer role:** Independent Principal Software Architect / Principal Security Engineer / AI Governance Reviewer
**Materials reviewed:** 18 documents, 3,261 lines (repository working tree, no commits present)
**Review type:** Independent design review. No redesign, no document rewriting, no implementation.
**Status of this report:** Advisory to the accountable human reviewers named in the Phase 1.1 exit gate.

---

## 1. Executive summary

This is a materially above-average Phase 1 package. The governance-first sequencing, the AI isolation boundary with mandatory deterministic output validation, the provenance envelope, the refusal to impute missing data, and the consistent non-diagnostic posture across all eighteen documents are stronger than most pre-implementation packages I review, and stronger than many shipped consumer health products. The authors have correctly identified that privacy and governance are architectural properties rather than documentation artifacts, and the deferral discipline — physical design genuinely deferred, open questions enumerated per document — is sound.

The package nevertheless cannot be ratified at the Phase 1.1 exit gate in its current form. Seven Critical findings block Phase 2 entry. Five of the seven are **internal contradictions between binding documents** rather than omissions, which matters: they cannot be resolved by an implementation choice in Phase 2 and will not surface as bugs — they will surface as unbuildable requirements or as unenforceable promises to users.

The most consequential pattern across the package is this: **the framework does not apply to itself, and several mandated controls have no defined mechanism.** The Versioning Framework requires every released artifact to carry a version, digest, owner, approvers and effective date; none of the seven binding standards carry any of them. The Constitution prohibits data collection until a per-element purpose/classification/legal-basis/retention register exists; no such register exists or is scheduled. Signed policy bundles are mandated with no root of trust. Tamper-evident audit is mandated with no integrity mechanism. Under the Constitution's own rule — *"absence of compliance evidence is treated as non-compliance"* — the package currently fails its own test.

The second pattern is a set of **binding-document contradictions that a careful implementer will hit in week one of Phase 2**: cryptographic erasure requires per-subject key control that the security design's "provider-managed encryption at rest" does not provide; a deletion tombstone is required to be simultaneously non-identifying and subject-specific; universal fail-closed behaviour is asserted alongside a 99.5% availability target with no governance high-availability budget and no degraded read path; an adults-only boundary is asserted while date of birth is explicitly excluded from collection; and a P0 release-blocking safety capability depends on a free-text field that three other documents recommend excluding.

The third pattern is **scale and cost blindness**. There is no user-count assumption, no event-volume model, no storage growth estimate, no latency budget decomposition, and no snapshotting strategy — in an event-sourced design where a single daily check-in plausibly produces 40+ events, each carrying a ~25-field provenance envelope, a 16-field version manifest and an explanation manifest. The metadata will exceed the payload by an order of magnitude. This is not a Phase 2 concern that can be deferred; it determines the event-store technology choice that Phase 2 opens with.

**Release recommendation: CONDITIONAL GO.** Approve Phase 1.1 as a design baseline. Do not authorise Phase 2 implementation as a single block. See §12 for the two-track gate and a proposed Phase 1.2 closure scope.

### Findings at a glance

| Severity | Count | Definition used in this review |
| --- | ---: | --- |
| Critical | 7 | Blocks Phase 2 entry. Contradiction between binding documents, unenforceable mandate, or legal/safety exposure. Not resolvable by an implementation decision. |
| High | 26 | Must close before the affected Phase 2 workstream begins. |
| Medium | 35 | Close before Phase 3 (private beta). |
| Low | 11 | Track as accepted debt with an owner. |

---

## 2. Scope, method and limitations

**In scope.** All documents in `docs/`, plus the repository root state. Reviewed against: the package's own internal consistency; common architecture and security practice for consumer health-adjacent products; GDPR/UK GDPR structural expectations (special-category data, Art. 8 children, Art. 30 records, Art. 35 DPIA, breach clocks); and general AI governance practice for isolated-inference architectures.

**Out of scope.** Legal advice on classification or jurisdiction. Clinical or wellness-evidence review of the recommendation content. Vendor selection. Code review (no code exists). Cost estimation beyond order-of-magnitude commentary.

**Method.** Full read of every document; cross-document consistency checking on shared concepts (missingness, confidence, deletion, versioning, authority tiers); arithmetic verification of the scoring method against the stated product principles; enumeration of mandated-but-undefined controls; and repository state inspection.

**Limitations.** No human reviewer, owner or approver is named anywhere in the package, so I could not verify whether any finding below has already been considered and accepted. Where a document lists a gap in its own "Open questions", I have said so and graded the finding on whether the open question is compatible with the Phase 1.1 exit gate — several are not.

---

## 3. What is genuinely strong

Stated so the remediation effort does not erode it.

1. **Governance-first Phase 2 ordering.** Implementing the policy registry, Governance Engine, deployment admission and audit reconciliation *before* any feature is the correct sequence and is rarely done. Preserve this even under schedule pressure.
2. **The AI isolation boundary.** Raw → Normalization → Analytics → Governance → Structured Facts → optional AI → deterministic Output Validator → User, with "never ask the model to self-certify compliance" and fail-closed to deterministic rendering, is a stronger pattern than most production AI systems use. The explicit statement that naming Claude does not approve Claude is good governance hygiene.
3. **Non-bypass enumeration.** The twelve Governance Enforcement Rules, particularly "protected controls", "evidence requirement" and "no alternate path", are specific enough to test against.
4. **Data honesty discipline.** Missing ≠ zero; no imputation without an approved versioned method; a null score with a reason preferred over a fabricated number; "unknown" as an explicit state rather than a silent inference. This is the difference between a trustworthy wellness product and a plausible-looking one.
5. **Non-diagnostic boundary held consistently** across all eighteen documents, including the crucial statement that *"disclaimers do not cure unsafe functionality"*.
6. **Anti-engagement product principles.** Explicit prohibition of shame-based, fear-based and compulsive mechanisms, and the refusal to tune thresholds for engagement, are unusually mature.
7. **Superseded ADRs retained with rationale** (ADR-003, ADR-004, ADR-007) rather than deleted.

---

## 4. Critical findings

### C-01 — The Constitution has no runtime authority and no accountable humans

**Documents:** `governance/governance-constitution.md`, `phase-1/governance.md`, `phase-1/implementation-roadmap.md` (D-10)

The Constitution is `1.0.0-draft`, "not effective until ratified", and states that "draft versions have no runtime authority". Every other document declares itself subordinate to it. The logical consequence is that the package currently has **zero effective governance**: every subordinate control is nominally in force and actually unowned. No constitutional authority, governance owner, independent approver or dispute resolver is named. The eight roles in the governance specification are described but unfilled.

This is self-acknowledged by the package, which is to its credit — but it is the gate, not a footnote. Every other finding in this report is unassignable until it is closed.

**Recommendation.** Name the four constitutional positions and the eight operational roles by person before any other remediation. Where a single person holds multiple roles, record the recusal rule and the external independent reviewer who will discharge the separation-of-duties requirement (see H-20). Ratify with a signed, dated approval record stored as an artifact, not as prose.

---

### C-02 — The binding standards violate the Versioning Framework they impose

**Documents:** all of `architecture/*`, `security/privacy-by-design.md`, `phase-1/system-architecture.md`, `phase-1/security-design.md`

The Versioning Framework requires every released artifact to carry: family and semantic version, immutable release identifier, content digest, status, owner and named approvers, created/approved/effective/retired timestamps, predecessor and compatibility declaration, change summary, validation evidence reference, and the governance version that authorised it.

None of the seven binding standards carry a single one of those fields. Each carries only `**Status:** Draft for Phase 1.1 review`. The Constitution is the only document in the package with a version number. The Privacy by Design Standard — which gates every feature's entry into implementation — has no named owner at all.

Combined with the Constitution's rule that *"absence of compliance evidence is treated as non-compliance"* and the Versioning Framework's rule that *"mutable labels ... are not valid stored version references"*, the binding standards are, by their own terms, not validly released artifacts. Any Phase 2 event that must record a `governance_version` has nothing valid to record.

**Recommendation.** Before ratification, issue each binding standard as a versioned artifact with the full identifier set and a content digest. This is a mechanical change and should take under a day; leaving it undone invalidates the version-binding chain that the entire architecture depends on.

---

### C-03 — No per-data-element governance register exists, and the Constitution prohibits collection without one

**Documents:** `governance/governance-constitution.md` (Data Governance rules 1–2), `phase-1/data-model.md`, `security/privacy-by-design.md`

Constitutional Data Governance rule 1 requires **every data element** to have a documented purpose, classification, owner, legal basis where applicable, retention rule, deletion behaviour and approved consumers. Rule 2 states: *"Data collection is prohibited until those records exist and required approvals are complete."*

The data model provides per-entity field lists with meanings and constraints. It does not provide any of the seven required attributes per field. The governance specification provides a five-tier classification scheme but does not map fields to tiers. The Privacy by Design Standard provides an excellent per-feature template, but a per-feature record is not a per-element register, and no instance of the template has been completed for any feature.

The most-cited constitutional data obligation in the package therefore has no corresponding artifact and no scheduled deliverable. Phase 2's data work is blocked by construction, not by choice.

**Recommendation.** Produce a data dictionary keyed by element (not entity) covering all fields in `data-model.md` plus the provenance envelope, version manifest, explanation manifest and audit event. Populate the Privacy by Design template for at least the three P0 features (consent, check-in, wellness summary) as worked examples before Phase 2 entry. Treat the register as a versioned artifact under C-02's rules.

---

### C-04 — The adults-only boundary is unenforceable as designed

**Documents:** `phase-1/product-requirements.md`, `phase-1/data-model.md` (Profile), `phase-1/implementation-roadmap.md` (D-01), `security/privacy-by-design.md`

The product requirements exclude minors from the target user. D-01 recommends "adults using their own data; no minors" as the starting position. The Privacy by Design Standard requires "age eligibility and guardian issues if relevant" in every feature record.

The data model's Profile entity states: *"Age/date of birth, sex, diagnoses, pregnancy, medication, and disability are excluded until a specific safe use case, purpose, and review exist."* No age signal is collected anywhere. No age-assurance control, self-declaration gate, or age-estimation mechanism appears in any document. There is no requirement, no functional requirement, no acceptance criterion, and no test.

You cannot enforce an age floor while refusing to collect or derive any age signal. This is a direct contradiction between two binding positions, and it carries concrete regulatory exposure: UK Age Appropriate Design Code, GDPR Art. 8, and COPPA all attach obligations that begin at "the service is likely to be accessed by children", not at "we intended adults only".

**Recommendation.** Resolve as a G3 decision before Phase 2: either (a) collect a minimal age-assurance signal (self-declared date of birth or age band) with its own purpose, retention and deletion record, accepting the minimisation cost; or (b) formally accept and document the residual risk with legal sign-off and design the product to be safe for a child who reaches it anyway. Option (b) has significant consequences for the scoring, recommendation and safety-response designs and should not be chosen implicitly by omission.

---

### C-05 — The P0 safety capability has no assured input and no governed rule artifact

**Documents:** `phase-1/product-requirements.md` (P0 item 7, FR-10), `phase-1/governance.md` (hazard register), `phase-1/security-design.md`, `phase-1/scoring-methodology.md`, `phase-1/implementation-roadmap.md` (D-04, D-07), `architecture/explainability-standard.md`, `architecture/versioning-framework.md`

Product requirements list safety response as **P0, required for first release**: detect configured crisis or urgent-care phrases *in free text* using deterministic rules, suppress normal recommendations, and present reviewed support language.

Four other documents undercut the input this depends on:

- D-04 recommends excluding free-text notes initially unless research proves value.
- Security design: "The first implementation should store plain text only if product review confirms its value."
- Scoring methodology excludes free text from numerical scoring.
- Privacy by Design lists "whether free-text notes remain excluded from the initial implementation" as an open question.

**If notes are excluded, the release-blocking safety capability has no input at all.** No document states what the safety posture is in that case, and none acknowledges the dependency.

Four further gaps compound this:

1. **No version family.** The Versioning Framework defines eight independently versioned authorities. The urgent-risk phrase list — the highest-harm artifact in the product — is not among them, and unlike recommendation content (which has `eligibility_rule_version` and `contraindication_rule_version`) it has no versioned artifact anywhere.
2. **No false-negative governance.** Deterministic phrase matching on free text has a high false-negative rate by construction. No metric, review cadence, or hazard entry addresses missed detection. The hazard register lists "false reassurance after concerning input" but not "urgent-risk rule failed to fire".
3. **No explainability contract.** The Explainability Standard covers scores, trends, recommendations and AI-assisted output. The safety interruption — the highest-stakes user-facing output in the product — is outside its scope entirely. (Also recorded as H-13.)
4. **Expectation risk.** Presenting crisis detection at all creates a user expectation of monitoring, which the Constitution explicitly forbids the product from representing. No document addresses how to offer detection without implying surveillance.

**Recommendation.** Resolve D-04 and D-07 together as a single G3 decision before ratification — they are not independent. If free text is excluded, either drop P0 item 7 from the MVP with an explicit recorded rationale and a stated safety posture, or define an alternative input. If free text is included, create a versioned safety-rule family, add false-negative and false-positive hazards to the register with owners and review cadence, extend the Explainability Standard to cover suppression, and add the expectation-management language to the boundary policy.

---

### C-06 — The scoring methodology cannot be ratified as written

**Document:** `phase-1/scoring-methodology.md`

The Phase 1.1 exit gate requires reviewers to ratify "the scoring policy and validation plan". The document self-declares as "Proposed method for validation, not approved for production", which is appropriate — but it cannot be ratified even as a *method to validate*, because its core is undefined and two of its defined parts contradict binding principles elsewhere in the package.

**(a) The core transform is absent.** "The utility transform from `z` to 0–100 is domain-specific and monotonic only where 'more' is safely better." No curve, no target band, and no boundary example is given for any domain. The single most important component of the method — the function that converts a standardised deviation into a user-visible number — is deferred entirely. There is nothing to validate.

**(b) Day-one confidence contradicts a P0 requirement and a product principle.** Substituting a complete first-day check-in into the stated support index:

```text
support = 0.40×coverage + 0.25×freshness + 0.20×baseline_maturity + 0.15×consistency
        = 0.40×1.0    + 0.25×1.0       + 0.20×(1/14)          + 0.15×1.0
        = 0.400       + 0.250          + 0.014                + 0.150
        = 0.814  →  band 0.70–<0.85  →  "Moderate confidence"
```

A single day of data with no personal baseline yields **Moderate confidence**. The product requirements' first-use journey states "Product explains that early scores have low confidence". The product principle states "insufficient data produces 'not enough information,' not a confident number". The method as specified does the opposite. `baseline_maturity` carries only 20% weight, so the absence of any baseline can never pull support below the suppression threshold when coverage and freshness are good.

**(c) The overall score is not comparable across days.** The method requires "at least three eligible domains" and computes an equal-weight mean, while explicitly stating "Do not reweight domains based on ... availability because that makes day-to-day comparisons opaque". An equal-weight mean over a *variable-cardinality* set is itself availability reweighting: a user with four eligible domains on Monday and three on Tuesday receives a mechanically different overall score for identical behaviour. The stated defence and the stated method are the same thing.

**(d) A score discontinuity at the baseline switch is unaddressed.** The comparison basis flips from "fixed, reviewed transforms" to "personal baseline" at exactly 14 valid observations in 28 days. The user's score can step for no behavioural reason on that day. Post-launch monitoring tracks "score distribution and discontinuities by method version" but not by baseline transition, and no user-facing explanation covers it.

**(e) Two suppression gates are uncoordinated.** Domain scores are suppressed below 60% coverage; overall support is suppressed below 0.45. No specification covers the resulting mixed states (domains visible, overall suppressed, or the reverse), which will be the common case for a sparse user.

See also H-23 (ordinal statistics), H-24 (utility direction and behavioural harm), M-33, M-34, M-35.

**Recommendation.** Do not ratify. Return for a second draft that publishes the utility curves and target bands with boundary examples, re-derives the confidence weighting so that a no-baseline state cannot exceed "Low", replaces the variable-cardinality overall mean with a fixed-domain-set rule (or drops the overall score, which D-05 already recommends), and specifies the baseline-transition and mixed-suppression behaviours. This is the single largest remediation item in the package and should be scoped at two to three weeks of scoring-owner time.

---

### C-07 — Universal fail-closed contradicts the availability target and blocks user rights

**Documents:** `phase-1/system-architecture.md` (Failure behavior), `phase-1/product-requirements.md` (NFR-01), `governance/governance-constitution.md` (Audit Principles, Governance Enforcement Rules), `phase-1/architecture-decisions.md` (ADR-006)

The architecture mandates fail-closed at thirteen enumerated failure modes, including "Governance unavailable/incompatible → do not process or display affected output" and "Output Validator unavailable → do not display affected output". ADR-006 explicitly notes "availability of the policy evaluator becomes safety-critical". NFR-01 sets 99.5% monthly availability.

Three unresolved consequences:

1. **No availability budget for the governance stack.** Every read and every write passes through the Governance Engine and the Output Validator. Their availability multiplies into the product's. No high-availability design, replication strategy, decision caching, or degraded read mode is described. Notably, the Feature Flag Framework *does* provide for a "signed cached safe state" on flag-service unavailability; governance policy conspicuously does not. A 99.5% product target sitting behind an uncached, unreplicated, mandatory synchronous policy evaluation is not achievable by assertion.

2. **Fail-closed is a denial-of-service amplifier.** An attacker who can degrade the Governance Engine, the policy registry or the audit store denies service to *all* users, including read-only access to their own existing data. No rate limiting, bulkheading, isolation or resource-quota design is specified for these components specifically. The security design's resource-exhaustion row addresses the application generally, not the safety-critical control plane. The control that makes the product safe is also its most attractive availability target, and no document acknowledges the trade-off.

3. **Fail-closed audit blocks a user right.** Constitutional Audit Principles: "High-risk actions fail closed if required audit evidence cannot be written." Architecture: "Audit unavailable for high-risk action → Reject the action." Account deletion is a high-risk action *and* a user right with (eventually) a regulatory clock. As written, an audit-store outage rejects deletion requests. No queue, retry-with-guaranteed-eventual-audit, or compensating commitment is defined.

**Recommendation.** Add an availability and latency architecture for the control plane before Phase 2: policy-decision-point/policy-enforcement-point split, signed policy bundle caching with explicit staleness bounds and a fail-closed expiry, replication, and an explicit decision on whether read-only access to previously validated results may survive a governance outage. Define a durable-intake path for user-rights requests such that an audit outage delays completion but never rejects the request. Decompose NFR-01 and NFR-02 into per-component budgets.

---

## 5. High findings

Ordered by workstream. Each must close before the Phase 2 workstream it affects begins.

### Architecture and assurance

**H-01 — A modular monolith cannot structurally guarantee non-bypass.**
`system-architecture.md` goal 1 is "make constitutional governance structurally mandatory". ADR-002 selects a modular monolith; ADR-008 permits "physical databases may remain shared initially if controls are equivalent". In a single process with a shared database, nothing structurally prevents a module from reading another module's tables or from constructing an alternate analytics-to-user path — the guarantee rests on convention, code review and conformance tests. The verification strategy asserts "architecture conformance tests prove there is no analytics-to-user or raw-data-to-AI route" without saying how (static dependency analysis? runtime capability restriction? credential scoping?). *Recommendation:* either downgrade the "structural" claim to "enforced by build-time dependency rules, per-module database credentials, and runtime capability restriction", or isolate the Governance Engine and the AI boundary as separate processes with distinct credentials. State which, and specify the conformance-test mechanism concretely.

**H-15 — Two documents occupy two authority tiers simultaneously.**
`docs/README.md` lists System Architecture under "Architecture standards" (tier 2, binding) and Security Design under "Security and privacy" (tier 2), while both live in `phase-1/` (tier 3, "proposed methods"). The Constitution cites `phase-1/system-architecture.md#mandatory-governed-processing-pipeline` as a **binding standard**. The AI isolation control therefore has ambiguous authority. *Recommendation:* relocate or explicitly re-designate both documents and state their tier in their own headers.

**H-16 — The flow diagram contradicts flow invariant 9.**
In `system-architecture.md` the event-driven data flow shows the deterministic renderer branch joining the path to the user at the same point as the Output Validator's output — i.e. bypassing validation. Flow invariant 9 states "Output validation is mandatory for AI and deterministic rendering", and the Constitution agrees. A diagram defect on the final safety control will be copied into implementation. *Recommendation:* correct the diagram.

**H-14 — No client or device security and privacy design exists.**
A client is required for every P0 journey, yet no document addresses on-device storage of wellness data, OS-level backup exposure (iCloud/Google), screenshot and app-switcher exposure, clipboard, biometric/local lock, offline cache contents, client-side logging, or device loss. The trust-boundary diagram begins at the capture boundary and ends at "[User]" without modelling the client as a boundary at all. *Recommendation:* add a client trust-boundary section, even before the platform decision (D-03), covering what may be persisted on device and under what protection.

**H-11 — No scale, volume, growth or latency budget model.**
No target user count, events/day, event-store growth rate, projection rebuild time, replay time, or storage cost appears anywhere. This matters more here than in a typical design: a single daily check-in with nine metrics plausibly generates raw + normalized + quality-assessment events per metric, plus four domain calculations, an optional overall, explanation manifests and audit events — order 40 events per user per day, each carrying a ~25-field provenance envelope, a 16-field version manifest, and a feature-flag snapshot. **The metadata will exceed the payload by roughly an order of magnitude.** No snapshotting strategy is mentioned in the Event Sourcing Standard. NFR-02's p95 ≤500ms read has no budget decomposition across normalization → quality → analytics → governance → validator, and "under expected load" is undefined. *Recommendation:* produce a one-page volumetric model and a latency budget before selecting the event store; add snapshotting to the Event Sourcing Standard.

### Data lifecycle and deletion

**H-02 — Cryptographic erasure contradicts provider-managed encryption at rest.**
`event-sourcing.md` proposes "per-subject or scoped encryption keys where the approved threat model supports cryptographic erasure". `security-design.md` specifies "provider-managed encryption at rest for database, backups, and object storage", with field-level encryption merely "to be evaluated". Provider-managed at-rest encryption gives no per-subject key control and therefore cannot support crypto-shredding. Two binding documents propose incompatible key architectures. Additionally, crypto-erasure's residual risks are not characterised: retained ciphertext, key material inside backups that must itself be destroyed, key loss equalling data loss, and the fact that some regulators do not accept crypto-shredding as erasure. *Recommendation:* resolve as a single G3 key-architecture decision with a stated residual-risk acceptance.

**H-03 — The deletion tombstone must be both non-identifying and subject-specific.**
`event-sourcing.md`: "A deletion marker blocks delayed imports, retries, or projection rebuilds from recreating the subject" and "retained event metadata must not enable re-identification". To block rehydration of a *specific* subject the marker must carry a stable subject reference, which is identifying by linkage. Both requirements are asserted; neither is reconciled. *Recommendation:* specify a concrete mechanism (e.g. keyed hash of `subject_id` under a key with its own destruction schedule, or a bounded-lifetime marker) and record the residual linkability risk explicitly.

**H-07 — Retention is undefined everywhere, and two paths are unbounded.**
Every row of the data model's retention table reads "to be approved", "short", or "fixed period". Privacy by Design prohibits indefinite defaults but supplies no defaults itself. Two specific unbounded paths: (i) backup retention has no maximum, so "deletion from immutable backups is delayed until backup expiry" is an unbounded promise to users; (ii) **quarantine has no expiry or resolution state machine**, so quarantined personal data — data that failed validation and is unavailable for any purpose — may be retained indefinitely. *Recommendation:* set provisional numeric retention for every category before Phase 2 (they can be revised; absence cannot), cap backup retention, and add a quarantine resolution deadline with automatic disposition.

**H-08 — No response clocks for user rights or breach notification.**
No DSAR/export/deletion completion commitment exists (FR-09 has no time bound; the product goal "completed within product promise: 100%" measures against an undefined promise). No breach-notification timeline appears in any document; the security design mentions "notification assessment" only. Both are jurisdiction-dependent, but the *absence of any placeholder clock* means Phase 2 will design workflows with no target. *Recommendation:* adopt provisional clocks now (e.g. 30 days for rights requests, 72 hours for supervisory-authority notification) and mark them for legal confirmation at D-02.

**H-18 — No consequence specification for consent withdrawal on derived data.**
Withdrawal "launches the documented cleanup workflow" — which is not documented anywhere. What happens to scores, recommendations, explanation manifests and projections derived under a now-withdrawn purpose? Retained, suppressed, recalculated, or deleted? This is the most common real-world consent failure and it is undefined. *Recommendation:* define per-purpose withdrawal consequences in the governance specification's consent table.

### Data model and semantics

**H-05 — The data model omits entities that other binding documents mandate.**
Missing or referenced-but-undefined: `ApprovalRecord` (referenced by `PolicyVersion.approval_record_id` and `ScoringMethodVersion.approval_record_id`), `EvidenceRecord` for wellness claims (mandated by the governance specification), hazard register entries, `GovernancePolicyArtifact`/policy bundle, `QualityAssessment` decision events, the `ExplanationManifest` field set (mapped in the diagram but never specified in the entity list), `StructuredFactsPackage`, `AIInvocation`, safety-rule version and safety-event records, feature-flag definition and state, deletion marker/tombstone, idempotency key/command record, processor register, the `purpose_code` catalogue, and the identity/session partition. Several of these are referenced by foreign key from entities that *are* defined. *Recommendation:* complete the entity set; a conceptual data model with dangling references to undefined entities cannot be approved as a Phase 2 baseline.

**H-06 — Three divergent missingness vocabularies.**
`data-model.md` defines `missingness_reason` as `not_provided | not_applicable | declined | null`. `data-quality-framework.md` defines `not_provided | declined | not_applicable | source_unavailable | unknown`. `explainability-standard.md` defines a fourteen-value controlled taxonomy. No mapping exists between them. The same user-facing concept has three incompatible encodings across three binding documents. *Recommendation:* adopt one controlled vocabulary as normative (the Explainability set is the superset), and define the mapping to the storage-level subset explicitly.

**H-25 — Free text is modelled as a measurement metric.**
`note` appears in `MetricDefinition` alongside `sleep_duration`, inheriting `value_type`, `canonical_unit`, `valid_range`, `directionality` and `sensitivity_class`, and therefore inheriting the full measurement provenance envelope (`Raw Value`, `Normalized Value`, `Measurement Unit`, `Confidence`, `Measurement Classification`). None of those apply meaningfully to free text, and free text has entirely different privacy, retention (it has its own retention row), safety and export semantics. *Recommendation:* model notes as a distinct entity, not a metric.

**H-19 — No glossary; "Structured Facts" is undefined and "Confidence" is overloaded.**
Structured Facts is the central security boundary of the entire architecture — the AI isolation guarantee, the Governance Engine's output contract, and the Output Validator's input contract all depend on it — and its schema is listed as an open question. Meanwhile "confidence" carries three distinct meanings: the provenance envelope's measurement Confidence, the Data Quality Framework's confidence assignment, and the scoring method's `support` index rendered as a confidence band. The Explainability Standard's universal contract requires "confidence and what that confidence means" without disambiguating which. *Recommendation:* add a normative glossary; give Structured Facts at least a conceptual field contract before Phase 2 (its schema drives the AI boundary, the deterministic renderer, and the Output Validator simultaneously).

### Versioning and reproducibility

**H-09 — The version compatibility matrix is combinatorially unbounded.**
Eight independently versioned families, plus metric definitions, quality rules, flag configuration, recommendation content and validator rules, all carry immutable versions; the Governance Engine "evaluates an explicit compatibility matrix before processing or display"; and "unknown versions fail closed". No default compatibility policy exists (e.g. patch-level auto-compatible within a family), no matrix generation or maintenance strategy is described, and no mitigation for test explosion is proposed. This is the highest-probability source of day-to-day operational fragility in the design: any un-enumerated combination halts the product. *Recommendation:* define default compatibility rules per family so the matrix encodes exceptions rather than the full cross-product, and specify how the matrix is generated and tested.

**H-10 — Replay under changed governance versions is unresolved and conflicts with a constitutional rule.**
The Constitution forbids "latest" lookups from rewriting historical meaning. Rebuilding a projection therefore requires executing the *historical* governance and calculation versions — which requires retaining and being able to run retired executable artifacts. "How long retired executable artifacts must remain available for reproducibility" is an open question in the Versioning Framework, and "replay authorization when governance versions have changed" is an open question in the Event Sourcing Standard. Together these mean projection rebuild — a routine operation — has no defined correct behaviour. *Recommendation:* resolve both open questions together before selecting the event store; they constrain the choice.

**Missing version families.** Neither the urgent-risk safety rules (see C-05) nor safety-reviewed user-facing copy and its locale variants have a version family, despite both being higher-harm artifacts than several families that do.

### Security

**H-04 — A prompt-injection path already exists in the current design.**
Security design defers prompt injection entirely to "any future model design". But the design already contains user-controlled free-form strings that may reach the AI boundary: `note` (2,000 characters) and `ContextTag`'s "`tag_code` **or user label**". No rule in the Constitution's AI Behaviour Rules, the Structured Facts description, or the Governance Engine's responsibilities prohibits user-controlled text from entering Structured Facts. The Output Validator is specified to check schema, claims, disclosures and provenance — not to detect that the model followed injected instructions that produced schema-valid output. *Recommendation:* add a constitutional rule that Structured Facts contain only controlled-vocabulary values and system-generated text unless a specific approved schema permits a minimised, sanitised user string; and require the AI-policy version to declare any such field explicitly.

**H-12 — Tamper-evident audit is mandated with no mechanism.**
FR-11 requires "tamper-evident audit events"; the Constitution requires audit that application roles cannot alter or delete; the data model provides an `integrity_metadata` field with no definition. No hash chaining, Merkle structure, WORM storage, write-once retention policy, or external anchoring is specified, and infrastructure-level roles retain deletion capability. "Append-only to application roles" is not tamper evidence. *Recommendation:* specify the integrity mechanism; for a small team, provider-native immutable/object-lock storage plus periodic hash-chain anchoring is proportionate.

**H-21 — Signed policy bundles are mandated with no root of trust.**
Governance Enforcement Rule 4 requires "signed policy bundles" as a non-bypass control, and deployment admission depends on them. No signing key custody, root of trust, bootstrap procedure (how the first bundle becomes trusted), key rotation, or signing-key revocation design exists. The Versioning Framework lists "artifact-signing mechanism" as an open question — but the control is mandatory, not optional. *Recommendation:* specify key custody and the trust bootstrap before Phase 2's governance registry work, which is the first Phase 2 deliverable.

**H-26 — No threat model artifact with ratings or owners.**
The security acceptance gate requires "reviewed threat model with owners and residual risks". The abuse-case table has seventeen well-chosen rows with preventive and detective controls, but no severity, likelihood, residual risk rating, or owner on any row, and no per-boundary threat enumeration against the trust-boundary diagram. As written, the gate cannot be passed with the artifact provided. *Recommendation:* add rating and ownership columns and run a structured pass (STRIDE or equivalent) against each trust boundary in the architecture diagram.

**H-22 — No operator or developer AI-use policy.**
The Constitution claims authority over "every AI interaction" and every "automated system". There is no policy governing engineers using AI assistants on governed artifacts, AI-assisted generation of policy-engine or scoring code, or operators pasting user data into external AI tools. Given that this documentation package itself appears to be AI-assisted, this is a live rather than theoretical gap, and it interacts with the supply-chain controls in the secure delivery lifecycle. *Recommendation:* add an internal AI-use policy covering data handling, artifact provenance, and independent human review of AI-generated governance and safety artifacts.

### Governance and process

**H-20 — No minimum-viable governance design for a small team.**
The Constitution requires that "authors cannot solely approve G2/G3" changes and that security, privacy and wellness-safety owners hold independent stop-ship authority. The governance specification permits "one person may hold multiple roles in a small team". For a solo or two-person team these are irreconcilable, and no fallback is designed: no recusal rule, no quorum definition, no contracted external reviewer, no minimum viable team size below which the product may not launch. This is, in my assessment, the single most likely real-world failure mode of the entire framework — not because it is subtle, but because schedule pressure will make self-approval the path of least resistance and nothing structurally prevents it. *Recommendation:* define the minimum governance configuration explicitly, including the named external reviewer(s) who discharge independence when roles collapse, and make the configuration a deployment-admission check rather than a process promise.

**H-17 — No requirements traceability artifact.**
FR-01–FR-20 and NFR-01–NFR-08 exist; nothing maps them to architecture components, ADRs, tests, privacy records or Phase 2 backlog items. "Traceability to approved requirements and the current governance version" is a constitutional release gate, and Phase 2 backlog entry criteria require "an approved requirement and acceptance criteria". Neither can be satisfied without the artifact. *Recommendation:* produce a traceability matrix as a Phase 1.2 deliverable; it is also the cheapest way to surface the remaining coverage gaps (see §7).

**H-23 — Personal-baseline statistics degenerate on ordinal inputs.**
Six of the eight scored inputs are 1–5 ordinals mapped to {0, 25, 50, 75, 100}. For such data the median absolute deviation is frequently exactly zero (a user reporting mood = 3 on ten of fourteen days), forcing the "approved minimum spread" fallback. Because `z = clamp((current − center) / spread, −3, 3)`, a small spread floor makes a single one-step change saturate the clamp immediately. **The personal-baseline machinery therefore degenerates into a near-binary "same as usual / very different" signal for most of the scored inputs.** Separately, the document states that "ordinal differences must not be described as precise equal physiological intervals" and then performs interval arithmetic (weighted means, MAD, z-scores) on exactly those values. *Recommendation:* use rank- or distribution-based comparison for ordinals, or state explicitly that the ordinal mapping is treated as interval by product convention and validate the consequence; and specify the minimum-spread value with worked boundary examples.

**H-24 — Utility direction is unspecified in exactly the places where it causes behavioural harm.**
Sleep: "more favorable values increase domain score within reviewed ranges" — no range given; a monotonic-increasing sleep utility rewards fourteen hours of sleep. Activity: "neither maximum nor minimum is automatically best" and a "reviewed target band" — no band given; with duration weighted 0.60, a rest day (0 minutes, a legitimate value distinct from missing) scores low and drags the domain and overall scores down. The validation plan explicitly requires checking that the design "does not shame, reward overtraining, or discourage professional care" — the method as specified will do the first two unless the undefined curves prevent it. *Recommendation:* publish the curves and bands with the method, and add rest-day and long-sleep cases to the adversarial validation set.

---

## 6. Medium findings

Close before Phase 3 (private beta). Ordered by document.

| ID | Document | Finding |
| --- | --- | --- |
| M-01 | system-architecture | Analytics computes before governance authorisation in the mandated sequence; intermediate analytics artifacts have no defined classification, storage location, or retention. |
| M-25 | system-architecture | Failure table omits identity-provider outage, event-store write failure, partial append/project, poison events, and clock skew — the last is material given the DST and observed/received timestamp rules. |
| M-30 | product-requirements | FR-13–FR-20 "acceptance criteria" restate the requirement rather than defining verifiable evidence, unlike FR-01–FR-12. |
| M-28 | product-requirements | The week-4 retention KPI (≥35%) is structurally an engagement loop; no governance control prevents it from driving design decisions the Constitution prohibits. |
| M-29 | product-requirements | "Confirmed high-severity unsafe recommendations = 0" is a detection-suppressing target with no defined confirmation process, evidence standard, or window. |
| M-12 | product-requirements | No internationalisation/localisation requirement despite `locale` (BCP 47) in Profile and undecided jurisdiction. |
| M-19 | product-requirements / security-design | Identity proofing for export and deletion is informal ("support cannot bypass identity proofing casually" is not a control). |
| M-15 | governance (phase-1) | Wellness data is not explicitly classified as special-category/sensitive in the consent purpose table, though the privacy record asks for that analysis. |
| M-13 | governance (phase-1) | Incident severity targets (SEV-1 at 15 minutes) are provisional with no on-call model, coverage hours, or user-facing statement of actual response capability. |
| M-14 | governance (phase-1) | No processor/subprocessor register despite processor review being an assigned privacy-lead responsibility. |
| M-26 | governance / feature-flags | Feature-flag changes are not mapped to the G0–G3 decision classes; enabling the AI module is self-evidently G3 but this is not stated. |
| M-04 | data-model | `Subject.status = suspended` is an ungoverned account-state power: no grounds, actor, notice, appeal, or guarantee that data rights survive suspension (the Constitution requires kill capability not to disable user rights). |
| M-05 | data-model | `recorded_by` permits an "authorized system actor" to write observations; no prohibition on operator-authored observations attributed to a subject (the quality framework forbids impersonating a *device*, not a *user*). |
| M-08 | data-model | "At most one active check-in per local date" has no defined behaviour for timezone travel or DST, where a local date can legitimately recur or be skipped. |
| M-09 | data-model | `Profile.version` optimistic-concurrency counter imports CRUD concurrency into an event-sourced model that already carries aggregate versions. |
| M-06 | source-provenance | `Confidence` is mandatory on every measurement including manual entry, while the confidence scale is an open question — guaranteeing a fabricated constant and meaningless metadata debt. |
| M-07 | source-provenance | `Device` is mandatory on every measurement; this conflicts with minimisation and creates a device-fingerprint trail. Necessity is never assessed, only the storage granularity. |
| M-02 | data-quality | The classification model conflates three orthogonal axes on one list — origin (Manual/Device Measured/Calculated), condition (Duplicate/Incomplete/Missing/Unknown) and disposition (Rejected, which is also a terminal disposition) — producing ambiguous states. |
| M-03 | data-quality | Operator manual quality override is a privileged path into scoring with no role definition, dual control, or rate limit. |
| M-10 | explainability | Explanations expose feature-flag and module state to users, leaking rollout and roadmap state and aiding system mapping; this sits in tension with "explanations must not expose hidden security controls". |
| M-11 | explainability | Safety-reviewed user-facing copy has no version family, no locale-variant approval process, and no artifact, though the standard's own example disclaims being "approved copy". |
| M-33 | scoring | The domain coverage gate (≥60%) and the support-band suppression gate are uncoordinated; mixed states (domains shown, overall suppressed) are unspecified and will be the common sparse-user case. |
| M-34 | scoring | A 7-day trend on ≥4 daily scores (57% coverage) displaying median and IQR is statistically thin; no multiple-comparison control is defined despite the document acknowledging the risk. |
| M-35 | scoring | Double rounding (domain scores, then the mean of rounded domain scores) biases the overall score and interacts with the undefined "notable change" thresholds. |
| M-24 | event-sourcing | Event schema evolution strategy (upcasting, tolerant reader, weak schema) is undefined; snapshotting is not mentioned at all. |
| M-27 | feature-flags | Kill switches assume connectivity; if offline support is later adopted (an open question), client-side kill enforcement becomes impossible. |
| M-20 | security-design | Account recovery has no threat analysis beyond "encrypt recovery material", despite being the primary account-takeover path for this data class. |
| M-21 | security-design | No end-user MFA requirement (only "prefer passkeys"), no session/device list, no user-visible session revocation. |
| M-22 | security-design | No vulnerability remediation SLA, no vulnerability disclosure policy or `security.txt`, no penetration-test scope definition. |
| M-23 | security-design | Separation of duties covers *approval* only; no dual control for high-risk *execution* (policy activation, key destruction, bulk deletion, restore). |
| M-16 | privacy-by-design | No DPIA trigger threshold; for special-category data with automated scoring, "may require a formal data-protection impact assessment" should read "requires". |
| M-17 | privacy-by-design | No rule for third-party personal data in free text (partners, clinicians, employers), though the risk list names it. |
| M-18 | privacy-by-design | No analytics event allowlist artifact is required as a deliverable, though "restrict analytics to allowlisted event names" is a control. |
| M-31 | docs/README | No tie-breaker when two peer binding standards conflict; authority order resolves vertical conflicts only. |
| M-32 | repository | The repository instantiates none of the mandated process controls: no commits at all, no CODEOWNERS, no PR template, no CI policy check, no approval log, no `.gitignore`. Five empty top-level directories (`architecture/`, `decisions/`, `governance/`, `requirements/`, `security/`) duplicate `docs/` subdirectories and create canonical-location ambiguity. |

---

## 7. Low findings

| ID | Document | Finding |
| --- | --- | --- |
| L-01 | event-sourcing | Vendor vocabulary (`WHOOP Sync Completed`, `Glucose Added`, `Recovery Imported`) is baked into the event catalogue of a deliberately provider-neutral domain (ADR-001). |
| L-02 | feature-flags | Reserved `Glucose` and `Body Composition` module flags invite non-diagnostic boundary drift; glucose in particular is medical-device adjacent. |
| L-03 | security-design | A TLS 1.2 floor is soft for a 2026 greenfield build; TLS 1.3 with a constrained 1.2 fallback would be the stronger default. |
| L-04 | source-provenance | "AI Version required when AI *materially* processed the record" — "materially" is undefined and will be interpreted permissively. |
| L-05 | event-sourcing | "Split event envelope from encrypted personal payload **where practical**" places a discretionary qualifier on a privacy-critical control. |
| L-06 | versioning | "`api_contract_versions[]` ... exact persistence *may* be trace metadata" weakens the otherwise absolute "reference every applicable version" rule. |
| L-07 | feature-flags / event-sourcing | The feature-flag snapshot stored in every event is a fingerprinting and re-identification vector in exports and in any data leak. |
| L-08 | constitution | Data Governance rule 10 (no production data in dev/test/demo/analytics) has no incident-evidence exception path, unlike the parallel audit-log clause. |
| L-09 | constitution | No periodic re-ratification, review cadence, or expiry for the Constitution itself. |
| L-10 | product-requirements | FR-04 "same normalized inputs" should read "same input manifest" — a score depends on 28 days of history that corrections and deletions can mutate. |
| L-11 | scoring | "Novelty within limits" as a recommendation ranking factor is a mild engagement lever in a product that otherwise rejects them. |

---

## 8. Consolidated registers

The following consolidate findings by the categories requested. IDs cross-reference §4–§7 rather than restating.

### 8.1 Missing requirements

| # | Missing requirement | Related |
| --- | --- | --- |
| MR-1 | Per-data-element governance register (purpose, classification, owner, legal basis, retention, deletion, consumers) | C-03 |
| MR-2 | Age assurance / age-floor enforcement control | C-04 |
| MR-3 | Authentication, session management, account recovery and rate limiting as *functional* requirements (present in security design, absent from the FR set, therefore untraceable) | H-17, M-20, M-21 |
| MR-4 | Requirements traceability matrix (FR/NFR → component → ADR → test → privacy record → backlog) | H-17 |
| MR-5 | Scale, volume, growth and cost requirements; latency budget decomposition | H-11 |
| MR-6 | Availability requirement for the governance control plane; degraded-mode definition | C-07 |
| MR-7 | User-rights response clocks and breach notification clocks | H-08 |
| MR-8 | Consent-withdrawal consequence specification for derived data | H-18 |
| MR-9 | Client/device security and privacy requirements | H-14 |
| MR-10 | Safety-rule version family, false-negative metrics, and safety-interruption explainability | C-05, H-13 |
| MR-11 | Internationalisation/localisation, and safety review of localised copy | M-11, M-12 |
| MR-12 | Normative glossary and Structured Facts contract | H-19 |
| MR-13 | Internal AI-use policy for operators and developers | H-22 |
| MR-14 | Analytics event allowlist; processor register; records-of-processing artifact | M-14, M-18 |
| MR-15 | Concrete retention periods for every category, including a backup retention cap and quarantine expiry | H-07 |

### 8.2 Security risks

| Risk | Severity | Finding |
| --- | --- | --- |
| Fail-closed control plane as a denial-of-service amplifier; no isolation or rate limiting for Governance Engine, policy registry, audit store | Critical | C-07 |
| Prompt injection via user-controlled `note` and `ContextTag` label reaching Structured Facts; no rule prohibits user text in Structured Facts | High | H-04 |
| Non-bypass guarantee rests on discipline, not architecture, in a modular monolith with a shared database | High | H-01 |
| Tamper-evident audit mandated with no integrity mechanism; infrastructure roles retain delete capability | High | H-12 |
| Signed policy bundles mandated with no root of trust, key custody, or bootstrap | High | H-21 |
| Client/device attack surface entirely unmodelled (on-device storage, OS backup, screenshots, offline cache) | High | H-14 |
| No rated, owned threat model; acceptance gate unsatisfiable with the artifact provided | High | H-26 |
| Provider-managed at-rest encryption only; no protection against database compromise or privileged insider with DB access, for data the document itself calls highly sensitive | High | H-02 |
| Account recovery unanalysed — the primary ATO path for this data class | Medium | M-20 |
| Operator paths into trusted data: quality override, `recorded_by` system actor, account suspension | Medium | M-03, M-04, M-05 |
| No dual control for high-risk execution (key destruction, policy activation, bulk deletion) | Medium | M-23 |
| No vulnerability SLA, VDP, or defined penetration-test scope | Medium | M-22 |
| Explanations leak feature-flag and module state | Medium | M-10 |
| Flag snapshot in every event as a fingerprinting vector | Low | L-07 |

### 8.3 Privacy risks

| Risk | Severity | Finding |
| --- | --- | --- |
| Collection prohibited by the Constitution until a per-element register exists; none exists | Critical | C-03 |
| Age floor unenforceable; children's-data obligations unaddressed | Critical | C-04 |
| Crypto-erasure vs provider-managed encryption contradiction leaves erasure undeliverable as specified | High | H-02 |
| Deletion tombstone must be non-identifying and subject-specific simultaneously | High | H-03 |
| No retention periods; backup retention uncapped; quarantine unbounded — three independent paths to indefinite retention of personal data | High | H-07 |
| No DSAR or breach clocks | High | H-08 |
| Consent withdrawal has no defined effect on derived results | High | H-18 |
| Mandatory `Device` on every measurement creates a fingerprint trail, contrary to minimisation | Medium | M-07 |
| No DPIA threshold for what is plainly DPIA-triggering processing | Medium | M-16 |
| Third-party personal data in free text has no rule | Medium | M-17 |
| Wellness data not explicitly classified as special category in the consent table | Medium | M-15 |
| No processor register or records-of-processing artifact | Medium | M-14 |
| Metadata volume (provenance envelope, version manifest, flag snapshot per event) is itself a privacy surface not assessed against minimisation | Medium | H-11 |

### 8.4 Governance gaps

| Gap | Severity | Finding |
| --- | --- | --- |
| Constitution unratified; no named authority, owner, approvers or dispute resolver | Critical | C-01 |
| Binding standards do not comply with the Versioning Framework they impose | Critical | C-02 |
| Separation of duties unachievable at small team size, with no designed fallback | High | H-20 |
| Safety rules have no version family, no false-negative governance, and no hazard entry | Critical | C-05 |
| Signed-bundle trust root undefined | High | H-21 |
| No operator/developer AI-use policy despite constitutional claim over "every AI interaction" | High | H-22 |
| No traceability artifact, though traceability is a release gate | High | H-17 |
| Authority tier ambiguity for System Architecture and Security Design | High | H-15 |
| Feature-flag changes not mapped to decision classes | Medium | M-26 |
| Account suspension is an ungoverned power | Medium | M-04 |
| Incident response targets with no staffing model | Medium | M-13 |
| Engagement KPI unconstrained by any governance control | Medium | M-28 |
| No peer-standard conflict tie-breaker | Medium | M-31 |
| Repository instantiates no mandated process control; no version-control baseline for artifacts required to be immutable and digest-verified | Medium | M-32 |
| No re-ratification cadence for the Constitution | Low | L-09 |

### 8.5 Scalability concerns

| Concern | Severity | Finding |
| --- | --- | --- |
| No volumetric, growth, latency-budget or cost model for an event-sourced design where metadata exceeds payload by ~10× | High | H-11 |
| Governance Engine evaluated at every command, event consumption, calculation, facts creation, AI invocation and output, with no caching, PDP/PEP split, or decision-latency budget | Critical | C-07 |
| Version compatibility matrix across 8+ families with fail-closed on unknown combinations | High | H-09 |
| No snapshotting; no stream-size, replay-time or projection-rebuild budget | High | H-11, M-24 |
| Replay under changed governance versions requires retaining and executing retired artifacts; retention period undefined | High | H-10 |
| Quarantine with no expiry grows without bound | High | H-07 |
| Explanation manifest stored per result under the same retention as the result — a second storage multiplier | Medium | H-11 |
| NFR-02 p95 ≤500ms with an undefined load model behind a five-stage synchronous pipeline | Medium | H-11 |

### 8.6 Future technical debt

| Debt | Finding |
| --- | --- |
| Mandatory `Confidence` on manual entries before a confidence scale exists → a hardcoded constant that will persist for years and pollute every explanation | M-06 |
| Mandatory `Device` on every measurement → a fingerprint field that will be hard to remove once downstream consumers depend on it | M-07 |
| Free text modelled as a metric → wrong provenance, retention and export semantics baked into the schema | H-25 |
| Three missingness vocabularies → mapping code at every boundary, forever | H-06 |
| Version compatibility matrix maintenance and test explosion | H-09 |
| Retired executable artifact retention for reproducibility → an ever-growing archive of runnable historical logic | H-10 |
| Per-subject key management (key store growth, backup, rotation, destruction proof, recovery) | H-02 |
| Feature-flag proliferation with no removal deadline (an acknowledged open question) | feature-flags |
| Vendor vocabulary in a provider-neutral event catalogue | L-01 |
| Optimistic-concurrency counters coexisting with aggregate versions | M-09 |
| Empty duplicate top-level directories | M-32 |

---

## 9. Per-document assessment

| Document | Assessment | Findings |
| --- | --- | --- |
| `README.md` (root) | Accurate and appropriately scoped. | M-32 |
| `docs/README.md` | Clear authority order; incomplete for peer conflicts and tier assignment. | H-15, M-31 |
| `docs/phase-1/README.md` | Good review ordering and exit-gate framing; assumes artifacts that do not exist. | C-01, H-17 |
| `product-requirements.md` | Strong product boundary and principles; requirement set has real coverage gaps and two internal contradictions. | C-04, C-05, C-07, H-11, H-17, M-12, M-19, M-28, M-29, M-30, L-10, MR-3 |
| `governance-constitution.md` | The strongest document in the package. Comprehensive, specific, testable in most clauses. Undermined by non-ratification and by mandating controls with no mechanism. | C-01, C-02, C-03, H-04, H-19, H-20, H-21, H-22, L-08, L-09 |
| `phase-1/governance.md` | Good role and decision-class structure; missing registers, clocks and withdrawal semantics. | C-03, C-04, H-08, H-18, H-20, M-13, M-14, M-15, M-26, M-29 |
| `system-architecture.md` | Well-reasoned boundaries and failure table; the assurance claim exceeds what the chosen topology delivers, and one diagram contradicts a flow invariant. | C-07, H-01, H-11, H-14, H-15, H-16, M-01, M-25 |
| `source-provenance-standard.md` | Excellent and unusually rigorous. Cost of the envelope and two mandate-before-definition problems are unaddressed. | C-02, H-11, M-06, M-07, L-04 |
| `data-quality-framework.md` | Strong validation pipeline and propagation rules. Classification model needs a multi-axis rework; quarantine needs a lifecycle. | C-02, H-07, M-02, M-03 |
| `versioning-framework.md` | Conceptually correct and the right instinct. Operationally unbounded, and it does not apply to the package's own artifacts. | C-02, H-09, H-10, L-06, MR-10 |
| `scoring-methodology.md` | Honest about its own limits, but its core is absent and its defined parts contradict binding principles. The weakest document relative to its role. | C-06, H-23, H-24, M-33, M-34, M-35, L-11 |
| `explainability-standard.md` | Very strong. The universal contract and the missing-data taxonomy are exemplary. Omits the highest-stakes output type. | C-02, H-13, H-19, M-10, M-11 |
| `feature-flags.md` | Solid, with a good protected-controls list and rollout ladder. Minor gaps in approval mapping and offline behaviour. | C-02, M-26, M-27, L-02, L-07 |
| `event-sourcing.md` | Good, including the explicit warning against surveillance-by-event-store. Two unresolved contradictions sit on the deletion path. | C-02, H-02, H-03, H-10, H-12, M-24, L-01, L-05 |
| `security-design.md` | Broad and competent coverage. Missing ratings, client surface, and a key architecture consistent with the erasure model. | C-07, H-02, H-14, H-26, M-19–M-23, M-25, L-03 |
| `privacy-by-design.md` | Excellent template; the best per-feature privacy control I have seen at this stage. Never instantiated, and missing children's data and clocks. | C-02, C-03, C-04, H-07, H-08, M-16, M-17, M-18 |
| `data-model.md` | Good modelling principles and integrity constraints. Materially incomplete against the entities other binding documents require. | C-03, H-05, H-06, H-07, H-25, M-04, M-05, M-08, M-09 |
| `architecture-decisions.md` | Well-formed ADRs with retained supersessions. ADR-002/008 create the assurance gap in H-01; no proposer, date or sign-off block on any decision. | H-01, H-17, C-02 |
| `implementation-roadmap.md` | The best-sequenced part of the package — governance before features is correct. Exit evidence assumes artifacts that do not exist. | C-01, H-17 |

---

## 10. Prioritised recommendations

**P1 — Ratification blockers (must complete before any Phase 2 authorisation).**

1. Name the constitutional authority, governance owner, independent approvers, dispute resolver, and the eight operational role holders. Record the recusal and external-reviewer arrangement that discharges separation of duties at actual team size. *(C-01, H-20)*
2. Re-issue all seven binding standards as versioned artifacts with digest, owner, approvers, effective date and compatibility statement. Establish a version-control baseline: commit the package. *(C-02, M-32)*
3. Produce the per-data-element governance register and complete the Privacy by Design record for the three P0 features. *(C-03)*
4. Decide age assurance as a G3 decision, with legal sign-off on whichever branch is chosen. *(C-04)*
5. Resolve D-04 and D-07 jointly and restate the safety posture, including the case where free text is excluded. Create the safety-rule version family and add false-negative hazards. *(C-05)*
6. Return the scoring methodology for a second draft: publish utility curves and target bands, re-derive the confidence weighting, fix the overall-score comparability rule, and specify the baseline transition. *(C-06)*
7. Add a control-plane availability and latency architecture, and a durable user-rights intake that an audit outage delays but never rejects. *(C-07)*

**P2 — Before the affected Phase 2 workstream starts.**

1. Resolve the key architecture: per-subject keys vs provider-managed encryption, with a stated crypto-erasure residual risk. Specify the deletion tombstone mechanism. *(H-02, H-03)*
2. Complete the data model's entity set and unify the missingness vocabulary. *(H-05, H-06)*
3. Set provisional retention for every category; cap backup retention; give quarantine an expiry. Adopt provisional rights and breach clocks. *(H-07, H-08)*
4. Define Structured Facts conceptually, prohibit unsanitised user-controlled text within it, and add a normative glossary. *(H-04, H-19)*
5. Produce the volumetric model, latency budget and snapshotting strategy *before* selecting the event store; resolve replay-under-changed-governance and retired-artifact retention at the same time. *(H-09, H-10, H-11)*
6. Specify the signed-bundle trust root and the audit integrity mechanism. *(H-12, H-21)*
7. Either strengthen the topology to match the "structural" non-bypass claim or restate the claim, and specify the conformance-test mechanism concretely. *(H-01)*
8. Add the client trust boundary, rate the threat model, and write the internal AI-use policy. *(H-14, H-22, H-26)*
9. Build the traceability matrix; correct the authority tiers and the renderer/validator diagram. *(H-15, H-16, H-17)*
10. Extend the Explainability Standard to cover safety interruption. *(H-13)*
11. Define consent-withdrawal consequences per purpose. *(H-18)*

**P3 — Before Phase 3 private beta.** All Medium findings, prioritising M-02 (quality classification axes), M-04/M-05 (operator powers), M-16 (DPIA), M-20/M-21 (recovery and MFA), M-24 (schema evolution and snapshots), and M-25 (missing failure modes).

**P4 — Track as debt with named owners.** All Low findings.

---

## 11. Suggested Phase 1.2 closure scope

The Criticals are not uniformly expensive. Four are largely documentation work; three require genuine design.

| Workstream | Content | Rough effort |
| --- | --- | ---: |
| Ratification and artifact hygiene | C-01, C-02, M-32, ADR sign-off blocks | 3–5 days |
| Data governance register | C-03, three worked privacy records, H-06 vocabulary unification | 5–8 days |
| Legal and boundary decisions | C-04, C-05 (jointly with D-02, D-04, D-07) | 5–10 days, gated on external legal input |
| Scoring second draft | C-06, H-23, H-24, M-33–M-35 | 10–15 days |
| Control-plane and deletion design | C-07, H-02, H-03, H-07, H-12, H-21 | 10–15 days |
| Scale and versioning operability | H-09, H-10, H-11, M-24 | 5–8 days |
| Completion and consistency | H-05, H-13, H-14, H-15, H-16, H-17, H-19, H-22, H-26 | 8–12 days |

With parallelisation across the named owners, three to five calendar weeks is a realistic closure window. The legal-dependent items (C-04, C-05) are the most likely to extend and should start first.

---

## 12. Release recommendation

**CONDITIONAL GO.**

Approve the Phase 1 / 1.1 package as a **design baseline**, subject to the Critical remediation in §10 P1. Do not authorise Phase 2 as a single block.

**Recommended gate structure.**

**Track A — permitted once C-01 and C-02 close.** Repository and process controls (version control baseline, CODEOWNERS, PR template, CI policy checks, approval log); stack and platform ADRs; the governance policy registry and Governance Engine skeleton; deployment admission; audit reconciliation. Constraints: synthetic data only, no personal-data schema frozen, no client work, no scoring implementation.

This track is deliberately permitted early because it is the roadmap's own first Phase 2 deliverable, it touches no personal data, and building the governance registry is the fastest way to force C-02's version identifiers into a machine-checkable form.

**Track B — blocked until all seven Criticals plus H-01, H-02, H-03, H-05, H-06, H-07, H-09 close.** Anything that defines, stores, or processes a personal-data path: data model freeze, migrations, ingest, check-in, scoring implementation, client development, and any privacy record instantiation for a real feature.

**Non-negotiable conditions on progression.**

1. No Phase 2 work item may enter the backlog without a completed privacy record and a traceability entry — the roadmap's own entry criteria, which currently cannot be satisfied because neither artifact exists.
2. The Phase 1.1 exit gate must not be signed by the document authors alone. If the team cannot supply an independent approver internally, engage an external reviewer before ratification rather than after.
3. The scoring methodology must not be marked approved-for-implementation on the strength of this package. It is a method skeleton, and §4 C-06 demonstrates two defects that contradict binding product principles.
4. Re-review the package after remediation. Five of the seven Criticals are contradictions between binding documents; fixes to contradictions frequently introduce new ones.

**Assessment of overall readiness.** The design intent here is sound and, in places, exemplary — the AI isolation boundary, the provenance discipline, the explainability contract and the anti-engagement posture are all better than the market norm for this product category. The gap is not one of judgement but of closure: a framework that mandates evidence has not yet produced evidence for itself, and several of its strongest commitments to users (erasure, age floor, availability, crisis response) are currently undeliverable as specified. Those are fixable in weeks, not quarters, and are far cheaper to fix now than after a schema exists.

---

*This report is an independent advisory assessment. It does not constitute legal advice, a regulatory determination, or a clinical safety review. Jurisdictional classification, legal basis, children's-data obligations, and wellness-claim evidence require qualified review by the relevant professionals before launch.*
