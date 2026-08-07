import { describe, expect, it, vi } from "vitest";

import {
  SyntheticGarminConnector,
  SyntheticHumeConnector,
  SyntheticWhoopConnector,
} from "@modules/connectors";

describe("synthetic connectors", () => {
  it.each([
    new SyntheticWhoopConnector(),
    new SyntheticGarminConnector(),
    new SyntheticHumeConnector(),
  ])(
    "identifies $definition.displayName as synthetic and performs no network calls",
    async (connector) => {
      const fetchSpy = vi.spyOn(globalThis, "fetch");
      const result = await connector.sync({
        syntheticRunId: "synthetic-run",
        from: "2026-01-01T00:00:00.000Z",
        to: "2026-01-02T00:00:00.000Z",
      });
      expect(connector.definition.synthetic).toBe(true);
      expect(result.networkCalls).toBe(0);
      expect(fetchSpy).not.toHaveBeenCalled();
      fetchSpy.mockRestore();
    },
  );
});
