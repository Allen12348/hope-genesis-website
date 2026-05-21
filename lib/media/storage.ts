import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import type { MediaFolderId } from "@/lib/domain/media/constants";
import { MEDIA_UPLOAD_PREFIX } from "@/lib/domain/media/constants";

export type StoredMediaFiles = {
  publicUrl: string;
  thumbnailUrl: string;
  storageKey: string;
  thumbStorageKey: string;
};

function extensionForMime(mimeType: string): string {
  return mimeType === "image/webp" ? "webp" : "jpg";
}

function projectRoot(): string {
  return process.cwd();
}

export function buildMediaStorageKeys(folder: MediaFolderId, assetId: string, mimeType: string) {
  const ext = extensionForMime(mimeType);
  const base = `${folder}/${assetId}`;
  return {
    storageKey: `${base}.${ext}`,
    thumbStorageKey: `${base}-thumb.${ext}`,
    publicUrl: `${MEDIA_UPLOAD_PREFIX}/${base}.${ext}`,
    thumbnailUrl: `${MEDIA_UPLOAD_PREFIX}/${base}-thumb.${ext}`,
  };
}

/** Persist optimized blobs to `public/uploads/media/` (Node dev / `next dev` only). */
export async function saveMediaFilesLocal(
  folder: MediaFolderId,
  assetId: string,
  mimeType: string,
  full: Buffer,
  thumb: Buffer,
): Promise<StoredMediaFiles> {
  const keys = buildMediaStorageKeys(folder, assetId, mimeType);
  const dir = path.join(projectRoot(), "public", "uploads", "media", folder);
  await mkdir(dir, { recursive: true });

  const fullPath = path.join(projectRoot(), "public", keys.publicUrl.replace(/^\//, ""));
  const thumbPath = path.join(projectRoot(), "public", keys.thumbnailUrl.replace(/^\//, ""));

  await Promise.all([writeFile(fullPath, full), writeFile(thumbPath, thumb)]);

  return {
    publicUrl: keys.publicUrl,
    thumbnailUrl: keys.thumbnailUrl,
    storageKey: keys.storageKey,
    thumbStorageKey: keys.thumbStorageKey,
  };
}

export async function deleteMediaFilesLocal(publicUrl: string, thumbnailUrl: string | null) {
  const paths = [publicUrl, thumbnailUrl].filter(Boolean) as string[];
  await Promise.all(
    paths.map(async (url) => {
      if (!url.startsWith(MEDIA_UPLOAD_PREFIX)) return;
      const filePath = path.join(projectRoot(), "public", url.replace(/^\//, ""));
      try {
        await unlink(filePath);
      } catch {
        /* file may already be gone */
      }
    }),
  );
}

export function canUseLocalMediaStorage(): boolean {
  return typeof process !== "undefined" && !!process.versions?.node;
}
