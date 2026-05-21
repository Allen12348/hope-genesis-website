import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type BreadcrumbItem = { label: string; href?: string };

type BreadcrumbProps = {
  items: BreadcrumbItem[];
  className?: string;
  /** High-contrast trail for use on dark hero photography. */
  variant?: "default" | "inverse";
};

export function Breadcrumbs({ items, className, variant = "default" }: BreadcrumbProps) {
  const inverse = variant === "inverse";

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "inline-flex max-w-full rounded-2xl px-3 py-2 text-sm shadow-sm backdrop-blur-md",
        inverse
          ? "border border-white/20 bg-black/40 text-white/80"
          : "border border-border/60 bg-muted/25 text-muted-foreground dark:bg-muted/15",
        className,
      )}
    >
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {index > 0 ? (
                <ChevronRight
                  className={cn(
                    "h-3.5 w-3.5 shrink-0 opacity-50",
                    inverse && "text-white/60",
                  )}
                  aria-hidden
                />
              ) : null}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className={cn(
                    "font-medium underline-offset-4 transition-colors hover:underline",
                    inverse
                      ? "text-white/80 hover:text-white"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(
                    "font-medium",
                    isLast && (inverse ? "font-semibold text-white" : "font-semibold text-foreground"),
                    !isLast && inverse && "text-white/75",
                  )}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
