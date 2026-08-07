-- Phase 2A.1 synthetic-safe platform foundation.
-- Roll back in development by dropping these six tables in reverse dependency order.
CREATE TABLE "PolicyVersion" (
    "id" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "effectiveAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PolicyVersion_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "FeatureFlag" (
    "key" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "version" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "FeatureFlag_pkey" PRIMARY KEY ("key")
);

CREATE TABLE "AuditEvent" (
    "id" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "policyVersion" TEXT NOT NULL,
    "synthetic" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditEvent_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "GovernanceDecision" (
    "id" TEXT NOT NULL,
    "operation" TEXT NOT NULL,
    "outcome" TEXT NOT NULL,
    "reasonCodes" TEXT[],
    "synthetic" BOOLEAN NOT NULL DEFAULT true,
    "decidedAt" TIMESTAMP(3) NOT NULL,
    "policyVersionId" TEXT NOT NULL,
    CONSTRAINT "GovernanceDecision_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ConnectorDefinition" (
    "id" TEXT NOT NULL,
    "connectorKey" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "synthetic" BOOLEAN NOT NULL DEFAULT true,
    "version" TEXT NOT NULL,
    "schemaVersion" TEXT NOT NULL,
    "capabilities" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ConnectorDefinition_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MetricDefinition" (
    "id" TEXT NOT NULL,
    "metricKey" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "unit" TEXT,
    "version" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MetricDefinition_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PolicyVersion_version_key" ON "PolicyVersion"("version");
CREATE UNIQUE INDEX "ConnectorDefinition_connectorKey_key" ON "ConnectorDefinition"("connectorKey");
CREATE UNIQUE INDEX "MetricDefinition_metricKey_key" ON "MetricDefinition"("metricKey");
CREATE INDEX "AuditEvent_eventType_occurredAt_idx" ON "AuditEvent"("eventType", "occurredAt");
CREATE INDEX "GovernanceDecision_operation_decidedAt_idx" ON "GovernanceDecision"("operation", "decidedAt");

ALTER TABLE "GovernanceDecision"
ADD CONSTRAINT "GovernanceDecision_policyVersionId_fkey"
FOREIGN KEY ("policyVersionId") REFERENCES "PolicyVersion"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;
