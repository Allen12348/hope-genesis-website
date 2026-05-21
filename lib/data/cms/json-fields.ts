/**
 * Shared parsing for JSON-encoded string[] columns stored as strings in SQLite/D1.
 */

import { safeJsonParse } from "@/lib/utils/safe-json-parse";

export function parseJsonArray(s: string): string[] {
  const v = safeJsonParse<unknown>(s, null);
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
}

export function parseServiceFaqJson(s: string | null | undefined): { q: string; a: string }[] {
  if (!s?.trim()) return [];
  const v = safeJsonParse<unknown>(s, null);
  if (!Array.isArray(v)) return [];
  return v.filter((row): row is { q: string; a: string } => {
    if (!row || typeof row !== "object") return false;
    const o = row as { q?: unknown; a?: unknown };
    return typeof o.q === "string" && typeof o.a === "string";
  });
}

export function parseJsonStringArray(s: string | null | undefined, fallback: string[] = []): string[] {
  if (!s?.trim()) return fallback;
  const v = safeJsonParse<unknown>(s, null);
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : fallback;
}

/** Persist string[] columns — empty arrays become null in the database. */
export function stringifyJsonStringArray(values: string[] | null | undefined): string | null {
  const list = values ?? [];
  return list.length ? JSON.stringify(list) : null;
}

export type ProjectStatRow = { label: string; value: string; suffix?: string };

export function parseProjectStatsJson(s: string | null | undefined): ProjectStatRow[] {
  if (!s?.trim()) return [];
  const v = safeJsonParse<unknown>(s, null);
  if (!Array.isArray(v)) return [];
  return v.filter((row): row is ProjectStatRow => {
    if (!row || typeof row !== "object") return false;
    const o = row as { label?: unknown; value?: unknown; suffix?: unknown };
    return typeof o.label === "string" && typeof o.value === "string" && o.label.trim().length > 0;
  });
}

export function stringifyProjectStatsJson(stats: ProjectStatRow[] | null | undefined): string | null {
  const list = (stats ?? []).filter((s) => s.label.trim() && s.value.trim());
  return list.length ? JSON.stringify(list) : null;
}
