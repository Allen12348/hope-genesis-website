import { config } from "dotenv";
import { resolve } from "node:path";
import { defineConfig, env } from "prisma/config";

// Prisma 6 with prisma.config.ts does not auto-load `.env` — load explicitly (local + CI).
config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), ".env.local"), override: true });

/**
 * Prisma CLI config (replaces deprecated `package.json#prisma`).
 * Migrations live in `prisma/migrations` (NOT the repo-root `migrations/` D1 SQL folder).
 * @see https://www.prisma.io/docs/orm/reference/prisma-config-reference
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
