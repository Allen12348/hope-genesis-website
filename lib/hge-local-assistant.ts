import { extractSqmFromText, looksLikeAcSizingQuestion } from "@/lib/squirly-ac-sizing";

/** HGE residential wall-split sizing table (sqm → HP). */
export const AC_SIZING_BY_SQM = [
  { min: 0, max: 6, hp: "0.5 HP" },
  { min: 7, max: 9, hp: "0.8 HP" },
  { min: 10, max: 12, hp: "1.0 HP" },
  { min: 13, max: 18, hp: "1.5 HP" },
  { min: 19, max: 25, hp: "2.0 HP" },
  { min: 26, max: 35, hp: "2.5 HP" },
  { min: 36, max: 40, hp: "3.0 HP" },
  { min: 41, max: 50, hp: "4.0 HP" },
] as const;

const CLEANING_SCHEDULE_REPLY =
  "To schedule aircon cleaning, you can click Contact, Call Now, or Book Survey on the website. Please prepare your location, AC type, number of units, preferred date, and contact number so Hope Genesis Enterprises can confirm availability.";

function hpForSqm(sqm: number): string | null {
  for (const row of AC_SIZING_BY_SQM) {
    if (sqm >= row.min && sqm <= row.max) return row.hp;
  }
  return null;
}

function sizingAnswerForSqm(sqm: number): string {
  const hp = hpForSqm(sqm);
  if (hp) {
    return `For ${sqm} sqm, the recommended AC size is around ${hp} based on the HGE sizing table. If the room has strong sunlight, high ceiling, roof heat, large windows, or many occupants, a site survey is recommended before final sizing.`;
  }
  if (sqm > 50) {
    return `For ${sqm} sqm, the standard HGE residential table (up to 50 sqm) may not be enough on its own. Larger or multi-zone spaces often need multi-split, ducted, or engineered zoning with a formal load calculation. Click Book Survey or Contact so Hope Genesis Enterprises can assess your space.`;
  }
  return "";
}

const SITE_NAV_BLURB = `To get an estimate, click Get Instant Estimate. To inquire, use Contact or Call Now. To view services, open Services. To see previous works, open Gallery or Projects. To book, use Book Survey or Contact.`;

function wantsSiteHowTo(text: string): boolean {
  return (
    /\b(how\s+to\s+use|use\s+this\s+website|around\s+the\s+site|navigate|where\s+(on\s+the\s+)?site)\b/i.test(
      text,
    ) ||
    (/\bhow\s+do\s+i\b/i.test(text) &&
      /\b(website|this\s+site|on\s+the\s+site|main\s+menu|header|footer)\b/i.test(text))
  );
}

/**
 * Priority-ordered deterministic replies from the latest user message only.
 */
function getLocalHgeResponseFromLatest(message: string): string | null {
  const text = message.toLowerCase();

  if (/(cleaning|clean|linis|maintenance|schedule\s+clean|clean\s+aircon)/i.test(text)) {
    return CLEANING_SCHEDULE_REPLY;
  }

  if (/(book|schedule|appointment|site survey|survey)/i.test(text)) {
    return "To request a site survey or service visit, use the Contact page. Send your location, service needed, preferred date, and contact number.";
  }

  if (
    /\binstall(?:ation|\s+)\s+(cost|price|estimate|how\s+much)|\bcost\s+of\s+install|\binstall(?:ation)?\s+fee\b/i.test(
      text,
    ) ||
    (/\binstall/.test(text) && /\b(how\s+much|cost|price|estimate|peso|php)\b/i.test(text))
  ) {
    return `Installation cost depends on HP, piping length, wall type, electrical provision, bracketing, outdoor unit placement, and add-ons. Use Get Instant Estimate for a guided starting point, then Contact us for an onsite check and formal quotation from Hope Genesis Enterprises.`;
  }

  if (/(estimate|quotation|quote|price|cost)/i.test(text)) {
    return "To request an estimate, click Get Instant Estimate or send your room size, AC type, location, and installation details.";
  }

  if (/(hp|horsepower|sqm|square meter|m2|tonnage)/i.test(text) && extractSqmFromText(message) === null) {
    return "Please send your room size in sqm so I can recommend the right AC HP using the HGE sizing table.";
  }

  if (/(repair|leak|not cooling|tubig|drip|broken|fix)\b/i.test(text)) {
    return "For repair concerns, note any symptoms (leaks, unusual noise, error codes, weak airflow, ice, odors). Stop using the unit if you smell burning or see sparks. Contact Hope Genesis Enterprises via Contact or Call Now so a technician can advise next steps.";
  }

  if (/(contact|inquir|call\s+now|phone|email|reach\s+you)/i.test(text)) {
    return "You can contact Hope Genesis Enterprises using the Contact page, Call Now button, or the floating contact buttons on the side of the website.";
  }

  if (/(hello|hi|hey)/i.test(text) && text.length < 48) {
    return "Hello! Welcome to Hope Genesis Enterprises. I can help with estimates, AC sizing, cleaning, repair, installation, and website support.";
  }

  return null;
}

/**
 * Deterministic replies when OpenAI is unavailable or fails.
 * Intent matching uses the latest message only; prior messages are used only for sizing context (e.g. sqm in a follow-up).
 */
export function getLocalHgeResponse(latestMessage: string, priorUserMessages = ""): string {
  const trimmed = latestMessage.trim();
  const text = trimmed.toLowerCase();

  if (
    /\b(burning|burnt|burned)\s+(smell|odor)/.test(text) ||
    (/\bspark/.test(text) && /\b(ac|aircon|unit|outlet|breaker|panel)\b/.test(text)) ||
    /\bgas\s+(leak|smell)/.test(text) ||
    /\belectrical\s+shock\b|\bshocked\s+by\b.*\bac\b/i.test(text)
  ) {
    return `That can be a serious safety issue. Stop using the AC, cut power at the breaker only if you can do so safely, ventilate if there are fumes, and contact Hope Genesis Enterprises right away or emergency services if you see smoke, injury risk, or a suspected gas leak.`;
  }

  const sqmFromLatest = extractSqmFromText(trimmed);
  const sqmFromPrior = priorUserMessages ? extractSqmFromText(priorUserMessages) : null;
  const sqm = sqmFromLatest ?? (looksLikeAcSizingQuestion(trimmed) ? null : sqmFromPrior);

  if (
    sqm !== null &&
    (looksLikeAcSizingQuestion(trimmed) ||
      sqmFromLatest !== null ||
      /\b(sqm|sq\.?\s*m|square\s+m|recommended|capacity|size)\b/i.test(text))
  ) {
    const ans = sizingAnswerForSqm(sqm);
    if (ans) return ans;
  }

  const asksHpOrSize =
    /\bwhat\s+hp\b|\bhow\s+much\s+hp\b|\bwhich\s+hp\b|\bhorsepower\b|\bhp\s+do\s+i\b|\bhp\s+need\b|\bsize\s+(of\s+)?(\ban?\s+)?ac\b|\bac\s+size\b|\btonnage\b/i.test(
      trimmed,
    ) || (looksLikeAcSizingQuestion(trimmed) && sqm === null);

  if (asksHpOrSize && sqm === null) {
    return "Please send your room size in sqm so I can recommend the right AC HP using the HGE sizing table.";
  }

  const priorityReply = getLocalHgeResponseFromLatest(trimmed);
  if (priorityReply) return priorityReply;

  if (wantsSiteHowTo(text)) {
    return `${SITE_NAV_BLURB}\n\nIf you tell me what you want to do (estimate, book, or ask about a service), I can point you to the right place.`;
  }

  if (/\bservices?\b/.test(text) && /\b(view|see|what|offer|list|open)\b/.test(text)) {
    return `Open Services in the main menu to browse installation, cleaning, repair, and maintenance. ${SITE_NAV_BLURB}`;
  }

  if (/\b(gallery|projects?)\b/.test(text) && /\b(see|view|show|past|work|portfolio|previous)\b/.test(text)) {
    return `Open Gallery or Projects to see past installations and work samples. ${SITE_NAV_BLURB}`;
  }

  if (/\bwhat\s+is\s+hvac\b|\bwhat\s+hvac\b|\bwhat\s+does\s+hvac\b|\bhvac\s+mean\b|\bmeaning\s+of\s+hvac\b|\bdefine\s+hvac\b/i.test(text)) {
    return "HVAC means Heating, Ventilation, and Air Conditioning. It covers systems that control cooling, ventilation, humidity, airflow, and indoor comfort for homes and businesses.";
  }

  if (/\binverter\b/.test(text) && /\b(non[-\s]?inverter|vs|versus|difference|compare|or\s+non)\b/i.test(text)) {
    return `Inverter ACs vary compressor speed to hold temperature with less on/off cycling, which often saves energy and keeps the room steadier versus non-inverter units that start/stop more. Upfront cost, install layout, and usage hours affect total savings — final advice can be confirmed during a site survey with Hope Genesis Enterprises.`;
  }

  if (
    /\b(power\s+consumption|electricity\s+usage|kwh|kilowatt|electric\s+bill|how\s+much\s+.*(electric|power))\b/i.test(
      text,
    )
  ) {
    return `Actual power draw depends on HP rating, inverter technology, thermostat setpoint, outdoor temperature, insulation, and how long the unit runs. Without your exact model specs, use its nameplate or brochure kW/rated current as a guide, and expect real-world bills to vary. Hope Genesis Enterprises can explain typical expectations during consultation or survey.`;
  }

  if (
    /\binstall(?:ation|\s+)\s+(cost|price|estimate|how\s+much)|\bcost\s+of\s+install|\binstall(?:ation)?\s+fee\b/i.test(
      text,
    ) ||
    (/\binstall/.test(text) && /\b(how\s+much|cost|price|estimate|peso|php)\b/i.test(text))
  ) {
    return `Installation cost depends on HP, piping length, wall type, electrical provision, bracketing, outdoor unit placement, and add-ons. Use Get Instant Estimate for a guided starting point, then Contact us for an onsite check and formal quotation from Hope Genesis Enterprises.`;
  }

  if (/\bhow\s+often\b.*\b(clean|wash|service)\b|\bchemical\s+wash\b|\bfilter\s+clean\b/i.test(text)) {
    return `Many homes benefit from filter cleaning monthly (or sooner in dusty areas) and a professional check/clean at least once or twice a year, depending on use and environment. Heavy use, pets, or kitchens may need more frequent attention. Hope Genesis Enterprises can recommend a schedule after seeing your setup.`;
  }

  if (/\bleak|drip|tubig|water\s+(from|in)\s+.*\b(unit|indoor)\b|\bipon\s+ng\s+tubig\b/i.test(text)) {
    return `Leaks can come from a clogged drain line, bad drain pump or slope, ice melt, or a service issue. Turn off the AC if water risks electrical areas, contain pooling water, and contact Hope Genesis Enterprises for a proper diagnosis rather than forcing the unit to keep running.`;
  }

  if (/\bnot\s+cooling\b|\bweak\s+(cold|cool)\b|\bno\s+cold\s+air\b|\bmainit\s+pa\b/i.test(text)) {
    return `If the AC is not cooling well, causes can include dirty filters/coils, refrigerant issues, a failing fan or compressor, or controls/sensor faults. Try a clean filter check if safe, then schedule service with Hope Genesis Enterprises — avoid repeated hard resets if something sounds or smells wrong.`;
  }

  if (/\bthank|salamat\b/i.test(text) && text.length < 60) {
    return "You’re welcome! If you need anything else about AC sizing, services, or using this site, just ask.";
  }

  return "I can help with estimates, AC sizing, cleaning, repair, installation, and how to use the Hope Genesis Enterprises website. What do you need help with?";
}
