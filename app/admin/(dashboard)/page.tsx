import type { Metadata } from "next";
import { getAdminDashboardData } from "@/lib/services/admin-dashboard-data";
import { SITE } from "@/constants/site";
import { AdminDashboardHomeView } from "@/components/admin/admin-dashboard-home-view";

export const metadata: Metadata = {
  title: `Dashboard | ${SITE.name}`,
  robots: { index: false, follow: false },
};

export default async function AdminDashboardHomePage() {
  const data = await getAdminDashboardData();
  return <AdminDashboardHomeView data={data} />;
}
