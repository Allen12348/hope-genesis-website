import { config } from "dotenv";
import { resolve } from "node:path";
import { defineConfig, env } from "prisma/config";

// Production (Railway, VPS): load `.env.production` when present, else `.env`.
config({ path: resolve(process.cwd(), ".env.production") });
config({ path: resolve(process.cwd(), ".env"), override: false });

/**
 * PostgreSQL migrations for Railway / Node production.
 * Local SQLite dev uses `prisma.config.ts` + `prisma/migrations` (SQLite SQL).
 */
export default defineConfig({
  schema: "deploy/prisma/schema.prisma",
  migrations: {
    path: "deploy/prisma/migrations",
    seed: "npx tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
