/**
 * Text helpers shared by intent detection — sizing answers come from the LLM + system prompt table.
 */

/**
 * Parses floor area from mixed English / Taglish wording.
 */
export function extractSqmFromText(text: string): number | null {
  const t = text.replace(/\u00a0/g, " ");
  const sqmMatch = t.match(/(\d+(?:\.\d+)?)\s*(sqm|sq\.?\s*m|square meters?|m2)/i);
  if (sqmMatch?.[1]) {
    const n = Number.parseFloat(sqmMatch[1]);
    if (!Number.isNaN(n) && n > 0 && n < 500) return n;
  }
  const patterns: RegExp[] = [
    /(\d+(?:\.\d+)?)(?:sqm|m2|\bm²\b)/i,
    /\b(?:about|approximately|approx\.?|around| Mga?\s*)?(\d+(?:\.\d+)?)\s*(?:na\s*)?(?:sq\.?\s*m|sqm|square)/i,
    /(?:room|kwarto|silid|living| sala )\s*(?:kong|ku|ko|ná|nya|na|\bng\b\s+\d+)?[^\d]{0,30}(\d+(?:\.\d+)?)\s*(?:sq\.?\s*m|sqm|square|(?:m)(?:\s*[²2]|\bm2\b))/i,
  ];
  for (const re of patterns) {
    const m = t.match(re);
    if (!m?.[1]) continue;
    const n = Number.parseFloat(m[1]);
    if (!Number.isNaN(n) && n > 0 && n < 500) return n;
  }
  return null;
}

/** Whether to treat message as an AC sizing / capacity topic. */
export function looksLikeAcSizingQuestion(text: string): boolean {
  const s = text.toLowerCase();
  return (
    extractSqmFromText(text) !== null ||
    /\b(hp|horsepower|tonnage|\bton\b|btu|tonner|inverter\s+split|split[-\s]?type|air\s*con|aircon|ac\s+size|size\s+ng\s+ac|ano\s+(?:nga\s+)?hp|recommended\s+ac|recommended\s+(?:floor|wall)|sizing|cubic|kapasidad)/i.test(
      s,
    )
  );
}
