"use client";

import type { ReactNode } from "react";
import { FloatingActions } from "@/components/layout/floating-actions";
import { MarketingThemeInitializer } from "@/components/layout/marketing-theme-initializer";
import { MobileStickyCta } from "@/components/layout/mobile-sticky-cta";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import type { FooterCmsPayload } from "@/lib/cms/marketing-cms-defaults";
import type { ResolvedSite } from "@/lib/cms/resolved-site";
import type { PublicMarketingCmsBundle } from "@/lib/cms/merge-public-marketing-cms";
import { MarketingSiteProvider } from "@/components/providers/marketing-site-provider";
import { ThemeBlockingScript } from "@/components/layout/theme-blocking-script";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ErrorBoundary } from "@/components/error-boundary";

type Props = {
  site: ResolvedSite;
  cms: PublicMarketingCmsBundle;
  footerCms: FooterCmsPayload;
  showMobileStickyCta: boolean;
  children: ReactNode;
};

/** Client shell so theme context and marketing providers wrap the public site chrome. */
export function MarketingChrome({ site, cms, footerCms, showMobileStickyCta, children }: Props) {
  return (
    <ThemeProvider defaultTheme={site.defaultTheme}>
      <ThemeBlockingScript defaultTheme={site.defaultTheme} />
      <MarketingSiteProvider value={{ site, cms }}>
        <MarketingThemeInitializer defaultTheme={site.defaultTheme} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:shadow-glass"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main
          id="main"
          className={
            showMobileStickyCta
              ? "min-h-dvh overflow-x-clip pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-0"
              : "min-h-dvh overflow-x-clip"
          }
        >
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
        <SiteFooter site={site} footerCms={footerCms} />
        <FloatingActions />
        {showMobileStickyCta ? <MobileStickyCta /> : null}
      </MarketingSiteProvider>
    </ThemeProvider>
  );
}
