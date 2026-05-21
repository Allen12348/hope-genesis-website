import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import type { PrismaClient as SqlitePrismaClient } from "@prisma/client";
import { createRuntimePrisma, type RuntimePrismaClient } from "@/lib/db/create-runtime-prisma";

const globalForPrisma = globalThis as unknown as {
  prisma?: RuntimePrismaClient;
  prismaInit?: Promise<RuntimePrismaClient>;
};

function findProjectRoot(): string {
  let dir = process.cwd();
  for (let i = 0; i < 16; i++) {
    if (existsSync(path.join(dir, "package.json")) && existsSync(path.join(dir, "prisma", "schema.prisma"))) {
      return dir;
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return process.cwd();
}

function absolutizeRelativeSqliteDatabaseUrl(): void {
  const raw = process.env.DATABASE_URL?.trim();
  if (!raw?.toLowerCase().startsWith("file:")) return;

  try {
    const resolved = fileURLToPath(raw);
    if (path.isAbsolute(resolved)) {
      process.env.DATABASE_URL = pathToFileURL(resolved).href;
      return;
    }
  } catch {
    /* relative file: URL */
  }

  const prismaDir = path.join(findProjectRoot(), "prisma");
  const subpath = raw
    .replace(/^file:/i, "")
    .replace(/^\/+/, "")
    .replace(/^\.\//, "");

  if (path.isAbsolute(subpath)) {
    process.env.DATABASE_URL = pathToFileURL(subpath).href;
    return;
  }

  process.env.DATABASE_URL = pathToFileURL(path.resolve(prismaDir, subpath)).href;
}

absolutizeRelativeSqliteDatabaseUrl();

async function initPrisma(): Promise<RuntimePrismaClient> {
  return createRuntimePrisma();
}

/** App-facing Prisma handle — SQLite and Postgres schemas are kept in sync. */
export async function getPrisma(): Promise<SqlitePrismaClient> {
  if (globalForPrisma.prisma) return globalForPrisma.prisma as SqlitePrismaClient;

  if (!globalForPrisma.prismaInit) {
    globalForPrisma.prismaInit = initPrisma().then((client) => {
      globalForPrisma.prisma = client;
      return client;
    });
  }

  return (await globalForPrisma.prismaInit) as SqlitePrismaClient;
}

/** Singleton Prisma — resolves Postgres or SQLite from DATABASE_URL. */
export const prisma = new Proxy({} as SqlitePrismaClient, {
  get(_target, prop) {
    if (prop === "then") return undefined;

    const key = String(prop);
    if (key.startsWith("$") || key.startsWith("_")) {
      return (...args: unknown[]) =>
        getPrisma().then((client) => {
          const fn = (client as unknown as Record<string, (...a: unknown[]) => unknown>)[key];
          if (typeof fn !== "function") {
            throw new Error(`Prisma: "${key}" is not a function on PrismaClient`);
          }
          return fn.apply(client, args);
        });
    }

    return new Proxy(
      {},
      {
        get(_modelTarget, method) {
          if (method === "then") return undefined;
          const methodName = String(method);
          return (...args: unknown[]) =>
            getPrisma().then((client) => {
              const model = (client as unknown as Record<string, Record<string, unknown>>)[key];
              const fn = model?.[methodName];
              if (typeof fn === "function") return fn.apply(model, args);
              return fn;
            });
        },
      },
    );
  },
});
