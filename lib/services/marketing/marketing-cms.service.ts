import { cache } from "react";
import { unstable_cache } from "next/cache";
import { CMS_PAGE_KEYS } from "@/lib/cms/marketing-cms-defaults";
import { MARKETING_CMS_TAG } from "@/lib/cms/cache-tags";
import { buildPublicMarketingCmsBundle, type PublicMarketingCmsBundle } from "@/lib/cms/merge-public-marketing-cms";
import { findFooterSectionSingleton } from "@/lib/data/cms/footer-cms.repository";
import { findPageContentByKey } from "@/lib/data/cms/page-content.repository";
import { findSiteSettingsCmsSingleton } from "@/lib/data/cms/site-settings-cms.repository";
import { withRequestTiming } from "@/lib/performance/with-request-timing";
import { logServerRenderError } from "@/lib/server/log-server-render-error";

export type { PublicMarketingCmsBundle };

const fetchPublicMarketingCms = unstable_cache(
  async (): Promise<PublicMarketingCmsBundle> => {
    try {
      const [home, about, contact, coverageMap, servicesLanding, siteSettings, footer] = await Promise.all([
        findPageContentByKey(CMS_PAGE_KEYS.home),
        findPageContentByKey(CMS_PAGE_KEYS.about),
        findPageContentByKey(CMS_PAGE_KEYS.contact),
        findPageContentByKey(CMS_PAGE_KEYS.coverageMap),
        findPageContentByKey(CMS_PAGE_KEYS.servicesLanding),
        findSiteSettingsCmsSingleton(),
        findFooterSectionSingleton(),
      ]);
      return buildPublicMarketingCmsBundle({
        home,
        about,
        contact,
        coverageMap,
        servicesLanding,
        siteSettings,
        footer,
      });
    } catch (error) {
      logServerRenderError("public", "getPublicMarketingCms", error);
      return buildPublicMarketingCmsBundle({
        home: null,
        about: null,
        contact: null,
        coverageMap: null,
        servicesLanding: null,
        siteSettings: null,
        footer: null,
      });
    }
  },
  ["public-marketing-cms-v1"],
  { tags: [MARKETING_CMS_TAG], revalidate: 120 },
);

export const getPublicMarketingCms = cache(async function getPublicMarketingCms(): Promise<PublicMarketingCmsBundle> {
  return withRequestTiming("getPublicMarketingCms", () => fetchPublicMarketingCms());
});
