import {
  DEFAULT_HOME_PAGE_PUBLISHED,
  DEFAULT_SECTION_VISIBILITY,
  type HomePagePublishedV1,
} from "@/lib/cms/marketing-cms-defaults";
import { DEFAULT_HOME_SECTION_ORDER, normalizeHomeSectionOrder } from "@/lib/cms/homepage-sections";
import { mergeHomePagePublished, mergeSectionVisibility, mergeHomeSectionOrder } from "@/lib/cms/merge-public-marketing-cms";
import type { PageContent, SiteSettings } from "@prisma/client";
import {
  HOMEPAGE_EDITOR_DRAFT_VERSION,
  type HomepageEditorDraft,
  type HomepageEditorState,
} from "@/lib/cms/homepage-visual-editor/types";
import { tryParsePageBuilderJson } from "@/lib/cms/page-builder/parse";
import { safeJsonParse } from "@/lib/utils/safe-json-parse";

export function isHomepageEditorDraft(raw: unknown): raw is HomepageEditorDraft {
  if (!raw || typeof raw !== "object") return false;
  const o = raw as HomepageEditorDraft;
  return o.v === HOMEPAGE_EDITOR_DRAFT_VERSION && o.home?.v === 1 && Array.isArray(o.order);
}

export function buildPublishedEditorState(
  homeRow: PageContent | null,
  siteSettings: SiteSettings | null,
): HomepageEditorState {
  return {
    home: mergeHomePagePublished(homeRow),
    visibility: mergeSectionVisibility(siteSettings),
    order: mergeHomeSectionOrder(siteSettings),
  };
}

export function loadHomepageEditorState(
  homeRow: PageContent | null,
  siteSettings: SiteSettings | null,
): HomepageEditorState {
  const published = buildPublishedEditorState(homeRow, siteSettings);
  const draftRaw = homeRow?.draftData?.trim();
  if (!draftRaw) return published;

  const draftParsed = safeJsonParse<unknown>(draftRaw, null);
  if (isHomepageEditorDraft(draftParsed)) {
    return {
      home: mergeHomePagePublished({ ...homeRow, publishedData: JSON.stringify(draftParsed.home) } as PageContent),
      visibility: { ...DEFAULT_SECTION_VISIBILITY, ...draftParsed.visibility },
      order: normalizeHomeSectionOrder(draftParsed.order),
    };
  }

  // Builder v2 draft — visual editor uses published home + layout only
  if (tryParsePageBuilderJson(draftRaw)) return published;

  // Legacy: draft may be full home v1 JSON
  const legacyHome = safeJsonParse<Partial<HomePagePublishedV1> | null>(draftRaw, null);
  if (legacyHome?.v === 1) {
    return {
      ...published,
      home: mergeHomePagePublished({ ...homeRow, publishedData: draftRaw } as PageContent),
    };
  }

  return published;
}

export function serializeHomepageEditorDraft(state: HomepageEditorState): string {
  const draft: HomepageEditorDraft = {
    v: HOMEPAGE_EDITOR_DRAFT_VERSION,
    home: state.home,
    visibility: state.visibility,
    order: state.order,
    savedAt: new Date().toISOString(),
  };
  return JSON.stringify(draft, null, 2);
}

export function canonicalEditorStateJson(state: HomepageEditorState): string {
  return JSON.stringify({
    home: state.home,
    visibility: state.visibility,
    order: state.order,
  });
}

/** Preserve `builderOverlay` when writing home v1 published JSON. */
export function serializeHomePublishedPreservingOverlay(
  publishedDataRaw: string,
  home: HomePagePublishedV1,
): string {
  const parsed = safeJsonParse<unknown>(publishedDataRaw, null);
  if (!parsed || typeof parsed !== "object") {
    return JSON.stringify(home, null, 2);
  }
  const obj = parsed as Record<string, unknown>;
  if (obj.v === 1 && obj.builderOverlay !== undefined) {
    return JSON.stringify({ ...home, builderOverlay: obj.builderOverlay }, null, 2);
  }
  return JSON.stringify(home, null, 2);
}

export function resetEditorToDefaults(): HomepageEditorState {
  return {
    home: structuredClone(DEFAULT_HOME_PAGE_PUBLISHED),
    visibility: { ...DEFAULT_SECTION_VISIBILITY },
    order: [...DEFAULT_HOME_SECTION_ORDER],
  };
}
