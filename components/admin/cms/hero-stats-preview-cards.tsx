"use client";

import { Briefcase, Clock, Shield, Users, type LucideIcon } from "lucide-react";
import type { HeroStatCms, HeroStatIcon } from "@/lib/cms/marketing-cms-defaults";
import { resolveVisibleHeroStats } from "@/lib/cms/hero-stats";
import { cn } from "@/lib/utils";

const statIconMap: Record<HeroStatIcon, LucideIcon> = {
  briefcase: Briefcase,
  clock: Clock,
  users: Users,
  shield: Shield,
};

function statIconFor(label: string, explicit?: HeroStatIcon): LucideIcon {
  if (explicit && statIconMap[explicit]) return statIconMap[explicit]!;
  const l = label.toLowerCase();
  if (l.includes("project")) return Briefcase;
  if (l.includes("year") || l.includes("experience")) return Clock;
  if (l.includes("client")) return Users;
  return Shield;
}

type Props = {
  stats: HeroStatCms[];
  showHidden?: boolean;
  className?: string;
};

export function HeroStatsPreviewCards({ stats, showHidden = false, className }: Props) {
  const rows = showHidden
    ? [...stats].sort((a, b) => a.sortOrder - b.sortOrder)
    : resolveVisibleHeroStats(stats);

  if (rows.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
        No visible stats — site defaults will appear on the live homepage.
      </p>
    );
  }

  return (
    <PreviewTheme>
      <PreviewDark className={className} rows={rows} showHidden={showHidden} />
    </PreviewTheme>
  );
}

function PreviewTheme({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-slate-100/80 p-4 dark:bg-slate-900/50">{children}</div>
  );
}

function PreviewDark({
  className,
  rows,
  showHidden,
}: {
  className?: string;
  rows: HeroStatCms[];
  showHidden: boolean;
}) {
  return (
    <div className="dark">
      <div className={cn("grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4", className)}>
        {rows.map((s) => (
          <PreviewStatCard key={s.id} stat={s} dimmed={showHidden && !s.visible} />
        ))}
      </div>
    </div>
  );
}

function PreviewStatCard({ stat, dimmed }: { stat: HeroStatCms; dimmed: boolean }) {
  const StatIcon = statIconFor(stat.label, stat.icon);
  return (
    <div
      className={cn(
        "group relative min-h-0 overflow-hidden rounded-2xl border border-slate-200 bg-white/85 p-4 text-slate-950 shadow-[0_8px_32px_-12px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:p-5 dark:border-white/15 dark:bg-slate-950/70 dark:text-white",
        dimmed && "opacity-40 grayscale",
      )}
    >
      <StatIcon className="mb-2 h-4 w-4 text-sky-400" aria-hidden />
      <div className="font-display text-[clamp(1.65rem,2.8vw,2.75rem)] font-bold leading-none tracking-tight text-slate-950 dark:text-white">
        {stat.value}
        {stat.suffix ?? ""}
      </div>
      <div className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-slate-600 sm:text-xs dark:text-slate-300">
        {stat.label}
      </div>
    </div>
  );
}
