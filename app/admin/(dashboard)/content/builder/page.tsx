import { redirect } from "next/navigation";
import { resolveBuilderPageKey } from "@/lib/cms/page-builder/registry";
import { builderSlugForPageKey } from "@/lib/cms/page-builder/registry";

/** Legacy query route → slug-based builder (`/admin/content/builder/homepage`). */
export default function AdminPageBuilderRedirectPage({
  searchParams,
}: {
  searchParams?: { pageKey?: string };
}) {
  const pageKey = resolveBuilderPageKey(searchParams?.pageKey);
  redirect(`/admin/content/builder/${builderSlugForPageKey(pageKey)}`);
}
