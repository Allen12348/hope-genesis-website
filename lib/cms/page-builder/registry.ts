import { CMS_PAGE_KEYS, type CmsPageKey } from "@/lib/domain/cms/page-keys";

/** User-facing URL slug → canonical DB page key. */
export const BUILDER_SLUG_TO_PAGE_KEY: Record<string, CmsPageKey> = {
  homepage: CMS_PAGE_KEYS.home,
  home: CMS_PAGE_KEYS.home,
  about: CMS_PAGE_KEYS.about,
  services: CMS_PAGE_KEYS.servicesLanding,
  "services-landing": CMS_PAGE_KEYS.servicesLanding,
  contact: CMS_PAGE_KEYS.contact,
  "coverage-map": CMS_PAGE_KEYS.coverageMap,
  footer: CMS_PAGE_KEYS.footer,
  "navigation-header": CMS_PAGE_KEYS.navigationHeader,
  navigation: CMS_PAGE_KEYS.navigationHeader,
  seo: CMS_PAGE_KEYS.seo,
  "homepage-hero": CMS_PAGE_KEYS.homepageHero,
  hero: CMS_PAGE_KEYS.homepageHero,
  projects: CMS_PAGE_KEYS.projectsLanding,
  "projects-landing": CMS_PAGE_KEYS.projectsLanding,
  gallery: CMS_PAGE_KEYS.galleryLanding,
  "gallery-landing": CMS_PAGE_KEYS.galleryLanding,
  testimonials: CMS_PAGE_KEYS.testimonialsLanding,
  "testimonials-landing": CMS_PAGE_KEYS.testimonialsLanding,
  brands: CMS_PAGE_KEYS.brandsLanding,
  "brands-landing": CMS_PAGE_KEYS.brandsLanding,
  blog: CMS_PAGE_KEYS.blogLanding,
  "blog-landing": CMS_PAGE_KEYS.blogLanding,
};

export function resolveBuilderPageKey(slug: string | undefined): CmsPageKey {
  const raw = (slug ?? "homepage").trim().toLowerCase();
  return BUILDER_SLUG_TO_PAGE_KEY[raw] ?? CMS_PAGE_KEYS.home;
}

export function builderSlugForPageKey(pageKey: CmsPageKey): string {
  const hit = Object.entries(BUILDER_SLUG_TO_PAGE_KEY).find(([, k]) => k === pageKey && !k.includes("-landing"));
  if (pageKey === CMS_PAGE_KEYS.home) return "homepage";
  if (pageKey === CMS_PAGE_KEYS.servicesLanding) return "services";
  if (pageKey === CMS_PAGE_KEYS.projectsLanding) return "projects";
  if (pageKey === CMS_PAGE_KEYS.galleryLanding) return "gallery";
  if (pageKey === CMS_PAGE_KEYS.testimonialsLanding) return "testimonials";
  if (pageKey === CMS_PAGE_KEYS.brandsLanding) return "brands";
  if (pageKey === CMS_PAGE_KEYS.blogLanding) return "blog";
  return hit?.[0] ?? pageKey;
}

export function builderHref(pageKey: CmsPageKey): string {
  return `/admin/content/builder/${builderSlugForPageKey(pageKey)}`;
}

export const CMS_BLOCK_TYPES = [
  "hero",
  "text",
  "richText",
  "image",
  "imageText",
  "twoColumn",
  "servicesGrid",
  "serviceCard",
  "galleryGrid",
  "projectsGrid",
  "testimonials",
  "brandsCarousel",
  "contactInfo",
  "contactForm",
  "map",
  "cta",
  "estimateCTA",
  "contactCTA",
  "faq",
  "buttonGroup",
  "stats",
  "timeline",
  "team",
  "certifications",
  "footerColumns",
  "navigationMenu",
  "seoMeta",
  "spacer",
  "divider",
  "contact",
  "blogFeed",
] as const;

export type CatalogBlockType = (typeof CMS_BLOCK_TYPES)[number];

export type BlockCategory = "layout" | "content" | "marketing" | "grids" | "contact" | "global" | "utility";

export type BlockCatalogEntry = {
  type: CatalogBlockType;
  label: string;
  blurb: string;
  category: BlockCategory;
};

export const BLOCK_CATALOG: BlockCatalogEntry[] = [
  { type: "hero", label: "Hero", blurb: "Headline, subtitle, background image, and CTA buttons.", category: "marketing" },
  { type: "text", label: "Text", blurb: "Title, subtitle, and body copy.", category: "content" },
  { type: "richText", label: "Rich text", blurb: "Long-form narrative with alignment controls.", category: "content" },
  { type: "image", label: "Image", blurb: "Standalone image with alt text and caption.", category: "content" },
  { type: "imageText", label: "Image + text", blurb: "Split layout with photography and copy.", category: "content" },
  { type: "twoColumn", label: "Two column", blurb: "Side-by-side content columns.", category: "layout" },
  { type: "servicesGrid", label: "Services grid", blurb: "Service cards from your CMS catalog.", category: "grids" },
  { type: "serviceCard", label: "Service cards (manual)", blurb: "Hand-picked service cards with icons and links.", category: "grids" },
  { type: "galleryGrid", label: "Gallery grid", blurb: "Photo grid from gallery CMS.", category: "grids" },
  { type: "projectsGrid", label: "Projects grid", blurb: "Portfolio grid from projects CMS.", category: "grids" },
  { type: "testimonials", label: "Testimonials", blurb: "Customer quotes carousel.", category: "grids" },
  { type: "brandsCarousel", label: "Brands", blurb: "Partner logo carousel.", category: "grids" },
  { type: "blogFeed", label: "Blog feed", blurb: "Recent blog posts.", category: "grids" },
  { type: "cta", label: "CTA banner", blurb: "Call-to-action with primary and secondary buttons.", category: "marketing" },
  { type: "estimateCTA", label: "Estimate CTA", blurb: "Preset CTA linking to the instant estimator.", category: "marketing" },
  { type: "contactCTA", label: "Contact CTA", blurb: "Preset CTA for contact and phone.", category: "marketing" },
  { type: "stats", label: "Stats", blurb: "Metric highlights.", category: "marketing" },
  { type: "faq", label: "FAQ", blurb: "Accordion questions and answers.", category: "content" },
  { type: "timeline", label: "Timeline", blurb: "Company milestones.", category: "content" },
  { type: "team", label: "Team", blurb: "Team member cards.", category: "content" },
  { type: "certifications", label: "Certifications", blurb: "Badges and credentials.", category: "content" },
  { type: "contact", label: "Contact section", blurb: "Full contact section with site details.", category: "contact" },
  { type: "contactInfo", label: "Contact info", blurb: "Phone, email, address, hours.", category: "contact" },
  { type: "contactForm", label: "Contact form", blurb: "Form framing copy (routes to contact page).", category: "contact" },
  { type: "map", label: "Coverage map", blurb: "Service area map.", category: "contact" },
  { type: "buttonGroup", label: "Button group", blurb: "Row of CTA buttons.", category: "marketing" },
  { type: "footerColumns", label: "Footer columns", blurb: "Footer link columns and copyright.", category: "global" },
  { type: "navigationMenu", label: "Navigation menu", blurb: "Header logo, links, and CTAs.", category: "global" },
  { type: "seoMeta", label: "SEO meta", blurb: "Page title, description, keywords, OG image.", category: "global" },
  { type: "spacer", label: "Spacer", blurb: "Vertical spacing.", category: "utility" },
  { type: "divider", label: "Divider", blurb: "Horizontal rule.", category: "utility" },
];

export const BLOCK_CATEGORY_LABELS: Record<BlockCategory, string> = {
  layout: "Layout",
  content: "Content",
  marketing: "Marketing",
  grids: "Grids & feeds",
  contact: "Contact",
  global: "Site-wide",
  utility: "Utility",
};

export type BuilderPageMeta = {
  key: CmsPageKey;
  slug: string;
  label: string;
  description: string;
  previewPath: string;
  editableSummary: string;
};

export const BUILDER_PAGES: BuilderPageMeta[] = [
  {
    key: CMS_PAGE_KEYS.home,
    slug: "homepage",
    label: "Homepage",
    description: "Homepage sections below the legacy hero rails.",
    previewPath: "/",
    editableSummary: "Hero stats, blocks, services, projects, testimonials, brands, CTAs",
  },
  {
    key: CMS_PAGE_KEYS.homepageHero,
    slug: "homepage-hero",
    label: "Homepage hero",
    description: "Marquee hero copy, imagery, trust chips, and primary CTAs.",
    previewPath: "/",
    editableSummary: "Eyebrow, title, subtitle, background, buttons, overlay",
  },
  {
    key: CMS_PAGE_KEYS.about,
    slug: "about",
    label: "About",
    description: "Mission, team, timeline, certifications.",
    previewPath: "/about",
    editableSummary: "Story sections, stats, team, timeline",
  },
  {
    key: CMS_PAGE_KEYS.servicesLanding,
    slug: "services",
    label: "Services landing",
    description: "Services index intro and grids.",
    previewPath: "/services",
    editableSummary: "Hero, service grids, FAQs, CTAs",
  },
  {
    key: CMS_PAGE_KEYS.contact,
    slug: "contact",
    label: "Contact",
    description: "Contact hero, info, map, and form framing.",
    previewPath: "/contact",
    editableSummary: "Contact info, map, CTAs",
  },
  {
    key: CMS_PAGE_KEYS.coverageMap,
    slug: "coverage-map",
    label: "Coverage map",
    description: "Coverage narrative used on services journeys.",
    previewPath: "/services",
    editableSummary: "Map block, coverage copy",
  },
  {
    key: CMS_PAGE_KEYS.projectsLanding,
    slug: "projects",
    label: "Projects",
    description: "Portfolio landing layout.",
    previewPath: "/projects",
    editableSummary: "Hero, project grid, CTA",
  },
  {
    key: CMS_PAGE_KEYS.galleryLanding,
    slug: "gallery",
    label: "Gallery",
    description: "Gallery landing layout.",
    previewPath: "/gallery",
    editableSummary: "Hero, gallery grid, CTA",
  },
  {
    key: CMS_PAGE_KEYS.testimonialsLanding,
    slug: "testimonials",
    label: "Testimonials",
    description: "Testimonials landing layout.",
    previewPath: "/testimonials",
    editableSummary: "Hero, testimonial grid, CTA",
  },
  {
    key: CMS_PAGE_KEYS.brandsLanding,
    slug: "brands",
    label: "Brands",
    description: "Brand partners landing.",
    previewPath: "/brands",
    editableSummary: "Hero, brand carousel, CTA",
  },
  {
    key: CMS_PAGE_KEYS.blogLanding,
    slug: "blog",
    label: "Blog",
    description: "Blog index layout.",
    previewPath: "/blog",
    editableSummary: "Hero, blog feed, CTA",
  },
  {
    key: CMS_PAGE_KEYS.footer,
    slug: "footer",
    label: "Footer",
    description: "Site footer columns and legal copy.",
    previewPath: "/",
    editableSummary: "Columns, links, contact, copyright",
  },
  {
    key: CMS_PAGE_KEYS.navigationHeader,
    slug: "navigation-header",
    label: "Navigation & header",
    description: "Header logo, menu, and call CTAs.",
    previewPath: "/",
    editableSummary: "Logo, menu items, CTA buttons",
  },
  {
    key: CMS_PAGE_KEYS.seo,
    slug: "seo",
    label: "SEO defaults",
    description: "Default meta tags for marketing routes.",
    previewPath: "/",
    editableSummary: "Title, description, keywords, OG image",
  },
];

export function getBuilderPageMeta(pageKey: CmsPageKey): BuilderPageMeta {
  return BUILDER_PAGES.find((p) => p.key === pageKey) ?? BUILDER_PAGES[0];
}
