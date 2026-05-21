import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { PageCta } from "@/components/layout/page-cta";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { SITE } from "@/constants/site";
import { getTestimonials } from "@/lib/services";
import { PageBuilderStack } from "@/components/cms/page-builder-stack";
import { CMS_PAGE_KEYS } from "@/lib/cms/marketing-cms-defaults";
import { resolveCmsPageMetadata } from "@/lib/seo/resolve-cms-seo";

export async function generateMetadata(): Promise<Metadata> {
  return resolveCmsPageMetadata("/testimonials", {
    title: "Testimonials",
    description: `Client testimonials for ${SITE.name} — facilities teams, plant engineers, and homeowners across Southern Luzon.`,
    path: "/testimonials",
  });
}

export default async function TestimonialsPage() {
  const builder = await PageBuilderStack({ pageKey: CMS_PAGE_KEYS.testimonialsLanding });
  if (builder) return builder;

  const testimonials = await getTestimonials();

  return (
    <>
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Testimonials" },
        ]}
        eyebrow="Client proof"
        title="Trusted where uptime matters"
        description="Facilities teams choose us for disciplined execution, transparent reporting, and rapid response when it counts."
      />
      <TestimonialsSection intro={false} testimonials={testimonials} />
      <PageCta />
    </>
  );
}
