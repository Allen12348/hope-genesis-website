import { prisma } from "@/lib/db/prisma";

export function listPublishedBrandPartnersOrdered() {
  return prisma.brandPartner.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }],
  });
}

export function listAllBrandPartnersForAdmin() {
  return prisma.brandPartner.findMany({ orderBy: { sortOrder: "asc" } });
}
