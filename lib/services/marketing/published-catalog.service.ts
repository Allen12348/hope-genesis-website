import { cache } from "react";
import { unstable_cache } from "next/cache";
import { RESOLVED_SITE_TAG } from "@/lib/cms/cache-tags";
import { mergeCompanySettings } from "@/lib/cms/resolved-site";
import { withRequestTiming } from "@/lib/performance/with-request-timing";
import { logServerRenderError } from "@/lib/server/log-server-render-error";
import { iconKeyToLucide } from "@/lib/cms/service-icons";
import { brands as staticBrands } from "@/data/brands";
import { listPublishedBrandPartnersOrdered } from "@/lib/data/cms/brand.repository";
import { findPublishedBlogPostBySlug, listPublishedBlogSummariesOrdered } from "@/lib/data/cms/blog.repository";
import { findCompanySettingsSingleton, listNavigationItemsOrdered } from "@/lib/data/cms/company.repository";
import { listPublishedGalleryItemsOrdered } from "@/lib/data/cms/gallery.repository";
import {
  mapBlogRow,
  mapBlogSummaryRow,
  mapGalleryItem,
  mapProjectRow,
  mapServiceToSerialized,
  mapTestimonialRow,
} from "@/lib/data/cms/mappers";
import { findPublishedProjectBySlug, listPublishedProjectsOrdered } from "@/lib/data/cms/project.repository";
import { findPublishedServiceBySlug, listPublishedServicesOrdered } from "@/lib/data/cms/service.repository";
import { listApprovedTestimonialsOrdered } from "@/lib/data/cms/testimonial.repository";
import type {
  BlogPost,
  BlogPostSummary,
  Brand,
  GalleryImage,
  Project,
  SerializedService,
  Service,
  Testimonial,
} from "@/types";
import { blogCategories, blogEditorialCategories } from "./constants";

export { blogCategories, blogEditorialCategories };

const fetchResolvedSite = unstable_cache(
  async () => {
    try {
      const [row, navItems] = await Promise.all([findCompanySettingsSingleton(), listNavigationItemsOrdered()]);
      return mergeCompanySettings(row, navItems);
    } catch (error) {
      logServerRenderError("public", "getResolvedSite", error);
      return mergeCompanySettings(null, []);
    }
  },
  ["resolved-site-v1"],
  { tags: [RESOLVED_SITE_TAG], revalidate: 120 },
);

export const getResolvedSite = cache(async function getResolvedSite() {
  return withRequestTiming("getCompanySettings", () => fetchResolvedSite());
});

export async function getPublicServices(): Promise<SerializedService[]> {
  try {
    const rows = await listPublishedServicesOrdered();
    return rows.map(mapServiceToSerialized);
  } catch (error) {
    logServerRenderError("public", "getPublicServices", error);
    return [];
  }
}

export const getPublicServiceBySlug = cache(async function getPublicServiceBySlug(
  slug: string,
): Promise<Service | undefined> {
  try {
    const r = await findPublishedServiceBySlug(slug);
    if (!r) return undefined;
    const { iconKey, ...fields } = mapServiceToSerialized(r);
    return {
      ...fields,
      icon: iconKeyToLucide(iconKey),
    };
  } catch (error) {
    logServerRenderError("public", `getPublicServiceBySlug:${slug}`, error);
    return undefined;
  }
});

export async function getPublicProjects(): Promise<Project[]> {
  try {
    const rows = await listPublishedProjectsOrdered();
    return rows.map(mapProjectRow);
  } catch (error) {
    logServerRenderError("public", "getPublicProjects", error);
    return [];
  }
}

export const getPublicProjectBySlug = cache(async function getPublicProjectBySlug(
  slug: string,
): Promise<Project | undefined> {
  try {
    const r = await findPublishedProjectBySlug(slug);
    return r ? mapProjectRow(r) : undefined;
  } catch (error) {
    logServerRenderError("public", `getPublicProjectBySlug:${slug}`, error);
    return undefined;
  }
});

export async function getPublicGalleryImages(): Promise<GalleryImage[]> {
  try {
    const rows = await listPublishedGalleryItemsOrdered();
    return rows.map(mapGalleryItem);
  } catch (error) {
    logServerRenderError("public", "getPublicGalleryImages", error);
    return [];
  }
}

export async function getPublicTestimonials(): Promise<Testimonial[]> {
  try {
    const rows = await listApprovedTestimonialsOrdered();
    return rows.map(mapTestimonialRow);
  } catch (error) {
    logServerRenderError("public", "getPublicTestimonials", error);
    return [];
  }
}

/** Published brand partners from CMS, or static catalog when the table is empty. */
export async function getPublicBrandPartners(): Promise<Brand[]> {
  try {
    const rows = await listPublishedBrandPartnersOrdered();
    if (rows.length > 0) {
      return rows.map((r) => ({
        id: r.slug,
        name: r.name,
        monogram: r.monogram,
        imageUrl: r.imageUrl ?? undefined,
        imageAlt: r.imageAlt ?? undefined,
        featured: r.featured,
      }));
    }
  } catch (error) {
    logServerRenderError("public", "getPublicBrandPartners", error);
  }
  return staticBrands.map((b) => ({ ...b }));
}

/** List / sitemap — excludes `body` to reduce SQLite read size and RSC serialization. */
export async function getPublicBlogPostSummaries(): Promise<BlogPostSummary[]> {
  return withRequestTiming("getBlogPosts", async () => {
    try {
      const rows = await listPublishedBlogSummariesOrdered();
      return rows.map(mapBlogSummaryRow);
    } catch (error) {
      logServerRenderError("public", "getPublicBlogPostSummaries", error);
      return [];
    }
  });
}

export const getPublicBlogBySlug = cache(async function getPublicBlogBySlug(slug: string): Promise<BlogPost | undefined> {
  return withRequestTiming("getPublicBlogBySlug", async () => {
    try {
      const r = await findPublishedBlogPostBySlug(slug);
      return r ? mapBlogRow(r) : undefined;
    } catch (error) {
      logServerRenderError("public", `getPublicBlogBySlug:${slug}`, error);
      return undefined;
    }
  });
});
