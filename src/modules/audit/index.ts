export interface AuditRecord {
  readonly id: string;
  readonly eventType: string;
  readonly occurredAt: string;
  readonly policyVersion: string;
  readonly synthetic: true;
  readonly details: Readonly<Record<string, boolean | number | string | null>>;
}

export interface AuditWriter {
  append(record: AuditRecord): Promise<void>;
}
