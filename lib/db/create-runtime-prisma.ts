import { Prisma, type PrismaClient as SqlitePrismaClient } from "@prisma/client";
import type { PrismaClient as PostgresPrismaClient } from "../../generated/prisma-postgres";
import { isPostgresDatabaseUrl } from "@/lib/db/database-url";

export type RuntimePrismaClient = SqlitePrismaClient | PostgresPrismaClient;

function prismaLogOptions(): Prisma.LogLevel[] | Prisma.LogDefinition[] {
  if (process.env.PRISMA_LOG_QUERIES === "true") {
    return [
      { emit: "event", level: "query" },
      { emit: "stdout", level: "error" },
      { emit: "stdout", level: "warn" },
    ];
  }
  return process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"];
}

/** Prisma client for the app runtime — SQLite locally, PostgreSQL on Railway. */
export async function createRuntimePrisma(): Promise<RuntimePrismaClient> {
  const url = process.env.DATABASE_URL?.trim() ?? "";
  const log = prismaLogOptions();

  if (isPostgresDatabaseUrl(url)) {
    const { PrismaClient } = await import("../../generated/prisma-postgres");
    return new PrismaClient({ log });
  }

  const { PrismaClient } = await import("@prisma/client");
  return new PrismaClient({ log });
}
