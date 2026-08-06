# Governance Registry

- **Document Identifier:** GOV-REG-001
- **Version:** 1.1.1
- **Owner:** Andrew Penistone
- **Approver:** Andrew Penistone
- **Effective Date:** 2026-08-06
- **Review Date:** 2026-11-05
- **Status:** active
- **Governance Approval:** Ratified
- **Supersedes:** 1.1.0

## Purpose

This registry is the authoritative human-readable record of constitutional authority, implementation authority, release authority, review obligations, and approval history for Wellness Companion. It does not grant any role permission to bypass the [Governance Constitution](governance-constitution.md).

## Current governance registration

| Field | Registered value |
| --- | --- |
| Constitution Version | 1.1.1 |
| Lifecycle Status | active |
| Governance Approval | Ratified |
| Effective Date | 2026-08-06 |
| Constitutional Authority | Andrew Penistone |
| Governance Owner | Andrew Penistone |
| Independent Technical Reviewer | Claude AI (Advisory) |
| Implementation Authority | OpenAI Codex |
| Release Authority | Andrew Penistone |
| Dispute Resolver | Andrew Penistone |
| Review Frequency | Quarterly and after every material governance, security, privacy, or architectural change |

## Authority boundaries

### Constitutional Authority

Andrew Penistone ratifies constitutional versions and approves constitutional change. This role cannot waive constitutional prohibitions outside the documented change process.

### Governance Owner

Andrew Penistone maintains the registry, schedules reviews, records decisions, and stops work that lacks governance evidence.

### Independent Technical Reviewer

Claude AI provides advisory technical review. Its findings are evidence for human consideration, not binding approval, legal advice, clinical review, or release authorization. The Constitutional or Release Authority remains accountable for accepting, remediating, or explicitly deferring findings.

### Implementation Authority

OpenAI Codex may implement only work explicitly authorized by the current phase and effective governance. It cannot ratify governance, approve its own work, broaden scope, release software, or override a denial.

### Release Authority

Andrew Penistone holds final release authority after all constitutional gates and required evidence are satisfied. Release authority cannot convert missing evidence into compliance.

### Dispute Resolver

Andrew Penistone resolves documented disputes after considering the constitution, reviewer evidence, risks, and affected owners. Resolution must be recorded and cannot silently amend an effective governance artifact.

## Review Frequency

The registry and constitution are reviewed:

- at least quarterly;
- before each major phase begins;
- after a material governance, privacy, security, data, AI, or architectural change;
- after a constitutional incident or substantiated bypass finding;
- before enabling any new external provider, health feature, AI feature, or personal-data processing path.

The next scheduled review is 2026-11-05. A review may confirm the current version without change, but the outcome and reviewers must be recorded.

## Approval History

| Date | Artifact/version | Decision | Authority | Technical review | Notes |
| --- | --- | --- | --- | --- | --- |
| 2026-08-05 | Governance Constitution 1.0.0 | Ratified and made effective | Andrew Penfold | Claude AI (Advisory) | Historical record retained. Identity corrected on 2026-08-06 to Andrew Penistone. |
| 2026-08-05 | Governance Registry 1.0.0 | Ratified and made effective | Andrew Penfold | Claude AI (Advisory) | Historical record retained. Identity corrected on 2026-08-06 to Andrew Penistone. |
| 2026-08-05 | Phase 1.2 repository prerequisites | Authorized | Andrew Penfold | Claude AI (Advisory) | Historical record retained. Identity corrected on 2026-08-06 to Andrew Penistone. |
| 2026-08-06 | Governance Constitution 1.1.0 | Ratified and made effective | Andrew Penistone | Claude AI (Advisory) | Normative Phase 1.3 references and administrative identity correction; see amendment record. |
| 2026-08-06 | AI Use Policy 1.0.0 | Ratified and made effective | Andrew Penistone | Claude AI (Advisory) | Governs internal AI use; does not authorize runtime AI. |
| 2026-08-06 | Review Findings Register 1.0.0 | Ratified and made effective | Andrew Penistone | Claude AI (Advisory) | Establishes findings disposition and traceability. |
| 2026-08-06 | Residual Risk Register 1.0.0 | Ratified and made effective | Andrew Penistone | Claude AI (Advisory) | Records time-bounded Phase 1.3 residual-risk acceptances. |
| 2026-08-06 | Governance Registry 1.1.0 | Ratified and made effective | Andrew Penistone | Claude AI (Advisory) | Registers Constitution 1.1.0 and preserves historical identity records. |
| 2026-08-06 | Phase 2A.0 repository enforcement | Authorized | Andrew Penistone | Claude AI (Advisory) | CI remediation, executable-workflow policy, secret detection, and metadata consistency only; no application implementation. |
| 2026-08-06 | Governance Constitution 1.1.1 | Ratified and made effective | Andrew Penistone | Claude AI (Advisory) | Separates active lifecycle status from ratification without changing constitutional obligations. |
| 2026-08-06 | Versioning Framework 1.2.0 | Ratified and made effective | Andrew Penistone | Claude AI (Advisory) | Adds the content-digest canonicalisation milestone and lifecycle/approval separation. |
| 2026-08-06 | Review Findings Register 1.2.0 | Ratified and made effective | Andrew Penistone | Claude AI (Advisory) | Corrects evidence and adds Phase 1.3 Medium/Low and Phase 1.4 findings. |
| 2026-08-06 | Governance Registry 1.1.1 | Ratified and made effective | Andrew Penistone | Claude AI (Advisory) | Registers Phase 2A.0 authority, current versions, and corrected lifecycle metadata. |

## Change Log

| Version | Date | Change | Approved by |
| --- | --- | --- | --- |
| 1.0.0 | 2026-08-05 | Initial ratified registry; records Constitution 1.0.0 and named governance, implementation, review, release, and dispute roles. Historical approver recorded as Andrew Penfold; corrected identity is Andrew Penistone. | Andrew Penfold (historical record; corrected identity: Andrew Penistone) |
| 1.1.0 | 2026-08-06 | Registers Constitution 1.1.0, Phase 1.3 governance artifacts, and the administrative identity correction while preserving original approval rows. | Andrew Penistone |
| 1.1.1 | 2026-08-06 | Registers Constitution 1.1.1, corrects the current effective date, and separates active lifecycle status from ratification. | Andrew Penistone |

## Change control

Changes to a registered role, authority boundary, status, review frequency, or constitutional version require:

1. a proposed registry change with rationale and effective date;
2. advisory technical review where the change affects architecture or enforcement;
3. approval by the Constitutional Authority;
4. a new immutable registry version and change-log entry;
5. updates to repository ownership and release controls where applicable.

Historical approval and change-log entries must not be rewritten or removed.

## Related documents

- [Governance Constitution](governance-constitution.md)
- [Operational Governance Specification](../phase-1/governance.md)
- [Phase 1.2 Repository Readiness](../phase-1/implementation-roadmap.md)
- [Constitution Amendment 1.1.0](amendments/constitution-1.1.0.md)
- [Phase 1 Independent Architecture Review](../reviews/2026-08-05-phase-1-independent-architecture-review.md)
- [Phase 1.2 Governance Gate Review](../reviews/2026-08-05-phase-1.2-gate-review.md)
- [Phase 1.3 Governance Gate Review](../reviews/2026-08-06-phase-1.3-gate-review.md)
- [Phase 1.4 Governance Gate Review](../reviews/2026-08-06-phase-1.4-gate-review.md)
