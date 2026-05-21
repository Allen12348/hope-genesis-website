"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { canDeleteContent, canManageProjects } from "@/lib/permissions";
import { idSchema, projectUpsertSchema } from "@/lib/validations/cms";
import type { ActionResult } from "@/lib/actions/types";
import { deleteProjectCommand, upsertProjectCommand } from "@/lib/services/commands/project.commands";

export async function upsertProjectAction(input: unknown): Promise<ActionResult> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { ok: false, error: "Unauthorized" };
  if (!canManageProjects(session.user.role)) return { ok: false, error: "Forbidden" };

  const parsed = projectUpsertSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const result = await upsertProjectCommand(session.user.id, parsed.data);
  if (!result.ok) return result;

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/projects/[slug]", "page");
  revalidatePath("/gallery");
  revalidatePath("/admin/projects");
  return result;
}

export async function deleteProjectAction(input: unknown): Promise<ActionResult> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { ok: false, error: "Unauthorized" };
  if (!canManageProjects(session.user.role)) return { ok: false, error: "Forbidden" };
  if (!canDeleteContent(session.user.role)) return { ok: false, error: "Only administrators can delete content" };

  const parsed = idSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid id" };

  const result = await deleteProjectCommand(session.user.id, parsed.data.id);
  if (!result.ok) return result;

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/admin/projects");
  return result;
}
