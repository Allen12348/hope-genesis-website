export type SubscriptionPlan = {
  id: string;
  name: string;
  tagline: string;
  monthlyPrice: number;
  currency: "PHP";
  recommended?: boolean;
  included: string[];
  priorityRepair: string;
  scheduledPms: string;
  discounts: string;
};

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "residential-care",
    name: "Residential Care Plan",
    tagline: "Worry-free comfort for premium homes",
    monthlyPrice: 1299,
    currency: "PHP",
    included: [
      "Quarterly health check (filters + drain test)",
      "Priority booking window",
      "10% discount on chemical deep clean",
      "Digital service history vault",
    ],
    priorityRepair: "48-hour response target (Metro/Laguna)",
    scheduledPms: "4 visits / year baseline",
    discounts: "5% off parts during active plan",
  },
  {
    id: "business-hvac",
    name: "Business HVAC Plan",
    tagline: "Retail, clinics, and light commercial",
    monthlyPrice: 3499,
    currency: "PHP",
    recommended: true,
    included: [
      "Monthly walkthrough + coil inspection cadence",
      "Trend logging snapshot (temperatures/pressures)",
      "Dedicated account coordinator",
      "After-hours option (add-on)",
    ],
    priorityRepair: "24-hour response target",
    scheduledPms: "12 visits / year (customizable)",
    discounts: "8% off labor for corrective work",
  },
  {
    id: "enterprise-maintenance",
    name: "Enterprise Maintenance Plan",
    tagline: "VRF campuses, plants, and cold chain",
    monthlyPrice: 0,
    currency: "PHP",
    included: [
      "Custom SLA + reporting pack",
      "Spares staging recommendation",
      "Quarterly executive summary",
      "Custom reporting pack and asset register review",
    ],
    priorityRepair: "SLA-based (contracted)",
    scheduledPms: "Engineered program (per asset list)",
    discounts: "Volume pricing on fleet rollouts",
  },
];
