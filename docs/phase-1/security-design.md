# Security design

- **Document Identifier:** SEC-DES-001
- **Version:** 1.0.2
- **Owner:** Andrew Penistone
- **Approver:** Andrew Penistone
- **Effective Date:** 2026-08-06
- **Review Date:** 2026-11-05
- **Status:** active
- **Governance Approval:** Ratified
- **Supersedes:** 1.0.0
- **Security objective:** Protect confidentiality, integrity, availability, user agency, and safety of wellness data throughout its lifecycle.

**Authority:** Subordinate to the [Governance Constitution](../governance/governance-constitution.md) and complemented by the [Privacy by Design Standard](../security/privacy-by-design.md). Governance denial and protected security controls cannot be bypassed by flags, AI, operators, or downstream services.

## Security assumptions

- Wellness observations, notes, scores, and recommendations are highly sensitive even if local law does not classify the product as healthcare.
- Clients, user-entered text, imported files, and future provider payloads are untrusted.
- A valid account session does not authorize every action or purpose.
- Administrators and developers are potential sources of accidental or malicious misuse.
- External APIs and software dependencies are outside the trust boundary.

## Assets

1. Authentication and recovery secrets.
2. Identity and contact data.
3. Raw wellness observations and free text.
4. Derived scores, profiles, inferences, and recommendations.
5. Consent, deletion, export, and correction state.
6. Scoring methods, safety policies, and approval records.
7. Encryption keys, service credentials, and signing keys.
8. Audit evidence and incident records.
9. Product availability and user trust.

## Threat actors

- Opportunistic internet attacker.
- Abusive or compromised account holder.
- Malicious or careless insider.
- Compromised dependency, build pipeline, or operator device.
- Future third-party processor or API behaving outside expectations.
- Automated scraper or denial-of-service actor.

## Key abuse cases and controls

| Threat | Impact | Preventive controls | Detection/recovery |
| --- | --- | --- | --- |
| Account takeover | Exposure or deletion of wellness history | Strong session controls, breached-password defense or passkeys, step-up verification for export/delete | Login anomaly alerts, session revocation, user notification |
| Broken object authorization | One user reads another user’s data | Server-derived subject scope, deny-by-default authorization, opaque IDs, ownership checks on every query | Cross-tenant authorization tests and audit alerts |
| Sensitive data in logs | Broad internal exposure | Structured allowlisted logging, payload redaction, no URLs with content | Automated secret/content scanning and retention purge |
| Injection through notes | Data theft or unsafe output | Length/type validation, parameterized queries, contextual output encoding, no dynamic execution | Security tests, WAF signals, error-rate alerts |
| Cross-site scripting | Session/data theft in web client | Framework escaping, strict Content Security Policy, sanitization for any rich text | Browser security reporting and regression tests |
| Cross-site request forgery | Unauthorized state changes | SameSite cookies, anti-CSRF tokens where needed, origin validation | Suspicious request telemetry |
| Malicious recommendation rule | User harm at scale | Signed/versioned rules, separation of duties, reviewed content allowlist, kill switch | Rule change audit, canary checks, complaint monitoring |
| Score tampering | Misleading decisions | Server-side computation, immutable method version, integrity constraints | Reproducibility checks and anomaly detection |
| Consent bypass | Unlawful or unexpected processing | Purpose-aware authorization on commands and jobs | Policy-denial metrics and lineage audits |
| Incomplete deletion | Continued exposure after request | Deletion manifest across stores, tombstone to prevent rehydration, backup expiry policy | Reconciliation jobs and completion evidence |
| Insider browsing | Privacy breach | Just-in-time role access, MFA, reason code, masked support tools, no standing production DB access | Tamper-evident audit and periodic review |
| Backup or export leak | Bulk disclosure | Separate encryption keys, private storage, short-lived download authorization, expiry | Access logs, object inventory reconciliation, revocation |
| Dependency/build compromise | Credential or data theft | Lockfiles, provenance, minimal dependencies, isolated CI, secretless builds, artifact signing | Dependency scanning, build attestations, rollback |
| Resource exhaustion | Unavailability/cost | Request and job quotas, size limits, bounded queries, backpressure | Capacity alerts, circuit breakers, degraded modes |
| Governance bypass | Prohibited processing or unsafe output | Mandatory Governance Engine at command, event, facts, flag, release, and output boundaries; deny precedence | Architecture conformance tests, audit reconciliation, stop-ship |
| Raw-data AI access | Bulk disclosure and ungoverned inference | No raw table/event/projection credentials or tools; minimized Structured Facts only | Invocation-schema audit, egress controls, boundary tests |
| Event replay after deletion | Deleted wellness history recreated | Payload erasure/stream removal, deletion marker, consent check on replay, projection cleanup | Restore and rehydration reconciliation |

## Identity, authentication, and sessions

- Select an identity architecture only after platform and jurisdiction decisions.
- Prefer phishing-resistant authentication such as passkeys when supported.
- Never store plaintext passwords; if passwords exist, use an approved memory-hard password hash and breached-password checks.
- Use short-lived authenticated sessions with secure, HTTP-only, SameSite cookies for web clients; rotate tokens after privilege changes.
- Require recent authentication for export, account deletion, recovery changes, and sensitive consent changes.
- Rate-limit authentication and recovery without revealing account existence.
- Encrypt recovery material and ensure support cannot bypass identity proofing casually.

## Authorization

Authorization is evaluated server-side using subject, resource, action, purpose, consent state, and policy version.

```text
permit = authenticated
      AND owns(resource)
      AND action_allowed(role)
      AND purpose_allowed(action)
      AND consent_active(required_purpose)
      AND policy_allows(context)
```

User ownership must be part of the database query, not a check performed only after retrieval. Privileged operations require stronger roles, time-bound access, and audit records. Internal services use workload identity and least-privilege database roles.

## Cryptography and secrets

- TLS 1.2 or later in transit, with modern configurations and TLS 1.3 preferred.
- Provider-managed encryption at rest for database, backups, and object storage.
- Separate key scopes for production and non-production; consider identity and wellness partitions separately.
- Secrets live in a managed secret store, never source control, client bundles, logs, or build artifacts.
- Document key rotation, revocation, backup restore, and compromised-key response.
- Use established cryptographic libraries; do not design custom algorithms.

Field-level encryption for notes should be evaluated after search, support, and threat requirements are clear. It improves database-compromise resistance but complicates indexing, key recovery, and deletion verification.

## Application and API controls

- Validate request schemas, types, ranges, units, timestamps, and maximum sizes.
- Reject unknown privileged fields; avoid mass assignment.
- Use parameterized database access and contextual output encoding.
- Set strict browser headers, including Content Security Policy, frame restrictions, MIME sniffing prevention, and a deliberate referrer policy.
- Rate-limit by account, device/session, and network signals with accessible recovery paths.
- Use idempotency keys for create, export, delete, and consent commands.
- Return non-sensitive errors; correlate detailed internal errors through random trace IDs.
- Do not put identifiers or wellness content in URLs.

## Free text and model safety

Free text is optional and high risk. The first implementation should store plain text only if product review confirms its value. Controls include length limits, output escaping, restricted search, no inclusion in analytics, and separate retention.

No external language model is connected in Phase 1.1. Any future model design requires a new threat model covering prompt injection, data exfiltration, model retention, provider terms, grounding, unsafe advice, evaluation, fallback, and user disclosure. Claude or another AI must never access raw tables, event streams, unrestricted projections, identifiers, credentials, or query tools. It may receive only minimized Structured Facts approved by the Governance Engine, and its output must pass the deterministic Output Validator.

## Data isolation and minimization

- Keep identity records logically separate from wellness records and join by internal subject ID.
- Use synthetic fixtures in development and testing.
- Do not clone production databases into lower environments.
- Mask content in support surfaces by default.
- Restrict analytics to allowlisted event names and coarse properties.
- Enforce retention with scheduled deletion and reconciliation, not policy text alone.

## Audit design

Audit events cover authentication changes, privileged reads, policy and scoring releases, consent changes, exports, deletion, recovery, and administrative actions. Each event contains actor, action, target reference, decision, time, request trace, and policy version. It excludes raw notes and metric values.

Audit storage is append-only to application roles, access-controlled separately, integrity-protected, time-synchronized, and retained under an approved schedule. High-risk audit gaps fail the operation closed.

## Secure delivery lifecycle

Before launch, the pipeline must include:

- reviewed requirements and threat-model diffs for material changes;
- protected branches and independent review;
- secret, dependency, static, and infrastructure scanning;
- locked dependencies and software bill of materials;
- unit, integration, authorization, migration, and abuse-case tests;
- signed or attestable release artifacts;
- isolated deployment identity with least privilege;
- tested rollback that does not corrupt schema or derived history;
- independent penetration test before handling real user wellness data.

Deployment admission must also reject releases without an approved governance version, complete calculation/version contracts, protected feature-flag configuration, and proof that no raw-data-to-AI or analytics-to-user route exists.

## Incident response and recovery

- Maintain contacts, escalation, evidence handling, containment, notification assessment, and user communication playbooks.
- Design a global recommendation kill switch and scoped rule disablement.
- Support session and credential revocation.
- Test encrypted backup restoration and deletion behavior.
- Preserve only necessary incident evidence and restrict its use.
- Conduct a blameless review with tracked corrective actions.

## Security acceptance gates

| Gate | Evidence required |
| --- | --- |
| Threat coverage | Reviewed threat model with owners and residual risks |
| Access control | Automated horizontal/vertical authorization tests; privileged access review |
| Privacy | Data inventory, purpose map, retention schedule, export/deletion test |
| Application | Scanning results, abuse-case tests, security headers, rate-limit test |
| Supply chain | Lockfiles, SBOM, artifact provenance, critical-vulnerability disposition |
| Resilience | Restore test, rollback test, dependency-failure behavior |
| Independent assurance | Penetration test and remediation disposition before production data |

## Residual risks requiring human acceptance

- A wellness product can still influence health behavior despite disclaimers.
- Free text increases the chance of collecting crisis, medical, and third-party information.
- Deletion from immutable backups is delayed until backup expiry.
- Small teams may combine duties; compensating review and audit controls are needed.
- Future external providers would expand the attack and privacy surface.

Related: [Governance Constitution](../governance/governance-constitution.md), [privacy by design](../security/privacy-by-design.md), [system architecture](system-architecture.md), and [data model](data-model.md).

## Document change log

| Version | Effective date | Classification | Change | Approved by |
| --- | --- | --- | --- | --- |
| 1.0.0 | 2026-08-05 | Initial normative release | Initial ratified SEC-DES-001 artifact. The owner and approver were recorded as Andrew Penfold. | Andrew Penfold (historical record; corrected identity: Andrew Penistone) |
| 1.0.1 | 2026-08-06 | Administrative | Corrected the current owner and approver surname to Andrew Penistone. No normative requirements changed. | Andrew Penistone |
| 1.0.2 | 2026-08-06 | Administrative | Reconciled lifecycle status with ARCH-VER-001 and recorded ratification separately. No normative requirements changed. | Andrew Penistone |
