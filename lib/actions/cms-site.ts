"use server";

import { revalidatePath } from "next/cache";
import { revalidateMarketingCaches } from "@/lib/cms/revalidate-marketing";
import { getServerSession } from "next-auth";
import { z } from "zod";
import {
  upsertFooterCmsCommand,
  upsertPageContentCommand,
  upsertSeoMetadataCommand,
  upsertSiteSettingsCmsCommand,
} from "@/lib/application/commands/cms-site.commands";
import type { ActionResult } from "@/lib/actions/types";
import { authOptions } from "@/lib/auth/options";
import { CMS_PAGE_KEYS } from "@/lib/domain/cms/page-keys";
import { canMutateContent } from "@/lib/permissions";
import { safeJsonParse } from "@/lib/utils/safe-json-parse";

const REVALIDATE_PATHS_BY_PAGE_KEY: Partial<Record<(typeof CMS_PAGE_KEYS)[keyof typeof CMS_PAGE_KEYS], string[]>> = {
  [CMS_PAGE_KEYS.home]: ["/"],
  [CMS_PAGE_KEYS.homepageHero]: ["/"],
  [CMS_PAGE_KEYS.about]: ["/about"],
  [CMS_PAGE_KEYS.contact]: ["/contact"],
  [CMS_PAGE_KEYS.coverageMap]: ["/services"],
  [CMS_PAGE_KEYS.servicesLanding]: ["/services"],
  [CMS_PAGE_KEYS.projectsLanding]: ["/projects"],
  [CMS_PAGE_KEYS.galleryLanding]: ["/gallery"],
  [CMS_PAGE_KEYS.testimonialsLanding]: ["/testimonials"],
  [CMS_PAGE_KEYS.brandsLanding]: ["/brands"],
  [CMS_PAGE_KEYS.blogLanding]: ["/blog"],
  [CMS_PAGE_KEYS.footer]: ["/"],
  [CMS_PAGE_KEYS.navigationHeader]: ["/"],
  [CMS_PAGE_KEYS.seo]: ["/"],
};

const pageKeySchema = z.enum([
  CMS_PAGE_KEYS.home,
  CMS_PAGE_KEYS.about,
  CMS_PAGE_KEYS.contact,
  CMS_PAGE_KEYS.coverageMap,
  CMS_PAGE_KEYS.servicesLanding,
  CMS_PAGE_KEYS.projectsLanding,
  CMS_PAGE_KEYS.galleryLanding,
  CMS_PAGE_KEYS.testimonialsLanding,
  CMS_PAGE_KEYS.brandsLanding,
  CMS_PAGE_KEYS.blogLanding,
  CMS_PAGE_KEYS.footer,
  CMS_PAGE_KEYS.navigationHeader,
  CMS_PAGE_KEYS.seo,
  CMS_PAGE_KEYS.homepageHero,
]);

const upsertPageSchema = z.object({
  pageKey: pageKeySchema,
  publishedData: z.string().min(2).max(200_000),
  draftData: z.string().max(200_000).optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
});

function safeJson(s: string): boolean {
  return safeJsonParse<unknown>(s, null) !== null;
}

export async function upsertPageContentAction(input: unknown): Promise<ActionResult> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { ok: false, error: "Unauthorized" };
  if (!canMutateContent(session.user.role)) return { ok: false, error: "Forbidden" };

  const parsed = upsertPageSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  if (!safeJson(parsed.data.publishedData)) return { ok: false, error: "Published JSON is invalid" };
  if (parsed.data.draftData && !safeJson(parsed.data.draftData)) return { ok: false, error: "Draft JSON is invalid" };

  const { pageKey, publishedData, draftData, status } = parsed.data;

  const debugSave =
    process.env.NODE_ENV === "development" || process.env.CMS_DEBUG_BUILDER_SAVE === "true";

  if (debugSave) {
    console.log("[cms:upsertPageContent] incoming", {
      pageKey,
      status: status ?? "(unchanged)",
      publishedDataChars: publishedData.length,
      draftDataChars: draftData?.length ?? 0,
    });
  }

  try {
    await upsertPageContentCommand(session.user.id, { pageKey, publishedData, draftData, status });
  } catch (err) {
    console.error("[cms:upsertPageContent] persistence failed", {
      pageKey,
      message: err instanceof Error ? err.message : String(err),
    });
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to save changes",
    };
  }

  if (debugSave) {
    console.log("[cms:upsertPageContent] DB save success", { pageKey });
  }

  revalidateMarketingCaches();
  revalidatePath("/", "layout");
  revalidatePath("/admin/content");
  revalidatePath("/admin/content/builder", "layout");
  const paths = REVALIDATE_PATHS_BY_PAGE_KEY[pageKey];
  if (paths) {
    for (const p of paths) {
      revalidatePath(p);
    }
  }
  return { ok: true, message: "Page content saved" };
}

const siteSettingsSchema = z.object({
  sectionVisibilityJson: z.string().max(100_000).optional().nullable(),
  floatingActionsJson: z.string().max(100_000).optional().nullable(),
});

export async function upsertSiteSettingsCmsAction(input: unknown): Promise<ActionResult> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { ok: false, error: "Unauthorized" };
  if (!canMutateContent(session.user.role)) return { ok: false, error: "Forbidden" };

  const parsed = siteSettingsSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid input" };
  const { sectionVisibilityJson, floatingActionsJson } = parsed.data;
  if (sectionVisibilityJson && !safeJson(sectionVisibilityJson)) return { ok: false, error: "Section visibility JSON invalid" };
  if (floatingActionsJson && !safeJson(floatingActionsJson)) return { ok: false, error: "Floating actions JSON invalid" };

  await upsertSiteSettingsCmsCommand(session.user.id, { sectionVisibilityJson, floatingActionsJson });
  revalidateMarketingCaches({ catalog: false });
  revalidatePath("/", "layout");
  revalidatePath("/admin/content/site-settings");
  return { ok: true, message: "Homepage layout saved" };
}

const footerSchema = z.object({
  payloadJson: z.string().min(2).max(200_000),
});

export async function upsertFooterCmsAction(input: unknown): Promise<ActionResult> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { ok: false, error: "Unauthorized" };
  if (!canMutateContent(session.user.role)) return { ok: false, error: "Forbidden" };

  const parsed = footerSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid input" };
  if (!safeJson(parsed.data.payloadJson)) return { ok: false, error: "Footer JSON invalid" };

  await upsertFooterCmsCommand(session.user.id, parsed.data.payloadJson);
  revalidateMarketingCaches({ catalog: false });
  revalidatePath("/", "layout");
  return { ok: true, message: "Footer saved" };
}

const seoSchema = z.object({
  pagePath: z.string().min(1).max(200),
  metaTitle: z.string().max(200).optional().nullable(),
  metaDescription: z.string().max(500).optional().nullable(),
  ogImageUrl: z.string().max(2000).optional().nullable(),
  keywords: z.string().max(500).optional().nullable(),
  canonicalUrl: z.string().max(2000).optional().nullable(),
});

export async function upsertSeoMetadataAction(input: unknown): Promise<ActionResult> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { ok: false, error: "Unauthorized" };
  if (!canMutateContent(session.user.role)) return { ok: false, error: "Forbidden" };

  const parsed = seoSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid input" };
  const d = parsed.data;

  await upsertSeoMetadataCommand(session.user.id, d);
  revalidatePath("/", "layout");
  revalidatePath(d.pagePath);
  return { ok: true, message: "SEO saved" };
}
