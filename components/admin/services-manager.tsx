"use client";

import * as React from "react";
import type { Role, Service as PrismaServiceModel } from "@prisma/client";
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
import { deleteServiceAction, upsertServiceAction } from "@/lib/actions/services";
import { parseJsonStringArray } from "@/lib/data/cms/json-fields";
import { safeJsonParse } from "@/lib/utils/safe-json-parse";
import { canDeleteContent, canMutateContent } from "@/lib/permissions";
import { ServicesFormDrawerContent, type ServiceFormValues } from "@/components/admin/services-form-drawer-content";
import { AdminHeader } from "@/components/admin/ui/admin-header";
import { AdminDataTable, type AdminTableColumn } from "@/components/admin/ui/admin-data-table";
import { AdminDrawer, AdminDrawerContent, AdminDrawerFooter } from "@/components/admin/ui/admin-drawer";
import { AdminBadge } from "@/components/admin/ui/admin-badge";
import { AdminEmptyState } from "@/components/admin/ui/admin-empty-state";
import { AdminActionMenu, type AdminActionMenuEntry } from "@/components/admin/ui/admin-action-menu";

type Row = PrismaServiceModel;

function parseLines(s: string) {
  return s
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

function heroSrc(row: Row) {
  return row.imageUrl?.trim() || row.heroImage;
}

export function ServicesManager({ rows, role }: { rows: Row[]; role: Role }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const canEdit = canMutateContent(role);
  const canDelete = canDeleteContent(role);
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Row | "new" | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState(false);

  const [slug, setSlug] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [shortDescription, setShortDescription] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [iconKey, setIconKey] = React.useState<string>("snowflake");
  const [highlights, setHighlights] = React.useState("");
  const [idealFor, setIdealFor] = React.useState("");
  const [heroImage, setHeroImage] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState("");
  const [heroImageAlt, setHeroImageAlt] = React.useState("");
  const [published, setPublished] = React.useState(true);
  const [category, setCategory] = React.useState("General");
  const [faqJson, setFaqJson] = React.useState("[]");
  const [pricingNote, setPricingNote] = React.useState("");
  const [seoTitle, setSeoTitle] = React.useState("");
  const [seoDescription, setSeoDescription] = React.useState("");
  const [slugAuto, setSlugAuto] = React.useState(true);

  const formValues: ServiceFormValues = {
    slug,
    title,
    shortDescription,
    description,
    iconKey,
    highlights,
    idealFor,
    heroImage,
    imageUrl,
    heroImageAlt,
    published,
    category,
    faqJson,
    pricingNote,
    seoTitle,
    seoDescription,
  };

  function patchForm(patch: Partial<ServiceFormValues>) {
    if (patch.slug !== undefined) setSlug(patch.slug);
    if (patch.title !== undefined) setTitle(patch.title);
    if (patch.shortDescription !== undefined) setShortDescription(patch.shortDescription);
    if (patch.description !== undefined) setDescription(patch.description);
    if (patch.iconKey !== undefined) setIconKey(patch.iconKey);
    if (patch.highlights !== undefined) setHighlights(patch.highlights);
    if (patch.idealFor !== undefined) setIdealFor(patch.idealFor);
    if (patch.heroImage !== undefined) setHeroImage(patch.heroImage);
    if (patch.imageUrl !== undefined) setImageUrl(patch.imageUrl);
    if (patch.heroImageAlt !== undefined) setHeroImageAlt(patch.heroImageAlt);
    if (patch.published !== undefined) setPublished(patch.published);
    if (patch.category !== undefined) setCategory(patch.category);
    if (patch.faqJson !== undefined) setFaqJson(patch.faqJson);
    if (patch.pricingNote !== undefined) setPricingNote(patch.pricingNote);
    if (patch.seoTitle !== undefined) setSeoTitle(patch.seoTitle);
    if (patch.seoDescription !== undefined) setSeoDescription(patch.seoDescription);
  }

  React.useEffect(() => {
    if (searchParams.get("new") === "1" && canEdit) {
      openNew();
      router.replace("/admin/services");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- open ?new= once
  }, []);

  function openNew() {
    setEditing("new");
    setSlug("");
    setTitle("");
    setShortDescription("");
    setDescription("");
    setIconKey("snowflake");
    setHighlights("");
    setIdealFor("");
    setHeroImage(
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=2000&q=80",
    );
    setImageUrl("");
    setHeroImageAlt("");
    setPublished(true);
    setCategory("General");
    setFaqJson("[]");
    setPricingNote("");
    setSeoTitle("");
    setSeoDescription("");
    setSlugAuto(true);
    setOpen(true);
  }

  function openEdit(row: Row) {
    setEditing(row);
    setSlug(row.slug);
    setTitle(row.title);
    setShortDescription(row.shortDescription);
    setDescription(row.description);
    setIconKey(row.iconKey);
    setHighlights(parseJsonStringArray(row.highlights).join("\n"));
    setIdealFor(parseJsonStringArray(row.idealFor).join("\n"));
    setHeroImage(row.heroImage);
    setImageUrl(row.imageUrl ?? "");
    setHeroImageAlt(row.heroImageAlt);
    setPublished(row.published);
    setCategory(row.category || "General");
    const parsed = safeJsonParse<unknown>(row.faqJson ?? "[]", []);
    setFaqJson(JSON.stringify(Array.isArray(parsed) ? parsed : [], null, 2));
    setPricingNote(row.pricingNote ?? "");
    setSeoTitle(row.seoTitle ?? "");
    setSeoDescription(row.seoDescription ?? "");
    setSlugAuto(false);
    setOpen(true);
  }

  async function save() {
    const v = safeJsonParse<unknown>(faqJson || "[]", null);
    if (!Array.isArray(v)) {
      toast.error("FAQ must be a JSON array");
      return;
    }
    const faq = v.filter((x): x is { q: string; a: string } => {
      if (!x || typeof x !== "object") return false;
      const o = x as { q?: unknown; a?: unknown };
      return typeof o.q === "string" && typeof o.a === "string";
    });

    setPending(true);
    const payload = {
      id: editing !== "new" && editing ? editing.id : undefined,
      slug,
      title,
      shortDescription,
      description,
      iconKey,
      highlights: parseLines(highlights),
      idealFor: parseLines(idealFor),
      heroImage,
      imageUrl: imageUrl.trim() === "" ? null : imageUrl,
      heroImageAlt,
      published,
      category,
      faq,
      pricingNote: pricingNote.trim() === "" ? "" : pricingNote.trim(),
      seoTitle: seoTitle.trim() === "" ? "" : seoTitle.trim(),
      seoDescription: seoDescription.trim() === "" ? "" : seoDescription.trim(),
    };
    const res = await upsertServiceAction(payload);
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
    const res = await deleteServiceAction({ id: deleteId });
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
      id: "thumb",
      header: "",
      className: "w-16",
      cell: (row) => (
        <div className="h-11 w-14 overflow-hidden rounded-lg border border-border bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element -- admin CMS */}
          <img src={heroSrc(row)} alt="" className="h-full w-full object-cover" loading="lazy" />
        </div>
      ),
    },
    {
      id: "title",
      header: "Service",
      sortable: true,
      sortValue: (r) => r.title,
      cell: (r) => (
        <div>
          <div className="font-semibold text-foreground">{r.title}</div>
          <div className="font-mono text-xs text-muted-foreground">{r.slug}</div>
        </div>
      ),
    },
    {
      id: "icon",
      header: "Icon",
      sortable: true,
      sortValue: (r) => r.iconKey,
      cell: (r) => <AdminBadge variant="default">{r.iconKey}</AdminBadge>,
    },
    {
      id: "summary",
      header: "Summary",
      sortable: true,
      sortValue: (r) => r.shortDescription,
      cell: (r) => <span className="line-clamp-2 max-w-xs text-sm text-muted-foreground">{r.shortDescription}</span>,
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
        if (canDelete) {
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
        return <AdminActionMenu items={items} label={`Actions for ${row.title}`} />;
      },
    },
  ];

  const drawerTitle = editing === "new" ? "New service" : "Edit service";
  const drawerFooter = (
    <AdminDrawerFooter className="gap-2">
      <Button type="button" variant="outline" className="border-border" onClick={() => setOpen(false)}>
        Cancel
      </Button>
      <Button type="button" className="bg-primary text-primary-foreground hover:bg-primary/90" disabled={pending || !canEdit} onClick={() => void save()}>
        Save service
      </Button>
    </AdminDrawerFooter>
  );

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Services"
        description="Content shown on the public services index and detail pages — hero imagery, copy, and publish state."
        actions={
          canEdit ? (
            <Button type="button" className="rounded-xl bg-primary text-primary-foreground shadow-sm hover:bg-primary/90" onClick={openNew}>
              <Plus className="h-4 w-4" />
              Add service
            </Button>
          ) : null
        }
      />

      {rows.length === 0 ? (
        <AdminEmptyState
          title="No services yet"
          description="Add your first service page to power the public HVAC services section."
          action={
            canEdit ? (
              <Button type="button" className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90" onClick={openNew}>
                Add service
              </Button>
            ) : null
          }
        />
      ) : (
        <AdminDataTable<Row>
          rows={rows}
          columns={columns}
          getRowId={(r) => r.id}
          searchPlaceholder="Search title, slug, summary…"
          searchKeys={(r) => [r.title, r.slug, r.shortDescription, r.description, r.iconKey]}
          filterOptions={[
            { value: "live", label: "Published", predicate: (r) => r.published },
            { value: "draft", label: "Draft", predicate: (r) => !r.published },
          ]}
          pageSize={10}
          emptyState={<p className="text-sm text-muted-foreground">No rows match filters.</p>}
        />
      )}

      <AdminDrawer open={open} onOpenChange={setOpen}>
        <AdminDrawerContent title={drawerTitle} size="xl" footer={drawerFooter}>
          <ServicesFormDrawerContent values={formValues} onChange={patchForm} slugAuto={slugAuto} onSlugAutoChange={setSlugAuto} disabled={!canEdit} />
        </AdminDrawerContent>
      </AdminDrawer>

      <AlertDialog open={Boolean(deleteId)} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="border-border bg-background text-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">Delete service?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This removes the service from the public website. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border bg-muted/50 text-foreground">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-500"
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
