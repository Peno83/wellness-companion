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
    expect(decision.selected?.sourceIdentifier).toBe("whoop-synthetic");
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

  it("automatic mode ignores a supplied fixed preference", () => {
    const decision = selectCanonicalSource(
      metric,
      syntheticHrvCandidates(),
      { mode: "automatic", preferredSourceIdentifier: "garmin-synthetic" },
      undefined,
      clock,
    );
    expect(decision.selected?.sourceIdentifier).toBe("whoop-synthetic");
    expect(decision.outcome).toBe("automatic_selected");
  });

  it("selects a valid fixed user preference", () => {
    const decision = selectCanonicalSource(
      metric,
      syntheticHrvCandidates(),
      {
        mode: "user_preferred",
        preferredSourceIdentifier: "garmin-synthetic",
      },
      undefined,
      clock,
    );
    expect(decision.selected?.sourceIdentifier).toBe("garmin-synthetic");
    expect(decision.outcome).toBe("preferred_selected");
    expect(decision.preferenceSatisfied).toBe(true);
  });

  it("returns an explicit unsatisfied state for an unavailable fixed preference", () => {
    const decision = selectCanonicalSource(
      metric,
      syntheticHrvCandidates(),
      {
        mode: "user_preferred",
        preferredSourceIdentifier: "unavailable-synthetic",
      },
      undefined,
      clock,
    );
    expect(decision.selected).toBeNull();
    expect(decision.outcome).toBe("preference_unsatisfied");
    expect(decision.preferenceSatisfied).toBe(false);
    expect(decision.explanation.preferenceMessage).toContain(
      "automatic substitution is prohibited",
    );
  });

  it("uses an ordered fallback and labels it explicitly", () => {
    const preference: SourcePreference = {
      mode: "preferred_with_fallback",
      preferredSourceIdentifier: "unavailable-synthetic",
    };
    const fallback: FallbackPreference = {
      metricIdentifier: metric,
      orderedSourceIdentifiers: ["whoop-synthetic"],
    };
    const decision = selectCanonicalSource(
      metric,
      syntheticHrvCandidates(),
      preference,
      fallback,
      clock,
    );
    expect(decision.selected?.sourceIdentifier).toBe("whoop-synthetic");
    expect(decision.outcome).toBe("fallback_selected");
    expect(decision.explanation.fallbackUsed).toBe(true);
  });

  it("walks multiple fallbacks in configured order", () => {
    const decision = selectCanonicalSource(
      metric,
      syntheticHrvCandidates(),
      {
        mode: "preferred_with_fallback",
        preferredSourceIdentifier: "missing-primary",
      },
      {
        metricIdentifier: metric,
        orderedSourceIdentifiers: ["missing-fallback", "garmin-synthetic"],
      },
      clock,
    );
    expect(decision.selected?.sourceIdentifier).toBe("garmin-synthetic");
    expect(decision.fallbackSourceIdentifier).toBe("garmin-synthetic");
  });

  it("restores automatic ranking when mode returns to automatic", () => {
    const decision = selectCanonicalSource(
      metric,
      syntheticHrvCandidates(),
      { mode: "automatic", preferredSourceIdentifier: "garmin-synthetic" },
      undefined,
      clock,
    );
    expect(decision.selected?.sourceIdentifier).toBe("whoop-synthetic");
  });

  it("is deterministic across repeated evaluations", () => {
    const decisions = Array.from({ length: 5 }, () =>
      selectCanonicalSource(
        metric,
        syntheticHrvCandidates(),
        undefined,
        undefined,
        clock,
      ),
    );
    expect(
      new Set(decisions.map((decision) => JSON.stringify(decision))),
    ).toHaveLength(1);
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
