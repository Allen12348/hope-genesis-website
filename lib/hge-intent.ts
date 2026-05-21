import { extractSqmFromText, looksLikeAcSizingQuestion } from "@/lib/squirly-ac-sizing";

/**
 * Lightweight intent hint for routing the LLM — not shown to clients.
 */
export type HgeIntent =
  | "definition"
  | "ac_sizing"
  | "installation_cost"
  | "cleaning_schedule"
  | "repair_issue"
  | "power_consumption"
  | "maintenance"
  | "booking"
  | "general";

/**
 * Priority-ordered heuristic classifier based on the latest user message only.
 * Prior transcript is intentionally not used so a new question is not pinned to an old intent.
 */
export function detectHgeIntent(latestUserMessage: string): HgeIntent {
  const t = latestUserMessage.toLowerCase().trim();

  // Urgent safety / repair symptoms (latest message only)
  if (
    /\b(burning|melting|burnt|burned)\s+(smell|odor|plastic|rubber)\b/.test(t) ||
    /\bspark(s|ing)?\b.*\bac\b|\bac\b.*\bspark/i.test(t) ||
    /\b(electrical|electric)\s+spark\b/i.test(t) ||
    /\bwat(er|ered)\s+.*\bnear\b.*(\boutlet|socket|electric|breaker|panel)\b/i.test(t) ||
    /\brefrigerant\s+(smell|odor)\b|\b(freon|chemically?\s+)\s+(smell|odor)\b/i.test(t) ||
    /\bbreaker\b.*(\btrip\b|\btrips\b|\btripping\b)/i.test(t) ||
    /\bgas\s+(smell|leak)/i.test(t) ||
    /\b(leak(ed|ing|s)?|drip(ping)?|not\s+(cooling|cold)|weak\s+(air\s*flow|airflow))\b/i.test(t) ||
    /\b(noisy|vibrat|rattl|grind|bearing)\b/i.test(t) ||
    /\b(fc|error)\s*code\b|\blink(ing)?\s+light\b|\bblinking\b.*\blight\b/i.test(t)
  ) {
    return "repair_issue";
  }

  // HVAC terminology / education
  if (
    /\bwhat\s+('?s\s+|\s+)?hvac\b/.test(t) ||
    /\bwhat\s+does\s+hvac\b/.test(t) ||
    /\bwhat\s+(is|'s)\s+.*\bhvac\b/.test(t) ||
    /\bhvac\s+(stands?\s+for|mean(?:s|ing)|definition)\b/i.test(t) ||
    /\b(define|explain)\s+hvac\b/i.test(t) ||
    /\bmeaning\s+of\s+hvac\b/i.test(t)
  ) {
    return "definition";
  }

  // Priority order: cleaning → booking → estimate → sizing → repair → contact → greeting
  if (/(cleaning|clean|linis|maintenance|schedule\s+clean|clean\s+aircon)/i.test(t)) {
    return "cleaning_schedule";
  }

  if (/(book|schedule|appointment|site survey|survey)/i.test(t)) {
    return "booking";
  }

  if (
    /\binstall(?:ation|\s+)\s+(cost|price|estimate)|\bcost\s+of\s+install|\binstall(?:ation)?\s+fee\b/i.test(t) ||
    (/\binstall/.test(t) && /\b(how\s+much|cost|price|estimate|peso|php)\b/i.test(t))
  ) {
    return "installation_cost";
  }

  if (/(estimate|quotation|quote|price|cost)/i.test(t)) {
    return "installation_cost";
  }

  if (
    extractSqmFromText(latestUserMessage) !== null ||
    looksLikeAcSizingQuestion(latestUserMessage) ||
    /(hp|horsepower|sqm|square meter|m2|tonnage)/i.test(t)
  ) {
    return "ac_sizing";
  }

  if (/(repair|leak|not cooling|tubig|drip|broken|fix)\b/i.test(t)) {
    return "repair_issue";
  }

  if (/(contact|inquir|call\s+now|phone|email|reach\s+you)/i.test(t)) {
    return "general";
  }

  if (/^(hi|hello|hey)(\s+there)?[!.,?…\s]*$/i.test(t) || /^good\s+(morning|afternoon|evening)/i.test(t)) {
    return "general";
  }

  // Power usage / inverter economics
  if (
    /\b(kwh|kw\s*h|electricity|electric\s*bill).*(\bbill|usage|consumption)/i.test(t) ||
    /\bpower\s*(usage|consumption)|\bconsumes?\s+(how\s+much\s+)?(power|energy)\b/i.test(t) ||
    (/\binverter\b/.test(t) && /\b(non[-\s]?inverter|vs|versus|difference)\b/i.test(t))
  ) {
    return "power_consumption";
  }

  return "general";
}
