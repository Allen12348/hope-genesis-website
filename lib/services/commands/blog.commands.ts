import type { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { writeAuditLog } from "@/lib/audit";
import { blogUpsertSchema } from "@/lib/validations/cms";
import type { ActionResult } from "@/lib/actions/types";
import { withCommandError } from "@/lib/services/commands/with-command-error";

export type BlogUpsertInput = z.infer<typeof blogUpsertSchema>;

export async function upsertBlogPostCommand(actorUserId: string, d: BlogUpsertInput): Promise<ActionResult> {
  return withCommandError(async () => {
    const data = {
      slug: d.slug,
      title: d.title,
      description: d.description,
      category: d.category,
      publishedAt: d.publishedAt,
      readingMinutes: d.readingMinutes,
      featured: d.featured,
      coverImage: d.coverImage,
      coverImageUrl: d.coverImageUrl,
      coverAlt: d.coverAlt,
      body: JSON.stringify(d.body),
      tags: JSON.stringify(d.tags?.length ? d.tags : []),
      metaTitle: d.metaTitle?.trim() ? d.metaTitle.trim() : null,
      metaDescription: d.metaDescription?.trim() ? d.metaDescription.trim() : null,
      published: d.published,
    };

    if (d.id) {
      await prisma.blogPost.update({ where: { id: d.id }, data });
      await writeAuditLog({
        userId: actorUserId,
        action: "update",
        entity: "blog_post",
        entityId: d.id,
        metadata: { slug: d.slug },
      });
    } else {
      const created = await prisma.blogPost.create({ data });
      await writeAuditLog({
        userId: actorUserId,
        action: "create",
        entity: "blog_post",
        entityId: created.id,
        metadata: { slug: d.slug },
      });
    }

    return { ok: true, message: "Blog post saved" };
  });
}

export async function deleteBlogPostCommand(actorUserId: string, id: string): Promise<ActionResult> {
  return withCommandError(async () => {
    await prisma.blogPost.delete({ where: { id } });
    await writeAuditLog({
      userId: actorUserId,
      action: "delete",
      entity: "blog_post",
      entityId: id,
    });
    return { ok: true, message: "Blog post deleted" };
  });
}
