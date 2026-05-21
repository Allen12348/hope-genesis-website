"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

type AdminErrorFallbackProps = {
  title?: string;
  error: Error & { digest?: string };
  reset: () => void;
  logTag?: string;
};

export function AdminErrorFallback({
  title = "Admin workspace error",
  error,
  reset,
  logTag = "admin",
}: AdminErrorFallbackProps) {
  const detail =
    process.env.NODE_ENV === "development" && error.message
      ? error.message
      : "Some admin data failed to load. Check server logs, database connectivity, and migrations, then try again.";

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-16 text-center text-foreground">
      <AlertTriangle className="h-10 w-10 text-accent" aria-hidden />
      <h1 className="font-display text-xl font-semibold">{title}</h1>
      <p className="text-sm text-muted-foreground">{detail}</p>
      <div className="flex flex-wrap justify-center gap-2">
        <Button type="button" variant="default" className="rounded-xl" onClick={() => reset()}>
          Try again
        </Button>
        <Button asChild variant="outline" className="rounded-xl">
          <Link href="/admin">Back to dashboard</Link>
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">Logged as [{logTag}] on the server.</p>
    </div>
  );
}
