# Foundation Developer Setup

- **Document Identifier:** DEV-2A1-001
- **Version:** 1.0.0
- **Owner:** Andrew Penistone
- **Approver:** Andrew Penistone
- **Effective Date:** 2026-08-07
- **Review Date:** 2026-11-05
- **Status:** active

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

The initial database migration may be reversed by applying its documented
`Down` statements in reverse order in a disposable local database. Do not use
real or personal data during this phase.

During the Phase 2A.1 local validation on 2026-08-07, the Docker client was
available but its daemon was not running. Container startup was therefore not
exercised; all non-Docker validation completed independently.
