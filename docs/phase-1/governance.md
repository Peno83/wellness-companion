# Governance specification

- **Document Identifier:** GOV-OPS-001
- **Version:** 1.0.1
- **Owner:** Andrew Penistone
- **Approver:** Andrew Penistone
- **Effective Date:** 2026-08-06
- **Review Date:** 2026-11-05
- **Status:** Ratified
- **Supersedes:** 1.0.0
- **Purpose:** Define who may approve changes that affect users, sensitive data, scoring, or safety.

**Authority:** This operational specification is subordinate to the [Governance Constitution](../governance/governance-constitution.md). If the documents conflict, the constitution controls and affected work stops until this specification is corrected. This specification cannot create an exception to the constitution.

## Governance objectives

- Keep the product inside its wellness-support boundary.
- Make material product decisions attributable to named humans.
- Prevent unreviewed score, policy, recommendation, or data-use changes.
- Give users meaningful consent and control.

## Constitutional enforcement

- Every change cites the effective Governance Constitution version and demonstrates compliance.
- Governance Engine evaluation is mandatory before data becomes a trusted calculation, Structured Facts, AI input, or user output.
- Missing, expired, revoked, or incompatible governance fails closed.
- Feature flags, experiments, AI, jobs, operators, and downstream modules cannot disable governance, provenance, quality, version binding, output validation, audit, security, or user-rights controls.
- Every domain change, including governance and feature-flag changes, creates an immutable event.
- Release review must reconcile active paths against the architecture and prove no alternate analytics-to-user or raw-data-to-AI path exists.
- Detect harm, respond quickly, and preserve evidence without expanding data collection.

## Decision bodies and roles

One person may hold multiple roles in a small team, but no author may self-approve a high-risk change.

| Role | Accountable for |
|---|---|
| Product owner | User outcomes, scope, prioritization, and launch decision |
| Wellness safety reviewer | Non-clinical boundary, safety language, escalation rules, content evidence |
| Privacy lead | Purpose limitation, notices, consent, rights, retention, processor review |
| Security lead | Threat model, access control, incident readiness, security acceptance |
| Scoring owner | Method specification, validation, versioning, drift review |
| Data steward | Schema meaning, provenance, quality, lineage, deletion coverage |
| Engineering owner | Feasibility, reliability, implementation evidence, rollback readiness |
| Support/operations owner | User reports, incident routing, response playbooks |

## Decision classes

| Class | Examples | Required approval |
|---|---|---|
| G0: editorial | Typo without meaning change | Author plus normal review |
| G1: routine | UI layout, non-sensitive telemetry label | Product or engineering owner |
| G2: material | New collected field, score threshold, retention change, recommendation category | Product plus relevant privacy/safety/scoring owner |
| G3: high risk | New health inference, urgent-risk flow, external processor, sharing, new jurisdiction | Product, privacy, security, and wellness safety; legal advice where applicable |

Rejected or deferred G2/G3 changes must record rationale. Emergency mitigation may bypass normal timing but not named accountability; it requires retrospective review within five business days.

## Product boundary policy

The product may summarize user-provided wellness data, show trends, and suggest broadly accepted low-risk habits. It may not:

- label a user with a disease, disorder, injury, or mental-health condition;
- recommend starting, stopping, or changing medication or treatment;
- claim that a metric proves causation;
- guarantee outcomes;
- represent itself as monitored by a clinician or emergency service;
- hide material uncertainty or source limitations.

Every user-facing wellness claim needs an evidence record containing the claim, intended audience, evidence source, limitations, owner, approval date, and review date. Expired claims cannot create recommendations.

## Consent and purpose governance

Consent is granular by purpose, not a single blanket checkbox. Proposed purposes are:

| Purpose | Required for core product? | Default |
|---|---:|---|
| Account operation and security | Yes | Required notice/legal basis review |
| Store manual wellness observations | Yes for saved history | Off until explicit action/consent |
| Compute personal summaries and suggestions | Yes for that feature | Off until consent |
| Product analytics using non-content events | No | Off where consent is required; otherwise privacy-reviewed |
| Research or model improvement | No | Prohibited until separately specified and approved |
| Marketing personalization from wellness data | No | Prohibited |

Rules:

- A consent record names purpose, policy version, time, jurisdiction context, and collection surface.
- Withdrawal stops new processing for that purpose and launches the documented cleanup workflow.
- Refusal of optional purposes does not degrade unrelated core functionality.
- Material purpose changes require renewed consent before processing.
- Dark patterns, bundled optional consent, and preselected optional choices are prohibited.

## Scoring and recommendation governance

- Scoring methods and recommendation rules are versioned immutable releases.
- Any change to inputs, weights, normalization, thresholds, missingness, confidence, or copy is G2 or higher.
- A release requires validation results, subgroup checks where lawful and statistically viable, known limitations, rollback criteria, and approval signatures.
- Historical scores retain their original method version. Recalculation creates a new result and never silently rewrites history.
- Users are told when a material method change affects comparability.
- No experiment may weaken a safety rule or hide uncertainty.

The detailed method is in [scoring methodology](scoring-methodology.md).

## Data governance

### Classification

| Class | Examples | Minimum handling |
|---|---|---|
| Restricted wellness | observations, notes, derived scores, recommendations | Strong encryption, explicit purpose, tight access, no general logs |
| Restricted identity | email, authentication identifiers, recovery data | Separate logical access, masked support views |
| Confidential operations | audit events, incident records, configuration | Role-based access and retention schedule |
| Internal non-sensitive | aggregate service health metrics | Access-controlled operational use |
| Public | approved help and policy text | Publication review |

### Lifecycle rules

- Collect only fields tied to an approved requirement and purpose.
- Record provenance and transformation lineage.
- Apply the [Source Provenance Standard](../architecture/source-provenance-standard.md) and [Data Quality Framework](../architecture/data-quality-framework.md) before downstream use.
- Bind every stored calculation to the [Versioning Framework](../architecture/versioning-framework.md) and [Explainability Standard](../architecture/explainability-standard.md).
- Define retention before collection; “indefinite” is not an acceptable default.
- Verify export and deletion end to end, including derived stores, backups under expiration, queues, and vendor copies.
- Use synthetic data in development by default. Production data access is time-bound, approved, and audited.

## Safety management

### Hazard process

Maintain a hazard register with: hazard, initiating condition, affected user, severity, likelihood, controls, residual risk, owner, evidence, and review date. Initial hazards include:

- false reassurance after concerning input;
- alarming language caused by noisy data;
- inappropriate advice for pregnancy, disability, illness, medication, or eating-disorder context;
- disclosure of sensitive notes;
- compulsive score checking or shame-based engagement;
- stale data presented as current;
- demographic or accessibility exclusion.

### Safety-event response

1. Receive report through support, monitoring, or internal discovery.
2. Triage severity without making a clinical determination.
3. Preserve minimal necessary evidence and restrict access.
4. Disable affected rule, recommendation, or feature using a kill switch when warranted.
5. Notify accountable owners and follow security/privacy incident procedures if applicable.
6. Correct user-facing effects where feasible.
7. Complete root-cause and governance review before re-enabling.

## Release and change control

A release affecting wellness data or advice requires:

- traceable requirements and approved change class;
- tests for expected, missing, extreme, stale, and contradictory inputs;
- scoring reproducibility and regression evidence;
- safety and accessibility review;
- privacy and security checks appropriate to the change;
- monitoring and rollback plan;
- user communication for material behavior or policy changes.

The product owner owns go/no-go. Security, privacy, and wellness safety owners each have stop-ship authority for their domain.

## Incident severity

| Severity | Example | Initial response target |
|---|---|---:|
| SEV-1 | Credible risk of widespread serious harm or sensitive-data exposure | 15 minutes |
| SEV-2 | Unsafe advice or unauthorized access with limited scope | 1 hour |
| SEV-3 | Incorrect score, deletion defect, or misleading copy without immediate danger | 1 business day |
| SEV-4 | Minor policy/process defect | 5 business days |

Targets are provisional until staffing and support hours are approved. Incident playbooks must define notification, evidence handling, regulatory assessment, and post-incident actions.

## Audit and transparency

- Publish an understandable privacy notice, scoring explanation, limitation statement, and change log.
- Record G2/G3 approvals and implementation evidence.
- Review privileged access at least quarterly.
- Review scoring performance, safety reports, and muted recommendations at an approved cadence.
- Report material incidents and corrective actions to the governing group.
- Do not publish small-cohort statistics that could expose individuals.

## Phase 1 governance approvals

Before Phase 2, humans must assign role owners, approve the product boundary, choose launch jurisdictions, set provisional retention, approve the urgent-risk posture, and decide whether external legal or clinical-safety review is required.

Related documents: [Governance Constitution](../governance/governance-constitution.md), [product requirements](product-requirements.md), [security design](security-design.md), and [architecture decisions](architecture-decisions.md).

## Document change log

| Version | Effective date | Classification | Change | Approved by |
|---|---|---|---|---|
| 1.0.0 | 2026-08-05 | Initial normative release | Initial ratified GOV-OPS-001 artifact. The owner and approver were recorded as Andrew Penfold. | Andrew Penfold (historical record; corrected identity: Andrew Penistone) |
| 1.0.1 | 2026-08-06 | Administrative | Corrected the current owner and approver surname to Andrew Penistone. No normative requirements changed. | Andrew Penistone |
