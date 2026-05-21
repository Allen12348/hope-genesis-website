import { prisma } from "@/lib/db/prisma";

export function listUsersForAdmin() {
  return prisma.user.findMany({
    orderBy: { email: "asc" },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });
}
