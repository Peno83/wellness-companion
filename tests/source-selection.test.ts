import { describe, expect, it } from "vitest";

import {
  asMetricIdentifier,
  createMethodologyBreak,
  selectCanonicalSource,
  syntheticHrvCandidates,
  type FallbackPreference,
  type SourcePreference,
} from "@modules/source-selection";
import { identifyTransportedDuplicates } from "@modules/source-reconciliation";
import { FixedClock } from "@/src/lib/clock";

describe("deterministic metric source selection", () => {
  const metric = asMetricIdentifier("hrv");
  const clock = new FixedClock("2030-04-05T06:07:08.000Z");

  it("selects the original WHOOP synthetic source with greatest coverage", () => {
    const decision = selectCanonicalSource(
      metric,
      syntheticHrvCandidates(),
      undefined,
      undefined,
      clock,
    );
    expect(decision.selected.sourceIdentifier).toBe("whoop-synthetic");
    expect(decision.explanation.reasons).toContain("original source");
    expect(decision.explanation.reasons).toContain("30 valid days");
    expect(decision.evaluations[0]?.evaluatedAt).toBe(
      "2030-04-05T06:07:08.000Z",
    );
  });

  it("identifies the transported Apple Health copy as a duplicate", () => {
    expect(
      identifyTransportedDuplicates(syntheticHrvCandidates()),
    ).toHaveLength(1);
  });

  it("represents user preference and ordered fallback without vendor rules", () => {
    const preference: SourcePreference = {
      mode: "preferred_with_fallback",
      preferredSourceIdentifier: "garmin-synthetic",
    };
    const fallback: FallbackPreference = {
      metricIdentifier: metric,
      orderedSourceIdentifiers: ["whoop-synthetic"],
    };
    expect(
      selectCanonicalSource(
        metric,
        syntheticHrvCandidates(),
        preference,
        fallback,
      ).selected.sourceIdentifier,
    ).toBe("garmin-synthetic");
  });

  it("creates a methodology break only when the source changes", () => {
    expect(
      createMethodologyBreak(
        metric,
        "whoop-synthetic",
        "garmin-synthetic",
        clock,
      ),
    ).toMatchObject({
      reason: "source_changed",
      occurredAt: "2030-04-05T06:07:08.000Z",
    });
    expect(
      createMethodologyBreak(
        metric,
        "whoop-synthetic",
        "whoop-synthetic",
        clock,
      ),
    ).toBeNull();
  });

  it("contains no permanent vendor-superiority field", () => {
    const serialized = JSON.stringify(
      selectCanonicalSource(metric, syntheticHrvCandidates()),
    );
    expect(serialized).not.toMatch(/superior|vendorPriority|preferredVendor/i);
  });
});
