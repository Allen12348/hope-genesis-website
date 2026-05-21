import type { MediaAsset, Prisma } from "@prisma/client";
import type { MediaFolderId } from "@/lib/domain/media/constants";
import type { MediaAssetDto } from "@/lib/domain/media/types";
import { prisma } from "@/lib/db/prisma";

export function mapMediaAsset(row: MediaAsset): MediaAssetDto {
  return {
    id: row.id,
    folder: row.folder as MediaFolderId,
    filename: row.filename,
    mimeType: row.mimeType,
    publicUrl: row.publicUrl,
    thumbnailUrl: row.thumbnailUrl,
    alt: row.alt,
    width: row.width,
    height: row.height,
    sizeBytes: row.sizeBytes,
    thumbSizeBytes: row.thumbSizeBytes,
    uploadedById: row.uploadedById,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function listMediaAssets(params: {
  folder?: MediaFolderId;
  q?: string;
  limit: number;
  offset: number;
}): Promise<{ items: MediaAssetDto[]; total: number }> {
  const where: Prisma.MediaAssetWhereInput = {};
  if (params.folder) where.folder = params.folder;
  if (params.q?.trim()) {
    const q = params.q.trim();
    where.OR = [
      { filename: { contains: q } },
      { alt: { contains: q } },
      { publicUrl: { contains: q } },
    ];
  }

  const [rows, total] = await Promise.all([
    prisma.mediaAsset.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: params.limit,
      skip: params.offset,
    }),
    prisma.mediaAsset.count({ where }),
  ]);

  return { items: rows.map(mapMediaAsset), total };
}

export async function findMediaAssetById(id: string) {
  return prisma.mediaAsset.findUnique({ where: { id } });
}

export async function createMediaAsset(data: Prisma.MediaAssetCreateInput) {
  const row = await prisma.mediaAsset.create({ data });
  return mapMediaAsset(row);
}

export async function updateMediaAsset(id: string, data: Prisma.MediaAssetUpdateInput) {
  const row = await prisma.mediaAsset.update({ where: { id }, data });
  return mapMediaAsset(row);
}

export async function deleteMediaAsset(id: string) {
  return prisma.mediaAsset.delete({ where: { id } });
}
