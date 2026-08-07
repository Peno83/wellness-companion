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

  const preferenceOrder = [
    ...(preference.preferredSourceIdentifier
      ? [preference.preferredSourceIdentifier]
      : []),
    ...(fallback?.orderedSourceIdentifiers ?? []),
  ];
  const preferred = preferenceOrder
    .map((identifier) =>
      eligible.find(
        (evaluation) => evaluation.candidate.sourceIdentifier === identifier,
      ),
    )
    .find((evaluation) => evaluation !== undefined);

  const selectedEvaluation =
    preferred ??
    [...eligible].sort(
      (left, right) =>
        Number(Boolean(left.candidate.transportSource)) -
          Number(Boolean(right.candidate.transportSource)) ||
        right.candidate.validDayCount - left.candidate.validDayCount ||
        left.candidate.sourceIdentifier.localeCompare(
          right.candidate.sourceIdentifier,
        ),
    )[0];
  if (!selectedEvaluation) throw new Error("Source selection failed closed.");

  const ranked = [...eligible]
    .sort(
      (left, right) =>
        Number(Boolean(left.candidate.transportSource)) -
          Number(Boolean(right.candidate.transportSource)) ||
        right.candidate.validDayCount - left.candidate.validDayCount ||
        left.candidate.sourceIdentifier.localeCompare(
          right.candidate.sourceIdentifier,
        ),
    )
    .map((evaluation, index) => ({ ...evaluation, rank: index + 1 }));
  const evaluations = evaluated.map(
    (evaluation) =>
      ranked.find(
        (rankedEvaluation) =>
          rankedEvaluation.candidate === evaluation.candidate,
      ) ?? evaluation,
  );

  return {
    metricIdentifier,
    selected: selectedEvaluation.candidate,
    evaluations,
    preference,
    explanation: {
      selectedSourceIdentifier: selectedEvaluation.candidate.sourceIdentifier,
      reasons: selectedEvaluation.factors,
      alternatives: evaluations
        .filter(
          (evaluation) => evaluation.candidate !== selectedEvaluation.candidate,
        )
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
    reason: "source_changed",
    occurredAt: clock.now().toISOString(),
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
import { systemClock, type Clock } from "@/src/lib/clock";
