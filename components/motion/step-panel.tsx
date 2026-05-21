"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  stepKey: string | number;
  children: ReactNode;
  className?: string;
};

/**
 * Step/tab body wrapper — keyed remount keeps field state scoped per step and avoids
 * Framer Motion + AnimatePresence edge cases where enter state can stick at opacity 0.
 */
export function StepPanel({ stepKey, children, className }: Props) {
  return (
    <div key={String(stepKey)} className={cn(className)}>
      {children}
    </div>
  );
}
