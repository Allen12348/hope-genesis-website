import type { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { writeAuditLog } from "@/lib/audit";
import { brandPartnerUpsertSchema } from "@/lib/validations/cms";
import type { ActionResult } from "@/lib/actions/types";
import { withCommandError } from "@/lib/services/commands/with-command-error";

export type BrandPartnerUpsertInput = z.infer<typeof brandPartnerUpsertSchema>;

export async function upsertBrandPartnerCommand(
  actorUserId: string,
  d: BrandPartnerUpsertInput,
): Promise<ActionResult> {
  return withCommandError(async () => {
    const data = {
      slug: d.slug,
      name: d.name,
      monogram: d.monogram,
      description: d.description?.trim() ? d.description.trim() : null,
      category: d.category ?? "",
      featured: d.featured ?? false,
      imageUrl: d.imageUrl,
      imageAlt: d.imageAlt,
      published: d.published,
    };

    if (d.id) {
      await prisma.brandPartner.update({ where: { id: d.id }, data });
      await writeAuditLog({
        userId: actorUserId,
        action: "update",
        entity: "brand_partner",
        entityId: d.id,
        metadata: { slug: d.slug },
      });
    } else {
      const max = await prisma.brandPartner.aggregate({ _max: { sortOrder: true } });
      const sortOrder = (max._max.sortOrder ?? -1) + 1;
      const created = await prisma.brandPartner.create({ data: { ...data, sortOrder } });
      await writeAuditLog({
        userId: actorUserId,
        action: "create",
        entity: "brand_partner",
        entityId: created.id,
        metadata: { slug: d.slug },
      });
    }

    return { ok: true, message: "Brand saved" };
  });
}

export async function deleteBrandPartnerCommand(actorUserId: string, id: string): Promise<ActionResult> {
  return withCommandError(async () => {
    await prisma.brandPartner.delete({ where: { id } });
    await writeAuditLog({
      userId: actorUserId,
      action: "delete",
      entity: "brand_partner",
      entityId: id,
    });
    return { ok: true, message: "Brand removed" };
  });
}
