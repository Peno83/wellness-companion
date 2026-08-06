# Event Sourcing Standard

- **Document Identifier:** ARCH-EVENT-001
- **Version:** 1.0.2
- **Owner:** Andrew Penistone
- **Approver:** Andrew Penistone
- **Effective Date:** 2026-08-06
- **Review Date:** 2026-11-05
- **Status:** active
- **Governance Approval:** Ratified
- **Supersedes:** 1.0.0
- **Authority:** Subordinate to the [Governance Constitution](../governance/governance-constitution.md)
- **Decision:** Every domain change becomes an immutable event. Current state is a governed projection of authorized events.

## Purpose

Event sourcing preserves what changed, when, why, under which governance and calculation versions, and from which source. It supports provenance, correction, audit, reproducibility, and reliable downstream processing.

Immutability applies to event history while the data is lawfully retained. It does not override consent withdrawal, erasure rights, retention limits, or the Governance Constitution.

## Architectural model

```text
Command
  │ authorization + consent + governance + validation
  ▼
Immutable domain event
  ├──────────────▶ Provenance / audit references
  │
  ▼
Event stream
  │ ordered by subject/aggregate
  ├──────────────▶ Normalized projection
  ├──────────────▶ Analytics projection
  ├──────────────▶ Rights/deletion projection
  └──────────────▶ User-readable history
                         │
                         ▼
                Governance Engine before use
```

The event store is raw data. AI, including Claude, must never query it. Only governed Structured Facts may cross the AI boundary.

## Event envelope

Every domain event contains:

- globally unique event ID;
- event type and schema version;
- subject/aggregate pseudonymous ID and aggregate version;
- occurred time and recorded time;
- actor type and permitted actor reference;
- command/request correlation and causation IDs;
- governance version and purpose/consent reference;
- data-model version and applicable contract version;
- source-provenance reference;
- feature-flag snapshot/version when relevant;
- payload classification and encrypted/minimized payload;
- integrity metadata;
- superseded/corrected event references when relevant.

Calculated events also include the complete [version manifest](versioning-framework.md#calculation-version-manifest) and exact input event references.

## Event naming and examples

Use past-tense facts, not commands. Examples include:

- `Weight Recorded`
- `Recovery Imported`
- `Glucose Added`
- `WHOOP Sync Completed`
- `User Deleted Data`
- `Governance Rule Updated`
- `Measurement Rejected`
- `Measurement Classified Duplicate`
- `Observation Corrected`
- `Score Calculated`
- `Trend Calculated`
- `Structured Facts Approved`
- `AI Output Rejected`
- `Feature Flag Changed`
- `Consent Withdrawn`

These names define a future vocabulary only. They do not authorize WHOOP, glucose, AI, databases, or any integration in Phase 1.1.

`WHOOP Sync Completed` is operational metadata and must not contain a credential or full wellness payload. Imported measurements remain separate provenance-bearing events.

## Command-to-event rules

1. Authenticate and authorize the actor when an implementation exists.
2. Evaluate purpose, consent, governance, feature flag, and version compatibility.
3. Validate schema, source provenance, data quality, and aggregate invariants.
4. Reject invalid commands without creating a successful domain event; create minimized security/audit evidence as required.
5. Append the event using expected aggregate version to prevent conflicting writes.
6. Publish or project only after durable append.
7. Treat retries as idempotent using a command key, meaning the same request cannot create duplicate effects.

## Ordering and consistency

- Ordering is guaranteed within an aggregate/subject stream, not globally.
- Each event carries the expected and resulting aggregate version.
- Concurrent conflicts are rejected or resolved by an explicit domain rule.
- Projections are eventually consistent and expose processing state and last-applied event position.
- Consumers are idempotent and record processed event IDs.
- Failed events go to a restricted retry/dead-letter process with reason and operator controls; raw content does not enter general alerts.

## Corrections and reversals

- Never edit or delete an earlier event merely to correct ordinary data.
- Append a correction event referencing the exact event being superseded.
- Reversal events state the domain effect; they do not pretend the original never occurred.
- Projections calculate effective current state from the chain.
- Recalculations create new events with new method/version manifests.
- User history and exports identify corrections in understandable terms.

## Privacy, retention, and deletion

Event sourcing must not become permanent surveillance.

- Split event envelope from encrypted personal payload where practical.
- Use per-subject or scoped encryption keys where the approved threat model supports cryptographic erasure.
- On verified deletion, stop new processing, remove projections/caches/exports, delete or cryptographically destroy personal payloads, and append/retain only the minimum non-identifying `User Deleted Data` governance evidence permitted by policy.
- A deletion marker blocks delayed imports, retries, or projection rebuilds from recreating the subject.
- Backup payloads expire under the approved schedule and deletion markers are reapplied on restoration.
- Retained event metadata must not enable re-identification or reconstruct wellness history.
- Legal retention exceptions require a documented purpose, access restriction, expiry, and user disclosure where required.

Whether payload deletion, per-subject cryptographic erasure, or stream removal is used is a Phase 2 physical-design decision. Compliance outcome, not storage ideology, controls the choice.

## Governance events

`Governance Rule Updated` never activates a rule by itself. The event references an approved immutable governance artifact, named approvers, digest, effective time, compatibility assessment, and superseded version. Runtime activation occurs only through the protected governance release process.

Governance events use a separate privileged stream and cannot be authored by ordinary product roles or AI.

## Projections

Every projection declares:

- purpose and authorized consumers;
- input event types and minimum versions;
- projection/calculation version;
- governing version and quality rules;
- rebuild/checkpoint process;
- retention and deletion behavior;
- validation and reconciliation rules;
- exposure classification.

Projections are disposable derived state except where a specific legal/audit obligation says otherwise. Rebuilds use authorized, non-deleted events and record the version used.

## AI boundary

The AI input is never an event stream, raw projection, unrestricted query, or database record. The Analytics Engine selects versioned aggregates; the Governance Engine removes disallowed fields and emits a minimal Structured Facts schema. AI receives only that package. Output validation and audit follow before user display.

## Audit distinction

Domain events record business facts. Security/governance audit events record access and control decisions. They may reference each other but have separate access, retention, and payload rules. Neither log may copy raw data merely for convenience.

## Verification and operations

- Schema compatibility tests for every event version.
- Given/when/then aggregate tests for commands and emitted events.
- Projection determinism and replay tests.
- Duplicate delivery and out-of-order handling tests.
- Concurrency and expected-version tests.
- Correction, withdrawal, deletion, backup restore, and rehydration-block tests.
- Provenance and calculation lineage reconciliation.
- Governance checks proving no consumer processes an unauthorized event.
- Operational limits for stream size, replay time, lag, and poison events.

## Trade-offs

Event sourcing improves lineage and reproducibility but increases schema evolution, projection, deletion, and operational complexity. The team must not interpret “every change is an event” as “store every request or raw payload forever.” Events should capture meaningful domain changes under minimization and retention rules.

## Open questions

- Event storage technology and transaction boundary.
- Aggregate definitions and partition keys.
- Payload/envelope separation and cryptographic-erasure design.
- Retention by event class and backup behavior.
- Replay authorization when governance versions have changed.
- Operational handling for large streams and projection rebuilds.

Related: [Source Provenance Standard](source-provenance-standard.md), [Data Quality Framework](data-quality-framework.md), and [Privacy by Design Standard](../security/privacy-by-design.md).

## Document change log

| Version | Effective date | Classification | Change | Approved by |
| --- | --- | --- | --- | --- |
| 1.0.0 | 2026-08-05 | Initial normative release | Initial ratified ARCH-EVENT-001 artifact. The owner and approver were recorded as Andrew Penfold. | Andrew Penfold (historical record; corrected identity: Andrew Penistone) |
| 1.0.1 | 2026-08-06 | Administrative | Corrected the current owner and approver surname to Andrew Penistone. No normative requirements changed. | Andrew Penistone |
| 1.0.2 | 2026-08-06 | Administrative | Reconciled lifecycle status with ARCH-VER-001 and recorded ratification separately. No normative requirements changed. | Andrew Penistone |
