import type {
  HomePagePublishedV1,
  HomeSectionVisibility,
} from "@/lib/cms/marketing-cms-defaults";
import type { HomeLegacySectionId } from "@/lib/cms/homepage-sections";

/** Stored in `PageContent.draftData` for unified homepage visual editing. */
export const HOMEPAGE_EDITOR_DRAFT_VERSION = 1 as const;

export type HomepageEditorDraft = {
  v: typeof HOMEPAGE_EDITOR_DRAFT_VERSION;
  home: HomePagePublishedV1;
  visibility: HomeSectionVisibility;
  order: HomeLegacySectionId[];
  savedAt?: string;
};

/** All sections in the visual editor canvas (hero + legacy blocks). */
export type HomepageCanvasSectionId = "hero" | HomeLegacySectionId;

export type HomepageEditorState = {
  home: HomePagePublishedV1;
  visibility: HomeSectionVisibility;
  order: HomeLegacySectionId[];
};
