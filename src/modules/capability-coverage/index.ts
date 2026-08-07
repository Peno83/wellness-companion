export type CapabilityState =
  | "available"
  | "unavailable"
  | "insufficient_history"
  | "unsupported"
  | "temporarily_unavailable"
  | "revoked"
  | "quality_limited";

export interface CapabilityCoverage {
  readonly metric: string;
  readonly state: CapabilityState;
  readonly validDayCount: number;
  readonly expectedDayCount: number;
}
