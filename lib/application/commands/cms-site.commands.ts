import { writeAuditLog } from "@/lib/audit";
import { upsertFooterSection } from "@/lib/data/cms/footer-cms.repository";
import { upsertPageContent } from "@/lib/data/cms/page-content.repository";
import { upsertSeoMetadata } from "@/lib/data/cms/seo-metadata.repository";
import { upsertSiteSettingsCms } from "@/lib/data/cms/site-settings-cms.repository";
import type { CmsPageKey } from "@/lib/domain/cms/page-keys";

export async function upsertPageContentCommand(
  actorUserId: string,
  data: {
    pageKey: CmsPageKey;
    publishedData: string;
    draftData?: string | null;
    status?: "DRAFT" | "PUBLISHED";
  },
) {
  await upsertPageContent(data);
  await writeAuditLog({
    userId: actorUserId,
    action: "upsert",
    entity: "page_content",
    entityId: data.pageKey,
  });
}

export async function upsertSiteSettingsCmsCommand(
  actorUserId: string,
  data: {
    sectionVisibilityJson?: string | null;
    floatingActionsJson?: string | null;
  },
) {
  await upsertSiteSettingsCms(data);
  await writeAuditLog({
    userId: actorUserId,
    action: "upsert",
    entity: "site_settings_cms",
    entityId: "singleton",
  });
}

export async function upsertFooterCmsCommand(actorUserId: string, payloadJson: string) {
  await upsertFooterSection(payloadJson);
  await writeAuditLog({
    userId: actorUserId,
    action: "upsert",
    entity: "footer_section",
    entityId: "singleton",
  });
}

export async function upsertSeoMetadataCommand(
  actorUserId: string,
  data: {
    pagePath: string;
    metaTitle?: string | null;
    metaDescription?: string | null;
    ogImageUrl?: string | null;
    keywords?: string | null;
    canonicalUrl?: string | null;
  },
) {
  await upsertSeoMetadata(data);
  await writeAuditLog({
    userId: actorUserId,
    action: "upsert",
    entity: "seo_metadata",
    entityId: data.pagePath,
  });
}
