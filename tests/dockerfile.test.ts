import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

const dockerfile = readFileSync(resolve(process.cwd(), "Dockerfile"), "utf8");
const runtimeStage =
  dockerfile.split("FROM node:24-alpine AS runtime")[1] ?? "";

describe("runtime container security", () => {
  it("runs the final image as a non-root user", () => {
    const users = [...runtimeStage.matchAll(/^USER\s+(.+)$/gm)].map((match) =>
      match[1]?.trim(),
    );
    expect(users.at(-1)).toBe("node");
    expect(users.at(-1)).not.toMatch(/^(?:root|0)$/i);
  });

  it("owns copied runtime files without broad permissions", () => {
    expect(runtimeStage).toContain("--chown=node:node");
    expect(dockerfile).not.toMatch(/chmod\s+777/i);
  });

  it("does not bake a database URL into any image stage", () => {
    expect(dockerfile).not.toContain("DATABASE_URL");
    expect(dockerfile).not.toContain("postgresql://");
  });
});
