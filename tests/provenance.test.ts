import { describe, expect, it } from "vitest";

import { createSyntheticHumeViaAppleHealthMeasurement } from "@modules/measurements/provenance";
import { FixedClock } from "@/src/lib/clock";

describe("transport provenance", () => {
  it("preserves Hume as origin when Apple Health transports the record", () => {
    const measurement = createSyntheticHumeViaAppleHealthMeasurement(
      new FixedClock("2030-04-05T06:07:08.000Z"),
    );
    expect(measurement.provenance.originatingVendor).toBe("Hume");
    expect(measurement.provenance.transportSource).toBe("Apple Health");
    expect(measurement.provenance.originatingVendor).not.toBe("Apple");
    expect(measurement.provenance.ingestionTimestamp).toBe(
      "2030-04-05T06:07:08.000Z",
    );
  });
});
