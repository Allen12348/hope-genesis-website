import { buildPublicMarketingCmsBundle } from "@/lib/cms/merge-public-marketing-cms";
import type { PublicMarketingCmsBundle } from "@/lib/cms/merge-public-marketing-cms";
import { mergeCompanySettings } from "@/lib/cms/resolved-site";
import type { ResolvedSite } from "@/lib/cms/resolved-site";
import { getPublicMarketingCms, getResolvedSite } from "@/lib/services/marketing";
import { logServerRenderError } from "@/lib/server/log-server-render-error";

export type MarketingShellData = {
  site: ResolvedSite;
  cms: PublicMarketingCmsBundle;
};

const MARKETING_SHELL_FALLBACK: MarketingShellData = {
  site: mergeCompanySettings(null, []),
  cms: buildPublicMarketingCmsBundle({
    home: null,
    about: null,
    contact: null,
    coverageMap: null,
    servicesLanding: null,
    siteSettings: null,
    footer: null,
  }),
};

/** Never throws — falls back to static defaults when CMS/DB is unavailable. */
export async function loadMarketingShellSafe(): Promise<MarketingShellData> {
  try {
    const [site, cms] = await Promise.all([getResolvedSite(), getPublicMarketingCms()]);
    return { site, cms };
  } catch (error) {
    logServerRenderError("marketing-layout", "loadMarketingShellSafe", error);
    return MARKETING_SHELL_FALLBACK;
  }
}
