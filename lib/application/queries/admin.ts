/**
 * Admin dashboard read model — list queries for entity CRUD pages.
 * All reads go through safe wrappers that never throw to RSC pages.
 */
export {
  getSafeAdminSettingsBundle as getAdminSettingsBundle,
  getSafeProjects as getAdminProjects,
  getSafeServices as getAdminServices,
  getSafeTestimonials as getAdminTestimonials,
  getSafeGalleryItems as getAdminGalleryItems,
  getSafeBrands as getAdminBrandPartners,
  getSafeBlogPosts as getAdminBlogPosts,
  getSafeUsers as getAdminUsers,
  getSafeBookings as getAdminBookings,
  getSafeQuotations as getAdminQuotations,
} from "@/lib/admin/safe-admin-data";
