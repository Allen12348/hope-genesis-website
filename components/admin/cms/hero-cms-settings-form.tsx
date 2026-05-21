"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  CMS_PAGE_KEYS,
  DEFAULT_HOME_PAGE_PUBLISHED,
  HERO_BACKGROUND_FOCAL_IDS,
  HERO_LAYOUT_VARIANT_IDS,
  HERO_OVERLAY_GRADIENT_IDS,
  HERO_TEXT_ALIGN_IDS,
  HERO_TEXT_SHADOW_IDS,
  type HeroLayoutVariantId,
  type HeroBackgroundFocalId,
  type HeroOverlayGradientId,
  type HeroTextAlignId,
  type HeroTextShadowId,
  type HomePagePublishedV1,
} from "@/lib/cms/marketing-cms-defaults";
import {
  clampHeroBackgroundBrightness,
  clampHeroBackgroundContrast,
  clampHeroBackgroundOpacity,
  clampHeroBackgroundZoom,
  clampHeroBlurStrength,
  clampHeroOverlayOpacity,
  isHeroBackgroundFocalId,
  resolveHeroBackgroundImageUrl,
  resolveHeroImageAlt,
} from "@/lib/cms/hero-display";
import { upsertPageContentAction } from "@/lib/actions/cms-site";
import { HeroAdminPreviewFrame } from "@/components/admin/cms/hero-admin-preview-frame";
import { HomepageContentSubnav } from "@/components/admin/cms/homepage-content-subnav";
import { AdminCard } from "@/components/admin/ui/admin-card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const gradientLabels: Record<HeroOverlayGradientId, string> = {
  "navy-depth": "Navy depth (balanced readability)",
  "navy-soft": "Navy soft",
  "royal-gold": "Royal + gold wash",
  cinema: "Cinema (dramatic, still readable)",
  minimal: "Minimal (lighter top)",
};

const focalOptionLabel: Record<HeroBackgroundFocalId, string> = {
  center: "Center",
  top: "Top",
  bottom: "Bottom",
  left: "Left",
  right: "Right",
};

function cloneHome(h: HomePagePublishedV1): HomePagePublishedV1 {
  return structuredClone(h);
}

function patchHero<K extends keyof HomePagePublishedV1["hero"]>(
  prev: HomePagePublishedV1,
  key: K,
  value: HomePagePublishedV1["hero"][K],
): HomePagePublishedV1 {
  return {
    ...prev,
    hero: {
      ...prev.hero,
      [key]: value,
    },
  };
}

export function HeroCmsSettingsForm({
  initialHome,
  companyHeroImageUrl,
  companyHeroImageAlt,
  companyHeroBackgroundBlur,
  canEdit,
}: {
  initialHome: HomePagePublishedV1;
  companyHeroImageUrl: string | null;
  companyHeroImageAlt: string | null;
  companyHeroBackgroundBlur: number;
  canEdit: boolean;
}) {
  const router = useRouter();
  const [home, setHome] = React.useState(() => cloneHome(initialHome));
  const [pending, setPending] = React.useState(false);

  React.useEffect(() => {
    setHome(cloneHome(initialHome));
  }, [initialHome]);

  const hero = home.hero;
  const rawBgPos = hero.heroBackgroundPosition?.trim() ?? "";
  const focalSelectValue: HeroBackgroundFocalId = isHeroBackgroundFocalId(rawBgPos) ? rawBgPos : "center";
  const previewSrc = resolveHeroBackgroundImageUrl(hero, companyHeroImageUrl);
  const previewAlt = resolveHeroImageAlt(hero, companyHeroImageAlt);
  const opacityPct = Math.round(clampHeroOverlayOpacity(hero.heroOverlayOpacity) * 100);
  const gradient = (hero.heroOverlayGradient ?? "navy-depth") as HeroOverlayGradientId;
  const blurPx = clampHeroBlurStrength(hero.heroBlurStrength);
  const blurSlider = Math.round(blurPx * 10);
  const brightness = clampHeroBackgroundBrightness(hero.heroBackgroundBrightness);
  const brightnessPct = Math.round(brightness * 100);
  const zoom = clampHeroBackgroundZoom(hero.heroBackgroundZoom);
  const zoomPct = Math.round(zoom * 100);
  const contrast = clampHeroBackgroundContrast(hero.heroBackgroundContrast);
  const contrastPct = Math.round(contrast * 100);
  const mediaOpacity = clampHeroBackgroundOpacity(hero.heroBackgroundOpacity);
  const mediaOpacityPct = Math.round(mediaOpacity * 100);
  const layoutVariant = (hero.heroLayoutVariant ?? "image") as HeroLayoutVariantId;

  async function savePublish() {
    if (!canEdit) return;
    setPending(true);
    const res = await upsertPageContentAction({
      pageKey: CMS_PAGE_KEYS.home,
      publishedData: JSON.stringify(home, null, 2),
      draftData: JSON.stringify(home, null, 2),
      status: "PUBLISHED",
    });
    setPending(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success(res.message ?? "Hero settings saved");
    router.refresh();
  }

  function resetBackgroundToDefaults() {
    setHome((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        heroBackgroundImageUrl: undefined,
        heroBackgroundVideoUrl: undefined,
        heroBackgroundImageAlt: undefined,
        heroOverlayOpacity: DEFAULT_HOME_PAGE_PUBLISHED.hero.heroOverlayOpacity,
        heroOverlayGradient: DEFAULT_HOME_PAGE_PUBLISHED.hero.heroOverlayGradient,
        heroOverlayColor: undefined,
        heroBlurStrength: DEFAULT_HOME_PAGE_PUBLISHED.hero.heroBlurStrength,
        heroBackgroundBrightness: DEFAULT_HOME_PAGE_PUBLISHED.hero.heroBackgroundBrightness,
        heroBackgroundPosition: DEFAULT_HOME_PAGE_PUBLISHED.hero.heroBackgroundPosition,
        heroTextShadow: DEFAULT_HOME_PAGE_PUBLISHED.hero.heroTextShadow,
        heroEnableCinematic: DEFAULT_HOME_PAGE_PUBLISHED.hero.heroEnableCinematic,
        heroEnableParallax: false,
        heroEnableParticles: false,
        heroEnableFog: DEFAULT_HOME_PAGE_PUBLISHED.hero.heroEnableFog,
        heroEnableCtaGlow: false,
      },
    }));
    toast.success("Background fields reset locally — click Save & publish to apply.");
  }

  return (
    <div className="space-y-6">
      <HomepageContentSubnav active="hero" />
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">Homepage hero</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Control the hero background, readability overlay, and primary copy overrides. Hero metric cards are edited in{" "}
            <Link href="/admin/content/homepage/hero-stats" className="font-medium text-accent hover:underline">
              Homepage → Hero stats
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" className="rounded-lg" disabled={!canEdit || pending} onClick={resetBackgroundToDefaults}>
            Reset background to default
          </Button>
          <Button type="button" size="sm" className="rounded-lg" disabled={!canEdit || pending} onClick={() => void savePublish()}>
            Save & publish
          </Button>
        </div>
      </div>

      {!canEdit ? (
        <p className="text-sm text-amber-700 dark:text-amber-400">Your role is view-only — hero changes are disabled.</p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <AdminCard className="space-y-5 p-5">
          <h2 className="font-display text-base font-semibold text-foreground">Background & overlay</h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Recommended: dark HVAC installation photo or cinematic refrigeration background.
          </p>
          <div className="space-y-2">
            <Label htmlFor="hero-bg-image">Background image URL</Label>
            <Input
              id="hero-bg-image"
              value={hero.heroBackgroundImageUrl ?? ""}
              disabled={!canEdit}
              placeholder="https://…"
              onChange={(e) => setHome((h) => patchHero(h, "heroBackgroundImageUrl", e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hero-bg-video">Background video URL (optional)</Label>
            <Input
              id="hero-bg-video"
              value={hero.heroBackgroundVideoUrl ?? ""}
              disabled={!canEdit}
              placeholder="https://…mp4 (desktop only; mobile uses the image)"
              onChange={(e) => setHome((h) => patchHero(h, "heroBackgroundVideoUrl", e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hero-bg-alt">Background image alt text</Label>
            <Input
              id="hero-bg-alt"
              value={hero.heroBackgroundImageAlt ?? ""}
              disabled={!canEdit}
              placeholder="Describe the scene for accessibility"
              onChange={(e) => setHome((h) => patchHero(h, "heroBackgroundImageAlt", e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <Label>Overlay opacity ({opacityPct}%)</Label>
            </div>
            <input
              type="range"
              min={15}
              max={92}
              value={opacityPct}
              disabled={!canEdit}
              className="h-2 w-full cursor-pointer accent-accent"
              onChange={(e) =>
                setHome((h) => patchHero(h, "heroOverlayOpacity", Number(e.target.value) / 100))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hero-overlay-hex">Overlay tint (hex, optional)</Label>
            <Input
              id="hero-overlay-hex"
              value={hero.heroOverlayColor ?? ""}
              disabled={!canEdit}
              placeholder="#0F172A or #38BDF8 — overrides gradient preset when set"
              onChange={(e) => setHome((h) => patchHero(h, "heroOverlayColor", e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label>Texture blur ({blurPx.toFixed(1)}px)</Label>
            <input
              type="range"
              min={0}
              max={120}
              value={blurSlider}
              disabled={!canEdit}
              className="h-2 w-full cursor-pointer accent-accent"
              onChange={(e) =>
                setHome((h) => patchHero(h, "heroBlurStrength", Number(e.target.value) / 10))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Background brightness ({brightnessPct}%)</Label>
            <input
              type="range"
              min={55}
              max={115}
              value={brightnessPct}
              disabled={!canEdit}
              className="h-2 w-full cursor-pointer accent-accent"
              onChange={(e) =>
                setHome((h) => patchHero(h, "heroBackgroundBrightness", Number(e.target.value) / 100))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Background zoom ({zoomPct}%)</Label>
            <input
              type="range"
              min={100}
              max={120}
              value={zoomPct}
              disabled={!canEdit}
              className="h-2 w-full cursor-pointer accent-accent"
              onChange={(e) =>
                setHome((h) => patchHero(h, "heroBackgroundZoom", Number(e.target.value) / 100))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Background contrast ({contrastPct}%)</Label>
            <input
              type="range"
              min={85}
              max={125}
              value={contrastPct}
              disabled={!canEdit}
              className="h-2 w-full cursor-pointer accent-accent"
              onChange={(e) =>
                setHome((h) => patchHero(h, "heroBackgroundContrast", Number(e.target.value) / 100))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Background opacity ({mediaOpacityPct}%)</Label>
            <input
              type="range"
              min={40}
              max={100}
              value={mediaOpacityPct}
              disabled={!canEdit}
              className="h-2 w-full cursor-pointer accent-accent"
              onChange={(e) =>
                setHome((h) => patchHero(h, "heroBackgroundOpacity", Number(e.target.value) / 100))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hero-layout">Hero layout variant</Label>
            <select
              id="hero-layout"
              disabled={!canEdit}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={layoutVariant}
              onChange={(e) =>
                setHome((h) => patchHero(h, "heroLayoutVariant", e.target.value as HeroLayoutVariantId))
              }
            >
              {HERO_LAYOUT_VARIANT_IDS.map((id) => (
                <option key={id} value={id}>
                  {id.charAt(0).toUpperCase() + id.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hero-text-align">Text alignment</Label>
            <select
              id="hero-text-align"
              disabled={!canEdit}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={(hero.heroTextAlign ?? "left") as HeroTextAlignId}
              onChange={(e) =>
                setHome((h) => patchHero(h, "heroTextAlign", e.target.value as HeroTextAlignId))
              }
            >
              {HERO_TEXT_ALIGN_IDS.map((id) => (
                <option key={id} value={id}>
                  {id.charAt(0).toUpperCase() + id.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hero-bg-focal">Background focal point</Label>
            <select
              id="hero-bg-focal"
              disabled={!canEdit}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={focalSelectValue}
              onChange={(e) =>
                setHome((h) =>
                  patchHero(h, "heroBackgroundPosition", e.target.value as HeroBackgroundFocalId),
                )
              }
            >
              {HERO_BACKGROUND_FOCAL_IDS.map((id) => (
                <option key={id} value={id}>
                  {focalOptionLabel[id]}
                </option>
              ))}
            </select>
            {rawBgPos && !isHeroBackgroundFocalId(rawBgPos) ? (
              <p className="text-xs text-muted-foreground">
                Saved content uses a custom background position string. Choosing a preset replaces it when you save.
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="hero-text-shadow">Headline text shadow</Label>
            <select
              id="hero-text-shadow"
              disabled={!canEdit}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={(hero.heroTextShadow ?? "subtle") as HeroTextShadowId}
              onChange={(e) =>
                setHome((h) => patchHero(h, "heroTextShadow", e.target.value as HeroTextShadowId))
              }
            >
              {HERO_TEXT_SHADOW_IDS.map((id) => (
                <option key={id} value={id}>
                  {id === "none" ? "None" : id === "subtle" ? "Subtle (recommended)" : "Medium"}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hero-gradient">Overlay gradient preset</Label>
            <select
              id="hero-gradient"
              disabled={!canEdit}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={gradient}
              onChange={(e) =>
                setHome((h) => patchHero(h, "heroOverlayGradient", e.target.value as HeroOverlayGradientId))
              }
            >
              {HERO_OVERLAY_GRADIENT_IDS.map((id) => (
                <option key={id} value={id}>
                  {gradientLabels[id]}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <Checkbox
                checked={hero.heroEnableCinematic !== false}
                disabled={!canEdit}
                onCheckedChange={(v) => setHome((h) => patchHero(h, "heroEnableCinematic", v === true))}
              />
              Cinematic layers (fog, particles, vignette)
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <Checkbox
                checked={Boolean(hero.heroEnableParallax)}
                disabled={!canEdit}
                onCheckedChange={(v) => setHome((h) => patchHero(h, "heroEnableParallax", v === true))}
              />
              Parallax (subtle)
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <Checkbox
                checked={Boolean(hero.heroEnableParticles)}
                disabled={!canEdit}
                onCheckedChange={(v) => setHome((h) => patchHero(h, "heroEnableParticles", v === true))}
              />
              Floating particles
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <Checkbox
                checked={hero.heroEnableFog !== false}
                disabled={!canEdit}
                onCheckedChange={(v) => setHome((h) => patchHero(h, "heroEnableFog", v === true))}
              />
              Animated fog / light wash
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <Checkbox
                checked={hero.heroEnableAirflow !== false}
                disabled={!canEdit}
                onCheckedChange={(v) => setHome((h) => patchHero(h, "heroEnableAirflow", v === true))}
              />
              HVAC airflow curves
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <Checkbox
                checked={Boolean(hero.heroEnableCtaGlow)}
                disabled={!canEdit}
                onCheckedChange={(v) => setHome((h) => patchHero(h, "heroEnableCtaGlow", v === true))}
              />
              Gold glow on primary CTA
            </label>
          </div>
        </AdminCard>

        <AdminCard className="space-y-5 p-5">
          <h2 className="font-display text-base font-semibold text-foreground">Copy & CTAs</h2>
          <div className="space-y-2">
            <Label htmlFor="hero-title">Hero title (optional — replaces split headline)</Label>
            <Textarea
              id="hero-title"
              rows={2}
              disabled={!canEdit}
              value={hero.heroTitle ?? ""}
              placeholder="Leave blank to use the three-line headline from Homepage JSON"
              onChange={(e) => setHome((h) => patchHero(h, "heroTitle", e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hero-sub">Hero subtitle (optional)</Label>
            <Textarea
              id="hero-sub"
              rows={3}
              disabled={!canEdit}
              value={hero.heroSubtitle ?? ""}
              placeholder="Leave blank to use the default subtitle"
              onChange={(e) => setHome((h) => patchHero(h, "heroSubtitle", e.target.value))}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="hero-badge">Brand badge</Label>
              <Input
                id="hero-badge"
                disabled={!canEdit}
                value={hero.heroBadgeText ?? ""}
                placeholder={DEFAULT_HOME_PAGE_PUBLISHED.hero.eyebrowBrand}
                onChange={(e) => setHome((h) => patchHero(h, "heroBadgeText", e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero-loc">Location badge</Label>
              <Input
                id="hero-loc"
                disabled={!canEdit}
                value={hero.heroLocationText ?? ""}
                placeholder={DEFAULT_HOME_PAGE_PUBLISHED.hero.eyebrowRegion}
                onChange={(e) => setHome((h) => patchHero(h, "heroLocationText", e.target.value))}
              />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="hero-pri-l">Primary button label</Label>
              <Input
                id="hero-pri-l"
                disabled={!canEdit}
                value={hero.heroPrimaryButtonLabel ?? ""}
                placeholder="Get Instant Estimate"
                onChange={(e) => setHome((h) => patchHero(h, "heroPrimaryButtonLabel", e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero-pri-u">Primary button URL</Label>
              <Input
                id="hero-pri-u"
                disabled={!canEdit}
                value={hero.heroPrimaryButtonUrl ?? ""}
                placeholder="/estimate"
                onChange={(e) => setHome((h) => patchHero(h, "heroPrimaryButtonUrl", e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero-sec-l">Secondary button label</Label>
              <Input
                id="hero-sec-l"
                disabled={!canEdit}
                value={hero.heroSecondaryButtonLabel ?? ""}
                placeholder="Get Free Quote"
                onChange={(e) => setHome((h) => patchHero(h, "heroSecondaryButtonLabel", e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero-sec-u">Secondary button URL</Label>
              <Input
                id="hero-sec-u"
                disabled={!canEdit}
                value={hero.heroSecondaryButtonUrl ?? ""}
                placeholder="/contact"
                onChange={(e) => setHome((h) => patchHero(h, "heroSecondaryButtonUrl", e.target.value))}
              />
            </div>
          </div>
        </AdminCard>
      </div>

      <AdminCard className="space-y-4 p-5">
        <h2 className="font-display text-base font-semibold text-foreground">Live preview</h2>
        <p className="text-xs text-muted-foreground">
          Matches the public overlay stack. Video plays on the live site at md+ only; mobile uses the still image.
        </p>
        <div className="grid gap-4 sm:grid-cols-2" role="region" aria-label={`Hero overlay preview: ${previewAlt}`}>
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Desktop · Light</p>
            <HeroAdminPreviewFrame
              hero={hero}
              previewSrc={previewSrc}
              theme="light"
              frameClassName="h-36 w-full min-h-[9rem]"
              companyBackgroundBlur={companyHeroBackgroundBlur}
            />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Desktop · Dark</p>
            <HeroAdminPreviewFrame
              hero={hero}
              previewSrc={previewSrc}
              theme="dark"
              frameClassName="h-36 w-full min-h-[9rem]"
              companyBackgroundBlur={companyHeroBackgroundBlur}
            />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Mobile · Light</p>
            <HeroAdminPreviewFrame
              hero={hero}
              previewSrc={previewSrc}
              theme="light"
              frameClassName="mx-auto aspect-[9/19] w-[11rem] min-h-[14rem] max-w-full"
              companyBackgroundBlur={companyHeroBackgroundBlur}
            />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Mobile · Dark</p>
            <HeroAdminPreviewFrame
              hero={hero}
              previewSrc={previewSrc}
              theme="dark"
              frameClassName="mx-auto aspect-[9/19] w-[11rem] min-h-[14rem] max-w-full"
              companyBackgroundBlur={companyHeroBackgroundBlur}
            />
          </div>
        </div>
      </AdminCard>
    </div>
  );
}
