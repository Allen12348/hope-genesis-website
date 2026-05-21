import type { Metadata } from "next";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth/options";

import { getAdminSettingsBundle } from "@/lib/application/queries/admin";

import { mergeCompanySettings } from "@/lib/cms/resolved-site";

import { ensureNavigationSeeded } from "@/lib/cms/ensure-navigation-seeded";

import { SITE } from "@/constants/site";

import { SettingsAdmin } from "@/components/admin/settings-admin";



export const metadata: Metadata = {

  title: `Settings | Admin | ${SITE.name}`,

  robots: { index: false, follow: false },

};



export default async function AdminSettingsPage() {

  const session = await getServerSession(authOptions);

  await ensureNavigationSeeded();

  const { company, users, navItems } = await getAdminSettingsBundle();

  const defaults = mergeCompanySettings(company, navItems);

  return <SettingsAdmin company={company} defaults={defaults} users={users} role={session!.user.role} />;

}

