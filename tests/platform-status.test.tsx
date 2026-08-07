import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import PlatformStatusPage from "@/app/page";

describe("platform status page", () => {
  it("states the synthetic-only boundary", () => {
    render(<PlatformStatusPage />);
    expect(
      screen.getByRole("heading", { name: "Synthetic platform foundation" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Synthetic only")).toBeInTheDocument();
    expect(screen.getByText("External connectors")).toBeInTheDocument();
  });
});
