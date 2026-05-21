"use server";

import { revalidatePath } from "next/cache";
import { revalidateMarketingCaches } from "@/lib/cms/revalidate-marketing";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { canEditCompanySettings } from "@/lib/permissions";
import {
  idSchema,
  marketingHeaderSettingsSchema,
  navigationItemUpsertSchema,
  navigationReorderSchema,
} from "@/lib/validations/cms";
import type { ActionResult } from "@/lib/actions/types";
import {
  deleteNavigationItemCommand,
  reorderNavigationItemsCommand,
  resetMarketingHeaderCommand,
  saveMarketingHeaderSettingsCommand,
  upsertNavigationItemCommand,
} from "@/lib/services/commands/marketing-header.commands";

function revalidateMarketingChrome() {
  revalidateMarketingCaches({ cms: false, catalog: false });
  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
  revalidatePath("/admin/settings/header");
}

export async function saveMarketingHeaderSettingsAction(input: unknown): Promise<ActionResult> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { ok: false, error: "Unauthorized" };
  if (!canEditCompanySettings(session.user.role)) return { ok: false, error: "Forbidden" };

  const parsed = marketingHeaderSettingsSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const result = await saveMarketingHeaderSettingsCommand(session.user.id, parsed.data);
  if (!result.ok) return result;

  revalidateMarketingChrome();
  return result;
}

export async function resetMarketingHeaderAction(): Promise<ActionResult> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { ok: false, error: "Unauthorized" };
  if (!canEditCompanySettings(session.user.role)) return { ok: false, error: "Forbidden" };

  const result = await resetMarketingHeaderCommand(session.user.id);
  if (!result.ok) return result;

  revalidateMarketingChrome();
  return result;
}

export async function upsertNavigationItemAction(input: unknown): Promise<ActionResult> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { ok: false, error: "Unauthorized" };
  if (!canEditCompanySettings(session.user.role)) return { ok: false, error: "Forbidden" };

  const parsed = navigationItemUpsertSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const result = await upsertNavigationItemCommand(session.user.id, parsed.data);
  if (!result.ok) return result;

  revalidateMarketingChrome();
  return result;
}

export async function deleteNavigationItemAction(input: unknown): Promise<ActionResult> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { ok: false, error: "Unauthorized" };
  if (!canEditCompanySettings(session.user.role)) return { ok: false, error: "Forbidden" };

  const parsed = idSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid id" };

  const result = await deleteNavigationItemCommand(session.user.id, parsed.data.id);
  if (!result.ok) return result;

  revalidateMarketingChrome();
  return result;
}

export async function reorderNavigationItemsAction(input: unknown): Promise<ActionResult> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { ok: false, error: "Unauthorized" };
  if (!canEditCompanySettings(session.user.role)) return { ok: false, error: "Forbidden" };

  const parsed = navigationReorderSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid order payload" };

  const result = await reorderNavigationItemsCommand(session.user.id, parsed.data);
  if (!result.ok) return result;

  revalidateMarketingChrome();
  return result;
}
