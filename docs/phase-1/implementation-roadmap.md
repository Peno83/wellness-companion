# Implementation roadmap

- **Document Identifier:** PLAN-ROAD-001
- **Version:** 0.2.0
- **Owner:** Andrew Penistone
- **Approver:** Not applicable while draft
- **Effective Date:** Not applicable while draft
- **Review Date:** Before authorising the next implementation milestone
- **Status:** draft
- **Governance Approval:** Pending Release Authority review
- **Supersedes:** 0.1.0
- **Current stopping point:** Vendor-neutral product-direction and metric-source architecture amendment; documentation only

**Authority:** Subordinate to the [Governance Constitution](../governance/governance-constitution.md). Schedule or scope cannot waive a constitutional gate.

## Roadmap principles

- Each phase ends with evidence, not a date alone.
- Safety, privacy, scoring, and user-rights work ship with the feature they govern.
- Manual entry proves the core value before external integrations.
- External APIs receive separate threat models, consent scopes, data contracts, and approval.
- Production data is prohibited until launch gates pass.

## Phase 1: Definition and design — completed draft

### Deliverables

- Product requirements.
- System architecture.
- Governance specification.
- Scoring methodology.
- Security design.
- Initial conceptual data model.
- Architecture decision log.
- Gated implementation roadmap.

### Exit criteria

- Human reviewers resolve the decisions below.
- Requirements have named owners and accepted priority.
- Governance roles and stop-ship authority are assigned.
- Security, privacy, wellness safety, and scoring reviewers accept residual risks.
- Phase 2 scope and success evidence are approved.

No application implementation, external API connection, credential setup, vendor SDK, or production infrastructure belongs to Phase 1.

## Phase 1.1: Foundation hardening — completed draft

**Goal:** Make governance the highest non-bypassable authority and define provenance, quality, versions, explainability, rollout, events, privacy, and AI isolation before code.

Deliverables:

- Governance Constitution and constitutional change process.
- Source Provenance Standard and mandatory measurement envelope.
- Data Quality Framework and incoming validation pipeline.
- Independent Versioning Framework and stored calculation manifest.
- Fixed Raw Data → Normalization → Analytics → Governance → Structured Facts → optional AI → Output Validator → User architecture.
- Explainability Standard for scores, trends, recommendations, and AI-assisted wording.
- Feature Flag Framework for every major module with protected core controls.
- Event Sourcing Standard for immutable domain changes and governed projections.
- Privacy by Design Standard and feature privacy-record template.
- Updated architecture diagrams, data model, decisions, security design, indexes, and roadmap.

Exit evidence:

- Humans ratify the Governance Constitution and name its authority, owner, approvers, and dispute resolver.
- All subordinate documents declare constitutional authority and contain no conflicting path.
- Reviewers accept the event-sourcing deletion and cryptographic-erasure direction or choose an alternative that meets user rights.
- Governance, privacy, security, data, scoring, and wellness-safety owners approve the standards.
- Phase 2 backlog items each have constitutional traceability and privacy-design entry criteria.
- No application code, scaffolding, packages, databases, authentication, APIs, integrations, or frontend pages were introduced.

## Phase 1.2: Governance and repository readiness — current phase

**Goal:** Ratify governance authority and create repository controls before implementation.

Delivered:

- ratified Constitution 1.0.0 and Governance Registry 1.0.0;
- named constitutional, governance, implementation, release, review, and dispute authorities;
- version, owner, approver, effective date, review date, status, and document identifier on governance-controlled binding standards;
- repository ignore, editor, and line-ending policy;
- CODEOWNERS, governed issue forms, and pull-request evidence template;
- a manually triggered future CI skeleton whose only job is disabled;
- no application code, package installation, database connection, authentication, or frontend work.

Exit evidence:

- registry and document metadata pass consistency review;
- all local documentation links resolve;
- repository contains no dependency manifest, application source, credential, or generated build output;
- GitHub templates and workflow YAML are structurally reviewed;
- Release Authority confirms readiness for the next separately authorized phase.

Work stops at this gate.

## Phase 2: Foundation and walking skeleton

**Goal:** Prove the internal architecture with synthetic data and no external services beyond approved infrastructure dependencies.

Planned work:

- Choose client/deployment stack through approved ADRs.
- Establish repository standards, CI, dependency policy, environments, and infrastructure definitions.
- Implement constitutional policy registry, Governance Engine, deployment admission, deny precedence, and audit reconciliation first.
- Implement event envelopes, provenance, quality validation, version manifests, projections, and privacy-safe deletion through reviewed physical-design ADRs.
- Implement identity/session boundary, consent/policy checks, module contracts, and protected audit path.
- Deliver a thin manual check-in save/read path using synthetic fixtures.
- Prove analytics cannot reach users and AI cannot access any raw store; AI remains disabled unless separately approved.
- Implement server-authoritative feature flags with all optional modules off and constitutional controls protected.
- Add content-minimized logs, metrics, backups, and restore automation.
- Build automated authorization, tenant-isolation, and rights-workflow test harnesses.

Exit evidence:

- Threat-model controls trace to tests or operational procedures.
- Architecture conformance proves every output passes governance and validation.
- Stored synthetic calculations contain full input lineage, version manifests, and explanations.
- Event replay, correction, deletion, restore, and rehydration-block tests pass.
- Synthetic end-to-end journey works in a non-production environment.
- Restore and rollback tests pass.
- No production personal data or external wellness/model API is used.

## Phase 3: Manual-entry private beta

**Goal:** Validate whether manual reflection, transparent scoring, and curated suggestions are useful and understood.

Planned work:

- Finish accessible onboarding, consent, daily check-in, history, and correction.
- Implement an approved scoring method with golden test vectors and visible confidence.
- Implement curated recommendation content, policy engine, suppressions, and kill switches.
- Implement export, withdrawal, and verified deletion across all stores.
- Complete content, privacy, safety, accessibility, and independent security reviews.
- Run a small, consented private beta under an approved support and incident plan.

Exit evidence:

- Usability comprehension targets are met or explicitly revised.
- Zero unresolved critical/high security findings.
- No confirmed high-severity unsafe recommendation.
- Export/deletion reconciliation and backup restore pass.
- Product owner and stop-ship owners approve progression.

## Phase 4: Reliability and product validation

**Goal:** Demonstrate stable value and safe operation before adding data sources.

Planned work:

- Improve performance, availability, job recovery, and operational dashboards.
- Validate score calibration, missingness behavior, accessibility, and recommendation usefulness.
- Run method-change and rollback drills.
- Establish recurring access, evidence, retention, incident, and safety reviews.
- Decide whether free text and the overall score remain justified.

Exit evidence:

- Approved reliability objectives are sustained.
- Governance review finds no uncontrolled data use.
- Product metrics show value without harmful engagement patterns.
- Integration prerequisites and vendor evaluation template are approved.

## Phase 5: First external data integration — future, separately approved

Phase 5 no longer assumes one universal provider. Before connector implementation, ratify the connector abstraction, provenance, reconciliation, capability, metric-policy, fallback, and methodology-break standards. Complete platform-specific legal, security, privacy, commercial, deletion, branding, and conformance reviews.

The first pilot is read-only, default-off, and selected only after investigation. Planned routes include WHOOP, Fitbit, Garmin, and Oura cloud APIs; Apple HealthKit and Android Health Connect repositories; Samsung Health Data SDK where permitted; and imports/manual fallback. Hume begins through an available health repository while official partner access is investigated.

Synthetic conformance tests precede personal data. Required suites cover duplicates, revocation, deletion, rate limits, transported attribution, source ranking, override/restore, fallback, methodology breaks, incompatible metrics, coverage exclusions, and explanation accuracy.

**Goal:** Add one provider without weakening the provider-neutral domain or user control.

This phase is intentionally not assigned to WHOOP, Apple Health, Health Connect, or any other provider yet. Selection requires a decision record comparing user value, platform reach, permissions, data quality, legal terms, security posture, deletion behavior, rate limits, and operational burden.

Required work for the chosen provider:

- provider-specific product requirements and consent;
- data processing and vendor-risk review;
- adapter contract and provenance mapping;
- token/key lifecycle and revocation design;
- sync, retry, deduplication, correction, and deletion semantics;
- sandbox and synthetic contract tests;
- user-facing source freshness and conflict explanations;
- scoped rollout, monitoring, and kill switch.

Exit evidence must show that revocation stops access, deletion covers provider-derived data, failures do not corrupt manual data, and the canonical domain remains independent.

## Phase 6: Advanced personalization or model assistance — optional future

No external language model, including Claude, is assumed. Before any model is considered, approve a separate product case, data-purpose assessment, architecture decision, threat model, evaluation suite, provider review, disclosure, fallback, and deterministic safety boundary. A model must not diagnose, provide unrestricted wellness advice, or override policy.

## Cross-phase workstreams

| Workstream | Continuous evidence |
| --- | --- |
| Product | Requirement traceability, research findings, outcome and harm metrics |
| Governance | Approval log, claim register, hazard register, incident review |
| Scoring | Method versions, test vectors, validation and drift reports |
| Privacy | Data inventory, purposes, consent, retention, rights completion |
| Security | Threat-model updates, findings, access reviews, recovery tests |
| Accessibility | WCAG acceptance tests and assisted-technology research |
| Operations | Service objectives, runbooks, on-call readiness, rollback drills |

## Human decisions required before Phase 2

| ID | Decision | Recommended starting position | Owner needed |
| --- | --- | --- | --- |
| D-01 | Launch user and age floor | Adults using their own data; no minors | Product + legal/privacy |
| D-02 | Launch jurisdictions | One explicitly reviewed jurisdiction first | Product + legal/privacy |
| D-03 | Client platform | Choose from user research and team capability | Product + engineering |
| D-04 | Free-text notes | Exclude initially unless research proves value | Product + safety + privacy |
| D-05 | Overall score | Start domain-only; test comprehension before adding | Product + scoring + safety |
| D-06 | Scoring parameters | Treat current values as hypotheses requiring validation | Scoring + safety |
| D-07 | Urgent-risk flow | Approve wording, scope, and whether text collection justifies it | Safety + legal + product |
| D-08 | Retention and deletion targets | Short, category-specific, and operationally testable | Privacy + security + ops |
| D-09 | Deployment/data residency | Decide after jurisdiction and platform | Security + privacy + engineering |
| D-10 | Governance staffing | Name people with independent stop-ship authority | Executive/product owner |

## Phase 2 backlog entry criteria

A work item may enter implementation only when it has:

- an approved requirement and acceptance criteria;
- data classification and purpose;
- safety and abuse-case notes where applicable;
- an owner and reviewer;
- dependencies and rollback behavior;
- test evidence defined before coding;
- no conflict with an unresolved Phase 1 decision.

## Review checklist

- Does the package describe the intended user and exclude medical claims clearly enough?
- Are the proposed metrics and recommendations worth their privacy and safety cost?
- Can a user understand why a score exists, what changed it, and when it is uncertain?
- Can consent withdrawal, correction, export, and deletion work across every derived record?
- Are responsibilities and stop-ship powers assigned to real people?
- Does the architecture remain simple enough for the initial team while preserving future boundaries?
- Are the Phase 2 goals small enough to validate the design before feature expansion?

Related: [Phase 1 index](README.md) and [architecture decisions](architecture-decisions.md).
