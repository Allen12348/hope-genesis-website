import type { Metadata } from "next";
import { findSeoMetadataByPath } from "@/lib/data/cms/seo-metadata.repository";
import { buildPageMetadata, type PageMetaInput } from "@/seo/page-metadata";

export type CmsSeoDefaults = PageMetaInput;

/** Merges optional `SeoMetadata` row for `pagePath` with static defaults (never throws). */
export async function resolveCmsPageMetadata(pagePath: string, defaults: CmsSeoDefaults): Promise<Metadata> {
  try {
    const row = await findSeoMetadataByPath(pagePath);
    const title = row?.metaTitle?.trim() || defaults.title;
    const description = row?.metaDescription?.trim() || defaults.description;
    const ogImage = row?.ogImageUrl?.trim() || defaults.ogImage;
    const base = buildPageMetadata({
      title,
      description,
      path: defaults.path ?? pagePath,
      ogImage,
      ogType: defaults.ogType,
      publishedTime: defaults.publishedTime,
    });
    const keywords = row?.keywords?.trim();
    const canonical = row?.canonicalUrl?.trim();
    if (!keywords && !canonical) return base;
    return {
      ...base,
      ...(keywords ? { keywords: keywords.split(",").map((k) => k.trim()).filter(Boolean) } : {}),
      ...(canonical ? { alternates: { canonical } } : {}),
    };
  } catch {
    return buildPageMetadata(defaults);
  }
}
