import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { PageCta } from "@/components/layout/page-cta";
import { ContactSection } from "@/components/sections/contact-section";
import { ServiceAreaMap } from "@/components/platform/service-area-map";
import { SectionShell } from "@/components/sections/section-shell";
import { SITE } from "@/constants/site";
import { getResolvedSite, getPublicMarketingCms } from "@/lib/services/marketing";
import { resolveCmsPageMetadata } from "@/lib/seo/resolve-cms-seo";
import { PageBuilderStack } from "@/components/cms/page-builder-stack";
import { CMS_PAGE_KEYS } from "@/lib/cms/marketing-cms-defaults";

export async function generateMetadata(): Promise<Metadata> {
  return resolveCmsPageMetadata("/contact", {
    title: "Contact",
    description: `Contact ${SITE.name} for surveys, quotations, and emergency HVAC & refrigeration support in Laguna and Southern Luzon.`,
    path: "/contact",
  });
}

export default async function ContactPage() {
  const builder = await PageBuilderStack({ pageKey: CMS_PAGE_KEYS.contact });
  if (builder) return builder;

  const [site, cms] = await Promise.all([getResolvedSite(), getPublicMarketingCms()]);
  const c = cms.contactPage;
  return (
    <>
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Contact" },
        ]}
        eyebrow={c.pageHero.eyebrow}
        title={c.pageHero.title}
        description={c.pageHero.description}
      />
      <ContactSection intro={false} site={site} />
      <SectionShell eyebrow={c.mapSection.eyebrow} title={c.mapSection.title} description={c.mapSection.description}>
        <ServiceAreaMap />
      </SectionShell>
      <PageCta />
    </>
  );
}
