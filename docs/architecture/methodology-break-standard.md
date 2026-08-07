# Methodology Break Standard

- **Document Identifier:** ARCH-METH-001
- **Version:** 0.2.0
- **Owner:** Analytics Owner (unassigned)
- **Approver:** Not applicable while draft
- **Effective Date:** Not applicable while draft
- **Review Date:** Before displaying mixed-method trends
- **Status:** draft
- **Governance Approval:** Pending human review
- **Supersedes:** 0.1.0

## Purpose

A methodology break marks a point where values before and after a change may not be fully comparable. It prevents a visually continuous trend from implying methodological continuity.

## Triggers

Create an immutable methodology-break event when:

- preferred or canonical source changes;
- the source-selection algorithm or metric policy changes materially;
- a connector version materially changes meaning or transformation;
- direct measurement changes to or from an estimate;
- device-generated data changes to or from manual entry;
- mixed-source history begins or an approved composition method changes.

## Event contract

Record metric, effective timestamp or boundary, previous and new source decisions, origin and transport paths, classifications, policy and connector versions, trigger reason, affected historical period, recalculation state, comparability warning, governance version, and audit reference.

## Presentation

Trend views identify periods by source and display the break at its effective boundary. Mixed-source trends carry a warning and cannot be described as fully comparable. Reports and exports include the same boundary and source history.

## Phase 2A.1.1 foundation

The synthetic foundation preserves ordered source-methodology periods and
creates structured breaks containing previous and new source, previous and new
methodology, effective timestamp, reason, compatibility status, warning text,
and policy version. Direct-to-estimated, manual-to-device, and incompatible
methodology changes are classified as incompatible.

No production aggregation is implemented. The foundation aggregation guard
throws for an incompatible break unless an explicit policy object records
governance approval and permission for incompatible methodologies. This guard
does not itself authorize such a policy or any future aggregation feature.

## Recalculation

Recalculation creates new canonical decisions and supersedes derived results; it does not delete original records or prior decisions. A recalculation can move a break only when corrected evidence justifies it, with both versions retained.

## Related standards

- [Explainability Standard](explainability-standard.md)
- [Source Fallback Standard](source-fallback-standard.md)
- [Source Provenance Standard](source-provenance-standard.md)
