import type { PageBuilderDocument } from "@/lib/cms/page-builder/schema";
import { pageBuilderDocumentSchema, validatePageBuilderDocument } from "@/lib/cms/page-builder/schema";
import { safeJsonParse } from "@/lib/utils/safe-json-parse";

export function tryParsePageBuilderJson(raw: string | null | undefined): PageBuilderDocument | null {
  if (!raw?.trim()) return null;
  const parsed = safeJsonParse<unknown>(raw, null);
  if (parsed === null) return null;
  const r = pageBuilderDocumentSchema.safeParse(parsed);
  return r.success ? r.data : null;
}

export function isPageBuilderV2Json(raw: string | null | undefined): boolean {
  return tryParsePageBuilderJson(raw) !== null;
}

export function stringifyPageBuilderDocument(doc: PageBuilderDocument): string {
  return JSON.stringify(doc, null, 2);
}

export function safeValidatePageBuilder(input: unknown): PageBuilderDocument | null {
  const r = validatePageBuilderDocument(input);
  return r.success ? r.data : null;
}
