import { prisma } from "@/lib/db/prisma";

const SINGLETON = "singleton";

export function findFooterSectionSingleton() {
  return prisma.footerSection.findUnique({ where: { id: SINGLETON } });
}

export function upsertFooterSection(payloadJson: string) {
  return prisma.footerSection.upsert({
    where: { id: SINGLETON },
    create: { id: SINGLETON, payloadJson },
    update: { payloadJson },
  });
}
