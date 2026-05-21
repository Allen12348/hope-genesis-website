import { prisma } from "@/lib/db/prisma";

export function listPublishedServicesOrdered() {
  return prisma.service.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });
}

export function findPublishedServiceBySlug(slug: string) {
  return prisma.service.findFirst({
    where: { slug, published: true },
  });
}

export function listAllServicesForAdmin() {
  return prisma.service.findMany({ orderBy: { sortOrder: "asc" } });
}
