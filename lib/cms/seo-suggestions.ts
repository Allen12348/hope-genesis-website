const BRAND = "Hope Genesis Enterprises";

/** Suggested browser tab / search result title (aim for ~60 chars). */
export function suggestMetaTitle(title: string, brand = BRAND): string {
  const t = title.trim();
  if (!t) return "";
  const suffix = ` | ${brand}`;
  const max = 60;
  if (t.length + suffix.length <= max) return `${t}${suffix}`;
  const room = max - suffix.length - 1;
  return `${t.slice(0, Math.max(room, 20)).replace(/\s+\S*$/, "").trim()}${suffix}`;
}

/** Suggested meta description from summary or body (aim for ~160 chars). */
export function suggestMetaDescription(text: string, maxLen = 160): string {
  const d = text.trim().replace(/\s+/g, " ");
  if (!d) return "";
  if (d.length <= maxLen) return d;
  const cut = d.slice(0, maxLen - 3);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 40 ? cut.slice(0, lastSpace) : cut).trim()}...`;
}

/** Default HVAC marketing meta description when no copy exists yet. */
export function defaultSiteMetaDescription(): string {
  return suggestMetaDescription(
    "Trusted air conditioning installation, cleaning, and refrigeration services in Laguna and Metro Manila.",
  );
}
