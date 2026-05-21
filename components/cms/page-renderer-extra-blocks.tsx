import Image from "next/image";
import Link from "next/link";
import type { BuilderSection } from "@/lib/cms/page-builder/schema";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function spacingClass(sp: string | undefined) {
  switch (sp) {
    case "compact":
      return "py-10 sm:py-12";
    case "relaxed":
      return "py-20 sm:py-28";
    default:
      return "py-14 sm:py-20";
  }
}

export function textAlignClass(a: string | undefined) {
  if (a === "center") return "text-center";
  if (a === "right") return "text-right";
  return "text-left";
}

export function RichTextBlock({ section }: { section: Extract<BuilderSection, { type: "richText" }> }) {
  const p = section.props;
  return (
    <section className={cn("bg-background", spacingClass(p.sectionSpacing), p.backgroundColor || undefined)}>
      <div className={cn("mx-auto max-w-6xl px-4 sm:px-6 lg:px-8", textAlignClass(p.textAlign))}>
        {p.title ? <h2 className="font-display text-2xl font-semibold text-foreground">{p.title}</h2> : null}
        {p.subtitle ? <p className="mt-2 text-sm text-muted-foreground">{p.subtitle}</p> : null}
        <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{p.body}</p>
      </div>
    </section>
  );
}

export function ImageBlock({ section }: { section: Extract<BuilderSection, { type: "image" }> }) {
  const p = section.props;
  const src = p.imageUrl?.trim();
  return (
    <section className={cn("bg-background", spacingClass(p.sectionSpacing), p.backgroundColor || undefined)}>
      <div className={cn("mx-auto max-w-4xl px-4 sm:px-6", textAlignClass(p.textAlign))}>
        <div className="relative aspect-video overflow-hidden rounded-3xl border border-border/70 bg-muted/30">
          {src ? (
            <Image src={src} alt={p.alt || ""} fill className="object-cover" sizes="(min-width: 768px) 800px, 100vw" />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Add image URL</div>
          )}
        </div>
        {p.caption ? <p className="mt-3 text-sm text-muted-foreground">{p.caption}</p> : null}
      </div>
    </section>
  );
}

export function TwoColumnBlock({ section }: { section: Extract<BuilderSection, { type: "twoColumn" }> }) {
  const p = section.props;
  return (
    <section className={cn("bg-background", spacingClass(p.sectionSpacing), p.backgroundColor || undefined)}>
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          {p.leftTitle ? <h3 className="font-display text-xl font-semibold">{p.leftTitle}</h3> : null}
          {p.leftBody ? <p className="mt-3 whitespace-pre-wrap text-sm text-muted-foreground">{p.leftBody}</p> : null}
        </div>
        <div>
          {p.rightTitle ? <h3 className="font-display text-xl font-semibold">{p.rightTitle}</h3> : null}
          {p.rightBody ? <p className="mt-3 whitespace-pre-wrap text-sm text-muted-foreground">{p.rightBody}</p> : null}
        </div>
      </div>
    </section>
  );
}

export function ServiceCardBlock({ section }: { section: Extract<BuilderSection, { type: "serviceCard" }> }) {
  const p = section.props;
  return (
    <section className={cn("bg-background", spacingClass(p.sectionSpacing), p.backgroundColor || undefined)}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {p.title ? <h2 className="font-display text-2xl font-semibold">{p.title}</h2> : null}
        {p.description ? <p className="mt-2 text-sm text-muted-foreground">{p.description}</p> : null}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {p.cards.map((card, i) => (
            <Link
              key={i}
              href={card.href}
              className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm transition hover:border-accent/40"
            >
              <p className="text-xs font-semibold uppercase text-primary">{card.icon || "Service"}</p>
              <p className="mt-2 font-semibold text-foreground">{card.title}</p>
              {card.description ? <p className="mt-2 text-sm text-muted-foreground">{card.description}</p> : null}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function EstimateCtaBlock({ section }: { section: Extract<BuilderSection, { type: "estimateCTA" }> }) {
  const p = section.props;
  return (
    <section className={cn("bg-muted/15", spacingClass(p.sectionSpacing), p.backgroundColor || undefined)}>
      <div className={cn("mx-auto max-w-6xl px-4 sm:px-6 lg:px-8", textAlignClass(p.textAlign))}>
        <div className="glass-panel rounded-3xl border border-border/70 p-8">
          <h2 className="font-display text-2xl font-semibold">{p.title}</h2>
          {p.description ? <p className="mt-3 text-sm text-muted-foreground">{p.description}</p> : null}
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild className="rounded-2xl">
              <Link href={p.primaryHref}>{p.primaryLabel}</Link>
            </Button>
            {p.secondaryLabel?.trim() ? (
              <Button asChild variant="outline" className="rounded-2xl">
                <Link href={p.secondaryHref || "/contact"}>{p.secondaryLabel}</Link>
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ContactCtaBlock({ section }: { section: Extract<BuilderSection, { type: "contactCTA" }> }) {
  const p = section.props;
  return (
    <section className={cn("bg-background", spacingClass(p.sectionSpacing), p.backgroundColor || undefined)}>
      <div className={cn("mx-auto max-w-6xl px-4 sm:px-6 lg:px-8", textAlignClass(p.textAlign))}>
        <div className="rounded-3xl border border-border/70 bg-card p-8 shadow-sm">
          <h2 className="font-display text-2xl font-semibold">{p.title}</h2>
          {p.description ? <p className="mt-3 text-sm text-muted-foreground">{p.description}</p> : null}
          {p.phone ? <p className="mt-2 text-sm font-semibold">{p.phone}</p> : null}
          <Button asChild className="mt-6 rounded-2xl">
            <Link href={p.primaryHref}>{p.primaryLabel}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export function ContactInfoBlock({ section }: { section: Extract<BuilderSection, { type: "contactInfo" }> }) {
  const p = section.props;
  return (
    <section className={cn("bg-muted/10", spacingClass(p.sectionSpacing), p.backgroundColor || undefined)}>
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <h2 className="font-display text-xl font-semibold">{p.title}</h2>
        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
          {p.phone ? <li>Phone: {p.phone}</li> : null}
          {p.email ? <li>Email: {p.email}</li> : null}
          {p.address ? <li>{p.address}</li> : null}
          {p.hours ? <li>{p.hours}</li> : null}
        </ul>
      </div>
    </section>
  );
}

export function ContactFormBlock({ section }: { section: Extract<BuilderSection, { type: "contactForm" }> }) {
  const p = section.props;
  return (
    <section className={cn("bg-background", spacingClass(p.sectionSpacing), p.backgroundColor || undefined)}>
      <div className="mx-auto max-w-lg px-4 text-center sm:px-6">
        <h2 className="font-display text-xl font-semibold">{p.title}</h2>
        {p.description ? <p className="mt-2 text-sm text-muted-foreground">{p.description}</p> : null}
        <Button asChild className="mt-6 rounded-2xl">
          <Link href="/contact">{p.submitLabel}</Link>
        </Button>
      </div>
    </section>
  );
}

export function TimelineBlock({ section }: { section: Extract<BuilderSection, { type: "timeline" }> }) {
  const p = section.props;
  return (
    <section className={cn("bg-background", spacingClass(p.sectionSpacing), p.backgroundColor || undefined)}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className="font-display text-2xl font-semibold">{p.title}</h2>
        {p.description ? <p className="mt-2 text-sm text-muted-foreground">{p.description}</p> : null}
        <ol className="mt-8 space-y-6 border-l border-border pl-6">
          {p.items.map((item, i) => (
            <li key={i}>
              <p className="text-xs font-bold uppercase text-primary">{item.year}</p>
              <p className="mt-1 font-semibold text-foreground">{item.title}</p>
              {item.description ? <p className="mt-1 text-sm text-muted-foreground">{item.description}</p> : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function TeamBlock({ section }: { section: Extract<BuilderSection, { type: "team" }> }) {
  const p = section.props;
  return (
    <section className={cn("bg-background", spacingClass(p.sectionSpacing), p.backgroundColor || undefined)}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="font-display text-2xl font-semibold">{p.title}</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {p.members.map((m, i) => (
            <div key={i} className="rounded-2xl border border-border/70 bg-card p-4">
              <p className="font-semibold">{m.name}</p>
              {m.role ? <p className="text-xs text-muted-foreground">{m.role}</p> : null}
              {m.bio ? <p className="mt-2 text-sm text-muted-foreground">{m.bio}</p> : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CertificationsBlock({ section }: { section: Extract<BuilderSection, { type: "certifications" }> }) {
  const p = section.props;
  return (
    <section className={cn("bg-muted/10", spacingClass(p.sectionSpacing), p.backgroundColor || undefined)}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="font-display text-2xl font-semibold">{p.title}</h2>
        <div className="mt-8 flex flex-wrap gap-4">
          {p.items.map((item, i) => (
            <div key={i} className="rounded-xl border border-border/70 bg-card px-4 py-3 text-sm font-semibold">
              {item.title}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FooterColumnsBlock({ section }: { section: Extract<BuilderSection, { type: "footerColumns" }> }) {
  const p = section.props;
  return (
    <footer className="border-t border-border/70 bg-muted/20 py-12">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:grid-cols-2 lg:grid-cols-4 sm:px-6">
        {p.columns.map((col, i) => (
          <div key={i}>
            <p className="text-sm font-semibold text-foreground">{col.title}</p>
            <ul className="mt-3 space-y-2">
              {col.links.map((link, j) => (
                <li key={j}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {p.copyright ? <p className="mx-auto mt-8 max-w-6xl px-4 text-center text-xs text-muted-foreground">{p.copyright}</p> : null}
    </footer>
  );
}

export function NavigationMenuBlock({ section }: { section: Extract<BuilderSection, { type: "navigationMenu" }> }) {
  const p = section.props;
  return (
    <header className="border-b border-border/70 bg-background/95 px-4 py-4 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4">
        <span className="font-display text-lg font-semibold">{p.logoText}</span>
        <nav className="flex flex-wrap gap-3">
          {(p.items ?? []).filter((i) => i.visible !== false).map((item, i) => (
            <Link key={i} href={item.href} className="text-sm font-medium text-muted-foreground hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex gap-2">
          <Button asChild size="sm" className="rounded-xl">
            <Link href={p.ctaHref}>{p.ctaLabel}</Link>
          </Button>
          {p.showCallButton ? (
            <Button asChild size="sm" variant="outline" className="rounded-xl">
              <Link href="/contact">{p.callLabel}</Link>
            </Button>
          ) : null}
        </div>
      </div>
    </header>
  );
}

export function SeoMetaBlock({ section }: { section: Extract<BuilderSection, { type: "seoMeta" }> }) {
  const p = section.props;
  return (
    <section className="border border-dashed border-border/70 bg-muted/20 p-6 text-sm">
      <p className="font-semibold text-foreground">SEO preview (admin only)</p>
      <p className="mt-2 text-primary">{p.pageTitle}</p>
      {p.metaDescription ? <p className="text-muted-foreground">{p.metaDescription}</p> : null}
      {p.keywords ? <p className="mt-2 text-xs text-muted-foreground">Keywords: {p.keywords}</p> : null}
    </section>
  );
}

export function SpacerBlock({ section }: { section: Extract<BuilderSection, { type: "spacer" }> }) {
  const h =
    section.props.height === "sm"
      ? "h-8"
      : section.props.height === "lg"
        ? "h-24"
        : section.props.height === "xl"
          ? "h-32"
          : "h-16";
  return <div className={h} aria-hidden />;
}

export function DividerBlock({ section }: { section: Extract<BuilderSection, { type: "divider" }> }) {
  return (
    <hr
      className={cn(
        "mx-auto max-w-6xl border-border/70",
        section.props.style === "dashed" ? "border-dashed" : "border-solid",
      )}
    />
  );
}

