import Link from "next/link";
import { Mail, MapPin, Phone, Snowflake } from "lucide-react";
import type { FooterCmsPayload } from "@/lib/cms/marketing-cms-defaults";
import { DEFAULT_FOOTER_PAYLOAD } from "@/lib/cms/marketing-cms-defaults";
import type { ResolvedSite } from "@/lib/cms/resolved-site";
import { Separator } from "@/components/ui/separator";

export function SiteFooter({
  site,
  footerCms = DEFAULT_FOOTER_PAYLOAD,
}: {
  site: ResolvedSite;
  footerCms?: FooterCmsPayload;
}) {
  const f = footerCms;
  const copyright = f.copyrightTemplate.replace("{year}", String(new Date().getFullYear()));

  return (
    <footer className="relative border-t border-border bg-brand-navy-gradient text-foreground">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent" />
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:gap-14 lg:px-8 lg:py-20">
        <div className="lg:col-span-5">
          <div className="flex items-center gap-3">
            <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm ring-1 ring-primary/15">
              <span className="font-display text-xs font-bold tracking-tight">{f.brandMonogram}</span>
              <Snowflake className="pointer-events-none absolute -right-1 -top-1 h-3.5 w-3.5 text-primary-foreground/90" aria-hidden />
            </span>
            <div>
              <div className="font-display text-base font-semibold tracking-tight text-foreground">{f.brandName}</div>
              <div className="text-sm text-muted-foreground">{f.brandTagline}</div>
            </div>
          </div>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">{f.brandDescription}</p>
          <div className="mt-7 space-y-3 text-sm">
            <div className="flex items-start gap-2 text-muted-foreground">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{site.fullAddress}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4 shrink-0 text-primary" />
              <a className="font-medium text-foreground transition-colors hover:text-primary" href={site.phoneTel}>
                {site.phoneDisplay}
              </a>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <a className="font-medium text-foreground transition-colors hover:text-primary" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </div>
          </div>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:col-span-7 lg:grid-cols-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Quick links</div>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              {site.navLinks.map((l) => (
                <li key={l.href + l.label}>
                  {l.isExternal ? (
                    <a className="transition-colors hover:text-primary" href={l.href} target="_blank" rel="noopener noreferrer">
                      {l.label}
                    </a>
                  ) : (
                    <Link className="transition-colors hover:text-primary" href={l.href}>
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Services</div>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              {f.serviceLinks.map((l) => (
                <li key={l.href}>
                  {l.external ? (
                    <a className="transition-colors hover:text-primary" href={l.href} target="_blank" rel="noopener noreferrer">
                      {l.label}
                    </a>
                  ) : (
                    <Link className="transition-colors hover:text-primary" href={l.href}>
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{f.platformLinksColumnTitle}</div>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              {f.platformLinks.map((l) => (
                <li key={l.href}>
                  {l.external ? (
                    <a className="transition-colors hover:text-primary" href={l.href} target="_blank" rel="noopener noreferrer">
                      {l.label}
                    </a>
                  ) : (
                    <Link className="transition-colors hover:text-primary" href={l.href}>
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
              <li>
                <Link className="transition-colors hover:text-primary" href={f.bookSurveyHref}>
                  {f.bookSurveyLabel}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Company</div>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li>
                <span className="font-semibold text-foreground">{f.companyHoursLabel}</span> {site.hours}
              </li>
              <li>
                <span className="font-semibold text-foreground">Serving:</span> {f.companyServingLine}
              </li>
              <li className="pt-2">
                <div className="flex flex-wrap gap-2">
                  <a
                    className="rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-foreground shadow-sm transition-colors hover:border-primary/40 hover:text-primary"
                    href={site.social.facebook}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Facebook
                  </a>
                  <a
                    className="rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-foreground shadow-sm transition-colors hover:border-primary/40 hover:text-primary"
                    href={site.social.instagram}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Instagram
                  </a>
                  <a
                    className="rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-foreground shadow-sm transition-colors hover:border-primary/40 hover:text-primary"
                    href={site.social.linkedin}
                    rel="noreferrer"
                    target="_blank"
                  >
                    LinkedIn
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Separator className="bg-gradient-to-r from-transparent via-border to-transparent opacity-90" />

      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-4 py-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:px-6 lg:px-8">
        <p>{copyright}</p>
        <p className="text-balance">{f.bottomTagline}</p>
      </div>
    </footer>
  );
}
