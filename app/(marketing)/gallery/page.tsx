import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { PageCta } from "@/components/layout/page-cta";
import { GallerySection } from "@/components/sections/gallery-section";
import { SITE } from "@/constants/site";
import { getPublicGalleryImages } from "@/lib/services/marketing";
import { PageBuilderStack } from "@/components/cms/page-builder-stack";
import { CMS_PAGE_KEYS } from "@/lib/cms/marketing-cms-defaults";
import type { GalleryImage } from "@/types";
import { resolveCmsPageMetadata } from "@/lib/seo/resolve-cms-seo";

export async function generateMetadata(): Promise<Metadata> {
  return resolveCmsPageMetadata("/gallery", {
    title: "Gallery",
    description: `Project gallery from ${SITE.name} — commissioning, commercial routing, industrial refrigeration, and premium residential installs.`,
    path: "/gallery",
  });
}

export default async function GalleryPage() {
  const builder = await PageBuilderStack({ pageKey: CMS_PAGE_KEYS.galleryLanding });
  if (builder) return builder;

  const galleryImages = await getPublicGalleryImages().catch((): GalleryImage[] => []);

  return (
    <>
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Gallery" },
        ]}
        eyebrow="Field craft"
        title="Gallery — disciplined execution on real sites"
        description="A curated look at routing, commissioning culture, and finish quality across residential, commercial, and industrial programs."
      />
      <GallerySection intro={false} galleryImages={galleryImages} />
      <PageCta />
    </>
  );
}
