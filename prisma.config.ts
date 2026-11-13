import { defineConfig, env } from "prisma/config";

const databaseUrl = process.env.DATABASE_URL;

export default defineConfig({
  schema: "prisma/schema.prisma",

  migrations: {
    path: "prisma/migrations",
    seed: "node prisma/seed.ts",
  },

  datasource: {
    url: databaseUrl ? databaseUrl.replace("-pooler.", ".") : env("DATABASE_URL"),
  },
});
