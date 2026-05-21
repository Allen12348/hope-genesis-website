import type { Metadata } from "next";
import { SITE } from "@/constants/site";
import { DEFAULT_OG_IMAGE, getSiteUrl } from "@/seo/defaults";

export type PageMetaInput = {
  title: string;
  description: string;
  path?: string;
  /** Absolute URL to an image for Open Graph / Twitter (e.g. article or project hero). */
  ogImage?: string;
  ogType?: "website" | "article";
  /** ISO date for `article:published_time` when `ogType` is `article`. */
  publishedTime?: string;
};

/** Consistent page-level SEO for App Router pages (canonical, OG, Twitter). */
export function buildPageMetadata({
  title,
  description,
  path = "",
  ogImage,
  ogType = "website",
  publishedTime,
}: PageMetaInput): Metadata {
  const base = getSiteUrl();
  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;

  const image = ogImage
    ? {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: title,
      }
    : DEFAULT_OG_IMAGE;

  const openGraph: NonNullable<Metadata["openGraph"]> = {
    title: `${title} | ${SITE.name}`,
    description,
    url,
    siteName: SITE.name,
    type: ogType,
    locale: "en_PH",
    images: [image],
    ...(ogType === "article" && publishedTime ? { publishedTime } : {}),
  };

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph,
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE.name}`,
      description,
      images: [image.url],
    },
  };
}
