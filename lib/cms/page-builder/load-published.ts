import { safeFindPageContentByKey } from "@/lib/data/cms/safe-repository";
import { tryParsePageBuilderJson } from "@/lib/cms/page-builder/parse";
import type { PageBuilderDocument } from "@/lib/cms/page-builder/schema";

export async function loadPublishedBuilderDocument(pageKey: string): Promise<PageBuilderDocument | null> {
  const row = await safeFindPageContentByKey(pageKey);
  return tryParsePageBuilderJson(row?.publishedData ?? null);
}
