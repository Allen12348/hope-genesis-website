import {
  buildPageMetadata as buildPageMetadataFn,
  type PageMetaInput,
} from "@/seo/page-metadata";

export type { PageMetaInput };
export const buildPageMetadata = buildPageMetadataFn;
/** Alias for legacy imports — same as `buildPageMetadata`. */
export const pageMeta = buildPageMetadataFn;
