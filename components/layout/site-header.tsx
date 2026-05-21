"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { Menu, PhoneCall, Snowflake, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { useMarketingSite } from "@/components/providers/marketing-site-provider";
import { useScrollY } from "@/hooks/use-scroll-y";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import type { ResolvedNavLink } from "@/lib/cms/resolved-site";

function NavAnchor({
  l,
  pathname,
  className,
  onClick,
}: {
  l: ResolvedNavLink;
  pathname: string;
  className?: string;
  onClick?: () => void;
}) {
  const merged = cn("relative", className);
  const active =
    !l.isExternal &&
    (pathname === l.href || (l.href !== "/" && pathname.startsWith(`${l.href}/`)));
  const content = (
    <>
      {l.label}
      <span
        className={cn(
          "pointer-events-none absolute bottom-1 left-3 right-3 h-0.5 rounded-full bg-primary transition-opacity",
          active ? "opacity-100" : "opacity-0",
        )}
        aria-hidden
      />
    </>
  );

  if (l.isExternal) {
    return (
      <a
        href={l.href}
        target="_blank"
        rel="noopener noreferrer"
        className={merged}
        onClick={onClick}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={l.href} className={merged} onClick={onClick}>
      {content}
    </Link>
  );
}

export function SiteHeader() {
  const { site } = useMarketingSite();
  const y = useScrollY();
  const pathname = usePathname();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [open, setOpen] = React.useState(false);
  const reduce = useReducedMotion();
  const [logoBroken, setLogoBroken] = React.useState(false);
  const navLinks = site.navLinks;
  const showImg = Boolean(site.headerLogoImageUrl?.trim()) && !logoBroken;

  React.useEffect(() => {
    if (isDesktop) setOpen(false);
  }, [isDesktop]);

  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  React.useEffect(() => {
    setLogoBroken(false);
  }, [site.headerLogoImageUrl]);

  const scrolled = y > 12;
  const isHome = pathname === "/";
  const overHero = isHome && !scrolled;

  const headerWrap = cn("fixed inset-x-0 top-0 z-50 px-3 pt-2 sm:px-4 sm:pt-2.5 lg:px-6");

  const headerInner = cn(
    "mx-auto max-w-6xl rounded-xl border transition-all duration-300 ease-out lg:max-w-[72rem]",
    overHero
      ? "border-white/15 bg-black/35 shadow-sm backdrop-blur-xl dark:bg-black/45"
      : scrolled
        ? "border-border/45 bg-background/90 shadow-[0_6px_28px_-14px_rgba(15,23,42,0.14)] backdrop-blur-xl dark:border-border/60 dark:bg-background/88"
        : "border-border/35 bg-background/72 shadow-sm backdrop-blur-lg dark:border-border/50 dark:bg-background/75",
  );

  const navDesktopClass = cn(
    "rounded-xl px-3 py-2 text-sm font-semibold transition-colors",
    overHero
      ? "text-white hover:bg-white/10 hover:text-white"
      : "text-foreground/90 hover:bg-sky-500/[0.06] hover:text-primary dark:text-foreground/85 dark:hover:bg-muted/50 dark:hover:text-primary",
  );

  const navMobileClass = cn(
    "rounded-xl px-3 py-3 text-base font-semibold transition-colors",
    overHero
      ? "text-white hover:bg-white/10"
      : "text-foreground hover:bg-muted/80 dark:hover:bg-muted/40",
  );

  const primaryCtaClass = cn(
    "rounded-xl px-4 font-semibold shadow-md shadow-slate-900/8",
    overHero
      ? "bg-sky-400 text-black hover:bg-sky-400/90"
      : "bg-primary text-primary-foreground hover:bg-primary/92",
  );

  const callBtnClass = cn(
    "rounded-xl border-2 font-semibold",
    overHero
      ? "border-white/25 bg-black/45 text-white hover:border-white/30 hover:bg-black/60"
      : "border-slate-300 bg-white/80 text-slate-900 hover:border-sky-400/50 hover:bg-white dark:border-white/20 dark:bg-black/50 dark:text-white dark:hover:border-white/30 dark:hover:bg-black/60",
  );

  const themeToggleClass = cn(
    "h-10 w-10",
    overHero
      ? "border-white/20 bg-black/45 text-white hover:border-white/30 hover:bg-black/60"
      : "border-border/80 bg-background/90 text-foreground hover:border-primary/35 hover:bg-sky-500/[0.08] hover:text-primary dark:border-foreground/20 dark:bg-card/80 dark:hover:bg-primary/10",
  );

  const menuBtnClass = cn(
    "rounded-xl border shadow-sm backdrop-blur",
    overHero
      ? "border-white/20 bg-black/45 text-white hover:bg-black/60"
      : "border-border/80 bg-background/90 text-slate-900 dark:bg-card/80 dark:text-white",
  );

  const primaryCtaHref = site.primaryCtaUrl;
  const primaryCtaIsExternal =
    primaryCtaHref.startsWith("http://") || primaryCtaHref.startsWith("https://");

  return (
    <header className={headerWrap}>
      <div className={headerInner}>
      <div className="flex h-12 items-center justify-between px-3.5 sm:h-[3.25rem] sm:px-4">
        <Link href="/" className="group flex min-w-0 items-center gap-3" onClick={() => setOpen(false)}>
          <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-primary text-primary-foreground shadow-sm ring-1 ring-primary/15">
            {showImg ? (
              <Image
                src={site.headerLogoImageUrl!.trim()}
                alt=""
                fill
                className="object-cover"
                sizes="40px"
                onError={() => setLogoBroken(true)}
              />
            ) : (
              <span className="font-display text-[11px] font-bold leading-none tracking-tight">{site.headerLogoText}</span>
            )}
            <span className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <Snowflake
              className="pointer-events-none absolute -right-1 -top-1 h-3.5 w-3.5 text-primary-foreground/90 opacity-90"
              aria-hidden
            />
          </span>
          <span className="min-w-0 leading-tight">
            <span
              className={cn(
                "block truncate font-display text-sm font-semibold tracking-tight",
                overHero ? "text-white" : "text-foreground",
              )}
            >
              {site.headerCompanyName}
            </span>
            <span
              className={cn(
                "block truncate text-[11px] font-medium leading-snug tracking-tight sm:text-xs",
                overHero ? "text-white/75" : "text-muted-foreground",
              )}
            >
              {site.headerCompanySubtitle}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex">
          {navLinks.map((l) => {
            const active =
              !l.isExternal &&
              (pathname === l.href || (l.href !== "/" && pathname.startsWith(`${l.href}/`)));
            return (
              <NavAnchor
                key={l.href + l.label}
                l={l}
                pathname={pathname}
                className={cn(
                  navDesktopClass,
                  active && (overHero ? "text-sky-300" : "text-primary"),
                )}
              />
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {site.showPrimaryCta ? (
            <Button asChild variant="default" className={cn("hidden rounded-xl md:inline-flex", primaryCtaClass)}>
              {primaryCtaIsExternal ? (
                <a href={primaryCtaHref} target="_blank" rel="noopener noreferrer">
                  {site.primaryCtaLabel}
                </a>
              ) : (
                <Link href={primaryCtaHref}>{site.primaryCtaLabel}</Link>
              )}
            </Button>
          ) : null}
          {site.showThemeToggle !== false ? <ThemeToggle className={themeToggleClass} /> : null}
          {site.showCallButton ? (
            <Button asChild variant="outline" className={cn("hidden rounded-xl lg:inline-flex", callBtnClass)}>
              <a href={site.phoneTel}>
                <PhoneCall className="h-4 w-4" />
                {site.callButtonLabel}
              </a>
            </Button>
          ) : null}

          <Button
            type="button"
            variant="outline"
            size="icon"
            className={cn("lg:hidden", menuBtnClass)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-nav"
            initial={reduce ? false : { opacity: 0, y: -8 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "border-t px-4 py-4 shadow-sm backdrop-blur-2xl lg:hidden rounded-b-2xl",
              overHero
                ? "border-white/15 bg-black/90"
                : "border-border/50 bg-white/[0.97] dark:border-slate-800 dark:bg-slate-900/95",
            )}
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((l) => {
                const active =
                  !l.isExternal &&
                  (pathname === l.href || (l.href !== "/" && pathname.startsWith(`${l.href}/`)));
                return (
                  <NavAnchor
                    key={l.href + l.label}
                    l={l}
                    pathname={pathname}
                    className={cn(
                      navMobileClass,
                      active &&
                        (overHero
                          ? "bg-white/10 text-white ring-1 ring-white/25"
                          : "bg-primary/10 text-foreground ring-1 ring-primary/25 dark:text-foreground"),
                    )}
                    onClick={() => setOpen(false)}
                  />
                );
              })}
              <div className="mt-2 grid grid-cols-2 gap-2">
                {site.showPrimaryCta ? (
                  <Button asChild variant="default" className={cn("rounded-xl", primaryCtaClass)}>
                    {primaryCtaIsExternal ? (
                      <a href={primaryCtaHref} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
                        {site.primaryCtaLabel}
                      </a>
                    ) : (
                      <Link href={primaryCtaHref} onClick={() => setOpen(false)}>
                        {site.primaryCtaLabel}
                      </Link>
                    )}
                  </Button>
                ) : null}
                <Button asChild variant="outline" className="rounded-xl">
                  <Link href="/contact" onClick={() => setOpen(false)}>
                    Get Quote
                  </Link>
                </Button>
                {site.showCallButton ? (
                  <Button asChild variant="outline" className={cn("rounded-xl", callBtnClass)}>
                    <a href={site.phoneTel} onClick={() => setOpen(false)}>
                      {site.callButtonLabel}
                    </a>
                  </Button>
                ) : null}
                <Button asChild variant="outline" className="rounded-xl">
                  <Link href="/contact" onClick={() => setOpen(false)}>
                    Book
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      </div>
    </header>
  );
}
