import type { CompanySettings, NavigationItem } from "@prisma/client";
import { NAV_LINKS } from "@/config/navigation";
import { SITE } from "@/constants/site";
import { clampCompanyHeroBackgroundBlur } from "@/lib/cms/hero-display";

export const DEFAULT_HEADER_SUBTITLE = "HVAC · Refrigeration · Southern Luzon";

export type ResolvedNavLink = {
  href: string;
  label: string;
  isExternal: boolean;
};

export type ResolvedSite = {
  name: string;
  legalName: string;
  shortTagline: string;
  description: string;
  phoneDisplay: string;
  phoneE164: string;
  phoneTel: string;
  whatsapp: string;
  messenger: string;
  email: string;
  addressLine: string;
  country: string;
  fullAddress: string;
  hours: string;
  foundedYear: number;
  mapEmbedUrl: string;
  social: {
    facebook: string;
    instagram: string;
    linkedin: string;
  };
  /** Optional CMS homepage hero background (http(s)). */
  heroImageUrl: string | null;
  heroImageAlt: string | null;
  /** Company settings: blur on homepage hero background image only (px). */
  heroBackgroundBlur: number;
  /** Public header / nav (CMS or defaults). */
  navLinks: ResolvedNavLink[];
  headerLogoText: string;
  headerLogoImageUrl: string | null;
  headerCompanyName: string;
  headerCompanySubtitle: string;
  primaryCtaLabel: string;
  primaryCtaUrl: string;
  showPrimaryCta: boolean;
  callButtonLabel: string;
  showCallButton: boolean;
  showThemeToggle: boolean;
  defaultTheme: "light" | "dark" | "system";
};

function defaultNavFromConfig(): ResolvedNavLink[] {
  return NAV_LINKS.map((l) => ({
    href: l.href,
    label: l.label,
    isExternal: false,
  }));
}

function resolveNavFromDb(items: NavigationItem[]): ResolvedNavLink[] {
  if (!items.length) return defaultNavFromConfig();
  const active = items
    .filter((i) => i.isVisible && i.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder || a.label.localeCompare(b.label));
  if (!active.length) return [];
  return active.map((i) => ({
    href: i.href,
    label: i.label,
    isExternal: i.isExternal,
  }));
}

function normalizeDefaultTheme(v: string | null | undefined): "light" | "dark" | "system" {
  if (v === "dark" || v === "system" || v === "light") return v;
  return "light";
}

export function mergeCompanySettings(row: CompanySettings | null, navItems: NavigationItem[] = []): ResolvedSite {
  const base = SITE as unknown as ResolvedSite;
  const navLinks = resolveNavFromDb(navItems);

  if (!row) {
    return {
      ...base,
      heroImageUrl: null,
      heroImageAlt: null,
      heroBackgroundBlur: 0,
      navLinks: navLinks.length ? navLinks : defaultNavFromConfig(),
      headerLogoText: "HGE",
      headerLogoImageUrl: null,
      headerCompanyName: base.name,
      headerCompanySubtitle: DEFAULT_HEADER_SUBTITLE,
      primaryCtaLabel: "Get Instant Estimate",
      primaryCtaUrl: "/estimate",
      showPrimaryCta: true,
      callButtonLabel: "Call Now",
      showCallButton: true,
      showThemeToggle: true,
      defaultTheme: "light",
    };
  }

  return {
    ...base,
    name: row.companyName?.trim() || base.name,
    phoneDisplay: row.phoneDisplay,
    phoneE164: row.phoneE164,
    phoneTel: `tel:${row.phoneE164.replace(/^tel:/, "")}`,
    email: row.email,
    addressLine: row.addressLine,
    fullAddress: row.fullAddress,
    hours: row.hours,
    mapEmbedUrl: row.mapEmbedUrl ?? base.mapEmbedUrl,
    whatsapp: row.whatsappUrl ?? base.whatsapp,
    messenger: row.messengerUrl ?? base.messenger,
    social: {
      facebook: row.socialFacebook ?? base.social.facebook,
      instagram: row.socialInstagram ?? base.social.instagram,
      linkedin: row.socialLinkedin ?? base.social.linkedin,
    },
    heroImageUrl: row.heroImageUrl ?? null,
    heroImageAlt: row.heroImageAlt ?? null,
    heroBackgroundBlur: clampCompanyHeroBackgroundBlur(row.heroBackgroundBlur),
    navLinks: navLinks.length ? navLinks : defaultNavFromConfig(),
    headerLogoText: row.logoText?.trim() || "HGE",
    headerLogoImageUrl: row.logoImageUrl?.trim() || null,
    headerCompanyName: row.companyName?.trim() || base.name,
    headerCompanySubtitle: row.companySubtitle?.trim() || DEFAULT_HEADER_SUBTITLE,
    primaryCtaLabel: row.primaryCtaLabel?.trim() || "Get Instant Estimate",
    primaryCtaUrl: row.primaryCtaUrl?.trim() || "/estimate",
    showPrimaryCta: row.showPrimaryCta,
    callButtonLabel: row.callButtonLabel?.trim() || "Call Now",
    showCallButton: row.showCallButton,
    showThemeToggle: row.showThemeToggle,
    defaultTheme: normalizeDefaultTheme(row.defaultTheme),
  };
}
