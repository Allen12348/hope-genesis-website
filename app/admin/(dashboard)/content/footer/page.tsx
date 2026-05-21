import { CMS_PAGE_KEYS } from "@/lib/domain/cms/page-keys";
import { redirectToBuilder } from "@/components/admin/cms/redirect-to-builder";

export default function AdminContentFooterPage({ searchParams }: { searchParams?: { advanced?: string } }) {
  redirectToBuilder(CMS_PAGE_KEYS.footer, searchParams?.advanced === "1");
}
