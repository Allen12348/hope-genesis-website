/**
 * Validates .env.production DATABASE_URL before migrate/seed from your laptop.
 * Usage: npm run db:check:production
 */
import { config } from "dotenv";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const productionEnv = resolve(root, ".env.production");

if (!existsSync(productionEnv)) {
  console.error("Missing .env.production — run: copy .env.production.example .env.production");
  process.exit(1);
}

config({ path: productionEnv, override: true });

const url = process.env.DATABASE_URL?.trim() ?? "";

function fail(msg) {
  console.error(msg);
  process.exit(1);
}

if (!url) fail("DATABASE_URL is empty in .env.production. Paste Railway Postgres → Connect → DATABASE_URL.");

if (!/^postgres(ql)?:\/\//i.test(url)) {
  fail("DATABASE_URL must start with postgresql:// or postgres:// (not SQLite file:).");
}

if (/\@HOST[:/]|USER:PASSWORD|postgresql:\/\/USER@|\/DATABASE(\?|$)/i.test(url)) {
  fail("DATABASE_URL still has placeholders (HOST, USER, PASSWORD, DATABASE). Paste the real Railway URL.");
}

try {
  const parsed = new URL(url.replace(/^postgres:/i, "postgresql:"));
  const host = parsed.hostname;
  if (!host || host === "HOST") fail(`Invalid host in DATABASE_URL: ${host}`);
  console.log("OK — DATABASE_URL looks like PostgreSQL");
  console.log(`    host: ${host}`);
  console.log(`    database: ${parsed.pathname.replace(/^\//, "") || "(default)"}`);
  console.log("\nNext: npm run db:migrate:deploy && npm run db:seed:production");
} catch {
  fail("DATABASE_URL is not a valid URL. Copy it again from Railway.");
}
