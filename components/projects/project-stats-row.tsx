import type { ProjectStat } from "@/types";
import { cn } from "@/lib/utils";

export function ProjectStatsRow({ stats, className }: { stats?: ProjectStat[] | null; className?: string }) {
  const rows = Array.isArray(stats) ? stats : [];
  if (!rows.length) return null;

  return (
    <div className={cn("grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4", className)}>
      {rows.map((stat) => (
        <div
          key={`${stat.label}-${stat.value}`}
          className="rounded-2xl border border-border/70 bg-card/80 px-4 py-3 shadow-sm backdrop-blur-sm"
        >
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{stat.label}</p>
          <p className="mt-1 font-display text-2xl font-semibold tabular-nums text-foreground">
            {stat.value}
            {stat.suffix ? (
              <span className="ml-1 text-sm font-medium text-muted-foreground">{stat.suffix}</span>
            ) : null}
          </p>
        </div>
      ))}
    </div>
  );
}
