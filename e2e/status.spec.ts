import { expect, test } from "@playwright/test";

test("platform starts and exposes safe synthetic status", async ({
  page,
  request,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Synthetic platform foundation" }),
  ).toBeVisible();
  await expect(page.getByText("Synthetic only")).toBeVisible();

  const response = await request.get("/api/health");
  expect(response.ok()).toBe(true);
  expect(await response.json()).toEqual({
    status: "ok",
    version: "0.1.0",
    environment: "production",
  });
});
