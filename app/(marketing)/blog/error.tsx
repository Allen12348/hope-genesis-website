"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BlogSegmentError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[blog]", error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-24 text-center">
      <AlertTriangle className="h-10 w-10 text-amber-500" aria-hidden />
      <h1 className="font-display text-xl font-semibold">Blog unavailable</h1>
      <p className="text-sm text-muted-foreground">{error.message || "Something went wrong loading this section."}</p>
      <Button type="button" className="rounded-2xl" onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
}
