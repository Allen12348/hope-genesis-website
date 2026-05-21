"use client";

import * as React from "react";
import Image from "next/image";
import { PhoneCall, Snowflake } from "lucide-react";
import type { ResolvedNavLink } from "@/lib/cms/resolved-site";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type MarketingHeaderPreviewProps = {
  logoText: string;
  logoImageUrl: string;
  companyName: string;
  companySubtitle: string;
  navLinks: ResolvedNavLink[];
  primaryCtaLabel: string;
  showPrimaryCta: boolean;
  callButtonLabel: string;
  showCallButton: boolean;
  showThemeToggle: boolean;
  pathname?: string;
};

export function MarketingHeaderPreview({
  logoText,
  logoImageUrl,
  companyName,
  companySubtitle,
  navLinks,
  primaryCtaLabel,
  showPrimaryCta,
  callButtonLabel,
  showCallButton,
  showThemeToggle,
  pathname = "/",
}: MarketingHeaderPreviewProps) {
  const [logoBroken, setLogoBroken] = React.useState(false);
  const showImg = Boolean(logoImageUrl.trim()) && !logoBroken;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border shadow-sm",
        "bg-white text-slate-900 dark:bg-card dark:text-foreground",
      )}
    >
      <div className="flex h-16 items-center justify-between gap-3 px-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-primary text-primary-foreground shadow-md ring-1 ring-primary/20">
            {showImg ? (
              <Image
                src={logoImageUrl.trim()}
                alt=""
                fill
                className="object-cover"
                sizes="40px"
                onError={() => setLogoBroken(true)}
              />
            ) : (
              <span className="font-display text-[11px] font-bold leading-none tracking-tight">{logoText}</span>
            )}
            <Snowflake
              className="pointer-events-none absolute -right-1 -top-1 h-3.5 w-3.5 text-primary-foreground/90 opacity-90"
              aria-hidden
            />
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate font-display text-sm font-semibold tracking-tight">{companyName}</span>
            <span className="block truncate text-xs font-medium text-slate-600 dark:text-slate-300">{companySubtitle}</span>
          </span>
        </div>
        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 lg:flex">
          {navLinks.length === 0 ? (
            <span className="text-xs text-muted-foreground">No visible links</span>
          ) : (
            navLinks.map((l) => {
              const active =
                !l.isExternal && (pathname === l.href || (l.href !== "/" && pathname.startsWith(`${l.href}/`)));
              const cls = cn(
                "relative truncate rounded-xl px-2 py-2 text-xs font-semibold transition-colors",
                active
                  ? "text-primary"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-muted/60",
              );
              const underline = (
                <span
                  className={cn(
                    "pointer-events-none absolute bottom-1 left-2 right-2 h-0.5 rounded-full bg-primary transition-opacity",
                    active ? "opacity-100" : "opacity-0",
                  )}
                  aria-hidden
                />
              );
              return l.isExternal ? (
                <a key={l.href + l.label} href={l.href} className={cls}>
                  {l.label}
                  {underline}
                </a>
              ) : (
                <span key={l.href + l.label} className={cls}>
                  {l.label}
                  {underline}
                </span>
              );
            })
          )}
        </nav>
        <div className="flex shrink-0 items-center gap-1.5">
          {showPrimaryCta ? (
            <Button size="sm" className="hidden h-8 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground hover:bg-primary/90 md:inline-flex">
              <span className="max-w-[9rem] truncate">{primaryCtaLabel}</span>
            </Button>
          ) : null}
          {showThemeToggle ? (
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-600 dark:text-slate-200" type="button" disabled>
              <span className="text-xs">◐</span>
            </Button>
          ) : null}
          {showCallButton ? (
            <Button size="sm" variant="secondary" className="hidden h-8 rounded-lg border border-primary/35 bg-transparent px-2 text-xs font-semibold text-foreground hover:bg-primary/10 lg:inline-flex">
              <PhoneCall className="h-3.5 w-3.5" />
              <span className="max-w-[5rem] truncate">{callButtonLabel}</span>
            </Button>
          ) : null}
        </div>
      </div>
      <p className="border-t border-border/60 px-4 py-2 text-center text-[10px] text-muted-foreground">
        Preview — desktop nav may clip on narrow panels. Theme toggle is non-functional here.
      </p>
    </div>
  );
}
