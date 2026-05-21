"use client";

import * as React from "react";
import type { ResolvedSite } from "@/lib/cms/resolved-site";
import { mergeCompanySettings } from "@/lib/cms/resolved-site";
import { buildPublicMarketingCmsBundle, type PublicMarketingCmsBundle } from "@/lib/cms/merge-public-marketing-cms";

export type MarketingSiteContextValue = {
  site: ResolvedSite;
  cms: PublicMarketingCmsBundle;
};

const emptyCms = buildPublicMarketingCmsBundle({
  home: null,
  about: null,
  contact: null,
  coverageMap: null,
  servicesLanding: null,
  siteSettings: null,
  footer: null,
});

const Ctx = React.createContext<MarketingSiteContextValue>({
  site: mergeCompanySettings(null, []),
  cms: emptyCms,
});

export function MarketingSiteProvider({
  value,
  children,
}: {
  value: MarketingSiteContextValue;
  children: React.ReactNode;
}) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useMarketingSite(): MarketingSiteContextValue {
  return React.useContext(Ctx);
}
