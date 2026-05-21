import type { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { writeAuditLog } from "@/lib/audit";
import { serviceUpsertSchema } from "@/lib/validations/cms";
import type { ActionResult } from "@/lib/actions/types";
import { withCommandError } from "@/lib/services/commands/with-command-error";

export type ServiceUpsertInput = z.infer<typeof serviceUpsertSchema>;

export async function upsertServiceCommand(actorUserId: string, d: ServiceUpsertInput): Promise<ActionResult> {
  return withCommandError(async () => {
    const data = {
      slug: d.slug,
      title: d.title,
      shortDescription: d.shortDescription,
      description: d.description,
      iconKey: d.iconKey,
      category: d.category ?? "General",
      highlights: JSON.stringify(d.highlights),
      idealFor: JSON.stringify(d.idealFor),
      heroImage: d.heroImage,
      imageUrl: d.imageUrl,
      heroImageAlt: d.heroImageAlt,
      faqJson: d.faq?.length ? JSON.stringify(d.faq) : null,
      pricingNote: d.pricingNote?.trim() ? d.pricingNote.trim() : null,
      seoTitle: d.seoTitle?.trim() ? d.seoTitle.trim() : null,
      seoDescription: d.seoDescription?.trim() ? d.seoDescription.trim() : null,
      published: d.published,
    };

    if (d.id) {
      await prisma.service.update({ where: { id: d.id }, data });
      await writeAuditLog({
        userId: actorUserId,
        action: "update",
        entity: "service",
        entityId: d.id,
        metadata: { slug: d.slug },
      });
    } else {
      const max = await prisma.service.aggregate({ _max: { sortOrder: true } });
      const sortOrder = (max._max.sortOrder ?? -1) + 1;
      const created = await prisma.service.create({ data: { ...data, sortOrder } });
      await writeAuditLog({
        userId: actorUserId,
        action: "create",
        entity: "service",
        entityId: created.id,
        metadata: { slug: d.slug },
      });
    }

    return { ok: true, message: "Service saved" };
  });
}

export async function deleteServiceCommand(actorUserId: string, id: string): Promise<ActionResult> {
  return withCommandError(async () => {
    await prisma.service.delete({ where: { id } });
    await writeAuditLog({
      userId: actorUserId,
      action: "delete",
      entity: "service",
      entityId: id,
    });
    return { ok: true, message: "Service deleted" };
  });
}
