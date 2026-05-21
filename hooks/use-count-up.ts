"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

type Options = {
  durationMs?: number;
  /** When true, count animates on mount without requiring in-view (hero use-case). */
  startOnMount?: boolean;
};

/**
 * Lightweight animated counter for statistics.
 * Uses rAF easing for smoothness without heavy dependencies.
 */
export function useCountUp(
  end: number,
  isActive: boolean,
  { durationMs = 1600, startOnMount = false }: Options = {},
) {
  const [value, setValue] = useState(0);
  const frame = useRef<number | null>(null);

  useLayoutEffect(() => {
    const shouldRun = startOnMount ? true : isActive;
    if (!shouldRun) return;
    if (durationMs <= 0) {
      setValue(end);
    }
  }, [end, isActive, durationMs, startOnMount]);

  useEffect(() => {
    const shouldRun = startOnMount ? true : isActive;
    if (!shouldRun) return;
    if (durationMs <= 0) return;

    const start = performance.now();
    const from = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = Math.round(from + (end - from) * eased);
      setValue(next);
      if (t < 1) {
        frame.current = requestAnimationFrame(tick);
      }
    };

    frame.current = requestAnimationFrame(tick);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [end, isActive, durationMs, startOnMount]);

  return value;
}
