import type {
  AboutPageCms,
  AboutPreviewCms,
  BeforeAfterCms,
  BusinessTrustCms,
  BusinessTrustGroupCms,
  ContactPagePublishedV1,
  FloatingActionsCms,
  FooterCmsPayload,
  HeroOverlayGradientId,
  HeroServicePreviewCms,
  HeroTextShadowId,
  HomeHeroCms,
  HomePagePublishedV1,
  HomeSectionVisibility,
  SectionShellCms,
} from "@/lib/cms/marketing-cms-defaults";
import {
  DEFAULT_ABOUT_PAGE_PUBLISHED,
  DEFAULT_CONTACT_PAGE_PUBLISHED,
  DEFAULT_COVERAGE_MAP_PAGE,
  DEFAULT_FLOATING_ACTIONS,
  DEFAULT_FOOTER_PAYLOAD,
  DEFAULT_HOME_PAGE_PUBLISHED,
  DEFAULT_SECTION_VISIBILITY,
  DEFAULT_SERVICES_LANDING_COPY,
  HERO_OVERLAY_GRADIENT_IDS,
  HERO_TEXT_SHADOW_IDS,
} from "@/lib/cms/marketing-cms-defaults";
import { normalizeHeroStats } from "@/lib/cms/hero-stats";
import {
  isNestedSiteLayoutPayload,
  normalizeHomeSectionOrder,
  parseSiteLayoutJson,
  type HomeLegacySectionId,
} from "@/lib/cms/homepage-sections";
import type { FooterSection, PageContent, SiteSettings } from "@prisma/client";
import { safeJsonParse } from "@/lib/utils/safe-json-parse";

const HERO_SERVICE_ICONS = new Set<HeroServicePreviewCms["icon"]>([
  "installation",
  "cleaning",
  "maintenance",
  "refrigeration",
  "commercial",
  "repair",
]);

const BUSINESS_TRUST_ICONS = new Set<BusinessTrustGroupCms["icon"]>([
  "partners",
  "permits",
  "certifications",
  "awards",
  "areas",
  "clients",
]);

function cmsString(value: unknown, fallback: string): string {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
}

function mergeSectionShell(base: SectionShellCms, patch: unknown): SectionShellCms {
  if (!patch || typeof patch !== "object") return base;
  const p = patch as Partial<SectionShellCms>;
  return {
    eyebrow: cmsString(p.eyebrow, base.eyebrow),
    title: cmsString(p.title, base.title),
    description: cmsString(p.description, base.description),
  };
}

function isHeroOverlayGradientId(v: unknown): v is HeroOverlayGradientId {
  return typeof v === "string" && (HERO_OVERLAY_GRADIENT_IDS as readonly string[]).includes(v);
}

function isHeroTextShadowId(v: unknown): v is HeroTextShadowId {
  return typeof v === "string" && (HERO_TEXT_SHADOW_IDS as readonly string[]).includes(v);
}

function mergeHero(base: HomeHeroCms, patch: unknown): HomeHeroCms {
  if (!patch || typeof patch !== "object") return base;
  const p = patch as Partial<HomeHeroCms>;
  const clampOpacity = (n: unknown): number | undefined => {
    if (typeof n !== "number" || Number.isNaN(n)) return undefined;
    return Math.min(0.92, Math.max(0.15, n));
  };
  const clampBlur = (n: unknown): number | undefined => {
    if (typeof n !== "number" || Number.isNaN(n)) return undefined;
    return Math.min(12, Math.max(0, n));
  };
  const clampBrightness = (n: unknown): number | undefined => {
    if (typeof n !== "number" || Number.isNaN(n)) return undefined;
    return Math.min(1.15, Math.max(0.55, n));
  };
  return {
    eyebrowBrand: typeof p.eyebrowBrand === "string" ? p.eyebrowBrand : base.eyebrowBrand,
    eyebrowRegion: typeof p.eyebrowRegion === "string" ? p.eyebrowRegion : base.eyebrowRegion,
    titleLine1: typeof p.titleLine1 === "string" ? p.titleLine1 : base.titleLine1,
    titleAccent: typeof p.titleAccent === "string" ? p.titleAccent : base.titleAccent,
    titleLine2: typeof p.titleLine2 === "string" ? p.titleLine2 : base.titleLine2,
    subtitle: typeof p.subtitle === "string" ? p.subtitle : base.subtitle,
    buttons: Array.isArray(p.buttons) ? (p.buttons as HomeHeroCms["buttons"]) : base.buttons,
    trustChips: Array.isArray(p.trustChips) ? (p.trustChips as HomeHeroCms["trustChips"]) : base.trustChips,
    stats: Array.isArray(p.stats) ? normalizeHeroStats(p.stats) : base.stats,
    bottomBadges: Array.isArray(p.bottomBadges) ? (p.bottomBadges as string[]) : base.bottomBadges,
    heroTitle: typeof p.heroTitle === "string" ? p.heroTitle : base.heroTitle,
    heroSubtitle: typeof p.heroSubtitle === "string" ? p.heroSubtitle : base.heroSubtitle,
    heroBackgroundImageUrl: cmsString(p.heroBackgroundImageUrl, base.heroBackgroundImageUrl ?? ""),
    heroBackgroundVideoUrl: typeof p.heroBackgroundVideoUrl === "string" ? p.heroBackgroundVideoUrl : base.heroBackgroundVideoUrl,
    heroBackgroundImageAlt: typeof p.heroBackgroundImageAlt === "string" ? p.heroBackgroundImageAlt : base.heroBackgroundImageAlt,
    heroOverlayOpacity: clampOpacity(p.heroOverlayOpacity) ?? base.heroOverlayOpacity,
    heroOverlayGradient: isHeroOverlayGradientId(p.heroOverlayGradient) ? p.heroOverlayGradient : base.heroOverlayGradient,
    heroOverlayColor:
      typeof p.heroOverlayColor === "string"
        ? p.heroOverlayColor.trim() === ""
          ? undefined
          : p.heroOverlayColor
        : base.heroOverlayColor,
    heroBlurStrength: clampBlur(p.heroBlurStrength) ?? base.heroBlurStrength,
    heroBackgroundBrightness: clampBrightness(p.heroBackgroundBrightness) ?? base.heroBackgroundBrightness,
    heroBackgroundPosition:
      typeof p.heroBackgroundPosition === "string" ? p.heroBackgroundPosition : base.heroBackgroundPosition,
    heroTextShadow: isHeroTextShadowId(p.heroTextShadow) ? p.heroTextShadow : base.heroTextShadow,
    heroEnableCinematic: typeof p.heroEnableCinematic === "boolean" ? p.heroEnableCinematic : base.heroEnableCinematic,
    heroBadgeText: typeof p.heroBadgeText === "string" ? p.heroBadgeText : base.heroBadgeText,
    heroLocationText: typeof p.heroLocationText === "string" ? p.heroLocationText : base.heroLocationText,
    heroPrimaryButtonLabel: typeof p.heroPrimaryButtonLabel === "string" ? p.heroPrimaryButtonLabel : base.heroPrimaryButtonLabel,
    heroPrimaryButtonUrl: typeof p.heroPrimaryButtonUrl === "string" ? p.heroPrimaryButtonUrl : base.heroPrimaryButtonUrl,
    heroSecondaryButtonLabel: typeof p.heroSecondaryButtonLabel === "string" ? p.heroSecondaryButtonLabel : base.heroSecondaryButtonLabel,
    heroSecondaryButtonUrl: typeof p.heroSecondaryButtonUrl === "string" ? p.heroSecondaryButtonUrl : base.heroSecondaryButtonUrl,
    heroEnableParallax: typeof p.heroEnableParallax === "boolean" ? p.heroEnableParallax : base.heroEnableParallax,
    heroEnableParticles: typeof p.heroEnableParticles === "boolean" ? p.heroEnableParticles : base.heroEnableParticles,
    heroEnableFog: typeof p.heroEnableFog === "boolean" ? p.heroEnableFog : base.heroEnableFog,
    heroEnableCtaGlow: typeof p.heroEnableCtaGlow === "boolean" ? p.heroEnableCtaGlow : base.heroEnableCtaGlow,
    heroBackgroundZoom:
      typeof p.heroBackgroundZoom === "number" && !Number.isNaN(p.heroBackgroundZoom)
        ? Math.min(1.2, Math.max(1, p.heroBackgroundZoom))
        : base.heroBackgroundZoom,
    heroBackgroundContrast:
      typeof p.heroBackgroundContrast === "number" && !Number.isNaN(p.heroBackgroundContrast)
        ? Math.min(1.25, Math.max(0.85, p.heroBackgroundContrast))
        : base.heroBackgroundContrast,
    heroBackgroundOpacity:
      typeof p.heroBackgroundOpacity === "number" && !Number.isNaN(p.heroBackgroundOpacity)
        ? Math.min(1, Math.max(0.4, p.heroBackgroundOpacity))
        : base.heroBackgroundOpacity,
    heroLayoutVariant:
      typeof p.heroLayoutVariant === "string" ? (p.heroLayoutVariant as HomeHeroCms["heroLayoutVariant"]) : base.heroLayoutVariant,
    heroEnableAirflow: typeof p.heroEnableAirflow === "boolean" ? p.heroEnableAirflow : base.heroEnableAirflow,
    heroTextAlign:
      typeof p.heroTextAlign === "string" &&
      (p.heroTextAlign === "left" || p.heroTextAlign === "center" || p.heroTextAlign === "right")
        ? p.heroTextAlign
        : base.heroTextAlign,
  };
}

function mergeHeroServicePreview(
  base: HomePagePublishedV1["heroServicePreview"],
  patch: unknown,
): HomePagePublishedV1["heroServicePreview"] {
  if (!Array.isArray(patch)) return base;
  const items = patch
    .filter((row): row is HeroServicePreviewCms => {
      if (!row || typeof row !== "object") return false;
      const o = row as Partial<HeroServicePreviewCms>;
      return (
        typeof o.icon === "string" &&
        HERO_SERVICE_ICONS.has(o.icon as HeroServicePreviewCms["icon"]) &&
        typeof o.title === "string" &&
        o.title.trim().length > 0 &&
        typeof o.description === "string" &&
        typeof o.href === "string" &&
        o.href.trim().length > 0
      );
    })
    .map((o) => ({
      icon: o.icon,
      title: o.title.trim(),
      description: o.description.trim(),
      href: o.href.trim(),
    }));
  return items.length > 0 ? items : base;
}

function mergeBusinessTrust(base: BusinessTrustCms, patch: unknown): BusinessTrustCms {
  if (!patch || typeof patch !== "object") return base;
  const p = patch as Partial<BusinessTrustCms>;
  if (!Array.isArray(p.groups)) return base;
  const groups = p.groups
    .filter((row): row is BusinessTrustGroupCms => {
      if (!row || typeof row !== "object") return false;
      const o = row as Partial<BusinessTrustGroupCms>;
      return (
        typeof o.icon === "string" &&
        BUSINESS_TRUST_ICONS.has(o.icon as BusinessTrustGroupCms["icon"]) &&
        typeof o.title === "string" &&
        o.title.trim().length > 0 &&
        Array.isArray(o.items)
      );
    })
    .map((g) => ({
      icon: g.icon,
      title: g.title.trim(),
      items: g.items.filter((x): x is string => typeof x === "string" && x.trim().length > 0),
    }))
    .filter((g) => g.items.length > 0);
  return groups.length > 0 ? { groups } : base;
}

function mergeBeforeAfter(base: BeforeAfterCms, patch: unknown): BeforeAfterCms {
  if (!patch || typeof patch !== "object") return base;
  const p = patch as Partial<BeforeAfterCms>;
  if (!Array.isArray(p.items)) return base;
  const items = p.items
    .filter((row) => {
      if (!row || typeof row !== "object") return false;
      const o = row as Partial<BeforeAfterCms["items"][number]>;
      return (
        typeof o.category === "string" &&
        typeof o.title === "string" &&
        typeof o.beforeImageUrl === "string" &&
        o.beforeImageUrl.trim().length > 0 &&
        typeof o.afterImageUrl === "string" &&
        o.afterImageUrl.trim().length > 0 &&
        typeof o.beforeAlt === "string" &&
        typeof o.afterAlt === "string"
      );
    })
    .map((o) => ({
      category: o.category!.trim(),
      title: o.title!.trim(),
      caption: typeof o.caption === "string" ? o.caption : undefined,
      beforeImageUrl: o.beforeImageUrl!.trim(),
      afterImageUrl: o.afterImageUrl!.trim(),
      beforeAlt: o.beforeAlt!.trim(),
      afterAlt: o.afterAlt!.trim(),
    }));
  return items.length > 0 ? { items } : base;
}

function mergeAboutPreview(base: AboutPreviewCms, patch: unknown): AboutPreviewCms {
  if (!patch || typeof patch !== "object") return base;
  const p = patch as Partial<AboutPreviewCms>;
  return {
    ...mergeSectionShell(base, p),
    imageUrl: typeof p.imageUrl === "string" ? p.imageUrl : base.imageUrl,
    imageAlt: typeof p.imageAlt === "string" ? p.imageAlt : base.imageAlt,
    pillars: Array.isArray(p.pillars) ? (p.pillars as string[]) : base.pillars,
    ctaLabel: typeof p.ctaLabel === "string" ? p.ctaLabel : base.ctaLabel,
    ctaHref: typeof p.ctaHref === "string" ? p.ctaHref : base.ctaHref,
  };
}

export function mergeHomePagePublished(row: PageContent | null): HomePagePublishedV1 {
  const base = DEFAULT_HOME_PAGE_PUBLISHED;
  const raw = safeJsonParse<unknown>(row?.publishedData, null);
  if (!raw || typeof raw !== "object") return base;
  const o = raw as Partial<HomePagePublishedV1>;
  if (o.v !== 1) return base;
  return {
    v: 1,
    customerPlatform: mergeSectionShell(base.customerPlatform, o.customerPlatform),
    hero: mergeHero(base.hero, o.hero),
    homeSectionShells: {
      servicesPreview: mergeSectionShell(
        base.homeSectionShells.servicesPreview,
        (o.homeSectionShells as HomePagePublishedV1["homeSectionShells"])?.servicesPreview,
      ),
      coverage: mergeSectionShell(base.homeSectionShells.coverage, (o.homeSectionShells as HomePagePublishedV1["homeSectionShells"])?.coverage),
      lifecycle: mergeSectionShell(
        base.homeSectionShells.lifecycle,
        (o.homeSectionShells as HomePagePublishedV1["homeSectionShells"])?.lifecycle,
      ),
      people: mergeSectionShell(base.homeSectionShells.people, (o.homeSectionShells as HomePagePublishedV1["homeSectionShells"])?.people),
      projectsPreview: mergeSectionShell(
        base.homeSectionShells.projectsPreview,
        (o.homeSectionShells as HomePagePublishedV1["homeSectionShells"])?.projectsPreview,
      ),
      testimonialsPreview: mergeSectionShell(
        base.homeSectionShells.testimonialsPreview,
        (o.homeSectionShells as HomePagePublishedV1["homeSectionShells"])?.testimonialsPreview,
      ),
      brandsPreview: mergeSectionShell(
        base.homeSectionShells.brandsPreview,
        (o.homeSectionShells as HomePagePublishedV1["homeSectionShells"])?.brandsPreview,
      ),
      heroServices: mergeSectionShell(
        base.homeSectionShells.heroServices,
        (o.homeSectionShells as HomePagePublishedV1["homeSectionShells"])?.heroServices,
      ),
      businessTrust: mergeSectionShell(
        base.homeSectionShells.businessTrust,
        (o.homeSectionShells as HomePagePublishedV1["homeSectionShells"])?.businessTrust,
      ),
      beforeAfter: mergeSectionShell(
        base.homeSectionShells.beforeAfter,
        (o.homeSectionShells as HomePagePublishedV1["homeSectionShells"])?.beforeAfter,
      ),
      instantEstimate: mergeSectionShell(
        base.homeSectionShells.instantEstimate,
        (o.homeSectionShells as HomePagePublishedV1["homeSectionShells"])?.instantEstimate,
      ),
    },
    aboutPreview: mergeAboutPreview(base.aboutPreview, o.aboutPreview),
    contactCta: mergeSectionShell(base.contactCta, o.contactCta),
    heroServicePreview: mergeHeroServicePreview(base.heroServicePreview, o.heroServicePreview),
    businessTrust: mergeBusinessTrust(base.businessTrust, o.businessTrust),
    beforeAfter: mergeBeforeAfter(base.beforeAfter, o.beforeAfter),
    testimonialsDisplay: (() => {
      const patch = o.testimonialsDisplay;
      if (!patch || typeof patch !== "object") return base.testimonialsDisplay;
      const p = patch as Partial<import("@/lib/cms/marketing-cms-defaults").TestimonialsDisplayCms>;
      return {
        featuredOnly: typeof p.featuredOnly === "boolean" ? p.featuredOnly : base.testimonialsDisplay.featuredOnly,
        layout: p.layout === "grid" || p.layout === "carousel" ? p.layout : base.testimonialsDisplay.layout,
      };
    })(),
  };
}

export function mergeSectionVisibility(row: SiteSettings | null): HomeSectionVisibility {
  const base = { ...DEFAULT_SECTION_VISIBILITY };
  const raw = row?.sectionVisibilityJson;
  if (!raw?.trim()) return base;

  const parsed = safeJsonParse<Record<string, unknown> | null>(raw, null);
  if (!parsed) return base;
  if (isNestedSiteLayoutPayload(parsed)) {
    const layout = parseSiteLayoutJson(raw);
    return { ...base, ...(layout.visibility ?? {}) };
  }
  return { ...base, ...(parsed as Partial<HomeSectionVisibility>) };
}

export function mergeHomeSectionOrder(row: SiteSettings | null): HomeLegacySectionId[] {
  const raw = row?.sectionVisibilityJson;
  if (!raw?.trim()) return normalizeHomeSectionOrder(undefined);

  const parsed = safeJsonParse<Record<string, unknown> | null>(raw, null);
  if (parsed && isNestedSiteLayoutPayload(parsed)) {
    const layout = parseSiteLayoutJson(raw);
    return normalizeHomeSectionOrder(layout.order);
  }

  return normalizeHomeSectionOrder(undefined);
}

export function mergeFloatingActions(row: SiteSettings | null): FloatingActionsCms {
  const base = { ...DEFAULT_FLOATING_ACTIONS };
  const patch = safeJsonParse<Partial<FloatingActionsCms>>(row?.floatingActionsJson, {});
  return {
    ...base,
    ...patch,
    mobileSticky: {
      ...(base.mobileSticky ?? DEFAULT_FLOATING_ACTIONS.mobileSticky!),
      ...(patch.mobileSticky ?? {}),
    },
  };
}

export function mergeFooterPayload(row: FooterSection | null): FooterCmsPayload {
  const base = DEFAULT_FOOTER_PAYLOAD;
  const patch = safeJsonParse<Partial<FooterCmsPayload>>(row?.payloadJson, {});
  return {
    ...base,
    ...patch,
    platformLinksColumnTitle:
      typeof patch.platformLinksColumnTitle === "string" && patch.platformLinksColumnTitle.trim()
        ? patch.platformLinksColumnTitle.trim()
        : base.platformLinksColumnTitle,
    serviceLinks: Array.isArray(patch.serviceLinks) ? (patch.serviceLinks as FooterCmsPayload["serviceLinks"]) : base.serviceLinks,
    platformLinks: Array.isArray(patch.platformLinks) ? (patch.platformLinks as FooterCmsPayload["platformLinks"]) : base.platformLinks,
  };
}

export function mergeAboutPagePublished(row: PageContent | null): AboutPageCms {
  const base = DEFAULT_ABOUT_PAGE_PUBLISHED;
  const raw = safeJsonParse<unknown>(row?.publishedData, null);
  if (!raw || typeof raw !== "object") return base;
  if ((raw as { v?: unknown }).v === 2 && Array.isArray((raw as { sections?: unknown }).sections)) {
    return base;
  }
  const o = raw as Partial<AboutPageCms>;
  return {
    pageHero: {
      ...mergeSectionShell(base.pageHero, o.pageHero),
      breadcrumbsHomeLabel:
        typeof o.pageHero?.breadcrumbsHomeLabel === "string"
          ? o.pageHero.breadcrumbsHomeLabel
          : base.pageHero.breadcrumbsHomeLabel,
    },
    storyEyebrow: cmsString(o.storyEyebrow, base.storyEyebrow),
    storyTitle: cmsString(o.storyTitle, base.storyTitle),
    storyDescription: cmsString(o.storyDescription, base.storyDescription),
    imageUrl: cmsString(o.imageUrl, base.imageUrl),
    imageAlt: cmsString(o.imageAlt, base.imageAlt),
    imageCaptionTitle: cmsString(o.imageCaptionTitle, base.imageCaptionTitle),
    imageCaptionSubtitle: cmsString(o.imageCaptionSubtitle, base.imageCaptionSubtitle),
    visionTitle: cmsString(o.visionTitle, base.visionTitle),
    visionBody: cmsString(o.visionBody, base.visionBody),
    missionTitle: cmsString(o.missionTitle, base.missionTitle),
    missionBody: cmsString(o.missionBody, base.missionBody),
    whyTitle: cmsString(o.whyTitle, base.whyTitle),
    pillars: Array.isArray(o.pillars) ? (o.pillars as string[]) : base.pillars,
    teamSection: mergeSectionShell(base.teamSection, o.teamSection),
  };
}

export function mergeContactPagePublished(row: PageContent | null): ContactPagePublishedV1 {
  const base = DEFAULT_CONTACT_PAGE_PUBLISHED;
  const raw = safeJsonParse<unknown>(row?.publishedData, null);
  if (!raw || typeof raw !== "object") return base;
  if ((raw as { v?: unknown }).v === 2 && Array.isArray((raw as { sections?: unknown }).sections)) {
    return base;
  }
  const o = raw as Partial<ContactPagePublishedV1>;
  if (o.v !== 1) return base;
  return {
    v: 1,
    pageHero: mergeSectionShell(base.pageHero, o.pageHero),
    mapSection: mergeSectionShell(base.mapSection, o.mapSection),
  };
}

export function mergeCoverageMapPage(row: PageContent | null): SectionShellCms {
  const base = DEFAULT_COVERAGE_MAP_PAGE;
  const raw = safeJsonParse<unknown>(row?.publishedData, null);
  if (!raw || typeof raw !== "object") return base;
  if ((raw as { v?: unknown }).v === 2 && Array.isArray((raw as { sections?: unknown }).sections)) {
    return base;
  }
  const o = raw as Partial<SectionShellCms>;
  return mergeSectionShell(base, o);
}

export function mergeServicesLandingPage(row: PageContent | null): SectionShellCms {
  const base = DEFAULT_SERVICES_LANDING_COPY;
  const raw = safeJsonParse<unknown>(row?.publishedData, null);
  if (!raw || typeof raw !== "object") return base;
  if ((raw as { v?: unknown }).v === 2 && Array.isArray((raw as { sections?: unknown }).sections)) {
    return base;
  }
  return mergeSectionShell(base, raw);
}

export type PublicMarketingCmsBundle = {
  home: HomePagePublishedV1;
  sectionVisibility: HomeSectionVisibility;
  homeSectionOrder: HomeLegacySectionId[];
  floating: FloatingActionsCms;
  footer: FooterCmsPayload;
  aboutPage: AboutPageCms;
  contactPage: ContactPagePublishedV1;
  coverageMap: SectionShellCms;
  servicesLanding: SectionShellCms;
};

export function buildPublicMarketingCmsBundle(input: {
  home: PageContent | null;
  about: PageContent | null;
  contact: PageContent | null;
  coverageMap: PageContent | null;
  servicesLanding: PageContent | null;
  siteSettings: SiteSettings | null;
  footer: FooterSection | null;
}): PublicMarketingCmsBundle {
  return {
    home: mergeHomePagePublished(input.home),
    sectionVisibility: mergeSectionVisibility(input.siteSettings),
    homeSectionOrder: mergeHomeSectionOrder(input.siteSettings),
    floating: mergeFloatingActions(input.siteSettings),
    footer: mergeFooterPayload(input.footer),
    aboutPage: mergeAboutPagePublished(input.about),
    contactPage: mergeContactPagePublished(input.contact),
    coverageMap: mergeCoverageMapPage(input.coverageMap),
    servicesLanding: mergeServicesLandingPage(input.servicesLanding),
  };
}
