/**
 * Safe JSON.parse for CMS / DB string columns — never throws.
 */
export function safeJsonParse<T>(value: unknown, fallback: T): T {
  try {
    if (!value || typeof value !== "string") return fallback;
    const trimmed = value.trim();
    if (!trimmed) return fallback;
    return JSON.parse(trimmed) as T;
  } catch (error) {
    console.error("[CMS_JSON_PARSE_ERROR]", error);
    return fallback;
  }
}
