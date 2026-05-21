import type { BlogPost } from "@/types";

export const blogPosts: BlogPost[] = [
  {
    slug: "split-vs-window-type-ac",
    title: "Split vs Window Type AC: What Enterprises and Homeowners Should Know",
    description:
      "Compare efficiency, noise, installation flexibility, and lifecycle costs — with practical selection guidance for Philippine climates.",
    category: "Buying Guide",
    publishedAt: "2026-04-12",
    readingMinutes: 8,
    featured: true,
    coverImage:
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1400&q=80",
    coverAlt: "Technician servicing outdoor condensing unit",
    body: [
      "Window-type units are compact and fast to install, but they trade away efficiency, noise control, and premium aesthetics.",
      "Split systems separate the noisy condenser from the indoor space, enabling better sleep quality and cleaner interior design.",
      "For small offices and retail, splits typically win on comfort and brand perception; window units remain viable for tight budgets in utility spaces.",
      "If you are planning VRF or multi-head splits later, ask your contractor about line set routes early — it affects ceiling and facade work.",
    ],
  },
  {
    slug: "inverter-vs-non-inverter",
    title: "Inverter vs Non-Inverter: Real-World Savings and Comfort",
    description:
      "How inverter compressors modulate capacity, reduce temperature swing, and change your monthly kWh profile.",
    category: "Energy",
    publishedAt: "2026-03-28",
    readingMinutes: 7,
    coverImage:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=80",
    coverAlt: "Modern interior with AC vents",
    body: [
      "Non-inverter systems cycle on/off more aggressively; inverters hold a steadier room temperature with less peak current.",
      "Savings depend on setpoint discipline, insulation, and how often doors open — model marketing claims are not guarantees.",
      "Commercial sites with long run hours usually see faster payback; intermittent use (short meetings) may see smaller deltas.",
      "Pair inverter hardware with scheduled maintenance — dirty coils erase efficiency advantages quickly.",
    ],
  },
  {
    slug: "why-ac-leaks-water",
    title: "Why Your AC Leaks Water (and When It Is an Emergency)",
    description:
      "From clogged condensate drains to frozen coils — a field-service perspective on diagnosis and prevention.",
    category: "Troubleshooting",
    publishedAt: "2026-03-02",
    readingMinutes: 6,
    coverImage:
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1400&q=80",
    coverAlt: "Ceiling-mounted HVAC ducts",
    body: [
      "The most common cause is a blocked condensate line or dirty drain pan — water backs up and finds the path of least resistance.",
      "Low refrigerant can cause coil icing; when it melts, it looks like a sudden leak even though the root cause is charge/ airflow.",
      "Bad installation slope on drain lines shows up months later after dust and biofilm accumulate.",
      "If water is near electrical gear or server racks, treat it as urgent — shut down and call a licensed technician.",
    ],
  },
  {
    slug: "best-ac-for-small-rooms",
    title: "Best AC for Small Rooms: Sizing, Noise, and Installation Traps",
    description:
      "Avoid oversized units that short-cycle; pick the right HP class and mounting location for tight bedrooms and offices.",
    category: "Buying Guide",
    publishedAt: "2026-02-18",
    readingMinutes: 5,
    coverImage:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80",
    coverAlt: "Comfortable living room interior",
    body: [
      "For ~10–14 sqm bedrooms, 0.75–1.0 HP is common — but ceiling height, glass exposure, and roof heat matter more than floor area alone.",
      "Oversizing creates clammy humidity and noisy cycling; a proper load view beats guesswork.",
      "Consider sleep mode noise specs if the indoor unit is near the bed; a few dB matter at night.",
      "If the outdoor unit is sun-baked, ask about shading and service access — both affect longevity.",
    ],
  },
  {
    slug: "how-often-should-ac-be-cleaned",
    title: "How Often Should AC Be Cleaned? A Maintenance Calendar That Works",
    description:
      "Residential vs commercial cadences, filter habits, and when to schedule chemical deep cleaning.",
    category: "Maintenance",
    publishedAt: "2026-01-30",
    readingMinutes: 6,
    featured: true,
    coverImage:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1400&q=80",
    coverAlt: "Technicians reviewing plans",
    body: [
      "Wash reusable filters monthly in homes; high-dust environments or pet-heavy homes may need bi-weekly checks.",
      "Commercial retail and clinics often need quarterly coil inspections due to foot traffic and door cycles.",
      "Chemical cleaning is not every month — it is for fouled coils or persistent odors/mold risk, performed by trained techs.",
      "Document pressures and temperatures each visit so you can trend performance before failures surprise you.",
    ],
  },
];

export function getBlogBySlug(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}
