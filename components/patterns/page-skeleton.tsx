import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function PageSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("mx-auto max-w-6xl space-y-6 px-4 py-10 sm:px-6 lg:px-8", className)}>
      <Skeleton className="h-8 w-2/3 max-w-md rounded-lg" />
      <Skeleton className="h-4 w-full max-w-xl rounded-lg" />
      <div className="grid gap-4 pt-6 sm:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-40 rounded-2xl" />
        <Skeleton className="h-40 rounded-2xl" />
        <Skeleton className="h-40 rounded-2xl" />
      </div>
    </div>
  );
}
