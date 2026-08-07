import { describe, expect, it, vi } from "vitest";

import { FixedClock, SystemClock } from "@/src/lib/clock";
import { createPlatformEvent } from "@modules/events";

describe("clock abstraction", () => {
  it("provides deterministic time to domain events", () => {
    const event = createPlatformEvent(
      "synthetic-event-1",
      "SyntheticSyncCompleted",
      { connector: "synthetic" },
      new FixedClock("2030-04-05T06:07:08.000Z"),
    );
    expect(event.occurredAt).toBe("2030-04-05T06:07:08.000Z");
  });

  it("uses real system time in production", () => {
    const now = new Date("2031-01-02T03:04:05.000Z");
    vi.useFakeTimers();
    vi.setSystemTime(now);
    expect(new SystemClock().now()).toEqual(now);
    vi.useRealTimers();
  });
});
