import type { ProvenanceEnvelope } from "@modules/measurements/provenance";

export type ConnectorCapability = Readonly<{
  metric: string;
  access: "read";
  synthetic: boolean;
}>;

export type ConnectorAuthorisationState =
  "synthetic_ready" | "disabled" | "revoked";

export interface ConnectorDefinition {
  readonly id: string;
  readonly displayName: string;
  readonly version: string;
  readonly synthetic: true;
  readonly capabilities: readonly ConnectorCapability[];
}

export interface ConnectorSyncRequest {
  readonly syntheticRunId: string;
  readonly from: string;
  readonly to: string;
}

export interface ConnectorDataEnvelope {
  readonly provenance: ProvenanceEnvelope;
  readonly value: number;
}

export interface ConnectorSyncResult {
  readonly syntheticRunId: string;
  readonly status: "completed";
  readonly records: readonly ConnectorDataEnvelope[];
  readonly networkCalls: 0;
}

export interface ConnectorError {
  readonly code: "SYNTHETIC_REQUEST_INVALID" | "CONNECTOR_DISABLED";
  readonly safeMessage: string;
  readonly retryable: boolean;
}

export interface ConnectorRevocation {
  readonly connectorId: string;
  readonly revokedAt: string;
  readonly reason: "synthetic_test";
}

export interface SyntheticConnector {
  readonly definition: ConnectorDefinition;
  readonly authorisationState: ConnectorAuthorisationState;
  sync(request: ConnectorSyncRequest): Promise<ConnectorSyncResult>;
}
