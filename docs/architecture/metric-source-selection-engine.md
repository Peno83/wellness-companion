# Metric Source Selection Engine

- **Document Identifier:** ARCH-MSS-001
- **Version:** 0.2.0
- **Owner:** Data Steward (unassigned)
- **Approver:** Not applicable while draft
- **Effective Date:** Not applicable while draft
- **Review Date:** Before implementing canonical metric selection
- **Status:** draft
- **Governance Approval:** Pending human review
- **Supersedes:** 0.1.0

## Core principle

The engine selects the best eligible source for each metric, not one preferred device for every metric. Selection is deterministic and versioned. AI cannot select or rank sources; it may explain approved structured facts after governance evaluation.

## Selection modes

| Mode                    | Behaviour                                                                                                         |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Automatic               | Apply the effective metric policy to all eligible candidates                                                      |
| User Preferred          | Use the user's fixed source when it has a valid record                                                            |
| Preferred With Fallback | Use the preferred source, then ordered fallbacks only when no valid primary record exists for the required period |

Every metric stores its mode. Restoring the system default appends an event rather than deleting preference history.

The Phase 2A.1.1 foundation enforces these modes directly. Automatic mode
ignores any retained preferred-source identifier. User Preferred returns an
explicit `preference_unsatisfied` outcome with no selected source when the fixed
source is unavailable; it never silently substitutes. Preferred With Fallback
checks the primary and then each ordered fallback, labels fallback use, and
returns the same explicit unsatisfied outcome when none is eligible.

## Deterministic selection sequence

1. Evaluate every available candidate.
2. Exclude invalid, revoked, rejected, unsupported, or policy-incompatible candidates.
3. Rank eligible sources using the metric-specific policy.
4. Apply the active user preference and fallback rules.
5. Select the highest-ranked eligible source.
6. Store the explanation manifest, excluded candidates, and policy version.
7. Emit methodology-break and recalculation events when applicable.

## Suitability result

Every candidate result contains metric identifier, source identifier, originating vendor, transport platform, measurement classification, coverage percentage, valid-day count, missing-day count, duplicate status, original-source status, estimate status, quality status, suitability factors, exclusion reasons, rank, confidence, calculation version, and evaluation timestamp.

Criteria include direct versus estimated measurement, original versus transported source, frequency, overnight/daytime coverage, completeness, recency, continuity, missingness, duplicate risk, import latency, consistency, wear compliance, device capability, manual-entry status, quality classification, metric-specific suitability, and user preference.

## User override flow

Before confirmation, show the current default, proposed source, default rationale, coverage, missing-data impact, direct/estimate status, origin/transport path, recalculation need, methodology-break risk, and fallback options. Explicit confirmation records user identifier, metric, previous and new sources, optional reason, timestamp, policy version, and confirmation event.

## Explanation manifest

Each decision states selected source, mode, reasons, alternatives, exclusions, coverage and quality comparisons, estimate classification, missing-data impact, methodology-break state, policy version, and timestamp. The explanation must use comparative facts such as `more complete` or `original source`, never unsupported clinical superiority.

## Product surfaces

Future screens are Metric Source Overview, Metric Source Detail, Default Selection Explanation, Source Override, Fallback Configuration, Methodology Change Confirmation, Source History, Restore System Default, and Data Coverage Comparison. Each metric shows source, mode, originating vendor, transport path, coverage, quality, rationale, alternatives, and methodology warnings.

## Future test contract

Tests must cover two devices for one metric, transported duplicates, incomplete preferred sources, fallback activation, override and restore, revocation, direct versus estimate, manual versus device, mid-trend source changes, incompatible sleep stages, cuff versus wearable blood pressure, Hume via Apple Health, policy-version changes, and explanation accuracy.
