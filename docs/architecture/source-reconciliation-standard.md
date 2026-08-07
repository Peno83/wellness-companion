# Source Reconciliation Standard

- **Document Identifier:** ARCH-REC-001
- **Version:** 0.1.0
- **Owner:** Data Steward (unassigned)
- **Approver:** Not applicable while draft
- **Effective Date:** Not applicable while draft
- **Review Date:** Before processing overlapping source records
- **Status:** draft
- **Governance Approval:** Pending human review

## Purpose

This standard defines deterministic reconciliation when multiple sources describe the same metric or event. It preserves every original record while producing an explainable canonical choice.

## Invariants

- Preserve all original records and provenance.
- Never silently overwrite a source value.
- Detect duplicates using source record ID, measurement type, timestamp, and a versioned metric-specific tolerance.
- Select precedence per metric, never through universal device superiority.
- Permit explicit user source preferences and ordered fallbacks.
- Never average incompatible measurements or proprietary scores.
- Explain the source of every canonical value and surface unresolved conflicts.
- Recalculate canonical projections when policy or preference changes without rewriting source history.

## Reconciliation sequence

1. Validate source identity, consent, schema, timestamp, unit, and quality.
2. Preserve the accepted or rejected raw source record.
3. Normalise eligible records without changing original values.
4. Group exact and probable duplicates under a `Duplicate Group`.
5. Identify incompatible methods, units, time windows, or classifications.
6. Evaluate candidates using the effective metric source policy.
7. Apply the user's metric-specific selection mode and valid fallback order.
8. Emit a versioned canonical source decision and explanation manifest.
9. Emit a data conflict or mixed-source warning when no safe resolution exists.

## Duplicate handling

Exact source IDs from the same origin are idempotent re-deliveries. Transported copies retain their origin and cannot outrank that original merely because they arrived through Apple Health, Health Connect, or another repository. Probable duplicates require a versioned tolerance and remain separately available for inspection. Rejection or deduplication changes canonical eligibility, not source history.

## Conflict handling

Do not average incompatible sleep stages, blood-pressure methods, proprietary scores, device estimates, or measurements covering different periods. Compatible records may be aggregated only under an approved metric policy that defines units, windows, weighting, and explanation. Unresolved conflicts are user-visible and excluded where the calculation cannot safely choose.

## Recalculation

A precedence, connector, algorithm, or preference change appends events and rebuilds affected canonical projections. The system records the former decision, new decision, policy versions, affected period, methodology break, and whether downstream results were superseded.

## Related standards

- [Metric Source Selection Engine](metric-source-selection-engine.md)
- [Source Fallback Standard](source-fallback-standard.md)
- [Methodology Break Standard](methodology-break-standard.md)
- [Source Provenance Standard](source-provenance-standard.md)
