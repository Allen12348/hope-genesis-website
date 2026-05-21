/** Resolves NextAuth secret — never falls back in production. */
export function resolveAuthSecret(): string | undefined {
  if (process.env.NEXTAUTH_SECRET) return process.env.NEXTAUTH_SECRET;
  if (process.env.NODE_ENV === "development") {
    return "local-dev-only-set-NEXTAUTH_SECRET-in-env";
  }
  return undefined;
}
