import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { SITE } from "@/constants/site";
import { authOptions } from "@/lib/auth/options";
import { buildPublicMarketingCmsBundle } from "@/lib/cms/merge-public-marketing-cms";
import { loadHomepageEditorState, buildPublishedEditorState } from "@/lib/cms/homepage-visual-editor/draft";
import { loadPageBuilderPreviewContext } from "@/lib/cms/page-builder/preview-data";
import {
  getSafeFooterSection,
  getSafePageContentByKey,
  getSafeSiteSettingsCms,
} from "@/lib/admin/safe-admin-data";
import { CMS_PAGE_KEYS } from "@/lib/domain/cms/page-keys";
import { canMutateContent } from "@/lib/permissions";
import { HomepageVisualEditor } from "@/components/admin/homepage-visual-editor/homepage-visual-editor";

export const metadata: Metadata = {
  title: `Homepage visual editor | CMS | Admin | ${SITE.name}`,
  robots: { index: false, follow: false },
};

export default async function AdminHomepageVisualEditorPage() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role ?? "STAFF";

  const [homeRow, siteRow, footerRow, previewCtx] = await Promise.all([
    getSafePageContentByKey(CMS_PAGE_KEYS.home),
    getSafeSiteSettingsCms(),
    getSafeFooterSection(),
    loadPageBuilderPreviewContext(),
  ]);

  const baseCms = buildPublicMarketingCmsBundle({
    home: homeRow,
    about: null,
    contact: null,
    coverageMap: null,
    servicesLanding: null,
    siteSettings: siteRow,
    footer: footerRow,
  });

  const initialState = loadHomepageEditorState(homeRow, siteRow);
  const publishedBaseline = buildPublishedEditorState(homeRow, siteRow);

  return (
    <HomepageVisualEditor
      key={`${homeRow?.updatedAt?.toISOString() ?? "new"}:${siteRow?.updatedAt?.toISOString() ?? "site"}`}
      publishedHomeJson={homeRow?.publishedData?.trim() ?? JSON.stringify(initialState.home)}
      homeRowUpdatedAt={homeRow?.updatedAt?.toISOString() ?? null}
      initialState={initialState}
      publishedBaseline={publishedBaseline}
      baseCms={baseCms}
      previewCtx={previewCtx}
      canEdit={canMutateContent(role)}
    />
  );
}
