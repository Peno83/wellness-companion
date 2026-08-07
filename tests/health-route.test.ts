import { beforeEach, describe, expect, it } from "vitest";

import { GET } from "@/app/api/health/route";

describe("GET /api/health", () => {
  beforeEach(() => {
    process.env.DATABASE_URL =
      "postgresql://localhost:5432/wellness_platform?schema=public";
    process.env.APP_VERSION = "0.1.0";
    process.env.LOG_LEVEL = "info";
  });

  it("returns safe status without credentials or health information", async () => {
    const response = GET();
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      status: "ok",
      version: "0.1.0",
      environment: "test",
    });
  });
});
