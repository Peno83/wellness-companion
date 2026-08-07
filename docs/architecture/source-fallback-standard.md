# Source Fallback Standard

- **Document Identifier:** ARCH-FALL-001
- **Version:** 0.1.0
- **Owner:** Data Steward (unassigned)
- **Approver:** Not applicable while draft
- **Effective Date:** Not applicable while draft
- **Review Date:** Before enabling source fallback
- **Status:** draft
- **Governance Approval:** Pending human review

## Purpose

Fallback preserves continuity without silently mixing sources. It applies per metric and required period.

## Rules

- A user may configure one preferred source and one or more ordered fallbacks.
- A fallback activates only when every required primary record for the period is absent or invalid under the policy.
- Revoked, rejected, unsupported, stale, duplicate-only, or incompatible sources are ineligible.
- The engine evaluates fallbacks in recorded order and stops at the first eligible source.
- Every fallback-selected value is labelled in storage, explanations, exports, and user views.
- The system never fills individual gaps from multiple sources unless the metric policy explicitly permits mixed-source composition and emits a warning.
- Changing fallback order requires explicit confirmation and an auditable event.

## Example

For an Oura primary, WHOOP first fallback, and Apple Watch second fallback, WHOOP is considered only when Oura has no valid record for the required period. Apple Watch is considered only when both earlier sources lack a valid record. Transport repositories do not become origins.

## Audit record

Record metric, required period, selection mode, primary source, ordered candidates, candidate eligibility, activated fallback, activation reason, policy version, source decision ID, timestamp, and resulting methodology-break state.

## Related standards

- [Metric Source Selection Engine](metric-source-selection-engine.md)
- [Methodology Break Standard](methodology-break-standard.md)
- [Source Reconciliation Standard](source-reconciliation-standard.md)
