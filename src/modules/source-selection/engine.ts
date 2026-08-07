import { systemClock, type Clock } from "@/src/lib/clock";

import type {
  CanonicalSourceDecision,
  FallbackPreference,
  MethodologyBreak,
  MetricIdentifier,
  SourceCandidate,
  SourcePreference,
  SourceSuitabilityEvaluation,
} from "./contracts";

const CALCULATION_VERSION = "synthetic-1.0.0" as const;

export function asMetricIdentifier(value: string): MetricIdentifier {
  return value as MetricIdentifier;
}

export function evaluateCandidate(
  metricIdentifier: MetricIdentifier,
  candidate: SourceCandidate,
  clock: Clock = systemClock,
): SourceSuitabilityEvaluation {
  const exclusions = [
    ...(candidate.revoked ? ["source is revoked"] : []),
    ...(candidate.qualityState === "rejected" ? ["quality is rejected"] : []),
    ...(candidate.duplicateOfSourceIdentifier
      ? ["transported duplicate of original source"]
      : []),
  ];
  const factors = [
    ...(candidate.transportSource === null
      ? ["original source"]
      : ["transported source"]),
    `${candidate.validDayCount} valid days`,
    ...(candidate.estimateState === "direct"
      ? ["direct measurement"]
      : ["estimated measurement"]),
  ];
  return {
    metricIdentifier,
    candidate,
    eligible: exclusions.length === 0,
    factors,
    exclusionReasons: exclusions,
    rank: null,
    confidence:
      candidate.validDayCount >= 28
        ? "high"
        : candidate.validDayCount >= 14
          ? "medium"
          : "low",
    calculationVersion: CALCULATION_VERSION,
    evaluatedAt: clock.now().toISOString(),
  };
}

export function selectCanonicalSource(
  metricIdentifier: MetricIdentifier,
  candidates: readonly SourceCandidate[],
  preference: SourcePreference = {
    mode: "automatic",
    preferredSourceIdentifier: null,
  },
  fallback?: FallbackPreference,
  clock: Clock = systemClock,
): CanonicalSourceDecision {
  const evaluated = candidates.map((candidate) =>
    evaluateCandidate(metricIdentifier, candidate, clock),
  );
  const eligible = evaluated.filter((evaluation) => evaluation.eligible);
  if (eligible.length === 0)
    throw new Error("No eligible synthetic source candidate.");

  const ranked = [...eligible]
    .sort(compareEvaluations)
    .map((evaluation, index) => ({ ...evaluation, rank: index + 1 }));
  const evaluations = evaluated.map(
    (evaluation) =>
      ranked.find(
        (rankedEvaluation) =>
          rankedEvaluation.candidate === evaluation.candidate,
      ) ?? evaluation,
  );

  const findEligible = (sourceIdentifier: string) =>
    ranked.find(
      (evaluation) =>
        evaluation.candidate.sourceIdentifier === sourceIdentifier,
    );

  let selectedEvaluation: SourceSuitabilityEvaluation | undefined;
  let outcome: CanonicalSourceDecision["outcome"] = "automatic_selected";
  let preferenceSatisfied = true;
  let fallbackSourceIdentifier: string | null = null;
  let preferenceMessage =
    "Automatic ranking selected the highest eligible source.";

  if (preference.mode === "automatic") {
    selectedEvaluation = ranked[0];
  } else if (preference.mode === "user_preferred") {
    selectedEvaluation = preference.preferredSourceIdentifier
      ? findEligible(preference.preferredSourceIdentifier)
      : undefined;
    if (selectedEvaluation) {
      outcome = "preferred_selected";
      preferenceMessage =
        "The explicit user-selected source was eligible and selected.";
    } else {
      outcome = "preference_unsatisfied";
      preferenceSatisfied = false;
      preferenceMessage =
        "The explicit user-selected source was unavailable; automatic substitution is prohibited.";
    }
  } else {
    const preferenceOrder = [
      ...(preference.preferredSourceIdentifier
        ? [preference.preferredSourceIdentifier]
        : []),
      ...(fallback?.orderedSourceIdentifiers ?? []),
    ];
    const selectedIndex = preferenceOrder.findIndex((identifier) =>
      Boolean(findEligible(identifier)),
    );
    selectedEvaluation =
      selectedIndex >= 0
        ? findEligible(preferenceOrder[selectedIndex] ?? "")
        : undefined;
    if (!selectedEvaluation) {
      outcome = "preference_unsatisfied";
      preferenceSatisfied = false;
      preferenceMessage =
        "Neither the preferred source nor an ordered fallback was eligible.";
    } else if (selectedIndex === 0) {
      outcome = "preferred_selected";
      preferenceMessage = "The preferred source was eligible and selected.";
    } else {
      outcome = "fallback_selected";
      fallbackSourceIdentifier = selectedEvaluation.candidate.sourceIdentifier;
      preferenceMessage = `Fallback source ${fallbackSourceIdentifier} was selected after preceding configured sources were unavailable.`;
    }
  }

  const selectedCandidate = selectedEvaluation?.candidate ?? null;
  return {
    metricIdentifier,
    selected: selectedCandidate,
    outcome,
    preferenceSatisfied,
    fallbackSourceIdentifier,
    evaluations,
    preference,
    explanation: {
      selectedSourceIdentifier: selectedCandidate?.sourceIdentifier ?? null,
      reasons: selectedEvaluation?.factors ?? [preferenceMessage],
      preferenceMessage,
      fallbackUsed: outcome === "fallback_selected",
      alternatives: evaluations
        .filter((evaluation) => evaluation.candidate !== selectedCandidate)
        .map((evaluation) => ({
          sourceIdentifier: evaluation.candidate.sourceIdentifier,
          reasonsNotSelected:
            evaluation.exclusionReasons.length > 0
              ? evaluation.exclusionReasons
              : [
                  `lower deterministic coverage rank (${evaluation.candidate.validDayCount} valid days)`,
                ],
        })),
      calculationVersion: CALCULATION_VERSION,
    },
  };
}

function compareEvaluations(
  left: SourceSuitabilityEvaluation,
  right: SourceSuitabilityEvaluation,
): number {
  return (
    Number(Boolean(left.candidate.transportSource)) -
      Number(Boolean(right.candidate.transportSource)) ||
    right.candidate.validDayCount - left.candidate.validDayCount ||
    left.candidate.sourceIdentifier.localeCompare(
      right.candidate.sourceIdentifier,
    )
  );
}

export function createMethodologyBreak(
  metricIdentifier: MetricIdentifier,
  previousSourceIdentifier: string,
  newSourceIdentifier: string,
  clock: Clock = systemClock,
): MethodologyBreak | null {
  if (previousSourceIdentifier === newSourceIdentifier) return null;
  return {
    metricIdentifier,
    previousSourceIdentifier,
    newSourceIdentifier,
    previousMethodologyIdentifier: previousSourceIdentifier,
    newMethodologyIdentifier: newSourceIdentifier,
    reason: "source_changed",
    occurredAt: clock.now().toISOString(),
    effectiveTimestamp: clock.now().toISOString(),
    compatibilityStatus: "unknown",
    warningText:
      "The canonical source changed; methodology compatibility must be evaluated before aggregation.",
    policyVersion: CALCULATION_VERSION,
  };
}

export function syntheticHrvCandidates(): readonly SourceCandidate[] {
  return [
    candidate("whoop-synthetic", "WHOOP", null, 30, null),
    candidate("garmin-synthetic", "Garmin", null, 18, null),
    candidate(
      "apple-transport-synthetic",
      "WHOOP",
      "Apple Health",
      30,
      "whoop-synthetic",
    ),
  ];
}

function candidate(
  sourceIdentifier: string,
  originatingVendor: string,
  transportSource: string | null,
  validDayCount: number,
  duplicateOfSourceIdentifier: string | null,
): SourceCandidate {
  return {
    sourceIdentifier,
    originatingVendor,
    transportSource,
    validDayCount,
    missingDayCount: 30 - validDayCount,
    measurementClassification: "device_measured",
    qualityState: "verified",
    estimateState: "direct",
    duplicateOfSourceIdentifier,
    revoked: false,
  };
}
