# Versioning Framework

- **Document Identifier:** ARCH-VER-001
- **Version:** 1.2.0
- **Owner:** Andrew Penistone
- **Approver:** Andrew Penistone
- **Effective Date:** 2026-08-06
- **Review Date:** 2026-11-05
- **Status:** active
- **Governance Approval:** Ratified
- **Supersedes:** 1.1.0
- **Authority:** Subordinate to the [Governance Constitution](../governance/governance-constitution.md)
- **Rule:** Each stored calculation must reference every applicable version. Missing or incompatible versions make the result invalid for display or downstream use.

## Purpose

Independent versioning prevents a governance, scoring, prompt, policy, analytics, data-model, contract, or schema change from silently altering historical meaning. A single application release number is not enough to reproduce a result.

## Independently versioned authorities

| Version family | Governs | Required reference |
| --- | --- | --- |
| Governance | Constitution and effective policy bundle | Every event, processing decision, calculation, Structured Facts package, and output |
| Scoring Engine | Transforms, weights, thresholds, missingness, confidence, score rules | Every score and score-derived trend/recommendation |
| Prompt Templates | System/developer instructions and structured rendering template supplied to an AI | Every AI invocation and AI-assisted output |
| AI Policies | Permitted AI purposes, input fields, prohibited behavior, fallback, validator requirements | Every AI invocation, validation decision, and AI-assisted output |
| Analytics Engine | Aggregation, correlation, trend, window, exclusion, and statistical rules | Every trend, correlation, aggregate, and Structured Facts package using analytics |
| Data Model | Event, entity, metric, and provenance schema semantics | Every stored event/record and migration result |
| API Contracts | Request/response or internal module contract | Every accepted request/event at that boundary; exact persistence may be trace metadata |
| Output Schemas | Structured Facts and user-output shape/constraints | Every Structured Facts package, AI response, validated output, and export |
| AI Use Policy | Approved internal providers, prompts, privacy controls, review, and escalation | Every AI-assisted governed artifact and recorded AI interaction |
| Review Findings Register | Findings, dispositions, owners, status, and evidence | Every formal governance review and closure decision |
| Residual Risk Register | Accepted risks, controls, acceptor, scope, and expiry | Every decision that proceeds with material residual risk |

Normalization/calculation rules that are not part of scoring use a separately identified calculation component version inside the Analytics Engine or a named normalization family. Feature-flag configuration, recommendation content, metric definitions, quality rules, and validator rules also carry immutable version identifiers even when not listed as top-level families.

## Version identifier

Each released artifact contains:

- family and semantic version;
- immutable release identifier;
- content digest;
- status: `draft`, `approved`, `active`, `retired`, `revoked`;
- owner and named approvers;
- created, approved, effective, and retired timestamps;
- predecessor and compatibility declaration;
- change summary and migration requirements;
- validation evidence reference;
- governance version that authorized the release.

Mutable labels such as `latest`, branch names, deployment names, or provider aliases are not valid stored version references.

## Document change log

| Version | Effective date | Classification | Change | Approved by |
| --- | --- | --- | --- | --- |
| 1.0.0 | 2026-08-05 | Initial normative release | Initial ratified framework. The owner and approver were recorded as Andrew Penfold. | Andrew Penfold (historical record; corrected identity: Andrew Penistone) |
| 1.1.0 | 2026-08-06 | Normative and administrative | Added AI-use-policy, findings-register, and residual-risk-register families; corrected the current owner and approver identity to Andrew Penistone. | Andrew Penistone |
| 1.2.0 | 2026-08-06 | Normative and administrative | Separated lifecycle status from governance approval and defined the prerequisite for reproducible content digests. | Andrew Penistone |

## Content-digest canonicalisation milestone

No governed artifact may claim a content digest until a canonicalisation method defines encoding, line endings, metadata inclusion, Unicode normalisation, trailing whitespace, final newline handling, and the digest algorithm. Hashing an editor-dependent file representation would not be reproducible evidence.

The canonicalisation method and automated verifier are targeted to **Phase 2A.1 before the first executable governance-policy bundle**. Until that milestone, the metadata finding remains open and each artifact records its immutable Git commit and release tag as available provenance without mislabelling either as the required canonical content digest.

## Version semantics

- **Major:** Incompatible meaning, contract, user interpretation, authority, or required migration.
- **Minor:** Backward-compatible capability or rule addition that may affect output.
- **Patch:** Defect correction or clarification that preserves declared meaning and contract.

Each family defines concrete compatibility rules. Governance follows the stricter rules in the constitution. A provider/model’s own version string is recorded but does not replace the internal AI policy, prompt, and output-schema versions.

## Calculation version manifest

Every stored calculation carries a manifest like this conceptual record:

```text
calculation_id
input_event_ids[]
governance_version
scoring_engine_version        (if applicable)
prompt_template_version       (if applicable)
ai_policy_version             (if applicable)
ai_provider_model_version     (if applicable)
analytics_engine_version      (if applicable)
normalization_version
data_model_version
api_contract_versions[]       (applicable boundaries)
structured_facts_schema_version
output_schema_version
quality_rule_version
feature_flag_snapshot_version
calculated_at
release_digest
```

`not_applicable` is an explicit state with a reason. Omission is not equivalent to not applicable.

## Compatibility rules

1. The Governance Engine evaluates an explicit compatibility matrix before processing or display.
2. A revoked governance, AI-policy, or unsafe calculation version blocks new processing immediately.
3. Historical results may remain visible only if governance permits, the original meaning is retained, and material limitations are disclosed.
4. Inputs created under an older data model require an approved adapter/migration version.
5. Prompt templates and output schemas must declare compatible Structured Facts schemas and validator versions.
6. Unknown versions fail closed. The system must not substitute the current version silently.
7. Mixed-version aggregates list all material input versions or reference a version manifest.

## Lifecycle

```text
Draft
  │ review + evidence
  ▼
Approved
  │ controlled activation
  ▼
Active ───────▶ Retired
  │ safety/privacy violation
  ▼
Revoked
```

Draft artifacts cannot process user data. Approved artifacts are not effective before their activation time. Retired artifacts cannot create new results. Revoked artifacts are denied according to the governance response plan.

## Change and migration rules

- Never mutate a released artifact in place; publish a new version.
- Determine which stored events, calculations, consents, explanations, exports, and caches are affected.
- Recalculation creates new results and supersession links; it never overwrites history.
- Major governance or purpose changes may require renewed consent before migration.
- Backfills use exact input versions and record the initiating change and migration version.
- Rollback changes the active version pointer and creates an event; it does not erase outputs already shown.
- User communication is required when comparability or interpretation changes materially.

## AI-specific requirements

An AI invocation must bind governance version, AI-policy version, prompt-template version, provider, model/version, Structured Facts schema, output schema, output-validator version, feature-flag snapshot, and invocation time. Raw prompt logging is prohibited by default. Store a protected digest and minimal audit metadata unless an approved purpose requires more.

AI output without a complete compatible manifest is rejected. A model alias such as “latest” must resolve to and record a concrete provider version or deployment digest at invocation time.

## Audit and explainability

- Version activation, retirement, revocation, compatibility changes, migrations, and rollback create audit events.
- User explanations expose calculation version and material method changes in understandable language.
- Exports include relevant version manifests and public change-log references.
- Internal reproducibility tools use exact immutable artifacts and input-event references.

## Release gates

- Contract and compatibility tests cover supported and rejected version combinations.
- Golden calculations reproduce outputs from stored manifests.
- Migration and rollback tests preserve lineage and user rights.
- Deployment admission rejects unknown or unapproved versions.
- Runtime output validation rejects incomplete manifests.
- Reconciliation finds calculations missing applicable version references.

## Open questions

- Registry technology and artifact-signing mechanism.
- Family-specific semantic-version thresholds.
- How long retired executable artifacts must remain available for reproducibility.
- User-facing presentation of material version changes.
- Exact version persistence for internal API contract hops without excessive duplication.

Related: [Explainability Standard](explainability-standard.md), [Event Sourcing Standard](event-sourcing.md), and [Source Provenance Standard](source-provenance-standard.md).
