"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { canDeleteContent, canManageBrands } from "@/lib/permissions";
import { brandPartnerUpsertSchema, idSchema } from "@/lib/validations/cms";
import type { ActionResult } from "@/lib/actions/types";
import { deleteBrandPartnerCommand, upsertBrandPartnerCommand } from "@/lib/services/commands/brand.commands";

export async function upsertBrandPartnerAction(input: unknown): Promise<ActionResult> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { ok: false, error: "Unauthorized" };
  if (!canManageBrands(session.user.role)) return { ok: false, error: "Forbidden" };

  const parsed = brandPartnerUpsertSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const result = await upsertBrandPartnerCommand(session.user.id, parsed.data);
  if (!result.ok) return result;

  revalidatePath("/");
  revalidatePath("/brands");
  revalidatePath("/admin/brands");
  return result;
}

export async function deleteBrandPartnerAction(input: unknown): Promise<ActionResult> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { ok: false, error: "Unauthorized" };
  if (!canManageBrands(session.user.role)) return { ok: false, error: "Forbidden" };
  if (!canDeleteContent(session.user.role)) return { ok: false, error: "Only administrators can delete content" };

  const parsed = idSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid id" };

  const result = await deleteBrandPartnerCommand(session.user.id, parsed.data.id);
  if (!result.ok) return result;

  revalidatePath("/");
  revalidatePath("/brands");
  revalidatePath("/admin/brands");
  return result;
}
