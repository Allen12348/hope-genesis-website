import type { MetadataRoute } from "next";
import { PRIMARY_SERVICE_SEGMENTS } from "@/constants/routes";
import { isPrimaryServiceDataSlug } from "@/constants/routes";
import { withRequestTiming } from "@/lib/performance/with-request-timing";
import { getPublicBlogPostSummaries } from "@/lib/services/marketing";
import { getProjects, getServices } from "@/lib/services";
import { getSiteUrl } from "@/lib/seo-defaults";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const lastModified = new Date();

  const { services, projects, blogPosts } = await withRequestTiming("sitemap.xml", async () => {
    const [svc, proj, posts] = await Promise.all([
      getServices(),
      getProjects(),
      getPublicBlogPostSummaries(),
    ]);
    return { services: svc, projects: proj, blogPosts: posts };
  });

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/about`, lastModified, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/services`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/gallery`, lastModified, changeFrequency: "monthly", priority: 0.75 },
    { url: `${base}/projects`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    {
      url: `${base}/testimonials`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    { url: `${base}/brands`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/contact`, lastModified, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/estimate`, lastModified, changeFrequency: "monthly", priority: 0.88 },
    { url: `${base}/blog`, lastModified, changeFrequency: "weekly", priority: 0.78 },
    ...PRIMARY_SERVICE_SEGMENTS.map((s) => ({
      url: `${base}/services/${s.segment}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.82,
    })),
  ];

  const otherServices = services
    .filter((s) => !isPrimaryServiceDataSlug(s.slug))
    .map((s) => ({
      url: `${base}/services/${s.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    }));

  const projectPages = projects.map((p) => ({
    url: `${base}/projects/${p.slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));

  const blogPages = blogPosts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...otherServices, ...projectPages, ...blogPages];
}
