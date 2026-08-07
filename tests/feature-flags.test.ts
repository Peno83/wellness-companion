import { describe, expect, it } from "vitest";

import {
  defaultFeatureFlags,
  featureFlagKeys,
  governanceIsFeatureFlagged,
} from "@modules/feature-flags";

describe("feature flag defaults", () => {
  it("defaults every optional capability off", () => {
    expect(featureFlagKeys).toHaveLength(16);
    expect(
      Object.values(defaultFeatureFlags).every((enabled) => !enabled),
    ).toBe(true);
  });

  it("does not expose governance as a flag", () => {
    expect(governanceIsFeatureFlagged).toBe(false);
    expect(featureFlagKeys).not.toContain("governance");
  });
});
