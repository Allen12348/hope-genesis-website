import { DEFAULT_HOME_PAGE_PUBLISHED } from "@/lib/cms/marketing-cms-defaults";
import type { PageBuilderDocument } from "@/lib/cms/page-builder/schema";
import { validatePageBuilderDocument } from "@/lib/cms/page-builder/schema";
import { safeJsonParse } from "@/lib/utils/safe-json-parse";

/** Embedded in `PageContent.publishedData` when `v === 1` — visual builder blocks appended after the legacy homepage. */
export const HOMEPAGE_BUILDER_OVERLAY_KEY = "builderOverlay" as const;

function cloneDefaultHomePublishedRecord(): Record<string, unknown> {
  return { ...DEFAULT_HOME_PAGE_PUBLISHED } as Record<string, unknown>;
}

/** Read validated builder document embedded in homepage published JSON (does not replace legacy v1 CMS). */
export function extractHomepageBuilderOverlay(raw: string | null | undefined): PageBuilderDocument | null {
  if (!raw?.trim()) return null;
  const o = safeJsonParse<unknown>(raw, null);
  if (o === null) return null;
  if (!o || typeof o !== "object") return null;
  const overlay = (o as Record<string, unknown>)[HOMEPAGE_BUILDER_OVERLAY_KEY];
  if (overlay === undefined || overlay === null) return null;
  const r = validatePageBuilderDocument(overlay);
  return r.success ? r.data : null;
}

/**
 * Merge builder overlay into homepage published JSON while preserving existing `v: 1` CMS fields when possible.
 * - Keeps legacy marketing JSON intact and stores builder sections under `builderOverlay`.
 * - If `sections` is empty, removes `builderOverlay` so the live site drops appended blocks only.
 */
export function mergeHomePublishedJsonWithOverlay(publishedDataRaw: string, overlay: PageBuilderDocument): string {
  const validated = validatePageBuilderDocument(overlay);
  if (!validated.success) {
    throw new Error(validated.error.issues[0]?.message ?? "Invalid homepage builder overlay");
  }
  const overlayDoc = validated.data;

  const parsed = safeJsonParse<unknown>(publishedDataRaw, null);

  const stripOverlay = (base: Record<string, unknown>): string => {
    const next = { ...base };
    delete next[HOMEPAGE_BUILDER_OVERLAY_KEY];
    return JSON.stringify(next);
  };

  if (overlayDoc.sections.length === 0) {
    if (!parsed || typeof parsed !== "object") {
      return JSON.stringify(cloneDefaultHomePublishedRecord());
    }
    const obj = parsed as Record<string, unknown>;
    if (obj.v === 1) {
      return stripOverlay(obj);
    }
    return JSON.stringify(cloneDefaultHomePublishedRecord());
  }

  if (!parsed || typeof parsed !== "object") {
    return JSON.stringify({
      ...cloneDefaultHomePublishedRecord(),
      [HOMEPAGE_BUILDER_OVERLAY_KEY]: overlayDoc,
    });
  }

  const obj = parsed as Record<string, unknown>;

  if (obj.v === 2 && Array.isArray(obj.sections)) {
    return JSON.stringify({
      ...cloneDefaultHomePublishedRecord(),
      [HOMEPAGE_BUILDER_OVERLAY_KEY]: overlayDoc,
    });
  }

  if (obj.v === 1) {
    return JSON.stringify({
      ...obj,
      v: 1,
      [HOMEPAGE_BUILDER_OVERLAY_KEY]: overlayDoc,
    });
  }

  return JSON.stringify({
    ...cloneDefaultHomePublishedRecord(),
    [HOMEPAGE_BUILDER_OVERLAY_KEY]: overlayDoc,
  });
}
