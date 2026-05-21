import { Skeleton } from "@/components/ui/skeleton";
import { AdminCard } from "@/components/admin/ui/admin-card";
import { cn } from "@/lib/utils";

export function AdminTableSkeleton({ rows = 6, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <AdminCard className="overflow-hidden p-0">
      <div className="border-b border-border bg-muted/40 px-4 py-3">
        <Skeleton className="h-9 max-w-md rounded-lg bg-muted" />
      </div>
      <div className="divide-y divide-border">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex gap-3 px-4 py-3">
            {Array.from({ length: cols }).map((__, j) => (
              <Skeleton key={j} className={cn("h-5 flex-1 rounded-md bg-muted", j === 0 && "max-w-[180px]")} />
            ))}
          </div>
        ))}
      </div>
    </AdminCard>
  );
}
