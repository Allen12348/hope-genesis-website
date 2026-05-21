import type { BuilderSection, PageBuilderDocument } from "@/lib/cms/page-builder/schema";
import { validatePageBuilderDocument } from "@/lib/cms/page-builder/schema";
import { safeJsonParse } from "@/lib/utils/safe-json-parse";

/** Canonical CMS page record shape (stored as v2 JSON in PageContent). */
export type CmsBlock = {
  id: string;
  type: string;
  visible: boolean;
  order: number;
  props: Record<string, unknown>;
};

export type CmsPage = {
  pageKey: string;
  version: number;
  draftBlocks: CmsBlock[];
  publishedBlocks: CmsBlock[];
  updatedAt: string;
  publishedAt?: string;
  /** Legacy JSON preserved on migration — never shown in default UI. */
  legacyBackup?: string;
};

export function sectionsToBlocks(sections: BuilderSection[]): CmsBlock[] {
  return sections.map((s) => ({
    id: s.id,
    type: s.type,
    visible: s.visible,
    order: s.order,
    props: s.props as Record<string, unknown>,
  }));
}

export function blocksToSections(blocks: CmsBlock[]): BuilderSection[] {
  return blocks.map((b) => ({
    id: b.id,
    type: b.type,
    visible: b.visible,
    order: b.order,
    props: b.props,
  })) as BuilderSection[];
}

export function documentFromBlocks(blocks: CmsBlock[]): PageBuilderDocument {
  return { v: 2, sections: blocksToSections(blocks) };
}

export function documentToCmsPage(
  pageKey: string,
  doc: PageBuilderDocument,
  meta?: { updatedAt?: string; publishedAt?: string; legacyBackup?: string },
): CmsPage {
  return {
    pageKey,
    version: doc.v,
    draftBlocks: sectionsToBlocks(doc.sections),
    publishedBlocks: sectionsToBlocks(doc.sections),
    updatedAt: meta?.updatedAt ?? new Date().toISOString(),
    publishedAt: meta?.publishedAt,
    legacyBackup: meta?.legacyBackup,
  };
}

export class CmsBlocksValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CmsBlocksValidationError";
  }
}

/** Validates full block array before save — never persist a single block in isolation. */
export function validateBlocksForSave(blocks: unknown, options?: { confirmedReset?: boolean }): BuilderSection[] {
  if (!Array.isArray(blocks)) {
    throw new CmsBlocksValidationError("Invalid CMS blocks");
  }
  if (blocks.length === 0 && !options?.confirmedReset) {
    throw new CmsBlocksValidationError("Cannot save empty CMS page");
  }
  const doc = documentFromBlocks(blocks as CmsBlock[]);
  const parsed = validatePageBuilderDocument(doc);
  if (!parsed.success) {
    throw new CmsBlocksValidationError(parsed.error.issues[0]?.message ?? "Invalid CMS blocks");
  }
  return parsed.data.sections;
}

export function parsePublishedDocument(publishedData: string | null | undefined): PageBuilderDocument | null {
  if (!publishedData?.trim()) return null;
  const raw = safeJsonParse<unknown>(publishedData, null);
  if (raw && typeof raw === "object" && "v" in raw && (raw as { v: number }).v === 2 && "sections" in raw) {
    const r = validatePageBuilderDocument(raw);
    return r.success ? r.data : null;
  }
  return null;
}
