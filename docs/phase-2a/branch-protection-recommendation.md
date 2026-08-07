# Main Branch Protection Recommendation

- **Document Identifier:** SEC-2A1-BRANCH-001
- **Version:** 1.1.0
- **Owner:** Andrew Penistone
- **Approver:** Andrew Penistone
- **Effective Date:** 2026-08-07
- **Review Date:** 2026-11-05
- **Status:** recommended
- **Supersedes:** 1.0.0

## Verification status

This document is a configuration recommendation only. A read-only request to
the GitHub branch-protection endpoint on 2026-08-07 returned HTTP 401 without
repository-administration credentials. Phase 2A.1.1 did not modify GitHub
settings and does not claim that branch protection is enabled.

## Recommended `main` protection

- Require a pull request before merging.
- Require the Documentation Quality checks to pass.
- Require the Phase 2A application check, `Platform foundation`, to pass.
- Block force pushes.
- Block deletion of `main`.
- Require conversation resolution before merging, where the repository plan
  supports that setting.
- Require checks against the latest commit before merging.

The Release Authority should configure these controls through GitHub, record
dated evidence, and verify the exact required-check names after the first
committed Phase 2A.1 workflow completes. No local document substitutes for
repository-setting evidence.

## Human GitHub configuration

1. Open the repository on GitHub and select **Settings**.
2. Select **Branches** or **Rules**, then create or edit the rule targeting
   `main`.
3. Enable **Require a pull request before merging**.
4. Enable **Require status checks to pass before merging** and require every
   Documentation Quality job plus `Platform foundation`, using the exact names
   emitted by the latest successful workflow.
5. Enable **Require conversation resolution before merging**, where available.
6. Disable force pushes and branch deletion.
7. Save the rule, then capture the rule URL, effective settings, verifier, and
   verification timestamp in governance evidence.

Commit signing is not required by the effective Constitution for this
synthetic-only phase. Its adoption or explicit deferral must be decided at the
Phase 2A.1 policy-bundle milestone rather than inferred from this recommendation.
