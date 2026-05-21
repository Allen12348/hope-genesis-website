import type { Metadata } from "next";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth/options";

import { getAdminGalleryItems } from "@/lib/application/queries/admin";

import { SITE } from "@/constants/site";

import { GalleryManager } from "@/components/admin/gallery-manager";



export const metadata: Metadata = {

  title: `Gallery | Admin | ${SITE.name}`,

  robots: { index: false, follow: false },

};



export default async function AdminGalleryPage() {

  const session = await getServerSession(authOptions);

  const rows = await getAdminGalleryItems();

  return <GalleryManager rows={rows} role={session!.user.role} />;

}

