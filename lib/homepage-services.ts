import type { SerializedService } from "@/types";

/** Five primary offerings shown on the public homepage. */
export const HOMEPAGE_PRIMARY_SERVICE_SLUGS = [
  "aircon-installation",
  "aircon-cleaning",
  "troubleshooting-repair",
  "preventive-maintenance",
  "refrigeration-services",
] as const;

export function selectHomepageServices(all: SerializedService[]): SerializedService[] {
  const map = new Map(all.map((s) => [s.slug, s]));
  const picked = HOMEPAGE_PRIMARY_SERVICE_SLUGS.map((slug) => map.get(slug)).filter(Boolean) as SerializedService[];
  if (picked.length > 0) return picked;
  return all.slice(0, 5);
}
