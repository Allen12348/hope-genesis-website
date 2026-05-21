import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { PageCta } from "@/components/layout/page-cta";
import { ServicesSection } from "@/components/sections/services-section";
import { SubscriptionPlansSection } from "@/components/marketing/subscription-plans-section";
import { SectionShell } from "@/components/sections/section-shell";
import { SITE } from "@/constants/site";
import { getServices } from "@/lib/services";
import { getPublicMarketingCms } from "@/lib/services/marketing";
import { resolveCmsPageMetadata } from "@/lib/seo/resolve-cms-seo";
import { PageBuilderStack } from "@/components/cms/page-builder-stack";
import { CMS_PAGE_KEYS } from "@/lib/cms/marketing-cms-defaults";

export async function generateMetadata(): Promise<Metadata> {
  return resolveCmsPageMetadata("/services", {
    title: "Services",
    description: `Explore ${SITE.name} capabilities — installation, cleaning, HVAC, preventive maintenance, refrigeration, and rapid repair.`,
    path: "/services",
  });
}

export default async function ServicesPage() {
  const builder = await PageBuilderStack({ pageKey: CMS_PAGE_KEYS.servicesLanding });
  if (builder) return builder;

  const [services, cms] = await Promise.all([getServices(), getPublicMarketingCms()]);
  const hero = cms.servicesLanding;
  return (
    <>
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Services" },
        ]}
        eyebrow={hero.eyebrow}
        title={hero.title}
        description={hero.description}
      />
      <ServicesSection intro={false} services={services} />
      <SectionShell
        eyebrow="Lifecycle"
        title="Maintenance subscriptions"
        description="Bundle preventive maintenance, priority response, and reporting — engineered for facilities teams preparing ERP integration."
      >
        <SubscriptionPlansSection />
      </SectionShell>
      <PageCta />
    </>
  );
}
