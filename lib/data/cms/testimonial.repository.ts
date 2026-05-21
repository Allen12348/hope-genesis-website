import { prisma } from "@/lib/db/prisma";

export function listApprovedTestimonialsOrdered() {
  return prisma.testimonial.findMany({
    where: { approved: true, rejected: false },
    orderBy: [{ featured: "desc" }, { updatedAt: "desc" }],
  });
}

export function listAllTestimonialsForAdmin() {
  return prisma.testimonial.findMany({
    orderBy: [{ rejected: "asc" }, { approved: "asc" }, { featured: "desc" }, { updatedAt: "desc" }],
  });
}
