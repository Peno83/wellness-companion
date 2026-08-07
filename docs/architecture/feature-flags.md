# Feature Flag Framework

- **Document Identifier:** ARCH-FLAG-001
- **Version:** 1.1.0
- **Owner:** Andrew Penistone
- **Approver:** Andrew Penistone
- **Effective Date:** 2026-08-07
- **Review Date:** 2026-11-05
- **Status:** active
- **Governance Approval:** Ratified
- **Supersedes:** 1.0.2
- **Authority:** Subordinate to the [Governance Constitution](../governance/governance-constitution.md)
- **Definition:** A feature flag is a versioned control that enables or disables a bounded product capability without changing its constitutional permissions.

## Purpose

Every major module must support feature flags so rollout can be staged, monitored, stopped, and reversed. Flags limit exposure; they do not authorize data collection or bypass governance.

## Required module flags

The framework reserves independent flags for:

| Module | Default before approval | Dependency notes |
| --- | --- | --- |
| WHOOP | Off | Requires provider review, consent, provenance contract, deletion, and sync controls |
| Apple Health | Off | Requires platform permissions, on-device privacy design, provenance, and revocation |
| Health Connect | Off | Requires platform permissions, provenance, revocation, and Android-specific review |
| Glucose | Off | High sensitivity; needs explicit non-diagnostic use case and qualified safety review |
| Body Composition | Off | Requires metric definitions, sensitivity review, and harm-aware presentation |
| AI | Off | Requires AI isolation, provider/model review, evaluations, output validation, and consent where applicable |
| Notifications | Off | Requires purpose, consent/permission, quiet hours, sensitive lock-screen policy, and frequency caps |
| Correlations | Off | Requires statistical validity, minimum data, non-causal language, and explainability |
| Reporting | Off | Requires output/export classification, access control, redaction, and retention |
| Fitbit | Off | Requires approved API access, consent, provenance, revocation, and deletion |
| Garmin | Off | Requires approved commercial route, terms, consent, and provenance |
| Oura | Off | Requires approved API access and proprietary-score attribution |
| Samsung Health | Off | Requires approved SDK/repository route and platform-specific review |
| Hume Health | Off | Repository-mediated only until an official route is approved |
| Source Selection | Off | Requires ratified metric policies, explanations, and deterministic conformance tests |
| Source Override | Off | Requires explicit confirmation, audit, restore, and methodology-break controls |
| Source Fallback | Off | Requires ordered fallback policy and visible fallback labelling |
| Capability Coverage | Off | Requires missing-state semantics and module-exclusion tests |

Reserved flags do not select or connect a provider. Phase 1.1 creates documentation only.

## Protected core controls

The following are not ordinary feature flags and cannot be disabled for a rollout or experiment:

- Governance Engine evaluation;
- consent and purpose enforcement;
- source provenance capture;
- data-quality validation;
- version-manifest binding;
- Output Validator;
- authorization and encryption controls;
- audit generation for required actions;
- user correction, export, withdrawal, and deletion rights;
- retention enforcement and incident kill capability.

Emergency policy may disable processing more strictly. It may not weaken these controls.

## Flag definition contract

Each flag contains:

- immutable flag key and version;
- owner and approving governance decision;
- purpose and affected user outcome;
- default and fail-safe value;
- allowed environments and audiences;
- prerequisites and incompatible flags;
- data categories, consent purposes, and jurisdictions permitted;
- start, review, and expiry times;
- exposure allocation method;
- success, harm, privacy, security, and rollback metrics;
- rollout stages and stop conditions;
- kill-switch owner;
- change and audit history.

Flag context may use approved coarse attributes such as environment, jurisdiction, client version, consent, and randomized cohort. It must not use diagnoses, sensitive wellness values, protected attributes, or hidden vulnerability profiles for targeting.

## Evaluation order

```text
Constitution + effective governance
              │ deny always wins
              ▼
Consent / purpose / jurisdiction eligibility
              │
              ▼
Security and version compatibility
              │
              ▼
Feature flag evaluation
              │
              ▼
Module execution
              │
              ▼
Governance Engine + Output Validator before user output
```

A flag value of `on` means “eligible to proceed to remaining controls,” not “permitted regardless of controls.” Missing, corrupt, expired, or unreachable flag configuration resolves to the documented safe default, normally `off` for optional or sensitive modules.

## Rollout strategy

1. **Design-disabled:** Flag exists only in documentation/config registry; no executable path.
2. **Development:** Synthetic data only; non-production environment; governance checks active.
3. **Internal test:** Authorized internal accounts using synthetic or explicitly approved test data.
4. **Shadow:** Module may compute but cannot affect users; data purpose must allow shadow processing.
5. **Private cohort:** Explicitly eligible, consented small group with monitoring and support.
6. **Percentage rollout:** Stable randomized cohorts, increasing only after gate review.
7. **Jurisdiction/platform expansion:** Each new context passes privacy, security, and safety review.
8. **General availability:** Default on only after evidence and approval; kill switch remains.
9. **Retirement:** Stop new exposure, migrate/expire related data, remove dead paths after evidence.

No stage may use production personal data before the applicable release gate.

## Rollout gates

Before each expansion:

- governance version and approval remain active;
- required consent and notices are deployed;
- data provenance, quality, retention, deletion, and export tests pass;
- explanation and version manifests are complete;
- security and safety stop conditions are monitored;
- sample size and success criteria were defined before observation;
- cohort exposure is auditable without sensitive event content;
- rollback and user-effect remediation are tested.

## Kill switches and rollback

- Each high-risk module has an independent server-authoritative kill switch.
- Governance, security, privacy, and wellness-safety owners may invoke it.
- Killing a module stops new collection/processing/output and cancels or quarantines queued work where safe.
- User data rights and access to existing permitted records remain available.
- Re-enablement requires recorded cause resolution and approval.
- Client-cached flags cannot override a server or policy kill decision.

## Experiments

- Experiments require an approved hypothesis, duration, cohort, data purpose, minimization, risk assessment, and analysis plan.
- Experiments cannot weaken disclosures, consent, safety, explainability, privacy, accessibility, or security.
- Wellness values cannot be manipulated to provoke engagement.
- AI variants must each pass output validation and version tracking.
- Stopping rules cover harm signals, unexpected data collection, quality decline, and user confusion, not only technical errors.

## Audit and observability

Flag creation, approval, value change, cohort change, override, expiration, kill, and retirement create immutable events. General telemetry may record pseudonymous exposure references and outcome categories, never raw wellness data. Reconciliation detects modules running without an active eligible flag or flag snapshot.

## Open questions

- Flag service and signed configuration approach.
- Who may operate emergency kill switches outside business hours.
- Minimum cohort size for privacy-preserving analysis.
- Expiry defaults and removal deadlines for stale flags.

Related: [Versioning Framework](versioning-framework.md), [Event Sourcing Standard](event-sourcing.md), and [Privacy by Design Standard](../security/privacy-by-design.md).

## Document change log

| Version | Effective date | Classification | Change | Approved by |
| --- | --- | --- | --- | --- |
| 1.0.0 | 2026-08-05 | Initial normative release | Initial ratified ARCH-FLAG-001 artifact. The owner and approver were recorded as Andrew Penfold. | Andrew Penfold (historical record; corrected identity: Andrew Penistone) |
| 1.0.1 | 2026-08-06 | Administrative | Corrected the current owner and approver surname to Andrew Penistone. No normative requirements changed. | Andrew Penistone |
| 1.0.2 | 2026-08-06 | Administrative | Reconciled lifecycle status with ARCH-VER-001 and recorded ratification separately. No normative requirements changed. | Andrew Penistone |
| 1.1.0 | 2026-08-07 | Normative amendment | Added vendor, source-selection, override, fallback, and coverage module flags. | Andrew Penistone |
