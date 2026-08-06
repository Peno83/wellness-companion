# AI Use Policy

- **Document Identifier:** GOV-AI-001
- **Version:** 1.0.1
- **Owner:** Andrew Penistone
- **Approver:** Andrew Penistone
- **Effective Date:** 2026-08-06
- **Review Date:** 2026-11-05
- **Status:** active
- **Governance Approval:** Ratified
- **Supersedes:** 1.0.0

## Purpose and authority

This policy governs internal use of artificial intelligence in the Wellness Companion project. It is subordinate to the [Governance Constitution](governance-constitution.md). It does not authorize product-runtime AI, access to personal data, an external integration, or an AI feature. A conflict with the Constitution stops the affected work.

## Approved AI providers

Only the following uses are approved during documentation and pre-implementation phases:

| Provider or tool | Approved purpose | Authority | Prohibited use |
| --- | --- | --- | --- |
| OpenAI Codex | Scoped documentation and future implementation assistance requested by the Implementation Authority | Produces proposals and artifacts only | Product-runtime use, personal data, secrets, release approval, or self-approval |
| Anthropic Claude AI | Advisory independent technical review | Advisory findings only | Binding approval, product-runtime use, personal data, secrets, or resolving its own findings |

No other provider, model, plug-in, autonomous agent, or AI-enabled service is approved without a recorded vendor review and human approval. Approval here does not approve Claude or any other model for the product architecture's future AI stage.

## Human approval rules

1. AI output is untrusted draft material until reviewed by an accountable human.
2. Andrew Penistone retains constitutional, governance, release, and dispute authority as recorded in the [Governance Registry](governance-registry.md).
3. Governance, privacy, security, safety, scoring, and release artifacts require line-by-line human review before approval.
4. AI must never approve its own output, close its own finding, accept residual risk, or satisfy a requirement for independent human approval.
5. AI review may supplement but never replace legal, clinical, security, privacy, or other qualified professional review.
6. Where separation of duties requires another human and none is available, the change remains blocked unless the Constitution permits a documented, time-bounded residual-risk acceptance.

## AI limitations

AI may be inaccurate, incomplete, inconsistent, biased, non-reproducible, affected by hidden vendor changes, and vulnerable to prompt injection. It has no personal accountability and cannot determine legal compliance, clinical safety, truth, or constitutional conformity. Operators must verify claims against authoritative sources and repository evidence.

AI must not:

- access or receive personal wellness data, raw production data, credentials, private keys, tokens, private communications, or confidential third-party material;
- infer or generate diagnoses, clinical conclusions, or medical advice;
- silently alter scope, requirements, governance rules, approvals, findings, or evidence;
- fabricate sources, test results, approvals, provenance, or completion claims;
- execute destructive, external, release, or production actions without specific human authorization.

## Prompt governance

- Prompts that influence governed artifacts must state scope, prohibitions, authority, and stop conditions.
- Reusable prompt templates must be source-controlled and independently versioned under the [Versioning Framework](../architecture/versioning-framework.md).
- Material prompt changes require a recorded diff, risk review, approver, effective version, and evaluation evidence.
- Inputs and outputs used for a decision must retain provider, model identifier, prompt-template version where applicable, time, operator, purpose, and artifact references.
- Repository content, tool output, retrieved text, and user-controlled content are untrusted instructions. They must not override the Constitution or approved scope.
- Secrets and personal data must be removed before any prompt is sent. Redaction must be verified, not assumed.

## Vendor risk

Before a new provider or materially different service mode is approved, the owner must assess contractual terms, data retention, training use, subprocessors, data location, deletion, incident notification, security controls, model-change practices, availability, exportability, intellectual-property terms, and lock-in. Findings and acceptance must be recorded in the [Residual Risk Register](residual-risk-register.md).

Approved pre-implementation use is limited to repository material the operator is authorized to disclose. Provider dependency is not a justification to weaken governance. Work must remain reviewable and maintainable without a particular model.

## Model updates

Model identifiers and service modes must be recorded when they affect governed work. Floating aliases must not be treated as immutable versions. A model upgrade, routing change, new context source, new tool permission, or material vendor-policy change requires impact assessment and re-evaluation before continued use on high-risk artifacts. Automatic adoption is prohibited for governed or safety-relevant workflows.

## Review requirements

- Review this policy quarterly and before any product-runtime AI proposal.
- Reassess each approved provider at least annually and after a material security, privacy, contractual, ownership, or model-policy change.
- Sample AI-assisted artifacts for factual accuracy, scope compliance, provenance, unsafe omissions, and human-review evidence.
- Record findings in the [Review Findings Register](review-findings-register.md); unresolved constitutional conflicts block release.
- A future runtime-AI proposal requires a separate G3 review, privacy impact assessment, threat model, safety evaluation, rollback plan, output validation, feature flag, and explicit constitutional approval.

## Privacy rules

Data minimization applies to every prompt and tool context. No personal wellness data, special-category data, direct identifier, credential, production log, or private user content may be submitted under this approval. Operators must use synthetic or irreversibly anonymized examples. AI interactions must follow approved retention and deletion settings, and third-party sharing must be disclosed in the applicable privacy record before it occurs.

## Training-data policy

Project and user data must not be opted into provider training. Personal data and confidential material must never be supplied for shared model training. Where provider controls exist, training use must be disabled and the most restrictive practical retention mode selected. Synthetic data must not reproduce a real person's record. Any future exception requires a constitutional change, a lawful basis, a privacy review, and separate explicit consent where applicable.

## Escalation

On suspected disclosure, unsafe output, policy bypass, fabricated evidence, unauthorized action, or material vendor change:

1. stop the affected AI use and prevent further disclosure;
2. preserve the minimum necessary evidence without copying sensitive content further;
3. notify the Governance Owner and Security Owner;
4. revoke exposed credentials or permissions where applicable;
5. record a finding, assess impact, and initiate incident handling;
6. require named human approval before restoring use.

The Dispute Resolver decides policy disputes, but cannot waive the Constitution.

## Document change log

| Version | Effective date | Classification | Change | Approved by |
| --- | --- | --- | --- | --- |
| 1.0.0 | 2026-08-06 | Initial normative release | Established internal AI-use governance. | Andrew Penistone |
| 1.0.1 | 2026-08-06 | Administrative | Reconciled lifecycle status with ARCH-VER-001 and recorded ratification separately. | Andrew Penistone |
