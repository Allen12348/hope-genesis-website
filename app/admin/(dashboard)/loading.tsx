import { Skeleton } from "@/components/ui/skeleton";
import { AdminCard } from "@/components/admin/ui/admin-card";

export default function AdminDashboardLoading() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-9 w-72 max-w-full rounded-lg bg-muted" />
        <Skeleton className="h-4 w-full max-w-xl rounded-md bg-muted" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <AdminCard key={i} className="h-32 p-4">
            <Skeleton className="h-3 w-24 rounded bg-muted" />
            <Skeleton className="mt-4 h-8 w-16 rounded-md bg-muted" />
            <Skeleton className="mt-3 h-3 w-32 rounded bg-muted" />
          </AdminCard>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <AdminCard className="h-64 p-4">
          <Skeleton className="h-5 w-40 rounded bg-muted" />
          <Skeleton className="mt-6 h-full max-h-40 rounded-lg bg-muted" />
        </AdminCard>
        <AdminCard className="h-64 p-4">
          <Skeleton className="h-5 w-40 rounded bg-muted" />
          <Skeleton className="mt-6 h-full max-h-40 rounded-lg bg-muted" />
        </AdminCard>
      </div>
    </div>
  );
}
