import { prisma } from "@/lib/db/prisma";

export function listPublishedGalleryItemsOrdered() {
  return prisma.galleryItem.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });
}

export function listAllGalleryItemsForAdmin() {
  return prisma.galleryItem.findMany({ orderBy: { sortOrder: "asc" } });
}
