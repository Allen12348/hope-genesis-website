import Link from "next/link";
import { ArrowUpRight, CalendarClock, ClipboardList } from "lucide-react";
import type { SectionShellCms } from "@/lib/cms/marketing-cms-defaults";
import { DEFAULT_HOME_PAGE_PUBLISHED } from "@/lib/cms/marketing-cms-defaults";
import { PLATFORM_LINKS } from "@/constants/site";
import { cn } from "@/lib/utils";

const defaultPlatformCopy = DEFAULT_HOME_PAGE_PUBLISHED.customerPlatform;

const iconFor = (href: string) => {
  if (href.includes("estimate")) return ClipboardList;
  if (href.includes("contact")) return CalendarClock;
  return ArrowUpRight;
};

export function CustomerPlatformStrip({
  className,
  copy = defaultPlatformCopy,
}: {
  className?: string;
  copy?: SectionShellCms;
}) {
  return (
    <section className={cn("border-y border-border/40 bg-background py-12 sm:py-14", className)}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">{copy.eyebrow}</p>
            <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{copy.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">{copy.description}</p>
          </div>
        </div>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 lg:gap-4">
          {PLATFORM_LINKS.map((l) => {
            const Icon = iconFor(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className="group flex items-start gap-3 rounded-2xl border border-border/50 bg-card p-4 shadow-sm transition duration-300 ease-out hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-premium"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15 transition group-hover:bg-primary/15">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-foreground">{l.label}</span>
                  <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">{l.description}</span>
                </span>
                <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition group-hover:text-accent" aria-hidden />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
