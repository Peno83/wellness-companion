# Wellness Companion Governance Constitution

- **Document Identifier:** GOV-CON-001
- **Version:** 1.0.0
- **Owner:** Andrew Penfold
- **Approver:** Andrew Penfold
- **Effective Date:** 2026-08-05
- **Review Date:** 2026-11-05
- **Status:** Ratified
- **Authority:** Highest governing document
- **Applies to:** Every product decision, architecture, feature, dataset, calculation, AI interaction, release, operator action, and third-party relationship

## Constitutional authority

This constitution is the highest authority for Wellness Companion. Requirements, architecture decisions, designs, source code, configurations, prompts, models, analytics, contracts, release plans, and business objectives are subordinate to it.

No future feature, experiment, integration, commercial objective, deadline, or instruction may violate this constitution. A conflict must be resolved in favor of the constitution. If compliance cannot be proven, the affected processing or release must stop. No role, including founder, product owner, administrator, engineer, model, or automated system, may grant an exception outside the change approval process defined here.

## Product Purpose

Wellness Companion helps an adult understand their own wellness observations, reflect on patterns, and consider low-risk, reversible actions. It supports informed self-reflection and personal agency. It does not replace professional care.

## Product Scope

The product may:

- collect data the user knowingly provides or explicitly authorizes;
- normalize measurements without hiding their source or original representation;
- calculate transparent, versioned wellness summaries and trends;
- present uncertainty, missingness, exclusions, and limitations;
- offer human-reviewed, low-risk wellness suggestions;
- let users correct, export, restrict, and delete their data;
- use AI only inside the bounded, governed role defined below.

## Product Boundaries

The product must not:

- diagnose, screen for, confirm, rule out, predict, or monitor a disease or disorder;
- prescribe treatment, medication, dosage, clinical testing, or emergency action;
- claim clinical efficacy, medical-device status, or professional oversight unless a later constitutionally approved program establishes and verifies it;
- present correlations as causes or scores as objective measures of health, readiness, worth, or safety;
- pressure users to disclose optional sensitive data;
- sell wellness data, use it for advertising, or permit employer or insurer decision-making;
- use manipulative, shame-based, fear-based, or compulsive engagement mechanisms;
- silently repurpose data, weaken protections, or conceal material uncertainty;
- allow any AI system or downstream module to bypass governance.

## Non-Diagnostic Principles

1. All outputs are wellness information, not medical advice.
2. Language must describe observations and uncertainty, not diseases or clinical conclusions.
3. A wellness score cannot establish whether a user is healthy, safe, ill, injured, or fit for an activity.
4. The system must not infer medical conditions from measurements, free text, missing data, or behavior.
5. Concerning user input may suppress normal wellness guidance and display human-approved support language, but the product must not claim clinical triage.
6. Users must be encouraged to seek qualified professional help when a reviewed safety rule requires it, without implying that the product assessed their condition.
7. Disclaimers do not cure unsafe functionality. Product behavior itself must remain non-diagnostic.

## AI Behaviour Rules

AI is an optional, isolated presentation component, never the authority for truth, policy, safety, or data access.

- AI must never access raw database tables, raw event stores, credentials, direct identifiers, or unrestricted user records.
- AI may receive only the minimum approved **Structured Facts** produced after normalization, analytics, and governance evaluation.
- The Governance Engine determines what facts and actions are permitted before AI invocation. AI cannot override, reinterpret, or weaken that decision.
- AI must not create new measurements, claim access to absent data, infer diagnoses, invent provenance, or state causation.
- AI must distinguish supplied facts from generated wording and preserve uncertainty, missingness, exclusions, time period, and applicable versions.
- AI output is untrusted until a deterministic Output Validator checks schema, policy, prohibited claims, required disclosures, provenance references, and version compatibility.
- Invalid, ambiguous, or unavailable AI output must fail closed to an approved deterministic fallback or no output.
- Prompts, AI policies, provider/model versions, structured input schemas, and output schemas are independently versioned and auditable.
- User data must not be used for shared model training or provider retention unless a future constitutional change and separate explicit consent authorize it.
- No AI feature may be enabled without a feature flag, safety evaluation, privacy review, rollback plan, and human approval.

The mandatory flow is:

```text
Raw Data
    ↓
Normalization Engine
    ↓
Analytics Engine
    ↓
Governance Engine
    ↓
Structured Facts
    ↓
Claude or another approved AI system
    ↓
Output Validator
    ↓
User
```

Claude is named only as a possible future component. This constitution does not approve, connect, or select Claude or any external AI provider.

## Data Governance Rules

1. Every data element requires a documented purpose, classification, owner, legal basis where applicable, retention rule, deletion behavior, and approved consumers.
2. Data collection is prohibited until those records exist and required approvals are complete.
3. Raw, normalized, calculated, AI-produced, audit, and identity data must remain distinguishable.
4. Every measurement must comply with the [Source Provenance Standard](../architecture/source-provenance-standard.md). No record may lose its origin.
5. Every incoming measurement must pass the [Data Quality Framework](../architecture/data-quality-framework.md). Rejected or unknown data cannot silently become trusted input.
6. Derived results must reference all applicable versions defined by the [Versioning Framework](../architecture/versioning-framework.md).
7. Every change is represented by an immutable event under the [Event Sourcing Standard](../architecture/event-sourcing.md). Corrections supersede; they do not rewrite history.
8. Data minimization applies to collection, processing, display, logs, analytics, support, exports, and incident evidence.
9. Personal event payloads remain subject to deletion. Immutability is not permission to retain personal data forever.
10. Production data must not be copied into development, testing, demonstrations, or general analytics.

## Privacy Principles

- Privacy is an architectural property, not a notice added after development.
- Collect the minimum data needed for a specific approved purpose.
- Default optional collection, sharing, analytics, and AI use to off.
- Separate identity from wellness data and minimize linkability.
- Limit access by subject, role, action, purpose, consent, and policy version.
- Prevent sensitive content from entering URLs, logs, telemetry, error tools, or support systems.
- Define retention before collection and verify deletion across source, derived, event, cache, queue, export, backup, and third-party copies.
- Use privacy-preserving aggregates and suppress small cohorts.
- Apply the [Privacy by Design Standard](../security/privacy-by-design.md) to every feature.

## User Consent Principles

1. Consent must be informed, specific, granular, freely given where applicable, recorded, and easy to withdraw.
2. Optional purposes cannot be bundled with core operation or preselected.
3. Refusing or withdrawing an optional purpose must not degrade unrelated functionality.
4. A material purpose, processor, data category, or AI-use change requires renewed consent before processing.
5. Background jobs must re-check consent at execution time.
6. Withdrawal stops future processing and starts the documented restriction or deletion workflow.
7. Consent records must identify purpose, policy version, governance version, time, jurisdiction context, and capture surface.
8. Consent is not valid authorization for behavior prohibited by this constitution.

## Transparency Principles

Users must be able to learn, in plain language:

- what data is collected and why;
- whether data was manual, imported, device-measured, device-estimated, or calculated;
- what is missing, rejected, duplicated, stale, or excluded;
- how a score, trend, recommendation, or AI response was produced;
- which time period and versions apply;
- whether AI was used and which facts it received;
- who receives data and for what purpose;
- how to correct, export, restrict, or delete data;
- when a material governance, scoring, AI, or privacy change takes effect.

## Explainability Principles

- Every score must answer “Why?” using user-visible contributing facts.
- Every trend must identify contributing data, missing data, excluded modules, analyzed period, calculation version, and confidence.
- Every recommendation must identify its reviewed content source, eligibility reason, limitations, and expiry.
- Every AI-assisted output must identify AI involvement and remain traceable to approved Structured Facts.
- Explanations must not expose hidden security controls, other users’ data, or unsupported precision.
- If the system cannot produce a faithful explanation, it must not present the result.

The binding details are in the [Explainability Standard](../architecture/explainability-standard.md).

## Source Provenance Principles

1. Origin is permanent lineage, even when display formats or units change.
2. Original values and timestamps are preserved alongside normalized values and timestamps.
3. Calculations reference exact source record versions, not mutable logical records.
4. Import method, device, classification, confidence, quality, and all applicable versions travel with the measurement.
5. Unknown provenance lowers trust and may require rejection; it cannot be inferred or fabricated.
6. Exports include provenance in an understandable form.
7. AI may summarize provenance supplied in Structured Facts but may not create or alter it.

## Audit Principles

- Governance decisions, consent changes, sensitive access, feature-flag changes, data rights, calculation releases, AI policy changes, and administrative actions create immutable audit events.
- Audit records identify actor, action, target reference, decision, reason, time, governance version, and trace reference.
- Audit logs exclude raw wellness values, free text, secrets, and AI prompt content unless a separately approved incident process requires narrowly scoped evidence.
- Application roles cannot alter or delete audit evidence outside an approved retention process.
- High-risk actions fail closed if required audit evidence cannot be written.
- Audit access is privileged, time-bound, justified, and itself audited.

## Security Principles

1. Deny by default and grant least privilege.
2. Treat every client, measurement, import, event, prompt, model output, and third-party response as untrusted.
3. Enforce authorization at every boundary; UI restrictions are never sufficient.
4. Protect data in transit and at rest using approved, maintained cryptography.
5. Isolate identities, wellness data, audit evidence, and AI processing.
6. Keep secrets out of source, clients, logs, prompts, and stored user content.
7. Use defense in depth, secure defaults, independent review, and tested recovery.
8. Security controls cannot be disabled by ordinary feature flags or experiments.
9. A security or governance failure in a downstream component must fail closed.
10. Material residual risks require explicit named human acceptance.

## Release Principles

A release is prohibited unless it has:

- traceability to approved requirements and the current governance version;
- evidence that constitutional controls exist at every affected boundary;
- data-purpose, quality, provenance, privacy, security, explainability, accessibility, and safety review as applicable;
- version compatibility and migration evidence;
- feature flags with safe defaults, scoped rollout, monitoring, and rollback;
- tests for expected, missing, duplicate, stale, contradictory, rejected, and malicious inputs;
- tested deletion, export, correction, and consent behavior for affected data;
- named owners and independent approval for high-risk changes;
- no unresolved constitutional conflict.

Commercial urgency, engagement targets, or prior investment cannot waive a release gate.

## Governance Enforcement Rules

Governance must be impossible to bypass by architecture and process:

1. **Mandatory mediation:** All user-visible calculations, trends, recommendations, AI facts, and external data flows pass through the Governance Engine.
2. **No alternate path:** Clients, analytics, AI, jobs, flags, administrators, and future integrations cannot publish directly to users or external recipients.
3. **Fail closed:** Missing, expired, incompatible, or unavailable governance policy blocks processing or uses a pre-approved non-sensitive fallback.
4. **Signed policy bundles:** Effective governance rules are immutable, integrity-verified releases with activation and retirement times.
5. **Version binding:** Every event and stored calculation records the governing version. No “latest” lookup may rewrite historical meaning.
6. **Separation of duties:** Authors cannot solely approve G2/G3 policy, scoring, AI, security, privacy, or release changes.
7. **Constitutional checks:** Design review, CI policy checks, deployment admission, runtime authorization, output validation, and audit reconciliation each enforce the constitution independently.
8. **Protected controls:** Ordinary feature flags cannot disable consent, provenance, quality validation, governance evaluation, output validation, audit, deletion, or security controls.
9. **Stop-ship authority:** Privacy, security, wellness safety, and governance owners may block release in their domain.
10. **Kill capability:** Unsafe modules, rules, integrations, and AI paths must be independently disableable without disabling user data rights.
11. **Evidence requirement:** Absence of compliance evidence is treated as non-compliance.
12. **Violation response:** Suspected violations trigger containment, evidence preservation, owner notification, impact review, correction, and approval before restoration.

## Governance Versioning

Governance uses semantic versions:

- **Major:** Changes product purpose, boundaries, constitutional rights, authority, prohibited behavior, or approval rules. Requires renewed ratification and impact review of all active systems.
- **Minor:** Adds or materially strengthens rules without weakening existing protections. Requires constitutional approval and compatibility assessment.
- **Patch:** Clarifies wording without changing obligations. Requires governance owner and independent reviewer approval.

Each version is immutable and contains a version number, content digest, status, approval record, approvers, approved time, effective time, superseded version, change summary, compatibility statement, and required migrations. Draft versions have no runtime authority. Historical records retain the governance version under which they were processed.

No version may reduce user rights or expand data use through a minor or patch change.

## Change Approval Process

1. **Propose:** Submit the exact change, purpose, affected clauses, risk class, alternatives, and owner.
2. **Assess:** Map affected features, data, events, calculations, AI policies, contracts, consents, releases, users, and jurisdictions.
3. **Review:** Obtain product, governance, privacy, security, wellness-safety, data, scoring, and legal review as applicable.
4. **Test:** Define validation, migration, compatibility, user communication, rollback, and incident evidence.
5. **Approve:** Record named approvals. Major changes require the designated constitutional authority and cannot use emergency approval.
6. **Publish:** Create an immutable version, digest, effective date, change log, and accessible summary.
7. **Migrate:** Update subordinate documents, policy bundles, stored references, user consent where required, and release gates before activation.
8. **Verify:** Prove no active path uses incompatible or ungoverned behavior.
9. **Monitor:** Review safety, privacy, security, user reports, and unintended effects.
10. **Retire or rollback:** Stop the new version if acceptance criteria fail. Preserve version history and notify affected users when material.

Emergency action may disable processing to protect users, data, or service integrity. It may not authorize new data use, weaken a prohibition, or ratify a constitutional change. Emergency action requires a recorded owner and retrospective review within five business days.

## Ratification and unresolved authority

The [Governance Registry](governance-registry.md) names the Constitutional Authority, Governance Owner, Independent Technical Reviewer, Implementation Authority, Release Authority, and Dispute Resolver. Any implementation work outside registered authority or dependent on unresolved constitutional language remains blocked.

## Related binding standards

- [Source Provenance Standard](../architecture/source-provenance-standard.md)
- [Data Quality Framework](../architecture/data-quality-framework.md)
- [Versioning Framework](../architecture/versioning-framework.md)
- [AI Isolation Architecture](../phase-1/system-architecture.md#mandatory-governed-processing-pipeline)
- [Explainability Standard](../architecture/explainability-standard.md)
- [Feature Flag Framework](../architecture/feature-flags.md)
- [Event Sourcing Standard](../architecture/event-sourcing.md)
- [Privacy by Design Standard](../security/privacy-by-design.md)
