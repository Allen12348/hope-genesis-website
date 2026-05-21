"use server";

import { revalidatePath } from "next/cache";
import { revalidateMarketingCaches } from "@/lib/cms/revalidate-marketing";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { canDeleteContent, canManageServices } from "@/lib/permissions";
import { idSchema, serviceUpsertSchema } from "@/lib/validations/cms";
import type { ActionResult } from "@/lib/actions/types";
import { deleteServiceCommand, upsertServiceCommand } from "@/lib/services/commands/service.commands";

export async function upsertServiceAction(input: unknown): Promise<ActionResult> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { ok: false, error: "Unauthorized" };
  if (!canManageServices(session.user.role)) return { ok: false, error: "Forbidden" };

  const parsed = serviceUpsertSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const result = await upsertServiceCommand(session.user.id, parsed.data);
  if (!result.ok) return result;

  revalidateMarketingCaches({ cms: false, site: false });
  revalidatePath("/");
  revalidatePath("/services");
  revalidatePath("/services/[slug]", "page");
  revalidatePath("/admin/services");
  return result;
}

export async function deleteServiceAction(input: unknown): Promise<ActionResult> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { ok: false, error: "Unauthorized" };
  if (!canManageServices(session.user.role)) return { ok: false, error: "Forbidden" };
  if (!canDeleteContent(session.user.role)) return { ok: false, error: "Only administrators can delete content" };

  const parsed = idSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid id" };

  const result = await deleteServiceCommand(session.user.id, parsed.data.id);
  if (!result.ok) return result;

  revalidateMarketingCaches({ cms: false, site: false });
  revalidatePath("/");
  revalidatePath("/services");
  revalidatePath("/admin/services");
  return result;
}
