# Privacy by Design Standard

- **Document Identifier:** SEC-PRIV-001
- **Version:** 1.0.1
- **Owner:** Andrew Penistone
- **Approver:** Andrew Penistone
- **Effective Date:** 2026-08-06
- **Review Date:** 2026-11-05
- **Status:** Ratified
- **Supersedes:** 1.0.0
- **Authority:** Subordinate to the [Governance Constitution](../governance/governance-constitution.md)
- **Rule:** A feature cannot enter implementation until its privacy design record is complete and approved.

## Purpose

Privacy by design makes data protection part of feature definition, architecture, tests, operations, and retirement. A generic privacy policy is not sufficient evidence that a feature is safe or lawful.

This standard is a product and engineering control, not legal advice. Applicable legal bases, rights, and notices require qualified review for each launch jurisdiction.

## Mandatory feature privacy record

Every feature must document all fields below. `Not applicable` requires a reason and reviewer approval.

### Purpose

- User problem and expected benefit.
- Exact processing purposes and prohibited secondary uses.
- Why the purpose cannot be met with less or no personal data.
- Success and retirement criteria.

### Legal basis

- Proposed legal basis for every purpose and jurisdiction.
- Consent requirements and withdrawal effect where consent applies.
- Any special-category/sensitive-data analysis.
- Age eligibility and guardian issues if relevant.
- Qualified legal/privacy reviewer and decision date.

Legal basis must not be guessed by engineers or AI. If unresolved, collection and processing remain blocked.

### Data collected

- Each field, classification, source, provenance requirement, and whether required or optional.
- Raw, normalized, calculated, inferred, AI-produced, identity, event, audit, and telemetry data.
- Data explicitly not collected.
- Data-quality and minimization rules.
- Whether third-party information can appear and how it is handled.

### Storage

- Logical store/event stream/projection and residency.
- Identity separation and linkability controls.
- Production/non-production boundaries.
- Backup, cache, queue, export, log, audit, and support copies.
- Data owner and authorized consumers.

### Encryption

- Protection in transit and at rest.
- Key ownership, scope, rotation, revocation, and recovery.
- Whether field/payload/per-subject encryption is required.
- Cryptographic-deletion behavior where used.
- Residual exposure in memory, clients, exports, and support tools.

### Retention

- Retention period or event-driven condition for each copy and derived form.
- Start point, review cadence, expiry mechanism, and exception.
- Backup expiry and restoration behavior.
- Evidence that automatic retention is monitored.

“While useful” and indefinite retention are prohibited defaults.

### Deletion

- User and system triggers.
- Coverage across raw events, payloads, projections, calculations, AI artifacts, caches, queues, exports, backups, logs, and third parties.
- Tombstone/rehydration prevention without retaining identifying history unnecessarily.
- Completion target, retries, reconciliation, exceptions, and user confirmation.
- Correction and consent-withdrawal interaction.

### Export

- Included data, provenance, versions, explanations, format, and glossary.
- Identity verification and authorization.
- Generation, encryption, download authorization, expiry, and deletion.
- Excluded security data and reasons.
- Portability limitations.

### Third-party sharing

- Recipient, purpose, data fields, jurisdiction/transfer, retention, deletion, subprocessors, and contract.
- Whether the recipient trains models, advertises, profiles, or combines datasets.
- User disclosure and consent.
- Revocation and provider-offboarding behavior.

No third-party sharing is permitted merely because a feature flag is enabled.

### AI usage

- Whether AI is used and why deterministic processing is insufficient.
- Structured Facts fields supplied; raw tables/event streams are prohibited.
- Provider, model, region, retention/training terms, and contract.
- Prompt-template, AI-policy, Structured Facts, output-schema, and validator versions.
- Risks of prompt injection, inference, hallucination, memorization, and data leakage.
- Evaluation, human approval, fallback, feature flag, monitoring, and kill switch.
- User disclosure, consent where applicable, and non-AI alternative.

If AI is not used, state `AI usage: none`. Future activation requires a new approved privacy record.

## Privacy design flow

```text
Feature proposal
      │
      ▼
Purpose + necessity test
      │ fail → do not collect/build
      ▼
Data map + provenance + quality
      │
      ▼
Legal basis + consent + user rights
      │ unresolved → blocked
      ▼
Threat/privacy risk assessment
      │
      ▼
Governance and independent approval
      │
      ▼
Feature-flagged implementation and verification
      │
      ▼
Monitored rollout → retention → retirement/deletion
```

## Design principles

- **Minimize:** Prefer no collection, on-device computation, coarse values, short windows, and user-controlled entry when they meet the purpose.
- **Separate:** Keep identity, wellness, audit, analytics, and AI contexts apart.
- **Limit:** Bind every use to purpose, consent, role, time, governance version, and feature eligibility.
- **Expose:** Make source, AI use, missingness, retention, recipients, and rights understandable.
- **Control:** Give users correction, export, withdrawal, deletion, and optional-feature controls.
- **Protect:** Encrypt, redact, restrict, monitor, and fail closed.
- **Retire:** Remove data, flags, contracts, projections, and access when the feature or purpose ends.

## Privacy risk assessment

Assess at least:

- sensitivity and volume;
- inference and re-identification risk;
- vulnerable users and coercion;
- free text and third-party data;
- source/provider surveillance risk;
- AI/provider retention and training;
- small-cohort analytics;
- linkability across features;
- harmful disclosure through notifications, exports, logs, or support;
- event-sourcing deletion complexity;
- jurisdictional transfer and residency;
- failure impact and reversibility.

High residual risk requires the constitution’s G3 approval path and may require a formal data-protection impact assessment.

## Required acceptance evidence

- Approved privacy record with named owner/reviewer.
- Data-flow and lifecycle diagram.
- Purpose-to-field and consumer access matrix.
- Consent, withdrawal, correction, export, and deletion test cases.
- Retention and backup-restoration test.
- Log/telemetry inspection showing no sensitive content.
- Third-party contract and deletion evidence when applicable.
- AI isolation and output-validation evidence when applicable.
- User-facing notice and explanation review.
- Feature retirement plan.

## Template

```text
Feature:
Owner:
Governance version:
Status:

Purpose:
Legal basis:
Data collected:
Storage:
Encryption:
Retention:
Deletion:
Export:
Third-party sharing:
AI usage:

Data flow:
Risks and controls:
User controls and disclosures:
Test evidence:
Approvals:
Review/expiry date:
```

## Open questions

- Launch jurisdictions and legal reviewer.
- Standard retention categories and deletion targets.
- Data residency and transfer requirements.
- Whether free-text notes remain excluded from the initial implementation.
- Formal privacy-impact threshold and approval body.

Related: [Security Design](../phase-1/security-design.md), [Event Sourcing Standard](../architecture/event-sourcing.md), and [Feature Flag Framework](../architecture/feature-flags.md).

## Document change log

| Version | Effective date | Classification | Change | Approved by |
|---|---|---|---|---|
| 1.0.0 | 2026-08-05 | Initial normative release | Initial ratified SEC-PRIV-001 artifact. The owner and approver were recorded as Andrew Penfold. | Andrew Penfold (historical record; corrected identity: Andrew Penistone) |
| 1.0.1 | 2026-08-06 | Administrative | Corrected the current owner and approver surname to Andrew Penistone. No normative requirements changed. | Andrew Penistone |
