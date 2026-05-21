import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminCard } from "@/components/admin/ui/admin-card";
import { AdminSparkline } from "@/components/admin/ui/admin-sparkline";
import { AdminBadge, type AdminBadgeProps } from "@/components/admin/ui/admin-badge";

type AdminStatsCardProps = {
  label: string;
  value: string | number;
  icon: LucideIcon;
  /** Micro copy under value, e.g. "+4% vs last week" */
  trendLabel?: string;
  trendVariant?: "positive" | "negative" | "neutral";
  sparkSeed: number;
  sparkTone?: "gold" | "navy" | "emerald" | "violet" | "sky";
  badge?: string;
  badgeVariant?: AdminBadgeProps["variant"];
  className?: string;
};

export function AdminStatsCard({
  label,
  value,
  icon: Icon,
  trendLabel,
  trendVariant = "neutral",
  sparkSeed,
  sparkTone = "gold",
  badge,
  badgeVariant = "accent",
  className,
}: AdminStatsCardProps) {
  const trendClass =
    trendVariant === "positive"
      ? "text-emerald-600 dark:text-emerald-400"
      : trendVariant === "negative"
        ? "text-red-600 dark:text-red-400"
        : "text-muted-foreground";

  return (
    <AdminCard className={cn("relative overflow-hidden p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              <Icon className="h-3.5 w-3.5 text-primary" />
              {label}
            </div>
            {badge ? (
              <AdminBadge variant={badgeVariant} className="text-[9px]">
                {badge}
              </AdminBadge>
            ) : null}
          </div>
          <div className="font-display text-3xl font-semibold tabular-nums tracking-tight text-foreground">{value}</div>
          {trendLabel ? <p className={cn("text-xs font-semibold", trendClass)}>{trendLabel}</p> : null}
        </div>
        <AdminSparkline seed={sparkSeed} tone={sparkTone} className="h-9 w-[7.5rem] opacity-90" />
      </div>
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[hsl(var(--accent)/0.08)] blur-2xl" />
    </AdminCard>
  );
}
