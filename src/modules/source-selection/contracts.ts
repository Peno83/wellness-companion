import type {
  EstimateState,
  MeasurementClassification,
  QualityState,
} from "@modules/measurements/provenance";

export type MetricIdentifier = string & {
  readonly __metricIdentifier: unique symbol;
};

export interface SourceCandidate {
  readonly sourceIdentifier: string;
  readonly originatingVendor: string;
  readonly transportSource: string | null;
  readonly validDayCount: number;
  readonly missingDayCount: number;
  readonly measurementClassification: MeasurementClassification;
  readonly qualityState: QualityState;
  readonly estimateState: EstimateState;
  readonly duplicateOfSourceIdentifier: string | null;
  readonly revoked: boolean;
}

export interface SourceSuitabilityEvaluation {
  readonly metricIdentifier: MetricIdentifier;
  readonly candidate: SourceCandidate;
  readonly eligible: boolean;
  readonly factors: readonly string[];
  readonly exclusionReasons: readonly string[];
  readonly rank: number | null;
  readonly confidence: "high" | "medium" | "low";
  readonly calculationVersion: "synthetic-1.0.0";
  readonly evaluatedAt: string;
}

export interface SourcePreference {
  readonly mode: "automatic" | "user_preferred" | "preferred_with_fallback";
  readonly preferredSourceIdentifier: string | null;
}

export interface FallbackPreference {
  readonly metricIdentifier: MetricIdentifier;
  readonly orderedSourceIdentifiers: readonly string[];
}

export interface SourceDecisionExplanation {
  readonly selectedSourceIdentifier: string | null;
  readonly reasons: readonly string[];
  readonly preferenceMessage: string;
  readonly fallbackUsed: boolean;
  readonly alternatives: readonly Readonly<{
    sourceIdentifier: string;
    reasonsNotSelected: readonly string[];
  }>[];
  readonly calculationVersion: "synthetic-1.0.0";
}

export interface CanonicalSourceDecision {
  readonly metricIdentifier: MetricIdentifier;
  readonly selected: SourceCandidate | null;
  readonly outcome:
    | "automatic_selected"
    | "preferred_selected"
    | "fallback_selected"
    | "preference_unsatisfied";
  readonly preferenceSatisfied: boolean;
  readonly fallbackSourceIdentifier: string | null;
  readonly evaluations: readonly SourceSuitabilityEvaluation[];
  readonly explanation: SourceDecisionExplanation;
  readonly preference: SourcePreference;
}

export interface MethodologyBreak {
  readonly metricIdentifier: MetricIdentifier;
  readonly previousSourceIdentifier: string;
  readonly newSourceIdentifier: string;
  readonly previousMethodologyIdentifier: string;
  readonly newMethodologyIdentifier: string;
  readonly reason:
    | "source_changed"
    | "methodology_changed"
    | "estimate_state_changed"
    | "measurement_classification_changed";
  readonly occurredAt: string;
  readonly effectiveTimestamp: string;
  readonly compatibilityStatus: "compatible" | "incompatible" | "unknown";
  readonly warningText: string;
  readonly policyVersion: string;
}

export interface SourceMethodologyPeriod {
  readonly sourceIdentifier: string;
  readonly methodologyIdentifier: string;
  readonly compatibilityGroup: string;
  readonly measurementClassification: MeasurementClassification;
  readonly estimateState: EstimateState;
  readonly startTimestamp: string;
  readonly endTimestamp: string;
}

export interface MixedMethodologyWarning {
  readonly metricIdentifier: MetricIdentifier;
  readonly mixedMethodology: true;
  readonly compatibilityStatus: "compatible" | "incompatible";
  readonly warningText: string;
  readonly policyVersion: string;
  readonly periods: readonly SourceMethodologyPeriod[];
  readonly breaks: readonly MethodologyBreak[];
}

export interface MethodologyTrendAnalysis {
  readonly metricIdentifier: MetricIdentifier;
  readonly periods: readonly SourceMethodologyPeriod[];
  readonly breaks: readonly MethodologyBreak[];
  readonly warning: MixedMethodologyWarning | null;
  readonly aggregationAllowed: boolean;
  readonly policyVersion: string;
}

export interface GovernedAggregationPolicy {
  readonly approvedByGovernance: true;
  readonly allowIncompatibleMethodologies: boolean;
  readonly policyVersion: string;
}
