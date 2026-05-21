import type { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { writeAuditLog } from "@/lib/audit";
import { stringifyJsonStringArray, stringifyProjectStatsJson } from "@/lib/data/cms/json-fields";
import { projectUpsertSchema } from "@/lib/validations/cms";
import type { ActionResult } from "@/lib/actions/types";
import { withCommandError } from "@/lib/services/commands/with-command-error";

export type ProjectUpsertInput = z.infer<typeof projectUpsertSchema>;

export async function upsertProjectCommand(actorUserId: string, d: ProjectUpsertInput): Promise<ActionResult> {
  return withCommandError(async () => {
  const data = {
    slug: d.slug,
    title: d.title,
    category: d.category,
    status: d.status ?? "completed",
    location: d.location,
    year: d.year,
    summary: d.summary,
    scope: JSON.stringify(d.scope),
    image: d.image,
    imageUrl: d.imageUrl,
    imageAlt: d.imageAlt,
    beforeImage: d.beforeImage ?? null,
    afterImage: d.afterImage ?? null,
    beforeImageUrl: d.beforeImageUrl,
    afterImageUrl: d.afterImageUrl,
    galleryImageUrls: stringifyJsonStringArray(d.galleryImageUrls),
    equipmentUsed: stringifyJsonStringArray(d.equipmentUsed),
    installationDuration: d.installationDuration || null,
    challenge: d.challenge || null,
    solution: d.solution || null,
    results: stringifyJsonStringArray(d.results),
    published: d.published,
    featured: d.featured ?? false,
    clientLabel: d.clientLabel?.trim() ? d.clientLabel.trim() : null,
    statsJson: stringifyProjectStatsJson(d.stats),
    testimonialId: d.testimonialId,
    ...(d.sortOrder !== undefined ? { sortOrder: d.sortOrder } : {}),
  };

  if (d.id) {
    await prisma.project.update({ where: { id: d.id }, data });
    await writeAuditLog({
      userId: actorUserId,
      action: "update",
      entity: "project",
      entityId: d.id,
      metadata: { slug: d.slug },
    });
  } else {
    const max = await prisma.project.aggregate({ _max: { sortOrder: true } });
    const sortOrder = (max._max.sortOrder ?? -1) + 1;
    const created = await prisma.project.create({ data: { ...data, sortOrder } });
    await writeAuditLog({
      userId: actorUserId,
      action: "create",
      entity: "project",
      entityId: created.id,
      metadata: { slug: d.slug },
    });
  }

  return { ok: true, message: "Project saved" };
  });
}

export async function deleteProjectCommand(actorUserId: string, id: string): Promise<ActionResult> {
  return withCommandError(async () => {
  await prisma.project.delete({ where: { id } });
  await writeAuditLog({
    userId: actorUserId,
    action: "delete",
    entity: "project",
    entityId: id,
  });
  return { ok: true, message: "Project deleted" };
  });
}
