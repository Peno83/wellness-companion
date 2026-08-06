# ADR-016: Markdown lint policy exceptions

- **Document Identifier:** ARCH-ADR-016
- **Version:** 1.0.1
- **Owner:** Andrew Penistone
- **Approver:** Andrew Penistone
- **Effective Date:** 2026-08-06
- **Review Date:** 2026-11-05
- **Status:** active
- **Governance Approval:** Approved
- **Supersedes:** ARCH-ADR-013 version 1.0.0 (identifier correction only)

## Context

**Identifier correction:** This decision was initially recorded as ADR-013 in
Phase 2A.0, colliding with the existing raw-data-to-AI isolation decision. It
was renumbered to ADR-016 in Phase 2A.0.1. No decision content was discarded or
silently overwritten.

The governance corpus contains wide evidence tables and independent review records. Markdownlint protects document structure, but two default rules conflict with deliberate evidence-preservation and reviewability choices.

## Decision

The repository keeps Markdownlint defaults except for these documented exceptions:

- **MD013 (line length) is disabled.** Governance tables must keep one logical record per source line so diffs, blame, and evidence review remain reliable. Wrapping table rows would make the source harder to audit and does not improve rendered accessibility.
- **MD036 (emphasis used as a heading) is disabled.** Independent review records use bold finding labels within severity sections. Those labels are evidence from the reviewer and must not be promoted into a new heading hierarchy or rewritten solely for lint style.

MD024 remains enabled with `siblings_only: true`, allowing the same section title in separate branches while still rejecting duplicate sibling headings. All other enabled structural and table-format rules remain enforced.

## Consequences

Long prose lines are permitted, so reviewers must still prefer readable paragraphs outside tables. Bold labels are permitted, so authors must use actual headings for new document structure. These exceptions do not exclude any file, including independent review documents, from linting.

## Evidence

- [.markdownlint.jsonc](../../.markdownlint.jsonc)
- [Documentation quality workflow](../../.github/workflows/documentation-quality.yml)

## Change log

| Version | Effective date | Change | Approved by |
| --- | --- | --- | --- |
| 1.0.0 | 2026-08-06 | Initially recorded the Markdown lint exceptions under the colliding ADR-013 identifier. | Andrew Penistone |
| 1.0.1 | 2026-08-06 | Corrected the identifier to ADR-016 without changing the underlying decision. | Andrew Penistone |
