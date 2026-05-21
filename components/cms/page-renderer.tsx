"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import type { SerializedService, Project, Testimonial, Brand, GalleryImage, BlogPostSummary } from "@/types";
import type { ResolvedSite } from "@/lib/cms/resolved-site";
import type { SectionShellCms } from "@/lib/cms/marketing-cms-defaults";
import type { BuilderSection } from "@/lib/cms/page-builder/schema";
import { cn } from "@/lib/utils";
import { SectionShell } from "@/components/sections/section-shell";
import { ServicesSection } from "@/components/sections/services-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { GallerySection } from "@/components/sections/gallery-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { BrandsSection } from "@/components/sections/brands-section";
import { ContactSection } from "@/components/sections/contact-section";
import { ServiceAreaMap } from "@/components/platform/service-area-map";
import { BlogIndexClient } from "@/components/blog/blog-index-client";
import { Button } from "@/components/ui/button";
import {
  CertificationsBlock,
  ContactCtaBlock,
  ContactFormBlock,
  ContactInfoBlock,
  DividerBlock,
  EstimateCtaBlock,
  FooterColumnsBlock,
  ImageBlock,
  NavigationMenuBlock,
  RichTextBlock,
  SeoMetaBlock,
  ServiceCardBlock,
  SpacerBlock,
  TeamBlock,
  TimelineBlock,
  TwoColumnBlock,
} from "@/components/cms/page-renderer-extra-blocks";

export type PageRendererContext = {
  services: SerializedService[];
  projects: Project[];
  galleryImages: GalleryImage[];
  testimonials: Testimonial[];
  brands: Brand[];
  blogPosts: BlogPostSummary[];
  resolvedSite: ResolvedSite;
};

function spacingClass(sp: string | undefined) {
  switch (sp) {
    case "compact":
      return "py-10 sm:py-12";
    case "relaxed":
      return "py-20 sm:py-28";
    default:
      return "py-14 sm:py-20";
  }
}

function textAlignClass(a: string | undefined) {
  if (a === "center") return "text-center";
  if (a === "right") return "text-right";
  return "text-left";
}

export type PageRendererAdminPreview = {
  /** Wrap each rendered marketing block — used by the visual page builder. */
  wrapSection?: (args: {
    section: BuilderSection;
    node: React.ReactNode;
    isHidden: boolean;
  }) => React.ReactNode;
  /** When sections is empty — builder empty state or public placeholder. */
  emptyPlaceholder?: React.ReactNode;
};

type Props = {
  sections: BuilderSection[];
  ctx: PageRendererContext;
  /** When set, wraps the stack for admin preview (width / theme). */
  className?: string;
  /** Admin page-builder: show hidden sections, optional chrome wrapper, custom empty placeholder. */
  adminPreview?: PageRendererAdminPreview;
};

export function PageRenderer({ sections, ctx, className, adminPreview }: Props) {
  const sortedAll = [...sections].sort((a, b) => a.order - b.order);
  const sortedPublic = sortedAll.filter((s) => s.visible);
  const sorted = adminPreview ? sortedAll : sortedPublic;

  if (sorted.length === 0) {
    if (adminPreview?.emptyPlaceholder) {
      return <div className={cn("w-full", className)}>{adminPreview.emptyPlaceholder}</div>;
    }
    return (
      <div className={cn("w-full py-16", className)}>
        <div className="mx-auto max-w-lg rounded-3xl border border-slate-200 bg-white px-6 py-10 text-center dark:border-slate-800 dark:bg-slate-950">
          <p className="font-display text-lg font-semibold text-slate-950 dark:text-white">
            Page content is being prepared
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            This page has no visible sections yet. Add blocks in the admin page builder or use the default marketing layout.
          </p>
          <Button asChild variant="outline" className="mt-6 rounded-2xl">
            <Link href="/contact">Contact us</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      {sorted.map((section) => {
        const core = (
          <>
            {!section.visible && adminPreview ? (
              <div className="border-b border-amber-400/40 bg-amber-500/10 px-3 py-2 text-center text-[10px] font-bold uppercase tracking-wide text-amber-900 dark:text-amber-100">
                Hidden on the live website — toggle “Visible” in settings to publish this block.
              </div>
            ) : null}
            <BlockRenderer section={section} ctx={ctx} />
          </>
        );

        const rendered = adminPreview?.wrapSection
          ? adminPreview.wrapSection({
              section,
              node: core,
              isHidden: !section.visible,
            })
          : core;

        return (
          <React.Fragment key={section.id}>
            {rendered}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function BlockRenderer({ section, ctx }: { section: BuilderSection; ctx: PageRendererContext }) {
  switch (section.type) {
    case "hero":
      return <HeroBlock section={section} />;
    case "text":
      return <TextBlock section={section} />;
    case "richText":
      return <RichTextBlock section={section} />;
    case "image":
      return <ImageBlock section={section} />;
    case "imageText":
      return <ImageTextBlock section={section} />;
    case "twoColumn":
      return <TwoColumnBlock section={section} />;
    case "serviceCard":
      return <ServiceCardBlock section={section} />;
    case "servicesGrid":
      return (
        <div className={cn(spacingClass(section.props.sectionSpacing), section.props.backgroundColor || undefined)}>
          <ServicesSection services={ctx.services} intro shellCopy={section.props as Partial<SectionShellCms>} />
        </div>
      );
    case "projectsGrid":
      return (
        <div className={cn(spacingClass(section.props.sectionSpacing), section.props.backgroundColor || undefined)}>
          <ProjectsSection projects={ctx.projects} intro shellCopy={section.props as Partial<SectionShellCms>} />
        </div>
      );
    case "galleryGrid":
      return (
        <div className={cn(spacingClass(section.props.sectionSpacing), section.props.backgroundColor || undefined)}>
          <GallerySection galleryImages={ctx.galleryImages} intro shellCopy={section.props as Partial<SectionShellCms>} />
        </div>
      );
    case "testimonials":
      return (
        <div className={cn(spacingClass(section.props.sectionSpacing), section.props.backgroundColor || undefined)}>
          <TestimonialsSection testimonials={ctx.testimonials} intro shellCopy={section.props as Partial<SectionShellCms>} />
        </div>
      );
    case "brandsCarousel":
      return (
        <div className={cn(spacingClass(section.props.sectionSpacing), section.props.backgroundColor || undefined)}>
          <BrandsSection brands={ctx.brands} intro shellCopy={section.props as Partial<SectionShellCms>} />
        </div>
      );
    case "blogFeed":
      return <BlogFeedBlock section={section} blogPosts={ctx.blogPosts} />;
    case "cta":
      return <CtaBlock section={section} />;
    case "estimateCTA":
      return <EstimateCtaBlock section={section} />;
    case "contactCTA":
      return <ContactCtaBlock section={section} />;
    case "stats":
      return <StatsBlock section={section} />;
    case "faq":
      return <FaqBlock section={section} />;
    case "contact":
      return (
        <div className={cn(spacingClass(section.props.sectionSpacing), section.props.backgroundColor || undefined)}>
          <ContactSection site={ctx.resolvedSite} intro shellCopy={section.props as Partial<SectionShellCms>} />
        </div>
      );
    case "contactInfo":
      return <ContactInfoBlock section={section} />;
    case "contactForm":
      return <ContactFormBlock section={section} />;
    case "map":
      return <MapBlock section={section} />;
    case "buttonGroup":
      return <ButtonGroupBlock section={section} />;
    case "timeline":
      return <TimelineBlock section={section} />;
    case "team":
      return <TeamBlock section={section} />;
    case "certifications":
      return <CertificationsBlock section={section} />;
    case "footerColumns":
      return <FooterColumnsBlock section={section} />;
    case "navigationMenu":
      return <NavigationMenuBlock section={section} />;
    case "seoMeta":
      return <SeoMetaBlock section={section} />;
    case "spacer":
      return <SpacerBlock section={section} />;
    case "divider":
      return <DividerBlock section={section} />;
    default:
      return null;
  }
}

function HeroBlock({ section }: { section: Extract<BuilderSection, { type: "hero" }> }) {
  const p = section.props;
  const bg = p.backgroundImageUrl?.trim();
  return (
    <section
      className={cn(
        "relative min-h-[52vh] overflow-hidden",
        spacingClass(p.sectionSpacing),
        p.backgroundColor && !bg ? p.backgroundColor : undefined,
      )}
    >
      {bg ? (
        <>
          <Image src={bg} alt={p.title} fill className="object-cover" sizes="100vw" priority />
          <div
            className="absolute inset-0 hero-overlay-cinematic"
            style={{ opacity: p.overlayOpacity ?? 0.42 }}
            aria-hidden
          />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-sky-700 via-sky-600 to-sky-900" aria-hidden />
      )}
      <div className={cn("relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8", textAlignClass(p.textAlign))}>
        {p.eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">{p.eyebrow}</p>
        ) : null}
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
          {p.title}
        </h1>
        {p.subtitle ? <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">{p.subtitle}</p> : null}
        {p.buttons?.length ? (
          <div className="mt-8 flex flex-wrap gap-3">
            {p.buttons.map((b, i) => (
              <Button
                key={`${b.href}-${i}`}
                asChild
                variant={b.variant === "outline" || b.variant === "ghost" ? b.variant : "default"}
                className="rounded-2xl"
              >
                <Link href={b.href}>{b.label}</Link>
              </Button>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function TextBlock({ section }: { section: Extract<BuilderSection, { type: "text" }> }) {
  const p = section.props;
  return (
    <section className={cn("border-b border-border/50 bg-background", spacingClass(p.sectionSpacing), p.backgroundColor || undefined)}>
      <div className={cn("mx-auto max-w-6xl px-4 sm:px-6 lg:px-8", textAlignClass(p.textAlign))}>
        {p.title ? (
          <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{p.title}</h2>
        ) : null}
        {p.subtitle ? <p className="mt-2 text-sm font-medium text-muted-foreground">{p.subtitle}</p> : null}
        <div className="prose prose-slate mt-4 max-w-3xl dark:prose-invert">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground sm:text-base">{p.body}</p>
        </div>
      </div>
    </section>
  );
}

function ImageTextBlock({ section }: { section: Extract<BuilderSection, { type: "imageText" }> }) {
  const p = section.props;
  const img = p.imageUrl?.trim();
  const imageCol = (
    <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border/70 bg-muted/30">
      {img ? (
        <Image src={img} alt={p.imageAlt || ""} fill className="object-cover" sizes="(min-width: 1024px) 480px, 100vw" />
      ) : (
        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Image URL</div>
      )}
    </div>
  );
  const textCol = (
    <div className={cn(textAlignClass(p.textAlign))}>
      {p.title ? <h2 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">{p.title}</h2> : null}
      {p.body ? (
        <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground sm:text-base">{p.body}</p>
      ) : null}
    </div>
  );
  return (
    <section className={cn("bg-background", spacingClass(p.sectionSpacing), p.backgroundColor || undefined)}>
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        {p.imagePosition === "left" ? (
          <>
            {imageCol}
            {textCol}
          </>
        ) : (
          <>
            {textCol}
            {imageCol}
          </>
        )}
      </div>
    </section>
  );
}

function BlogFeedBlock({
  section,
  blogPosts,
}: {
  section: Extract<BuilderSection, { type: "blogFeed" }>;
  blogPosts: BlogPostSummary[];
}) {
  const p = section.props;
  return (
    <section className={cn("border-b border-border/60 bg-gradient-to-b from-muted/15 to-background", spacingClass(p.sectionSpacing), p.backgroundColor || undefined)}>
      <div className={cn("mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8", textAlignClass(p.textAlign))}>
        {p.eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">{p.eyebrow}</p>
        ) : null}
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-display text-foreground sm:text-4xl">
          {p.title}
        </h2>
        {p.description ? <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">{p.description}</p> : null}
        <div className="mt-10">
          <BlogIndexClient blogPosts={blogPosts} />
        </div>
      </div>
    </section>
  );
}

function CtaBlock({ section }: { section: Extract<BuilderSection, { type: "cta" }> }) {
  const p = section.props;
  return (
    <section
      className={cn(
        "border-t border-border/70 bg-gradient-to-b from-muted/25 via-background to-muted/15",
        spacingClass(p.sectionSpacing),
        p.backgroundColor || undefined,
      )}
    >
      <div className={cn("mx-auto max-w-6xl px-4 sm:px-6 lg:px-8", textAlignClass(p.textAlign))}>
        <div className="glass-panel flex flex-col items-start justify-between gap-8 rounded-3xl border-primary/10 p-6 sm:flex-row sm:items-center sm:p-8">
          <div className="max-w-2xl">
            <h2 className="font-display text-2xl font-semibold tracking-display text-foreground sm:text-3xl">{p.title}</h2>
            {p.description ? <p className="mt-3 text-sm text-muted-foreground sm:text-base">{p.description}</p> : null}
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Button asChild variant="default" className="rounded-2xl">
              <Link href={p.primaryHref}>{p.primaryLabel}</Link>
            </Button>
            {p.secondaryLabel?.trim() ? (
              <Button asChild variant="outline" className="rounded-2xl">
                <Link href={p.secondaryHref || "#"}>{p.secondaryLabel}</Link>
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsBlock({ section }: { section: Extract<BuilderSection, { type: "stats" }> }) {
  const p = section.props;
  return (
    <section className={cn("bg-background", spacingClass(p.sectionSpacing), p.backgroundColor || undefined)}>
      <div className={cn("mx-auto max-w-6xl px-4 sm:px-6 lg:px-8", textAlignClass(p.textAlign))}>
        {p.eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{p.eyebrow}</p> : null}
        <h2 className="mt-2 font-display text-2xl font-semibold text-foreground sm:text-3xl">{p.title}</h2>
        {p.description ? <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{p.description}</p> : null}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {p.items.map((it, i) => (
            <div key={i} className="rounded-2xl border border-border/70 bg-card p-4 text-center shadow-sm">
              <div className="font-display text-2xl font-semibold text-foreground">
                {String(it.value)}
                {it.suffix ? <span className="text-lg text-muted-foreground">{it.suffix}</span> : null}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">{it.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqBlock({ section }: { section: Extract<BuilderSection, { type: "faq" }> }) {
  const p = section.props;
  return (
    <section className={cn("bg-muted/10", spacingClass(p.sectionSpacing), p.backgroundColor || undefined)}>
      <div className={cn("mx-auto max-w-3xl px-4 sm:px-6 lg:px-8", textAlignClass(p.textAlign))}>
        <h2 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">{p.title}</h2>
        {p.description ? <p className="mt-2 text-sm text-muted-foreground">{p.description}</p> : null}
        <div className="mt-8 space-y-3">
          {p.items.map((item, i) => (
            <details key={i} className="group rounded-2xl border border-border/70 bg-card p-4 open:shadow-sm">
              <summary className="cursor-pointer list-none font-semibold text-foreground [&::-webkit-details-marker]:hidden">
                {item.q}
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function MapBlock({ section }: { section: Extract<BuilderSection, { type: "map" }> }) {
  const p = section.props;
  return (
    <div className={cn(spacingClass(p.sectionSpacing), p.backgroundColor || undefined)}>
      <SectionShell intro eyebrow={p.eyebrow} title={p.title} description={p.description}>
        <ServiceAreaMap />
      </SectionShell>
    </div>
  );
}

function ButtonGroupBlock({ section }: { section: Extract<BuilderSection, { type: "buttonGroup" }> }) {
  const p = section.props;
  return (
    <section className={cn("bg-background", spacingClass(p.sectionSpacing), p.backgroundColor || undefined)}>
      <div className={cn("mx-auto max-w-6xl px-4 sm:px-6 lg:px-8", textAlignClass(p.textAlign))}>
        {p.title ? <h2 className="font-display text-xl font-semibold text-foreground sm:text-2xl">{p.title}</h2> : null}
        {p.description ? <p className="mt-2 text-sm text-muted-foreground">{p.description}</p> : null}
        <div className="mt-6 flex flex-wrap gap-3">
          {p.buttons.map((b, i) => (
            <Button key={i} asChild variant={b.variant === "ghost" ? "ghost" : b.variant === "outline" ? "outline" : "accent"} className="rounded-2xl">
              <Link href={b.href}>{b.label}</Link>
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}
