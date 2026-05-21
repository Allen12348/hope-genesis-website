import { PageRenderer } from "@/components/cms/page-renderer";
import { getPublishedPageBuilderDocument } from "@/lib/cms/page-builder/published-document";
import { loadPageBuilderPreviewContext } from "@/lib/cms/page-builder/preview-data";
import type { CmsPageKey } from "@/lib/domain/cms/page-keys";

/**
 * Renders published CMS blocks for a page key. Skips `visible: false` blocks.
 * Returns null when no published v2 document exists (caller keeps legacy layout).
 */
export async function CmsRenderer({ pageKey }: { pageKey: CmsPageKey }) {
  const doc = await getPublishedPageBuilderDocument(pageKey);
  if (!doc) return null;

  const ctx = await loadPageBuilderPreviewContext();
  return <PageRenderer sections={doc.sections} ctx={ctx} />;
}
