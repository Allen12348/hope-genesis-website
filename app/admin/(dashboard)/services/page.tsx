import type { Metadata } from "next";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth/options";

import { getAdminServices } from "@/lib/application/queries/admin";

import { SITE } from "@/constants/site";

import { ServicesManager } from "@/components/admin/services-manager";



export const metadata: Metadata = {

  title: `Services | Admin | ${SITE.name}`,

  robots: { index: false, follow: false },

};



export default async function AdminServicesPage() {

  const session = await getServerSession(authOptions);

  const rows = await getAdminServices();

  return <ServicesManager rows={rows} role={session!.user.role} />;

}

