import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const Box = "div";

export function PageHeroSkeleton({ className }: { className?: string }) {
  return (
    <Box className={cn("space-y-4 py-12", className)}>
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-10 w-full max-w-xl" />
      <Skeleton className="h-5 w-full max-w-2xl" />
    </Box>
  );
}

export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <Box className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="aspect-[4/3] rounded-2xl" />
      ))}
    </Box>
  );
}
