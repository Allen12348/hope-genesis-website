"use client";

import { useEffect } from "react";
import { AdminErrorFallback } from "@/components/admin/admin-error-fallback";

export default function AdminDashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[ADMIN_RENDER_ERROR]", { route: "admin/dashboard", source: "AdminDashboardError", error });
  }, [error]);

  return <AdminErrorFallback error={error} reset={reset} />;
}
