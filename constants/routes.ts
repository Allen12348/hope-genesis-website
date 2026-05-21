/** Primary service pages use clean URLs; values map to `data/services` slugs. */
export const PRIMARY_SERVICE_SEGMENTS = [
  { segment: "installation", dataSlug: "aircon-installation" },
  { segment: "cleaning", dataSlug: "aircon-cleaning" },
  { segment: "maintenance", dataSlug: "preventive-maintenance" },
  { segment: "repair", dataSlug: "troubleshooting-repair" },
] as const;

export type PrimaryServiceSegment =
  (typeof PRIMARY_SERVICE_SEGMENTS)[number]["segment"];

const EXCLUDED_SLUGS: Set<string> = new Set(
  PRIMARY_SERVICE_SEGMENTS.map((s) => s.dataSlug),
);

export function isPrimaryServiceDataSlug(slug: string) {
  return EXCLUDED_SLUGS.has(slug);
}

export function getPrimarySegmentForDataSlug(
  dataSlug: string,
): PrimaryServiceSegment | undefined {
  const hit = PRIMARY_SERVICE_SEGMENTS.find((s) => s.dataSlug === dataSlug);
  return hit?.segment;
}

export function getDataSlugForSegment(segment: string) {
  return PRIMARY_SERVICE_SEGMENTS.find((s) => s.segment === segment)
    ?.dataSlug;
}

/** Public URL for a service detail page (pretty paths for primary offerings). */
export function serviceDetailHref(dataSlug: string) {
  const seg = getPrimarySegmentForDataSlug(dataSlug);
  return seg ? `/services/${seg}` : `/services/${dataSlug}`;
}
