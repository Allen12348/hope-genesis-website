"use client";

import {
  clampCompanyHeroBackgroundBlur,
  clampHeroBackgroundBrightness,
  clampHeroBlurStrength,
  clampHeroOverlayOpacity,
  customHeroOverlayBackground,
  heroReadabilityGradientClass,
  parseHeroOverlayHex,
  resolveHeroBackgroundPosition,
} from "@/lib/cms/hero-display";
import type { HeroOverlayGradientId, HomeHeroCms } from "@/lib/cms/marketing-cms-defaults";
import { cn } from "@/lib/utils";

type Props = {
  hero: HomeHeroCms;
  previewSrc: string;
  /** Outer wrapper: applies `dark` class for Tailwind dark-mode tokens in preview. */
  theme: "light" | "dark";
  /** Tailwind aspect / height classes, e.g. `aspect-[9/16] h-64` or `aspect-[21/9] h-36` */
  frameClassName: string;
  className?: string;
  /** Company settings: blur on background image only (px). */
  companyBackgroundBlur?: number;
};

/**
 * Mirrors the public hero overlay stack so admin previews stay aligned with `HeroBackground`.
 */
export function HeroAdminPreviewFrame({
  hero,
  previewSrc,
  theme,
  frameClassName,
  className,
  companyBackgroundBlur = 0,
}: Props) {
  const opacity = clampHeroOverlayOpacity(hero.heroOverlayOpacity);
  const hex = parseHeroOverlayHex(hero.heroOverlayColor);
  const gradient = (hero.heroOverlayGradient ?? "navy-depth") as HeroOverlayGradientId;
  const gradientCls = heroReadabilityGradientClass(gradient);
  const blurPx = clampHeroBlurStrength(hero.heroBlurStrength);
  const brightness = clampHeroBackgroundBrightness(hero.heroBackgroundBrightness);
  const pos = resolveHeroBackgroundPosition(hero);
  const cinematic = hero.heroEnableCinematic !== false;
  const fog = hero.heroEnableFog !== false && cinematic;

  const bgBlur = clampCompanyHeroBackgroundBlur(companyBackgroundBlur);
  const mediaFilter = [bgBlur > 0 ? `blur(${bgBlur}px)` : "", `brightness(${brightness})`].filter(Boolean).join(" ");
  const mediaScale = bgBlur > 10 ? "scale-110" : bgBlur > 0 ? "scale-105" : "";

  return (
    <div className={cn(theme === "dark" && "dark", className)}>
      <div className={cn("relative overflow-hidden rounded-lg border border-border bg-muted", frameClassName)}>
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div
            className={cn("absolute inset-0 bg-cover bg-no-repeat", mediaScale)}
            style={{
              transformOrigin: "center center",
              backgroundImage: `url(${previewSrc})`,
              backgroundPosition: pos,
              filter: mediaFilter,
            }}
          />
        </div>

        {fog ? (
          <div
          className="pointer-events-none absolute inset-0 z-[5] bg-gradient-to-tr from-primary/8 via-transparent to-accent/10 opacity-50 mix-blend-soft-light dark:from-primary/12 dark:to-accent/15"
            aria-hidden
          />
        ) : null}

        <div
          className={cn("pointer-events-none absolute inset-0 z-10", !hex && gradientCls)}
          style={{
            opacity,
            ...(hex ? customHeroOverlayBackground(hex) : {}),
          }}
          aria-hidden
        />

        {blurPx > 0 ? (
          <div
            className="pointer-events-none absolute inset-0 z-[11]"
            style={{ backdropFilter: `blur(${blurPx}px)` }}
            aria-hidden
          />
        ) : null}

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[12] h-[46%] bg-gradient-to-t from-background/88 via-background/38 to-transparent dark:from-background/82 dark:via-background/32"
          aria-hidden
        />

        <div className="noise-overlay pointer-events-none absolute inset-0 z-[13] opacity-[0.14] dark:opacity-[0.18]" aria-hidden />

        <div
          className="pointer-events-none absolute inset-0 z-[14] opacity-[0.16] dark:opacity-[0.14] [background-image:linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:28px_28px]"
          aria-hidden
        />

        {cinematic ? (
          <>
            <div className="pointer-events-none absolute inset-y-0 left-0 z-[14] w-[min(68%,38rem)] bg-gradient-to-r from-black/55 via-black/28 to-transparent" aria-hidden />
            <div className="pointer-events-none absolute inset-0 z-[15] bg-hero-vignette opacity-90" aria-hidden />
          </>
        ) : null}

        <div className="relative z-20 flex h-full flex-col justify-end p-3 text-white">
          <p className="text-[8px] font-semibold uppercase tracking-wide text-white/80">Preview</p>
          <p className="mt-0.5 line-clamp-2 text-[11px] font-semibold leading-snug">
            {hero.heroTitle?.trim() || `${hero.titleLine1} ${hero.titleAccent} ${hero.titleLine2}`}
          </p>
        </div>
      </div>
    </div>
  );
}
