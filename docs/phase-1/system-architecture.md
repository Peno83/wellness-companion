# System Architecture

- **Document Identifier:** ARCH-SYS-001
- **Version:** 1.0.1
- **Owner:** Andrew Penistone
- **Approver:** Andrew Penistone
- **Effective Date:** 2026-08-06
- **Review Date:** 2026-11-05
- **Status:** Ratified
- **Supersedes:** 1.0.0
- **Scope:** Logical target architecture, not an implementation
- **Highest authority:** [Governance Constitution](../governance/governance-constitution.md)
- **External integrations:** Explicitly excluded from Phase 1.1

## Architectural authority

Governance is the highest architectural authority. Every component, data flow, event, calculation, feature flag, AI interaction, and output must comply with the effective constitution and policy bundle. No application path may write a trusted result or reach a user by routing around the Governance Engine.

When governance is missing, unavailable, expired, revoked, incompatible, or unable to decide, affected processing fails closed. A less restricted downstream component cannot overturn a governance denial.

## Goals

- Make constitutional governance structurally mandatory and independently auditable.
- Preserve origin through raw, normalized, calculated, explained, and exported data.
- Represent every domain change as an immutable event while honoring deletion and retention.
- Separate normalization, analytics, policy evaluation, AI phrasing, and output validation.
- Make every result reproducible from exact inputs and independent version references.
- Support controlled module rollout through flags that cannot weaken core controls.
- Keep sensitive wellness content within small, explicit trust boundaries.
- Preserve correction, export, withdrawal, deletion, and audit from the first implementation.

## System context

```text
+----------------+       +----------------------------------------------+
| Adult user     | ----> | Wellness Companion                          |
| controls data  | <---- | non-diagnostic reflection and explanations  |
+----------------+       +----------------------------------------------+
                                  |
                                  | constitutional control and evidence
                                  v
                       +----------------------------+
                       | Governance authority       |
                       | policy, approval, stop-ship|
                       +----------------------------+
                                  |
                                  v
                       +----------------------------+
                       | Approved operations        |
                       | privacy/security/support   |
                       +----------------------------+

No WHOOP, Claude, Apple Health, Health Connect, database, authentication
provider, external API, or frontend implementation is connected in Phase 1.1.
```

## Mandatory governed processing pipeline

The architectural sequence is fixed:

```text
Raw Data
    |
    v
Normalization Engine
    |
    v
Analytics Engine
    |
    v
Governance Engine
    |
    v
Structured Facts
    |
    v
Claude (future, optional, isolated)
    |
    v
Output Validator
    |
    v
User
```

### Why this separation exists

| Boundary | Protection |
|---|---|
| Raw Data to Normalization Engine | Preserves exact source values while producing canonical timestamps, units, and types |
| Normalization to Analytics Engine | Prevents analytics from guessing units, provenance, missingness, or quality |
| Analytics to Governance Engine | Lets calculations occur under versioned methods but prevents unapproved results from becoming facts or advice |
| Governance Engine to Structured Facts | Minimizes and allowlists facts, removes prohibited fields, binds explanations and versions, and records the policy decision |
| Structured Facts to Claude | Prevents AI from accessing raw tables, event streams, identities, unrestricted history, or secrets |
| Claude to Output Validator | Treats model output as untrusted and blocks fabricated, diagnostic, causal, schema-invalid, or policy-incompatible language |
| Output Validator to User | Ensures only an approved, explainable, versioned result reaches the user |

Claude must **never** access raw database tables directly. It must also never access raw events, unrestricted projections, database credentials, query tools, or alternate retrieval paths. Naming Claude documents only a possible future boundary and does not approve or connect it.

AI is optional. When it is disabled, unavailable, or invalid, Structured Facts may be rendered through an approved deterministic template. The Governance Engine and Output Validator remain mandatory in either path.

## Authority and non-bypass controls

```text
Governance Constitution
          |
          v
Signed, versioned policy bundle
          |
          +-------------------+-------------------+------------------+
          v                   v                   v                  v
Command admission      Event consumers      Feature flags      Output Validator
          |                   |                   |                  |
          +-------------------+---------+---------+------------------+
                                        |
                             deny / permit + obligations
                                        |
                                        v
                              Immutable audit evidence
```

Enforcement occurs at design review, release admission, command handling, event consumption, calculation, Structured Facts creation, AI invocation, output validation, and audit reconciliation. A control failure at one layer must not create an alternate path at another.

## Logical components

| Component | Responsibility | Prohibited behavior |
|---|---|---|
| Governance registry | Store immutable approved constitution/policy artifacts, versions, digests, compatibility, and status | Accept self-approved or mutable policy |
| Governance Engine | Evaluate purpose, consent, jurisdiction, quality, versions, feature eligibility, safety rules, and output obligations | Be bypassed, default-allow, or accept AI decisions as policy |
| Command gateway | Validate commands and attach actor, purpose, consent, governance, and idempotency context | Write directly to projections or skip governance |
| Raw event boundary | Append minimized immutable source/domain events with provenance | Expose raw streams to AI or general analytics/logging |
| Normalization Engine | Validate and normalize units, timestamps, types, and source envelopes | Overwrite raw values or invent unknown provenance |
| Data Quality Engine | Classify, accept, quarantine, or reject measurements | Promote unknown/rejected data silently |
| Analytics Engine | Produce versioned scores, aggregates, trends, correlations, confidence, and explanation manifests | Diagnose, claim causation, or publish directly |
| Structured Facts builder | Emit the minimum governed, typed, explainable facts allowed for one purpose | Include unrestricted records, raw tables, secrets, or unauthorized fields |
| AI boundary | Optionally phrase approved Structured Facts under a versioned prompt/policy | Query stores, create source facts, govern itself, diagnose, or bypass validation |
| Output Validator | Validate schema, versions, claims, disclosures, policy obligations, and provenance references | Trust model self-assessment or rewrite policy |
| Deterministic renderer | Produce approved non-AI wording from Structured Facts | Introduce unsupported facts or omit required caveats |
| Projection services | Build purpose-specific current state from authorized events | Treat derived state as origin or ignore deletion markers |
| Feature-flag evaluator | Limit eligible rollout under governance | Enable a prohibited purpose or disable protected controls |
| User-rights coordinator | Orchestrate correction, export, withdrawal, retention, and deletion | Declare completion before every required store/processor is reconciled |
| Audit service | Append minimized security/governance control evidence | Store raw wellness payloads for convenience |
| Operational telemetry | Observe health, latency, lag, errors, and coarse control outcomes | Collect measurements, notes, prompts, or user-output content |

These are logical components only. Deployment topology, database technology, authentication, APIs, and frontend design remain deferred.

## Event-driven data flow

```text
User-authorized command
        |
        v
Command gateway -- governance/consent/flag check --> deny + safe explanation
        |
        v
Immutable raw domain event + provenance envelope
        |
        +-----------------------> audit/control reference
        |
        v
Normalization Engine --> normalized event
        |
        v
Data Quality Engine --> accepted | quarantined | rejected event
        |
        v
Analytics Engine --> versioned calculation/trend event + explanation manifest
        |
        v
Governance Engine --> denied | approved Structured Facts
        |
        +--> deterministic renderer ------------------+
        |                                             |
        +--> optional isolated AI --> Output Validator+
                                                      |
                                                      v
                                                    User
```

### Flow invariants

1. Every change is an immutable event under the [Event Sourcing Standard](../architecture/event-sourcing.md).
2. Every measurement carries the complete [provenance envelope](../architecture/source-provenance-standard.md#required-measurement-envelope).
3. Every incoming measurement receives a versioned quality disposition before downstream use.
4. Original values, timestamps, units, and references are never overwritten by normalization.
5. Every calculation references exact input events and all applicable versions.
6. Every score and trend carries an explanation manifest.
7. The Governance Engine is the only path from analytics to Structured Facts.
8. AI sees only purpose-specific Structured Facts and cannot retrieve more data.
9. Output validation is mandatory for AI and deterministic rendering.
10. Feature flags narrow eligibility only; they cannot broaden constitutional permission.
11. Corrections supersede via events; deletion removes personal payloads and blocks rehydration.
12. All retries and consumers are idempotent, meaning repetition cannot create duplicate effects.

## Data and trust boundaries

```text
[Untrusted capture boundary]
  manual input | future approved device/provider input
                     |
=====================|===========================================
                     v
[Raw restricted boundary]
  encrypted events + provenance | no AI | no general logs
                     |
=====================|===========================================
                     v
[Governed processing boundary]
  normalization -> quality -> analytics -> governance
                     |
=====================|===========================================
                     v
[Minimized facts boundary]
  purpose-specific Structured Facts | pseudonymous | versioned
                     |
            +--------+--------+
            v                 v
 [Optional AI boundary]   [Deterministic renderer]
            |                 |
            +--------+--------+
                     v
              Output Validator
                     |
=====================|===========================================
                     v
                  [User]

[Privileged operations] -- just-in-time access + approval + audit -->
restricted boundaries only; never a direct user-output path
```

## Event sourcing and projections

Every accepted domain change appends an event. Purpose-specific projections provide current state and may be rebuilt from authorized, non-deleted events. Events and projections remain distinct from audit evidence.

Ordering is guaranteed within an aggregate, consumers record processed event IDs, and projections report lag/status. Correction events supersede prior facts. Deletion removes or cryptographically destroys personal payloads, clears projections and exports, and retains only minimal non-identifying evidence allowed by policy.

See the [Event Sourcing Standard](../architecture/event-sourcing.md) for envelope, privacy, replay, and correction rules.

## Version binding

Each event records governance and data-model versions. Each stored calculation also references every applicable scoring, analytics, normalization, prompt-template, AI-policy, API-contract, Structured Facts, and output-schema version. Unknown or incompatible versions fail closed.

See the [Versioning Framework](../architecture/versioning-framework.md).

## Feature flags and rollout

Every major optional module has a server-authoritative, auditable flag with a safe default, eligibility criteria, expiry, monitoring, and rollback. WHOOP, Apple Health, Health Connect, Glucose, Body Composition, AI, Notifications, Correlations, and Reporting default to off until separately approved.

Governance, consent, provenance, quality validation, version binding, output validation, audit, security, and user rights cannot be disabled by ordinary flags. See the [Feature Flag Framework](../architecture/feature-flags.md).

## Failure behavior

| Failure | Required behavior |
|---|---|
| Governance unavailable/incompatible | Fail closed; do not process or display affected output |
| Provenance incomplete | Quarantine or reject measurement |
| Quality rules unavailable | Do not promote data to analytics |
| Normalization failure | Preserve raw event; emit failure disposition; no guessed value |
| Analytics unavailable | Preserve accepted events; report processing state; retry safely |
| Structured Facts invalid | Do not invoke AI or render result |
| AI unavailable/disabled | Use approved deterministic renderer or no output |
| AI output invalid | Reject; use safe fallback; record minimized validation event |
| Output Validator unavailable | Do not display affected output |
| Feature-flag service unavailable | Use signed cached safe state or default off |
| Projection lag | Show stale/processing state with last-applied position |
| Audit unavailable for high-risk action | Reject the action |
| Deletion partially fails | Keep request incomplete, retry, and prevent rehydration |

## Future integration boundary

Any future provider enters through an isolated adapter that emits canonical provenance-bearing events. Each adapter requires a constitutional compliance review, feature flag, purpose and consent, data-quality contract, version mapping, revocation, retention, deletion, export, failure, and vendor-risk design.

No adapter, SDK, credential, webhook, network client, database, authentication integration, external API, or frontend page is created in Phase 1.1.

## Verification strategy

- Architecture conformance tests prove there is no analytics-to-user or raw-data-to-AI route.
- Policy tests verify deny precedence and fail-closed behavior at every enforcement point.
- Provenance and lineage tests reproduce calculations from exact events.
- Quality tests cover verified, imported, manual, device-measured, device-estimated, calculated, duplicate, incomplete, missing, unknown, and rejected classifications.
- Compatibility tests reject missing or mismatched version manifests.
- Explanation tests enumerate contributing, missing, and excluded data/modules and analyzed periods.
- Feature-flag tests prove protected controls cannot be disabled.
- Event replay, correction, deletion, restore, and rehydration-block tests validate lifecycle behavior.
- AI boundary tests prove no raw-store access and reject unsupported output.
- Privacy and threat-model evidence maps to the [Privacy by Design Standard](../security/privacy-by-design.md) and [Security Design](security-design.md).

## Open architecture questions

- Physical event-store and projection technology.
- Aggregate boundaries, ordering, replay, and event retention.
- Per-subject encryption and cryptographic-erasure design.
- Signed governance and feature-configuration distribution.
- Structured Facts schema and deterministic fallback format.
- Client platform, offline behavior, deployment region, and residency.
- Exact backup, deletion, restore, and audit retention targets.
- Whether any AI usage can produce enough user value to justify its privacy and safety cost.

Related: [Architecture Decisions](architecture-decisions.md), [Initial Data Model](data-model.md), and [Implementation Roadmap](implementation-roadmap.md).

## Document change log

| Version | Effective date | Classification | Change | Approved by |
|---|---|---|---|---|
| 1.0.0 | 2026-08-05 | Initial normative release | Initial ratified ARCH-SYS-001 artifact. The owner and approver were recorded as Andrew Penfold. | Andrew Penfold (historical record; corrected identity: Andrew Penistone) |
| 1.0.1 | 2026-08-06 | Administrative | Corrected the current owner and approver surname to Andrew Penistone. No normative requirements changed. | Andrew Penistone |
