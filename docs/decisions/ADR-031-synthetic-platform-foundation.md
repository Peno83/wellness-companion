# ADR-031: Synthetic Platform Foundation

- **Document Identifier:** ARCH-ADR-031
- **Version:** 1.0.0
- **Owner:** Andrew Penistone
- **Approver:** Andrew Penistone
- **Effective Date:** 2026-08-07
- **Review Date:** 2026-11-05
- **Status:** accepted

## Context

The governance design requires executable evidence before health capabilities
can be considered, while the preceding repository boundary prohibited all
application artifacts.

## Decision

Adopt a modular Next.js monolith with TypeScript, Prisma, PostgreSQL contracts,
and governance-first dependency composition. Phase 2A.1 permits synthetic
adapters and deterministic demonstrations only. Use static dependency rules
and a deny-by-default file boundary to prevent premature integrations.

## Consequences

The platform can validate configuration, governance, provenance, module
composition, database controls, and delivery checks without personal data.
Some placeholder modules intentionally expose no behavior. Every real
connector, identity feature, health-data model, AI capability, and scoring
capability still requires a later decision and approved phase transition.
