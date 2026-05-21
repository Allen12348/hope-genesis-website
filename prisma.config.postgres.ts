import { config } from "dotenv";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig, env } from "prisma/config";
import { validateProductionDatabaseUrl } from "./lib/db/validate-production-database-url";

const root = process.cwd();
const productionEnv = resolve(root, ".env.production");

// PostgreSQL commands only — never load local `.env` (SQLite file:./dev.db).
if (existsSync(productionEnv)) {
  config({ path: productionEnv, override: true });
} else {
  throw new Error(
    "Missing .env.production. Copy .env.production.example and paste your Railway DATABASE_URL.",
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
