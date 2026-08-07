# Wellness Companion Documentation

- **Document Identifier:** DOC-IDX-001
- **Version:** 1.1.0
- **Owner:** Andrew Penistone
- **Approver:** Andrew Penistone
- **Effective Date:** 2026-08-07
- **Review Date:** 2026-11-05
- **Status:** active
- **Governance Approval:** Approved
- **Supersedes:** 1.0.1

**Current phase:** Phase 2A.1 synthetic platform foundation

## Authority order

1. [Governance Constitution](governance/governance-constitution.md) — ratified highest authority; no feature or implementation may violate it.
2. [Governance Registry](governance/governance-registry.md) — named authorities, approval history, review cadence, and change log.
3. Binding architecture and security standards — define how constitutional obligations must be met.
4. [Phase 1 product and technical documents](phase-1/README.md) — requirements, proposed methods, operational governance, decisions, and roadmap.

Subordinate documents cannot create exceptions to higher documents. A conflict blocks the affected work until human governance review resolves it.

## Governance controls

- [AI Use Policy](governance/ai-use-policy.md)
- [Review Findings Register](governance/review-findings-register.md)
- [Residual Risk Register](governance/residual-risk-register.md)
- [Phase 2A.1 Transition Evidence](governance/phase-2a.1-transition-evidence.md)

## Implemented foundation

- [Phase 2A.1 review package](phase-2a/README.md)
- [Foundation architecture](phase-2a/foundation-architecture.md)
- [Testing strategy](phase-2a/testing-strategy.md)
- [Developer setup](phase-2a/developer-setup.md)

## Architecture standards

- [Source Provenance Standard](architecture/source-provenance-standard.md)
- [Data Quality Framework](architecture/data-quality-framework.md)
- [Versioning Framework](architecture/versioning-framework.md)
- [Explainability Standard](architecture/explainability-standard.md)
- [Feature Flag Framework](architecture/feature-flags.md)
- [Event Sourcing Standard](architecture/event-sourcing.md)
- [System Architecture](phase-1/system-architecture.md)
- [Connector Architecture](architecture/connector-architecture.md)
- [Source Reconciliation Standard](architecture/source-reconciliation-standard.md)
- [Capability Coverage Model](architecture/capability-coverage-model.md)
- [Metric Source Selection Engine](architecture/metric-source-selection-engine.md)
- [Metric Source Policy Model](architecture/metric-source-policy-model.md)
- [Source Fallback Standard](architecture/source-fallback-standard.md)
- [Methodology Break Standard](architecture/methodology-break-standard.md)
- [Vendor Integration Roadmap](requirements/vendor-integration-roadmap.md)

## Architecture decisions

- [ADR-016: Markdown lint policy exceptions](decisions/ADR-016-markdown-lint-policy.md)
- [ADR-031: Synthetic platform foundation](decisions/ADR-031-synthetic-platform-foundation.md)

## Repository spelling policy

CSpell uses Option B: an explicit allowlist of governed text, documentation,
configuration, workflow, script, web-source, and TypeScript/JavaScript file
types. The canonical scope is the `files` list in [`.cspell.json`](../.cspell.json).
It includes PowerShell and YAML now and includes future application source types,
so Phase 2A source cannot be silently omitted. Git metadata, binary files,
generated output, dependencies, reports, caches, and temporary tooling
directories are excluded by the configuration.

Local and remote checks both invoke CSpell without a competing file glob. Run
the local check from the repository root with:

```powershell
npx.cmd --yes cspell@10.0.1 lint --config .cspell.json --no-progress
```

Dictionary additions are limited to reviewed product vocabulary, technical
terms, commands, platform names, file formats, PowerShell identifiers, and
intentional synthetic fixture values. Genuine spelling errors must be corrected
in their source files rather than added to the dictionary.

## Security and privacy

- [Privacy by Design Standard](security/privacy-by-design.md)
- [Security Design](phase-1/security-design.md)

## Phase boundary

Phase 2A.1 permits the enumerated synthetic platform shell and platform-control schema. Provider connections, real health data, authentication, AI, scoring, notifications, reports, payments, credentials, and product frontend pages remain prohibited. GitHub Actions runs documentation controls plus foundation lint, format, type, test, architecture, build, audit, and browser-smoke checks.

## Repository control history

- Phase 1.2 introduced `.github/workflows/future-ci.yml` as a disabled placeholder.
- Phase 1.3 superseded and removed that placeholder with `.github/workflows/documentation-quality.yml`.
- Phase 1.4 made the documentation workflow enforceable across all repository changes, added phase-boundary and secret-pattern checks, and pinned action dependencies to immutable commits.
- Phase 2A.0 restricts executable workflows to an exact allowlist, validates approved workflow content, expands secret detection, and makes all documentation checks pass locally.
- Phase 2A.1 transitions the allowlist to a synthetic application foundation and adds executable build and test enforcement without authorizing health features.
