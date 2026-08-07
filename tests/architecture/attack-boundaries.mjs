import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const dependencyCruiser = resolve(
  repositoryRoot,
  "node_modules/dependency-cruiser/bin/dependency-cruise.mjs",
);
const configuration = resolve(repositoryRoot, ".dependency-cruiser.cjs");

const attacks = [
  {
    name: "AI to persistence",
    fixture: "ai-persistence",
    entry: "src/modules/ai/index.ts",
    rule: "ai-cannot-access-persistence",
  },
  {
    name: "source selection to AI",
    fixture: "source-selection-ai",
    entry: "src/modules/source-selection/engine.ts",
    rule: "source-selection-cannot-use-ai",
  },
  {
    name: "connector to persistence",
    fixture: "connector-persistence",
    entry: "src/modules/connectors/index.ts",
    rule: "connectors-must-not-access-persistence",
  },
  {
    name: "UI to persistence",
    fixture: "ui-persistence",
    entry: "app/page.ts",
    rule: "ui-cannot-access-persistence",
  },
  {
    name: "governance to feature flags",
    fixture: "governance-flags",
    entry: "src/modules/governance/index.ts",
    rule: "governance-cannot-depend-on-feature-flags",
  },
  {
    name: "circular dependency",
    fixture: "circular-dependency",
    entry: "src/modules/alpha/index.ts",
    rule: "no-circular",
  },
];

for (const attack of attacks) {
  const workingDirectory = resolve(
    repositoryRoot,
    "tests/architecture/fixtures",
    attack.fixture,
  );
  const result = spawnSync(
    process.execPath,
    [
      dependencyCruiser,
      attack.entry,
      "--config",
      configuration,
      "--ts-config",
      resolve(repositoryRoot, "tsconfig.json"),
    ],
    { cwd: workingDirectory, encoding: "utf8" },
  );
  const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`;
  if (result.status === 0 || !output.includes(attack.rule)) {
    process.stderr.write(output);
    throw new Error(
      `${attack.name} attack did not fail with ${attack.rule}; exit=${result.status}.`,
    );
  }
  process.stdout.write(
    `PASS: ${attack.name} rejected with exit ${result.status}.\n`,
  );
}
