"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { upsertSeoMetadataAction } from "@/lib/actions/cms-site";
import { AdminCard } from "@/components/admin/ui/admin-card";

export function CmsSeoForm({
  pagePath,
  initial,
}: {
  pagePath: string;
  initial: {
    metaTitle: string;
    metaDescription: string;
    ogImageUrl: string;
    keywords: string;
    canonicalUrl: string;
  };
}) {
  const router = useRouter();
  const [metaTitle, setMetaTitle] = React.useState(initial.metaTitle);
  const [metaDescription, setMetaDescription] = React.useState(initial.metaDescription);
  const [ogImageUrl, setOgImageUrl] = React.useState(initial.ogImageUrl);
  const [keywords, setKeywords] = React.useState(initial.keywords);
  const [canonicalUrl, setCanonicalUrl] = React.useState(initial.canonicalUrl);
  const [pending, setPending] = React.useState(false);

  async function save() {
    setPending(true);
    const res = await upsertSeoMetadataAction({
      pagePath,
      metaTitle: metaTitle.trim() || null,
      metaDescription: metaDescription.trim() || null,
      ogImageUrl: ogImageUrl.trim() || null,
      keywords: keywords.trim() || null,
      canonicalUrl: canonicalUrl.trim() || null,
    });
    setPending(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success(res.message ?? "Saved");
    router.refresh();
  }

  return (
    <AdminCard className="space-y-4 p-4">
      <div>
        <h2 className="font-display text-lg font-semibold">SEO: {pagePath}</h2>
        <p className="text-xs text-muted-foreground">Overrides merge with each page&apos;s default metadata when fields are empty.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1 sm:col-span-2">
          <Label>Page path</Label>
          <Input value={pagePath} readOnly className="font-mono text-xs" />
        </div>
        <div className="space-y-1 sm:col-span-2">
          <Label>Meta title</Label>
          <Input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} />
        </div>
        <div className="space-y-1 sm:col-span-2">
          <Label>Meta description</Label>
          <Textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} rows={3} />
        </div>
        <div className="space-y-1 sm:col-span-2">
          <Label>OG image URL</Label>
          <Input value={ogImageUrl} onChange={(e) => setOgImageUrl(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label>Keywords (comma-separated)</Label>
          <Input value={keywords} onChange={(e) => setKeywords(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label>Canonical URL</Label>
          <Input value={canonicalUrl} onChange={(e) => setCanonicalUrl(e.target.value)} />
        </div>
      </div>
      <Button type="button" disabled={pending} onClick={() => void save()}>
        Save SEO
      </Button>
    </AdminCard>
  );
}
