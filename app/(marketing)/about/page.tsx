import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { PageCta } from "@/components/layout/page-cta";
import { AboutSection } from "@/components/sections/about-section";
import { TechnicianShowcase } from "@/components/marketing/technician-showcase";
import { SectionShell } from "@/components/sections/section-shell";
import { SITE } from "@/constants/site";
import { CMS_PAGE_KEYS } from "@/lib/cms/marketing-cms-defaults";
import { getPublicMarketingCms } from "@/lib/services/marketing";
import { resolveCmsPageMetadata } from "@/lib/seo/resolve-cms-seo";
import { PageBuilderStack } from "@/components/cms/page-builder-stack";

export async function generateMetadata(): Promise<Metadata> {
  return resolveCmsPageMetadata("/about", {
    title: "About Us",
    description: `${SITE.name} — mission, vision, and why clients choose our HVAC & refrigeration team in Calamba, Laguna, and Southern Luzon.`,
    path: "/about",
  });
}

export default async function AboutPage() {
  const builder = await PageBuilderStack({ pageKey: CMS_PAGE_KEYS.about });
  if (builder) return builder;

  const cms = await getPublicMarketingCms();
  const a = cms.aboutPage;
  return (
    <>
      <PageHero
        breadcrumbs={[
          { label: a.pageHero.breadcrumbsHomeLabel ?? "Home", href: "/" },
          { label: "About" },
        ]}
        eyebrow={a.pageHero.eyebrow}
        title={a.pageHero.title}
        description={a.pageHero.description}
      />
      <AboutSection intro={false} cms={a} />
      <SectionShell
        eyebrow={a.teamSection.eyebrow}
        title={a.teamSection.title}
        description={a.teamSection.description}
      >
        <TechnicianShowcase />
      </SectionShell>
      <PageCta />
    </>
  );
}
