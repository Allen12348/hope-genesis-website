import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { mergeCompanySettings } from "@/lib/cms/resolved-site";
import {
  getSafeCompanySettings,
  getSafeNavigationItems,
  safeEnsureNavigationSeeded,
} from "@/lib/admin/safe-admin-data";
import { SITE } from "@/constants/site";
import { HeaderSettingsAdmin } from "@/components/admin/header-settings-admin";

export const metadata: Metadata = {
  title: `Header settings | Admin | ${SITE.name}`,
  robots: { index: false, follow: false },
};

export default async function AdminHeaderSettingsPage() {
  const session = await getServerSession(authOptions);
  await safeEnsureNavigationSeeded();
  const [company, navItems] = await Promise.all([getSafeCompanySettings(), getSafeNavigationItems()]);
  const resolved = mergeCompanySettings(company, navItems);
  return (
    <HeaderSettingsAdmin
      company={company}
      navItems={navItems}
      resolved={resolved}
      role={session!.user.role}
    />
  );
}
