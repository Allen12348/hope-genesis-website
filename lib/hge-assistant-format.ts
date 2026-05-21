/**
 * Prepares assistant replies for readable chat display (paragraph breaks, bullets).
 */
export function formatAssistantDisplay(text: string): string {
  const trimmed = text.trim();
  if (!trimmed || trimmed.length < 90) return trimmed;
  if (/^[\s]*[•\-*]/m.test(trimmed) || trimmed.includes("\n\n")) return trimmed;

  const pleaseMatch = trimmed.match(
    /^([\s\S]+?\.)\s*Please\s+(prepare|provide|send)\s+([\s\S]+?)(?:\s+so\s+[\s\S]+)?\.?$/i,
  );
  if (pleaseMatch) {
    const items = splitListItems(pleaseMatch[3]);
    if (items.length >= 2) {
      const tail = trimmed.match(/\.\s*so\s+(.+)$/i);
      const footer = tail ? `\n\n${tail[1].replace(/\.$/, "")}.` : "";
      return `${pleaseMatch[1]}\n\nPlease ${pleaseMatch[2]}:\n${items.map((i) => `• ${i}`).join("\n")}${footer}`;
    }
  }

  const clickMatch = trimmed.match(
    /^([\s\S]+?\.)\s*You can (click|use)\s+([^.]+)\./i,
  );
  if (clickMatch) {
    const actions = splitListItems(clickMatch[3].replace(/\s+on the website$/i, ""));
    if (actions.length >= 2) {
      return `${clickMatch[1]}\n\nYou can ${clickMatch[2]}:\n${actions.map((a) => `• ${a}`).join("\n")}`;
    }
  }

  if (trimmed.length > 180 && !trimmed.includes("\n")) {
    const sentences = trimmed.match(/[^.!?]+[.!?]+/g);
    if (sentences && sentences.length >= 3) {
      return sentences.map((s) => s.trim()).join("\n\n");
    }
  }

  return trimmed;
}

function splitListItems(raw: string): string[] {
  return raw
    .replace(/\.$/, "")
    .split(/,\s*(?:and\s+)?/)
    .map((s) => s.trim())
    .filter(Boolean);
}
