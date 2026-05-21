import { revalidateTag } from "next/cache";
import { HOME_CATALOG_TAG, MARKETING_CMS_TAG, RESOLVED_SITE_TAG } from "@/lib/cms/cache-tags";

/** Invalidate cached marketing read models after CMS or catalog writes. */
export function revalidateMarketingCaches(options?: { site?: boolean; cms?: boolean; catalog?: boolean }) {
  const site = options?.site !== false;
  const cms = options?.cms !== false;
  const catalog = options?.catalog !== false;
  if (cms) revalidateTag(MARKETING_CMS_TAG);
  if (site) revalidateTag(RESOLVED_SITE_TAG);
  if (catalog) revalidateTag(HOME_CATALOG_TAG);
}
