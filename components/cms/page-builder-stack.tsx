import { PageRenderer } from "@/components/cms/page-renderer";
import { getPublishedPageBuilderDocument } from "@/lib/cms/page-builder/published-document";
import { loadPageBuilderPreviewContext } from "@/lib/cms/page-builder/preview-data";
import type { CmsPageKey } from "@/lib/domain/cms/page-keys";
import { logServerRenderError } from "@/lib/server/log-server-render-error";

/**
 * Renders published CMS blocks when a document exists; otherwise `null` so callers
 * can fall back to legacy page layouts.
 */
export async function PageBuilderStack({ pageKey }: { pageKey: CmsPageKey }) {
  try {
    const doc = await getPublishedPageBuilderDocument(pageKey);
    if (!doc) return null;

    const ctx = await loadPageBuilderPreviewContext();
    return <PageRenderer sections={doc.sections} ctx={ctx} />;
  } catch (error) {
    logServerRenderError(`/${pageKey}`, "PageBuilderStack", error);
    return null;
  }
}
