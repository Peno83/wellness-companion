import { describe, expect, it } from "vitest";

import { ServiceContainer } from "@/src/lib/container";
import { loadModules } from "@/src/lib/module-loader";

describe("module loader", () => {
  it("registers unique foundation modules", () => {
    const container = new ServiceContainer();
    const registered: string[] = [];
    loadModules(container, [
      { name: "governance", register: () => registered.push("governance") },
      { name: "audit", register: () => registered.push("audit") },
    ]);
    expect(registered).toEqual(["governance", "audit"]);
  });

  it("rejects duplicate module names", () => {
    const container = new ServiceContainer();
    expect(() =>
      loadModules(container, [
        { name: "governance", register: () => undefined },
        { name: "governance", register: () => undefined },
      ]),
    ).toThrow("Duplicate module name");
  });
});
