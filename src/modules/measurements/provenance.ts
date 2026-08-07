export type MeasurementClassification =
  "device_measured" | "device_estimated" | "manual";
export type QualityState =
  "verified" | "imported" | "manual" | "incomplete" | "rejected";
export type EstimateState = "direct" | "estimated";

export interface ProvenanceEnvelope {
  readonly originatingVendor: string;
  readonly originatingApplication: string;
  readonly transportSource: string | null;
  readonly deviceIdentifier: string;
  readonly sourceRecordId: string;
  readonly originalTimestamp: string;
  readonly ingestionTimestamp: string;
  readonly originalUnit: string;
  readonly normalisedUnit: string;
  readonly measurementType: string;
  readonly measurementClassification: MeasurementClassification;
  readonly qualityState: QualityState;
  readonly estimateState: EstimateState;
  readonly schemaVersion: string;
  readonly connectorVersion: string;
}

type SyntheticMeasurementInput = Readonly<{
  originatingVendor: string;
  originatingApplication: string;
  transportSource: string | null;
  sourceRecordId: string;
  measurementType: string;
  value: number;
}>;

export interface SyntheticMeasurement {
  readonly provenance: ProvenanceEnvelope;
  readonly value: number;
}

export function createSyntheticMeasurement(
  input: SyntheticMeasurementInput,
  clock: Clock = systemClock,
): SyntheticMeasurement {
  const originalTimestamp = clock.now().toISOString();
  const ingestionTimestamp = clock.now().toISOString();
  return {
    value: input.value,
    provenance: {
      originatingVendor: input.originatingVendor,
      originatingApplication: input.originatingApplication,
      transportSource: input.transportSource,
      deviceIdentifier: "synthetic-device",
      sourceRecordId: input.sourceRecordId,
      originalTimestamp,
      ingestionTimestamp,
      originalUnit: "ms",
      normalisedUnit: "ms",
      measurementType: input.measurementType,
      measurementClassification: "device_measured",
      qualityState: "verified",
      estimateState: "direct",
      schemaVersion: "1.0.0",
      connectorVersion: "synthetic-1.0.0",
    },
  };
}

export function createSyntheticHumeViaAppleHealthMeasurement(
  clock: Clock = systemClock,
): SyntheticMeasurement {
  return createSyntheticMeasurement(
    {
      originatingVendor: "Hume",
      originatingApplication: "Hume Synthetic",
      transportSource: "Apple Health",
      sourceRecordId: "synthetic-hume-via-apple-1",
      measurementType: "weight",
      value: 70,
    },
    clock,
  );
}
import { systemClock, type Clock } from "@/src/lib/clock";
