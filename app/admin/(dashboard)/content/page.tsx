import Link from "next/link";
import type { Metadata } from "next";
import { LayoutGrid, Layers } from "lucide-react";
import { SITE } from "@/constants/site";
import { getSafeAllPageContents } from "@/lib/admin/safe-admin-data";
import { CMS_PAGE_KEYS } from "@/lib/domain/cms/page-keys";
import { BUILDER_PAGES, builderHref } from "@/lib/cms/page-builder/registry";
import { AdminBadge } from "@/components/admin/ui/admin-badge";
import { AdminCard } from "@/components/admin/ui/admin-card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: `Content CMS | Admin | ${SITE.name}`,
  robots: { index: false, follow: false },
};

function formatWhen(iso?: Date | null) {
  if (!iso) return "Not saved yet";
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(iso);
  } catch {
    return iso.toString();
  }
}

function hubStatus(row?: { draftData?: string | null; publishedData: string; status: string }): "Draft" | "Published" | "Needs review" {
  if (!row?.draftData?.trim()) return row?.status === "PUBLISHED" ? "Published" : "Draft";
  if (row.status === "DRAFT") return "Draft";
  if (row.draftData.trim() !== row.publishedData.trim()) return "Needs review";
  return row.status === "PUBLISHED" ? "Published" : "Draft";
}

function StatusBadge({ label }: { label: "Draft" | "Published" | "Needs review" }) {
  if (label === "Draft") return <AdminBadge variant="warning">Draft</AdminBadge>;
  if (label === "Needs review") return <AdminBadge variant="info">Needs review</AdminBadge>;
  return <AdminBadge variant="success">Published</AdminBadge>;
}

function MiniThumb() {
  return (
    <div className="relative h-28 w-full overflow-hidden rounded-xl border border-border/60 bg-gradient-to-br from-muted/80 via-muted/40 to-muted/70">
      <div className="absolute inset-3 flex flex-col gap-2 rounded-lg border border-white/25 bg-black/35 p-2 shadow-inner backdrop-blur-sm dark:border-white/10">
        <div className="flex gap-1">
          <div className="h-2 w-16 rounded bg-white/45" />
          <div className="h-2 flex-1 rounded bg-accent/70" />
        </div>
        <div className="grid grid-cols-3 gap-1">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-7 rounded-lg bg-primary/55" />
          ))}
        </div>
        <div className="h-9 rounded-lg bg-white/35" />
      </div>
    </div>
  );
}

export default async function AdminContentHubPage() {
  const pageContents = await getSafeAllPageContents();
  const byKey = new Map(pageContents.map((row) => [row.pageKey, row]));

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <Layers className="h-4 w-4 text-accent" aria-hidden />
            Website content
          </div>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground">Content CMS</h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Every page uses the same visual builder: drag blocks, edit fields, preview live, save draft, then publish. Raw JSON is only in
            Advanced developer mode.
          </p>
        </div>
        <Button asChild variant="secondary" className="rounded-2xl">
          <Link href={builderHref(BUILDER_PAGES[0].key)}>
            <LayoutGrid className="mr-2 h-4 w-4" />
            Open builder
          </Link>
        </Button>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {BUILDER_PAGES.map((page) => {
          const row = byKey.get(page.key);
          const status = row ? hubStatus(row) : "Draft";
          return (
            <AdminCard key={page.key} className="flex h-full flex-col overflow-hidden p-0 shadow-sm ring-1 ring-border/70">
              <div className="space-y-4 p-5">
                <div>
                  <h2 className="font-display text-lg font-semibold text-foreground">{page.label}</h2>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{page.description}</p>
                  <p className="mt-2 text-[11px] text-muted-foreground">
                    <span className="font-semibold text-foreground">Editable:</span> {page.editableSummary}
                  </p>
                </div>
                <MiniThumb />
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge label={status} />
                  <span className="text-[11px] text-muted-foreground">
                    Updated <span className="font-semibold text-foreground">{formatWhen(row?.updatedAt)}</span>
                  </span>
                </div>
              </div>
              <div className="mt-auto space-y-2 border-t border-border/60 bg-muted/15 px-4 py-4">
                {page.key === CMS_PAGE_KEYS.home ? (
                  <>
                    <Button asChild className="w-full rounded-2xl">
                      <Link href="/admin/content/homepage/visual">Visual editor</Link>
                    </Button>
                    <Button asChild variant="secondary" className="w-full rounded-2xl">
                      <Link href="/admin/content/homepage/hero">Hero settings</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full rounded-2xl">
                      <Link href="/admin/content/site-settings">Homepage layout</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full rounded-2xl">
                      <Link href="/admin/content/homepage/hero-stats">Hero stats</Link>
                    </Button>
                  </>
                ) : null}
                <Button asChild className="w-full rounded-2xl">
                  <Link href={builderHref(page.key)}>Open builder</Link>
                </Button>
              </div>
            </AdminCard>
          );
        })}
      </div>
    </div>
  );
}
