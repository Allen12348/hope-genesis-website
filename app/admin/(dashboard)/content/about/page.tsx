import { CMS_PAGE_KEYS } from "@/lib/domain/cms/page-keys";
import { redirectToBuilder } from "@/components/admin/cms/redirect-to-builder";

export default function AdminContentAboutPage({ searchParams }: { searchParams?: { advanced?: string } }) {
  redirectToBuilder(CMS_PAGE_KEYS.about, searchParams?.advanced === "1");
}
