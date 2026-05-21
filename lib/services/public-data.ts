import { unstable_cache } from "next/cache";
import { HOME_CATALOG_TAG } from "@/lib/cms/cache-tags";
import { withRequestTiming } from "@/lib/performance/with-request-timing";
import {
  getPublicBrandPartners,
  getPublicProjects,
  getPublicServices,
  getPublicTestimonials,
} from "@/lib/services/marketing";
import {
  getSerializedServicesFallback,
  getProjectsFallback,
  getTestimonialsFallback,
} from "@/mock/serialized-fallback";
import type { Brand, Project, SerializedService, Testimonial } from "@/types";
import { logServerRenderError } from "@/lib/server/log-server-render-error";

/**
 * Public data access layer — use these from pages, sitemap, and future APIs.
 * Prisma is primary; static catalog is used when the DB returns nothing or errors.
 */

export async function getServices(): Promise<SerializedService[]> {
  try {
    const rows = await getPublicServices();
    if (rows.length > 0) return rows;
  } catch (error) {
    logServerRenderError("public", "getServices", error);
  }
  return getSerializedServicesFallback();
}

export async function getProjects(): Promise<Project[]> {
  return withRequestTiming("getProjects", async () => {
    try {
      const rows = await getPublicProjects();
      if (rows.length > 0) return rows;
    } catch (error) {
      logServerRenderError("public", "getProjects", error);
    }
    return getProjectsFallback();
  });
}

const fetchHomePageData = unstable_cache(
  async () => {
    const [services, projects, testimonials, brands] = await Promise.all([
      getServices(),
      getProjects(),
      getTestimonials(),
      getPublicBrandPartners(),
    ]);
    const feat = projects.filter((p) => p.featured);
    const previewPool = feat.length ? feat : projects;
    return {
      services,
      projects: previewPool.slice(0, 3),
      testimonials,
      brands,
    };
  },
  ["home-catalog-v1"],
  { tags: [HOME_CATALOG_TAG], revalidate: 120 },
);

export async function getHomePageData(): Promise<{
  services: SerializedService[];
  projects: Project[];
  testimonials: Testimonial[];
  brands: Brand[];
}> {
  return withRequestTiming("getHomePageData", () => fetchHomePageData());
}

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const rows = await getPublicTestimonials();
    if (rows.length > 0) return rows;
  } catch (error) {
    logServerRenderError("public", "getTestimonials", error);
  }
  return getTestimonialsFallback();
}
