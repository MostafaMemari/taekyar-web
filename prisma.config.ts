import { readFileSync } from "node:fs";

import { defineConfig, env } from "prisma/config";

function loadDotEnvIfPresent(): void {
  try {
    const contents = readFileSync(".env", "utf8").replace(/^\uFEFF/, "");
    for (const rawLine of contents.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) continue;
      const match = line.match(/^([\w.-]+)\s*=\s*(.*)$/);
      if (!match) continue;
      const key = match[1];
      let value = match[2].trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      if (!(key in process.env)) {
        process.env[key] = value;
      }
    }
  } catch {
    return;
  }
}

loadDotEnvIfPresent();

export default defineConfig({
  schema: "prisma/schema.prisma",

  migrations: {
    path: "prisma/migrations",
    seed: "node prisma/seed.ts",
  },

  datasource: {
    url: env("DATABASE_URL"),
  },
});
