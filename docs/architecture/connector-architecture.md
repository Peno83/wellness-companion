# Connector Architecture

- **Document Identifier:** ARCH-CONN-001
- **Version:** 0.1.0
- **Owner:** Engineering Owner (unassigned)
- **Approver:** Not applicable while draft
- **Effective Date:** Not applicable while draft
- **Review Date:** Before implementing any connector
- **Status:** draft
- **Governance Approval:** Pending human review
- **Scope:** Vendor-neutral connector contracts; no connector implementation or vendor access is authorised

## Purpose and product boundary

Wellness Companion complements the health platforms a person already uses. It does not replace, clone, or compete directly with their specialist device applications.

> Connect the health platforms you already use. Fill the gaps between them. Understand your complete wellness picture without replacing any device or app.

Each vendor remains authoritative for its proprietary scores and experiences. Permitted vendor scores may be imported and displayed with attribution, but the platform must not reverse-engineer or imitate WHOOP Recovery, WHOOP Strain, WHOOP Sleep Performance, Garmin Body Battery, Fitbit Daily Readiness, Oura Readiness, Hume scores, Samsung health scores, or Apple health classifications.

## Connector classes

| Class | Planned examples | Boundary |
| --- | --- | --- |
| Direct Cloud API | WHOOP, Fitbit, Garmin, Oura, future approved vendors | Available only where an authorised API and commercial use permit it |
| Operating-System Health Repository | Apple HealthKit, Android Health Connect | Repository transports records and is not automatically the originating device |
| Platform-Specific SDK | Samsung Health Data SDK, future manufacturer SDKs | Requires platform-specific privacy, security, and lifecycle review |
| Import and Manual Fallback | CSV, JSON, file export, manual entry, scheduled import, approved partner feeds | Format validation, provenance, consent, and deletion remain mandatory |

No roadmap entry may imply that every third-party application exposes an API.

## Standard connector contract

Every connector must expose versioned operations or capabilities for:

- authorisation and least-privilege consent scopes;
- connection status and data capabilities;
- synchronisation, pagination, and webhooks where available;
- rate-limit state, retry policy, and error handling;
- revocation, per-source deletion, and disconnection;
- complete provenance and source-priority inputs;
- data-quality and coverage reporting;
- vendor terms, attribution, and branding requirements.

Read-only is the mandatory default. A write scope requires a separate approved purpose, threat model, user confirmation, vendor permission, and governance decision.

## Governed connector flow

```text
Vendor or repository
        |
        v
Connector boundary -> consent and scope gate -> raw source event
        |                                         |
        v                                         v
status/error audit                     validation and normalisation
                                                  |
                                                  v
                                      reconciliation and coverage
                                                  |
                                                  v
                                      governed canonical decision
```

Governance applies at approval, consent, scope request, ingestion, validation, normalisation, conflict resolution, analytics, AI use, export, deletion, and disconnection. A missing decision fails closed.

## Planned platforms

Planned support includes WHOOP, Apple Health, Android Health Connect, Samsung Health, Hume Health, Fitbit, Garmin, and Oura. Planning is not a claim of technical or commercial availability.

Hume Phase 1 integration must use Apple Health or a supported Android health repository where Hume-originated data is available. No public Hume API is assumed. Direct Hume access remains an investigation item.

## Security and privacy requirements

- Never log credentials, access tokens, refresh tokens, or raw sensitive payloads.
- Encrypt tokens with separated keys and restrict use to the relevant connector worker.
- Record consent purpose, scope, vendor, connector version, and revocation state.
- Support per-source export, deletion, revocation, and audit reconciliation.
- Preserve originating application and device through transported records.
- Refer health concerns to a qualified clinician; connectors cannot enable diagnosis, treatment, medication recommendations, medical-risk prediction, or causal medical claims.

## Failure rules

Rate limits, expired consent, revoked access, unsupported capabilities, schema drift, and vendor outages produce explicit connection or synchronisation states. They never become zero measurements. Partial synchronisation is labelled, resumable, and idempotent. Repeated failures cannot silently demote provenance or activate a different connector.

## Related standards

- [Source Reconciliation Standard](source-reconciliation-standard.md)
- [Capability Coverage Model](capability-coverage-model.md)
- [Source Provenance Standard](source-provenance-standard.md)
- [Vendor Integration Roadmap](../requirements/vendor-integration-roadmap.md)
- [Metric Source Selection Engine](metric-source-selection-engine.md)
