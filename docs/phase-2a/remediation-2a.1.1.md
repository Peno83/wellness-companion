# Phase 2A.1.1 Remediation Evidence

- **Document Identifier:** EV-2A1-REM-001
- **Version:** 1.0.0
- **Owner:** Andrew Penistone
- **Approver:** Pending human review
- **Effective Date:** Pending human approval
- **Review Date:** Before Phase 2A.2
- **Status:** draft

## Scope

This record covers all six Medium and four Low findings in the
[Phase 2A.1 Independent Governance Gate Review](../reviews/2026-08-07-phase-2a.1-independent-gate-review.md).
It authorizes no Phase 2A.2 capability, real connector, personal data,
authentication, AI execution, scoring, reporting, notification, or payment.

## Local remediation disposition

| Finding    | Local disposition                                                                                             | Remaining closure evidence                                                         |
| ---------- | ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| P2A.1-M-01 | Implemented and locally validated: distinct automatic, fixed-preference, and ordered-fallback outcomes        | Remediation commit and successful remote CI                                        |
| P2A.1-M-02 | Implemented and locally validated: structured periods, breaks, warnings, compatibility, and aggregation guard | Remediation commit and successful remote CI                                        |
| P2A.1-M-03 | Corrected to forward-only migration with controlled synthetic database recreation                             | Remediation commit and successful remote documentation checks                      |
| P2A.1-M-04 | All ten findings registered in GOV-FIND-001 version 1.4.0                                                     | Remediation commit, successful remote CI, and human confirmation                   |
| P2A.1-M-05 | Runtime Docker stage uses owned files and `USER node`; static tests pass                                      | Image runtime UID and health evidence when a Docker daemon is available; remote CI |
| P2A.1-M-06 | Six named attack fixtures each produce exit 1 and the expected dependency rule                                | Remediation commit and successful remote CI                                        |
| P2A.1-L-01 | Workflow step renamed to Phase 2A.1                                                                           | Successful remote workflow displaying the corrected label                          |
| P2A.1-L-02 | Both stashes inspected and superseded by committed history; retained by instruction                           | Human-authorized stash deletion and verification                                   |
| P2A.1-L-03 | Build-stage database URL removed; runtime injection retained                                                  | Remediation commit and successful image build when Docker is available             |
| P2A.1-L-04 | Protection recommendation includes exact human steps and conversation resolution; API remained unauthorized   | Human administrator evidence and signing-policy disposition                        |

No finding is marked Closed solely from this local record.

## Local validation evidence

On 2026-08-07 the following completed successfully:

- clean `npm ci`: 513 packages;
- Prisma generation and schema validation;
- ESLint with zero warnings, Prettier, and strict TypeScript;
- Vitest: 13 files and 48 tests;
- explicit integration suite: 1 file and 2 tests;
- focused logger, clock, source-selection, methodology, and Dockerfile suite:
  5 files and 33 tests;
- dependency-cruiser: 41 modules, 23 dependencies, zero baseline violations;
- six architecture attacks, each rejected with exit 1 and its named rule;
- Next.js production build and Playwright smoke test;
- npm audit: zero vulnerabilities.

- Markdownlint: 50 Markdown files and zero errors;
- CSpell: 141 files and zero issues;
- link and anchor validation: 49 Markdown files and zero errors;
- phase-boundary self-test and repository scan: passed across 148 files;
- workflow-policy self-test and repository scan: passed;
- secret-scanner self-test: 15 positive and 5 safe fixtures passed;
- repository secret scan: passed across 148 files;
- governance metadata: 38 governed documents passed;
- ADR validation: 31 unique, sequential identifiers (`ADR-001` through
  `ADR-031`);
- JSON and Docker Compose configuration parsing; and
- `git diff --check`.

Remote CI evidence remains pending until the remediation is committed and
pushed.

## Docker limitation

The Docker client is installed, but the local daemon was unavailable. Image
build, runtime UID inspection, and container health could not be executed.
Static tests prove the final user is `node`, runtime copies use
`--chown=node:node`, no `chmod 777` exists, and no database URL is embedded.
Docker Compose configuration remains independently parseable.

## Stash preservation

`stash@{0}` contains the pre-commit gate-review record and `stash@{1}` contains
the pre-commit foundation. Commit `0b06140` contains normalized and remediated
successors. Both stashes appear safely superseded, but neither was deleted;
human confirmation remains required.
