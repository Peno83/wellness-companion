# Source Provenance Standard

- **Document Identifier:** ARCH-PROV-001
- **Version:** 1.0.2
- **Owner:** Andrew Penistone
- **Approver:** Andrew Penistone
- **Effective Date:** 2026-08-06
- **Review Date:** 2026-11-05
- **Status:** active
- **Governance Approval:** Ratified
- **Supersedes:** 1.0.0
- **Authority:** Subordinate to the [Governance Constitution](../governance/governance-constitution.md)
- **Applies to:** Every manual, imported, device-originated, calculated, corrected, or migrated measurement

## Purpose

Provenance records where a measurement came from and every material transformation applied to it. A displayed value without provenance can mislead users, break reproducibility, and allow low-quality data to become trusted silently.

**No record may lose its origin.** Normalization, calculation, correction, migration, aggregation, AI processing, export, or deletion workflows must preserve or intentionally dispose of lineage under an approved rule. A value without the required provenance envelope is not eligible for analytics, scoring, AI Structured Facts, or user-facing claims.

## Required measurement envelope

Every measurement must contain the following fields. Names are conceptual; the physical schema is deferred.

| Required field | Meaning | Rule |
| --- | --- | --- |
| Source | Human-readable origin category or provider | Required; controlled vocabulary |
| Source Identifier | Stable identifier for the originating source/account context | Required; pseudonymous where possible; never a credential |
| Device | Device or capture surface that produced or entered the record | Required; `not_applicable` allowed only with reason |
| Original Timestamp | Timestamp exactly as supplied by the source | Required; never overwritten |
| Normalized Timestamp | Canonical UTC timestamp produced by normalization | Required when accepted for processing |
| Timezone | Source timezone name or offset and derivation status | Required; `unknown` is explicit, never assumed silently |
| Raw Value | Original value exactly as received | Required; protected as sensitive data |
| Normalized Value | Canonical typed value used downstream | Required when accepted; derivation must be reproducible |
| Measurement Unit | Original and canonical unit | Required for unit-bearing metrics; `unitless` explicit otherwise |
| Measurement Classification | Provenance/derivation class | Required; values defined by the quality framework |
| Import Method | Manual entry, file, sync, webhook, migration, calculation, or other approved method | Required; controlled vocabulary |
| Confidence | Confidence in the measurement or derivation, distinct from wellness interpretation | Required; value plus scale/version |
| Quality | Current quality classification and reason codes | Required; may change through new quality-assessment events |
| Calculation Version | Version of normalization/calculation logic | Required for transformed or calculated values; `not_applicable` otherwise |
| Governance Version | Constitution/policy version authorizing capture and processing | Always required |
| AI Version (if applicable) | Model, prompt, AI policy, and output schema version references | Required when AI materially processed the record; otherwise absent, not fabricated |
| Original Record Reference | Immutable reference to the source record/event or supplied provider record ID | Always required; internal surrogate permitted when source supplies no ID |

The envelope also carries the subject owner, metric definition version, event identifier, received time, consent/purpose reference, schema version, correction/supersession reference, and integrity metadata.

## Controlled provenance values

### Source

Initial categories are `user`, `device`, `provider`, `internal_calculation`, `migration`, and `unknown`. A provider name is metadata beneath `provider`; it does not replace the category.

### Import Method

Allowed initial values are:

- `manual_entry`
- `approved_file_import`
- `approved_provider_pull`
- `approved_provider_push`
- `device_on_device`
- `internal_calculation`
- `approved_migration`
- `unknown`

Only `manual_entry` and internal design-time examples are in the current approved product scope. Other values reserve a contract; they do not authorize an integration.

### Measurement Classification

Classification uses one or more controlled labels from the [Data Quality Framework](data-quality-framework.md): `Verified`, `Imported`, `Manual`, `Device Measured`, `Device Estimated`, `Calculated`, `Duplicate`, `Incomplete`, `Missing`, `Unknown`, or `Rejected`.

## Provenance lifecycle

```text
Source record/event
      │ capture exact origin
      ▼
Immutable raw event + provenance envelope
      │ validate identity, time, unit, value, consent
      ▼
Normalization event
      │ preserve raw; add normalized fields + versions
      ▼
Quality assessment event
      │ classification, confidence, reasons
      ▼
Calculation input references
      │ exact event/version IDs only
      ▼
Governance Engine
      │ purpose-specific allowlist + obligations
      ▼
Structured Facts / explanations / export
```

No stage replaces earlier fields. Each stage adds a new immutable event or derived record that references exact predecessors.

## Timestamp rules

- Store the original timestamp string and any source precision.
- Store the source timezone when supplied, including IANA zone where known and original offset.
- Normalize to UTC only after validating timezone and daylight-saving ambiguity.
- If timezone is absent, mark it `unknown`; do not infer it from a current profile without recording that derivation and its uncertainty.
- Preserve separate `observed`, `received`, `imported`, and `calculated` times.
- A corrected timezone creates a superseding event and recalculation; it never rewrites the original record.

## Value and unit rules

- Raw value is immutable and uses the source representation.
- Normalized value uses the versioned metric definition and calculation.
- Original and canonical units are both retained.
- Unit conversion records input, output, conversion rule/version, rounding policy, and precision loss.
- An unrecognized unit is `Unknown` or `Rejected`; it cannot be guessed.
- Display formatting is not a data transformation and does not replace stored precision.

## Confidence and quality

Confidence describes support for the measurement or transformation, not the user’s health. It must name the scale, method version, and reasons. Quality is categorical and may contain multiple reason codes such as `timestamp_ambiguous`, `unit_unrecognized`, `source_unverified`, or `possible_duplicate`.

Quality reassessment creates a new event. Downstream calculations reference the quality decision effective when they ran. Historical meaning remains reproducible.

## Calculated and AI-derived records

- Calculated measurements reference every exact input event and the calculation version.
- Aggregates reference a versioned input manifest or deterministic snapshot digest.
- AI must not be used to establish measurement provenance.
- If AI transforms or classifies a measurement in a future approved design, the record must include model/provider identifier, model version, prompt-template version, AI-policy version, structured input schema, output schema, validator version, and governance version.
- AI-created values remain `Calculated` and cannot be relabeled `Verified` or `Device Measured`.

## Correction, duplicate, and deletion behavior

- Corrections create a new event linked with `supersedes`; consumers use the effective event without losing history.
- Duplicate detection marks candidates and the decision rule. It does not delete silently.
- Rejected records retain minimal evidence needed to explain rejection under an approved short retention rule; raw sensitive payloads must not be retained by default.
- A user deletion request removes or cryptographically destroys personal event payloads and derived records. Any retained audit evidence must be non-identifying, purpose-limited, and documented.
- Delayed events cannot recreate deleted personal data; deletion markers and rights-state checks block rehydration.

## Exports and user transparency

Exports must include a provenance dictionary and, for each measurement, its original/normalized values, units, timestamps, classification, quality, confidence, source, import method, calculation/governance versions, and source reference. Credentials, internal abuse signals, and other users’ information are excluded.

## Validation and release gates

- Schema tests prove all required envelope fields are present or explicitly not applicable.
- Golden tests cover units, timestamp ambiguity, corrections, duplicate candidates, missing fields, and migrations.
- Lineage tests reproduce each calculated value from exact source versions.
- Deletion tests prove lineage cannot rehydrate erased personal data.
- AI isolation tests prove Structured Facts never contain raw source payloads unless an approved schema explicitly permits a minimized field.
- A release fails if any accepted measurement can bypass provenance validation.

## Open questions

- Approved confidence scale and calibration method for each source class.
- Exact short retention for rejected raw payloads.
- Whether device identity should be stored as model-level metadata or a pseudonymous per-device identifier.
- Integrity mechanism for source manifests and exports.

Related: [Data Quality Framework](data-quality-framework.md), [Versioning Framework](versioning-framework.md), and [Event Sourcing Standard](event-sourcing.md).

## Document change log

| Version | Effective date | Classification | Change | Approved by |
| --- | --- | --- | --- | --- |
| 1.0.0 | 2026-08-05 | Initial normative release | Initial ratified ARCH-PROV-001 artifact. The owner and approver were recorded as Andrew Penfold. | Andrew Penfold (historical record; corrected identity: Andrew Penistone) |
| 1.0.1 | 2026-08-06 | Administrative | Corrected the current owner and approver surname to Andrew Penistone. No normative requirements changed. | Andrew Penistone |
| 1.0.2 | 2026-08-06 | Administrative | Reconciled lifecycle status with ARCH-VER-001 and recorded ratification separately. No normative requirements changed. | Andrew Penistone |
