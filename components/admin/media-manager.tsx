"use client";

import * as React from "react";
import type { Role } from "@prisma/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Search } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminHeader } from "@/components/admin/ui/admin-header";
import { AdminEmptyState } from "@/components/admin/ui/admin-empty-state";
import { MEDIA_FOLDERS, type MediaFolderId } from "@/lib/domain/media/constants";
import type { MediaAssetDto } from "@/lib/domain/media/types";
import { canManageMedia } from "@/lib/permissions";
import { deleteMediaAssetAction, updateMediaAssetAction } from "@/lib/actions/media";
import { MediaUploadDropzone } from "@/components/admin/media/media-upload-dropzone";
import { MediaAssetCard } from "@/components/admin/media/media-asset-card";

type Props = {
  initialItems: MediaAssetDto[];
  role: Role;
};

export function MediaManager({ initialItems, role }: Props) {
  const router = useRouter();
  const canEdit = canManageMedia(role);
  const [folder, setFolder] = React.useState<MediaFolderId | "all">("all");
  const [q, setQ] = React.useState("");
  const [items, setItems] = React.useState(initialItems);
  const [loading, setLoading] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "120", offset: "0" });
      if (folder !== "all") params.set("folder", folder);
      if (q.trim()) params.set("q", q.trim());
      const res = await fetch(`/api/admin/media?${params}`);
      const data = (await res.json()) as { items?: MediaAssetDto[] };
      setItems(data.items ?? []);
    } finally {
      setLoading(false);
    }
  }, [folder, q]);

  React.useEffect(() => {
    const t = window.setTimeout(() => void load(), q ? 300 : 0);
    return () => window.clearTimeout(t);
  }, [load, q]);

  async function handleAltChange(id: string, alt: string) {
    const res = await updateMediaAssetAction({ id, alt: alt.trim() || null });
    if (!res.ok) toast.error(res.error);
    else {
      toast.success("Alt text saved");
      router.refresh();
      void load();
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;
    const res = await deleteMediaAssetAction({ id: deleteId });
    if (!res.ok) toast.error(res.error);
    else {
      toast.success("Image deleted");
      setDeleteId(null);
      router.refresh();
      void load();
    }
  }

  const uploadFolder: MediaFolderId = folder === "all" ? "gallery" : folder;

  return (
    <div className="space-y-8">
      <AdminHeader
        title="Media library"
        description="Upload, organize, and reuse images across the site. Drag and drop files — they are optimized automatically."
      />

      <Tabs value={folder} onValueChange={(v) => setFolder(v as MediaFolderId | "all")}>
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 bg-muted/50 p-1">
          <TabsTrigger value="all">All</TabsTrigger>
          {MEDIA_FOLDERS.map((f) => (
            <TabsTrigger key={f.id} value={f.id} className="text-xs sm:text-sm">
              {f.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {canEdit ? (
        <MediaUploadDropzone
          folder={uploadFolder}
          onUploaded={() => {
            router.refresh();
            void load();
          }}
        />
      ) : null}

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search media…"
          className="pl-9"
        />
      </div>

      {loading && items.length === 0 ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : items.length === 0 ? (
        <AdminEmptyState
          title="No media yet"
          description="Upload images to build your reusable media library. Organize by folder for faster editing."
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((asset) => (
            <MediaAssetCard
              key={asset.id}
              asset={asset}
              disabled={!canEdit}
              onAltChange={canEdit ? handleAltChange : undefined}
              onDelete={canEdit ? setDeleteId : undefined}
            />
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this image?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the file from the library. Pages already using this URL may show a broken image until you
              pick a replacement.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => void confirmDelete()}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

