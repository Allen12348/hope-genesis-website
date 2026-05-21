"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { canDeleteContent, canManageTestimonials } from "@/lib/permissions";
import { entityIdField } from "@/lib/validations/entity-id";
import { idSchema, testimonialUpsertSchema } from "@/lib/validations/cms";
import type { ActionResult } from "@/lib/actions/types";
import {
  deleteTestimonialCommand,
  toggleTestimonialApprovedCommand,
  toggleTestimonialFeaturedCommand,
  toggleTestimonialRejectedCommand,
  upsertTestimonialCommand,
} from "@/lib/services/commands/testimonial.commands";

const testimonialToggleApprovedSchema = z.object({ id: entityIdField });
const testimonialToggleFeaturedSchema = z.object({ id: entityIdField });

export async function upsertTestimonialAction(input: unknown): Promise<ActionResult> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { ok: false, error: "Unauthorized" };
  if (!canManageTestimonials(session.user.role)) return { ok: false, error: "Forbidden" };

  const parsed = testimonialUpsertSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const result = await upsertTestimonialCommand(session.user.id, parsed.data);
  if (!result.ok) return result;

  revalidatePath("/");
  revalidatePath("/testimonials");
  revalidatePath("/admin/testimonials");
  return result;
}

export async function toggleTestimonialApprovedAction(input: unknown): Promise<ActionResult> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { ok: false, error: "Unauthorized" };
  if (!canManageTestimonials(session.user.role)) return { ok: false, error: "Forbidden" };

  const parsed = testimonialToggleApprovedSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid id" };

  const result = await toggleTestimonialApprovedCommand(session.user.id, parsed.data.id);
  if (!result.ok) return result;

  revalidatePath("/");
  revalidatePath("/testimonials");
  revalidatePath("/admin/testimonials");
  return result;
}

export async function toggleTestimonialFeaturedAction(input: unknown): Promise<ActionResult> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { ok: false, error: "Unauthorized" };
  if (!canManageTestimonials(session.user.role)) return { ok: false, error: "Forbidden" };

  const parsed = testimonialToggleFeaturedSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid id" };

  const result = await toggleTestimonialFeaturedCommand(session.user.id, parsed.data.id);
  if (!result.ok) return result;

  revalidatePath("/");
  revalidatePath("/testimonials");
  revalidatePath("/admin/testimonials");
  return result;
}

export async function toggleTestimonialRejectedAction(input: unknown): Promise<ActionResult> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { ok: false, error: "Unauthorized" };
  if (!canManageTestimonials(session.user.role)) return { ok: false, error: "Forbidden" };

  const parsed = testimonialToggleApprovedSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid id" };

  const result = await toggleTestimonialRejectedCommand(session.user.id, parsed.data.id);
  if (!result.ok) return result;

  revalidatePath("/");
  revalidatePath("/testimonials");
  revalidatePath("/admin/testimonials");
  return result;
}

export async function deleteTestimonialAction(input: unknown): Promise<ActionResult> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { ok: false, error: "Unauthorized" };
  if (!canManageTestimonials(session.user.role)) return { ok: false, error: "Forbidden" };
  if (!canDeleteContent(session.user.role)) return { ok: false, error: "Only administrators can delete content" };

  const parsed = idSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid id" };

  const result = await deleteTestimonialCommand(session.user.id, parsed.data.id);
  if (!result.ok) return result;

  revalidatePath("/");
  revalidatePath("/testimonials");
  revalidatePath("/admin/testimonials");
  return result;
}
