/**
 * Copies prisma/schema.prisma → deploy/prisma/schema.prisma with PostgreSQL datasource.
 * Run after model changes: node scripts/sync-postgres-prisma-schema.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "prisma", "schema.prisma");
const dest = join(root, "deploy", "prisma", "schema.prisma");

let text = readFileSync(src, "utf8");
text = text.replace(
  /generator client \{[\s\S]*?\}/,
  `generator client {
  provider      = "prisma-client-js"
  output        = "../../generated/prisma-postgres"
  binaryTargets = ["native", "debian-openssl-1.1.x"]
}`,
);
text = text.replace(
  /datasource db \{\s*provider = "sqlite"\s*url\s*=\s*env\("DATABASE_URL"\)\s*\}/,
  `datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}`,
);
text = `// Production / Railway — PostgreSQL (synced from prisma/schema.prisma)\n// Regenerate: node scripts/sync-postgres-prisma-schema.mjs\n\n${text.replace(/^\/\/ Local development uses SQLite[\s\S]*?@see[^\n]+\n\n/, "")}`;

mkdirSync(dirname(dest), { recursive: true });
writeFileSync(dest, text, "utf8");
console.log("Wrote deploy/prisma/schema.prisma (postgresql)");
