import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description?: string;
  className?: string;
  children?: ReactNode;
};

export function EmptyState({ icon: Icon, title, description, className, children }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/80 bg-muted/10 px-6 py-16 text-center",
        className,
      )}
    >
      {Icon ? <Icon className="mb-4 h-10 w-10 text-muted-foreground" aria-hidden /> : null}
      <p className="font-display text-lg font-semibold text-foreground">{title}</p>
      {description ? <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p> : null}
      {children ? <div className="mt-6">{children}</div> : null}
    </div>
  );
}
