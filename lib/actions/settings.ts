"use server";

import { revalidatePath } from "next/cache";
import { revalidateMarketingCaches } from "@/lib/cms/revalidate-marketing";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { canChangeUserPassword, canEditCompanySettings, canManageUsers } from "@/lib/permissions";
import {
  changeUserPasswordSchema,
  companySettingsSchema,
  deleteUserSchema,
  userInviteSchema,
} from "@/lib/validations/cms";
import type { ActionResult } from "@/lib/actions/types";
import {
  changeUserPasswordCommand,
  createUserCommand,
  deleteUserCommand,
  updateCompanySettingsCommand,
} from "@/lib/services/commands/company-settings.commands";

export async function updateCompanySettingsAction(input: unknown): Promise<ActionResult> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { ok: false, error: "Unauthorized" };
  if (!canEditCompanySettings(session.user.role)) return { ok: false, error: "Forbidden" };

  const parsed = companySettingsSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const result = await updateCompanySettingsCommand(session.user.id, parsed.data);
  if (!result.ok) return result;

  revalidateMarketingCaches({ cms: false });
  revalidatePath("/", "layout");
  revalidatePath("/contact");
  revalidatePath("/admin/settings");
  revalidatePath("/admin/settings/header");
  revalidatePath("/admin/content/hero");
  return result;
}

export async function createUserAction(input: unknown): Promise<ActionResult> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { ok: false, error: "Unauthorized" };
  if (!canManageUsers(session.user.role)) return { ok: false, error: "Forbidden" };

  const parsed = userInviteSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const result = await createUserCommand(session.user.id, parsed.data);
  if (!result.ok) return result;

  revalidatePath("/admin/settings");
  return result;
}

export async function changeUserPasswordAction(input: unknown): Promise<ActionResult> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { ok: false, error: "Unauthorized" };
  if (!canChangeUserPassword(session.user.role)) return { ok: false, error: "Forbidden" };

  const parsed = changeUserPasswordSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const result = await changeUserPasswordCommand(session.user.id, parsed.data);
  if (!result.ok) return result;

  revalidatePath("/admin/settings");
  return result;
}

export async function deleteUserAction(input: unknown): Promise<ActionResult> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { ok: false, error: "Unauthorized" };
  if (!canManageUsers(session.user.role)) return { ok: false, error: "Forbidden" };

  const parsed = deleteUserSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Invalid user id. Please refresh and try again." };
  }

  if (process.env.NODE_ENV === "development") {
    console.log("Deleting user id:", parsed.data.id);
  }

  const result = await deleteUserCommand(session.user.id, parsed.data.id, session.user.id);
  if (!result.ok) return result;

  revalidatePath("/admin/settings");
  return result;
}
