export type PlatformEventType =
  | "ConnectorRegistered"
  | "SyntheticSyncCompleted"
  | "MeasurementNormalised"
  | "SourceDecisionCreated"
  | "SourceOverrideRequested"
  | "MethodologyBreakCreated"
  | "FeatureFlagChanged"
  | "GovernanceDecisionRecorded";

export interface PlatformEvent<
  TPayload extends Readonly<Record<string, unknown>>,
> {
  readonly id: string;
  readonly type: PlatformEventType;
  readonly occurredAt: string;
  readonly schemaVersion: "1.0.0";
  readonly synthetic: true;
  readonly payload: TPayload;
}

export interface EventPublisher {
  publish<TPayload extends Readonly<Record<string, unknown>>>(
    event: PlatformEvent<TPayload>,
  ): Promise<void>;
}

export function createPlatformEvent<
  TPayload extends Readonly<Record<string, unknown>>,
>(
  id: string,
  type: PlatformEventType,
  payload: TPayload,
  clock: Clock = systemClock,
): PlatformEvent<TPayload> {
  return {
    id,
    type,
    occurredAt: clock.now().toISOString(),
    schemaVersion: "1.0.0",
    synthetic: true,
    payload,
  };
}

export class InMemoryEventPublisher implements EventPublisher {
  readonly events: PlatformEvent<Readonly<Record<string, unknown>>>[] = [];

  async publish<TPayload extends Readonly<Record<string, unknown>>>(
    event: PlatformEvent<TPayload>,
  ): Promise<void> {
    this.events.push(event);
  }
}
import { systemClock, type Clock } from "@/src/lib/clock";
