"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type AdminFormSectionProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

export function AdminFormSection({ title, description, children, className }: AdminFormSectionProps) {
  return (
    <section
      className={cn(
        "space-y-4 rounded-xl border border-sky-200/60 bg-white/60 p-4 shadow-sm backdrop-blur-sm dark:border-sky-900/40 dark:bg-slate-950/40",
        className,
      )}
    >
      <div className="space-y-0.5 border-b border-border/60 pb-3">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
