import { redirect } from "next/navigation";
import type { CmsPageKey } from "@/lib/domain/cms/page-keys";
import { builderSlugForPageKey } from "@/lib/cms/page-builder/registry";

/** Sends legacy JSON CMS routes to the visual builder. Use `?advanced=1` for developer JSON. */
export function redirectToBuilder(pageKey: CmsPageKey, advanced = false) {
  const slug = builderSlugForPageKey(pageKey);
  redirect(`/admin/content/builder/${slug}${advanced ? "?advanced=1" : ""}`);
}
