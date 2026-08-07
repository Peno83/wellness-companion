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
  readonly selectedSourceIdentifier: string;
  readonly reasons: readonly string[];
  readonly alternatives: readonly Readonly<{
    sourceIdentifier: string;
    reasonsNotSelected: readonly string[];
  }>[];
  readonly calculationVersion: "synthetic-1.0.0";
}

export interface CanonicalSourceDecision {
  readonly metricIdentifier: MetricIdentifier;
  readonly selected: SourceCandidate;
  readonly evaluations: readonly SourceSuitabilityEvaluation[];
  readonly explanation: SourceDecisionExplanation;
  readonly preference: SourcePreference;
}

export interface MethodologyBreak {
  readonly metricIdentifier: MetricIdentifier;
  readonly previousSourceIdentifier: string;
  readonly newSourceIdentifier: string;
  readonly reason: "source_changed";
  readonly occurredAt: string;
  readonly policyVersion: string;
}
