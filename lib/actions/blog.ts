"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { canDeleteContent, canManageBlog } from "@/lib/permissions";
import { blogUpsertSchema, idSchema } from "@/lib/validations/cms";
import type { ActionResult } from "@/lib/actions/types";
import { deleteBlogPostCommand, upsertBlogPostCommand } from "@/lib/services/commands/blog.commands";

export async function upsertBlogPostAction(input: unknown): Promise<ActionResult> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { ok: false, error: "Unauthorized" };
  if (!canManageBlog(session.user.role)) return { ok: false, error: "Forbidden" };

  const parsed = blogUpsertSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const result = await upsertBlogPostCommand(session.user.id, parsed.data);
  if (!result.ok) return result;

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/blog/[slug]", "page");
  revalidatePath("/admin/blog");
  return result;
}

export async function deleteBlogPostAction(input: unknown): Promise<ActionResult> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { ok: false, error: "Unauthorized" };
  if (!canManageBlog(session.user.role)) return { ok: false, error: "Forbidden" };
  if (!canDeleteContent(session.user.role)) return { ok: false, error: "Only administrators can delete content" };

  const parsed = idSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid id" };

  const result = await deleteBlogPostCommand(session.user.id, parsed.data.id);
  if (!result.ok) return result;

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  return result;
}
