"use client";

import { Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminFormIntro({
  title = "Quick tips",
  children,
  className,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex gap-3 rounded-xl border border-sky-500/20 bg-sky-500/5 px-4 py-3 text-sm leading-relaxed text-muted-foreground shadow-sm",
        className,
      )}
    >
      <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-sky-600 dark:text-sky-400" aria-hidden />
      <div className="min-w-0 space-y-1">
        <p className="font-semibold text-foreground">{title}</p>
        <div>{children}</div>
      </div>
    </div>
  );
}
