/**
 * Primary marketing navigation & lead shortcuts.
 * Imported by `@/constants/site` for backward-compatible exports.
 */
export const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/projects", label: "Projects" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/brands", label: "Brands" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
] as const;

/** Homepage quick links — estimate and contact only (no operational ERP tools). */
export const PLATFORM_LINKS = [
  {
    href: "/estimate",
    label: "Request an estimate",
    description: "Ballpark pricing for your space in a few minutes",
  },
  {
    href: "/contact",
    label: "Contact us",
    description: "Surveys, quotes, and service inquiries",
  },
] as const;

export const FOOTER_SERVICE_LINKS = [
  { href: "/services/installation", label: "Aircon installation" },
  { href: "/services/cleaning", label: "Aircon cleaning" },
  { href: "/services/repair", label: "Aircon repair" },
  { href: "/services/maintenance", label: "Preventive maintenance" },
  { href: "/services/refrigeration-services", label: "Refrigeration services" },
] as const;
