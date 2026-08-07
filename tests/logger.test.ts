import { afterEach, describe, expect, it, vi } from "vitest";

import { FixedClock } from "@/src/lib/clock";
import { log } from "@/src/lib/logger";

const fixedClock = new FixedClock("2030-04-05T06:07:08.000Z");

function capture(message: string, context: Readonly<Record<string, unknown>>) {
  const output = vi.spyOn(console, "log").mockImplementation(() => undefined);
  log("info", message, context, fixedClock);
  return String(output.mock.calls[0]?.[0]);
}

afterEach(() => vi.restoreAllMocks());

describe("structured logger redaction", () => {
  it("redacts secrets under known keys", () => {
    const secret = `known-${"x".repeat(24)}`;
    const output = capture("safe", { password: secret });
    expect(output).not.toContain(secret);
    expect(output).toContain("[REDACTED]");
  });

  it("redacts a credential URL under an unknown dsn key", () => {
    const secret = [
      "postgresql",
      "://service:",
      "p".repeat(20),
      "@db.invalid/app",
    ].join("");
    expect(capture("safe", { dsn: secret })).not.toContain(secret);
  });

  it.each(["mysql", "mongodb", "redis"])(
    "redacts a credential-bearing %s URL",
    (scheme) => {
      const secret = `${scheme}://service:${"q".repeat(20)}@db.invalid/app`;
      expect(capture("safe", { endpoint: secret })).not.toContain(secret);
    },
  );

  it("redacts a bearer token embedded in a free-text message", () => {
    const secret = `Bearer ${"a".repeat(32)}`;
    expect(capture(`request used ${secret}`, {})).not.toContain(secret);
  });

  it("redacts nested values and values inside arrays", () => {
    const secret = `sk-${"A".repeat(40)}`;
    const output = capture("safe", {
      metadata: { integration: [{ value: secret }] },
    });
    expect(output).not.toContain(secret);
  });

  it("redacts representative provider, cloud, OAuth, and key material", () => {
    const secrets = [
      `sk-ant-${"B".repeat(40)}`,
      `ghp_${"C".repeat(40)}`,
      `AKIA${"D".repeat(16)}`,
      `DefaultEndpointsProtocol=https;AccountName=sample;AccountKey=${"E".repeat(40)};EndpointSuffix=core.windows.net`,
      `client_${"secret"}=${"F".repeat(24)}`,
      `api_${"key"}=${"H".repeat(24)}`,
      `eyJ${"i".repeat(20)}.${"j".repeat(24)}.${"k".repeat(24)}`,
      `-----${"BEGIN"} PRIVATE KEY-----\n${"G".repeat(48)}\n-----END PRIVATE KEY-----`,
    ];
    for (const secret of secrets) {
      expect(capture("safe", { diagnostic: secret })).not.toContain(secret);
    }
  });

  it("preserves an ordinary safe URL", () => {
    const safe = "https://status.example.invalid/health";
    expect(capture("safe", { url: safe })).toContain(safe);
  });

  it("preserves ordinary non-sensitive text", () => {
    const safe = "synthetic connector completed without network access";
    expect(capture(safe, { count: 3 })).toContain(safe);
  });
});
