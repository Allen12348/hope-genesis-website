import { config } from "dotenv";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { isPostgresDatabaseUrl } from "../lib/db/database-url";
import { validateProductionDatabaseUrl } from "../lib/db/validate-production-database-url";

const root = process.cwd();
const productionEnv = resolve(root, ".env.production");

function wantsProductionSeed(): boolean {
  if (process.env.SEED_TARGET === "production" || process.argv.includes("--production")) {
    return true;
  }
  // `prisma db seed --config prisma.config.postgres.ts` does not set SEED_TARGET — detect Postgres URL.
  return isPostgresDatabaseUrl(process.env.DATABASE_URL);
}

/** Load env for seeds — `.env.production` on Railway/Postgres, else local `.env` (SQLite). */
export function loadSeedEnv(): void {
  if (wantsProductionSeed()) {
    if (!existsSync(productionEnv)) {
      throw new Error(
        "Missing .env.production. Copy .env.production.example and paste your Railway DATABASE_URL.",
      );
    }
    config({ path: productionEnv, override: true });
    validateProductionDatabaseUrl(process.env.DATABASE_URL, "db:seed:production");
    process.env.SEED_TARGET = "production";
    return;
  }

  config({ path: resolve(root, ".env") });
}
