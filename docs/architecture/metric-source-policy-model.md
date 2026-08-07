# Metric Source Policy Model

- **Document Identifier:** ARCH-MSP-001
- **Version:** 0.1.0
- **Owner:** Data Steward (unassigned)
- **Approver:** Not applicable while draft
- **Effective Date:** Not applicable while draft
- **Review Date:** Before approving a metric source policy
- **Status:** draft
- **Governance Approval:** Pending human review

## Policy contract

Each versioned policy defines metric identity, compatible classifications and units, eligibility exclusions, comparison window, minimum coverage, suitability factors, deterministic ordering and tie-breakers, fallback eligibility, aggregation prohibition or method, methodology-break triggers, explanation template, governance version, and effective period.

No policy may hard-code permanent vendor superiority. Policy language may say more complete, more recent, original source, directly measured, device estimated, fewer missing records, longer coverage, or selected for consistency.

## Minimum metric policies

Policies are required for recovery score, strain, sleep duration, sleep stages, sleep efficiency, resting heart rate, heart-rate variability, respiratory rate, SpO2, skin-temperature deviation, steps, workout distance, GPS route, calories, weight, body-fat estimate, lean-mass estimate, glucose, blood pressure, ECG, and VO2 max.

## Required constraints

- Proprietary scores remain attributed to their vendor and are not merged across vendors.
- Original ECG records and waveforms retain their exact origin.
- Direct cuff blood-pressure readings rank above wearable estimates for the same intended use, without claiming clinical superiority.
- Original smart-scale body composition outranks transported copies of that same record.
- GPS route prefers the recording device where that metric is supported.
- Imported duplicates cannot outrank their original source.
- Incompatible sleep-stage algorithms are not merged by default.
- Missing data is not zero and cannot win through default-value substitution.

## Ranking and tie-breaking

Policies use ordered factor comparisons or explicitly versioned numeric weights. Tie-breakers must be deterministic, clinically neutral, and stable. A policy change creates a new version and may require recalculation and a methodology break.

## Prohibited claims

Without approved legal and evidentiary review, outputs must not say medically superior, clinically accurate, diagnostic quality, proves a condition, or safe for medical decisions. Health concerns are referred to a qualified clinician.
