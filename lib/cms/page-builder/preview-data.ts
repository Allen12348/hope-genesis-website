import type { SerializedService } from "@/types";
import type { Project, Testimonial, Brand } from "@/types";
import type { GalleryImage } from "@/types";
import type { ResolvedSite } from "@/lib/cms/resolved-site";
import type { BlogPostSummary } from "@/types";
import { getProjects, getServices, getTestimonials } from "@/lib/services/public-data";
import { getPublicBrandPartners, getPublicBlogPostSummaries, getPublicGalleryImages } from "@/lib/services/marketing";
import { getResolvedSite } from "@/lib/services/marketing";
import { logServerRenderError } from "@/lib/server/log-server-render-error";

export type PageBuilderPreviewContext = {
  services: SerializedService[];
  projects: Project[];
  galleryImages: GalleryImage[];
  testimonials: Testimonial[];
  brands: Brand[];
  blogPosts: BlogPostSummary[];
  resolvedSite: ResolvedSite;
};

export async function loadPageBuilderPreviewContext(): Promise<PageBuilderPreviewContext> {
  try {
    const [services, projects, galleryImages, testimonials, brands, blogPosts, resolvedSite] = await Promise.all([
      getServices(),
      getProjects(),
      getPublicGalleryImages().catch(() => [] as GalleryImage[]),
      getTestimonials(),
      getPublicBrandPartners(),
      getPublicBlogPostSummaries().catch(() => [] as BlogPostSummary[]),
      getResolvedSite(),
    ]);
    return { services, projects, galleryImages, testimonials, brands, blogPosts, resolvedSite };
  } catch (error) {
    logServerRenderError("public", "loadPageBuilderPreviewContext", error);
    const [services, projects, testimonials, resolvedSite] = await Promise.all([
      getServices(),
      getProjects(),
      getTestimonials(),
      getResolvedSite(),
    ]);
    return {
      services,
      projects,
      galleryImages: [],
      testimonials,
      brands: [],
      blogPosts: [],
      resolvedSite,
    };
  }
}
