import type { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { writeAuditLog } from "@/lib/audit";
import { galleryUpsertSchema } from "@/lib/validations/cms";
import type { ActionResult } from "@/lib/actions/types";
import { withCommandError } from "@/lib/services/commands/with-command-error";

export type GalleryUpsertInput = z.infer<typeof galleryUpsertSchema>;

export async function upsertGalleryItemCommand(actorUserId: string, d: GalleryUpsertInput): Promise<ActionResult> {
  return withCommandError(async () => {
    const data = {
      src: d.src,
      imageUrl: d.imageUrl,
      alt: d.alt,
      caption: d.caption,
      category: d.category ?? "",
      featured: d.featured ?? false,
      published: d.published,
    };

    if (d.id) {
      await prisma.galleryItem.update({ where: { id: d.id }, data });
      await writeAuditLog({
        userId: actorUserId,
        action: "update",
        entity: "gallery_item",
        entityId: d.id,
      });
    } else {
      const max = await prisma.galleryItem.aggregate({ _max: { sortOrder: true } });
      const sortOrder = (max._max.sortOrder ?? -1) + 1;
      const created = await prisma.galleryItem.create({ data: { ...data, sortOrder } });
      await writeAuditLog({
        userId: actorUserId,
        action: "create",
        entity: "gallery_item",
        entityId: created.id,
      });
    }

    return { ok: true, message: "Gallery item saved" };
  });
}

export async function deleteGalleryItemCommand(actorUserId: string, id: string): Promise<ActionResult> {
  return withCommandError(async () => {
    await prisma.galleryItem.delete({ where: { id } });
    await writeAuditLog({
      userId: actorUserId,
      action: "delete",
      entity: "gallery_item",
      entityId: id,
    });
    return { ok: true, message: "Image removed" };
  });
}
