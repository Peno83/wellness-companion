export type {
  CanonicalSourceDecision,
  FallbackPreference,
  MethodologyBreak,
  MetricIdentifier,
  SourceCandidate,
  SourceDecisionExplanation,
  SourcePreference,
  SourceSuitabilityEvaluation,
} from "./contracts";
export {
  asMetricIdentifier,
  createMethodologyBreak,
  evaluateCandidate,
  selectCanonicalSource,
  syntheticHrvCandidates,
} from "./engine";
