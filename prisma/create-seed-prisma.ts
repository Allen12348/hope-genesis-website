import type { PrismaClient as SqlitePrismaClient } from "@prisma/client";
import type { PrismaClient as PostgresPrismaClient } from "../generated/prisma-postgres";
import { isPostgresDatabaseUrl } from "../lib/db/database-url";

export type SeedPrismaClient = SqlitePrismaClient | PostgresPrismaClient;

/** Prisma client matching DATABASE_URL — SQLite (@prisma/client) or Postgres (generated). */
export async function createSeedPrisma(): Promise<SeedPrismaClient> {
  const url = process.env.DATABASE_URL?.trim() ?? "";

  if (isPostgresDatabaseUrl(url)) {
    const { PrismaClient } = await import("../generated/prisma-postgres");
    return new PrismaClient();
  }

  if (process.env.SEED_TARGET === "production") {
    throw new Error(
      "Production seed requires a PostgreSQL DATABASE_URL in .env.production. " +
        "Paste the full Railway Postgres URL (not SQLite file:./dev.db).",
    );
  }

  const { PrismaClient } = await import("@prisma/client");
  return new PrismaClient();
}
