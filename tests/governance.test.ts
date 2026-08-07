import { describe, expect, it } from "vitest";

import { ApplicationError } from "@/src/lib/errors";
import { FixedClock } from "@/src/lib/clock";
import {
  requireGovernanceResult,
  SyntheticOnlyGovernanceEngine,
} from "@modules/governance";

describe("governance foundation", () => {
  const clock = new FixedClock("2030-04-05T06:07:08.000Z");
  it("fails closed when a result is missing", () => {
    expect(() => requireGovernanceResult(undefined)).toThrowError(
      ApplicationError,
    );
  });

  it("denies non-synthetic operations", () => {
    const result = new SyntheticOnlyGovernanceEngine(clock).evaluate({
      operation: "connector.sync",
      synthetic: false,
      policyVersion: "1.1.1",
    });
    expect(result.decision).toBe("deny");
    expect(() => requireGovernanceResult(result)).toThrowError(
      "Operation denied by governance.",
    );
  });

  it("allows an explicitly synthetic operation", () => {
    const result = new SyntheticOnlyGovernanceEngine(clock).evaluate({
      operation: "connector.synthetic_sync",
      synthetic: true,
      policyVersion: "1.1.1",
    });
    expect(requireGovernanceResult(result).decision).toBe("allow");
    expect(result.decidedAt).toBe("2030-04-05T06:07:08.000Z");
  });
});
