import { Suspense } from "react";
import type { HomeLegacySectionId } from "@/lib/cms/homepage-sections";
import type { HomeSectionVisibility } from "@/lib/cms/marketing-cms-defaults";
import type { PublicMarketingCmsBundle } from "@/lib/cms/merge-public-marketing-cms";
import { DEFAULT_TESTIMONIALS_DISPLAY } from "@/lib/cms/marketing-cms-defaults";
import type { Brand, Project, SerializedService, Testimonial } from "@/types";
import { HeroServicesStrip } from "@/components/home/hero-services-strip";
import { ServicesPreviewSection } from "@/components/home/services-preview";
import { BusinessTrustSection } from "@/components/home/business-trust-section";
import { InstantEstimateCtaSection } from "@/components/home/instant-estimate-cta";
import { BeforeAfterShowcase } from "@/components/home/before-after-showcase";
import { ProjectsPreviewSection } from "@/components/home/projects-preview";
import { TestimonialsPreviewSection } from "@/components/home/testimonials-preview";
import { ContactCtaSection } from "@/components/home/contact-cta";
import { AboutPreviewSection } from "@/components/home/about-preview";
import { BrandsPreviewSection } from "@/components/home/brands-preview";
import { CustomerPlatformStrip } from "@/components/marketing/customer-platform-strip";
import { SubscriptionPlansSection } from "@/components/marketing/subscription-plans-section";
import { TechnicianShowcase } from "@/components/marketing/technician-showcase";
import { ServiceAreaMap } from "@/components/platform/service-area-map";
import { SectionShell } from "@/components/sections/section-shell";

function SectionFallback() {
  return <div className="h-24 animate-pulse rounded-2xl bg-muted/40" aria-hidden />;
}

type Props = {
  cms: PublicMarketingCmsBundle;
  visibility: HomeSectionVisibility;
  order: HomeLegacySectionId[];
  services: SerializedService[];
  projects: Project[];
  testimonials: Testimonial[];
  brands: Brand[];
};

export function HomepageSections({ cms, visibility: v, order, services, projects, testimonials, brands }: Props) {
  const shells = cms.home.homeSectionShells;
  const testimonialDisplay = cms.home.testimonialsDisplay ?? DEFAULT_TESTIMONIALS_DISPLAY;
  const visibleTestimonials = testimonialDisplay.featuredOnly
    ? testimonials.filter((t) => t.featured)
    : testimonials;

  const renderers: Record<HomeLegacySectionId, React.ReactNode> = {
    heroServicesStrip: v.heroServicesStrip ? (
      <HeroServicesStrip items={cms.home?.heroServicePreview ?? []} />
    ) : null,
    servicesPreview: v.servicesPreview ? (
      <ServicesPreviewSection services={services} shell={shells.servicesPreview} />
    ) : null,
    businessTrust: v.businessTrust ? (
      <BusinessTrustSection shell={shells.businessTrust} data={cms.home?.businessTrust ?? { groups: [] }} />
    ) : null,
    instantEstimateBanner: v.instantEstimateBanner ? <InstantEstimateCtaSection /> : null,
    beforeAfter: v.beforeAfter ? (
      <Suspense fallback={<SectionFallback />}>
        <BeforeAfterShowcase shell={shells.beforeAfter} data={cms.home?.beforeAfter ?? { items: [] }} />
      </Suspense>
    ) : null,
    projectsPreview: v.projectsPreview ? (
      <Suspense fallback={<SectionFallback />}>
        <ProjectsPreviewSection projects={projects} shell={shells.projectsPreview} />
      </Suspense>
    ) : null,
    testimonials:
      v.testimonials && visibleTestimonials.length > 0 ? (
        <Suspense fallback={<SectionFallback />}>
          <TestimonialsPreviewSection
            testimonials={visibleTestimonials}
            shell={shells.testimonialsPreview}
            layout={testimonialDisplay.layout}
          />
        </Suspense>
      ) : null,
    brands:
      v.brands && brands.length > 0 ? (
        <Suspense fallback={<SectionFallback />}>
          <BrandsPreviewSection brands={brands} shell={shells.brandsPreview} />
        </Suspense>
      ) : null,
    aboutPreview: v.aboutPreview ? <AboutPreviewSection copy={cms.home.aboutPreview} /> : null,
    customerPlatformStrip: v.customerPlatformStrip ? (
      <CustomerPlatformStrip copy={cms.home.customerPlatform} />
    ) : null,
    coverageMap: v.coverageMap ? (
      <SectionShell eyebrow={shells.coverage.eyebrow} title={shells.coverage.title} description={shells.coverage.description}>
        <ServiceAreaMap />
      </SectionShell>
    ) : null,
    lifecycleSubscriptions: v.lifecycleSubscriptions ? (
      <SectionShell eyebrow={shells.lifecycle.eyebrow} title={shells.lifecycle.title} description={shells.lifecycle.description}>
        <SubscriptionPlansSection />
      </SectionShell>
    ) : null,
    technicianShowcase: v.technicianShowcase ? (
      <SectionShell eyebrow={shells.people.eyebrow} title={shells.people.title} description={shells.people.description}>
        <TechnicianShowcase />
      </SectionShell>
    ) : null,
    contactCta: v.contactCta ? <ContactCtaSection /> : null,
  };

  return (
    <>
      {order.map((id) => {
        const node = renderers[id];
        if (!node) return null;
        return <div key={id}>{node}</div>;
      })}
    </>
  );
}
