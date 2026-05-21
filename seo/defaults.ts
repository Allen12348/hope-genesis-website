import { SITE } from "@/constants/site";

/** Canonical site origin for metadata, JSON-LD, and sitemap. */
export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "https://hopegenesisenterprises.com"
  );
}

/** Default Open Graph / Twitter image when a page has no custom hero image. */
export const DEFAULT_OG_IMAGE = {
  url: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1200&h=630&q=80",
  width: 1200,
  height: 630,
  alt: `${SITE.name} — HVAC & refrigeration`,
} as const;
