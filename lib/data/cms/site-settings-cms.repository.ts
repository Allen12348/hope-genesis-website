import { prisma } from "@/lib/db/prisma";

const SINGLETON = "singleton";

export function findSiteSettingsCmsSingleton() {
  return prisma.siteSettings.findUnique({ where: { id: SINGLETON } });
}

export function upsertSiteSettingsCms(data: {
  sectionVisibilityJson?: string | null;
  floatingActionsJson?: string | null;
}) {
  const { sectionVisibilityJson, floatingActionsJson } = data;
  return prisma.siteSettings.upsert({
    where: { id: SINGLETON },
    create: {
      id: SINGLETON,
      sectionVisibilityJson: sectionVisibilityJson ?? null,
      floatingActionsJson: floatingActionsJson ?? null,
    },
    update: {
      ...(sectionVisibilityJson !== undefined ? { sectionVisibilityJson } : {}),
      ...(floatingActionsJson !== undefined ? { floatingActionsJson } : {}),
    },
  });
}
