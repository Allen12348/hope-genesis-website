import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { SITE } from "@/constants/site";
import { authOptions } from "@/lib/auth/options";
import {
  mergeFloatingActions,
  mergeHomeSectionOrder,
  mergeSectionVisibility,
} from "@/lib/cms/merge-public-marketing-cms";
import { getSafeSiteSettingsCms } from "@/lib/admin/safe-admin-data";
import { canMutateContent } from "@/lib/permissions";
import { HomepageLayoutForm } from "@/components/admin/cms/homepage-layout-form";

export const metadata: Metadata = {
  title: `Homepage layout | CMS | Admin | ${SITE.name}`,
  robots: { index: false, follow: false },
};

export default async function AdminContentSiteSettingsPage() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role ?? "STAFF";
  const row = await getSafeSiteSettingsCms();

  return (
    <HomepageLayoutForm
      initialVisibility={mergeSectionVisibility(row)}
      initialOrder={mergeHomeSectionOrder(row)}
      initialFloating={mergeFloatingActions(row)}
      canEdit={canMutateContent(role)}
    />
  );
}
