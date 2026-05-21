/**
 * Central safe read helpers for public marketing pages.
 * All functions log server-side and return fallbacks — never throw to RSC.
 */
export {
  getServices as getSafeServices,
  getProjects as getSafeProjects,
  getTestimonials as getSafeTestimonials,
  getHomePageData as getSafeHomePageData,
} from "@/lib/services/public-data";

export { loadMarketingShellSafe as getSafeMarketingShell } from "@/lib/cms/safe-marketing-shell";
export { safeFindPageContentByKey as getSafePageContentByKey } from "@/lib/data/cms/safe-repository";

export {
  getResolvedSite as getSafeResolvedSite,
  getPublicMarketingCms as getSafePublicMarketingCms,
  getPublicServices,
  getPublicProjects,
  getPublicTestimonials,
  getPublicBrandPartners,
  getPublicGalleryImages,
  getPublicBlogPostSummaries,
  getPublicBlogBySlug,
} from "@/lib/services/marketing";
