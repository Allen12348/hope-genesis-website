"use client";

import * as React from "react";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MEDIA_FOLDERS, type MediaFolderId } from "@/lib/domain/media/constants";
import type { MediaAssetDto } from "@/lib/domain/media/types";
import { MediaUploadDropzone } from "@/components/admin/media/media-upload-dropzone";
import { MediaAssetCard } from "@/components/admin/media/media-asset-card";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (url: string, asset: MediaAssetDto) => void;
  defaultFolder?: MediaFolderId;
  title?: string;
};

export function MediaPickerDialog({
  open,
  onOpenChange,
  onSelect,
  defaultFolder = "gallery",
  title = "Select media",
}: Props) {
  const [folder, setFolder] = React.useState<MediaFolderId>(defaultFolder);
  const [q, setQ] = React.useState("");
  const [items, setItems] = React.useState<MediaAssetDto[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [selected, setSelected] = React.useState<MediaAssetDto | null>(null);

  React.useEffect(() => {
    if (open) {
      setFolder(defaultFolder);
      setSelected(null);
      setQ("");
    }
  }, [open, defaultFolder]);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "60", offset: "0", folder });
      if (q.trim()) params.set("q", q.trim());
      const res = await fetch(`/api/admin/media?${params}`);
      const data = (await res.json()) as { items?: MediaAssetDto[]; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Failed to load media");
      setItems(data.items ?? []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [folder, q]);

  React.useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => void load(), q ? 300 : 0);
    return () => window.clearTimeout(t);
  }, [open, load, q]);

  function confirmSelection() {
    if (!selected) return;
    onSelect(selected.publicUrl, selected);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-hidden p-0 sm:rounded-2xl">
        <DialogHeader className="border-b border-border px-6 py-4">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Upload once, reuse anywhere. Pick an image or upload new files to this folder.
          </DialogDescription>
        </DialogHeader>

        <div className="flex max-h-[calc(90vh-5rem)] flex-col gap-4 overflow-y-auto px-6 py-4">
          <Tabs value={folder} onValueChange={(v) => setFolder(v as MediaFolderId)}>
            <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 bg-muted/50 p-1">
              {MEDIA_FOLDERS.map((f) => (
                <TabsTrigger key={f.id} value={f.id} className="text-xs sm:text-sm">
                  {f.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <MediaUploadDropzone folder={folder} onUploaded={() => void load()} />

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by filename or alt text…"
              className="pl-9"
            />
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[4/3] rounded-xl" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border bg-muted/20 py-10 text-center text-sm text-muted-foreground">
              No images in this folder yet. Upload above to get started.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {items.map((asset) => (
                <MediaAssetCard
                  key={asset.id}
                  asset={asset}
                  selectable
                  selected={selected?.id === asset.id}
                  onSelect={setSelected}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-border px-6 py-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" disabled={!selected} onClick={confirmSelection}>
            Use selected image
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}


