# Capability Coverage Model

- **Document Identifier:** ARCH-COV-001
- **Version:** 0.1.0
- **Owner:** Product Owner (unassigned)
- **Approver:** Not applicable while draft
- **Effective Date:** Not applicable while draft
- **Review Date:** Before exposing connector-derived availability
- **Status:** draft
- **Governance Approval:** Pending human review

## Purpose

The capability coverage engine explains what the connected ecosystem can and cannot support. Missing capability is a state, never a numeric zero.

## Coverage states

| State | Meaning | Calculation treatment |
| --- | --- | --- |
| Available | Required capability and valid data meet the policy threshold | Eligible |
| Unavailable | Connected sources do not expose the metric | Excluded |
| Insufficient history | Metric exists but history is below the required window | Excluded or partial only when policy permits |
| Unsupported | No approved connector or canonical definition supports it | Excluded |
| Temporarily unavailable | Outage, rate limit, sync delay, or transient connector error | Excluded and retryable |
| Revoked | Consent or source access was withdrawn | Excluded immediately |
| Quality limited | Data exists but quality restricts its use | Policy-dependent with explanation |

## Coverage result

Each result records metric, connected platforms, candidate sources, available period, expected and valid samples, missing periods, freshness, quality limitations, connector state, consent state, coverage percentage, policy version, and evaluation timestamp.

## Module eligibility

Every optional module declares required and optional capabilities. The engine excludes a module when a mandatory capability is unavailable, revoked, unsupported, rejected, or below minimum coverage. It records excluded modules and reasons in every affected score, trend, report, correlation, and explanation.

## User presentation

The product shows connected platforms, available metrics, unavailable metrics, insufficient history, unsupported metrics, temporary failures, revoked metrics, and data-quality limits. Coverage language must not imply diagnosis, device inferiority, or clinical accuracy.

## Related standards

- [Connector Architecture](connector-architecture.md)
- [Metric Source Policy Model](metric-source-policy-model.md)
- [Explainability Standard](explainability-standard.md)
