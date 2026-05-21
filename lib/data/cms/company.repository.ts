import { prisma } from "@/lib/db/prisma";

export function findCompanySettingsSingleton() {
  return prisma.companySettings.findUnique({ where: { id: "singleton" } });
}

export function listNavigationItemsOrdered() {
  return prisma.navigationItem.findMany({ orderBy: { sortOrder: "asc" } });
}
