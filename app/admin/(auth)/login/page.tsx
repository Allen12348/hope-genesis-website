import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AdminLoginForm } from "@/components/admin/admin-login-form";

export const metadata: Metadata = {
  title: "Admin login",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="relative flex min-h-dvh items-center justify-center bg-[hsl(210_40%_98%)] px-4 py-14 dark:bg-background">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-18%,rgba(56,189,248,0.12),transparent_52%),radial-gradient(ellipse_70%_50%_at_100%_100%,rgba(125,211,252,0.08),transparent_48%)]"
        aria-hidden
      />
      <div className="relative z-10 w-full max-w-md space-y-6">
        <Suspense
          fallback={
            <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground shadow-card-hge">
              Loading…
            </div>
          }
        >
          <AdminLoginForm />
        </Suspense>
        <p className="text-center text-sm text-muted-foreground">
          <Link href="/" className="font-semibold text-primary hover:underline">
            Return to website
          </Link>
        </p>
      </div>
    </div>
  );
}
