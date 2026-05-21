/** Deterministic pseudo-random series for stable SSR sparklines. */
export function sparklinePoints(seed: number, count = 14): number[] {
  let s = Math.abs(seed) || 1;
  const out: number[] = [];
  for (let i = 0; i < count; i++) {
    s = (s * 1103515245 + 12345) >>> 0;
    out.push((s % 1000) / 1000);
  }
  return out;
}
