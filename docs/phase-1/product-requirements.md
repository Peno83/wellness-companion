# Product requirements

**Status:** Draft for human review  
**Owner:** Product  
**Applies to:** Planned MVP and its design constraints

**Authority:** Subordinate to the [Governance Constitution](../governance/governance-constitution.md). A requirement that conflicts with the constitution is invalid and must not enter implementation.

## Product summary

Wellness Companion helps an adult turn daily wellness observations into a clear, cautious summary and a small set of actionable habits. It should answer three questions: “How am I doing?”, “What seems to influence that?”, and “What low-risk action could I take next?”

The product supports reflection and behavior change. It must not present diagnoses, treatment plans, emergency monitoring, or claims of clinical efficacy.

## Problem

People collect sleep, activity, recovery, mood, and habit information in separate places. Individual values are hard to interpret, day-to-day noise can look meaningful, and opaque scores can create false certainty. Users need a coherent view that preserves context, explains uncertainty, and avoids medical overreach.

## Target user and jobs

### Primary user

An adult who wants to understand personal wellness patterns and is willing to record or import daily observations. The MVP does not target clinicians, caregivers, employers, insurers, minors, or multi-user households.

### Jobs to be done

- Record a daily check-in quickly.
- See current status without mistaking it for a diagnosis.
- Understand which inputs changed a score and how reliable the result is.
- Notice trends without overreacting to a single day.
- Choose one realistic, low-risk action.
- Correct, export, or delete personal data.

## Goals and success measures

Targets are proposed and require product approval before Phase 2.

| Goal | MVP measure | Proposed target |
|---|---|---:|
| Make daily reflection easy | Median check-in completion time | ≤ 90 seconds |
| Create repeat value | Users completing ≥4 check-ins in week 4 | ≥ 35% |
| Preserve comprehension | Users correctly explaining score and confidence in usability test | ≥ 80% |
| Drive manageable action | Viewed recommendations marked useful or acted on | ≥ 40% |
| Maintain safety | Confirmed high-severity unsafe recommendations | 0 |
| Earn trust | Data deletion requests completed within product promise | 100% |

Metrics must be segmented without exposing small cohorts or sensitive attributes. Engagement must never be optimized by inducing anxiety, compulsive checking, or score dependency.

## MVP capabilities

### P0: required for first release

1. **Account and consent**
   - Explain data categories, purposes, retention, and user rights before collection.
   - Record versioned consent and permit withdrawal without blocking data export or deletion.
   - Provide a non-clinical disclaimer in onboarding and near interpretive outputs.

2. **Manual daily check-in**
   - Capture local date, sleep duration and perceived quality, energy, mood, stress, soreness, activity, and optional notes.
   - Allow users to skip any nonessential field.
   - Validate ranges and distinguish missing values from zero.
   - Permit correction with an auditable edit history.

3. **Wellness summary**
   - Show domain scores, an optional overall score, confidence, and input freshness.
   - Explain the largest positive and negative contributors in plain language.
   - Never infer a clinical condition or claim causation from correlation.

4. **Trends and reflection**
   - Show 7-day and 28-day patterns when enough data exists.
   - Mark sparse or stale views and avoid ranking changes smaller than measurement noise.
   - Let users annotate unusual context such as travel or illness without requiring disclosure.

5. **Recommendations**
   - Offer at most three low-risk, reversible suggestions, prioritized by likely usefulness and user preference.
   - Cite the user-visible reason and inputs behind each suggestion.
   - Suppress recommendations when confidence is insufficient or safety rules apply.
   - Support “not relevant,” “do not suggest again,” and feedback controls.

6. **User data controls**
   - View and correct profile and observations.
   - Export data in a documented, portable format.
   - Delete the account and associated content subject to disclosed legal/audit exceptions.

7. **Safety response**
   - Detect configured crisis or urgent-care phrases in free text using deterministic rules in the initial release.
   - Stop normal recommendation generation when triggered.
   - Present location-appropriate emergency guidance only after jurisdictional and legal review; until then use approved generic language directing users to local emergency services.

### P1: valuable after MVP stability

- Personal goal setting and reminder preferences.
- User-created tags and comparisons.
- Carefully validated nudges based on adherence history.
- Third-party data imports, each governed by a separately approved integration specification.

### Explicitly out of scope

- Medical diagnosis, treatment, medication advice, clinical triage, or emergency monitoring.
- Clinician, employer, insurer, caregiver, or family dashboards.
- Social feeds, competitive leaderboards, or public profiles.
- Automated ingestion from WHOOP, Apple Health, Health Connect, or other services in Phase 1.
- Calls to Claude or any external model/API in Phase 1.
- Selling personal data or using wellness data for advertising.
- Training shared machine-learning models on identifiable user content by default.

## Core user journeys

### First use

1. User reads the product boundary and data notice.
2. User chooses consent and optional fields.
3. User records a baseline check-in.
4. Product explains that early scores have low confidence.
5. User sees how to edit, export, or delete data.

### Daily check-in

1. User opens today’s check-in in their local timezone.
2. Existing values are absent unless explicitly carried forward and labeled.
3. User enters available observations and saves.
4. Product computes a versioned summary locally or through an approved internal scoring service.
5. User sees score, confidence, contributors, and no more than three suggestions.

### Safety interruption

1. User enters text matching an approved urgent-risk rule.
2. Normal suggestions are suppressed.
3. Product displays reviewed support language and makes no claim that risk has been diagnosed.
4. Event logging records the rule and content reference, with raw sensitive text excluded from general analytics.

### Data rights

1. User requests an export or deletion.
2. Product verifies the user and confirms scope.
3. The operation runs asynchronously and is idempotent, meaning repeating it does not create conflicting results.
4. User receives completion status and any disclosed retention exception.

## Functional requirements

| ID | Requirement | Acceptance criterion |
|---|---|---|
| FR-01 | Versioned consent | Every collected purpose maps to an active consent record and policy version. |
| FR-02 | Check-in validation | Invalid values are rejected; missing and zero remain distinct. |
| FR-03 | Provenance | Every observation records source, observed time, received time, and unit where applicable. |
| FR-04 | Deterministic scoring | Same normalized inputs and method version produce the same result. |
| FR-05 | Explainability | Every score exposes method version, confidence, freshness, and top contributors. |
| FR-06 | Recommendation controls | User can dismiss, mute a category, and inspect the reason for a suggestion. |
| FR-07 | Correction | Corrections preserve lineage and trigger derived-result recalculation. |
| FR-08 | Export | Export includes user-provided and derived data plus provenance in a documented format. |
| FR-09 | Deletion | Deletion covers primary records, derived records, search indexes, caches, and queued jobs. |
| FR-10 | Safety interruption | Approved risk rules suppress ordinary recommendations and show reviewed language. |
| FR-11 | Auditability | Sensitive administrative and policy actions create tamper-evident audit events. |
| FR-12 | Accessibility | Primary journeys meet WCAG 2.2 AA acceptance tests. |
| FR-13 | Constitutional governance | Every command, event consumer, calculation, feature, AI path, and output is subject to the effective Governance Constitution; deny wins and missing policy fails closed. |
| FR-14 | Source provenance | Every measurement retains the complete required origin envelope through normalization, calculation, explanation, export, correction, and deletion. |
| FR-15 | Data quality | Every incoming measurement receives a versioned classification and accepted, quarantined, or rejected disposition before use. |
| FR-16 | Version manifest | Every stored calculation references every applicable governance, scoring, prompt, AI-policy, analytics, data-model, contract, and output-schema version. |
| FR-17 | Explainability | Scores and trends identify contributors, missing/excluded data and modules, analyzed period, confidence, provenance, and calculation versions. |
| FR-18 | Controlled rollout | Each major optional module has a governed feature flag; protected constitutional controls cannot be flagged off. |
| FR-19 | Immutable events | Every domain change appends an immutable event; corrections supersede and deletion prevents personal-data rehydration. |
| FR-20 | AI isolation | AI has no raw-table, event-stream, unrestricted-projection, credential, or query access; only governed Structured Facts may enter the isolated AI boundary and all output is validated. |

## Non-functional requirements

| ID | Requirement | Proposed MVP target |
|---|---|---|
| NFR-01 | Availability | 99.5% monthly, excluding announced maintenance |
| NFR-02 | Interactive performance | p95 read response ≤500 ms; p95 write acknowledgement ≤800 ms under expected load |
| NFR-03 | Recoverability | RPO ≤24 hours and RTO ≤8 hours, tested before launch |
| NFR-04 | Privacy | No sensitive content in product analytics, URLs, or general application logs |
| NFR-05 | Security | Encryption in transit and at rest; least privilege; MFA for privileged access |
| NFR-06 | Portability | Machine-readable export with schema and method versions |
| NFR-07 | Observability | Health, latency, error, and job metrics without raw wellness content |
| NFR-08 | Maintainability | Versioned domain contracts and automated tests for scoring, policy, and migrations |

## Product principles

- **Agency over optimization:** user goals and preferences outrank streaks or engagement.
- **Uncertainty is visible:** insufficient data produces “not enough information,” not a confident number.
- **Explain, do not pronounce:** show factors and options rather than authoritative conclusions.
- **Small actions:** recommendations are limited, reversible, and easy to dismiss.
- **Privacy by default:** collect the minimum and keep optional content optional.
- **Safety before fluency:** a polished response cannot override policy or evidence limits.

## Dependencies and open decisions

- Legal classification and launch jurisdictions.
- Native mobile, web, or cross-platform client strategy.
- Whether the overall score is helpful enough to ship or should remain domain-only.
- Approved emergency language and regional resource strategy.
- Data residency, retention periods, age floor, and identity provider.
- Evidence owners and review cadence for recommendation content.

See [governance](governance.md) for decision rights and [scoring methodology](scoring-methodology.md) for score rules.
