import type {
  GovernedAggregationPolicy,
  MethodologyBreak,
  MethodologyTrendAnalysis,
  MetricIdentifier,
  SourceMethodologyPeriod,
} from "./contracts";

const METHODOLOGY_POLICY_VERSION = "methodology-synthetic-1.0.0";

export function analyseMethodologyTrend(
  metricIdentifier: MetricIdentifier,
  periods: readonly SourceMethodologyPeriod[],
): MethodologyTrendAnalysis {
  const orderedPeriods = [...periods].sort((left, right) =>
    left.startTimestamp.localeCompare(right.startTimestamp),
  );
  const breaks: MethodologyBreak[] = [];

  for (let index = 1; index < orderedPeriods.length; index += 1) {
    const previous = orderedPeriods[index - 1];
    const current = orderedPeriods[index];
    if (!previous || !current || isSameMethodology(previous, current)) continue;

    const compatibilityStatus = areCompatible(previous, current)
      ? "compatible"
      : "incompatible";
    breaks.push({
      metricIdentifier,
      previousSourceIdentifier: previous.sourceIdentifier,
      newSourceIdentifier: current.sourceIdentifier,
      previousMethodologyIdentifier: previous.methodologyIdentifier,
      newMethodologyIdentifier: current.methodologyIdentifier,
      reason: determineBreakReason(previous, current),
      occurredAt: current.startTimestamp,
      effectiveTimestamp: current.startTimestamp,
      compatibilityStatus,
      warningText:
        compatibilityStatus === "compatible"
          ? "The trend continues across a disclosed compatible methodology change."
          : "The trend contains incompatible methodologies and must not be silently aggregated.",
      policyVersion: METHODOLOGY_POLICY_VERSION,
    });
  }

  const incompatible = breaks.some(
    (methodologyBreak) =>
      methodologyBreak.compatibilityStatus === "incompatible",
  );
  const warning =
    breaks.length === 0
      ? null
      : {
          metricIdentifier,
          mixedMethodology: true as const,
          compatibilityStatus: incompatible
            ? ("incompatible" as const)
            : ("compatible" as const),
          warningText: incompatible
            ? "This trend crosses incompatible source-methodology boundaries; aggregation is blocked without explicit governed policy."
            : "This trend crosses compatible source-methodology boundaries that must remain visible.",
          policyVersion: METHODOLOGY_POLICY_VERSION,
          periods: orderedPeriods,
          breaks,
        };

  return {
    metricIdentifier,
    periods: orderedPeriods,
    breaks,
    warning,
    aggregationAllowed: !incompatible,
    policyVersion: METHODOLOGY_POLICY_VERSION,
  };
}

export function assertTrendAggregationAllowed(
  analysis: MethodologyTrendAnalysis,
  governedPolicy?: GovernedAggregationPolicy,
): void {
  if (analysis.aggregationAllowed) return;
  if (
    governedPolicy?.approvedByGovernance === true &&
    governedPolicy.allowIncompatibleMethodologies
  ) {
    return;
  }
  throw new Error(
    "Aggregation across incompatible methodologies requires explicit governed policy.",
  );
}

function isSameMethodology(
  previous: SourceMethodologyPeriod,
  current: SourceMethodologyPeriod,
): boolean {
  return (
    previous.sourceIdentifier === current.sourceIdentifier &&
    previous.methodologyIdentifier === current.methodologyIdentifier &&
    previous.measurementClassification === current.measurementClassification &&
    previous.estimateState === current.estimateState
  );
}

function areCompatible(
  previous: SourceMethodologyPeriod,
  current: SourceMethodologyPeriod,
): boolean {
  return (
    previous.compatibilityGroup === current.compatibilityGroup &&
    previous.measurementClassification === current.measurementClassification &&
    previous.estimateState === current.estimateState
  );
}

function determineBreakReason(
  previous: SourceMethodologyPeriod,
  current: SourceMethodologyPeriod,
): MethodologyBreak["reason"] {
  if (previous.estimateState !== current.estimateState)
    return "estimate_state_changed";
  if (previous.measurementClassification !== current.measurementClassification)
    return "measurement_classification_changed";
  if (previous.methodologyIdentifier !== current.methodologyIdentifier)
    return "methodology_changed";
  return "source_changed";
}
