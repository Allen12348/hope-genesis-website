import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { SITE } from "@/constants/site";
import { authOptions } from "@/lib/auth/options";
import { mergeHomePagePublished } from "@/lib/cms/merge-public-marketing-cms";
import { getSafePageContentByKey } from "@/lib/admin/safe-admin-data";
import { CMS_PAGE_KEYS } from "@/lib/domain/cms/page-keys";
import { canMutateContent } from "@/lib/permissions";
import { HeroStatsCmsForm } from "@/components/admin/cms/hero-stats-cms-form";

export const metadata: Metadata = {
  title: `Hero stats | Homepage CMS | Admin | ${SITE.name}`,
  robots: { index: false, follow: false },
};

export default async function AdminHomepageHeroStatsPage() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role ?? "STAFF";
  const row = await getSafePageContentByKey(CMS_PAGE_KEYS.home);
  const home = mergeHomePagePublished(row);

  return <HeroStatsCmsForm initialHome={home} canEdit={canMutateContent(role)} />;
}
