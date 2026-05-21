"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  Briefcase,
  Clock,
  MapPin,
  Shield,
  ShieldCheck,
  Snowflake,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import type {
  HeroStatIcon,
  HeroTextAlignId,
  HeroTrustChip,
  HeroTrustChipIcon,
} from "@/lib/cms/marketing-cms-defaults";
import { HERO_TEXT_ALIGN_IDS } from "@/lib/cms/marketing-cms-defaults";
import { resolveVisibleHeroStats } from "@/lib/cms/hero-stats";
import {
  buildResolvedHeroButtons,
  clampHeroBackgroundBrightness,
  clampHeroBackgroundContrast,
  clampHeroBackgroundOpacity,
  clampHeroBackgroundZoom,
  clampHeroBlurStrength,
  clampHeroOverlayOpacity,
  heroTextShadowCss,
  parseHeroOverlayHex,
  resolveHeroBackgroundImageUrl,
  resolveHeroBackgroundPosition,
  resolveHeroBackgroundVideoUrl,
  resolveHeroEyebrowBrand,
  resolveHeroEyebrowRegion,
  resolveHeroImageAlt,
  resolveHeroOverlayGradient,
  resolveHeroSingleTitle,
  resolveHeroSubtitle,
  resolveHeroTextShadow,
} from "@/lib/cms/hero-display";
import { useMarketingSite } from "@/components/providers/marketing-site-provider";
import { AnimatedStatValue } from "@/components/motion/animated-stat-value";
import { Button } from "@/components/ui/button";
import { HeroBackground } from "@/components/sections/hero-background";
import { cn } from "@/lib/utils";

const trustIconMap: Record<HeroTrustChipIcon, LucideIcon> = {
  shield: ShieldCheck,
  map: MapPin,
  wrench: Wrench,
  award: Award,
  clock: Clock,
  badge: BadgeCheck,
  users: Users,
};

const statIconMap: Record<HeroStatIcon, LucideIcon> = {
  briefcase: Briefcase,
  clock: Clock,
  users: Users,
  shield: Shield,
};

function statIconFor(label: string, explicit?: HeroStatIcon): LucideIcon {
  if (explicit && statIconMap[explicit]) return statIconMap[explicit]!;
  const l = label.toLowerCase();
  if (l.includes("project")) return Briefcase;
  if (l.includes("year") || l.includes("experience")) return Clock;
  if (l.includes("client")) return Users;
  return Shield;
}

export function HeroSection() {
  const { site, cms } = useMarketingSite();
  const reduce = useReducedMotion();
  const hero = cms.home.hero;
  const layout = hero.heroLayoutVariant ?? "image";
  const heroSrc = resolveHeroBackgroundImageUrl(hero, site.heroImageUrl);
  const heroAlt = resolveHeroImageAlt(hero, site.heroImageAlt);
  const videoUrl = resolveHeroBackgroundVideoUrl(hero);
  const overlayGradient = resolveHeroOverlayGradient(hero);
  const overlayOpacity = clampHeroOverlayOpacity(hero.heroOverlayOpacity);
  const overlayHex = parseHeroOverlayHex(hero.heroOverlayColor);
  const blurStrength = clampHeroBlurStrength(hero.heroBlurStrength);
  const backgroundBrightness = clampHeroBackgroundBrightness(hero.heroBackgroundBrightness);
  const backgroundPosition = resolveHeroBackgroundPosition(hero);
  const backgroundZoom = clampHeroBackgroundZoom(hero.heroBackgroundZoom);
  const backgroundContrast = clampHeroBackgroundContrast(hero.heroBackgroundContrast);
  const backgroundOpacity = clampHeroBackgroundOpacity(hero.heroBackgroundOpacity);
  const textLiftCss = heroTextShadowCss(resolveHeroTextShadow(hero));
  const heroReadableShadow =
    "0 2px 12px rgba(0,0,0,0.65)" + (textLiftCss ? `, ${textLiftCss}` : "");
  const textLift = { textShadow: heroReadableShadow } as const;
  const heroTextShadow = "drop-shadow-[0_2px_12px_rgba(0,0,0,0.65)]";
  const enableCinematic = hero.heroEnableCinematic !== false;
  const badgeBrand = resolveHeroEyebrowBrand(hero);
  const badgeRegion = resolveHeroEyebrowRegion(hero);
  const subtitle = resolveHeroSubtitle(hero);
  const singleTitle = resolveHeroSingleTitle(hero);
  const buttons = buildResolvedHeroButtons(hero);
  const visibleStats = resolveVisibleHeroStats(hero.stats);
  const ctaGlow = Boolean(hero.heroEnableCtaGlow);
  const isCentered = layout === "centered";
  const isSplit = layout === "split";
  const isDark = layout === "dark" || layout === "commercial";
  const preferVideo = layout === "video" && Boolean(videoUrl);
  const textAlignRaw = hero.heroTextAlign ?? "left";
  const textAlign: HeroTextAlignId = HERO_TEXT_ALIGN_IDS.includes(textAlignRaw as HeroTextAlignId)
    ? (textAlignRaw as HeroTextAlignId)
    : "left";
  const alignCenter = isCentered || textAlign === "center";
  const alignRight = !isCentered && textAlign === "right";

  const btnWidths = "w-full min-h-11 sm:min-h-12 sm:w-auto";
  const heroCtaSecondary =
    "rounded-2xl border border-white/25 !bg-black/45 px-6 font-medium !text-white shadow-sm backdrop-blur-xl hover:!bg-black/60 sm:px-7";
  const heroCtaAccent =
    "rounded-2xl !bg-sky-400 px-6 font-semibold !text-black shadow-sm hover:!bg-sky-400/90 sm:px-7";

  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden overflow-x-clip">
      <HeroBackground
        imageSrc={heroSrc}
        imageAlt={heroAlt}
        videoUrl={preferVideo ? videoUrl : layout === "video" ? null : videoUrl}
        overlayGradient={overlayGradient}
        overlayOpacity={overlayOpacity}
        overlayHex={overlayHex}
        blurStrength={blurStrength}
        backgroundBrightness={backgroundBrightness}
        backgroundPosition={backgroundPosition}
        backgroundZoom={backgroundZoom}
        backgroundContrast={backgroundContrast}
        backgroundOpacity={backgroundOpacity}
        enableParallax={Boolean(hero.heroEnableParallax)}
        enableParticles={Boolean(hero.heroEnableParticles)}
        enableFog={hero.heroEnableFog !== false}
        enableCinematic={enableCinematic}
        enableAirflow={hero.heroEnableAirflow !== false}
        backgroundImageBlur={site.heroBackgroundBlur}
        layoutDark={isDark}
      />

      <div
        className={cn(
          "relative z-30 mx-auto flex w-full max-w-6xl min-h-[100svh] flex-col justify-center px-4 pb-12 pt-[4.75rem] sm:px-6 sm:pt-24 lg:max-w-[72rem] lg:px-8 lg:pb-16 lg:pt-28",
          alignCenter && "items-center text-center",
          alignRight && "items-end text-right",
          isSplit && "lg:grid lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-10 xl:gap-12",
          "[@media(max-height:800px)]:pb-6 [@media(max-height:800px)]:pt-20",
        )}
      >
        <motion.div
          initial={reduce ? false : { y: 16 }}
          animate={reduce ? undefined : { y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "flex w-full max-w-3xl flex-col gap-5 sm:gap-6 lg:gap-7",
            alignCenter && "mx-auto items-center",
            alignRight && "ml-auto items-end",
            isSplit && "lg:max-w-none",
            "[@media(max-height:800px)]:gap-3 [@media(max-height:800px)]:sm:gap-4",
          )}
        >
          <div
            className={cn(
              "flex flex-wrap items-center gap-2",
              heroTextShadow,
              alignCenter ? "justify-center" : alignRight ? "justify-end" : "sm:justify-start",
            )}
            style={textLift}
          >
            <div className="hero-glass-chip border-white/25 bg-white/15 font-medium text-white backdrop-blur-md dark:bg-black/45">
              <Snowflake className="mr-1 inline h-3.5 w-3.5 align-text-bottom" aria-hidden />
              {badgeBrand}
            </div>
            <div className="hero-glass-chip border-white/25 bg-white/15 text-white backdrop-blur-md dark:bg-black/45">
              {badgeRegion}
            </div>
          </div>

          {singleTitle ? (
            <h1
              style={textLift}
              className={cn(
                "font-display text-[clamp(2.25rem,5.2vw,4.75rem)] font-extrabold leading-[1.02] tracking-[-0.035em] text-balance text-white",
                heroTextShadow,
                "[@media(max-height:800px)]:text-[clamp(1.95rem,4.8vw,3rem)]",
              )}
            >
              {singleTitle}
            </h1>
          ) : (
            <h1
              style={textLift}
              className={cn(
                "font-display text-[clamp(2.25rem,5.2vw,4.75rem)] font-extrabold leading-[1.02] tracking-[-0.035em] text-balance text-white",
                heroTextShadow,
                "[@media(max-height:800px)]:text-[clamp(1.95rem,4.8vw,3rem)]",
              )}
            >
              {hero.titleLine1}{" "}
              <span className="text-[hsl(var(--primary))]">{hero.titleAccent}</span>{" "}
              {hero.titleLine2}
            </h1>
          )}

          <p
            style={textLift}
            className={cn(
              "max-w-[min(100%,38rem)] text-[clamp(1rem,1.35vw,1.125rem)] font-normal leading-[1.65] text-white/90",
              heroTextShadow,
              alignCenter && "mx-auto",
              alignRight && "ml-auto",
            )}
          >
            {subtitle}
          </p>

          <motion.div
            className={cn(
              "flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap",
              alignCenter ? "justify-center" : alignRight ? "justify-end" : "sm:justify-start",
              "[@media(max-height:800px)]:gap-2",
            )}
          >
            {buttons.map((b) => {
              const href = b.usePhoneTel ? site.phoneTel : b.href;
              const isAccent = b.variant === "accent";
              const secondaryCls = cn(btnWidths, heroCtaSecondary);
              const accentCls = cn(
                btnWidths,
                heroCtaAccent,
                ctaGlow && isAccent && "shadow-[0_16px_48px_-14px_rgba(56,189,248,0.28)]",
              );

              const inner = (
                <>
                  {b.label}
                  {b.showArrow ? <ArrowRight className="h-4 w-4" /> : null}
                </>
              );

              if (b.usePhoneTel || href.startsWith("http://") || href.startsWith("https://")) {
                return (
                  <Button
                    key={b.label + href}
                    asChild
                    size="lg"
                    variant={isAccent ? "accent" : "outline"}
                    className={isAccent ? accentCls : secondaryCls}
                  >
                    <a href={href}>{inner}</a>
                  </Button>
                );
              }

              return (
                <Button
                  key={b.label + href}
                  asChild
                  size="lg"
                  variant={isAccent ? "accent" : "outline"}
                  className={isAccent ? accentCls : secondaryCls}
                >
                  <Link href={href}>{inner}</Link>
                </Button>
              );
            })}
          </motion.div>

          <div
            className={cn(
              "flex flex-wrap gap-2",
              heroTextShadow,
              alignCenter ? "justify-center" : alignRight ? "justify-end" : "sm:justify-start",
            )}
            style={textLift}
          >
            {(Array.isArray(hero?.trustChips) ? hero.trustChips : []).map((chip: HeroTrustChip) => {
              const Icon = trustIconMap[chip.icon] ?? ShieldCheck;
              return (
                <div key={chip.label} className="hero-glass-chip group sm:py-2">
                  <Icon className="h-3.5 w-3.5 text-sky-300 transition group-hover:scale-105 sm:h-4 sm:w-4" aria-hidden />
                  {chip.label}
                </div>
              );
            })}
          </div>

          <div className="grid w-full grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {visibleStats.map((s) => {
              const StatIcon = statIconFor(s.label, s.icon);
              return (
                <div key={s.id} className="hero-glass-stat group [@media(max-height:800px)]:p-3">
                  <span
                    className="pointer-events-none absolute -right-4 -top-4 h-16 w-16 rounded-full bg-sky-400/20 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100"
                    aria-hidden
                  />
                  <StatIcon className="mb-2 h-4 w-4 text-sky-300" aria-hidden />
                  <div className="font-display text-[clamp(1.55rem,2.6vw,2.5rem)] font-bold leading-none tracking-tight text-white">
                    <AnimatedStatValue end={s.value} suffix={s.suffix} startOnMount className="text-white" />
                  </div>
                  <div className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-white/75 sm:text-xs [@media(max-height:800px)]:mt-1">
                    {s.label}
                  </div>
                </div>
              );
            })}
          </div>

          <div
            className={cn(
              "flex flex-wrap gap-2 text-sm sm:gap-2.5",
              alignCenter ? "justify-center" : alignRight ? "justify-end" : "sm:justify-start",
            )}
            style={textLift}
          >
            {hero.bottomBadges.map((line) => (
              <motion.div
                key={line}
                className={cn(
                  "hero-glass-badge text-white/75 [@media(max-height:800px)]:py-1 sm:py-2",
                  heroTextShadow,
                )}
              >
                <BadgeCheck className="h-4 w-4 shrink-0 text-sky-300" />
                {line}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {isSplit ? (
          <motion.div
            initial={reduce ? false : { scale: 0.98 }}
            animate={reduce ? undefined : { scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative mt-8 hidden lg:block"
            aria-hidden
          >
            <div className="aspect-[4/5] overflow-hidden rounded-3xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-md">
              <motion.div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${heroSrc})`, backgroundPosition }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>
          </motion.div>
        ) : null}
      </div>
    </section>
  );
}
