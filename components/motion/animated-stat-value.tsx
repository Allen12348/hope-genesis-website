"use client";

import { useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { useCountUp } from "@/hooks/use-count-up";

type Props = {
  end: number;
  suffix?: string;
  className?: string;
  /** Hero counters can animate immediately on first paint. */
  startOnMount?: boolean;
};

export function AnimatedStatValue({
  end,
  suffix = "",
  className,
  startOnMount = false,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const reduce = useReducedMotion();

  const active = !!reduce || startOnMount || inView;
  const value = useCountUp(end, active, {
    durationMs: reduce ? 0 : 1650,
    startOnMount,
  });

  return (
    <span ref={ref} className={className}>
      {reduce ? end : value}
      {suffix}
    </span>
  );
}
