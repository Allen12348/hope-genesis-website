import type { HomepageEditorState } from "@/lib/cms/homepage-visual-editor/types";
import type { PublicMarketingCmsBundle } from "@/lib/cms/merge-public-marketing-cms";
import { buildPublicMarketingCmsBundle } from "@/lib/cms/merge-public-marketing-cms";
import type { PageContent, SiteSettings } from "@prisma/client";
import { serializeSiteLayoutPayload } from "@/lib/cms/homepage-sections";

/** Build a marketing CMS bundle from in-memory editor state for live preview. */
export function buildPreviewCmsBundle(
  state: HomepageEditorState,
  base: PublicMarketingCmsBundle,
): PublicMarketingCmsBundle {
  return {
    ...base,
    home: state.home,
    sectionVisibility: state.visibility,
    homeSectionOrder: state.order,
  };
}

export function editorStateToMockRows(state: HomepageEditorState): {
  home: PageContent;
  siteSettings: SiteSettings;
} {
  const home: PageContent = {
    id: "preview",
    pageKey: "home",
    publishedData: JSON.stringify(state.home),
    draftData: null,
    status: "DRAFT",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const siteSettings: SiteSettings = {
    id: "singleton",
    sectionVisibilityJson: serializeSiteLayoutPayload(state.visibility, state.order),
    floatingActionsJson: "{}",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  return { home, siteSettings };
}

export function buildPreviewBundleFromState(
  state: HomepageEditorState,
  footerRow: Parameters<typeof buildPublicMarketingCmsBundle>[0]["footer"],
): PublicMarketingCmsBundle {
  const { home, siteSettings } = editorStateToMockRows(state);
  return buildPublicMarketingCmsBundle({
    home,
    about: null,
    contact: null,
    coverageMap: null,
    servicesLanding: null,
    siteSettings,
    footer: footerRow,
  });
}
