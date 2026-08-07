# Architecture decisions

- **Document Identifier:** ARCH-ADR-001
- **Version:** 0.2.0
- **Owner:** Engineering Owner (unassigned)
- **Approver:** Not applicable while draft
- **Effective Date:** Not applicable while draft
- **Review Date:** Before implementing any proposed decision
- **Status:** draft
- **Governance Approval:** Pending human review
- **Supersedes:** 0.1.1
- **Convention:** `Proposed` decisions are binding only after approval. Rejected alternatives may be reconsidered through governance.

**Authority:** All decisions are subordinate to the [Governance Constitution](../governance/governance-constitution.md). A constitutional conflict invalidates the decision; an ADR cannot authorize an exception.

## Decision summary

| ID | Decision | Status |
| --- | --- | --- |
| ADR-001 | Manual-entry-first, provider-neutral domain | Proposed |
| ADR-002 | Modular monolith for the first deployment | Proposed |
| ADR-003 | Relational system of record | Superseded by ADR-012; physical store deferred |
| ADR-004 | Immutable observations and versioned derivations | Superseded and expanded by ADR-012 |
| ADR-005 | Deterministic scoring and curated recommendations | Proposed |
| ADR-006 | Purpose-aware authorization and consent enforcement | Proposed |
| ADR-007 | Database outbox for reliable asynchronous work | Superseded by ADR-012; transport deferred |
| ADR-008 | Logical separation of identity, wellness, and audit data | Proposed |
| ADR-009 | Content-minimized observability | Proposed |
| ADR-010 | No external APIs or models in Phase 1/1.1 | Accepted by explicit project constraint |
| ADR-011 | Governance Constitution is the highest authority | Proposed for ratification |
| ADR-012 | Event-sourced domain changes and governed projections | Proposed |
| ADR-013 | Raw-data-to-AI isolation with mandatory output validation | Proposed |
| ADR-014 | Independent versions and stored explanation manifests | Proposed |
| ADR-015 | Feature flags for major modules, never core controls | Proposed |
| ADR-016 | Markdown lint policy exceptions | Active; see standalone ADR |
| ADR-017 | Direct API versus health-repository integration | Proposed |
| ADR-018 | Vendor-neutral connector abstraction | Proposed |
| ADR-019 | Metric-specific source precedence | Proposed |
| ADR-020 | Duplicate preservation and canonical eligibility | Proposed |
| ADR-021 | Hume through health repositories first | Proposed |
| ADR-022 | Vendor-score non-replication | Proposed |
| ADR-023 | Read-only connector default | Proposed |
| ADR-024 | Metric-level rather than device-level source selection | Proposed |
| ADR-025 | Deterministic source ranking | Proposed |
| ADR-026 | User source-override rights | Proposed |
| ADR-027 | Ordered fallback behaviour | Proposed |
| ADR-028 | Methodology-break disclosure | Proposed |
| ADR-029 | Transported-source attribution | Proposed |
| ADR-030 | Prohibit incompatible metric averaging | Proposed |

**Identifier correction:** Phase 2A.0 introduced a standalone Markdown lint
policy using the already assigned ADR-013 identifier. The raw-data-to-AI
isolation decision retains its original ADR-013 identifier. The later Markdown
lint policy is corrected to ADR-016, preserving both decisions and their history.

## ADR-001: Manual-entry-first, provider-neutral domain

**Context:** The product needs a usable foundation before vendor access, schemas, and platform permissions are known.

**Decision:** Define canonical observations and build the first slice around manual entry. Future providers use adapters into this contract.

**Consequences:** The core remains testable and portable. Manual input has more friction and lower sensor precision. Provider-specific details require explicit provenance fields and may not map losslessly.

**Alternatives:** Build around a vendor schema (faster single integration, creates lock-in); wait for integrations (delays learning about the core user value).

## ADR-002: Modular monolith for the first deployment

**Context:** The domain needs strong boundaries, but early load and team topology do not justify distributed operations.

**Decision:** Deploy one stateless application and a worker, with modules for identity, consent, observations, scoring, recommendations, safety, rights, and audit.

**Consequences:** Transactions, local development, deletion, and tracing are simpler. Module discipline must be enforced in code and tests. A future service split remains possible at stable contracts.

**Alternatives:** Microservices (strong isolation but high operational and consistency cost); serverless functions per feature (easy scaling but fragmented policy and observability).

## ADR-003: Relational system of record

**Phase 1.1 status:** Superseded. The event stream is the source of domain truth under ADR-012. The physical event store and projection stores may use relational technology, but no database choice is approved here.

**Context:** Consent, lineage, ownership, method versions, and rights workflows have strong relationships and integrity constraints.

**Decision:** Use a transactional relational database as the source of truth. Keep blobs out unless an approved need emerges.

**Consequences:** Referential integrity and transactional outbox are straightforward. Flexible provider payloads must be normalized or stored in controlled JSON with schemas. Exact engine selection is deferred.

**Alternatives:** Document database (flexible ingestion, weaker cross-entity integrity); event store as primary (excellent history, higher projection and privacy complexity).

## ADR-004: Immutable observations and versioned derivations

**Phase 1.1 status:** Superseded and expanded by ADR-012. The prior rejection of full event sourcing no longer applies.

**Context:** Users can correct data, methods change, and results need reproducibility.

**Decision:** Append corrected observation versions and derived results; link superseded records and exact inputs.

**Consequences:** History and auditability improve. Storage and queries are more complex. User deletion still removes subject data through an orchestrated hard-deletion workflow rather than preserving immutable personal content forever.

**Alternatives:** In-place updates (simple current state, loses reproducibility); full event sourcing (more complete chronology, disproportionate implementation burden).

## ADR-005: Deterministic scoring and curated recommendations

**Context:** Wellness guidance can affect behavior and must be explainable, testable, and stoppable.

**Decision:** Use versioned deterministic math for scores and a deterministic selector over human-reviewed recommendation content. Zero recommendations is valid.

**Consequences:** Outputs can be reproduced, reviewed, and rolled back. Language variety and open-ended personalization are limited. Future model assistance requires a new decision and safety case.

**Alternatives:** External language model generation (flexible, adds privacy and safety uncertainty); opaque predictive model (potential pattern fit, hard to explain and validate); no scoring (low risk but may weaken synthesis value).

## ADR-006: Purpose-aware authorization and consent enforcement

**Context:** Authentication and ownership alone do not prove a processing purpose is allowed.

**Decision:** Every sensitive command and background job evaluates owner, action, purpose, consent, and policy version.

**Consequences:** Consent withdrawal becomes enforceable and auditable. Policy context must propagate through modules and tests. Availability of the policy evaluator becomes safety-critical.

**Alternatives:** UI-only consent (easy to bypass); periodic offline consent cleanup (processing can continue after withdrawal).

## ADR-007: Database outbox for reliable asynchronous work

**Phase 1.1 status:** Superseded as a binding technology choice. ADR-012 requires durable event-driven processing, ordering, idempotent consumers, and reliable projection updates; an outbox remains one possible future implementation.

**Context:** Scoring, export, deletion, and recalculation should not block interactive writes, but work must not be lost.

**Decision:** Commit domain change and outbox record together; idempotent workers process pending records.

**Consequences:** Reliable eventual processing without an early message-broker dependency. Worker lag and outbox cleanup need monitoring. A broker can be introduced later behind the contract.

**Alternatives:** Fire-and-forget task (can lose work); distributed transaction with broker (complex); synchronous-only processing (slow and brittle for rights workflows).

## ADR-008: Logical separation of identity, wellness, and audit data

**Context:** Different data classes have different access patterns, retention, and breach impact.

**Decision:** Separate schemas or equivalent access partitions, database roles, and service interfaces. Join through pseudonymous subject IDs.

**Consequences:** Least privilege and masked support access are clearer. Cross-partition operations and deletion orchestration require care. Physical databases may remain shared initially if controls are equivalent.

**Alternatives:** One unrestricted schema (simpler, expands blast radius); separate database per class immediately (strong isolation, higher operational cost).

## ADR-009: Content-minimized observability

**Context:** Logs and analytics commonly become uncontrolled copies of sensitive data.

**Decision:** Use allowlisted operational events, pseudonymous references, coarse properties, and automated redaction. Never log raw wellness values, notes, or recommendation bodies.

**Consequences:** Privacy and incident scope improve. Debugging requires trace IDs, controlled reproduction, and purpose-approved support workflows rather than payload inspection.

**Alternatives:** Log full payloads with short retention (still creates broad exposure); rely only on developer discipline (not enforceable).

## ADR-010: No external APIs or models in Phase 1/1.1

**Context:** Phase 1 and Phase 1.1 are documentation-only, and the user explicitly prohibited connections to WHOOP, Claude, Apple Health, Health Connect, databases, authentication, APIs, and frontend pages.

**Decision:** Create no SDK setup, credentials, network clients, provider schemas, webhook endpoints, or proof-of-concept calls. Document only a future adapter boundary.

**Consequences:** Phase 1.1 remains reviewable without vendor commitments, data transfer, infrastructure, or application scaffolding. Integration feasibility and platform-specific constraints remain unknown and require future, separately approved ADRs.

**Alternatives:** None within the authorized scope.

## ADR-011: Governance Constitution is the highest authority

**Context:** Policy stated only in documents or UI can be bypassed by calculations, flags, operators, jobs, AI, or direct output paths.

**Decision:** The Governance Constitution controls every subordinate artifact. Enforcement occurs at design review, release admission, command handling, event consumption, Structured Facts creation, feature eligibility, output validation, and audit reconciliation. Deny wins and missing policy fails closed.

**Consequences:** Governance becomes a runtime and process dependency with stop-ship authority. Availability and compatibility require careful design. Delivery cannot proceed without compliance evidence.

**Alternatives:** Advisory governance (bypassable); policy only at the UI or API edge (background and downstream paths remain unsafe).

## ADR-012: Event-sourced domain changes and governed projections

**Context:** Provenance, correction, deletion, scoring reproduction, governance changes, and audit need an exact record of change.

**Decision:** Every meaningful domain change appends an immutable event. Purpose-specific projections provide current state. Personal payloads remain subject to retention and deletion, including cryptographic erasure or approved stream removal; minimal non-identifying evidence may remain where authorized.

**Consequences:** Lineage and replay improve. Schema evolution, projection lag, replay authorization, and privacy-safe deletion become core design work. ADR-003, ADR-004, and ADR-007 no longer dictate the physical design.

**Alternatives:** Mutable current-state records (loses history); append-only observations only (does not cover governance, consent, flags, rights, or calculations).

## ADR-013: Raw-data-to-AI isolation with mandatory output validation

**Context:** AI access to raw stores expands privacy exposure and permits ungoverned inference or output.

**Decision:** The fixed future path is Raw Data → Normalization Engine → Analytics Engine → Governance Engine → Structured Facts → optional Claude/AI → Output Validator → User. AI never queries raw tables, raw events, or unrestricted projections.

**Consequences:** AI context is minimized and auditable. Structured Facts and deterministic fallback need careful schema design. Open-ended model access and direct retrieval are prohibited.

**Alternatives:** AI with read-only database access (still excessive and bypassable); AI before governance (unsafe facts may be generated); model self-review (not independent enforcement).

**Identifier correction note:** A later standalone Markdown lint policy was
temporarily labelled ADR-013 during Phase 2A.0. That document is now ADR-016.
This AI-isolation decision remains ADR-013 and was not overwritten.

## ADR-014: Independent versions and stored explanation manifests

**Context:** A single application version cannot reproduce calculations or show which governance, analytics, prompt, AI, contract, and schema rules applied.

**Decision:** Version governance, scoring, prompt templates, AI policies, analytics, data model, API contracts, and output schemas independently. Every stored calculation references all applicable versions and a versioned explanation manifest.

**Consequences:** Historical meaning and rollback are clear. Compatibility matrices, registries, migrations, and user-facing change explanations add work.

**Alternatives:** Application-version-only tracking (ambiguous); current-version lookup for old results (silently rewrites meaning).

## ADR-015: Feature flags for major modules, never core controls

**Context:** Sensitive modules need staged rollout and independent shutdown, but flags can create hidden policy bypasses.

**Decision:** Major optional modules use server-authoritative, audited, expiring flags with safe defaults and rollback. Governance, consent, provenance, quality, versions, output validation, audit, security, and user rights are protected and cannot be disabled by ordinary flags.

**Consequences:** Rollouts are reversible and scoped. Flag configuration becomes governed state with monitoring and lifecycle overhead.

**Alternatives:** Deploy-only enablement (slow emergency control); unrestricted flags (can weaken constitutional safeguards).

## Decisions deferred

- Client platform and offline model.
- Cloud/deployment provider, regions, and database engine.
- Identity provider and authentication factors.
- Exact scoring parameters and whether to show an overall score.
- Free-text inclusion.
- Encryption granularity and key hierarchy.
- External integrations and any model usage.
- Event-store, projection-store, and delivery technology.
- Governance policy artifact signing and distribution.
- Structured Facts and explanation schemas.

Related: [Governance Constitution](../governance/governance-constitution.md), [system architecture](system-architecture.md), [event sourcing](../architecture/event-sourcing.md), [security design](security-design.md), and [roadmap](implementation-roadmap.md).

## Document change log

| Version | Effective date | Change | Approved by |
| --- | --- | --- | --- |
| 0.1.0 | Not applicable while draft | Initial draft architecture decision register. | Pending human review |
| 0.1.1 | Not applicable while draft | Preserved AI isolation as ADR-013 and corrected the later Markdown lint policy identifier to ADR-016. | Pending human review |
| 0.2.0 | Not applicable while draft | Added vendor-neutral connector and metric-source selection decisions ADR-017 through ADR-030. | Pending human review |

## ADR-017: Direct API versus health-repository integration

**Context:** Vendors expose different official access routes, permissions, histories, and commercial terms.

**Decision:** Choose the approved route per vendor and capability. Direct cloud APIs, operating-system repositories, platform SDKs, and import/manual routes are peers behind one contract; none is universally preferred.

**Consequences:** Origin and transport must be separate, and capability claims remain evidence-based. Connector investigations carry more platform-specific work.

**Alternatives:** Require direct APIs for all vendors (often unavailable); route everything through repositories (loses capabilities and origin clarity).

## ADR-018: Vendor-neutral connector abstraction

**Context:** Provider-specific logic in analytics would create lock-in and inconsistent governance.

**Decision:** Every connector implements versioned authorisation, consent, status, capability, sync, pagination, webhook, rate-limit, error, revocation, deletion, provenance, priority, quality, terms, and branding contracts.

**Consequences:** Analytics consumes canonical contracts. Vendor-specific capabilities remain explicit extensions rather than leaking through the domain.

**Alternatives:** Provider-specific pipelines (faster initially, fragmented controls); lowest-common-denominator schema (hides useful capability).

## ADR-019: Metric-specific source precedence

**Context:** One device may be strongest for one metric and incomplete for another.

**Decision:** Precedence is versioned per metric and may incorporate a confirmed user preference. No device receives universal superiority.

**Consequences:** Selection is more accurate and explainable but requires a policy for each supported metric.

**Alternatives:** Global device priority (simple, frequently wrong); newest-record-wins (unstable and origin-blind).

## ADR-020: Duplicate preservation and canonical eligibility

**Context:** Direct and transported feeds can deliver the same source record multiple times.

**Decision:** Preserve each received source event, group exact and probable duplicates deterministically, and make only eligible representatives canonical. A transported copy cannot outrank its original merely because of transport.

**Consequences:** Storage and reconciliation are more complex, while audit and correction remain complete.

**Alternatives:** Delete duplicates (loses delivery evidence); average duplicates (distorts values).

## ADR-021: Hume through health repositories first

**Context:** No approved assumption establishes a public Hume API suitable for this product.

**Decision:** Plan initial Hume access through Apple Health or a supported Android repository where Hume-originated records are present. Investigate partner access separately.

**Consequences:** Initial capability may be limited, and labels must say `Hume via` the repository.

**Alternatives:** Assume an undocumented API (commercial and reliability risk); omit Hume planning entirely (misses a supported repository route).

## ADR-022: Vendor-score non-replication

**Context:** Proprietary scores encode vendor methods, branding, and specialist experiences.

**Decision:** Import and display permitted proprietary scores with attribution, but never reverse-engineer, imitate, or present an internally recreated equivalent.

**Consequences:** The product focuses on cross-platform gaps and cannot promise score parity.

**Alternatives:** Clone vendor scores (misleading and legally risky); discard all vendor scores (removes useful attributed context).

## ADR-023: Read-only connector default

**Context:** Write access increases user harm, credential scope, and vendor risk without being needed for initial synthesis.

**Decision:** Every connector is read-only by default. Write capability requires a separate approved purpose, consent, threat model, and release decision.

**Consequences:** Initial integrations have lower privilege and cannot control devices or modify vendor records.

**Alternatives:** Request broad scopes pre-emptively (violates minimisation); connector-specific defaults (inconsistent safety).

## ADR-024: Metric-level rather than device-level source selection

**Context:** Device-level selection ignores metric-specific coverage and measurement methods.

**Decision:** Select and store source mode independently for every metric.

**Consequences:** Users gain precise control; configuration and explanation surfaces are larger.

**Alternatives:** One preferred device (simple but inaccurate); mix every available value (unreproducible).

## ADR-025: Deterministic source ranking

**Context:** Canonical values must be reproducible and cannot depend on opaque judgement.

**Decision:** Versioned metric policies deterministically evaluate exclusions, suitability factors, ranks, confidence, and tie-breakers. AI cannot rank or select.

**Consequences:** Decisions can be tested, audited, recalculated, and explained. Policies require ongoing stewardship.

**Alternatives:** AI selection (non-deterministic); user-only selection (high burden and poor defaults).

## ADR-026: User source-override rights

**Context:** A deterministic default may not reflect an individual's use pattern or preference.

**Decision:** Users may inspect, override, explain optionally, and restore source choice per metric after an impact preview and explicit confirmation.

**Consequences:** User agency improves; preference integrity, audit, recalculation, and methodology disclosure become mandatory.

**Alternatives:** No overrides (removes agency); silent preference changes (not informed or auditable).

## ADR-027: Ordered fallback behaviour

**Context:** Preferred sources may lack valid records for a required period.

**Decision:** Evaluate explicitly ordered fallbacks only when the preferred source has no valid record for that period. Label every fallback decision and do not silently fill gaps from multiple sources.

**Consequences:** Continuity is controlled and visible, with some gaps intentionally retained.

**Alternatives:** Any-available-source fallback (unstable); no fallback (avoidable missing periods).

## ADR-028: Methodology-break disclosure

**Context:** Source, algorithm, connector, or classification changes can make trends incomparable.

**Decision:** Append methodology-break events and mark affected trend periods, exports, and explanations whenever a material method boundary occurs.

**Consequences:** Trends are more honest but visually and analytically more complex.

**Alternatives:** Present continuous trends (misleading); discard history at each change (destroys longitudinal value).

## ADR-029: Transported-source attribution

**Context:** Health repositories often carry records created by another vendor or device.

**Decision:** Store originating, transport, canonical, displayed, and fallback sources separately. Display transported records as `Origin via Transport`.

**Consequences:** Provenance is accurate and duplicate detection improves. Interfaces must carry a richer source path.

**Alternatives:** Attribute to transport repository (false origin); show only origin (hides the access path).

## ADR-030: Prohibit incompatible metric averaging

**Context:** Measurements with different methods, windows, or proprietary definitions may share a label but not meaning.

**Decision:** Do not average incompatible measurements. Aggregation requires an approved metric policy defining compatibility, units, windows, and explanation.

**Consequences:** Some conflicts remain unresolved and visible rather than producing a misleading number.

**Alternatives:** Average everything (false precision); always discard all but one record (loses compatible aggregation opportunities).
