"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import type { ActionResult } from "@/lib/actions/types";
import { canManageMedia } from "@/lib/permissions";
import { listMediaAssets } from "@/lib/data/media/media.repository";
import type { MediaFolderId } from "@/lib/domain/media/constants";
import type { MediaAssetDto, MediaListResult } from "@/lib/domain/media/types";
import {
  deleteMediaAssetCommand,
  updateMediaAssetCommand,
} from "@/lib/services/commands/media.commands";
import { mediaDeleteSchema, mediaListQuerySchema, mediaUpdateSchema } from "@/lib/validations/media";

export async function listMediaAssetsAction(input: unknown): Promise<
  | { ok: true; data: MediaListResult }
  | { ok: false; error: string }
> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { ok: false, error: "Unauthorized" };
  if (!canManageMedia(session.user.role)) return { ok: false, error: "Forbidden" };

  const parsed = mediaListQuerySchema.safeParse(input ?? {});
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid query" };

  const { folder, q, limit, offset } = parsed.data;
  try {
    const result = await listMediaAssets({
      folder: folder as MediaFolderId | undefined,
      q,
      limit,
      offset,
    });
    return { ok: true, data: result };
  } catch (error) {
    console.error("[ADMIN_MEDIA_LIST_ERROR]", error);
    return { ok: false, error: "Media library is temporarily unavailable. Please try again." };
  }
}

export async function updateMediaAssetAction(input: unknown): Promise<
  ActionResult & { asset?: MediaAssetDto }
> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { ok: false, error: "Unauthorized" };
  if (!canManageMedia(session.user.role)) return { ok: false, error: "Forbidden" };

  const parsed = mediaUpdateSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const result = await updateMediaAssetCommand(parsed.data.id, {
    alt: parsed.data.alt,
    folder: parsed.data.folder as MediaFolderId | undefined,
  });
  if (result.ok) {
    revalidatePath("/admin/media");
  }
  return result;
}

export async function deleteMediaAssetAction(input: unknown): Promise<ActionResult> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { ok: false, error: "Unauthorized" };
  if (!canManageMedia(session.user.role)) return { ok: false, error: "Forbidden" };

  const parsed = mediaDeleteSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid id" };

  const result = await deleteMediaAssetCommand(parsed.data.id);
  if (result.ok) {
    revalidatePath("/admin/media");
  }
  return result;
}
