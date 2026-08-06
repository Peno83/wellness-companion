# Scoring methodology

- **Document Identifier:** SCORE-METH-001
- **Version:** 0.1.0
- **Owner:** Scoring Owner (unassigned)
- **Approver:** Not applicable while draft
- **Effective Date:** Not applicable while draft
- **Review Date:** Before scoring implementation
- **Status:** draft
- **Governance Approval:** Not approved for production
- **Purpose:** Define transparent wellness summaries without diagnostic or causal claims.

**Authority:** Subordinate to the [Governance Constitution](../governance/governance-constitution.md). Each result must carry exact input-event lineage, all applicable versions, and the explanation required by the [Explainability Standard](../architecture/explainability-standard.md).

## What the score means

A score summarizes how recent user-reported observations compare with that user’s own recent baseline and broadly reviewed wellness guardrails. It is a reflection aid, not a measurement of health, readiness, disease, fitness, worth, or future outcome.

The method should prefer domain scores for sleep, perceived state, stress/recovery, and activity. An overall score is optional and must not ship unless research shows that users understand its limits better than a domain-only view.

## Design requirements

- Deterministic: identical inputs and method version produce identical outputs.
- Personal: use within-person baselines where enough data exists.
- Conservative: missing, stale, inconsistent, or insufficient data reduces confidence or suppresses a score.
- Explainable: expose contributing metrics and direction, not hidden reasoning.
- Bounded: all displayed scores use a 0–100 scale without implying clinical precision.
- Versioned: parameters, input contract, computation, and display policy form one immutable method release.
- Correctable: corrected observations create new results linked to the originals.

## Input domains

Initial manual-entry candidates are:

| Domain | Inputs | Direction after transformation |
| --- | --- | --- |
| Sleep | duration, perceived quality | More favorable values increase domain score within reviewed ranges |
| Perceived state | energy, mood | Higher reported values increase domain score |
| Stress/recovery | stress, soreness | Higher raw values decrease domain score |
| Activity | duration, intensity | Evaluated against personal pattern; neither maximum nor minimum is automatically best |

Free text, inferred diagnoses, demographic proxies, and future vendor composite scores are excluded from numerical scoring in the proposed MVP.

## Processing stages

```text
validated observations
        │
        ▼
unit and scale normalization
        │
        ▼
quality + freshness assessment
        │
        ▼
personal baseline (when sufficient)
        │
        ▼
metric utility transform [0, 100]
        │
        ▼
domain weighted mean + confidence
        │
        ▼
optional overall score
        │
        ▼
versioned calculation event + explanation manifest
        │
        ▼
Governance Engine
        │ approved Structured Facts or denial
        ▼
Output Validator
        │
        ▼
user-visible score + contributors + uncertainty
```

## Validation and normalization

1. Validate type, range, unit, observed time, source, and ownership.
2. Preserve the original value and convert numeric measures to a canonical unit.
3. Reject impossible values; flag plausible extremes for confirmation rather than silently clipping them.
4. Treat missing as absent. Never impute zero.
5. Map 1–5 ordinal responses to fixed anchors only for display and aggregation:

```text
1 → 0, 2 → 25, 3 → 50, 4 → 75, 5 → 100
```

For negatively directed inputs such as stress, reverse after mapping:

```text
reversed_value = 100 - mapped_value
```

Ordinal differences must not be described as precise equal physiological intervals; the mapping is a product convention.

## Personal baseline

A personal baseline may be used after at least 14 valid observations in the prior 28 local days for the same metric. This threshold is a proposal to validate, not an evidence claim.

For a numeric metric, use robust statistics to limit outlier influence:

```text
baseline_center = median(values)
baseline_spread = 1.4826 × median(|value - baseline_center|)
```

If spread is too small, fall back to an approved minimum spread to avoid division by zero and exaggerated changes. Standardized deviation is bounded:

```text
z = clamp((current - baseline_center) / baseline_spread, -3, 3)
```

The utility transform from `z` to 0–100 is domain-specific and monotonic only where “more” is safely better. Activity should use a reviewed target band rather than reward ever-higher volume. All curves and target bands must be published in the method version and tested with boundary examples.

Before baseline eligibility, use only fixed, reviewed transforms and show `low` confidence. Do not create pseudo-personalization from a few days.

## Domain aggregation

For domain `d`, let `s_i` be each available metric utility score and `w_i` its approved weight:

```text
domain_score_d = round(Σ(w_i × s_i) / Σ(w_i))
```

Only present metrics participate in the denominator. However, a domain score is suppressed unless both conditions hold:

- available approved weight is at least 60% of the domain’s total possible weight; and
- any domain-specific required input is present.

Proposed starting weights, subject to validation:

| Domain | Metric | Weight |
| --- | --- | ---: |
| Sleep | duration | 0.50 |
| Sleep | perceived quality | 0.50 |
| Perceived state | energy | 0.50 |
| Perceived state | mood | 0.50 |
| Stress/recovery | reversed stress | 0.60 |
| Stress/recovery | reversed soreness | 0.40 |
| Activity | duration utility | 0.60 |
| Activity | intensity utility | 0.40 |

Weights are product hypotheses, not medical facts. User research and validation may justify equal weights or domain-only presentation.

## Overall score

If approved, compute the overall score as an equal-weight mean of available domain scores:

```text
overall_score = round(mean(eligible_domain_scores))
```

Require at least three eligible domains, including sleep or perceived state. Do not reweight domains based on engagement or availability because that makes day-to-day comparisons opaque. The UI must show which domains participated.

## Confidence

Confidence describes data support for the computation, not certainty about the user’s health.

Compute a documented support index:

```text
support = 0.40 × coverage
        + 0.25 × freshness
        + 0.20 × baseline_maturity
        + 0.15 × consistency
```

Each factor is within `[0, 1]`:

- `coverage`: participating approved weight divided by total possible weight.
- `freshness`: 1 for today’s daily inputs, decaying to 0 at the domain’s approved expiry.
- `baseline_maturity`: valid baseline observations divided by 14, capped at 1.
- `consistency`: source-quality factor reduced by contradictory or user-flagged values.

Bands:

| Support | Display |
| ---: | --- |
| `<0.45` | Suppress score; show insufficient information |
| `0.45–<0.70` | Low confidence |
| `0.70–<0.85` | Moderate confidence |
| `≥0.85` | Higher confidence |

Use “higher,” not “high,” to avoid suggesting clinical certainty. Thresholds require usability and calibration testing.

## Trends and meaningful change

- A 7-day trend requires at least 4 eligible daily scores.
- A 28-day trend requires at least 14 eligible daily scores.
- Display median and interquartile range where possible, rather than only a mean.
- Mark a change as notable only if it exceeds both a fixed display threshold and the user’s recent day-to-day variability threshold.
- Never call a relationship causal. Use language such as “coincided with” or “was associated in your recent entries.”
- Multiple comparisons and sparse histories can create false patterns; the MVP should restrict factor comparisons to predefined, user-understandable questions.

## Contributor explanation

For each score, compute each input’s weighted difference from a neutral/reference contribution. Show at most two positive and two negative contributors, ordered by absolute contribution. An explanation includes:

- metric display name and observed value;
- comparison basis: fixed range or personal baseline;
- contribution direction and plain-language magnitude;
- freshness and missing-data caveat;
- method version link.

Do not expose raw `z` values as meaningful to general users or phrase contributors as diagnoses.

## Recommendations

Scores do not directly generate arbitrary advice. They provide facts to a deterministic selector over reviewed content.

A suggestion is eligible only when:

1. required inputs and minimum confidence are present;
2. its evidence and content reviews are current;
3. no safety exclusion or user mute applies;
4. it was not recently shown beyond its frequency cap;
5. the reason can be explained from visible inputs.

Ranking should favor relevance, user preference, novelty within limits, and low effort. It must not reward alarm, clicks, or repeated score checking. Maximum output is three suggestions; zero is valid.

## Missing, stale, and conflicting data

| Condition | Behavior |
| --- | --- |
| Missing input | Exclude it; reduce coverage; never substitute zero |
| User declined | Exclude and do not repeatedly pressure collection |
| Stale observation | Exclude after domain expiry; clearly label before expiry |
| Corrected input | Recompute into a new score result and preserve old result lineage |
| Extreme but plausible | Ask for confirmation; include only when confirmed |
| Contradictory sources | Prefer no result until a documented precedence rule resolves it |
| Timezone change | Preserve original local date/timezone; avoid silently moving history |

## Validation plan

### Analytical validation

- Golden test vectors for every transform, boundary, missingness path, and method version.
- Property tests for bounded results, determinism, monotonic sections, and invariance under irrelevant input order.
- Reproducibility from exported inputs and method parameters.
- Sensitivity analysis showing how each input and weight changes outputs.

### Product and safety validation

- Cognitive interviews: users can explain what score and confidence mean.
- Usability tests: low confidence does not read as low wellness.
- Expert review of transforms, target bands, claims, and contraindications.
- Adversarial cases including illness, injury, pregnancy, disability, shift work, eating-disorder risk, extreme exercise, and sparse data.
- Check that the design does not shame, reward overtraining, or discourage professional care.

### Statistical monitoring after launch approval

- Missingness and confidence distribution.
- Score distribution and discontinuities by method version.
- Correction and suppression rates.
- Recommendation dismissal, mute, and safety-report rates.
- Subgroup performance only where collection and analysis are lawful, consensual, adequately powered, and privacy-preserving.

No threshold should be tuned solely to increase engagement.

## Release and rollback

Each method release includes parameter file, implementation digest, test vectors, validation report, limitations, approval record, effective time, and rollback trigger. Shadow comparison may calculate a candidate method without showing it to users, using approved data purposes. Rollback stops new candidate results; historical results keep their version.

## Open decisions

- Ship domain scores only or include an overall score.
- Confirm the input set, fixed utility curves, target bands, weights, coverage threshold, freshness windows, and baseline sample size.
- Decide whether any score should be displayed during baseline collection.
- Identify qualified reviewers for wellness claims and edge cases.
- Set material-change thresholds and user communication rules.

Related: [product requirements](product-requirements.md), [governance](governance.md), and [data model](data-model.md).
