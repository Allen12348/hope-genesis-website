/**
 * Public services facade.
 * Prefer `@/lib/application/queries` for new code.
 */
export {
  getServices,
  getProjects,
  getTestimonials,
  getHomePageData,
} from "./public-data";
export {
  getPublicMarketingCms,
  type PublicMarketingCmsBundle,
  getResolvedSite,
  getPublicServices,
  getPublicServiceBySlug,
  getPublicProjects,
  getPublicProjectBySlug,
  getPublicGalleryImages,
  getPublicTestimonials,
  getPublicBrandPartners,
  getPublicBlogPostSummaries,
  getPublicBlogBySlug,
  blogCategories,
  blogEditorialCategories,
} from "./marketing";
