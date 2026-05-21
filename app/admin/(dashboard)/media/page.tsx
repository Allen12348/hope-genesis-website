import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { SITE } from "@/constants/site";
import { getAdminMediaAssets } from "@/lib/application/queries/admin-media";
import { MediaManager } from "@/components/admin/media-manager";

export const metadata: Metadata = {
  title: `Media library | Admin | ${SITE.name}`,
  robots: { index: false, follow: false },
};

export default async function AdminMediaPage() {
  const session = await getServerSession(authOptions);
  const { items } = await getAdminMediaAssets();
  return <MediaManager initialItems={items} role={session!.user.role} />;
}
