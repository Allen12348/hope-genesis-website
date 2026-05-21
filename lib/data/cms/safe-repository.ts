import { findPageContentByKey } from "@/lib/data/cms/page-content.repository";
import type { PageContent } from "@prisma/client";
import { logServerRenderError } from "@/lib/server/log-server-render-error";

/** Page content lookup that never throws — returns null when the database is unavailable. */
export async function safeFindPageContentByKey(pageKey: string): Promise<PageContent | null> {
  try {
    return await findPageContentByKey(pageKey);
  } catch (error) {
    logServerRenderError("public", `safeFindPageContentByKey:${pageKey}`, error);
    return null;
  }
}
