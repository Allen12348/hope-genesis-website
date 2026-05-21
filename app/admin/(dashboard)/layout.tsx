import type { Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/options";
import { getAdminOpsAlertsDetail } from "@/lib/services/admin-ops-alerts";
import { AdminDashboardShell } from "@/components/admin/admin-dashboard-shell";
import { AuthSessionProvider } from "@/components/providers/auth-session-provider";
import { logAdminRenderError } from "@/lib/server/log-admin-render-error";
import { validateAdminEnvironment } from "@/lib/env/validate-admin-env";
import { AdminEnvNotice } from "@/components/admin/admin-env-notice";

/** Avoid Prisma during `next build` (SQLite + parallel SSG → SQLITE_CANTOPEN on Windows). */
export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  let session;
  try {
    session = await getServerSession(authOptions);
  } catch (error) {
    logAdminRenderError("admin-dashboard-layout-session", error);
    redirect("/admin/login");
  }

  if (!session?.user?.email) {
    redirect("/admin/login");
  }

  const shellUser = {
    name: session.user.name,
    email: session.user.email,
    role: (session.user.role ?? "ADMIN") as Role,
  };

  const [opsAlerts, envValidation] = await Promise.all([
    getAdminOpsAlertsDetail(),
    Promise.resolve(validateAdminEnvironment()),
  ]);

  return (
    <AuthSessionProvider session={session}>
      <AdminDashboardShell user={shellUser} opsAlerts={opsAlerts}>
        <AdminEnvNotice validation={envValidation} />
        {children}
      </AdminDashboardShell>
    </AuthSessionProvider>
  );
}
