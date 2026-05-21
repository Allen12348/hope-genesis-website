import type { Metadata } from "next";
import { SITE } from "@/constants/site";
import { DEFAULT_OG_IMAGE, getSiteUrl } from "@/seo/defaults";

const siteUrl = getSiteUrl();

/** Central SEO + Open Graph defaults for the marketing site. */
export const siteRootMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE.name} | ${SITE.shortTagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "HVAC Calamba",
    "air conditioning Laguna",
    "refrigeration Philippines",
    "Daikin dealer",
    "commercial AC",
    "industrial HVAC",
    "HVAC estimate Philippines",
    "aircon installation Laguna",
    "preventive maintenance HVAC",
    "VRF installation Philippines",
    SITE.name,
  ],
  authors: [{ name: SITE.name, url: siteUrl }],
  creator: SITE.name,
  openGraph: {
    type: "website",
    locale: "en_PH",
    url: siteUrl,
    siteName: SITE.name,
    title: `${SITE.name} | ${SITE.shortTagline}`,
    description: SITE.description,
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} | ${SITE.shortTagline}`,
    description: SITE.description,
    images: [DEFAULT_OG_IMAGE.url],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: siteUrl,
  },
  category: "business",
  icons: {
    icon: "/favicon.svg",
  },
};
