/**
 * Prisma `Service.iconKey` values — aligned with `@/lib/cms/service-icons`.
 * Used by seed data and offline catalog fallbacks.
 */
export const SERVICE_ICON_KEY_BY_SLUG: Record<string, string> = {
  "aircon-installation": "snowflake",
  "aircon-cleaning": "sparkles",
  "hvac-installation": "fan",
  "preventive-maintenance": "shieldcheck",
  "troubleshooting-repair": "wrench",
  "refrigeration-services": "refrigerator",
  "industrial-hvac": "factory",
  "residential-ac": "home",
  "commercial-ac": "building2",
};

export function serviceIconKeyForSlug(slug: string): string {
  return SERVICE_ICON_KEY_BY_SLUG[slug] ?? "sparkles";
}
