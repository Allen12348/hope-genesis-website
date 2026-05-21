import { prisma } from "@/lib/db/prisma";

export function listPublishedProjectsOrdered() {
  return prisma.project.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }],
  });
}

export function findPublishedProjectBySlug(slug: string) {
  return prisma.project.findFirst({
    where: { slug, published: true },
    include: {
      testimonial: true,
    },
  });
}

export function listAllProjectsForAdmin() {
  return prisma.project.findMany({ orderBy: { sortOrder: "asc" } });
}
