"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { CmsPageKey } from "@/lib/cms/marketing-cms-defaults";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { upsertPageContentAction } from "@/lib/actions/cms-site";
import { AdminCard } from "@/components/admin/ui/admin-card";

export function CmsJsonPageForm({
  pageKey,
  title,
  initialPublished,
  initialDraft,
}: {
  pageKey: CmsPageKey;
  title: string;
  initialPublished: string;
  initialDraft: string;
}) {
  const router = useRouter();
  const [published, setPublished] = React.useState(initialPublished);
  const [draft, setDraft] = React.useState(initialDraft || initialPublished);
  const [pending, setPending] = React.useState(false);

  async function savePublished() {
    setPending(true);
    const res = await upsertPageContentAction({
      pageKey,
      publishedData: published,
      draftData: draft,
      status: "PUBLISHED",
    });
    setPending(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success(res.message ?? "Saved");
    router.refresh();
  }

  async function saveDraftOnly() {
    setPending(true);
    const res = await upsertPageContentAction({
      pageKey,
      publishedData: published,
      draftData: draft,
      status: "DRAFT",
    });
    setPending(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success("Draft stored");
    router.refresh();
  }

  async function publishDraft() {
    setPending(true);
    const res = await upsertPageContentAction({
      pageKey,
      publishedData: draft,
      draftData: draft,
      status: "PUBLISHED",
    });
    setPending(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    setPublished(draft);
    toast.success("Draft published to live site");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <AdminCard className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-semibold text-foreground">{title}</h2>
            <p className="text-xs text-muted-foreground">
              Valid JSON only. Invalid JSON is rejected. Public pages merge with built-in defaults so the site never breaks.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" className="rounded-lg" disabled={pending} onClick={() => void saveDraftOnly()}>
              Save draft state
            </Button>
            <Button type="button" variant="secondary" size="sm" className="rounded-lg" disabled={pending} onClick={() => void publishDraft()}>
              Publish draft → live
            </Button>
            <Button type="button" size="sm" className="rounded-lg" disabled={pending} onClick={() => void savePublished()}>
              Save published JSON
            </Button>
          </div>
        </div>
      </AdminCard>

      <Tabs defaultValue="published" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="published">Published (live)</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
        </TabsList>
        <TabsContent value="published" className="mt-3 space-y-2">
          <Label>Published JSON</Label>
          <Textarea
            value={published}
            onChange={(e) => setPublished(e.target.value)}
            spellCheck={false}
            className="min-h-[420px] font-mono text-xs leading-relaxed"
          />
        </TabsContent>
        <TabsContent value="draft" className="mt-3 space-y-2">
          <Label>Draft JSON</Label>
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            spellCheck={false}
            className="min-h-[420px] font-mono text-xs leading-relaxed"
          />
        </TabsContent>
      </Tabs>

      <AdminCard className="p-4">
        <p className="text-xs font-semibold text-muted-foreground">Live preview</p>
        <div className="mt-2 overflow-hidden rounded-xl border border-border bg-muted/20">
          <iframe title="Site preview" src="/" className="h-[480px] w-full bg-background" />
        </div>
      </AdminCard>
    </div>
  );
}
