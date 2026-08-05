# Data Quality Framework

**Authority:** Subordinate to the [Governance Constitution](../governance/governance-constitution.md)  
**Status:** Draft for Phase 1.1 review  
**Rule:** No incoming measurement may enter analytics, scoring, governance facts, or AI input without a recorded quality decision.

## Purpose

This framework prevents incomplete, duplicate, misclassified, implausible, or originless data from gaining authority through later processing. Quality describes the record and its provenance. It does not judge the user or diagnose health.

## Classification model

Classifications are composable labels, not a single trust ladder. For example, one record can be `Imported`, `Device Estimated`, and `Incomplete`. A terminal disposition then states whether the record is accepted, quarantined, or rejected.

| Classification | Definition | Processing effect |
|---|---|---|
| Verified | Origin and required fields were verified through an approved method; not a claim of medical accuracy | Eligible subject to all other checks |
| Imported | Arrived through an approved import path | Requires provider/import provenance and contract validation |
| Manual | Entered or confirmed by the user | Eligible with manual-source confidence; never relabeled device-measured |
| Device Measured | Device reports a directly sensed measurement | Eligible only under an approved device/source contract |
| Device Estimated | Device reports a modeled or inferred value | Must remain distinguishable from measured data; confidence and method required |
| Calculated | Produced from one or more other records | Requires exact input lineage and calculation version |
| Duplicate | Matches or conflicts with an existing record under a versioned duplicate rule | Quarantine or deterministic winner selection; never double-count |
| Incomplete | One or more required fields for intended use are absent or unusable | Exclude from uses requiring those fields; may be retained for correction |
| Missing | Expected measurement does not exist or user explicitly declined/not applicable | No fabricated value; downstream coverage decreases |
| Unknown | Source, unit, timestamp, classification, or meaning cannot be established | Quarantine or reject; never silently infer |
| Rejected | Failed an approved validation or governance rule | Excluded from all calculations and AI facts |

`Verified` does not override `Device Estimated`, constitutional restrictions, expired consent, or a rejection. Verification must name what was verified: source identity, transport integrity, user confirmation, or contract conformance.

## Incoming measurement validation pipeline

```text
Incoming measurement
        │
        ▼
1. Governance + consent eligibility
        │ deny → Rejected
        ▼
2. Envelope and schema validation
        │ fail → Incomplete / Rejected
        ▼
3. Source + integrity validation
        │ unknown → Unknown / quarantine
        ▼
4. Timestamp + timezone validation
        │ ambiguous → Incomplete / quarantine
        ▼
5. Type + unit + range validation
        │ unsafe/unparseable → Rejected
        ▼
6. Duplicate + conflict detection
        │ candidate → Duplicate / resolution
        ▼
7. Normalization + calculation lineage
        │ fail → Rejected
        ▼
8. Confidence + quality assignment
        │
        ▼
Accepted immutable event or quarantined/rejected event
```

## Mandatory validation rules

Every incoming measurement must be evaluated against every applicable rule below.

### Governance and purpose

- The data category and intended processing purpose are approved by the effective governance version.
- Required consent or other approved legal basis is active at receipt and processing time.
- Source and import method are enabled by governance and feature flags.
- The data does not cross a prohibited product boundary.
- A governance failure is terminal `Rejected`; flags cannot override it.

### Provenance envelope

- Every required field in the [Source Provenance Standard](source-provenance-standard.md) is present, explicitly unknown, or explicitly not applicable where permitted.
- Source Identifier and Original Record Reference are stable and contain no credential.
- Measurement classification is allowed for the source/import contract.
- Governance, schema, and calculation versions are compatible.

### Schema and type

- Metric code exists in an effective, versioned metric definition.
- Value type matches the definition: numeric, ordinal, boolean, duration, timestamp, or constrained text.
- Unknown fields cannot assign privileged meaning.
- Required fields are present; missing and zero remain distinct.
- Text encoding and maximum length are valid; executable or rich content is not accepted as plain measurement data.

### Time and timezone

- Original timestamp is preserved exactly.
- Normalized timestamp is valid UTC and derivable from recorded timezone information.
- Timestamp precision is recorded.
- Future and implausibly old timestamps are handled by metric-specific rules.
- Daylight-saving gaps or overlaps are explicit, never silently resolved.
- Observed time cannot be replaced by import or calculation time.

### Units and numerical validity

- Unit is allowed for the metric definition.
- Conversion uses an approved calculation version and preserves original value/unit.
- Value lies within physical/input-validity bounds; “unusual” is not automatically invalid.
- Decimal precision, rounding, and overflow rules are deterministic.
- Sentinel values such as `-1`, empty string, or `9999` never stand in for missing data.
- Non-finite values are rejected.

### Source integrity

- Import transport and record integrity meet the approved source contract.
- Device/provider identity is known at the approved granularity.
- Manual edits are attributed to the user and do not impersonate a device.
- Calculated records identify exact input events and method version.
- AI output cannot become source verification or silently create a measurement.

### Duplicate and conflict detection

- Exact duplicates use source, source identifier, original record reference, metric, and time.
- Near duplicates use a versioned metric-specific time/value tolerance.
- Duplicate rules are deterministic and explain which record is effective.
- Conflicting non-duplicate measurements remain separate with source provenance; precedence requires an approved rule.
- A duplicate classification is reversible through a new decision event, not an edit.

### Completeness and missingness

- Required-for-storage and required-for-use fields are defined separately.
- Missing reasons are explicit: `not_provided`, `declined`, `not_applicable`, `source_unavailable`, or `unknown`.
- Incomplete records cannot participate in calculations that need the absent field.
- Downstream modules report missing and excluded data under the [Explainability Standard](explainability-standard.md).
- No default value, interpolation, or imputation is allowed without a versioned, approved method and clear disclosure.

### Confidence and quality outcome

- Confidence has a documented scale, calculation, and version.
- Quality labels and reason codes are stored with the quality-assessment event.
- Terminal disposition is `accepted`, `quarantined`, or `rejected`.
- Accepted use is scoped, such as `history_only`, `trend_eligible`, or `score_eligible`.
- Manual override requires authorized reason, audit event, and new quality decision; it cannot alter raw data.

## Quarantine and rejection

Quarantined records are unavailable to analytics, scoring, AI, recommendations, and user claims until resolved. Users may be invited to correct safe, understandable issues. Operators must not inspect sensitive payloads without approved, audited access.

Rejected records retain only the minimum evidence needed to explain the outcome and prevent repeated unsafe processing. Raw rejected payload retention must be short and approved. Reprocessing creates a new event tied to a new rule or corrected input.

## Quality propagation

- A calculated result cannot have stronger provenance than its weakest material input unless the method explicitly and validly resolves that limitation.
- Duplicate or rejected inputs contribute nothing.
- Incomplete or unknown inputs reduce coverage and confidence or suppress the result.
- Device-estimated values remain labeled in Structured Facts and explanations.
- Aggregates contain counts by classification and a manifest/digest of included and excluded events.

## Monitoring without sensitive content

Track counts and rates by source contract, metric code, classification, disposition, and reason code. Do not send raw values, notes, direct identifiers, or small-cohort slices to general monitoring. Alerts cover rejection spikes, timezone failures, duplicate surges, missing-version errors, and quality-rule drift.

## Governance and release controls

- Quality rules are immutable, versioned policy artifacts.
- A rule change requires impact analysis, replay/shadow evaluation, approval, user-effect review, and rollback criteria.
- Historical calculations keep the quality decision and version they used.
- Major modules cannot disable validation through a feature flag.
- Release tests cover every classification and failure path.

## Open questions

- Confidence scales by measurement class.
- Metric-specific physical and plausible input bounds.
- Duplicate tolerances and precedence rules.
- Quarantine and rejected-payload retention periods.
- User correction flows for ambiguous timezones and units.

Related: [Source Provenance Standard](source-provenance-standard.md), [Versioning Framework](versioning-framework.md), and [Explainability Standard](explainability-standard.md).
