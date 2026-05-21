import type { CSSProperties } from "react";
import type {
  HeroBackgroundFocalId,
  HeroButtonCms,
  HeroOverlayGradientId,
  HeroTextShadowId,
  HomeHeroCms,
} from "@/lib/cms/marketing-cms-defaults";
import {
  HERO_BACKGROUND_FOCAL_IDS,
  HERO_OVERLAY_GRADIENT_IDS,
  HERO_TEXT_SHADOW_IDS,
} from "@/lib/cms/marketing-cms-defaults";
import { DEFAULT_HERO_IMAGE, DEFAULT_HERO_IMAGE_ALT } from "@/lib/cms/homepage-hero";

export function isHeroOverlayGradientId(v: string): v is HeroOverlayGradientId {
  return (HERO_OVERLAY_GRADIENT_IDS as readonly string[]).includes(v);
}

export function resolveHeroBackgroundImageUrl(hero: HomeHeroCms, companyHeroUrl: string | null | undefined): string {
  return hero.heroBackgroundImageUrl?.trim() || companyHeroUrl?.trim() || DEFAULT_HERO_IMAGE;
}

export function resolveHeroBackgroundVideoUrl(hero: HomeHeroCms): string | null {
  const v = hero.heroBackgroundVideoUrl?.trim();
  return v || null;
}

export function resolveHeroImageAlt(hero: HomeHeroCms, companyAlt: string | null | undefined): string {
  return hero.heroBackgroundImageAlt?.trim() || companyAlt?.trim() || DEFAULT_HERO_IMAGE_ALT;
}

export function clampHeroOverlayOpacity(n: number | undefined): number {
  if (typeof n !== "number" || Number.isNaN(n)) return 0.4;
  return Math.min(0.92, Math.max(0.15, n));
}

export function clampHeroBlurStrength(n: number | undefined): number {
  if (typeof n !== "number" || Number.isNaN(n)) return 0.85;
  return Math.min(12, Math.max(0, n));
}

export function clampHeroBackgroundBrightness(n: number | undefined): number {
  if (typeof n !== "number" || Number.isNaN(n)) return 1;
  return Math.min(1.15, Math.max(0.55, n));
}

export function clampHeroBackgroundZoom(n: number | undefined): number {
  if (typeof n !== "number" || Number.isNaN(n)) return 1.04;
  return Math.min(1.2, Math.max(1, n));
}

export function clampHeroBackgroundContrast(n: number | undefined): number {
  if (typeof n !== "number" || Number.isNaN(n)) return 1;
  return Math.min(1.25, Math.max(0.85, n));
}

export function clampHeroBackgroundOpacity(n: number | undefined): number {
  if (typeof n !== "number" || Number.isNaN(n)) return 1;
  return Math.min(1, Math.max(0.4, n));
}

/** Homepage hero background image blur from CompanySettings (px), integer 0–20. */
export function clampCompanyHeroBackgroundBlur(n: number | null | undefined): number {
  if (typeof n !== "number" || Number.isNaN(n)) return 0;
  return Math.min(20, Math.max(0, Math.round(n)));
}

const HERO_FOCAL_OBJECT_POSITION: Record<HeroBackgroundFocalId, string> = {
  center: "center center",
  top: "center top",
  bottom: "center bottom",
  left: "left center",
  right: "right center",
};

export function isHeroBackgroundFocalId(v: string): v is HeroBackgroundFocalId {
  return (HERO_BACKGROUND_FOCAL_IDS as readonly string[]).includes(v);
}

/** CSS `object-position` / `background-position` for hero media. Presets map to two-keyword positions; unknown strings pass through for legacy data. */
export function resolveHeroBackgroundPosition(hero: HomeHeroCms): string {
  const raw = hero.heroBackgroundPosition?.trim();
  if (!raw) return HERO_FOCAL_OBJECT_POSITION.center;
  if (isHeroBackgroundFocalId(raw)) return HERO_FOCAL_OBJECT_POSITION[raw];
  return raw;
}

export function isHeroTextShadowId(v: string): v is HeroTextShadowId {
  return (HERO_TEXT_SHADOW_IDS as readonly string[]).includes(v);
}

export function resolveHeroTextShadow(hero: HomeHeroCms): HeroTextShadowId {
  const t = hero.heroTextShadow;
  if (t && isHeroTextShadowId(t)) return t;
  return "subtle";
}

export function heroTextShadowCss(id: HeroTextShadowId): string | undefined {
  if (id === "none") return undefined;
  if (id === "medium") {
    return "0 2px 14px rgba(15,23,42,0.35), 0 1px 3px rgba(15,23,42,0.28)";
  }
  return "0 2px 12px rgba(0,0,0,0.45), 0 1px 2px rgba(15,23,42,0.22)";
}

/** Parses `#RGB` / `#RRGGBB` for overlay tint; returns null if invalid. */
export function parseHeroOverlayHex(hex: string | undefined): string | null {
  if (!hex?.trim()) return null;
  const raw = hex.trim();
  const m3 = /^#?([0-9a-f]{3})$/i.exec(raw);
  if (m3) {
    const s = m3[1]!;
    const r = s[0]! + s[0]!;
    const g = s[1]! + s[1]!;
    const b = s[2]! + s[2]!;
    return `#${r}${g}${b}`.toUpperCase();
  }
  const m6 = /^#?([0-9a-f]{6})$/i.exec(raw);
  return m6 ? `#${m6[1]!}`.toUpperCase() : null;
}

export function customHeroOverlayBackground(hex: string): CSSProperties {
  const h = hex.replace("#", "");
  const r = Number.parseInt(h.slice(0, 2), 16);
  const g = Number.parseInt(h.slice(2, 4), 16);
  const b = Number.parseInt(h.slice(4, 6), 16);
  return {
    backgroundImage: `linear-gradient(165deg, rgba(${r},${g},${b},0.78) 0%, rgba(${r},${g},${b},0.38) 44%, rgba(${r},${g},${b},0.12) 72%, rgba(${r},${g},${b},0) 100%)`,
  };
}

export function resolveHeroOverlayGradient(hero: HomeHeroCms): HeroOverlayGradientId {
  const g = hero.heroOverlayGradient;
  if (g && isHeroOverlayGradientId(g)) return g;
  return "navy-depth";
}

/**
 * Primary readability gradient (layer 1). Opacity is applied on this layer via `style.opacity` —
 * avoid stacking additional near-opaque scrims on top.
 */
export function heroReadabilityGradientClass(id: HeroOverlayGradientId): string {
  const map: Record<HeroOverlayGradientId, string> = {
    "navy-depth": "hero-overlay-cinematic",
    "navy-soft":
      "bg-[linear-gradient(165deg,hsl(198_50%_28%/0.42)_0%,hsl(200_42%_32%/0.24)_50%,hsl(204_35%_40%/0.1)_72%,transparent_100%)] dark:bg-[linear-gradient(165deg,hsl(222_38%_12%/0.5)_0%,hsl(217_32%_16%/0.28)_50%,hsl(217_28%_20%/0.12)_72%,transparent_100%)]",
    "royal-gold":
      "bg-[linear-gradient(165deg,hsl(198_60%_24%/0.5)_0%,hsl(199_55%_32%/0.28)_48%,hsl(199_90%_85%/0.12)_78%,transparent_100%)] dark:bg-[linear-gradient(165deg,hsl(215_45%_10%/0.58)_0%,hsl(198_50%_22%/0.34)_48%,hsl(199_70%_40%/0.1)_78%,transparent_100%)]",
    cinema:
      "bg-[linear-gradient(165deg,hsl(215_35%_18%/0.5)_0%,hsl(210_30%_28%/0.28)_45%,hsl(204_28%_40%/0.12)_70%,transparent_100%)] dark:bg-[linear-gradient(165deg,hsl(222_40%_7%/0.65)_0%,hsl(217_32%_12%/0.38)_45%,hsl(215_28%_16%/0.16)_70%,transparent_100%)]",
    minimal:
      "bg-[linear-gradient(180deg,hsl(198_40%_30%/0.36)_0%,hsl(204_32%_45%/0.14)_55%,transparent_100%)] dark:bg-[linear-gradient(180deg,hsl(222_35%_12%/0.42)_0%,hsl(217_28%_16%/0.18)_55%,transparent_100%)]",
  };
  return map[id];
}

export function resolveHeroEyebrowBrand(hero: HomeHeroCms): string {
  return hero.heroBadgeText?.trim() || hero.eyebrowBrand;
}

export function resolveHeroEyebrowRegion(hero: HomeHeroCms): string {
  return hero.heroLocationText?.trim() || hero.eyebrowRegion;
}

export function resolveHeroSubtitle(hero: HomeHeroCms): string {
  return hero.heroSubtitle?.trim() || hero.subtitle;
}

export function resolveHeroSingleTitle(hero: HomeHeroCms): string | null {
  const t = hero.heroTitle?.trim();
  return t || null;
}

export function buildResolvedHeroButtons(hero: HomeHeroCms): HeroButtonCms[] {
  const buttons = hero.buttons.map((b) => ({ ...b }));
  if (hero.heroPrimaryButtonLabel?.trim()) {
    const next = buttons[0] ?? { label: "", href: "/", variant: "accent" as const };
    buttons[0] = {
      ...next,
      label: hero.heroPrimaryButtonLabel.trim(),
      href: hero.heroPrimaryButtonUrl?.trim() || next.href,
    };
  }
  if (hero.heroSecondaryButtonLabel?.trim()) {
    const next = buttons[1] ?? { label: "", href: "/contact", variant: "outline" as const, showArrow: true };
    buttons[1] = {
      ...next,
      label: hero.heroSecondaryButtonLabel.trim(),
      href: hero.heroSecondaryButtonUrl?.trim() || next.href,
    };
  }
  return buttons;
}
