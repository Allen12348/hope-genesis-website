"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global]", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-dvh bg-slate-50 font-sans text-slate-900 antialiased">
        <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-24 text-center">
          <h1 className="text-xl font-semibold">Something went wrong</h1>
          <p className="text-sm text-slate-600">
            The site hit an unexpected error. Please refresh or try again later.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-2xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
