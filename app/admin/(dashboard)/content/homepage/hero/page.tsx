import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { SITE } from "@/constants/site";
import { authOptions } from "@/lib/auth/options";
import { mergeHomePagePublished } from "@/lib/cms/merge-public-marketing-cms";
import { CMS_PAGE_KEYS } from "@/lib/domain/cms/page-keys";
import { canMutateContent } from "@/lib/permissions";
import { getSafePageContentByKey, getSafeResolvedSite } from "@/lib/admin/safe-admin-data";
import { HeroCmsSettingsForm } from "@/components/admin/cms/hero-cms-settings-form";
export const metadata: Metadata = {
  title: `Homepage hero | CMS | Admin | ${SITE.name}`,
  robots: { index: false, follow: false },
};

export default async function AdminHomepageHeroPage() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role ?? "STAFF";
  const [row, site] = await Promise.all([
    getSafePageContentByKey(CMS_PAGE_KEYS.home),
    getSafeResolvedSite(),
  ]);
  const home = mergeHomePagePublished(row);

  return (
    <HeroCmsSettingsForm
        initialHome={home}
        companyHeroImageUrl={site.heroImageUrl}
        companyHeroImageAlt={site.heroImageAlt}
        companyHeroBackgroundBlur={site.heroBackgroundBlur}
        canEdit={canMutateContent(role)}
      />
  );
}
