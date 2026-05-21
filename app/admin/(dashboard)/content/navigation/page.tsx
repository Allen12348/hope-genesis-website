import { CMS_PAGE_KEYS } from "@/lib/domain/cms/page-keys";
import { redirectToBuilder } from "@/components/admin/cms/redirect-to-builder";

export default function AdminContentNavigationPage({ searchParams }: { searchParams?: { advanced?: string } }) {
  redirectToBuilder(CMS_PAGE_KEYS.navigationHeader, searchParams?.advanced === "1");
}
