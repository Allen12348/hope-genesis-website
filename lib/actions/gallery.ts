"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { canDeleteContent, canManageGallery } from "@/lib/permissions";
import { galleryUpsertSchema, idSchema } from "@/lib/validations/cms";
import type { ActionResult } from "@/lib/actions/types";
import { deleteGalleryItemCommand, upsertGalleryItemCommand } from "@/lib/services/commands/gallery.commands";

export async function upsertGalleryItemAction(input: unknown): Promise<ActionResult> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { ok: false, error: "Unauthorized" };
  if (!canManageGallery(session.user.role)) return { ok: false, error: "Forbidden" };

  const parsed = galleryUpsertSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const result = await upsertGalleryItemCommand(session.user.id, parsed.data);
  if (!result.ok) return result;

  revalidatePath("/");
  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
  return result;
}

export async function deleteGalleryItemAction(input: unknown): Promise<ActionResult> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { ok: false, error: "Unauthorized" };
  if (!canManageGallery(session.user.role)) return { ok: false, error: "Forbidden" };
  if (!canDeleteContent(session.user.role)) return { ok: false, error: "Only administrators can delete content" };

  const parsed = idSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid id" };

  const result = await deleteGalleryItemCommand(session.user.id, parsed.data.id);
  if (!result.ok) return result;

  revalidatePath("/");
  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
  return result;
}
