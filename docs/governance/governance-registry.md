# Governance Registry

- **Document Identifier:** GOV-REG-001
- **Version:** 1.0.0
- **Owner:** Andrew Penfold
- **Approver:** Andrew Penfold
- **Effective Date:** 2026-08-05
- **Review Date:** 2026-11-05
- **Status:** Ratified

## Purpose

This registry is the authoritative human-readable record of constitutional authority, implementation authority, release authority, review obligations, and approval history for Wellness Companion. It does not grant any role permission to bypass the [Governance Constitution](governance-constitution.md).

## Current governance registration

| Field | Registered value |
|---|---|
| Constitution Version | 1.0.0 |
| Status | Ratified |
| Effective Date | 2026-08-05 |
| Constitutional Authority | Andrew Penfold |
| Governance Owner | Andrew Penfold |
| Independent Technical Reviewer | Claude AI (Advisory) |
| Implementation Authority | OpenAI Codex |
| Release Authority | Andrew Penfold |
| Dispute Resolver | Andrew Penfold |
| Review Frequency | Quarterly and after every material governance, security, privacy, or architectural change |

## Authority boundaries

### Constitutional Authority

Andrew Penfold ratifies constitutional versions and approves constitutional change. This role cannot waive constitutional prohibitions outside the documented change process.

### Governance Owner

Andrew Penfold maintains the registry, schedules reviews, records decisions, and stops work that lacks governance evidence.

### Independent Technical Reviewer

Claude AI provides advisory technical review. Its findings are evidence for human consideration, not binding approval, legal advice, clinical review, or release authorization. The Constitutional or Release Authority remains accountable for accepting, remediating, or explicitly deferring findings.

### Implementation Authority

OpenAI Codex may implement only work explicitly authorized by the current phase and effective governance. It cannot ratify governance, approve its own work, broaden scope, release software, or override a denial.

### Release Authority

Andrew Penfold holds final release authority after all constitutional gates and required evidence are satisfied. Release authority cannot convert missing evidence into compliance.

### Dispute Resolver

Andrew Penfold resolves documented disputes after considering the constitution, reviewer evidence, risks, and affected owners. Resolution must be recorded and cannot silently amend an effective governance artifact.

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
|---|---|---|---|---|---|
| 2026-08-05 | Governance Constitution 1.0.0 | Ratified and made effective | Andrew Penfold | Claude AI (Advisory) | Establishes the highest governing authority before application development |
| 2026-08-05 | Governance Registry 1.0.0 | Ratified and made effective | Andrew Penfold | Claude AI (Advisory) | Registers accountable roles, authority limits, and review cadence |
| 2026-08-05 | Phase 1.2 repository prerequisites | Authorized | Andrew Penfold | Claude AI (Advisory) | Documentation and repository controls only; no application development |

## Change Log

| Version | Date | Change | Approved by |
|---|---|---|---|
| 1.0.0 | 2026-08-05 | Initial ratified registry; records Constitution 1.0.0 and named governance, implementation, review, release, and dispute roles | Andrew Penfold |

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
