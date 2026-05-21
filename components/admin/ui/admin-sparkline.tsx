import { sparklinePoints } from "@/lib/admin/sparkline-points";
import { cn } from "@/lib/utils";

type Tone = "gold" | "navy" | "emerald" | "violet" | "sky";

const stroke: Record<Tone, string> = {
  gold: "hsl(45 96% 49%)",
  navy: "hsl(var(--brand-royal))",
  emerald: "rgb(16 185 129)",
  violet: "rgb(139 92 246)",
  sky: "rgb(56 189 248)",
};

export function AdminSparkline({
  seed,
  tone = "gold",
  className,
}: {
  seed: number;
  tone?: Tone;
  className?: string;
}) {
  const pts = sparklinePoints(seed, 16);
  const w = 120;
  const h = 36;
  const min = Math.min(...pts);
  const max = Math.max(...pts);
  const pad = 2;
  const path = pts
    .map((p, i) => {
      const x = pad + (i / (pts.length - 1)) * (w - pad * 2);
      const t = max === min ? 0.5 : (p - min) / (max - min);
      const y = h - pad - t * (h - pad * 2);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={cn("shrink-0 overflow-visible", className)}
      aria-hidden
    >
      <path
        d={path}
        fill="none"
        stroke={stroke[tone]}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.85}
      />
    </svg>
  );
}
