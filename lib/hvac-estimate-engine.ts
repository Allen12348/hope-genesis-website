export type PropertyType = "residential" | "commercial" | "industrial";

export type AcPreference =
  | "split-inverter"
  | "window"
  | "ducted"
  | "vrf"
  | "unsure";

export type BudgetRange = "economy" | "balanced" | "premium";

export type InverterPreference = "inverter" | "non-inverter" | "unsure";

export type EstimateInput = {
  propertyType: PropertyType;
  roomSizeSqm: number;
  roomCount: number;
  ceilingHeightM: number;
  acPreference: AcPreference;
  inverterPreference: InverterPreference;
  budget: BudgetRange;
  location: string;
  serviceAreaId: string;
};

export type EstimateResult = {
  recommendedHp: number;
  recommendedAcLabel: string;
  installPriceLow: number;
  installPriceHigh: number;
  pmsAnnualLow: number;
  pmsAnnualHigh: number;
  cleaningAnnualLow: number;
  cleaningAnnualHigh: number;
  kwhMonthApprox: number;
  solutionTitle: string;
  solutionBullets: string[];
  disclaimer: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/** Heuristic tonnage (HP) from conditioned area and property class. */
export function computeRecommendedHp(input: EstimateInput): number {
  const totalArea = Math.max(1, input.roomSizeSqm * Math.max(1, input.roomCount));
  const ceilingFactor =
    input.ceilingHeightM > 2.7
      ? 1 + (input.ceilingHeightM - 2.7) * 0.08
      : 1;
  const prop =
    input.propertyType === "residential"
      ? 1
      : input.propertyType === "commercial"
        ? 1.12
        : 1.28;
  const raw = (totalArea / 12) * ceilingFactor * prop;
  const stepped = Math.round(raw * 2) / 2;
  return clamp(stepped, 0.5, 30);
}

function acLabel(pref: AcPreference, hp: number, inverter: InverterPreference): string {
  const inv =
    inverter === "inverter"
      ? "inverter"
      : inverter === "non-inverter"
        ? "non-inverter"
        : "inverter-preferred";
  if (pref === "window") return `Window-type AC (${inv === "non-inverter" ? "non-inverter typical" : "inverter where available"})`;
  if (pref === "ducted") return `Concealed ducted split — ${inv} class`;
  if (pref === "vrf") return "VRF / VRV multi-zone system";
  if (pref === "split-inverter")
    return `Wall-mounted ${inv} split (~${hp} HP class)`;
  if (hp <= 1.5) return `Wall-mounted ${inv} split (1.0–1.5 HP)`;
  if (hp <= 2.5) return `Wall-mounted ${inv} split (2.0–2.5 HP)`;
  return "High-wall splits or light-commercial ducted (engineer review)";
}

export function buildEstimate(input: EstimateInput): EstimateResult {
  const hp = computeRecommendedHp(input);
  const totalArea = Math.max(1, input.roomSizeSqm * Math.max(1, input.roomCount));

  const budgetMult =
    input.budget === "economy" ? 0.92 : input.budget === "premium" ? 1.18 : 1;

  const baseInstall = 18000 + totalArea * 950 + hp * 28000;
  const installLow = Math.round(baseInstall * 0.85 * budgetMult);
  const installHigh = Math.round(baseInstall * 1.25 * budgetMult);

  const pmsBase = 2800 + hp * 1800;
  const pmsAnnualLow = Math.round(pmsBase * 3 * 0.9);
  const pmsAnnualHigh = Math.round(pmsBase * 4 * 1.1);

  const cleaningBase = 1200 + hp * 650 + totalArea * 18;
  const cleaningAnnualLow = Math.round(cleaningBase * 3 * 0.88);
  const cleaningAnnualHigh = Math.round(cleaningBase * 5 * 1.05);

  const inverterBoost =
    input.inverterPreference === "inverter" ? 1.12 : input.inverterPreference === "non-inverter" ? 0.92 : 1;
  const seer =
    (input.budget === "premium" ? 16 : input.budget === "economy" ? 11 : 13) * inverterBoost;
  const kwhMonthApprox = Math.round((hp * 1.8 * totalArea * 0.06) / seer * 30);

  const ac = acLabel(input.acPreference, hp, input.inverterPreference);

  return {
    recommendedHp: hp,
    recommendedAcLabel: ac,
    installPriceLow: installLow,
    installPriceHigh: installHigh,
    pmsAnnualLow,
    pmsAnnualHigh,
    cleaningAnnualLow,
    cleaningAnnualHigh,
    kwhMonthApprox,
    solutionTitle: "Recommended solution (indicative)",
    solutionBullets: [
      `${hp} HP cooling class for ~${Math.round(totalArea)} sqm conditioned load (rule-of-thumb).`,
      `${ac} — final selection depends on electrical capacity, line runs, and occupancy.`,
      `Indicative install band: ₱${installLow.toLocaleString("en-PH")}–₱${installHigh.toLocaleString("en-PH")} before site survey.`,
      `Preventive maintenance budget: ₱${pmsAnnualLow.toLocaleString("en-PH")}–₱${pmsAnnualHigh.toLocaleString("en-PH")} / year (4 visits baseline).`,
      `Deep cleaning / PMS visits: ₱${cleaningAnnualLow.toLocaleString("en-PH")}–₱${cleaningAnnualHigh.toLocaleString("en-PH")} / year (3–5 visits typical).`,
    ],
    disclaimer:
      "Figures are non-binding ballparks for planning. A licensed site survey, load calculation, and formal quotation supersede this estimator.",
  };
}
