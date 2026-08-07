import { ApplicationError } from "@/src/lib/errors";
import { systemClock, type Clock } from "@/src/lib/clock";

export type GovernanceDecision = "allow" | "deny";

export interface GovernanceContext {
  readonly operation: string;
  readonly synthetic: boolean;
  readonly policyVersion: string;
}

export interface GovernanceRule {
  readonly id: string;
  evaluate(context: GovernanceContext): GovernanceResult;
}

export interface GovernanceViolation {
  readonly ruleId: string;
  readonly reason: string;
}

export interface GovernanceResult {
  readonly decision: GovernanceDecision;
  readonly policyVersion: string;
  readonly decidedAt: string;
  readonly violations: readonly GovernanceViolation[];
}

export interface GovernanceEngine {
  evaluate(context: GovernanceContext): GovernanceResult | undefined;
}

export function requireGovernanceResult(
  result: GovernanceResult | undefined,
): GovernanceResult {
  if (!result)
    throw new ApplicationError(
      "GOVERNANCE_MISSING",
      "Governance result is required.",
    );
  if (result.decision !== "allow")
    throw new ApplicationError(
      "GOVERNANCE_DENIED",
      "Operation denied by governance.",
    );
  return result;
}

export class SyntheticOnlyGovernanceEngine implements GovernanceEngine {
  constructor(private readonly clock: Clock = systemClock) {}

  evaluate(context: GovernanceContext): GovernanceResult {
    if (!context.synthetic) {
      return {
        decision: "deny",
        policyVersion: context.policyVersion,
        decidedAt: this.clock.now().toISOString(),
        violations: [
          {
            ruleId: "synthetic-only",
            reason: "Phase 2A.1 permits synthetic operations only.",
          },
        ],
      };
    }
    return {
      decision: "allow",
      policyVersion: context.policyVersion,
      decidedAt: this.clock.now().toISOString(),
      violations: [],
    };
  }
}
