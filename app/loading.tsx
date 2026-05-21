import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-dvh">
      <div className="border-b border-border/60 bg-background/80 px-4 py-4 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-2xl ring-1 ring-border/50" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-44 rounded-lg" />
              <Skeleton className="h-3 w-32 rounded-md" />
            </div>
          </div>
          <Skeleton className="hidden h-10 w-40 rounded-xl ring-1 ring-border/40 lg:block" />
        </div>
      </div>

      <div className="relative h-[92vh]">
        <Skeleton className="absolute inset-0 rounded-none opacity-90" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/15 to-background/90" />
        <div className="relative mx-auto max-w-6xl px-4 pt-32 sm:px-6 lg:px-8">
          <Skeleton className="h-6 w-56 rounded-full opacity-80" />
          <Skeleton className="mt-6 h-14 w-full max-w-3xl rounded-2xl opacity-75" />
          <Skeleton className="mt-4 h-24 w-full max-w-2xl rounded-2xl opacity-70" />
          <div className="mt-10 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-2xl ring-1 ring-border/40" />
            ))}
          </div>
        </div>
      </div>

      <div className="section-fade">
        <div className="mx-auto max-w-6xl space-y-4 px-4 py-16 sm:px-6 lg:px-8">
          <Skeleton className="h-10 w-64 rounded-xl" />
          <Skeleton className="h-24 w-full max-w-2xl rounded-2xl" />
          <div className="grid gap-4 pt-6 lg:grid-cols-12">
            <Skeleton className="h-[420px] rounded-3xl ring-1 ring-border/40 lg:col-span-6" />
            <div className="space-y-4 lg:col-span-6">
              <Skeleton className="h-40 rounded-3xl ring-1 ring-border/40" />
              <Skeleton className="h-56 rounded-3xl ring-1 ring-border/40" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
