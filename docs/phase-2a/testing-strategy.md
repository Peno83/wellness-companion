# Foundation Testing Strategy

- **Document Identifier:** TEST-2A1-001
- **Version:** 1.0.0
- **Owner:** Andrew Penistone
- **Approver:** Andrew Penistone
- **Effective Date:** 2026-08-07
- **Review Date:** 2026-11-05
- **Status:** active

Tests are layered so governance and scope failures are detected before release.

| Layer | Evidence |
| --- | --- |
| Static | ESLint, TypeScript, Prettier, error-severity dependency-boundary rules |
| Unit | Configuration, governance fail-closed behavior, flags, provenance, reconciliation, source selection |
| Integration | Dependency injection and module loading with synthetic adapters |
| Browser smoke | Built application status page and safe health response |
| Data | Prisma client generation and schema validation |
| Supply chain | Locked install, immutable workflow actions, dependency audit, Dependabot |
| Governance | Phase boundary, workflow policy, metadata, ADR uniqueness, secrets, spelling, links, Markdown |

Architecture attack tests execute dependency-cruiser separately against three
planted prohibited imports. Each test fails unless the relevant rule is named
and the process exits non-zero. Logger attack tests cover keyed, value-level,
nested, array, free-text, credential-URL, provider-token, private-key, and cloud
connection-string redaction while protecting ordinary URLs and prose.

Tests use deterministic synthetic values only. No test may require credentials,
external network access, or personal data. Browser installation is the only CI
setup step that downloads a runtime artifact after the locked dependency
install.
