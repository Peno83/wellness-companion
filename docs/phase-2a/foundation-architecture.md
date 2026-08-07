# Foundation Architecture

- **Document Identifier:** ARCH-2A1-001
- **Version:** 1.0.0
- **Owner:** Andrew Penistone
- **Approver:** Andrew Penistone
- **Effective Date:** 2026-08-07
- **Review Date:** 2026-11-05
- **Status:** active

## Implemented boundary

The foundation contains a Next.js application shell, safe health endpoint,
validated configuration, structured logging, typed errors, dependency
injection, module loading, governance and audit contracts, immutable event
contracts, repository contracts, feature flags, synthetic connectors, and a
deterministic metric-source-selection demonstration.

```text
UI and health route
        |
application composition and dependency injection
        |
governance decision ---- feature state (cannot override governance)
        |
domain contracts ---- synthetic adapters
        |
repository contracts ---- Prisma platform-control schema
```

Static dependency rules prohibit UI or connectors from reaching persistence,
AI from reaching persistence, source selection from reaching AI, governance
from depending on flags, and cyclic imports. Governance decisions fail closed
when a rule or version is absent.

Every protected dependency rule has error severity. Executable attack fixtures
plant AI-to-persistence, source-selection-to-AI, and
governance-to-feature-flags imports and require dependency-cruiser to return a
non-zero exit for each attack.

Runtime timestamps use an injected `Clock`. Production defaults to
`SystemClock`; tests use `FixedClock` for deterministic evidence. Structured
logging redacts sensitive keys and recursively scans messages, unknown fields,
nested objects, arrays, credential-bearing URLs, provider keys, bearer tokens,
private keys, and cloud connection strings.

## Synthetic connector demonstration

The WHOOP, Garmin, and Hume connector classes are deterministic in-memory test
adapters. They make no network requests and accept no credentials. A Hume
fixture transported through Apple Health retains Hume as the source and Apple
Health as transport. The source-selection example uses quality, recency,
completeness, provenance, and explicit user policy; vendor identity never
confers superiority.

## Persistence boundary

Prisma models only platform-control records: policy versions, feature flags,
audit events, governance decisions, connector definitions, and metric
definitions. No personal measurement record exists. The initial migration is
reversible and contains no seed or real data.

## Runtime boundary

PostgreSQL is described through Docker Compose for local development. The
application validates configuration before use and exposes no database API.
External integrations remain both disabled by default and prohibited by the
phase-boundary control.
