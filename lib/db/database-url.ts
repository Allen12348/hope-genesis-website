/** True when DATABASE_URL targets PostgreSQL (Railway production). */
export function isPostgresDatabaseUrl(url?: string): boolean {
  return Boolean(url?.trim() && /^postgres(ql)?:\/\//i.test(url.trim()));
}
