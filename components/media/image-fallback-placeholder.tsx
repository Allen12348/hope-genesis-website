"use client";

import { Snowflake } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  /** When true, fills positioned parent (use with `relative` wrapper). */
  fill?: boolean;
};

export function ImageFallbackPlaceholder({ className, fill }: Props) {
  return (
    <div
      role="img"
      aria-label="Image unavailable"
      className={cn(
        "flex items-center justify-center bg-gradient-to-br from-sky-500 via-sky-400 to-sky-700 text-white",
        fill ? "absolute inset-0" : "min-h-[120px] w-full rounded-xl",
        className,
      )}
    >
      <div className="flex flex-col items-center gap-2 p-6 text-center">
        <Snowflake className="h-10 w-10 opacity-90" strokeWidth={1.25} aria-hidden />
        <span className="font-display text-xs font-bold uppercase tracking-widest text-white/90">
          Hope Genesis
        </span>
      </div>
    </div>
  );
}
