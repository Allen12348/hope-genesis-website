import type { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { writeAuditLog } from "@/lib/audit";
import { testimonialUpsertSchema } from "@/lib/validations/cms";
import type { ActionResult } from "@/lib/actions/types";
import { withCommandError } from "@/lib/services/commands/with-command-error";

export type TestimonialUpsertInput = z.infer<typeof testimonialUpsertSchema>;

export async function upsertTestimonialCommand(
  actorUserId: string,
  d: TestimonialUpsertInput,
): Promise<ActionResult> {
  return withCommandError(async () => {
    const data = {
      clientName: d.clientName,
      role: d.role,
      company: d.company,
      review: d.review,
      rating: d.rating,
      imageUrl: d.imageUrl,
      serviceType: d.serviceType,
      featured: d.featured,
      approved: d.approved,
      rejected: d.rejected,
    };

    if (d.id) {
      await prisma.testimonial.update({ where: { id: d.id }, data });
      await writeAuditLog({
        userId: actorUserId,
        action: "update",
        entity: "testimonial",
        entityId: d.id,
      });
    } else {
      const created = await prisma.testimonial.create({
        data: { ...data, source: "ADMIN" },
      });
      await writeAuditLog({
        userId: actorUserId,
        action: "create",
        entity: "testimonial",
        entityId: created.id,
      });
    }

    return { ok: true, message: "Testimonial saved" };
  });
}

export async function toggleTestimonialApprovedCommand(
  actorUserId: string,
  id: string,
): Promise<ActionResult> {
  return withCommandError(async () => {
    const row = await prisma.testimonial.findUnique({ where: { id } });
    if (!row) return { ok: false, error: "Testimonial not found" };

    const nextApproved = !row.approved;
    await prisma.testimonial.update({
      where: { id: row.id },
      data: { approved: nextApproved, ...(nextApproved ? { rejected: false } : {}) },
    });
    await writeAuditLog({
      userId: actorUserId,
      action: "update",
      entity: "testimonial",
      entityId: row.id,
      metadata: { field: "approved", value: nextApproved },
    });

    return { ok: true, message: nextApproved ? "Testimonial approved" : "Testimonial unapproved" };
  });
}

export async function toggleTestimonialFeaturedCommand(
  actorUserId: string,
  id: string,
): Promise<ActionResult> {
  return withCommandError(async () => {
    const row = await prisma.testimonial.findUnique({ where: { id } });
    if (!row) return { ok: false, error: "Testimonial not found" };

    const nextFeatured = !row.featured;
    await prisma.testimonial.update({
      where: { id: row.id },
      data: { featured: nextFeatured },
    });
    await writeAuditLog({
      userId: actorUserId,
      action: "update",
      entity: "testimonial",
      entityId: row.id,
      metadata: { field: "featured", value: nextFeatured },
    });

    return { ok: true, message: nextFeatured ? "Marked as featured" : "Removed from featured" };
  });
}

export async function toggleTestimonialRejectedCommand(actorUserId: string, id: string): Promise<ActionResult> {
  return withCommandError(async () => {
    const row = await prisma.testimonial.findUnique({ where: { id } });
    if (!row) return { ok: false, error: "Testimonial not found" };

    const nextRejected = !row.rejected;
    await prisma.testimonial.update({
      where: { id: row.id },
      data: {
        rejected: nextRejected,
        ...(nextRejected ? { approved: false } : {}),
      },
    });
    await writeAuditLog({
      userId: actorUserId,
      action: "update",
      entity: "testimonial",
      entityId: row.id,
      metadata: { field: "rejected", value: nextRejected },
    });

    return { ok: true, message: nextRejected ? "Testimonial rejected" : "Rejection cleared" };
  });
}

export async function deleteTestimonialCommand(actorUserId: string, id: string): Promise<ActionResult> {
  return withCommandError(async () => {
    await prisma.testimonial.delete({ where: { id } });
    await writeAuditLog({
      userId: actorUserId,
      action: "delete",
      entity: "testimonial",
      entityId: id,
    });
    return { ok: true, message: "Testimonial deleted" };
  });
}
