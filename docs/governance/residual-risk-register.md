# Residual Risk Register

- **Document Identifier:** GOV-RISK-001
- **Version:** 1.0.1
- **Owner:** Andrew Penistone
- **Approver:** Andrew Penistone
- **Effective Date:** 2026-08-06
- **Review Date:** 2026-11-05
- **Status:** active
- **Governance Approval:** Ratified
- **Supersedes:** 1.0.0

## Purpose

This register records risks that remain after current controls. Acceptance is narrow, time-bounded, and does not waive the [Governance Constitution](governance-constitution.md). It authorizes documentation-stage work only unless a row explicitly states otherwise. An expired acceptance becomes open and blocks the affected activity.

## Accepted residual risks

| ID | Residual risk | Acceptance rationale | Compensating controls | Owner | Scope and expiry | Status |
| --- | --- | --- | --- | --- | --- | --- |
| R-001 | Single founder governance concentrates constitutional and governance decisions | The project is pre-implementation, has no users or personal data, and cannot yet sustain a multi-person governance body. Central accountability is clearer than fictitious independence at this stage. | Public, versioned decisions; advisory review; findings register; line-by-line human approval; quarterly review; G3 release remains blocked without required independent human review | Andrew Penistone | Documentation and low-risk foundation planning only; review 2026-11-05 | Accepted |
| R-002 | Single release authority creates key-person, availability, and self-approval risk | One named release authority is proportionate before any deployable application exists and prevents ambiguous approval. It is not sufficient for a high-risk or user-data release. | Protected review process to be activated; documented release evidence; no delegation by silence; no G3 release without separation of duties | Andrew Penistone | Pre-implementation documentation only; expires before external beta or 2026-11-05 | Accepted |
| R-003 | Single dispute resolver may resolve disputes in their own favor | A named resolver avoids unresolved authority during the founder stage, but is not independent. The risk is acceptable only while disputes cannot affect users or personal data. | Written decision and rationale; preserved dissent; external qualified human review for G3 disputes; Constitution cannot be waived | Andrew Penistone | No user-impacting or G3 dispute; review 2026-11-05 | Accepted |
| R-004 | AI reviewers can create false independence, correlated error, and unverifiable advice | AI review adds breadth and challenge, but is advisory and is not treated as human independence or approval evidence. | [AI Use Policy](ai-use-policy.md); named human accountability; source verification; AI cannot close its own findings; high-risk changes require qualified human review | Andrew Penistone | Advisory review of authorized repository material; review 2026-11-05 | Accepted |
| R-005 | AI-assisted implementation may introduce insecure, incorrect, or governance-bypassing artifacts | AI implementation assistance can aid delivery, but no implementation is authorized in Phase 1.3. Future use is accepted only as supervised drafting, never autonomous authority. | Explicit scope; human diff and test review; least-privilege tools; no secrets or personal data; architecture and CI enforcement required before implementation; AI cannot approve or release | Andrew Penistone | Documentation now; future implementation requires phase authorization and controls; review before Phase 2A | Accepted with gate |
| R-006 | AI vendor dependency creates privacy, availability, pricing, policy-change, model-change, and lock-in risk | Current use is limited to authorized repository material and the product has no runtime AI dependency. This limits impact while allowing advisory and drafting benefits. | Provider allowlist; minimal disclosure; no personal data; model/version recording; periodic vendor review; portable repository artifacts; ability to stop provider use | Andrew Penistone | Internal pre-implementation use only; review 2026-11-05 and on material vendor change | Accepted |

## Acceptance conditions

These acceptances do not authorize collection of personal data, health features, scoring, runtime AI, external APIs, production infrastructure, or a public release. R-001 through R-004 do not satisfy constitutional separation of duties for G2/G3 changes. Before the first user-data or high-risk release, the Governance Owner must obtain an eligible independent human reviewer or propose a constitutional change through the full approval process.

## Review and closure

The owner reviews each risk on its expiry date, on a material scope change, and before the target activity. Review may reduce, renew, transfer, or reject the risk. Renewal requires current evidence, a new rationale, a new expiry, and named human approval. Closed risks remain in immutable history with closure evidence.

## Document change log

| Version | Effective date | Classification | Change | Approved by |
| --- | --- | --- | --- | --- |
| 1.0.0 | 2026-08-06 | Initial normative release | Established the residual-risk register and initial acceptances. | Andrew Penistone |
| 1.0.1 | 2026-08-06 | Administrative | Reconciled lifecycle status with ARCH-VER-001 and recorded ratification separately. | Andrew Penistone |
