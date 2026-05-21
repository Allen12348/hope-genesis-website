import type { Metadata } from "next";
import { SITE } from "@/constants/site";
import { HeroSection } from "@/components/sections/hero-section";
import { HomepageSections } from "@/components/home/homepage-sections";
import { HeroImagePreload } from "@/components/marketing/hero-image-preload";
import { resolveHeroBackgroundImageUrl } from "@/lib/cms/hero-display";
import { getHomePageData } from "@/lib/services";
import { getPublicMarketingCms, getResolvedSite } from "@/lib/services/marketing";
import { resolveCmsPageMetadata } from "@/lib/seo/resolve-cms-seo";
import { PageRenderer } from "@/components/cms/page-renderer";
import { extractHomepageBuilderOverlay } from "@/lib/cms/page-builder/home-published-overlay";
import { loadPageBuilderPreviewContext } from "@/lib/cms/page-builder/preview-data";
import { safeFindPageContentByKey } from "@/lib/data/cms/safe-repository";
import { CMS_PAGE_KEYS } from "@/lib/cms/marketing-cms-defaults";
import { selectHomepageServices } from "@/lib/homepage-services";
import { buildPublicMarketingCmsBundle } from "@/lib/cms/merge-public-marketing-cms";
import { mergeCompanySettings } from "@/lib/cms/resolved-site";
import { logServerRenderError } from "@/lib/server/log-server-render-error";
import { getSerializedServicesFallback, getProjectsFallback, getTestimonialsFallback } from "@/mock/serialized-fallback";
import { brands as staticBrands } from "@/data/brands";

export async function generateMetadata(): Promise<Metadata> {
  return resolveCmsPageMetadata("/", {
    title: SITE.name,
    description: SITE.description,
    path: "/",
  });
}

export default async function HomePage() {
  let cms: Awaited<ReturnType<typeof getPublicMarketingCms>>;
  let site: Awaited<ReturnType<typeof getResolvedSite>>;
  let services: Awaited<ReturnType<typeof getHomePageData>>["services"];
  let projects: Awaited<ReturnType<typeof getHomePageData>>["projects"];
  let testimonials: Awaited<ReturnType<typeof getHomePageData>>["testimonials"];
  let brands: Awaited<ReturnType<typeof getHomePageData>>["brands"];
  let homeRow: Awaited<ReturnType<typeof safeFindPageContentByKey>>;
  let builderCtx: Awaited<ReturnType<typeof loadPageBuilderPreviewContext>>;

  try {
    [cms, site, { services, projects, testimonials, brands }, homeRow, builderCtx] = await Promise.all([
      getPublicMarketingCms(),
      getResolvedSite(),
      getHomePageData(),
      safeFindPageContentByKey(CMS_PAGE_KEYS.home),
      loadPageBuilderPreviewContext(),
    ]);
  } catch (error) {
    logServerRenderError("/", "HomePage", error);
    cms = buildPublicMarketingCmsBundle({
      home: null,
      about: null,
      contact: null,
      coverageMap: null,
      servicesLanding: null,
      siteSettings: null,
      footer: null,
    });
    site = mergeCompanySettings(null, []);
    services = getSerializedServicesFallback();
    projects = getProjectsFallback().slice(0, 3);
    testimonials = getTestimonialsFallback();
    brands = staticBrands.map((b) => ({ ...b }));
    homeRow = null;
    builderCtx = {
      services,
      projects,
      galleryImages: [],
      testimonials,
      brands,
      blogPosts: [],
      resolvedSite: site,
    };
  }

  const homepageBuilderOverlay = extractHomepageBuilderOverlay(homeRow?.publishedData ?? null);
  const heroPreloadSrc = resolveHeroBackgroundImageUrl(cms?.home?.hero, site?.heroImageUrl);
  const homepageServices = selectHomepageServices(services ?? []);

  return (
    <>
      <HeroImagePreload href={heroPreloadSrc} />
      <HeroSection />
      <HomepageSections
        cms={cms}
        visibility={cms.sectionVisibility}
        order={cms.homeSectionOrder}
        services={homepageServices}
        projects={projects}
        testimonials={testimonials}
        brands={brands}
      />
      {homepageBuilderOverlay ? <PageRenderer sections={homepageBuilderOverlay.sections} ctx={builderCtx} /> : null}
    </>
  );
}
