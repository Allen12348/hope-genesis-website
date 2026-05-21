import { prisma } from "@/lib/db/prisma";

export function findSeoMetadataByPath(pagePath: string) {
  return prisma.seoMetadata.findUnique({ where: { pagePath } });
}

export function listAllSeoMetadata() {
  return prisma.seoMetadata.findMany({ orderBy: { pagePath: "asc" } });
}

export function upsertSeoMetadata(data: {
  pagePath: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogImageUrl?: string | null;
  keywords?: string | null;
  canonicalUrl?: string | null;
}) {
  const d = data;
  return prisma.seoMetadata.upsert({
    where: { pagePath: d.pagePath },
    create: {
      pagePath: d.pagePath,
      metaTitle: d.metaTitle ?? null,
      metaDescription: d.metaDescription ?? null,
      ogImageUrl: d.ogImageUrl ?? null,
      keywords: d.keywords ?? null,
      canonicalUrl: d.canonicalUrl ?? null,
    },
    update: {
      metaTitle: d.metaTitle ?? null,
      metaDescription: d.metaDescription ?? null,
      ogImageUrl: d.ogImageUrl ?? null,
      keywords: d.keywords ?? null,
      canonicalUrl: d.canonicalUrl ?? null,
    },
  });
}
