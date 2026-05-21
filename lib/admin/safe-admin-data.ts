import type {
  BlogPost,
  BrandPartner,
  CompanySettings,
  FooterSection,
  GalleryItem,
  NavigationItem,
  PageContent,
  Prisma,
  Project,
  Service,
  SiteSettings,
  Testimonial,
  User,
} from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { mergeCompanySettings, type ResolvedSite } from "@/lib/cms/resolved-site";
import { mergeHomePagePublished } from "@/lib/cms/merge-public-marketing-cms";
import type { HomePagePublishedV1 } from "@/lib/cms/marketing-cms-defaults";
import { withRequestTiming } from "@/lib/performance/with-request-timing";
import { logAdminRenderError } from "@/lib/server/log-admin-render-error";
import type { MediaAssetDto } from "@/lib/domain/media/types";
import {
  ADMIN_SINGLETON_ID,
  defaultAdminDashboardStats,
  EMPTY_ADMIN_LIST,
} from "@/lib/admin/admin-defaults";

function logAdminDataError(source: string, error: unknown, tag = "ADMIN_DATA_ERROR"): void {
  console.error(`[${tag}]`, {
    source,
    error,
    message: error instanceof Error ? error.message : String(error),
  });
}

export type AdminHomeTestimonialRow = {
  id: string;
  clientName: string;
  approved: boolean;
  rating: number;
  createdAt: Date;
};

export type AdminHomeProjectRow = {
  id: string;
  title: string;
  slug: string;
  category: string;
  published: boolean;
  image: string | null;
  imageUrl: string | null;
  updatedAt: Date;
};

export type AdminDashboardHomePayload = {
  publishedProjects: number;
  approvedTestimonials: number;
  recentLogs: Prisma.AuditLogGetPayload<{
    include: { user: { select: { email: true; name: true } } };
  }>[];
  metrics: {
    totalProjects: number;
    unpublishedProjects: number;
    pendingTestimonials: number;
    galleryItems: number;
    brandPartners: number;
    draftBlogPosts: number;
    totalServices: number;
  };
  recentTestimonials: AdminHomeTestimonialRow[];
  pendingTestimonialRows: AdminHomeTestimonialRow[];
  recentProjects: AdminHomeProjectRow[];
  partialError?: boolean;
};

const EMPTY_ADMIN_DASHBOARD: AdminDashboardHomePayload = {
  publishedProjects: 0,
  approvedTestimonials: 0,
  recentLogs: [],
  metrics: { ...defaultAdminDashboardStats },
  recentTestimonials: [],
  pendingTestimonialRows: [],
  recentProjects: [],
  partialError: true,
};

export async function getSafeCompanySettings(): Promise<CompanySettings | null> {
  try {
    return await prisma.companySettings.findUnique({ where: { id: ADMIN_SINGLETON_ID } });
  } catch (error) {
    logAdminDataError("getSafeCompanySettings", error, "ADMIN_SETTINGS_ERROR");
    return null;
  }
}

export async function getSafeNavigationItems(): Promise<NavigationItem[]> {
  try {
    return await prisma.navigationItem.findMany({ orderBy: { sortOrder: "asc" } });
  } catch (error) {
    logAdminDataError("getSafeNavigationItems", error);
    return [];
  }
}

export async function getSafeResolvedSite(): Promise<ResolvedSite> {
  try {
    const [company, navItems] = await Promise.all([getSafeCompanySettings(), getSafeNavigationItems()]);
    return mergeCompanySettings(company, navItems);
  } catch (error) {
    logAdminDataError("getSafeResolvedSite", error);
    return mergeCompanySettings(null, []);
  }
}

export async function getSafePageContentByKey(pageKey: string): Promise<PageContent | null> {
  try {
    return await prisma.pageContent.findUnique({ where: { pageKey } });
  } catch (error) {
    logAdminDataError(`getSafePageContentByKey:${pageKey}`, error);
    return null;
  }
}

export async function getSafeAllPageContents(): Promise<PageContent[]> {
  try {
    return await prisma.pageContent.findMany({ orderBy: { pageKey: "asc" } });
  } catch (error) {
    logAdminDataError("getSafeAllPageContents", error);
    return [];
  }
}

export async function getSafeHomepageContent(): Promise<HomePagePublishedV1> {
  const row = await getSafePageContentByKey("home");
  return mergeHomePagePublished(row);
}

export async function getSafeSiteSettingsCms(): Promise<SiteSettings | null> {
  try {
    return await prisma.siteSettings.findUnique({ where: { id: ADMIN_SINGLETON_ID } });
  } catch (error) {
    logAdminDataError("getSafeSiteSettingsCms", error);
    return null;
  }
}

export async function getSafeFooterSection(): Promise<FooterSection | null> {
  try {
    return await prisma.footerSection.findUnique({ where: { id: ADMIN_SINGLETON_ID } });
  } catch (error) {
    logAdminDataError("getSafeFooterSection", error);
    return null;
  }
}

export async function getSafeServices(): Promise<Service[]> {
  try {
    return await prisma.service.findMany({ orderBy: { sortOrder: "asc" } });
  } catch (error) {
    logAdminDataError("getSafeServices", error);
    return [];
  }
}

export async function getSafeProjects(): Promise<Project[]> {
  try {
    return await prisma.project.findMany({ orderBy: { sortOrder: "asc" } });
  } catch (error) {
    logAdminDataError("getSafeProjects", error, "ADMIN_PROJECTS_ERROR");
    return [];
  }
}

export async function getSafeGalleryItems(): Promise<GalleryItem[]> {
  try {
    return await prisma.galleryItem.findMany({ orderBy: { sortOrder: "asc" } });
  } catch (error) {
    logAdminDataError("getSafeGalleryItems", error);
    return [];
  }
}

export async function getSafeBrands(): Promise<BrandPartner[]> {
  try {
    return await prisma.brandPartner.findMany({ orderBy: { sortOrder: "asc" } });
  } catch (error) {
    logAdminDataError("getSafeBrands", error);
    return [];
  }
}

export async function getSafeTestimonials(): Promise<Testimonial[]> {
  try {
    return await prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } });
  } catch (error) {
    logAdminDataError("getSafeTestimonials", error);
    return [];
  }
}

export async function getSafeBlogPosts(): Promise<BlogPost[]> {
  try {
    return await prisma.blogPost.findMany({ orderBy: { updatedAt: "desc" } });
  } catch (error) {
    logAdminDataError("getSafeBlogPosts", error, "ADMIN_BLOG_ERROR");
    return [];
  }
}

/** Bookings / quotations are not in the current schema — safe no-op for future routes. */
export async function getSafeBookings(): Promise<typeof EMPTY_ADMIN_LIST> {
  return [];
}

export async function getSafeQuotations(): Promise<typeof EMPTY_ADMIN_LIST> {
  return [];
}

export async function getSafeUsers(): Promise<
  Pick<User, "id" | "email" | "name" | "role" | "createdAt">[]
> {
  try {
    return await prisma.user.findMany({
      orderBy: { email: "asc" },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });
  } catch (error) {
    logAdminDataError("getSafeUsers", error, "ADMIN_USERS_ERROR");
    return [];
  }
}

export async function getSafeMediaItems(limit = 120): Promise<{ items: MediaAssetDto[]; total: number }> {
  try {
    const [rows, total] = await Promise.all([
      prisma.mediaAsset.findMany({
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: 0,
      }),
      prisma.mediaAsset.count(),
    ]);
    return {
      items: rows.map((row) => ({
        id: row.id,
        folder: row.folder as MediaAssetDto["folder"],
        filename: row.filename,
        mimeType: row.mimeType,
        publicUrl: row.publicUrl,
        thumbnailUrl: row.thumbnailUrl,
        alt: row.alt,
        width: row.width,
        height: row.height,
        sizeBytes: row.sizeBytes,
        thumbSizeBytes: row.thumbSizeBytes,
        uploadedById: row.uploadedById,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
      })),
      total,
    };
  } catch (error) {
    logAdminDataError("getSafeMediaItems", error);
    return { items: [], total: 0 };
  }
}

export async function getSafeAdminSettingsBundle(): Promise<{
  company: CompanySettings | null;
  users: Pick<User, "id" | "email" | "name" | "role" | "createdAt">[];
  navItems: NavigationItem[];
  defaults: ResolvedSite;
}> {
  const [company, users, navItems] = await Promise.all([
    getSafeCompanySettings(),
    getSafeUsers(),
    getSafeNavigationItems(),
  ]);
  const defaults = mergeCompanySettings(company, navItems);
  return { company, users, navItems, defaults };
}

/** Bootstrap navigation from static defaults when the table is empty — never throws. */
export async function safeEnsureNavigationSeeded(): Promise<void> {
  try {
    const count = await prisma.navigationItem.count();
    if (count > 0) return;
    const { defaultNavigationSeed } = await import("@/lib/admin/admin-defaults");
    for (const item of defaultNavigationSeed) {
      await prisma.navigationItem.create({ data: item });
    }
  } catch (error) {
    logAdminDataError("safeEnsureNavigationSeeded", error);
  }
}

export async function getSafeAdminDashboardData(): Promise<AdminDashboardHomePayload> {
  return withRequestTiming("getSafeAdminDashboardData", async () => {
    try {
      const [
        publishedProjects,
        approvedTestimonials,
        recentLogs,
        totalProjects,
        unpublishedProjects,
        pendingTestimonials,
        galleryItems,
        brandPartners,
        draftBlogPosts,
        totalServices,
        recentTestimonials,
        pendingTestimonialRows,
        recentProjects,
      ] = await Promise.all([
        prisma.project.count({ where: { published: true } }),
        prisma.testimonial.count({ where: { approved: true } }),
        prisma.auditLog.findMany({
          take: 20,
          orderBy: { createdAt: "desc" },
          include: { user: { select: { email: true, name: true } } },
        }),
        prisma.project.count(),
        prisma.project.count({ where: { published: false } }),
        prisma.testimonial.count({ where: { approved: false, rejected: false } }),
        prisma.galleryItem.count(),
        prisma.brandPartner.count(),
        prisma.blogPost.count({ where: { published: false } }),
        prisma.service.count(),
        prisma.testimonial.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            clientName: true,
            approved: true,
            rating: true,
            createdAt: true,
          },
        }),
        prisma.testimonial.findMany({
          where: { approved: false, rejected: false },
          take: 6,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            clientName: true,
            approved: true,
            rating: true,
            createdAt: true,
          },
        }),
        prisma.project.findMany({
          take: 8,
          orderBy: { updatedAt: "desc" },
          select: {
            id: true,
            title: true,
            slug: true,
            category: true,
            published: true,
            image: true,
            imageUrl: true,
            updatedAt: true,
          },
        }),
      ]);

      return {
        publishedProjects,
        approvedTestimonials,
        recentLogs: recentLogs as AdminDashboardHomePayload["recentLogs"],
        metrics: {
          totalProjects,
          unpublishedProjects,
          pendingTestimonials,
          galleryItems,
          brandPartners,
          draftBlogPosts,
          totalServices,
        },
        recentTestimonials,
        pendingTestimonialRows,
        recentProjects,
      };
    } catch (error) {
      logAdminRenderError("getSafeAdminDashboardData", error);
      return EMPTY_ADMIN_DASHBOARD;
    }
  });
}

/** Ensures company singleton exists for admin saves — safe, logs only. */
export async function safeEnsureCompanySettingsRow(): Promise<CompanySettings | null> {
  try {
    const existing = await prisma.companySettings.findUnique({ where: { id: ADMIN_SINGLETON_ID } });
    if (existing) return existing;
    const { companySettingsUpsertCreate } = await import("@/lib/admin/admin-defaults");
    return await prisma.companySettings.create({ data: companySettingsUpsertCreate() });
  } catch (error) {
    logAdminDataError("safeEnsureCompanySettingsRow", error, "ADMIN_SETTINGS_ERROR");
    return null;
  }
}

export { defaultCompanySettings } from "@/lib/admin/admin-defaults";
