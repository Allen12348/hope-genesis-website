import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { PageCta } from "@/components/layout/page-cta";
import { BrandsSection } from "@/components/sections/brands-section";
import { SITE } from "@/constants/site";
import { getPublicBrandPartners } from "@/lib/services/marketing";
import { PageBuilderStack } from "@/components/cms/page-builder-stack";
import { CMS_PAGE_KEYS } from "@/lib/cms/marketing-cms-defaults";
import { resolveCmsPageMetadata } from "@/lib/seo/resolve-cms-seo";

export async function generateMetadata(): Promise<Metadata> {
  return resolveCmsPageMetadata("/brands", {
    title: "Brands & Partners",
    description: `Authorized manufacturer partnerships and dealer-grade execution from ${SITE.name}.`,
    path: "/brands",
  });
}

export default async function BrandsPage() {
  const builder = await PageBuilderStack({ pageKey: CMS_PAGE_KEYS.brandsLanding });
  if (builder) return builder;

  const brands = await getPublicBrandPartners();
  return (
    <>
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Brands" },
        ]}
        eyebrow="Partners"
        title="Trusted brands"
        description="We specify and support leading manufacturers — correct pairing, warranty registration, and long-term parts strategy."
      />
      <BrandsSection intro={false} brands={brands} />
      <PageCta />
    </>
  );
}
