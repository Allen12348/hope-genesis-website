export type AdminEnvValidation = {
  ok: boolean;
  missing: string[];
  warnings: string[];
};

/**
 * Validates env vars required for admin auth + database.
 * Does not log secret values.
 */
export function validateAdminEnvironment(): AdminEnvValidation {
  const missing: string[] = [];
  const warnings: string[] = [];

  if (!process.env.DATABASE_URL?.trim()) {
    missing.push("DATABASE_URL");
  }

  if (!process.env.NEXTAUTH_SECRET?.trim()) {
    if (process.env.NODE_ENV === "production") {
      missing.push("NEXTAUTH_SECRET");
    } else {
      warnings.push("NEXTAUTH_SECRET (using dev fallback)");
    }
  }

  if (!process.env.NEXTAUTH_URL?.trim()) {
    if (process.env.NODE_ENV === "production") {
      warnings.push("NEXTAUTH_URL (recommended in production)");
    }
  }

  return { ok: missing.length === 0, missing, warnings };
}
