import type {
  ConnectorDefinition,
  ConnectorSyncRequest,
  ConnectorSyncResult,
  SyntheticConnector,
} from "../contracts";

import { createSyntheticMeasurement } from "@modules/measurements/provenance";

abstract class InMemorySyntheticConnector implements SyntheticConnector {
  abstract readonly definition: ConnectorDefinition;
  readonly authorisationState = "synthetic_ready" as const;

  async sync(request: ConnectorSyncRequest): Promise<ConnectorSyncResult> {
    const record = createSyntheticMeasurement({
      originatingVendor: this.definition.displayName.replace(" Synthetic", ""),
      originatingApplication: this.definition.displayName,
      transportSource: null,
      sourceRecordId: `${request.syntheticRunId}-record-1`,
      measurementType: "hrv",
      value: 50,
    });
    return {
      syntheticRunId: request.syntheticRunId,
      status: "completed",
      records: [record],
      networkCalls: 0,
    };
  }
}

export class SyntheticWhoopConnector extends InMemorySyntheticConnector {
  readonly definition = definition("synthetic-whoop", "WHOOP Synthetic");
}

export class SyntheticGarminConnector extends InMemorySyntheticConnector {
  readonly definition = definition("synthetic-garmin", "Garmin Synthetic");
}

export class SyntheticHumeConnector extends InMemorySyntheticConnector {
  readonly definition = definition("synthetic-hume", "Hume Synthetic");
}

function definition(id: string, displayName: string): ConnectorDefinition {
  return {
    id,
    displayName,
    version: "synthetic-1.0.0",
    synthetic: true,
    capabilities: [{ metric: "hrv", access: "read", synthetic: true }],
  };
}
