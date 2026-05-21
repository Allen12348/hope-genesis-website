import {
  Building2,
  Factory,
  Fan,
  Home,
  Refrigerator,
  ShieldCheck,
  Snowflake,
  Sparkles,
  Wrench,
} from "lucide-react";
import type { Service } from "@/types";

const u = (id: string, w = 2000) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const services: Service[] = [
  {
    slug: "aircon-installation",
    title: "Aircon Installation",
    shortDescription:
      "Precision sizing, clean line sets, and commissioning for split, multi-split, and ducted systems.",
    description:
      "We engineer installs for long-term efficiency: load calculation, routing discipline, vacuum & dehydration, and documented commissioning so your system performs to manufacturer standards from day one.",
    icon: Snowflake,
    highlights: [
      "Manufacturer-aligned installation methods",
      "Leak-free brazing & nitrogen purge",
      "Electrical protection & grounding checks",
    ],
    idealFor: ["Homes", "Offices", "Retail", "Clinics"],
    heroImage: u("photo-1621905252507-b35492cc74b4"),
    heroImageAlt: "Technician commissioning outdoor condensing unit",
  },
  {
    slug: "aircon-cleaning",
    title: "Aircon Cleaning",
    shortDescription:
      "Deep chemical cleaning that restores airflow, removes biofilm, and protects indoor air quality.",
    description:
      "Our deep-clean protocol targets evaporator fouling, drain hygiene, and blower cleanliness — improving efficiency, odor control, and occupant comfort.",
    icon: Sparkles,
    highlights: [
      "Coil + drain pan sanitation",
      "Airflow restoration metrics",
      "Post-service performance report",
    ],
    idealFor: ["Residential", "BPO", "Schools", "Hospitality"],
    heroImage: u("photo-1581578731548-c64695cc6952"),
    heroImageAlt: "Technicians reviewing service documentation on site",
  },
  {
    slug: "hvac-installation",
    title: "HVAC Installation",
    shortDescription:
      "Commercial-grade HVAC delivery: VRF/VRV, packaged units, and engineered duct distribution.",
    description:
      "From shop drawings to startup, we coordinate lifts, electrical interfaces, controls integration, and turnover documentation for enterprise-ready HVAC systems.",
    icon: Fan,
    highlights: [
      "VRF/VRV & packaged systems",
      "Balancing & controls handover",
      "As-built documentation",
    ],
    idealFor: ["Buildings", "Campuses", "Mixed-use"],
    heroImage: u("photo-1581094794329-c8112a89af12"),
    heroImageAlt: "Commercial HVAC duct routing in ceiling plenum",
  },
  {
    slug: "preventive-maintenance",
    title: "Preventive Maintenance",
    shortDescription:
      "Predictable PM programs that reduce emergency calls and extend equipment life.",
    description:
      "Scheduled inspections, filter cycles, electrical thermography where applicable, and trend logging — packaged into SLAs that operations teams can trust.",
    icon: ShieldCheck,
    highlights: [
      "PM calendars & reminders",
      "Wear-item forecasting",
      "Priority response windows",
    ],
    idealFor: ["Facilities", "Manufacturing", "Cold chain"],
    heroImage: u("photo-1504384308090-c894fdcc538d"),
    heroImageAlt: "Precision cooling equipment in a technical space",
  },
  {
    slug: "troubleshooting-repair",
    title: "Troubleshooting & Repair",
    shortDescription:
      "Rapid diagnostics for refrigerant circuits, controls, and electrical faults.",
    description:
      "Our technicians carry common OEM parts, use structured troubleshooting trees, and validate repairs with performance verification — not guesswork.",
    icon: Wrench,
    highlights: [
      "Structured fault isolation",
      "Safe refrigerant handling",
      "Warranty-friendly repairs",
    ],
    idealFor: ["All property types", "Mission-critical spaces"],
    heroImage: u("photo-1621905252507-b35492cc74b4"),
    heroImageAlt: "HVAC technician performing diagnostic checks on equipment",
  },
  {
    slug: "refrigeration-services",
    title: "Refrigeration Services",
    shortDescription:
      "Walk-ins, display cases, process chillers, and low-temp systems — installed and maintained to spec.",
    description:
      "We support food service, pharma-adjacent storage, and light industrial process cooling with defrost strategy expertise and tight temperature stability.",
    icon: Refrigerator,
    highlights: [
      "Walk-in & reach-in expertise",
      "Defrost optimization",
      "Energy-conscious setpoints",
    ],
    idealFor: ["Restaurants", "Groceries", "Commissaries"],
    heroImage: u("photo-1582719478250-c89cae4dc85b"),
    heroImageAlt: "Industrial refrigeration piping and equipment",
  },
  {
    slug: "industrial-hvac",
    title: "Industrial HVAC",
    shortDescription:
      "Heavy-duty ventilation, makeup air, and environmental control for production environments.",
    description:
      "We align HVAC with process heat loads, exhaust requirements, and safety standards — keeping operators comfortable without compromising production.",
    icon: Factory,
    highlights: [
      "Makeup air & exhaust coordination",
      "Equipment redundancy planning",
      "Safety-first lockout culture",
    ],
    idealFor: ["Plants", "Warehouses", "Workshops"],
    heroImage: u("photo-1581092160562-40aa08e78837"),
    heroImageAlt: "Industrial facility interior with environmental systems",
  },
  {
    slug: "residential-ac",
    title: "Residential AC",
    shortDescription:
      "Quiet comfort, premium finishes, and respectful crews for discerning homeowners.",
    description:
      "From inverter splits to concealed ducted systems, we prioritize aesthetics, sound levels, and honest recommendations that match your budget.",
    icon: Home,
    highlights: [
      "Inverter expertise",
      "Concealed ducting options",
      "Neat trunking & sealing",
    ],
    idealFor: ["Homes", "Townhouses", "Condos"],
    heroImage: u("photo-1600585154340-be6161a56a0c"),
    heroImageAlt: "Luxury living room with discreet climate control",
  },
  {
    slug: "commercial-ac",
    title: "Commercial AC",
    shortDescription:
      "High-performance cooling for offices, retail, and public spaces with minimal disruption.",
    description:
      "Phased work, after-hours options, and clear stakeholder communication — designed for businesses that cannot afford operational chaos.",
    icon: Building2,
    highlights: [
      "After-hours execution",
      "Tenant-friendly coordination",
      "Energy optimization reviews",
    ],
    idealFor: ["Offices", "Retail", "Clinics"],
    heroImage: u("photo-1441986300917-64674bd600d8"),
    heroImageAlt: "Retail interior with professional air conditioning",
  },
];

export function getServiceBySlug(slug: string) {
  return services.find((s) => s.slug === slug);
}
