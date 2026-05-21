"use client";

import { Eye } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminLivePreviewCard({
  title = "Live preview",
  children,
  className,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <aside
      className={cn(
        "sticky top-4 space-y-2 rounded-xl border border-border/80 bg-white/60 p-4 shadow-sm backdrop-blur-sm dark:bg-slate-900/40",
        className,
      )}
    >
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <Eye className="h-3.5 w-3.5" />
        {title}
      </p>
      {children}
    </aside>
  );
}
