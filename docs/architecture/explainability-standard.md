# Explainability Standard

- **Document Identifier:** ARCH-EXP-001
- **Version:** 1.1.0
- **Owner:** Andrew Penistone
- **Approver:** Andrew Penistone
- **Effective Date:** 2026-08-07
- **Review Date:** 2026-11-05
- **Status:** active
- **Governance Approval:** Ratified
- **Supersedes:** 1.0.2
- **Authority:** Subordinate to the [Governance Constitution](../governance/governance-constitution.md)
- **Rule:** If a result cannot produce a faithful explanation from stored lineage, it cannot be shown as an authoritative product result.

## Purpose

Explainability lets a user understand what the product did without suggesting clinical certainty or exposing hidden system reasoning. It is a stored, versioned product output derived from the same facts as the result, not prose reconstructed later from memory or an AI guess.

## Universal explanation contract

For canonical source decisions, the explanation additionally identifies selected source, selection mode, originating vendor, transport path, reasons selected, alternatives considered, exclusion reasons, coverage and quality comparison, direct/estimate status, missing-data impact, fallback activation, methodology-break status, metric-policy version, and decision timestamp.

Source explanations use deterministic structured facts. AI may phrase those facts only after governance and cannot add a selection reason, rank, clinical comparison, or unsupported claim.

Every explanation contains:

- result type and identifier;
- plain-language purpose and non-diagnostic limitation;
- analyzed period, timezone basis, and calculation time;
- source-data summary by classification and freshness;
- contributing, missing, rejected, duplicate, stale, and excluded data;
- module and feature-flag states that materially affected the result;
- confidence and what that confidence means;
- applicable governance, scoring, analytics, data-model, and output-schema versions;
- whether AI was used, and if so, the applicable AI-policy, prompt-template, provider/model, validator, and output-schema versions;
- provenance/lineage reference suitable for export and support;
- supersession or recalculation status.

## Score explanation

Every score must answer **“Why?”**. The answer must state:

1. which metrics contributed and their source classifications;
2. each material contributor’s direction and understandable effect;
3. whether comparison used a fixed range or personal baseline;
4. available versus required coverage;
5. missing, rejected, duplicate, stale, or excluded inputs;
6. confidence and its drivers;
7. analyzed period and timezone basis;
8. scoring-engine and governance versions;
9. whether the score was recalculated after correction or method change;
10. that the score is a non-diagnostic wellness summary.

Example shape:

```text
Why this score: Sleep quality and energy contributed positively. Reported stress
contributed negatively. Sleep duration was missing, so confidence is low.
Period: 2026-08-04 in Europe/Paris. Scoring version: 1.2.0.
This is a wellness summary, not a medical assessment.
```

The example is illustrative documentation, not approved copy or a calculated output.

## Trend explanation

Every trend must explain:

- **Which data contributed:** exact metric categories, included count, classifications, sources, and freshness.
- **Which data was missing:** expected-but-absent dates/metrics and explicit missing reasons.
- **Which modules were excluded:** disabled feature flags, governance exclusions, unavailable providers, unsupported metrics, quality rejection, or user choice.
- **What time period was analysed:** inclusive start/end, timezone, window rule, and minimum coverage.
- **Which calculation version was used:** analytics-engine version and any scoring/normalization versions.

It must also state comparison method, variability/uncertainty, and whether the observed association is non-causal. A trend cannot use language such as “caused,” “proved,” or “will result in” unless a later constitutionally approved evidence standard explicitly permits it.

## Recommendation explanation

Every recommendation states:

- the visible facts that made it eligible;
- its reviewed content/evidence version and review date;
- confidence and any missing context;
- applicable contraindication and suppression checks;
- user preferences or frequency limits that affected ranking;
- expiry or relevance period;
- how to dismiss, mute, or give feedback;
- the non-diagnostic boundary.

If a suggestion is withheld for security-sensitive reasons, the user receives a safe generic explanation without exposing abuse controls.

## AI-assisted output explanation

AI may phrase approved Structured Facts but must not invent the explanation. The deterministic system creates the explanation manifest before AI access. The Output Validator verifies that the response:

- uses only supplied facts and allowed language;
- preserves missingness, exclusions, confidence, time period, and version facts;
- includes required disclosures of AI use;
- makes no diagnostic, causal, or unsupported claim;
- does not expose internal prompts, security rules, identifiers, or raw event payloads;
- matches the approved output schema.

When validation fails, use approved deterministic copy or display no AI-assisted response. Never ask the model to self-certify compliance.

## Explanation data model

A conceptual explanation manifest contains:

```text
explanation_id
subject_id
result_id
result_type
input_event_manifest
contributing_factors[]
missing_data[]
excluded_data[]
excluded_modules[]
analysis_period
timezone_basis
confidence
method_versions
governance_version
feature_flag_snapshot_version
ai_usage_manifest          (optional)
output_schema_version
generated_at
supersedes_explanation_id  (optional)
```

User-facing wording references this manifest. The manifest is subject to the same access, retention, export, correction, and deletion rules as its result.

## Missing and excluded data taxonomy

Explanations use controlled reasons:

- user did not provide;
- user declined;
- not applicable;
- source unavailable;
- feature disabled;
- consent not active;
- outside analyzed period;
- stale;
- incomplete;
- duplicate;
- rejected by quality rule;
- incompatible version;
- governance prohibited;
- calculation not supported.

Do not blame the user or imply that providing optional data is required.

## Presentation principles

- Place the short “why” beside the result, with deeper detail available in one action.
- Use plain language, concrete dates, units, and source classes.
- Show uncertainty before precision.
- Avoid unexplained statistical and technical terms.
- Make source and AI involvement visible without overwhelming the primary task.
- Meet accessibility requirements for text, color, focus order, screen readers, and data visualizations.
- Never use color alone to communicate wellness status or confidence.

## Audit and reproducibility

- The shown explanation and output-schema version are stored or reproducibly rendered from an immutable manifest.
- Audit events record explanation generation, validation outcome, material suppression, and supersession without raw wellness content.
- Support can locate the version manifest through a trace reference without broad raw-data access.
- Exports include machine-readable explanation manifests and a human-readable glossary.

## Acceptance tests

- Golden tests match score/trend/recommendation results to expected explanations.
- Missing, stale, duplicate, rejected, conflicting, and disabled-module cases name the correct exclusions.
- Version tests reject missing or incompatible calculation references.
- AI tests inject unsupported claims and confirm deterministic rejection.
- Usability tests verify users can answer what contributed, what was absent, the period, confidence meaning, and whether AI was used.
- Accessibility testing covers every explanation layer.

## Open questions

- Final user vocabulary for confidence and quality classifications.
- Minimum detail shown inline versus on demand.
- How long explanation manifests remain available after a result is superseded.
- Exact disclosure wording for future AI use.

Related: [Scoring Methodology](../phase-1/scoring-methodology.md), [Source Provenance Standard](source-provenance-standard.md), and [Versioning Framework](versioning-framework.md).

## Document change log

| Version | Effective date | Classification | Change | Approved by |
| --- | --- | --- | --- | --- |
| 1.0.0 | 2026-08-05 | Initial normative release | Initial ratified ARCH-EXP-001 artifact. The owner and approver were recorded as Andrew Penfold. | Andrew Penfold (historical record; corrected identity: Andrew Penistone) |
| 1.0.1 | 2026-08-06 | Administrative | Corrected the current owner and approver surname to Andrew Penistone. No normative requirements changed. | Andrew Penistone |
| 1.0.2 | 2026-08-06 | Administrative | Reconciled lifecycle status with ARCH-VER-001 and recorded ratification separately. No normative requirements changed. | Andrew Penistone |
| 1.1.0 | 2026-08-07 | Normative amendment | Added canonical-source selection, transport, fallback, and methodology-break explanation requirements. | Andrew Penistone |
