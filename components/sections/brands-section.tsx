"use client";

import type { Brand } from "@/types";
import type { SectionShellCms } from "@/lib/cms/marketing-cms-defaults";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { SectionShell } from "@/components/sections/section-shell";
import { CmsImage } from "@/components/media/cms-image";
import { cn } from "@/lib/utils";

const DEFAULT_BRANDS_SHELL: SectionShellCms = {
  eyebrow: "Authorized partners",
  title: "Trusted brands. Dealer-grade execution.",
  description:
    "We specify and support leading manufacturers — ensuring correct pairing, warranty registration, and long-term parts strategy.",
};

export function BrandMarquee({ brands, reverse }: { brands: Brand[]; reverse?: boolean }) {
  const track = [...brands, ...brands];

  return (
    <div className="relative w-full overflow-hidden py-2">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent sm:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent sm:w-24" />

      <div
        className={cn(
          "flex w-max flex-nowrap items-center gap-4 will-change-transform",
          reverse ? "animate-marquee-reverse" : "animate-marquee",
        )}
      >
        {track.map((b, idx) => (
          <div
            key={`${b.id}-${idx}`}
            className="flex h-[88px] w-[240px] shrink-0 flex-row items-center gap-3 rounded-2xl border border-border bg-card px-4 shadow-sm sm:h-[92px] sm:w-[260px] sm:px-5"
          >
            {b.imageUrl ? (
              <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted/40 sm:h-12 sm:w-12">
                <CmsImage
                  src={b.imageUrl}
                  alt={b.imageAlt || b.name}
                  width={48}
                  height={48}
                  className="object-contain p-0.5"
                />
              </div>
            ) : (
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-black text-primary sm:h-12 sm:w-12">
                {b.monogram}
              </span>
            )}
            <div className="min-w-0">
              <div className="truncate font-display text-sm font-semibold tracking-wide text-foreground sm:text-base">
                {b.name}
              </div>
              <div className="truncate text-xs text-muted-foreground sm:text-sm">Authorized solutions</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BrandsSection({
  intro = true,
  brands,
  shellCopy,
}: {
  intro?: boolean;
  brands: Brand[];
  shellCopy?: Partial<SectionShellCms>;
}) {
  const shell = {
    eyebrow: shellCopy?.eyebrow ?? DEFAULT_BRANDS_SHELL.eyebrow,
    title: shellCopy?.title ?? DEFAULT_BRANDS_SHELL.title,
    description: shellCopy?.description ?? DEFAULT_BRANDS_SHELL.description,
  };

  return (
    <SectionShell intro={intro} eyebrow={shell.eyebrow} title={shell.title} description={shell.description}>
      {brands.length === 0 ? (
        <p className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          Brand partners will appear here once published from the admin console.
        </p>
      ) : (
      <ScrollReveal className="w-full">
        <div className="w-full space-y-3 sm:space-y-4">
          <BrandMarquee brands={brands} />
          <BrandMarquee brands={brands} reverse />
        </div>
      </ScrollReveal>
      )}

      <ScrollReveal delay={0.06} className="mt-8">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-sm leading-relaxed text-slate-700 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-200">
          Looking for a specific model line (VRF, inverter splits, packaged units)? Tell us your heat load, space
          constraints, and operating hours — we&apos;ll engineer the best-fit stack and lifecycle plan.
        </div>
      </ScrollReveal>
    </SectionShell>
  );
}
