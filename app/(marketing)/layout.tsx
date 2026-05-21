import type { ReactNode } from "react";

import { MarketingChrome } from "@/components/layout/marketing-chrome";
import { loadMarketingShellSafe } from "@/lib/cms/safe-marketing-shell";

/** SQLite + parallel `next build` SSG workers often hit SQLITE_CANTOPEN (14); render at request time instead. */
export const dynamic = "force-dynamic";

export default async function MarketingLayout({ children }: { children: ReactNode }) {
  const { site, cms } = await loadMarketingShellSafe();



  return (

    <MarketingChrome

      site={site}

      cms={cms}

      footerCms={cms.footer}

      showMobileStickyCta={cms.sectionVisibility.mobileStickyCta !== false}

    >

      {children}

    </MarketingChrome>

  );

}

