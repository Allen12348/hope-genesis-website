import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function AdminCard({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/80 bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
