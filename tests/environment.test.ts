import { describe, expect, it } from "vitest";

import { parseEnvironment } from "@/src/lib/env";

describe("environment validation", () => {
  it("accepts the synthetic development environment", () => {
    expect(
      parseEnvironment({
        NODE_ENV: "development",
        DATABASE_URL:
          "postgresql://localhost:5432/wellness_platform?schema=public",
        APP_VERSION: "0.1.0",
        LOG_LEVEL: "info",
      }),
    ).toMatchObject({ NODE_ENV: "development", APP_VERSION: "0.1.0" });
  });

  it("fails when the database URL is missing", () => {
    expect(() => parseEnvironment({ NODE_ENV: "test" })).toThrow();
  });
});
