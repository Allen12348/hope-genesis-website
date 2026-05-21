import { CMS_PAGE_KEYS, type CmsPageKey } from "@/lib/domain/cms/page-keys";
import { getDefaultPageBuilderDocument } from "@/lib/cms/page-builder/defaults";
import { extractHomepageBuilderOverlay } from "@/lib/cms/page-builder/home-published-overlay";
import { tryParsePageBuilderJson } from "@/lib/cms/page-builder/parse";
import type { PageBuilderDocument } from "@/lib/cms/page-builder/schema";
import { isPageBuilderV2Json } from "@/lib/cms/page-builder/parse";

export type MigrationResult = {
  document: PageBuilderDocument;
  legacyBackup?: string;
  migrated: boolean;
};

/** Converts stored JSON into a v2 builder document, preserving legacy JSON as backup when needed. */
export function migrateStoredContentToBlocks(
  pageKey: CmsPageKey,
  publishedData: string | null | undefined,
  draftData: string | null | undefined,
): MigrationResult {
  const fromDraft = tryParsePageBuilderJson(draftData);
  if (fromDraft) return { document: fromDraft, migrated: false };

  if (pageKey === CMS_PAGE_KEYS.home) {
    const fromOverlay = extractHomepageBuilderOverlay(publishedData ?? "");
    if (fromOverlay) return { document: fromOverlay, migrated: false };
  }

  const fromPublished = tryParsePageBuilderJson(publishedData);
  if (fromPublished) return { document: fromPublished, migrated: false };

  const raw = publishedData?.trim() || draftData?.trim();
  if (raw && !isPageBuilderV2Json(raw)) {
    return {
      document: getDefaultPageBuilderDocument(pageKey),
      legacyBackup: raw,
      migrated: true,
    };
  }

  return {
    document: getDefaultPageBuilderDocument(pageKey),
    migrated: !raw,
  };
}
