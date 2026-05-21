import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import type { AdminEnvValidation } from "@/lib/env/validate-admin-env";

export function AdminEnvNotice({ validation }: { validation: AdminEnvValidation }) {
  if (validation.ok && validation.warnings.length === 0) return null;

  return (
    <div
      role="status"
      className="mb-4 rounded-xl border border-amber-500/35 bg-amber-500/10 px-4 py-3 text-sm text-foreground"
    >
      <div className="flex items-start gap-2">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden />
        <div className="space-y-1 text-left">
          {!validation.ok ? (
            <p>
              <span className="font-semibold">Admin configuration incomplete.</span> Missing:{" "}
              {validation.missing.join(", ")}. Set these in your hosting environment (e.g. Railway variables) and
              redeploy.
            </p>
          ) : null}
          {validation.warnings.length > 0 ? (
            <p className="text-muted-foreground">Warnings: {validation.warnings.join("; ")}</p>
          ) : null}
          <p className="text-xs text-muted-foreground">
            Some admin data may fail to load until the database is reachable.{" "}
            <Link href="/admin" className="font-semibold text-accent underline-offset-2 hover:underline">
              Back to dashboard
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
