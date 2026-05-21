import type { MediaFolderId } from "@/lib/domain/media/constants";
import type { MediaAssetDto } from "@/lib/domain/media/types";
import {
  createMediaAsset,
  deleteMediaAsset,
  findMediaAssetById,
  updateMediaAsset,
} from "@/lib/data/media/media.repository";
import { deleteMediaFilesLocal } from "@/lib/media/storage";
import type { ActionResult } from "@/lib/actions/types";

export async function createMediaAssetCommand(input: {
  id: string;
  folder: MediaFolderId;
  filename: string;
  mimeType: string;
  publicUrl: string;
  thumbnailUrl: string;
  alt: string | null;
  width: number;
  height: number;
  sizeBytes: number;
  thumbSizeBytes: number;
  uploadedById: string;
}): Promise<{ ok: true; asset: MediaAssetDto } | { ok: false; error: string }> {
  try {
    const asset = await createMediaAsset({
      id: input.id,
      folder: input.folder,
      filename: input.filename,
      mimeType: input.mimeType,
      publicUrl: input.publicUrl,
      thumbnailUrl: input.thumbnailUrl,
      alt: input.alt,
      width: input.width,
      height: input.height,
      sizeBytes: input.sizeBytes,
      thumbSizeBytes: input.thumbSizeBytes,
      uploadedBy: { connect: { id: input.uploadedById } },
    });
    return { ok: true, asset };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Could not save media asset" };
  }
}

export async function updateMediaAssetCommand(
  id: string,
  patch: { alt?: string | null; folder?: MediaFolderId },
): Promise<ActionResult & { asset?: MediaAssetDto }> {
  try {
    const asset = await updateMediaAsset(id, patch);
    return { ok: true, asset };
  } catch {
    return { ok: false, error: "Media asset not found" };
  }
}

export async function deleteMediaAssetCommand(id: string): Promise<ActionResult> {
  const row = await findMediaAssetById(id);
  if (!row) return { ok: false, error: "Media asset not found" };

  await deleteMediaFilesLocal(row.publicUrl, row.thumbnailUrl);
  await deleteMediaAsset(id);
  return { ok: true };
}
