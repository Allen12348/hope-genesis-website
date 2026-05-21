"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MarketingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[SERVER_RENDER_ERROR]", { route: "marketing", source: "MarketingError", error });
  }, [error]);

  const detail =
    process.env.NODE_ENV === "development" && error.message
      ? error.message
      : "We could not load this page right now. Other pages may still work — try again or return to the homepage.";

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-24 text-center">
      <AlertTriangle className="h-10 w-10 text-amber-500" aria-hidden />
      <h1 className="font-display text-xl font-semibold text-foreground">Something went wrong</h1>
      <p className="text-sm text-muted-foreground">{detail}</p>
      <div className="flex flex-wrap justify-center gap-2">
        <Button type="button" className="rounded-2xl" onClick={() => reset()}>
          Try again
        </Button>
        <Button asChild variant="outline" className="rounded-2xl">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
}
