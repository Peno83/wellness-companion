# Phase 1 and 1.1: Product and foundation definition

**Status:** Phase 1.1 draft for human review  
**Date:** 2026-08-05  
**Scope:** Documentation and design only

This package defines what Wellness Companion should do, how it should be built, and which safeguards must exist before implementation starts. It intentionally contains no production application code, credentials, vendor SDKs, network calls, database connection, authentication integration, API, package setup, or frontend work.

The [Governance Constitution](../governance/governance-constitution.md) is the highest authority. Every document below is subordinate to it.

## Review order

1. [Governance Constitution](../governance/governance-constitution.md) — highest authority and non-bypass rules.
2. [Product requirements](product-requirements.md) — users, outcomes, boundaries, and acceptance criteria.
3. [Governance specification](governance.md) — subordinate operational decision rights and change control.
4. [System architecture](system-architecture.md) — governed event flow, AI isolation, trust boundaries, and failures.
5. [Source Provenance Standard](../architecture/source-provenance-standard.md) — mandatory origin and lineage envelope.
6. [Data Quality Framework](../architecture/data-quality-framework.md) — classifications and incoming validation.
7. [Versioning Framework](../architecture/versioning-framework.md) — independent authorities and calculation manifests.
8. [Scoring methodology](scoring-methodology.md) — transparent wellness scores, uncertainty, and validation.
9. [Explainability Standard](../architecture/explainability-standard.md) — required reasons, inputs, missingness, exclusions, periods, and versions.
10. [Feature Flag Framework](../architecture/feature-flags.md) — safe module rollout and protected controls.
11. [Event Sourcing Standard](../architecture/event-sourcing.md) — immutable changes, projections, corrections, and privacy.
12. [Security design](security-design.md) — threat model, controls, AI boundary, and verification gates.
13. [Privacy by Design Standard](../security/privacy-by-design.md) — mandatory feature privacy record.
14. [Initial data model](data-model.md) — conceptual events, projections, constraints, and retention semantics.
15. [Architecture decisions](architecture-decisions.md) — proposed and superseded decisions.
16. [Implementation roadmap](implementation-roadmap.md) — gated work after Phase 1.1 approval.

## Shared assumptions

- The first release targets one adult using the product for their own wellness reflection.
- The product is not a medical device, does not diagnose or treat disease, and does not replace professional care.
- A user can enter data manually before any third-party integration exists.
- All recommendations must be explainable from user-visible inputs and rules.
- Raw observations remain distinct from derived metrics, scores, and recommendations.
- Sensitive-data minimization, explicit consent, deletion, and auditability are release requirements.
- Exact jurisdiction, supported platforms, deployment model, and commercial model remain open human decisions.

## Phase 1.1 exit gate

Phase 1.1 is approved only when accountable human reviewers ratify or explicitly revise:

- the product boundary and target user;
- the wellness-safety and escalation rules;
- the scoring policy and validation plan;
- the architecture, threat model, data lifecycle, and access model;
- the proposed architecture decisions;
- event-sourcing privacy/deletion semantics and the governed AI isolation boundary;
- provenance, quality, independent versioning, explainability, and feature-flag standards;
- the Phase 2 scope and measurable exit criteria.

Unresolved items are listed in each document and consolidated in the [roadmap](implementation-roadmap.md#human-decisions-required-before-phase-2).
