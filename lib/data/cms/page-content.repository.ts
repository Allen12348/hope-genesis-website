import { prisma } from "@/lib/db/prisma";

export function findPageContentByKey(pageKey: string) {
  return prisma.pageContent.findUnique({ where: { pageKey } });
}

export function listAllPageContents() {
  return prisma.pageContent.findMany({ orderBy: { pageKey: "asc" } });
}

export function upsertPageContent(data: {
  pageKey: string;
  publishedData: string;
  draftData?: string | null;
  status?: "DRAFT" | "PUBLISHED";
}) {
  const { pageKey, publishedData, draftData, status } = data;
  return prisma.pageContent.upsert({
    where: { pageKey },
    create: {
      pageKey,
      publishedData,
      draftData: draftData ?? null,
      status: status ?? "PUBLISHED",
    },
    update: {
      publishedData,
      ...(draftData !== undefined ? { draftData } : {}),
      ...(status ? { status } : {}),
    },
  });
}
