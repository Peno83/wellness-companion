# Review Findings Register

- **Document Identifier:** GOV-FIND-001
- **Version:** 1.2.1
- **Owner:** Andrew Penistone
- **Approver:** Andrew Penistone
- **Effective Date:** 2026-08-06
- **Review Date:** 2026-11-05
- **Status:** active
- **Governance Approval:** Ratified
- **Supersedes:** 1.2.0

## Register rules

This is the authoritative disposition log for governance reviews. `Closed` requires linked evidence and human confirmation; AI advice alone cannot close a finding. `Accepted risk` requires an entry in the [Residual Risk Register](residual-risk-register.md). Open Critical findings block the affected phase or release.

## Phase 1 review

Source: [Phase 1 Independent Architecture Review](../reviews/2026-08-05-phase-1-independent-architecture-review.md).

| Finding | Source | Severity | Decision | Owner | Target Phase | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| P1-C-01 — Constitution lacks runtime authority and accountable humans | Phase 1 review C-01 | Critical | Remediate through registry and enforcement design | Andrew Penistone | Phase 1.2 / Phase 2A | In progress | [Governance Registry](governance-registry.md); runtime enforcement remains pre-implementation |
| P1-C-02 — Binding standards violate versioning requirements | Phase 1 review C-02 | Critical | Remediate metadata and immutable release controls | Andrew Penistone | Before Phase 2A | In progress | [Versioning Framework](../architecture/versioning-framework.md) |
| P1-C-03 — No per-data-element governance register | Phase 1 review C-03 | Critical | Create and approve before collecting data | Andrew Penistone | Before data ingestion | Open | No closure evidence yet |
| P1-C-04 — Adults-only boundary is unenforceable | Phase 1 review C-04 | Critical | Design enforceable age boundary | Andrew Penistone | Before authentication or users | Open | No closure evidence yet |
| P1-C-05 — Safety capability lacks assured input and governed rules | Phase 1 review C-05 | Critical | Define safety inputs, rules, versions, and failure behavior | Andrew Penistone | Before health features | Open | No closure evidence yet |
| P1-C-06 — Scoring methodology cannot be ratified | Phase 1 review C-06 | Critical | Redesign and independently validate methodology | Andrew Penistone | Before scoring | Open | No closure evidence yet |
| P1-C-07 — Universal fail-closed behavior conflicts with availability and user rights | Phase 1 review C-07 | Critical | Define control-plane availability and durable rights intake | Andrew Penistone | Before personal data | Open | No closure evidence yet |

## Phase 1.1 review

Source: High findings in the [Phase 1 Independent Architecture Review](../reviews/2026-08-05-phase-1-independent-architecture-review.md), treated as the Phase 1.1 architecture-hardening backlog.

| Finding | Source | Severity | Decision | Owner | Target Phase | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| P1.1-H-01 — Modular monolith cannot structurally guarantee non-bypass | Phase 1.1 review H-01 | High | Specify enforceable dependency, credential, and conformance boundaries | Andrew Penistone | Phase 2A design gate | Open | No closure evidence yet |
| P1.1-H-02 — Cryptographic erasure conflicts with managed encryption | Phase 1.1 review H-02 | High | Resolve key architecture and residual risk | Andrew Penistone | Before personal data | Open | No closure evidence yet |
| P1.1-H-03 — Deletion tombstone requirements conflict | Phase 1.1 review H-03 | High | Specify bounded, privacy-preserving mechanism | Andrew Penistone | Before personal data | Open | No closure evidence yet |
| P1.1-H-04 — Prompt-injection path through free text | Phase 1.1 review H-04 | High | Prohibit unapproved user text at AI boundary | Andrew Penistone | Before AI | In progress | [AI Use Policy](ai-use-policy.md) covers internal AI; runtime design remains open |
| P1.1-H-05 — Mandatory entities are absent from data model | Phase 1.1 review H-05 | High | Complete conceptual entity set | Andrew Penistone | Before database design | Open | No closure evidence yet |
| P1.1-H-06 — Missingness vocabularies diverge | Phase 1.1 review H-06 | High | Adopt one normative vocabulary and mappings | Andrew Penistone | Before data model implementation | Open | No closure evidence yet |
| P1.1-H-07 — Retention and quarantine expiry are undefined | Phase 1.1 review H-07 | High | Approve numeric schedules and disposition workflow | Andrew Penistone | Before personal data | Open | No closure evidence yet |
| P1.1-H-08 — User-rights and breach clocks are absent | Phase 1.1 review H-08 | High | Set provisional clocks pending legal review | Andrew Penistone | Before personal data | Open | No closure evidence yet |
| P1.1-H-09 — Version compatibility matrix is unbounded | Phase 1.1 review H-09 | High | Define family defaults and exception testing | Andrew Penistone | Before versioned calculations | Open | No closure evidence yet |
| P1.1-H-10 — Historical replay behavior is unresolved | Phase 1.1 review H-10 | High | Define executable retention and replay authorization | Andrew Penistone | Before event-store selection | Open | No closure evidence yet |
| P1.1-H-11 — No volume, growth, or latency model | Phase 1.1 review H-11 | High | Produce volumetric and latency budgets | Andrew Penistone | Before infrastructure selection | Open | No closure evidence yet |
| P1.1-H-12 — Tamper-evident audit has no mechanism | Phase 1.1 review H-12 | High | Select integrity and anchoring mechanism | Andrew Penistone | Before audit implementation | Open | No closure evidence yet |
| P1.1-H-13 — Safety interruption has no explainability contract | Phase 1.1 review H-13 | High | Define the explanation, provenance, missingness, and version contract for crisis/safety interruption output | Andrew Penistone | Before health features | Open | No closure evidence yet |
| P1.1-H-14 — Client/device security design is absent | Phase 1.1 review H-14 | High | Add client trust boundary and controls | Andrew Penistone | Before frontend/mobile work | Open | No closure evidence yet |
| P1.1-H-15 — Documents occupy conflicting authority tiers | Phase 1.1 review H-15 | High | Assign one explicit authority tier per document | Andrew Penistone | Before Phase 2A | Open | No closure evidence yet |
| P1.1-H-16 — Architecture diagram bypasses output validation | Phase 1.1 review H-16 | High | Correct diagram and invariant | Andrew Penistone | Before implementation | Open | No closure evidence yet |
| P1.1-H-17 — Requirements traceability artifact is absent | Phase 1.1 review H-17 | High | Create requirement-to-control/test matrix | Andrew Penistone | Before Phase 2A backlog | Open | No closure evidence yet |
| P1.1-H-18 — Consent withdrawal consequences are undefined | Phase 1.1 review H-18 | High | Define derived-data disposition per purpose | Andrew Penistone | Before personal data | Open | No closure evidence yet |
| P1.1-H-19 — Structured Facts is undefined and confidence overloaded | Phase 1.1 review H-19 | High | Create glossary and structured-facts contract | Andrew Penistone | Before AI or rendering | Open | No closure evidence yet |
| P1.1-H-20 — No minimum viable small-team governance | Phase 1.1 review H-20 | High | Record interim risk; retain independent-human gate | Andrew Penistone | Before G3 release | Accepted risk | [Residual risks R-001–R-004](residual-risk-register.md) |
| P1.1-H-21 — Signed policy bundles lack a root of trust | Phase 1.1 review H-21 | High | Specify key custody, bootstrap, rotation, and revocation | Andrew Penistone | Before policy-bundle implementation | Open | No closure evidence yet |
| P1.1-H-22 — No operator/developer AI-use policy | Phase 1.1 review H-22 | High | Establish internal AI controls | Andrew Penistone | Phase 1.3 | Closed | [AI Use Policy](ai-use-policy.md) |
| P1.1-H-23 — Baseline statistics degenerate on ordinal inputs | Phase 1.1 review H-23 | High | Redesign and validate ordinal method | Andrew Penistone | Before scoring | Open | No closure evidence yet |
| P1.1-H-24 — Utility direction and safe ranges are unspecified | Phase 1.1 review H-24 | High | Publish curves, bands, and adversarial cases | Andrew Penistone | Before scoring | Open | No closure evidence yet |
| P1.1-H-25 — Free text is modeled as a measurement | Phase 1.1 review H-25 | High | Separate notes from measurements | Andrew Penistone | Before data model implementation | Open | No closure evidence yet |
| P1.1-H-26 — Threat model lacks ratings and owners | Phase 1.1 review H-26 | High | Add threat ratings, owners, and residual risks | Andrew Penistone | Before security gate | Open | No closure evidence yet |

The source review's Medium and Low findings remain governed by the source and must be migrated here before their stated closure gates.

## Phase 1.2 review

Source: [Phase 1.2 Governance Gate Review](../reviews/2026-08-05-phase-1.2-gate-review.md).

| Finding | Source | Severity | Decision | Owner | Target Phase | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| P1.2-C-01 — AI has a review role without an AI-use policy or human review rule | Phase 1.2 review C2A-01 | Critical | Establish policy and keep AI advisory | Andrew Penistone | Phase 1.3 | Closed | [AI Use Policy](ai-use-policy.md) |
| P1.2-C-02 — Separation of duties is unsatisfied and unrecorded | Phase 1.2 review C2A-02 | Critical | Record time-bounded risk; retain G3 block | Andrew Penistone | Phase 1.3 / before G3 | Accepted risk | [Residual Risk Register](residual-risk-register.md) |
| P1.2-C-03 — Prior review findings have no disposition | Phase 1.2 review C2A-03 | Critical | Register all Critical and High findings | Andrew Penistone | Phase 1.3 | Closed | This register |
| P1.2-H-01 — CI skeleton is nonfunctional | Phase 1.2 review H-01 | High | Configure and enable documentation-only quality checks, then require passing remote-run evidence | Andrew Penistone | Phase 2A.0.1 remote validation | Open | The local Markdown-only CSpell check passed, but the repository-wide remote spelling job failed on [run 31088012098](https://github.com/Peno83/wellness-companion/actions/runs/31088012098); closure evidence was insufficient. Phase 2A.0.1 repository-wide remediation passes locally and awaits a new successful remote run URL. Do not close without that evidence. |
| P1.2-H-02 — Metadata is incomplete and status vocabulary conflicts | Phase 1.2 review H-02 | High | Normalize metadata now; define canonical content digests before executable policy bundles | Andrew Penistone | Phase 2A.1 policy-bundle milestone | Open | Lifecycle statuses and governed-document metadata corrected in Phase 2A.0. Digest remains open because no reproducible canonicalisation method exists; see [Versioning Framework](../architecture/versioning-framework.md#content-digest-canonicalisation-milestone). |
| P1.2-H-03 — Ratified documents depend on unratified documents | Phase 1.2 review H-03 | High | Version all dependencies and retain draft gates until each is approved | Andrew Penistone | Before implementing a component dependent on a draft artifact | Open | Seven governed documents now have identifiers and versions. Product requirements, data model, scoring method, ADR log, and roadmap remain explicitly draft and cannot authorise implementation. |
| P1.2-H-04 — CODEOWNERS and approval process are not operational | Phase 1.2 review H-04 | High | Activate protected review with eligible human reviewer | Andrew Penistone | Before protected branch use | Open | No closure evidence yet |
| P1.2-H-05 — Operational governance roles remain unassigned | Phase 1.2 review H-05 | High | Assign or explicitly defer roles with gates | Andrew Penistone | Before affected implementation | Open | No closure evidence yet |

### Phase 1.2 Medium and Low findings

| Finding | Source | Severity | Decision | Rationale | Owner | Target Phase | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P1.2-M-01 — Commits are unsigned | Phase 1.2 review M-01 | Medium | Remediate | Signed history is required for a stronger governance trust root. | Andrew Penistone | Before governance baseline tag | Open | Signing is not configured |
| P1.2-M-02 — Git author identity is placeholder text | Phase 1.2 review M-02 | Medium | Remediate | Repository attribution must identify the accountable human. | Andrew Penistone | Phase 1.4 | Closed | Repository-local identity is configured for Andrew Penistone; commit `1694ea9` records it. |
| P1.2-M-03 — Identity signals are not bound | Phase 1.2 review M-03 | Medium | Remediate | Registry, Git, email, and hosting identity need an auditable association. | Andrew Penistone | Phase 1.4 | Closed | Registry identity, repository-local Git identity, commit `1694ea9`, and pushed tag `governance-v1.1.0` provide the binding evidence. |
| P1.2-M-04 — No tags anchor ratified versions | Phase 1.2 review M-04 | Medium | Remediate | A tag supplies a durable release reference after a signed commit exists. | Andrew Penistone | Phase 1.4 | Closed | Annotated tag `governance-v1.1.0` exists locally and on origin. It is not cryptographically signed; signing risk remains P1.2-M-01. |
| P1.2-M-05 — Standard repository documents are missing | Phase 1.2 review M-05 | Medium | Defer | SECURITY, CONTRIBUTING, LICENSE, and CHANGELOG are outside this repair's explicit creation list. | Andrew Penistone | Phase 2A repository foundation | Open | No closure evidence yet |
| P1.2-M-06 — Empty duplicate top-level directories persist | Phase 1.2 review M-06 | Medium | Defer | Empty untracked directories do not affect the governed record but create local ambiguity. | Andrew Penistone | Repository cleanup | Open | No closure evidence yet |
| P1.2-M-07 — Constitution omitted the Governance Registry | Phase 1.2 review M-07 | Medium | Remediate | The authority index should identify its controlling registry. | Andrew Penistone | Phase 1.4 | Closed | [Constitution related binding standards](governance-constitution.md#related-binding-standards) |
| P1.2-M-08 — System and security documents have ambiguous authority tiers | Phase 1.2 review M-08 | Medium | Remediate | A document cannot be both a binding standard and a proposed Phase 1 artifact. | Andrew Penistone | Before Phase 2A | Open | Tracked as P1.1-H-15 |
| P1.2-M-09 — Phase 1.2 exit gate was not fully met | Phase 1.2 review M-09 | Medium | Accept as constrained deferral | Repository prerequisites were delivered, while health/data-path gates remain blocked and tracked. | Andrew Penistone | Before affected Phase 2 work | Accepted risk | [Review Findings Register](review-findings-register.md) open data-path findings |
| P1.2-L-01 — Checkout action used a mutable tag | Phase 1.2 review L-01 | Low | Remediate | Mutable action tags weaken workflow reproducibility. | Andrew Penistone | Phase 1.4 | In progress | SHA-pinned workflow prepared; remote run pending |
| P1.2-L-02 — Ignore rules do not cover all tool state | Phase 1.2 review L-02 | Low | Defer | Tooling is not yet selected and broad ignores could hide evidence. | Andrew Penistone | Phase 2A tooling setup | Open | No closure evidence yet |
| P1.2-L-03 — Approval history does not link review evidence | Phase 1.2 review L-03 | Low | Remediate | Review evidence must be directly discoverable. | Andrew Penistone | Phase 1.4 | Closed | [Governance Registry related documents](governance-registry.md#related-documents) links all three review records |
| P1.2-L-04 — Workflow name described a future state | Phase 1.2 review L-04 | Low | Remediate | Control names should describe their current function. | Andrew Penistone | Phase 1.3 | Closed | [Documentation quality workflow](../../.github/workflows/documentation-quality.yml) |

## Phase 1.3 review

Source: [Phase 1.3 Gate Review](../reviews/2026-08-06-phase-1.3-gate-review.md).

| Identifier | Source | Severity | Description | Decision | Rationale | Owner | Target Phase | Status | Closure evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P1.3-C-01 | Phase 1.3 review C-01 | Critical | Constitution and ratified standards changed without version progression or preserved history | Remediate | Immutable governance records require explicit successor versions and correction notes. | Andrew Penistone | Phase 1.4 | Closed | [Constitution Amendment 1.1.0](amendments/constitution-1.1.0.md), successor versions, commit `1694ea9`, and tag `governance-v1.1.0` |
| P1.3-C-02 | Phase 1.3 review C-02 | Critical | Phase 1.3 governance layer is uncommitted | Remediate | Uncommitted artifacts are not durable governance evidence. | Andrew Penistone | Phase 1.4 | Closed | Commit `1694ea9` exists on pushed `main`; annotated tag `governance-v1.1.0` is pushed. |
| P1.3-H-01 | Phase 1.3 review H-01 | High | Documentation CI lacks working configuration and passing-run evidence | Remediate | A configured workflow must pass before closure. | Andrew Penistone | Phase 2A.0 remote validation | Open | Markdownlint and CSpell pass locally after Phase 2A.0 remediation; remote GitHub Actions run URL pending. |
| P1.3-H-02 | Phase 1.3 review H-02 | High | Workflow lacks an all-path phase-boundary guard | Remediate | Non-document changes must trigger deterministic enforcement. | Andrew Penistone | Phase 1.4 | In progress | Boundary policy and workflow prepared; remote evidence pending |
| P1.3-H-03 | Phase 1.3 review H-03 | High | Phase 1.1 H-13 was omitted | Remediate | The safety interruption path needs an owned explainability disposition. | Andrew Penistone | Phase 1.4 | Closed | P1.1-H-13 row in this register |
| P1.3-H-04 | Phase 1.3 review H-04 | High | Thirteen Phase 1.2 Medium and Low findings were omitted | Remediate | The authoritative register must cover the complete reviewed set. | Andrew Penistone | Phase 1.4 | Closed | Phase 1.2 Medium and Low table in this register |
| P1.3-H-05 | Phase 1.3 review H-05 | High | GitHub Actions use mutable tags | Remediate | Immutable SHAs reduce workflow supply-chain drift. | Andrew Penistone | Phase 1.4 | Closed | All action references are full commit SHAs; Phase 1.4 review independently resolved them upstream. |
| P1.3-H-06 | Phase 1.3 review H-06 | High | AI provider assessment, interaction records, and prompt templates are incomplete | Remediate before expanded AI use | The AI policy cannot be considered fully operational without its required evidence. | Andrew Penistone | Before further governed AI use | Open | No closure evidence yet |
| P1.3-H-07 | Phase 1.3 review H-07 | High | Four Phase 1.2 High findings remain open | Defer only to their recorded gates | Their controls affect Phase 2A and cannot be closed by documentation assertion. | Andrew Penistone | Before affected Phase 2A work | Open | P1.2-H-02 through P1.2-H-05 remain open |

### Phase 1.3 Medium and Low findings

| Identifier | Source | Severity | Description | Decision | Owner | Target Phase | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P1.3-M-01 | Phase 1.3 review M-01 | Medium | Residual risks lack severity, likelihood, and constitutional-clause links | Remediate | Andrew Penistone | Before next residual-risk review | Open | No closure evidence yet |
| P1.3-M-02 | Phase 1.3 review M-02 | Medium | No residual-risk row covers authorising Phase 2A with open findings | Record or explicitly reject acceptance | Andrew Penistone | Before broader Phase 2A authorisation | Open | No closure evidence yet |
| P1.3-M-03 | Phase 1.3 review M-03 | Medium | Git identity, signing, and version tags were incomplete | Remediate | Andrew Penistone | Governance release hardening | In progress | Identity, commit, push, and annotated tag complete; cryptographic signing remains unconfigured |
| P1.3-M-04 | Phase 1.3 review M-04 | Medium | Phase 1 Medium and Low findings remain outside this register | Migrate before their closure gates | Andrew Penistone | Before Phase 3 | Open | Source review remains authoritative pending migration |
| P1.3-M-05 | Phase 1.3 review M-05 | Medium | Governance upkeep exceeds solo-founder capacity | Monitor and consolidate | Andrew Penistone | Quarterly review | Open | No closure evidence yet |
| P1.3-M-06 | Phase 1.3 review M-06 | Medium | SECURITY, CONTRIBUTING, LICENSE, and CHANGELOG are missing | Defer | Andrew Penistone | Phase 2A repository foundation | Open | No closure evidence yet |
| P1.3-M-07 | Phase 1.3 review M-07 | Medium | Dependabot was absent | Remediate | Andrew Penistone | Phase 1.4 | Closed | [.github/dependabot.yml](../../.github/dependabot.yml) manages GitHub Actions only |
| P1.3-M-08 | Phase 1.3 review M-08 | Medium | New governance version families were absent | Remediate | Andrew Penistone | Phase 1.4 | Closed | [Versioning Framework](../architecture/versioning-framework.md#independently-versioned-authorities) includes all three families |
| P1.3-M-09 | Phase 1.3 review M-09 | Medium | Ratified was used as a lifecycle status | Remediate | Andrew Penistone | Phase 2A.0 | Closed | Governed artifacts now use `active` or `draft`; governance approval is recorded separately |
| P1.3-L-01 | Phase 1.3 review L-01 | Low | Replacement of future-ci lacked a change record | Remediate | Andrew Penistone | Phase 1.4 | Closed | [Repository control history](../README.md#repository-control-history) records supersession |
| P1.3-L-02 | Phase 1.3 review L-02 | Low | Registry omitted Phase 1.3 artifact approvals | Remediate | Andrew Penistone | Phase 1.4 | Closed | [Governance Registry approval history](governance-registry.md#approval-history) |
| P1.3-L-03 | Phase 1.3 review L-03 | Low | Offline link checking does not validate external URLs | Retain deterministic local checks and schedule external validation separately | Andrew Penistone | Before public release | Open | External URL validation is not yet implemented |
| P1.3-L-04 | Phase 1.3 review L-04 | Low | Empty duplicate top-level directories persist | Remove when repository cleanup is authorised | Andrew Penistone | Repository cleanup | Open | No closure evidence yet |

## Phase 1.4 review

Source: [Phase 1.4 Gate Review](../reviews/2026-08-06-phase-1.4-gate-review.md).

| Identifier | Source | Severity | Description | Decision | Owner | Target Phase | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P1.4-C-01 | Phase 1.4 review C-01 | Critical | Phase 1.3 and 1.4 records were uncommitted with placeholder identity and no tag | Remediate | Andrew Penistone | Phase 1.4 | Closed | Commit `1694ea9`, pushed `main`, repository-local identity, and pushed annotated tag `governance-v1.1.0`; tag remains unsigned |
| P1.4-H-01 | Phase 1.4 review H-01 | High | Markdownlint and CSpell failed and evidence was inaccurate | Remediate locally; require remote evidence | Andrew Penistone | Phase 2A.0 remote validation | Open | Phase 2A.0 local runs pass with zero issues; GitHub Actions run URL pending |
| P1.4-H-02 | Phase 1.4 review H-02 | High | Arbitrary executable workflows bypassed the phase boundary | Enforce exact workflow allowlist and content policy | Andrew Penistone | Phase 2A.0 | Closed | `Test-PhaseBoundary.ps1` rejects `evil-build.yml`; `Test-WorkflowPolicy.ps1` validates the sole approved workflow and its negative fixture |
| P1.4-H-03 | Phase 1.4 review H-03 | High | Metadata, status vocabulary, digests, and draft dependencies remained inconsistent | Remediate what is reproducible and retarget unresolved gates | Andrew Penistone | Phase 2A.1 and before affected implementation | In progress | Statuses and seven document metadata blocks corrected; digest canonicalisation and draft approvals remain open under P1.2-H-02/H-03 |
| P1.4-M-01 | Phase 1.4 review M-01 | Medium | Secret scanner missed material credential formats and lacked tests | Remediate | Andrew Penistone | Phase 2A.0 | Closed | Deterministic self-test covers 15 secret fixtures and five safe fixtures; repository scan passes with redacted reporting |
| P1.4-M-02 | Phase 1.4 review M-02 | Medium | CSpell language, dictionary, and local/remote scope were misconfigured | Remediate | Andrew Penistone | Phase 2A.0.1 remote validation | In progress | Reopened: local Markdown-only CSpell passed, but remote repository-wide spelling failed on [run 31088012098](https://github.com/Peno83/wellness-companion/actions/runs/31088012098), so closure evidence was insufficient. Repository-wide remediation passes locally; remediated and awaiting successful remote evidence. |
| P1.4-M-03 | Phase 1.4 review M-03 | Medium | Registry effective date conflicted with Constitution 1.1.0 | Remediate | Andrew Penistone | Phase 2A.0 | Closed | Current registration now records effective date 2026-08-06 |
| P1.4-M-04 | Phase 1.4 review M-04 | Medium | Phase 1.3 Medium and Low findings were unregistered | Remediate | Andrew Penistone | Phase 2A.0 | Closed | Phase 1.3 Medium and Low table in this register |
| P1.4-M-05 | Phase 1.4 review M-05 | Medium | Guard rejected legitimate Markdown under schema and migrations paths | Remediate | Andrew Penistone | Phase 2A.0 | Closed | Boundary self-test permits `docs/schema/overview.md` and `docs/migrations.md` |
| P1.4-M-06 | Phase 1.4 review M-06 | Medium | Guard diagnostics stopped after the first finding | Remediate | Andrew Penistone | Phase 2A.0 | Closed | Both guards use non-terminating redacted error reporting before explicit failure |
| P1.4-L-01 | Phase 1.4 review L-01 | Low | Phase 1 Medium and Low findings remain outside the register | Migrate before their closure gates | Andrew Penistone | Before Phase 3 | Open | Source review remains authoritative pending migration |
| P1.4-L-02 | Phase 1.4 review L-02 | Low | Actual Lychee execution was unverified | Run pinned checker | Andrew Penistone | Phase 2A.0 | Closed | Lychee 0.24.2 validated 190 links with zero errors using `.lychee.toml` |
| P1.4-L-03 | Phase 1.4 review L-03 | Low | Empty duplicate top-level directories persist | Defer | Andrew Penistone | Repository cleanup | Open | No closure evidence yet |
| P1.4-L-04 | Phase 1.4 review L-04 | Low | Boundary tests omitted workflows and case variants | Remediate | Andrew Penistone | Phase 2A.0 | Closed | Self-tests cover approved and evil workflows, case variants, and documentation false-positive paths |

## Disposition rationale supplement for Critical and High findings

The tables above contain the source review and source identifier in the `Source` field, except the Phase 1.3 table where the section source applies to every row. The identifier precedes each earlier description. The following rationale rules apply to every Critical and High disposition:

| Finding group | Rationale |
| --- | --- |
| P1-C-01 and P1-C-02 | Governance authority and immutable version evidence must exist before enforcement can be trusted. |
| P1-C-03 through P1-C-07 | These findings govern personal data, age boundary, safety, scoring, and availability; they remain open until objective design and review evidence exists. |
| P1.1-H-01 through P1.1-H-26 | Each decision follows the source review's stated corrective action. Open status is retained because no implementation, validation, or independent closure evidence exists, except where an explicit register or policy supplies objective evidence. |
| P1.2-C-01 through P1.2-C-03 | Phase 1.3 supplied the required policy, risk acceptance, and register; closure is limited to the exact original defect and does not close follow-on findings. |
| P1.2-H-01 through P1.2-H-05 | Repository controls require operational or remote evidence. Documentation alone does not justify closure. |
| P1.3-C-01 through P1.3-H-07 | Decisions follow the Phase 1.3 gate review; only omissions corrected directly in this register are closed before commit and workflow evidence exists. |
| P1.4-C-01 through P1.4-L-04 | Decisions use the completed human Git actions and Phase 2A.0 executable validation; remote-workflow evidence remains explicitly open. |

## Document change log

| Version | Effective date | Change | Approved by |
| --- | --- | --- | --- |
| 1.0.0 | 2026-08-05 | Initial register covering Phase 1, Phase 1.1, and Phase 1.2 Critical and High findings. | Andrew Penistone |
| 1.1.0 | 2026-08-06 | Added P1.1-H-13, Phase 1.2 Medium/Low findings, and Phase 1.3 findings; reopened P1.2-H-01 pending passing-run evidence; added explicit rationale traceability. | Andrew Penistone |
| 1.2.0 | 2026-08-06 | Corrected CI evidence, added Phase 1.3 Medium/Low and Phase 1.4 findings, recorded completed human Git actions, normalised lifecycle metadata, and retargeted digest and draft-dependency work without false closure. | Andrew Penistone |
| 1.2.1 | 2026-08-06 | Reopened P1.4-M-02 after remote spelling failure, aligned CSpell evidence with repository-wide scope, and retained P1.2-H-01 pending a successful remote run. | Andrew Penistone |

## Maintenance

The Governance Owner updates this register after every formal review and at least quarterly. Decisions must be `remediate`, `accept`, `defer`, `reject`, or `supersede`, expressed in plain language above. Status must be `Open`, `In progress`, `Closed`, `Accepted risk`, or `Superseded`. Evidence must be durable and directly reviewable.
