import { describe, expect, it } from "vitest";

import {
  analyseMethodologyTrend,
  asMetricIdentifier,
  assertTrendAggregationAllowed,
  type SourceMethodologyPeriod,
} from "@modules/source-selection";

const metric = asMetricIdentifier("synthetic-hrv-trend");

function period(
  sourceIdentifier: string,
  methodologyIdentifier: string,
  compatibilityGroup: string,
  startTimestamp: string,
  overrides: Partial<SourceMethodologyPeriod> = {},
): SourceMethodologyPeriod {
  return {
    sourceIdentifier,
    methodologyIdentifier,
    compatibilityGroup,
    measurementClassification: "device_measured",
    estimateState: "direct",
    startTimestamp,
    endTimestamp: new Date(
      new Date(startTimestamp).getTime() + 86_400_000,
    ).toISOString(),
    ...overrides,
  };
}

describe("mixed-methodology disclosure foundation", () => {
  it("discloses a synthetic WHOOP to Oura methodology switch", () => {
    const analysis = analyseMethodologyTrend(metric, [
      period(
        "whoop-synthetic",
        "whoop-rmssd",
        "whoop-rmssd",
        "2030-01-01T00:00:00.000Z",
      ),
      period(
        "oura-synthetic",
        "oura-rmssd",
        "oura-rmssd",
        "2030-02-01T00:00:00.000Z",
      ),
    ]);
    expect(analysis.breaks[0]).toMatchObject({
      previousSourceIdentifier: "whoop-synthetic",
      newSourceIdentifier: "oura-synthetic",
      effectiveTimestamp: "2030-02-01T00:00:00.000Z",
      compatibilityStatus: "incompatible",
    });
    expect(analysis.warning?.mixedMethodology).toBe(true);
  });

  it("preserves period boundaries for a Hume to another scale switch", () => {
    const periods = [
      period(
        "hume-synthetic",
        "bioimpedance-weight",
        "scale-a",
        "2030-01-01T00:00:00.000Z",
      ),
      period(
        "other-scale-synthetic",
        "load-cell-weight",
        "scale-b",
        "2030-03-01T00:00:00.000Z",
      ),
    ];
    const analysis = analyseMethodologyTrend(
      asMetricIdentifier("synthetic-weight-trend"),
      periods,
    );
    expect(analysis.periods).toEqual(periods);
    expect(analysis.breaks).toHaveLength(1);
  });

  it("marks direct to estimated measurement as incompatible", () => {
    const analysis = analyseMethodologyTrend(metric, [
      period(
        "device-synthetic",
        "overnight-hrv",
        "hrv",
        "2030-01-01T00:00:00.000Z",
      ),
      period(
        "device-synthetic",
        "overnight-hrv",
        "hrv",
        "2030-02-01T00:00:00.000Z",
        {
          estimateState: "estimated",
        },
      ),
    ]);
    expect(analysis.breaks[0]?.reason).toBe("estimate_state_changed");
    expect(analysis.aggregationAllowed).toBe(false);
  });

  it("marks manual to device measurement as incompatible", () => {
    const analysis = analyseMethodologyTrend(metric, [
      period(
        "manual-synthetic",
        "manual-entry",
        "hrv",
        "2030-01-01T00:00:00.000Z",
        {
          measurementClassification: "manual",
        },
      ),
      period(
        "device-synthetic",
        "overnight-hrv",
        "hrv",
        "2030-02-01T00:00:00.000Z",
      ),
    ]);
    expect(analysis.breaks[0]?.reason).toBe(
      "measurement_classification_changed",
    );
  });

  it("continues without warning for a compatible same-source methodology", () => {
    const analysis = analyseMethodologyTrend(metric, [
      period(
        "whoop-synthetic",
        "whoop-rmssd",
        "rmssd",
        "2030-01-01T00:00:00.000Z",
      ),
      period(
        "whoop-synthetic",
        "whoop-rmssd",
        "rmssd",
        "2030-02-01T00:00:00.000Z",
      ),
    ]);
    expect(analysis.breaks).toHaveLength(0);
    expect(analysis.warning).toBeNull();
    expect(analysis.aggregationAllowed).toBe(true);
  });

  it("surfaces incompatible source methods with structured warning text", () => {
    const analysis = analyseMethodologyTrend(metric, [
      period("source-a", "method-a", "group-a", "2030-01-01T00:00:00.000Z"),
      period("source-b", "method-b", "group-b", "2030-02-01T00:00:00.000Z"),
    ]);
    expect(analysis.warning).toMatchObject({
      compatibilityStatus: "incompatible",
      policyVersion: "methodology-synthetic-1.0.0",
    });
    expect(analysis.warning?.warningText).toContain("aggregation is blocked");
  });

  it("blocks incompatible aggregation unless explicit governed policy allows it", () => {
    const analysis = analyseMethodologyTrend(metric, [
      period("source-a", "method-a", "group-a", "2030-01-01T00:00:00.000Z"),
      period("source-b", "method-b", "group-b", "2030-02-01T00:00:00.000Z"),
    ]);
    expect(() => assertTrendAggregationAllowed(analysis)).toThrow(
      "requires explicit governed policy",
    );
    expect(() =>
      assertTrendAggregationAllowed(analysis, {
        approvedByGovernance: true,
        allowIncompatibleMethodologies: true,
        policyVersion: "governed-exception-1.0.0",
      }),
    ).not.toThrow();
  });
});
