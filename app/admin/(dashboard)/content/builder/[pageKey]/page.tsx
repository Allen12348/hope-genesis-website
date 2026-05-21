import Link from "next/link";
import type { Metadata } from "next";
import { SITE } from "@/constants/site";
import { getSafePageContentByKey } from "@/lib/admin/safe-admin-data";
import { loadPageBuilderPreviewContext } from "@/lib/cms/page-builder/preview-data";
import { migrateStoredContentToBlocks } from "@/lib/cms/migrate-cms-pages";
import { getBuilderPageMeta, resolveBuilderPageKey } from "@/lib/cms/page-builder/registry";
import { PageBuilderEditor } from "@/components/admin/page-builder/page-builder-editor";
import { BUILDER_PAGES } from "@/lib/cms/page-builder/registry";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: `Page builder | Admin | ${SITE.name}`,
  robots: { index: false, follow: false },
};

export function generateStaticParams() {
  return BUILDER_PAGES.map((p) => ({ pageKey: p.slug }));
}

export default async function AdminPageBuilderBySlugPage({
  params,
  searchParams,
}: {
  params: { pageKey: string };
  searchParams?: { advanced?: string };
}) {
  const pageKey = resolveBuilderPageKey(params.pageKey);
  const meta = getBuilderPageMeta(pageKey);
  const [row, previewCtx] = await Promise.all([
    getSafePageContentByKey(pageKey),
    loadPageBuilderPreviewContext(),
  ]);

  const migrated = migrateStoredContentToBlocks(pageKey, row?.publishedData ?? null, row?.draftData ?? null);

  let publishedData = row?.publishedData?.trim() ?? "";
  if (!publishedData) {
    publishedData = JSON.stringify(migrated.document);
  }

  const draftSeed =
    row?.draftData?.trim() ||
    (migrated.migrated && migrated.legacyBackup
      ? JSON.stringify({ ...migrated.document, _legacyBackup: migrated.legacyBackup })
      : null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">{meta.label} builder</h1>
        <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
          Drag blocks, edit fields in the side panel, save draft, then publish live. {meta.editableSummary}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {BUILDER_PAGES.map((o) => (
          <Link
            key={o.key}
            href={`/admin/content/builder/${o.slug}`}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-semibold transition",
              o.key === pageKey
                ? "border-accent bg-accent/10 text-accent"
                : "border-border/70 text-muted-foreground hover:border-accent/40 hover:text-foreground",
            )}
          >
            {o.label}
          </Link>
        ))}
      </div>
      <PageBuilderEditor
        key={`${pageKey}:${row?.updatedAt?.toISOString() ?? "none"}`}
        pageKey={pageKey}
        publishedData={publishedData}
        draftData={draftSeed}
        previewCtx={previewCtx}
        showDeveloperMode={searchParams?.advanced === "1"}
      />
    </div>
  );
}
