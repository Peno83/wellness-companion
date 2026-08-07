export type {
  CanonicalSourceDecision,
  FallbackPreference,
  MethodologyBreak,
  MethodologyTrendAnalysis,
  MixedMethodologyWarning,
  MetricIdentifier,
  SourceCandidate,
  SourceDecisionExplanation,
  SourcePreference,
  SourceMethodologyPeriod,
  SourceSuitabilityEvaluation,
} from "./contracts";
export type { GovernedAggregationPolicy } from "./contracts";
export {
  asMetricIdentifier,
  createMethodologyBreak,
  evaluateCandidate,
  selectCanonicalSource,
  syntheticHrvCandidates,
} from "./engine";
export {
  analyseMethodologyTrend,
  assertTrendAggregationAllowed,
} from "./methodology";
