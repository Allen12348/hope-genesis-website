import type { HomeLegacySectionId } from "@/lib/cms/homepage-sections";
import { HOME_SECTION_LABELS } from "@/lib/cms/homepage-sections";
import type { HomepageCanvasSectionId } from "@/lib/cms/homepage-visual-editor/types";

export type HomepageFieldType =
  | "text"
  | "textarea"
  | "url"
  | "imageUrl"
  | "number"
  | "boolean"
  | "overlayOpacity";

export type HomepageEditableField = {
  key: string;
  label: string;
  type: HomepageFieldType;
  path: string;
  required?: boolean;
  placeholder?: string;
  helper?: string;
};

export type HomepageSectionBlockDef = {
  id: HomepageCanvasSectionId;
  type: string;
  label: string;
  description: string;
  /** Cannot be removed from the homepage. */
  required: boolean;
  /** Supports duplicate action. */
  duplicatable: boolean;
  visibilityKey?: keyof import("@/lib/cms/marketing-cms-defaults").HomeSectionVisibility;
  fields: HomepageEditableField[];
};

const shellFields = (prefix: string): HomepageEditableField[] => [
  { key: "eyebrow", label: "Eyebrow", type: "text", path: `${prefix}.eyebrow` },
  { key: "title", label: "Title", type: "text", path: `${prefix}.title`, required: true },
  { key: "description", label: "Description", type: "textarea", path: `${prefix}.description` },
];

export const HOMEPAGE_SECTION_BLOCKS: HomepageSectionBlockDef[] = [
  {
    id: "hero",
    type: "hero",
    label: "Hero",
    description: "Main headline, subtitle, CTAs, trust chips, and stats.",
    required: true,
    duplicatable: false,
    fields: [
      { key: "eyebrowBrand", label: "Brand eyebrow", type: "text", path: "hero.eyebrowBrand" },
      { key: "eyebrowRegion", label: "Region eyebrow", type: "text", path: "hero.eyebrowRegion" },
      { key: "titleLine1", label: "Headline line 1", type: "text", path: "hero.titleLine1", required: true },
      { key: "titleAccent", label: "Headline accent", type: "text", path: "hero.titleAccent" },
      { key: "titleLine2", label: "Headline line 2", type: "text", path: "hero.titleLine2" },
      { key: "subtitle", label: "Subtitle", type: "textarea", path: "hero.subtitle", required: true },
      { key: "heroBackgroundImageUrl", label: "Background image URL", type: "imageUrl", path: "hero.heroBackgroundImageUrl" },
      { key: "heroOverlayOpacity", label: "Overlay opacity", type: "overlayOpacity", path: "hero.heroOverlayOpacity" },
      {
        key: "heroPrimaryButtonLabel",
        label: "Primary button label",
        type: "text",
        path: "hero.heroPrimaryButtonLabel",
      },
      { key: "heroPrimaryButtonUrl", label: "Primary button URL", type: "url", path: "hero.heroPrimaryButtonUrl" },
      {
        key: "heroSecondaryButtonLabel",
        label: "Secondary button label",
        type: "text",
        path: "hero.heroSecondaryButtonLabel",
      },
      { key: "heroSecondaryButtonUrl", label: "Secondary button URL", type: "url", path: "hero.heroSecondaryButtonUrl" },
    ],
  },
  {
    id: "heroServicesStrip",
    type: "stats",
    label: HOME_SECTION_LABELS.heroServicesStrip,
    description: "Service cards below the hero.",
    required: false,
    duplicatable: false,
    visibilityKey: "heroServicesStrip",
    fields: shellFields("homeSectionShells.heroServices"),
  },
  {
    id: "servicesPreview",
    type: "servicesPreview",
    label: HOME_SECTION_LABELS.servicesPreview,
    description: "Featured services grid.",
    required: false,
    duplicatable: false,
    visibilityKey: "servicesPreview",
    fields: shellFields("homeSectionShells.servicesPreview"),
  },
  {
    id: "businessTrust",
    type: "trustStrip",
    label: HOME_SECTION_LABELS.businessTrust,
    description: "Certifications, partners, and trust signals.",
    required: false,
    duplicatable: false,
    visibilityKey: "businessTrust",
    fields: shellFields("homeSectionShells.businessTrust"),
  },
  {
    id: "instantEstimateBanner",
    type: "cta",
    label: HOME_SECTION_LABELS.instantEstimateBanner,
    description: "Mid-page estimate call-to-action.",
    required: false,
    duplicatable: false,
    visibilityKey: "instantEstimateBanner",
    fields: shellFields("homeSectionShells.instantEstimate"),
  },
  {
    id: "beforeAfter",
    type: "beforeAfter",
    label: HOME_SECTION_LABELS.beforeAfter,
    description: "Before and after project showcase.",
    required: false,
    duplicatable: false,
    visibilityKey: "beforeAfter",
    fields: shellFields("homeSectionShells.beforeAfter"),
  },
  {
    id: "projectsPreview",
    type: "projectsPreview",
    label: HOME_SECTION_LABELS.projectsPreview,
    description: "Recent projects carousel.",
    required: false,
    duplicatable: false,
    visibilityKey: "projectsPreview",
    fields: shellFields("homeSectionShells.projectsPreview"),
  },
  {
    id: "testimonials",
    type: "testimonials",
    label: HOME_SECTION_LABELS.testimonials,
    description: "Customer testimonials (requires published reviews).",
    required: false,
    duplicatable: false,
    visibilityKey: "testimonials",
    fields: shellFields("homeSectionShells.testimonialsPreview"),
  },
  {
    id: "brands",
    type: "brands",
    label: HOME_SECTION_LABELS.brands,
    description: "Partner brand logos.",
    required: false,
    duplicatable: false,
    visibilityKey: "brands",
    fields: shellFields("homeSectionShells.brandsPreview"),
  },
  {
    id: "aboutPreview",
    type: "aboutPreview",
    label: HOME_SECTION_LABELS.aboutPreview,
    description: "About Hope Genesis preview block.",
    required: false,
    duplicatable: false,
    visibilityKey: "aboutPreview",
    fields: [
      ...shellFields("aboutPreview"),
      { key: "ctaLabel", label: "CTA label", type: "text", path: "aboutPreview.ctaLabel" },
      { key: "ctaHref", label: "CTA URL", type: "url", path: "aboutPreview.ctaHref" },
      { key: "imageUrl", label: "Image URL", type: "imageUrl", path: "aboutPreview.imageUrl" },
    ],
  },
  {
    id: "customerPlatformStrip",
    type: "coverageMap",
    label: HOME_SECTION_LABELS.customerPlatformStrip,
    description: "Online tools strip for customers.",
    required: false,
    duplicatable: false,
    visibilityKey: "customerPlatformStrip",
    fields: shellFields("customerPlatform"),
  },
  {
    id: "coverageMap",
    type: "coverageMap",
    label: HOME_SECTION_LABELS.coverageMap,
    description: "Service area map.",
    required: false,
    duplicatable: false,
    visibilityKey: "coverageMap",
    fields: shellFields("homeSectionShells.coverage"),
  },
  {
    id: "lifecycleSubscriptions",
    type: "cta",
    label: HOME_SECTION_LABELS.lifecycleSubscriptions,
    description: "Maintenance subscription plans.",
    required: false,
    duplicatable: false,
    visibilityKey: "lifecycleSubscriptions",
    fields: shellFields("homeSectionShells.lifecycle"),
  },
  {
    id: "technicianShowcase",
    type: "cta",
    label: HOME_SECTION_LABELS.technicianShowcase,
    description: "Technician team showcase.",
    required: false,
    duplicatable: false,
    visibilityKey: "technicianShowcase",
    fields: shellFields("homeSectionShells.people"),
  },
  {
    id: "contactCta",
    type: "contactCTA",
    label: HOME_SECTION_LABELS.contactCta,
    description: "Bottom contact call-to-action.",
    required: false,
    duplicatable: false,
    visibilityKey: "contactCta",
    fields: shellFields("contactCta"),
  },
];

export const HOMEPAGE_BLOCK_BY_ID = Object.fromEntries(
  HOMEPAGE_SECTION_BLOCKS.map((b) => [b.id, b]),
) as Record<HomepageCanvasSectionId, HomepageSectionBlockDef>;

export function getCanvasSectionIds(order: HomeLegacySectionId[]): HomepageCanvasSectionId[] {
  return ["hero", ...order];
}

export function isSectionVisible(
  id: HomepageCanvasSectionId,
  visibility: import("@/lib/cms/marketing-cms-defaults").HomeSectionVisibility,
): boolean {
  if (id === "hero") return true;
  const block = HOMEPAGE_BLOCK_BY_ID[id];
  if (!block.visibilityKey) return true;
  return visibility[block.visibilityKey] !== false;
}
