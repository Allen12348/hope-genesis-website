"use client";

import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  /** 0–1 opacity multiplier */
  intensity?: number;
};

/**
 * Subtle HVAC-inspired airflow curves — calm, premium, non-gaming.
 */
export function HvacAirflow({ className, intensity = 1 }: Props) {
  const reduce = useReducedMotion();
  if (reduce) return null;

  const opacity = Math.min(1, Math.max(0.15, intensity));

  return (
    <svg
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="airflow-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(56,189,248,0)" />
          <stop offset="45%" stopColor="rgba(56,189,248,0.35)" />
          <stop offset="100%" stopColor="rgba(125,211,252,0)" />
        </linearGradient>
      </defs>
      <g opacity={opacity * 0.55} className="animate-airflow-drift">
        <path
          d="M-40 420 C 200 380, 380 460, 620 400 S 980 340, 1480 380"
          stroke="url(#airflow-grad)"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
        <path
          d="M-60 520 C 240 480, 420 560, 680 500 S 1020 440, 1500 490"
          stroke="url(#airflow-grad)"
          strokeWidth="0.9"
          strokeLinecap="round"
          opacity="0.7"
        />
        <path
          d="M-20 320 C 180 280, 360 340, 560 300 S 900 260, 1460 310"
          stroke="url(#airflow-grad)"
          strokeWidth="0.75"
          strokeLinecap="round"
          opacity="0.5"
        />
      </g>
    </svg>
  );
}
