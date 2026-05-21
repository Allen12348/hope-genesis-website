"use client";

import * as React from "react";
import type { BlogPost as PrismaBlog, Role } from "@prisma/client";
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
import { deleteBlogPostAction, upsertBlogPostAction } from "@/lib/actions/blog";
import { canDeleteContent, canMutateContent } from "@/lib/permissions";
import { BlogFormDrawerContent, type BlogFormValues } from "@/components/admin/blog-form-drawer-content";
import { parseJsonStringArray } from "@/lib/data/cms/json-fields";
import { safeJsonParse } from "@/lib/utils/safe-json-parse";
import { blogEditorialCategories } from "@/lib/services/marketing/constants";
import { AdminHeader } from "@/components/admin/ui/admin-header";
import { AdminDataTable, type AdminTableColumn } from "@/components/admin/ui/admin-data-table";
import { AdminDrawer, AdminDrawerContent, AdminDrawerFooter } from "@/components/admin/ui/admin-drawer";
import { AdminBadge } from "@/components/admin/ui/admin-badge";
import { AdminEmptyState } from "@/components/admin/ui/admin-empty-state";
import { AdminActionMenu, type AdminActionMenuEntry } from "@/components/admin/ui/admin-action-menu";

type Row = PrismaBlog;

function coverSrc(row: Row) {
  return row.coverImageUrl?.trim() || row.coverImage;
}

export function BlogManager({ rows, role }: { rows: Row[]; role: Role }) {
  const router = useRouter();
  const canEdit = canMutateContent(role);
  const canDel = canDeleteContent(role);
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Row | "new" | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState(false);
  const [slug, setSlug] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [category, setCategory] = React.useState<(typeof blogEditorialCategories)[number]>("Buying Guide");
  const [publishedAt, setPublishedAt] = React.useState("");
  const [readingMinutes, setReadingMinutes] = React.useState(6);
  const [featured, setFeatured] = React.useState(false);
  const [coverImage, setCoverImage] = React.useState("");
  const [coverImageUrl, setCoverImageUrl] = React.useState("");
  const [coverAlt, setCoverAlt] = React.useState("");
  const [body, setBody] = React.useState("");
  const [published, setPublished] = React.useState(true);
  const [tags, setTags] = React.useState("");
  const [metaTitle, setMetaTitle] = React.useState("");
  const [metaDescription, setMetaDescription] = React.useState("");
  const [slugAuto, setSlugAuto] = React.useState(true);

  function openNew() {
    setEditing("new");
    setSlug("");
    setTitle("");
    setDescription("");
    setCategory("Buying Guide");
    setPublishedAt(new Date().toISOString().slice(0, 10));
    setReadingMinutes(6);
    setFeatured(false);
    setCoverImage("https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1600&q=80");
    setCoverImageUrl("");
    setCoverAlt("");
    setBody("");
    setPublished(true);
    setTags("");
    setMetaTitle("");
    setMetaDescription("");
    setSlugAuto(true);
    setOpen(true);
  }

  function openEdit(row: Row) {
    setEditing(row);
    setSlug(row.slug);
    setTitle(row.title);
    setDescription(row.description);
    setCategory(
      blogEditorialCategories.includes(row.category as (typeof blogEditorialCategories)[number])
        ? (row.category as (typeof blogEditorialCategories)[number])
        : blogEditorialCategories[0],
    );
    setPublishedAt(row.publishedAt);
    setReadingMinutes(row.readingMinutes);
    setFeatured(row.featured);
    setCoverImage(row.coverImage);
    setCoverImageUrl(row.coverImageUrl ?? "");
    setCoverAlt(row.coverAlt);
    setBody(parseJsonStringArray(row.body).join("\n\n"));
    setPublished(row.published);
    const t = safeJsonParse<unknown>(row.tags || "[]", []);
    setTags(Array.isArray(t) ? t.filter((x): x is string => typeof x === "string").join(", ") : "");
    setMetaTitle(row.metaTitle ?? "");
    setMetaDescription(row.metaDescription ?? "");
    setSlugAuto(false);
    setOpen(true);
  }

  const formValues: BlogFormValues = {
    slug,
    title,
    description,
    category,
    publishedAt,
    readingMinutes,
    featured,
    coverImage,
    coverImageUrl,
    coverAlt,
    body,
    published,
    tags,
    metaTitle,
    metaDescription,
  };

  function patchForm(patch: Partial<BlogFormValues>) {
    if (patch.slug !== undefined) setSlug(patch.slug);
    if (patch.title !== undefined) setTitle(patch.title);
    if (patch.description !== undefined) setDescription(patch.description);
    if (patch.category !== undefined) setCategory(patch.category);
    if (patch.publishedAt !== undefined) setPublishedAt(patch.publishedAt);
    if (patch.readingMinutes !== undefined) setReadingMinutes(patch.readingMinutes);
    if (patch.featured !== undefined) setFeatured(patch.featured);
    if (patch.coverImage !== undefined) setCoverImage(patch.coverImage);
    if (patch.coverImageUrl !== undefined) setCoverImageUrl(patch.coverImageUrl);
    if (patch.coverAlt !== undefined) setCoverAlt(patch.coverAlt);
    if (patch.body !== undefined) setBody(patch.body);
    if (patch.published !== undefined) setPublished(patch.published);
    if (patch.tags !== undefined) setTags(patch.tags);
    if (patch.metaTitle !== undefined) setMetaTitle(patch.metaTitle);
    if (patch.metaDescription !== undefined) setMetaDescription(patch.metaDescription);
  }

  async function save() {
    setPending(true);
    const paragraphs = body
      .split(/\n\n+/)
      .map((p) => p.trim())
      .filter(Boolean);
    const res = await upsertBlogPostAction({
      id: editing !== "new" && editing ? editing.id : undefined,
      slug,
      title,
      description,
      category,
      publishedAt,
      readingMinutes,
      featured,
      coverImage,
      coverImageUrl: coverImageUrl.trim() === "" ? null : coverImageUrl,
      coverAlt,
      body: paragraphs,
      published,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      metaTitle: metaTitle.trim() === "" ? "" : metaTitle.trim(),
      metaDescription: metaDescription.trim() === "" ? "" : metaDescription.trim(),
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
    const res = await deleteBlogPostAction({ id: deleteId });
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
          <img src={coverSrc(row)} alt="" className="h-full w-full object-cover" loading="lazy" />
        </div>
      ),
    },
    {
      id: "title",
      header: "Post",
      sortable: true,
      sortValue: (r) => r.title,
      cell: (r) => (
        <div>
          <div className="line-clamp-2 font-semibold text-foreground">{r.title}</div>
          <div className="font-mono text-xs text-muted-foreground">{r.slug}</div>
        </div>
      ),
    },
    {
      id: "category",
      header: "Category",
      sortable: true,
      sortValue: (r) => r.category,
      cell: (r) => <AdminBadge variant="navy">{r.category}</AdminBadge>,
    },
    {
      id: "date",
      header: "Date",
      sortable: true,
      sortValue: (r) => r.publishedAt,
      cell: (r) => <span className="text-sm text-muted-foreground">{r.publishedAt}</span>,
    },
    {
      id: "flags",
      header: "Flags",
      cell: (r) => (
        <div className="flex flex-wrap gap-1">
          {r.featured ? <AdminBadge variant="accent">Featured</AdminBadge> : null}
          <AdminBadge variant={r.published ? "success" : "warning"}>{r.published ? "Live" : "Draft"}</AdminBadge>
        </div>
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
        return <AdminActionMenu items={items} label={`Actions for ${row.title}`} />;
      },
    },
  ];

  const drawerTitle = editing === "new" ? "New post" : "Edit post";
  const drawerFooter = (
    <AdminDrawerFooter className="gap-2">
      <Button type="button" variant="outline" className="border-border" onClick={() => setOpen(false)}>
        Cancel
      </Button>
      <Button type="button" className="bg-primary text-primary-foreground hover:bg-primary/90" disabled={pending || !canEdit} onClick={() => void save()}>
        Save post
      </Button>
    </AdminDrawerFooter>
  );

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Blog"
        description="Editorial posts for the marketing blog — scheduling, covers, and publish state."
        actions={
          canEdit ? (
            <Button type="button" className="rounded-xl bg-primary text-primary-foreground shadow-sm hover:bg-primary/90" onClick={openNew}>
              <Plus className="h-4 w-4" />
              New post
            </Button>
          ) : null
        }
      />

      {rows.length === 0 ? (
        <AdminEmptyState
          title="No blog posts"
          description="Create articles for SEO and customer education on the public blog."
          action={
            canEdit ? (
              <Button type="button" className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90" onClick={openNew}>
                New post
              </Button>
            ) : null
          }
        />
      ) : (
        <AdminDataTable<Row>
          rows={rows}
          columns={columns}
          getRowId={(r) => r.id}
          searchPlaceholder="Search title, slug, category…"
          searchKeys={(r) => [r.title, r.slug, r.category, r.description]}
          filterOptions={[
            { value: "live", label: "Published", predicate: (r) => r.published },
            { value: "draft", label: "Draft", predicate: (r) => !r.published },
            { value: "featured", label: "Featured", predicate: (r) => r.featured },
          ]}
          pageSize={12}
          emptyState={<p className="text-sm text-muted-foreground">No rows match filters.</p>}
        />
      )}

      <AdminDrawer open={open} onOpenChange={setOpen}>
        <AdminDrawerContent title={drawerTitle} size="xl" footer={drawerFooter}>
          <BlogFormDrawerContent
            values={formValues}
            onChange={patchForm}
            slugAuto={slugAuto}
            onSlugAutoChange={setSlugAuto}
            disabled={!canEdit}
          />
        </AdminDrawerContent>
      </AdminDrawer>

      <AlertDialog open={Boolean(deleteId)} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="border-border bg-background text-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">Delete post?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">Removes the article from the public blog.</AlertDialogDescription>
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
