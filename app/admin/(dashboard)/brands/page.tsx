import type { Metadata } from "next";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth/options";

import { getAdminBrandPartners } from "@/lib/application/queries/admin";

import { SITE } from "@/constants/site";

import { BrandsManager } from "@/components/admin/brands-manager";



export const metadata: Metadata = {

  title: `Brands | Admin | ${SITE.name}`,

  robots: { index: false, follow: false },

};



export default async function AdminBrandsPage() {

  const session = await getServerSession(authOptions);

  const rows = await getAdminBrandPartners();

  return <BrandsManager rows={rows} role={session!.user.role} />;

}

