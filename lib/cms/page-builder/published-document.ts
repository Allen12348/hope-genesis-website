import { extractHomepageBuilderOverlay } from "@/lib/cms/page-builder/home-published-overlay";
import { tryParsePageBuilderJson } from "@/lib/cms/page-builder/parse";
import type { PageBuilderDocument } from "@/lib/cms/page-builder/schema";
import { safeFindPageContentByKey } from "@/lib/data/cms/safe-repository";
import { CMS_PAGE_KEYS, type CmsPageKey } from "@/lib/domain/cms/page-keys";

/** Published v2 page-builder document with at least one visible section, or null. */
export async function getPublishedPageBuilderDocument(
  pageKey: CmsPageKey,
): Promise<PageBuilderDocument | null> {
  const row = await safeFindPageContentByKey(pageKey);
  let doc = tryParsePageBuilderJson(row?.publishedData ?? null);

  if (!doc && pageKey === CMS_PAGE_KEYS.home) {
    doc = extractHomepageBuilderOverlay(row?.publishedData ?? "");
  }

  if (!doc || doc.sections.filter((s) => s.visible).length === 0) {
    return null;
  }

  return doc;
}
