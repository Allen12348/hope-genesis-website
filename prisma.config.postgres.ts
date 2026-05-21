import { config } from "dotenv";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig, env } from "prisma/config";
import { validateProductionDatabaseUrl } from "./lib/db/validate-production-database-url";

const root = process.cwd();
const productionEnv = resolve(root, ".env.production");

// PostgreSQL commands only — never load local `.env` (SQLite file:./dev.db).
// Laptop: `.env.production`. Railway shell: DATABASE_URL from service variables.
if (existsSync(productionEnv)) {
  config({ path: productionEnv, override: true });
} else if (!process.env.DATABASE_URL?.trim()) {
  throw new Error(
    "Missing DATABASE_URL. Copy .env.production.example → .env.production (laptop) or set DATABASE_URL on Railway.",
  );
}

validateProductionDatabaseUrl(process.env.DATABASE_URL, "db:migrate:deploy");

/**
 * PostgreSQL migrations for Railway / Node production.
 * Local SQLite dev uses `prisma.config.ts` + `prisma/migrations` (SQLite SQL).
 */
export default defineConfig({
  schema: "deploy/prisma/schema.prisma",
  migrations: {
    path: "deploy/prisma/migrations",
    seed: "cross-env SEED_MODE=upsert SEED_TARGET=production npx tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
