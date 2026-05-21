"use client";

import * as React from "react";
import type { GalleryItem, Role } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { deleteGalleryItemAction, upsertGalleryItemAction } from "@/lib/actions/gallery";
import { canDeleteContent, canMutateContent } from "@/lib/permissions";
import { GalleryFormDrawerContent, type GalleryFormValues } from "@/components/admin/gallery-form-drawer-content";
import { AdminHeader } from "@/components/admin/ui/admin-header";
import { AdminDataTable, type AdminTableColumn } from "@/components/admin/ui/admin-data-table";
import { AdminDrawer, AdminDrawerContent, AdminDrawerFooter } from "@/components/admin/ui/admin-drawer";
import { AdminBadge } from "@/components/admin/ui/admin-badge";
import { AdminEmptyState } from "@/components/admin/ui/admin-empty-state";
import { AdminActionMenu, type AdminActionMenuEntry } from "@/components/admin/ui/admin-action-menu";

function thumbSrc(row: GalleryItem) {
  return row.imageUrl?.trim() || row.src;
}

export function GalleryManager({ rows, role }: { rows: GalleryItem[]; role: Role }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const canEdit = canMutateContent(role);
  const canDel = canDeleteContent(role);
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<GalleryItem | "new" | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState(false);
  const [src, setSrc] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState("");
  const [alt, setAlt] = React.useState("");
  const [caption, setCaption] = React.useState("");
  const [published, setPublished] = React.useState(true);
  const [category, setCategory] = React.useState("");
  const [featured, setFeatured] = React.useState(false);

  const formValues: GalleryFormValues = { src, imageUrl, alt, caption, published, category, featured };

  function patchForm(patch: Partial<GalleryFormValues>) {
    if (patch.src !== undefined) setSrc(patch.src);
    if (patch.imageUrl !== undefined) setImageUrl(patch.imageUrl);
    if (patch.alt !== undefined) setAlt(patch.alt);
    if (patch.caption !== undefined) setCaption(patch.caption);
    if (patch.published !== undefined) setPublished(patch.published);
    if (patch.category !== undefined) setCategory(patch.category);
    if (patch.featured !== undefined) setFeatured(patch.featured);
  }

  React.useEffect(() => {
    if (searchParams.get("new") === "1" && canEdit) {
      openNew();
      router.replace("/admin/gallery");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- open ?new= once
  }, []);

  function openNew() {
    setEditing("new");
    setSrc("https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1600&q=80");
    setImageUrl("");
    setAlt("");
    setCaption("");
    setPublished(true);
    setCategory("");
    setFeatured(false);
    setOpen(true);
  }

  function openEdit(row: GalleryItem) {
    setEditing(row);
    setSrc(row.src);
    setImageUrl(row.imageUrl ?? "");
    setAlt(row.alt);
    setCaption(row.caption);
    setPublished(row.published);
    setCategory(row.category ?? "");
    setFeatured(row.featured);
    setOpen(true);
  }

  async function save() {
    setPending(true);
    const res = await upsertGalleryItemAction({
      id: editing !== "new" && editing ? editing.id : undefined,
      src,
      imageUrl: imageUrl.trim() === "" ? null : imageUrl,
      alt,
      caption,
      published,
      category,
      featured,
    });
    setPending(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success(res.message ?? "Saved");
    setOpen(false);
    router.refresh();
  }

  async function confirmDelete() {
    if (!deleteId) return;
    setPending(true);
    const res = await deleteGalleryItemAction({ id: deleteId });
    setPending(false);
    setDeleteId(null);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success(res.message ?? "Deleted");
    router.refresh();
  }

  const columns: AdminTableColumn<GalleryItem>[] = [
    {
      id: "thumb",
      header: "",
      className: "w-16",
      cell: (row) => (
        <div className="h-11 w-14 overflow-hidden rounded-lg border border-border bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element -- admin CMS */}
          <img src={thumbSrc(row)} alt="" className="h-full w-full object-cover" loading="lazy" />
        </div>
      ),
    },
    {
      id: "caption",
      header: "Caption",
      sortable: true,
      sortValue: (r) => r.caption,
      cell: (r) => (
        <div>
          <div className="line-clamp-2 font-semibold text-foreground">{r.caption}</div>
          <div className="line-clamp-1 text-xs text-muted-foreground">{r.alt}</div>
        </div>
      ),
    },
    {
      id: "published",
      header: "Status",
      sortable: true,
      sortValue: (r) => (r.published ? 1 : 0),
      cell: (r) => (
        <AdminBadge variant={r.published ? "success" : "warning"}>{r.published ? "Live" : "Draft"}</AdminBadge>
      ),
    },
    {
      id: "updated",
      header: "Updated",
      sortable: true,
      sortValue: (r) => r.updatedAt.getTime(),
      cell: (r) => (
        <span className="whitespace-nowrap text-xs text-muted-foreground">
          {r.updatedAt.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      headerClassName: "w-12 text-right",
      className: "text-right",
      cell: (row) => {
        const items: AdminActionMenuEntry[] = [];
        if (canEdit) {
          items.push({
            key: "edit",
            label: "Edit",
            icon: <Pencil className="h-4 w-4" />,
            onSelect: () => openEdit(row),
          });
        }
        if (canDel) {
          items.push({ type: "separator", key: "s1" });
          items.push({
            key: "del",
            label: "Delete",
            icon: <Trash2 className="h-4 w-4" />,
            destructive: true,
            onSelect: () => setDeleteId(row.id),
          });
        }
        if (items.length === 0) return null;
        return <AdminActionMenu items={items} label="Gallery item actions" />;
      },
    },
  ];

  const drawerTitle = editing === "new" ? "New gallery item" : "Edit gallery item";
  const drawerFooter = (
    <AdminDrawerFooter className="gap-2">
      <Button type="button" variant="outline" className="border-border" onClick={() => setOpen(false)}>
        Cancel
      </Button>
      <Button type="button" className="bg-primary text-primary-foreground hover:bg-primary/90" disabled={pending || !canEdit} onClick={() => void save()}>
        Save
      </Button>
    </AdminDrawerFooter>
  );

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Gallery"
        description="Marketing gallery imagery — remote URLs or public paths until object storage is wired in."
        actions={
          canEdit ? (
            <Button type="button" className="rounded-xl bg-primary text-primary-foreground shadow-sm hover:bg-primary/90" onClick={openNew}>
              <Plus className="h-4 w-4" />
              Add image
            </Button>
          ) : null
        }
      />

      {rows.length === 0 ? (
        <AdminEmptyState
          title="Gallery is empty"
          description="Add images with captions and alt text for the public gallery grid."
          action={
            canEdit ? (
              <Button type="button" className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90" onClick={openNew}>
                Add image
              </Button>
            ) : null
          }
        />
      ) : (
        <AdminDataTable<GalleryItem>
          rows={rows}
          columns={columns}
          getRowId={(r) => r.id}
          searchPlaceholder="Search caption, alt, URL…"
          searchKeys={(r) => [r.caption, r.alt, r.src, r.imageUrl ?? ""]}
          filterOptions={[
            { value: "live", label: "Published", predicate: (r) => r.published },
            { value: "draft", label: "Draft", predicate: (r) => !r.published },
          ]}
          pageSize={12}
          emptyState={<p className="text-sm text-muted-foreground">No rows match filters.</p>}
        />
      )}

      <AdminDrawer open={open} onOpenChange={setOpen}>
        <AdminDrawerContent title={drawerTitle} size="lg" footer={drawerFooter}>
          <GalleryFormDrawerContent values={formValues} onChange={patchForm} disabled={!canEdit} />
        </AdminDrawerContent>
      </AdminDrawer>

      <AlertDialog open={Boolean(deleteId)} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="border-border bg-background text-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">Remove gallery image?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">This will remove the image from the public gallery.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border bg-muted/50 text-foreground">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600"
              onClick={(e) => {
                e.preventDefault();
                void confirmDelete();
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
