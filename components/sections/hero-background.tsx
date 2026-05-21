"use client";

import * as React from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import type { HeroOverlayGradientId } from "@/lib/cms/marketing-cms-defaults";
import {
  clampCompanyHeroBackgroundBlur,
  clampHeroBackgroundContrast,
  clampHeroBackgroundOpacity,
  clampHeroBackgroundZoom,
  clampHeroBlurStrength,
  clampHeroOverlayOpacity,
  customHeroOverlayBackground,
  heroReadabilityGradientClass,
} from "@/lib/cms/hero-display";
import { HvacAirflow } from "@/components/motion/hvac-airflow";
import { CmsImage } from "@/components/media/cms-image";
import { DEFAULT_HERO_IMAGE } from "@/lib/cms/homepage-hero";
import { cn } from "@/lib/utils";

type Props = {
  imageSrc: string;
  imageAlt: string;
  videoUrl: string | null;
  overlayGradient: HeroOverlayGradientId;
  overlayOpacity: number;
  overlayHex: string | null;
  blurStrength: number;
  backgroundBrightness: number;
  backgroundPosition: string;
  backgroundZoom?: number;
  backgroundContrast?: number;
  backgroundOpacity?: number;
  enableParallax: boolean;
  enableParticles: boolean;
  enableFog: boolean;
  enableCinematic: boolean;
  enableAirflow?: boolean;
  backgroundImageBlur: number;
  layoutDark?: boolean;
};

function backgroundMediaFilter(
  blurPx: number,
  brightness: number,
  contrast: number,
  opacity: number,
): string {
  const b = clampCompanyHeroBackgroundBlur(blurPx);
  const parts: string[] = [];
  if (b > 0) parts.push(`blur(${b}px)`);
  parts.push(`brightness(${brightness})`);
  parts.push(`contrast(${contrast})`);
  if (opacity < 1) parts.push(`opacity(${opacity})`);
  return parts.join(" ");
}

/** z-0 media · z-10 overlays · z-20 FX — hero content renders at z-30 in HeroSection. */
export function HeroBackground({
  imageSrc,
  imageAlt,
  videoUrl,
  overlayGradient,
  overlayOpacity,
  overlayHex,
  blurStrength,
  backgroundBrightness,
  backgroundPosition,
  backgroundZoom = 1.04,
  backgroundContrast = 1,
  backgroundOpacity = 1,
  enableParallax,
  enableParticles,
  enableFog,
  enableCinematic,
  enableAirflow = true,
  backgroundImageBlur,
  layoutDark = false,
}: Props) {
  const reduce = useReducedMotion();
  const [allowVideo, setAllowVideo] = React.useState(false);

  React.useEffect(() => {
    if (!videoUrl) {
      setAllowVideo(false);
      return;
    }
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setAllowVideo(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [videoUrl]);

  const { scrollYProgress } = useScroll();
  const parallaxY = useTransform(scrollYProgress, [0, 0.4], [0, reduce ? 0 : 44]);
  const zoom = clampHeroBackgroundZoom(backgroundZoom);
  const parallaxScale = reduce ? zoom : zoom + 0.02;

  const overlayStrength = clampHeroOverlayOpacity(overlayOpacity);
  const gradientCls = heroReadabilityGradientClass(overlayGradient);
  const useParallax = enableParallax && !reduce;
  const blurPx = clampHeroBlurStrength(blurStrength);
  const cinematic = enableCinematic && !reduce;
  const showFog = enableFog && cinematic;
  const showParticles = enableParticles && cinematic;
  const showAirflow = enableAirflow !== false && cinematic;
  const showVignette = cinematic;

  const bgBlur = clampCompanyHeroBackgroundBlur(backgroundImageBlur);
  const mediaFilter = backgroundMediaFilter(
    bgBlur,
    backgroundBrightness,
    clampHeroBackgroundContrast(backgroundContrast),
    clampHeroBackgroundOpacity(backgroundOpacity),
  );
  const mediaScaleClass =
    bgBlur > 10 ? "scale-110" : bgBlur > 0 ? "scale-105" : "scale-100";

  const parallaxMotionStyle = useParallax
    ? { y: parallaxY, scale: parallaxScale }
    : { scale: zoom };

  const overlayAlpha = 0.5 + overlayStrength * 0.32;

  return (
    <>
      <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <motion.div
          style={parallaxMotionStyle}
          className={cn("absolute inset-0", useParallax && "will-change-transform")}
        >
          <div className={cn("absolute inset-0", mediaScaleClass)} style={{ transformOrigin: "center center" }}>
            <div className="absolute inset-0" style={{ filter: mediaFilter }}>
              <CmsImage
                src={imageSrc}
                alt={imageAlt}
                fill
                priority
                fetchPriority="high"
                className="object-cover object-center"
                sizes="100vw"
                style={{ objectPosition: backgroundPosition }}
                fallbackSrc={DEFAULT_HERO_IMAGE}
              />
            </div>
          </div>
        </motion.div>

        {videoUrl && allowVideo ? (
          <div className="absolute inset-0 z-[1] overflow-hidden">
            <div className={cn("absolute inset-0", mediaScaleClass)} style={{ transformOrigin: "center center" }}>
              <video
                key={videoUrl}
                className="absolute inset-0 h-full w-full object-cover object-center"
                style={{
                  objectPosition: backgroundPosition,
                  filter: mediaFilter,
                  transform: `scale(${zoom})`,
                }}
                src={videoUrl}
                autoPlay
                muted
                loop
                playsInline
                preload="none"
                poster={imageSrc}
                aria-hidden
              />
            </div>
          </div>
        ) : null}
      </div>

      <div className="pointer-events-none absolute inset-0 z-10" aria-hidden>
        <div className="absolute inset-0 bg-black/35" />

        <div
          className={cn("absolute inset-0", !overlayHex && gradientCls, layoutDark && "brightness-105")}
          style={overlayHex ? customHeroOverlayBackground(overlayHex) : { opacity: overlayAlpha }}
        />

        {cinematic ? (
          <>
            <div className="absolute inset-y-0 left-0 w-[min(68%,38rem)] bg-gradient-to-r from-black/55 via-black/28 to-transparent" />
            <div className="absolute inset-y-0 right-0 w-[38%] bg-gradient-to-l from-black/22 via-black/8 to-transparent" />
          </>
        ) : null}

        {blurPx > 0 ? (
          <div
            className="absolute inset-0"
            style={{
              backdropFilter: `blur(${Math.min(blurPx, 6)}px)`,
              WebkitBackdropFilter: `blur(${Math.min(blurPx, 6)}px)`,
            }}
          />
        ) : null}

        <div className="absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-background/88 via-background/28 to-transparent dark:from-background/82 dark:via-background/24" />

        <div className="noise-overlay absolute inset-0 [opacity:0.09] dark:[opacity:0.12]" />

        {showVignette ? (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_50%,transparent_48%,rgba(0,0,0,0.28)_100%)]" />
        ) : null}
      </div>

      <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden" aria-hidden>
        {cinematic ? (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_50%_-5%,rgba(56,189,248,0.18),transparent_62%)] animate-glow-pulse" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_12%_50%,rgba(0,0,0,0.22),transparent_70%)]" />
          </>
        ) : null}

        {showFog ? (
          <div className="absolute inset-0 animate-hero-fog bg-gradient-to-tr from-primary/5 via-transparent to-accent/6 mix-blend-soft-light dark:from-primary/8 dark:to-accent/10" />
        ) : null}

        {showAirflow ? <HvacAirflow className="absolute inset-0 h-full w-full" intensity={0.75} /> : null}

        {showParticles ? (
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 12 }, (_, i) => (
              <span
                key={i}
                className="absolute h-0.5 w-0.5 rounded-full bg-sky-300/20 shadow-[0_0_6px_rgba(56,189,248,0.12)] animate-glow-pulse"
                style={{
                  left: `${(i * 17) % 100}%`,
                  top: `${(i * 23) % 88}%`,
                  animationDelay: `${(i % 8) * 0.45}s`,
                }}
              />
            ))}
          </div>
        ) : null}

        <div className="absolute inset-0 [background-image:linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:44px_44px]" />
      </div>
    </>
  );
}
