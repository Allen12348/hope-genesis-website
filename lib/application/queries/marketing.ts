/**
 * Public marketing read model — cached CMS + published catalog.
 * Implementation: `lib/services/marketing`.
 */
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
} from "@/lib/services/marketing";
