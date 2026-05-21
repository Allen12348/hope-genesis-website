/**
 * Prisma client generation for postinstall / build.
 * Does not connect to the database — only needs a valid DATABASE_URL shape for the CLI config.
 */
import { spawnSync } from "node:child_process";
import { config } from "dotenv";
import { resolve } from "node:path";

const root = process.cwd();
config({ path: resolve(root, ".env") });
config({ path: resolve(root, ".env.local"), override: true });

/** Placeholder when Railway/CI has not injected DATABASE_URL yet (generate-only). */
const BUILD_PLACEHOLDER = "postgresql://build:build@127.0.0.1:5432/build";

let url = process.env.DATABASE_URL?.trim();
if (!url) {
  process.env.DATABASE_URL = BUILD_PLACEHOLDER;
  url = BUILD_PLACEHOLDER;
}

const forcePostgres = process.argv.includes("--postgres");
const forceSqlite = process.argv.includes("--sqlite");

const isPostgres =
  url.startsWith("postgresql://") || url.startsWith("postgres://");

const schema = forcePostgres
  ? "deploy/prisma/schema.prisma"
  : forceSqlite
    ? "prisma/schema.prisma"
    : isPostgres
      ? "deploy/prisma/schema.prisma"
      : "prisma/schema.prisma";

const npx = process.platform === "win32" ? "npx.cmd" : "npx";
const result = spawnSync(
  npx,
  ["prisma", "generate", "--schema", schema],
  { stdio: "inherit", env: process.env, shell: process.platform === "win32" },
);

process.exit(result.status ?? 1);
