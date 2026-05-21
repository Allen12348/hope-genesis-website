import { cn } from "@/lib/utils";
import type { BreadcrumbItem } from "@/components/layout/breadcrumbs";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
};

export function PageHero({
  eyebrow,
  title,
  description,
  breadcrumbs,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "relative overflow-hidden border-b border-border/50 bg-gradient-to-b from-sky-50/30 via-background to-background dark:from-card/25 dark:via-background",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-grid-fade opacity-[0.35] dark:opacity-[0.15]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-24 sm:px-6 sm:pb-20 sm:pt-28 lg:px-8 lg:pb-24 lg:pt-32">
        {breadcrumbs?.length ? (
          <div className="mb-7">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        ) : null}
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">{eyebrow}</p>
        ) : null}
        <h1 className="mt-4 max-w-3xl font-display text-3xl font-bold tracking-display text-balance text-foreground sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}
