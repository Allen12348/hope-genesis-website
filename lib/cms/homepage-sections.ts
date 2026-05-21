import type { HomeSectionVisibility } from "@/lib/cms/marketing-cms-defaults";
import { safeJsonParse } from "@/lib/utils/safe-json-parse";

/** Legacy homepage blocks (hero and builder overlay are outside this list). */
export const HOME_LEGACY_SECTION_IDS = [
  "heroServicesStrip",
  "servicesPreview",
  "businessTrust",
  "instantEstimateBanner",
  "beforeAfter",
  "projectsPreview",
  "testimonials",
  "brands",
  "aboutPreview",
  "customerPlatformStrip",
  "coverageMap",
  "lifecycleSubscriptions",
  "technicianShowcase",
  "contactCta",
] as const;

export type HomeLegacySectionId = (typeof HOME_LEGACY_SECTION_IDS)[number];

export const DEFAULT_HOME_SECTION_ORDER: HomeLegacySectionId[] = [...HOME_LEGACY_SECTION_IDS];

export const HOME_SECTION_LABELS: Record<HomeLegacySectionId, string> = {
  heroServicesStrip: "Service cards strip",
  servicesPreview: "Services preview",
  businessTrust: "Business trust",
  instantEstimateBanner: "Instant estimate banner",
  beforeAfter: "Before & after",
  projectsPreview: "Projects preview",
  testimonials: "Testimonials",
  brands: "Partner brands",
  aboutPreview: "About preview",
  customerPlatformStrip: "Quick links",
  coverageMap: "Coverage map",
  lifecycleSubscriptions: "Maintenance subscriptions",
  technicianShowcase: "Technician showcase",
  contactCta: "Contact CTA",
};

/** Stored inside `SiteSettings.sectionVisibilityJson` alongside flat legacy keys. */
export type SiteLayoutSettingsPayload = {
  visibility?: Partial<HomeSectionVisibility>;
  order?: string[];
};

export function isHomeLegacySectionId(v: string): v is HomeLegacySectionId {
  return (HOME_LEGACY_SECTION_IDS as readonly string[]).includes(v);
}

export function normalizeHomeSectionOrder(order: unknown): HomeLegacySectionId[] {
  const seen = new Set<HomeLegacySectionId>();
  const result: HomeLegacySectionId[] = [];

  if (Array.isArray(order)) {
    for (const raw of order) {
      if (typeof raw !== "string" || !isHomeLegacySectionId(raw) || seen.has(raw)) continue;
      seen.add(raw);
      result.push(raw);
    }
  }

  for (const id of DEFAULT_HOME_SECTION_ORDER) {
    if (!seen.has(id)) result.push(id);
  }

  return result;
}

export function parseSiteLayoutJson(raw: string | null | undefined): SiteLayoutSettingsPayload {
  if (!raw?.trim()) return {};
  const parsed = safeJsonParse<unknown>(raw, null);
  if (!parsed || typeof parsed !== "object") return {};
  return parsed as SiteLayoutSettingsPayload;
}

/** Flat legacy `{ heroServicesStrip: true }` or nested `{ visibility, order }`. */
export function isNestedSiteLayoutPayload(parsed: Record<string, unknown>): boolean {
  return "visibility" in parsed || "order" in parsed;
}

export function serializeSiteLayoutPayload(visibility: HomeSectionVisibility, order: HomeLegacySectionId[]): string {
  return JSON.stringify({ visibility, order }, null, 2);
}
