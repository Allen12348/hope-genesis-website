import { prisma } from "@/lib/db/prisma";

const blogSummarySelect = {
  slug: true,
  title: true,
  description: true,
  category: true,
  publishedAt: true,
  readingMinutes: true,
  featured: true,
  coverImage: true,
  coverImageUrl: true,
  coverAlt: true,
} as const;

export function listPublishedBlogSummariesOrdered() {
  return prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    select: blogSummarySelect,
  });
}

export function findPublishedBlogPostBySlug(slug: string) {
  return prisma.blogPost.findFirst({
    where: { slug, published: true },
  });
}

export function listAllBlogPostsForAdmin() {
  return prisma.blogPost.findMany({ orderBy: { publishedAt: "desc" } });
}
