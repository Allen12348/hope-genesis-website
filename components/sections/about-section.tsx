import { CmsImage } from "@/components/media/cms-image";
import { CheckCircle2 } from "lucide-react";
import type { AboutPageCms } from "@/lib/cms/marketing-cms-defaults";
import { DEFAULT_ABOUT_PAGE_PUBLISHED } from "@/lib/cms/marketing-cms-defaults";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { SectionShell } from "@/components/sections/section-shell";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const defaultCms = DEFAULT_ABOUT_PAGE_PUBLISHED;

export function AboutSection({ intro = true, cms = defaultCms }: { intro?: boolean; cms?: AboutPageCms }) {
  return (
    <SectionShell
      intro={intro}
      eyebrow={cms.storyEyebrow}
      title={cms.storyTitle}
      description={cms.storyDescription}
    >
      <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
        <ScrollReveal className="lg:col-span-6">
          <div className="relative overflow-hidden rounded-3xl border border-border/70 shadow-lift">
            <div className="relative aspect-[4/3]">
              <CmsImage
                src={cms.imageUrl}
                alt={cms.imageAlt}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
                loading="lazy"
              />
            </div>
            <div className="absolute inset-x-0 bottom-0 border-t border-white/10 bg-gradient-to-t from-brand-navy-deep/90 to-transparent p-6 text-white">
              <div className="font-display text-lg font-semibold">{cms.imageCaptionTitle}</div>
              <div className="mt-1 text-sm text-white/75">{cms.imageCaptionSubtitle}</div>
            </div>
          </div>
        </ScrollReveal>

        <div className="lg:col-span-6">
          <ScrollReveal delay={0.05}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="rounded-3xl border-border/70 bg-card/70 p-6 shadow-glass backdrop-blur">
                <div className="text-xs font-semibold uppercase tracking-wide text-accent">{cms.visionTitle}</div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{cms.visionBody}</p>
              </Card>
              <Card className="rounded-3xl border-border/70 bg-card/70 p-6 shadow-glass backdrop-blur">
                <div className="text-xs font-semibold uppercase tracking-wide text-accent">{cms.missionTitle}</div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{cms.missionBody}</p>
              </Card>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1} className="mt-6">
            <Card className="rounded-3xl border-border/70 p-6">
              <div className="font-display text-lg font-semibold">{cms.whyTitle}</div>
              <Separator className="my-4" />
              <ul className="space-y-3 text-sm text-muted-foreground">
                {cms.pillars.map((p) => (
                  <li key={p} className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                    <span className="leading-relaxed">{p}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </ScrollReveal>
        </div>
      </div>
    </SectionShell>
  );
}
