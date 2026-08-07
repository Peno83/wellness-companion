# Foundation Developer Setup

- **Document Identifier:** DEV-2A1-001
- **Version:** 1.1.0
- **Owner:** Andrew Penistone
- **Approver:** Andrew Penistone
- **Effective Date:** 2026-08-07
- **Review Date:** 2026-11-05
- **Status:** active
- **Supersedes:** 1.0.0

## Prerequisites

- Node.js 24 or later
- npm
- Docker with Compose, only when exercising local PostgreSQL

## Setup

1. Copy `.env.example` to an untracked `.env.local` and keep the synthetic
   placeholder values.
2. Run `npm ci`.
3. Run `npm run prisma:generate`.
4. Optionally run `docker compose up postgres` to provide local PostgreSQL.
5. Run `npm run dev` and open the local URL printed by Next.js.

## Validation

Run `npm run validate`. After a successful build, install the Playwright
Chromium runtime with `npx playwright install chromium` and run
`npm run test:e2e`. Governance checks in `.github/scripts` remain mandatory.

The initial database migration is forward-only. It has no down script and must
not be described as mechanically reversible. During this synthetic development
phase, recovery uses controlled destruction and recreation of the disposable
local database followed by `prisma migrate deploy`. Never use this reset method
against a shared or production database, and do not use real or personal data
during this phase.

During the Phase 2A.1 and Phase 2A.1.1 local validations on 2026-08-07, the
Docker client was available but its daemon was not running. Image build,
non-root runtime UID, and container health were therefore not exercised.
Static Dockerfile security tests and Compose parsing passed; all non-Docker
validation completed independently.
