import type { GalleryImage, Project } from "@/types";

export const projects: Project[] = [
  {
    slug: "vrf-campus-retrofit",
    title: "VRF Campus Retrofit",
    category: "Commercial",
    location: "Santa Rosa, Laguna",
    year: "2025",
    summary:
      "Phased VRF replacement across a 6-story office wing with minimal tenant disruption.",
    scope: [
      "Lift planning & night work windows",
      "VRF commissioning & leak verification",
      "BMS integration handover",
    ],
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Modern office interior with linear lighting",
    beforeImage:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    afterImage:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
    equipmentUsed: [
      "VRF outdoor modules (heat recovery)",
      "Cassette & ducted indoor units",
      "Centralized controller + BACnet gateway",
    ],
    installationDuration: "14 weeks (phased nights/weekends)",
    challenge:
      "Occupied building with strict noise curfew, limited crane windows, and legacy R-22 piping paths that could not support new pressures.",
    solution:
      "Staged riser replacement, temporary spot cooling during cutovers, and leak-tested line sets with documented nitrogen holds per floor.",
    results: [
      "Measured EER improvement vs. legacy splits",
      "Tenant complaints down during peak season",
      "BMS trend data accepted by facilities team",
    ],
  },
  {
    slug: "cold-chain-expansion",
    title: "Cold Chain Expansion",
    category: "Refrigeration",
    location: "Cabuyao, Laguna",
    year: "2024",
    summary:
      "Low-temp cold room expansion with redundant refrigeration and smart defrost sequencing.",
    scope: [
      "Load calculations & equipment selection",
      "Panel + door vapor sealing",
      "Temperature alarm commissioning",
    ],
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Industrial refrigeration piping",
    beforeImage:
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1200&q=80",
    afterImage:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
    equipmentUsed: [
      "Low-temp scroll rack",
      "Electronic expansion valves",
      "Room probes + SMS alarm dialer",
    ],
    installationDuration: "9 weeks",
    challenge:
      "Tight dock-to-chiller path and humidity spikes during panel installation in rainy season.",
    solution:
      "Sequenced panel install with temporary dehumidification, vapor barriers at joints, and redundant defrost logic tuned to door cycles.",
    results: [
      "Stable box temperature band",
      "Reduced defrost energy vs. prior controller",
      "Operator runbooks + alarm ladder documented",
    ],
  },
  {
    slug: "luxury-residence-ducted",
    title: "Luxury Residence — Concealed Ducted",
    category: "Residential",
    location: "Canlubang, Laguna",
    year: "2024",
    summary:
      "Whole-home concealed ducting with premium diffusers and whisper-quiet zoning.",
    scope: [
      "Ceiling coordination with interior designer",
      "Acoustic isolation for blower sections",
      "Zoning & commissioning",
    ],
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Luxury living room interior",
    beforeImage:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    afterImage:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    equipmentUsed: [
      "Premium ducted inverter system",
      "Linear slot diffusers",
      "Acoustic flex + rigid mains",
    ],
    installationDuration: "5 weeks",
    challenge:
      "Low ceiling cavities and strict interior finishes — no exposed services allowed in living zones.",
    solution:
      "3D routing coordination, isolated blower platform, and commissioning with room-by-room airflow balancing reports.",
    results: [
      "NC levels within owner comfort targets",
      "Even temperature across zones",
      "Concealed aesthetic maintained end-to-end",
    ],
  },
  {
    slug: "manufacturing-make-up-air",
    title: "Manufacturing Makeup Air Upgrade",
    category: "Commercial",
    location: "Calamba, Laguna",
    year: "2023",
    summary:
      "Makeup air and exhaust rebalance to stabilize line conditions and improve operator comfort.",
    scope: [
      "Airflow verification & reporting",
      "Electrical protection upgrades",
      "Operator training",
    ],
    image:
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Industrial facility interior",
    beforeImage:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
    afterImage:
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1200&q=80",
    equipmentUsed: [
      "Makeup air handler with VFD",
      "Exhaust fan rebalance + silencers",
      "Differential pressure monitors",
    ],
    installationDuration: "6 weeks",
    challenge:
      "Negative pressure spikes affecting product drying windows and operator heat stress near lines.",
    solution:
      "Measured airflow mapping, staged fan curve adjustments, and makeup air tempered to avoid condensation at open doors.",
    results: [
      "Stable line-side pressure band",
      "Operator comfort improvement (surveyed)",
      "Energy use tracked month-over-month",
    ],
  },
  {
    slug: "flagship-retail-inverter-wall",
    title: "Flagship Retail — Inverter Wall Systems",
    category: "Commercial",
    location: "Alabang, Muntinlupa",
    year: "2023",
    summary:
      "High-traffic retail cooling with rapid recovery and premium trunking concealment.",
    scope: [
      "Peak load modeling for foot traffic",
      "Rapid install phasing",
      "Warranty registration support",
    ],
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Retail store interior",
    beforeImage:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
    afterImage:
      "https://images.unsplash.com/photo-1555529908-3e8e99146fff?auto=format&fit=crop&w=1200&q=80",
    equipmentUsed: [
      "High-wall inverter splits (multi-head)",
      "Painted trunking + line hide",
      "Smart controllers for staff lockout",
    ],
    installationDuration: "10 days (after-hours)",
    challenge:
      "Grand opening deadline with strict mall noise rules and limited stockroom ceiling access.",
    solution:
      "Night-only drilling, pre-fabricated trunking runs, and pre-charged line sets to shorten vacuum times.",
    results: [
      "Rapid pull-down after door rush events",
      "Clean customer-facing routing",
      "Warranty packets handed to mall engineering",
    ],
  },
  {
    slug: "mid-rise-residential-turnover",
    title: "Mid-rise Residential Turnover",
    category: "Residential",
    location: "Calamba, Laguna",
    year: "2025",
    summary:
      "Tower-wide split-type turnover with standardized QA packets for unit owners.",
    scope: [
      "Pressure & vacuum documentation",
      "Owner orientation sessions",
      "Defect punch-list closure",
    ],
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Modern residential building facade",
    beforeImage:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
    afterImage:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
    equipmentUsed: [
      "Inverter wall splits (developer spec)",
      "Pre-insulated copper where applicable",
      "Leak detection + vacuum logs per unit",
    ],
    installationDuration: "Rolling 4 months",
    challenge:
      "High unit count with varying owner punch lists and tight turnover dates per floor.",
    solution:
      "Standard QA packet, photo evidence library, and dedicated punch-list team with daily sign-off.",
    results: [
      "Developer acceptance rate improved vs. prior contractor",
      "Owners trained on filter cleaning basics",
      "Warranty registrations batch-processed",
    ],
  },
];

export function getProjectBySlug(slug: string) {
  return projects.find((p) => p.slug === slug);
}

/** Curated gallery frames for the interactive gallery section. */
export const galleryImages: GalleryImage[] = [
  {
    id: "g1",
    src: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1400&q=80",
    alt: "Technician servicing outdoor condensing unit",
    caption: "Commissioning & leak verification on a high-static ducted system.",
  },
  {
    id: "g2",
    src: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1400&q=80",
    alt: "HVAC duct installation in commercial ceiling",
    caption: "Clean routing, rigid supports, and sealed joints for long-term airflow integrity.",
  },
  {
    id: "g3",
    src: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1400&q=80",
    alt: "Industrial equipment and piping",
    caption: "Industrial refrigeration line sets with disciplined insulation cladding.",
  },
  {
    id: "g4",
    src: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=80",
    alt: "Modern minimalist interior with AC vents",
    caption: "Concealed duct aesthetics with linear diffusers for premium residences.",
  },
  {
    id: "g5",
    src: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1400&q=80",
    alt: "Technicians reviewing blueprint",
    caption: "Site coordination — we build to drawings, then document what changed.",
  },
  {
    id: "g6",
    src: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1400&q=80",
    alt: "Server room cooling",
    caption: "Precision cooling approach for heat-dense spaces.",
  },
];
