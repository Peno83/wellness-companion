# Vendor Integration Roadmap

- **Document Identifier:** REQ-VIR-001
- **Version:** 0.1.0
- **Owner:** Product Owner (unassigned)
- **Approver:** Not applicable while draft
- **Effective Date:** Not applicable while draft
- **Review Date:** Before authorising any connector investigation or implementation
- **Status:** draft
- **Governance Approval:** Pending human review

## Direction

The roadmap prioritises a vendor-neutral integration and intelligence layer that complements existing applications. It does not promise vendor access and does not authorise implementation.

## Planned integration routes

| Platform | Preferred investigation route | Fallback or constraint |
| --- | --- | --- |
| WHOOP | Direct Cloud API | Preserve and attribute proprietary scores; never imitate them |
| Apple Health | Apple HealthKit repository | Treat transported origin separately from Apple |
| Android Health Connect | Operating-system repository | Capability varies by contributing application and permission |
| Samsung Health | Samsung Health Data SDK or Health Connect where supported | Requires manufacturer terms and device testing |
| Hume Health | Apple Health or supported Android repository | Do not assume a public Hume API |
| Fitbit | Direct Cloud API | Subject to approved scopes, rate limits, and terms |
| Garmin | Approved cloud/partner route | Do not promise access before commercial review |
| Oura | Direct Cloud API | Preserve proprietary score attribution |

## Investigation gates for every platform

Before implementation, document official access route, accessible metrics, consent scopes, rate limits, webhooks, history limits, export formats, update frequency, deletion and revocation behaviour, attribution, branding, commercial-use permissions, security posture, processor terms, regional availability, and provenance fidelity.

## Hume investigation task

Investigate official partner API availability, accessible metrics, export formats, commercial-use permissions, update frequency, deletion behaviour, and data provenance. Until approved evidence exists, Hume Phase 1 means repository-mediated records labelled, for example, `Hume via Apple Health`.

## Sequence

1. Ratify connector, provenance, reconciliation, coverage, and source-selection standards.
2. Define vendor-neutral contracts and synthetic conformance fixtures.
3. Complete legal, privacy, security, and commercial review per platform.
4. Pilot one read-only connector behind a default-off flag.
5. Validate provenance, revocation, deletion, rate limits, reconciliation, and user explanations.
6. Expand only through separate, evidence-based approvals.

## Explicit non-priorities

Do not prioritise proprietary score imitation, workout recording, GPS route tracking, device control, firmware management, community rankings, device marketplaces, or direct competition with vendor coaching features.
