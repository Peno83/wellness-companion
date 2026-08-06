# Wellness Companion

Wellness Companion is a planned, non-diagnostic consumer wellness product. The repository is currently in **Phase 1.4: governance record integrity and repository-quality enforcement**. It contains governance documents and repository policy only: no production application code, integrations, databases, authentication, APIs, application dependencies, or frontend pages.

## Highest authority

The ratified [Governance Constitution](docs/governance/governance-constitution.md) is the highest governing document. The [Governance Registry](docs/governance/governance-registry.md) records the accountable authorities. No feature, architecture, implementation, AI system, operator, flag, or release may bypass them.

## Phase 1 review package

Start with the [documentation index](docs/README.md), then review the [Phase 1/1.1 package](docs/phase-1/README.md). The package covers product requirements, constitutional governance, architecture, provenance, quality, versioning, scoring, explainability, security, privacy, data, event sourcing, rollout controls, decisions, and roadmap.

No product connection to WHOOP, Claude, Apple Health, Health Connect, or any other external service is authorized in Phase 1.4. GitHub Actions enforces Markdown linting, spelling, local link integrity, the Phase 1 file boundary, and secret-pattern detection. It does not build or execute application code.
