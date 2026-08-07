import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  retries: process.env.CI ? 2 : 0,
  use: { baseURL: "http://127.0.0.1:3100", trace: "retain-on-failure" },
  ...(process.env.PLAYWRIGHT_EXTERNAL_SERVER
    ? {}
    : {
        webServer: {
          command: "node ./node_modules/next/dist/bin/next start -p 3100",
          url: "http://127.0.0.1:3100/api/health",
          reuseExistingServer: !process.env.CI,
          timeout: 120_000,
          env: {
            DATABASE_URL:
              "postgresql://localhost:5432/wellness_platform?schema=public",
            APP_VERSION: "0.1.0",
            LOG_LEVEL: "info",
          },
        },
      }),
});
