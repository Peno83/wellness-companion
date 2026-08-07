/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: "ai-cannot-access-persistence",
      severity: "error",
      from: { path: "^src/modules/ai" },
      to: { path: "^(src/lib/prisma|@prisma/client|prisma)" },
    },
    {
      name: "connectors-must-not-access-persistence",
      severity: "error",
      from: { path: "^src/modules/connectors" },
      to: { path: "^(src/lib/prisma|@prisma/client|prisma)" },
    },
    {
      name: "ui-cannot-access-persistence",
      severity: "error",
      from: { path: "^(app|src/components)" },
      to: { path: "^(src/lib/prisma|@prisma/client|prisma)" },
    },
    {
      name: "source-selection-cannot-use-ai",
      severity: "error",
      from: { path: "^src/modules/source-selection" },
      to: { path: "^src/modules/ai" },
    },
    {
      name: "governance-cannot-depend-on-feature-flags",
      severity: "error",
      from: { path: "^src/modules/governance" },
      to: { path: "^src/modules/feature-flags" },
    },
    {
      name: "no-circular",
      severity: "error",
      from: {},
      to: { circular: true },
    },
  ],
  options: {
    doNotFollow: { path: "node_modules" },
    tsConfig: { fileName: "tsconfig.json" },
    enhancedResolveOptions: {
      exportsFields: ["exports"],
      conditionNames: ["import", "types", "default"],
    },
  },
};
