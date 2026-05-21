import { z } from "zod";
import { MEDIA_FOLDER_IDS } from "@/lib/domain/media/constants";

export const mediaFolderSchema = z.enum(MEDIA_FOLDER_IDS as [string, ...string[]]);

export const mediaListQuerySchema = z.object({
  folder: mediaFolderSchema.optional(),
  q: z.string().max(120).optional(),
  limit: z.coerce.number().int().min(1).max(200).optional().default(60),
  offset: z.coerce.number().int().min(0).optional().default(0),
});

export const mediaUpdateSchema = z.object({
  id: z.string().min(1),
  alt: z.string().max(500).nullable().optional(),
  folder: mediaFolderSchema.optional(),
});

export const mediaDeleteSchema = z.object({
  id: z.string().min(1),
});
