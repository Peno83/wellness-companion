# Initial data model

- **Document Identifier:** DATA-MOD-001
- **Version:** 0.1.0
- **Owner:** Data Steward (unassigned)
- **Approver:** Not applicable while draft
- **Effective Date:** Not applicable while draft
- **Review Date:** Before data-model implementation
- **Status:** draft
- **Governance Approval:** Pending human review
- **Purpose:** Define domain meaning and constraints before choosing physical schemas or writing migrations.

**Authority:** Subordinate to the [Governance Constitution](../governance/governance-constitution.md). Phase 1.1 adopts event sourcing: the entities below describe governed projections and immutable event payload contracts, not directly mutable records.

## Modeling principles

- Raw observations are distinct from normalized values and derived results.
- Missing, zero, “not applicable,” and “user declined” are different states.
- Time includes observed time, received time, local date, and timezone context.
- Every value has provenance, units where relevant, and an immutable version.
- Corrections supersede prior versions; they do not erase lineage.
- Consent and purpose are first-class data, not UI flags.
- Derived data carries the method and policy versions that created it.
- Deletion is modeled as an orchestrated lifecycle across every dependent store.

## Event and projection map

```text
Commands
   |
   v
Immutable domain events + provenance + versions
   |
   +--> Subject/Profile projection
   +--> Consent/Policy projection
   +--> CheckIn/Observation projection --> MetricDefinition
   +--> ScoreResult projection ---------> ScoringMethodVersion
   +--> Recommendation projection ------> ContentVersion
   +--> Feedback projection
   +--> RightsRequest/Task projection
   +--> Explanation projection
   |
   +--> separate minimized AuditEvent stream

Corrections append superseding events. Deletion erases personal payloads and
derived projections under policy while retaining only permitted non-identifying
governance evidence.
```

The binding event envelope is defined by the [Event Sourcing Standard](../architecture/event-sourcing.md). The binding measurement envelope is defined by the [Source Provenance Standard](../architecture/source-provenance-standard.md).

## Core entities

### Subject

Pseudonymous internal owner of all user data.

| Field | Meaning / constraint |
| --- | --- |
| `subject_id` | Random, non-guessable identifier; never reused |
| `status` | `active`, `suspended`, `deletion_pending`, `deleted` |
| `created_at` | Server timestamp in UTC |
| `deleted_at` | Nullable UTC timestamp; not proof that all deletion tasks finished |

Authentication identity is stored in a separate identity partition and maps to `subject_id`.

### Profile

Stores minimal preferences needed for product behavior.

| Field | Meaning / constraint |
| --- | --- |
| `subject_id` | Unique owner reference |
| `timezone` | IANA timezone identifier; required for local-day calculations |
| `locale` | Supported BCP 47 language/region tag |
| `units_preference` | Display preference; source units remain preserved |
| `recommendation_preferences` | Versioned categories muted or favored by the user |
| `version` | Optimistic concurrency counter |

Age/date of birth, sex, diagnoses, pregnancy, medication, and disability are excluded until a specific safe use case, purpose, and review exist.

### PolicyVersion

Immutable published version of a notice, consent purpose, safety policy, scoring disclosure, or terms document.

Fields: `policy_version_id`, `policy_type`, `version_label`, `content_digest`, `effective_at`, `retired_at`, `approval_record_id`.

### ConsentRecord

Append-only record of a subject’s grant or withdrawal for one purpose.

Fields: `consent_record_id`, `subject_id`, `purpose_code`, `state`, `policy_version_id`, `captured_at`, `effective_at`, `jurisdiction_context`, `capture_surface`, `supersedes_id`.

The effective consent state is the latest valid record for a purpose. Processing jobs must re-check state at execution time.

### CheckIn

Container for observations associated with one user-local day.

Fields: `check_in_id`, `subject_id`, `local_date`, `timezone_at_entry`, `status`, `created_at`, `submitted_at`, `version`.

A subject has at most one active check-in per local date. Corrections update the check-in version and append observation versions.

### MetricDefinition

Controlled vocabulary defining each observable metric.

Fields: `metric_code`, `display_name`, `value_type`, `canonical_unit`, `valid_range`, `directionality`, `sensitivity_class`, `active_from`, `active_to`.

Initial proposed metrics:

| Code | Type | Canonical representation | Proposed input range |
| --- | --- | --- | --- |
| `sleep_duration` | duration | minutes | 0–1,440 |
| `sleep_quality` | ordinal | integer | 1–5 |
| `energy` | ordinal | integer | 1–5 |
| `mood` | ordinal | integer | 1–5 |
| `stress` | ordinal | integer | 1–5; higher is more stress |
| `soreness` | ordinal | integer | 1–5; higher is more soreness |
| `activity_duration` | duration | minutes | 0–1,440 |
| `activity_intensity` | ordinal | integer | 1–5 |
| `note` | text | UTF-8 plain text | Optional; proposed maximum 2,000 characters |

Ranges are input-validity limits, not healthy targets. Final fields and ranges require product and safety approval.

### Observation projection and measurement event

Immutable version of one observed value.

| Field | Meaning / constraint |
| --- | --- |
| `observation_id` | Stable logical observation identifier |
| `observation_version_id` | Unique immutable version identifier |
| `subject_id` / `check_in_id` | Ownership and grouping |
| `metric_code` | Controlled metric definition |
| `value` | Typed value; absent only with explicit missingness reason |
| `original_unit` | Unit entered or supplied by source |
| `canonical_value` / `canonical_unit` | Normalized value; derivation version recorded |
| `missingness_reason` | `not_provided`, `not_applicable`, `declined`, or null |
| `observed_at` | When the measurement or perception applies |
| `received_at` | When the system received it |
| `source_type` | `manual` in initial scope; future types require approval |
| `source_reference` | Immutable original-record/event reference; no external secret/token |
| `supersedes_version_id` | Previous version when corrected |
| `recorded_by` | Subject or authorized system actor |

Every measurement event must also carry Source, Source Identifier, Device, Original Timestamp, Normalized Timestamp, Timezone, Raw Value, Normalized Value, Measurement Unit, Measurement Classification, Import Method, Confidence, Quality, Calculation Version, Governance Version, AI Version when applicable, and Original Record Reference. See the [Source Provenance Standard](../architecture/source-provenance-standard.md).

### ContextTag

Optional user annotation such as travel or unusual schedule. Fields: `context_tag_id`, `subject_id`, `local_date_start`, `local_date_end`, `tag_code` or user label, `created_at`, `deleted_at`. Tags are context, not diagnoses.

### ScoringMethodVersion

Immutable approved scoring specification.

Fields: `method_version_id`, `status`, `input_contract_digest`, `parameter_document`, `code_artifact_digest` when implemented, `approved_at`, `effective_at`, `retired_at`, `approval_record_id`.

### ScoreResult

Immutable derived result for a subject and time window.

Fields: `score_result_id`, `subject_id`, `period_start`, `period_end`, `domain_code`, `score_value` (nullable), `confidence_band`, `coverage_ratio`, `freshness_state`, `method_version_id`, `policy_version_id`, `computed_at`, `status`, `supersedes_result_id`.

An associated `ObservationVersionRef` set records every exact source event or governed manifest used. A null score with a reason is valid and preferable to fabrication. Every stored calculation carries all applicable versions required by the [Versioning Framework](../architecture/versioning-framework.md).

### RecommendationContentVersion

Reviewed suggestion template and safety metadata.

Fields: `content_version_id`, `category`, `title`, `body`, `evidence_record_id`, `eligibility_rule_version`, `contraindication_rule_version`, `approved_at`, `review_due_at`, `retired_at`.

### RecommendationResult

User-specific selection event. Fields: `recommendation_result_id`, `subject_id`, `content_version_id`, `score_result_refs`, `reason_facts`, `confidence_band`, `policy_version_id`, `generated_at`, `expires_at`, `state`, `suppression_reason`.

`reason_facts` contain controlled, user-displayable factor codes, not hidden free-text profiling.

### UserFeedback

Fields: `feedback_id`, `subject_id`, `target_type`, `target_id`, `feedback_code`, optional constrained comment, `created_at`. Examples: `useful`, `not_relevant`, `completed`, `mute_category`. Feedback does not automatically validate efficacy.

### RightsRequest and RightsTask

`RightsRequest` represents export, correction, consent withdrawal, or deletion. It contains requester verification state, scope, timestamps, and completion state. Each `RightsTask` represents one store or processor action with attempts, completion evidence, and error state.

Deletion is complete only when every required task is complete or a disclosed retention exception is recorded. A non-identifying tombstone may prevent deleted data from being recreated by a delayed job.

### DomainEvent and AuditEvent

`DomainEvent` is the immutable fact of a domain change. Its conceptual envelope includes event ID/type/schema, aggregate/subject reference and version, occurred/recorded time, actor, correlation/causation, governance/purpose/consent context, data-model/contract versions, provenance, feature-flag snapshot, classified payload, integrity metadata, and supersession references.

Append-only security/governance evidence: `audit_event_id`, `occurred_at`, `actor_type`, `actor_ref`, `action`, `target_type`, pseudonymous `target_ref`, `decision`, `reason_code`, `policy_version_id`, `request_trace_id`, `integrity_metadata`.

Audit events exclude observation values, notes, and recommendation bodies.

## Integrity constraints

- Ownership references are mandatory and cannot change after creation.
- Every derived record references exact input events and every applicable version from the Versioning Framework.
- Supersession chains are acyclic and remain within the same subject and logical entity.
- Canonical values cannot exist without the original value, unit, and normalization version.
- Active score results are unique by subject, domain, period, and method version.
- Expired or retired recommendation content cannot create new results.
- Jobs cannot process data when required consent is inactive.
- Hard deletion cascades through derived transactional records only via the rights workflow, never an ad hoc operator command.

## Retention proposal

Exact periods require privacy/legal approval. The system should support configurable schedules by category:

| Category | Proposed policy shape |
| --- | --- |
| Active account wellness data | Retain while account is active and purpose remains valid |
| Deleted account transactional data | Delete promptly through workflow; target to be approved |
| Encrypted backups | Age out on fixed rotation; prevent restore from reactivating tombstoned subjects |
| Export objects | Short expiry, proposed ≤7 days |
| Security audit | Fixed period based on risk/legal need; content-minimized |
| Product analytics | Short, aggregated/pseudonymous retention; no wellness content |
| Free-text notes | Same or shorter than observations; separately configurable |

## Export contract

The export should contain schema version, generation time, profile, consent history, check-ins, observations with units/provenance, score results with method versions, recommendation history, feedback, and a human-readable glossary. Authentication secrets, internal threat signals, other users’ data, and protected security logs are excluded.

## Physical design deferred

Event-store technology, table names, database types, indexes, partitions, projection persistence, migration syntax, and ORM choices belong to Phase 2 after this conceptual model is approved. See [architecture decisions](architecture-decisions.md), [event sourcing](../architecture/event-sourcing.md), and [scoring methodology](scoring-methodology.md).
