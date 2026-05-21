"use client";

import { useEffect } from "react";
import { AdminErrorFallback } from "@/components/admin/admin-error-fallback";

export default function AdminContentError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[ADMIN_RENDER_ERROR]", { route: "admin/content", source: "AdminContentError", error });
  }, [error]);

  return (
    <AdminErrorFallback
      title="Content CMS error"
      error={error}
      reset={reset}
      logTag="ADMIN_RENDER_ERROR"
    />
  );
}
