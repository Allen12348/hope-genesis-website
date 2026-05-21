import type { CompanySettings, Prisma } from "@prisma/client";
import { NAV_LINKS } from "@/config/navigation";
import { SITE } from "@/constants/site";
import { DEFAULT_HEADER_SUBTITLE } from "@/lib/cms/resolved-site";
import {
  DEFAULT_FLOATING_ACTIONS,
  DEFAULT_FOOTER_PAYLOAD,
  DEFAULT_HOME_PAGE_PUBLISHED,
  DEFAULT_SECTION_VISIBILITY,
} from "@/lib/cms/marketing-cms-defaults";
import { CMS_PAGE_KEYS } from "@/lib/domain/cms/page-keys";

/** Singleton row id for company + site layout tables. */
export const ADMIN_SINGLETON_ID = "singleton";

/** Default company settings row used when DB is empty or queries fail. */
export const defaultCompanySettings: CompanySettings = {
  id: ADMIN_SINGLETON_ID,
  phoneDisplay: SITE.phoneDisplay,
  phoneE164: SITE.phoneE164,
  email: SITE.email,
  addressLine: SITE.addressLine,
  fullAddress: SITE.fullAddress,
  hours: SITE.hours,
  socialFacebook: SITE.social.facebook,
  socialInstagram: SITE.social.instagram,
  socialLinkedin: SITE.social.linkedin,
  mapEmbedUrl: SITE.mapEmbedUrl,
  whatsappUrl: SITE.whatsapp,
  messengerUrl: SITE.messenger,
  heroImageUrl: null,
  heroImageAlt: null,
  heroBackgroundBlur: 0,
  logoText: "HGE",
  logoImageUrl: null,
  companyName: SITE.name,
  companySubtitle: DEFAULT_HEADER_SUBTITLE,
  primaryCtaLabel: "Get Instant Estimate",
  primaryCtaUrl: "/estimate",
  callButtonLabel: "Call Now",
  showPrimaryCta: true,
  showCallButton: true,
  showThemeToggle: true,
  defaultTheme: "light",
  updatedAt: new Date(0),
};

/** Prisma `create` payload for company settings upsert. */
export function companySettingsUpsertCreate(
  patch?: Partial<Prisma.CompanySettingsCreateInput>,
): Prisma.CompanySettingsCreateInput {
  return {
    id: ADMIN_SINGLETON_ID,
    phoneDisplay: defaultCompanySettings.phoneDisplay,
    phoneE164: defaultCompanySettings.phoneE164,
    email: defaultCompanySettings.email,
    addressLine: defaultCompanySettings.addressLine,
    fullAddress: defaultCompanySettings.fullAddress,
    hours: defaultCompanySettings.hours,
    socialFacebook: defaultCompanySettings.socialFacebook,
    socialInstagram: defaultCompanySettings.socialInstagram,
    socialLinkedin: defaultCompanySettings.socialLinkedin,
    mapEmbedUrl: defaultCompanySettings.mapEmbedUrl,
    whatsappUrl: defaultCompanySettings.whatsappUrl,
    messengerUrl: defaultCompanySettings.messengerUrl,
    logoText: defaultCompanySettings.logoText,
    companyName: defaultCompanySettings.companyName,
    companySubtitle: defaultCompanySettings.companySubtitle,
    primaryCtaLabel: defaultCompanySettings.primaryCtaLabel,
    primaryCtaUrl: defaultCompanySettings.primaryCtaUrl,
    callButtonLabel: defaultCompanySettings.callButtonLabel,
    showPrimaryCta: defaultCompanySettings.showPrimaryCta,
    showCallButton: defaultCompanySettings.showCallButton,
    showThemeToggle: defaultCompanySettings.showThemeToggle,
    defaultTheme: defaultCompanySettings.defaultTheme,
    ...patch,
  };
}

export const defaultNavigationSeed = NAV_LINKS.map((l, index) => ({
  label: l.label,
  href: l.href,
  sortOrder: index,
  isVisible: true,
  isActive: true,
  isExternal: false,
}));

export const defaultHomepagePublishedJson = JSON.stringify(DEFAULT_HOME_PAGE_PUBLISHED);

export const defaultSiteSettingsPayload = {
  sectionVisibilityJson: JSON.stringify(DEFAULT_SECTION_VISIBILITY),
  floatingActionsJson: JSON.stringify(DEFAULT_FLOATING_ACTIONS),
};

export const defaultFooterPayloadJson = JSON.stringify(DEFAULT_FOOTER_PAYLOAD);

export const defaultAdminDashboardStats = {
  publishedProjects: 0,
  approvedTestimonials: 0,
  totalProjects: 0,
  unpublishedProjects: 0,
  pendingTestimonials: 0,
  galleryItems: 0,
  brandPartners: 0,
  draftBlogPosts: 0,
  totalServices: 0,
} as const;

export const defaultSeo = {
  metaTitle: SITE.name,
  metaDescription: SITE.description,
  ogImageUrl: null as string | null,
  keywords: "HVAC, air conditioning, refrigeration, Laguna, Calamba",
  canonicalUrl: null as string | null,
};

/** Baseline CMS page keys seeded in production when missing. */
export const BASELINE_CMS_PAGE_SEEDS: { pageKey: string; publishedData: string }[] = [
  { pageKey: CMS_PAGE_KEYS.home, publishedData: defaultHomepagePublishedJson },
];

export const EMPTY_ADMIN_LIST = [] as const;
