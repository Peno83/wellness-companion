# Main Branch Protection Recommendation

- **Document Identifier:** SEC-2A1-BRANCH-001
- **Version:** 1.0.0
- **Owner:** Andrew Penistone
- **Approver:** Andrew Penistone
- **Effective Date:** 2026-08-07
- **Review Date:** 2026-11-05
- **Status:** recommended

## Verification status

This document is a configuration recommendation only. Phase 2A.1 did not
inspect or modify GitHub repository settings, so it does not claim that branch
protection is enabled.

## Recommended `main` protection

- Require a pull request before merging.
- Require the Documentation Quality checks to pass.
- Require the Phase 2A application check, `Platform foundation`, to pass.
- Block force pushes.
- Block deletion of `main`.
- Require checks against the latest commit before merging.

The Release Authority should configure these controls through GitHub, record
dated evidence, and verify the exact required-check names after the first
committed Phase 2A.1 workflow completes. No local document substitutes for
repository-setting evidence.
