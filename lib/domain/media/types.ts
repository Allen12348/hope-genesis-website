import type { MediaFolderId } from "@/lib/domain/media/constants";

export type MediaAssetDto = {
  id: string;
  folder: MediaFolderId;
  filename: string;
  mimeType: string;
  publicUrl: string;
  thumbnailUrl: string | null;
  alt: string | null;
  width: number | null;
  height: number | null;
  sizeBytes: number;
  thumbSizeBytes: number | null;
  uploadedById: string | null;
  createdAt: string;
  updatedAt: string;
};

export type MediaListResult = {
  items: MediaAssetDto[];
  total: number;
};
