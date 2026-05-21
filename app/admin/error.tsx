"use client";

import { useEffect } from "react";
import { AdminErrorFallback } from "@/components/admin/admin-error-fallback";

/**
 * Catches errors in `/admin/*` layouts (e.g. dashboard shell) — nested
 * `(dashboard)/error.tsx` does not handle errors from `(dashboard)/layout.tsx`.
 */
export default function AdminSegmentError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[ADMIN_RENDER_ERROR]", { route: "admin", source: "AdminSegmentError", error });
  }, [error]);

  return <AdminErrorFallback title="Admin error" error={error} reset={reset} />;
}
