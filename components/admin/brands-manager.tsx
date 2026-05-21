"use client";

import * as React from "react";
import type { BrandPartner, Role } from "@prisma/client";
import { useRouter } from "next/navigation";
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
import { deleteBrandPartnerAction, upsertBrandPartnerAction } from "@/lib/actions/brands";
import { canDeleteContent, canMutateContent } from "@/lib/permissions";
import { BrandsFormDrawerContent, type BrandFormValues } from "@/components/admin/brands-form-drawer-content";
import { AdminHeader } from "@/components/admin/ui/admin-header";
import { AdminDataTable, type AdminTableColumn } from "@/components/admin/ui/admin-data-table";
import { AdminDrawer, AdminDrawerContent, AdminDrawerFooter } from "@/components/admin/ui/admin-drawer";
import { AdminBadge } from "@/components/admin/ui/admin-badge";
import { AdminEmptyState } from "@/components/admin/ui/admin-empty-state";
import { AdminActionMenu, type AdminActionMenuEntry } from "@/components/admin/ui/admin-action-menu";

type Row = BrandPartner;

export function BrandsManager({ rows, role }: { rows: Row[]; role: Role }) {
  const router = useRouter();
  const canEdit = canMutateContent(role);
  const canDel = canDeleteContent(role);
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Row | "new" | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState(false);
  const [slug, setSlug] = React.useState("");
  const [name, setName] = React.useState("");
  const [monogram, setMonogram] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState("");
  const [imageAlt, setImageAlt] = React.useState("");
  const [published, setPublished] = React.useState(true);
  const [description, setDescription] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [featured, setFeatured] = React.useState(false);
  const [slugAuto, setSlugAuto] = React.useState(true);

  const formValues: BrandFormValues = { slug, name, monogram, imageUrl, imageAlt, published, description, category, featured };

  function patchForm(patch: Partial<BrandFormValues>) {
    if (patch.slug !== undefined) setSlug(patch.slug);
    if (patch.name !== undefined) setName(patch.name);
    if (patch.monogram !== undefined) setMonogram(patch.monogram);
    if (patch.imageUrl !== undefined) setImageUrl(patch.imageUrl);
    if (patch.imageAlt !== undefined) setImageAlt(patch.imageAlt);
    if (patch.published !== undefined) setPublished(patch.published);
    if (patch.description !== undefined) setDescription(patch.description);
    if (patch.category !== undefined) setCategory(patch.category);
    if (patch.featured !== undefined) setFeatured(patch.featured);
  }

  function openNew() {
    setEditing("new");
    setSlug("");
    setName("");
    setMonogram("");
    setImageUrl("");
    setImageAlt("");
    setPublished(true);
    setDescription("");
    setCategory("");
    setFeatured(false);
    setSlugAuto(true);
    setOpen(true);
  }

  function openEdit(row: Row) {
    setEditing(row);
    setSlug(row.slug);
    setName(row.name);
    setMonogram(row.monogram);
    setImageUrl(row.imageUrl ?? "");
    setImageAlt(row.imageAlt ?? "");
    setPublished(row.published);
    setDescription(row.description ?? "");
    setCategory(row.category ?? "");
    setFeatured(row.featured);
    setSlugAuto(false);
    setOpen(true);
  }

  async function save() {
    setPending(true);
    const res = await upsertBrandPartnerAction({
      id: editing !== "new" && editing ? editing.id : undefined,
      slug,
      name,
      monogram,
      imageUrl: imageUrl.trim() === "" ? null : imageUrl,
      imageAlt: imageAlt.trim() === "" ? null : imageAlt,
      published,
      description: description.trim() === "" ? "" : description.trim(),
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
    const res = await deleteBrandPartnerAction({ id: deleteId });
    setPending(false);
    setDeleteId(null);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success(res.message ?? "Deleted");
    router.refresh();
  }

  const columns: AdminTableColumn<Row>[] = [
    {
      id: "mark",
      header: "",
      className: "w-14",
      cell: (row) => (
        <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted text-xs font-bold text-foreground">
          {row.imageUrl?.trim() ? (
            // eslint-disable-next-line @next/next/no-img-element -- admin CMS
            <img src={row.imageUrl.trim()} alt="" className="h-full w-full object-contain p-1" loading="lazy" />
          ) : (
            <span className="font-display">{row.monogram.slice(0, 3)}</span>
          )}
        </div>
      ),
    },
    {
      id: "name",
      header: "Partner",
      sortable: true,
      sortValue: (r) => r.name,
      cell: (r) => (
        <div>
          <div className="font-semibold text-foreground">{r.name}</div>
          <div className="font-mono text-xs text-muted-foreground">{r.slug}</div>
        </div>
      ),
    },
    {
      id: "monogram",
      header: "Monogram",
      sortable: true,
      sortValue: (r) => r.monogram,
      cell: (r) => <AdminBadge variant="navy">{r.monogram}</AdminBadge>,
    },
    {
      id: "order",
      header: "Sort",
      sortable: true,
      sortValue: (r) => r.sortOrder,
      cell: (r) => <span className="font-mono text-sm text-muted-foreground">{r.sortOrder}</span>,
    },
    {
      id: "published",
      header: "Status",
      sortable: true,
      sortValue: (r) => (r.published ? 1 : 0),
      cell: (r) => (
        <AdminBadge variant={r.published ? "success" : "warning"}>{r.published ? "Live" : "Hidden"}</AdminBadge>
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
        return <AdminActionMenu items={items} label={`Actions for ${row.name}`} />;
      },
    },
  ];

  const drawerTitle = editing === "new" ? "New brand" : "Edit brand";
  const drawerFooter = (
    <AdminDrawerFooter className="gap-2">
      <Button type="button" variant="outline" className="border-border" onClick={() => setOpen(false)}>
        Cancel
      </Button>
      <Button type="button" className="bg-primary text-primary-foreground hover:bg-primary/90" disabled={pending || !canEdit} onClick={() => void save()}>
        Save brand
      </Button>
    </AdminDrawerFooter>
  );

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Brand logos"
        description="Partner marks on the homepage and brands page. Optional remote logo overrides the monogram."
        actions={
          canEdit ? (
            <Button type="button" className="rounded-xl bg-primary text-primary-foreground shadow-sm hover:bg-primary/90" onClick={openNew}>
              <Plus className="h-4 w-4" />
              Add brand
            </Button>
          ) : null
        }
      />

      {rows.length === 0 ? (
        <AdminEmptyState
          title="No brand partners"
          description="Add manufacturer or partner logos for the trust row on the marketing site."
          action={
            canEdit ? (
              <Button type="button" className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90" onClick={openNew}>
                Add brand
              </Button>
            ) : null
          }
        />
      ) : (
        <AdminDataTable<Row>
          rows={rows}
          columns={columns}
          getRowId={(r) => r.id}
          searchPlaceholder="Search name or slug…"
          searchKeys={(r) => [r.name, r.slug, r.monogram]}
          filterOptions={[
            { value: "live", label: "Published", predicate: (r) => r.published },
            { value: "draft", label: "Hidden", predicate: (r) => !r.published },
          ]}
          pageSize={12}
          emptyState={<p className="text-sm text-muted-foreground">No rows match filters.</p>}
        />
      )}

      <AdminDrawer open={open} onOpenChange={setOpen}>
        <AdminDrawerContent title={drawerTitle} size="lg" footer={drawerFooter}>
          <BrandsFormDrawerContent values={formValues} onChange={patchForm} slugAuto={slugAuto} onSlugAutoChange={setSlugAuto} disabled={!canEdit} />
        </AdminDrawerContent>
      </AdminDrawer>

      <AlertDialog open={Boolean(deleteId)} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="border-border bg-background text-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">Delete brand?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">Removes this partner from the public site.</AlertDialogDescription>
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
