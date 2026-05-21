import { isPostgresDatabaseUrl } from "@/lib/db/database-url";

const PLACEHOLDER_PATTERN = /\@HOST[:/]|USER:PASSWORD|postgresql:\/\/USER@|\/DATABASE(\?|$)/i;

export function validateProductionDatabaseUrl(
  url: string | undefined,
  context = "production database",
): string {
  const trimmed = url?.trim() ?? "";

  if (!trimmed) {
    throw new Error(
      [
        `[${context}] DATABASE_URL is missing.`,
        "Copy .env.production.example → .env.production and paste your Railway Postgres URL.",
        "Railway: Postgres service → Connect → DATABASE_URL (public URL).",
      ].join("\n"),
    );
  }

  if (!isPostgresDatabaseUrl(trimmed)) {
    throw new Error(
      [
        `[${context}] DATABASE_URL must be PostgreSQL (postgresql:// or postgres://).`,
        "Local .env uses SQLite — use .env.production for Railway commands from your laptop.",
      ].join("\n"),
    );
  }

  if (PLACEHOLDER_PATTERN.test(trimmed)) {
    throw new Error(
      [
        `[${context}] DATABASE_URL still has placeholder text (HOST, USER, PASSWORD, or DATABASE).`,
        "Replace the entire value with the real URL from Railway → Postgres → Connect.",
      ].join("\n"),
    );
  }

  return trimmed;
}
