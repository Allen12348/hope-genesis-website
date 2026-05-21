"use client";

import * as React from "react";
import type { Project as PrismaProject, Role, Testimonial } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { LayoutGrid, Pencil, Plus, Search, Table2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { deleteProjectAction, upsertProjectAction } from "@/lib/actions/projects";
import { canDeleteContent, canMutateContent } from "@/lib/permissions";
import { AdminHeader } from "@/components/admin/ui/admin-header";
import { AdminCard } from "@/components/admin/ui/admin-card";
import { AdminBadge } from "@/components/admin/ui/admin-badge";
import { AdminEmptyState } from "@/components/admin/ui/admin-empty-state";
import { AdminDataTable, type AdminTableColumn } from "@/components/admin/ui/admin-data-table";
import { AdminDrawer, AdminDrawerContent, AdminDrawerFooter } from "@/components/admin/ui/admin-drawer";
import { AdminActionMenu, type AdminActionMenuEntry } from "@/components/admin/ui/admin-action-menu";
import {
  ProjectFormDrawerContent,
  runProjectFormValidation,
  type ProjectFormValues,
} from "@/components/admin/project-form-drawer-content";
import { PROJECT_CATEGORIES } from "@/lib/cms/project-categories";
import type { ProjectFormErrors } from "@/lib/cms/project-form-validation";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { parseJsonStringArray, parseProjectStatsJson } from "@/lib/data/cms/json-fields";
import { normalizeProjectStatus, PROJECT_STATUSES, PROJECT_STATUS_LABELS } from "@/lib/cms/project-status";
import { ExternalLink, Star } from "lucide-react";
import { cn } from "@/lib/utils";

function emptyProjectForm(): ProjectFormValues {
  return {
    slug: "",
    title: "",
    category: "Commercial",
    location: "",
    year: String(new Date().getFullYear()),
    summary: "",
    scope: "",
    image: "",
    imageUrl: "",
    imageAlt: "",
    galleryImageUrls: [],
    beforeImage: "",
    afterImage: "",
    beforeImageUrl: "",
    afterImageUrl: "",
    equipmentUsed: "",
    installationDuration: "",
    challenge: "",
    solution: "",
    results: "",
    published: true,
    featured: false,
    clientLabel: "",
    status: "completed",
    stats: [],
    testimonialId: "",
    sortOrder: 0,
  };
}

type Row = PrismaProject;

function lines(s: string) {
  return s
    .split("\n")
    .map((l) => l.replace(/^[\s•\-*]+/, "").trim())
    .filter(Boolean);
}

function coverSrc(row: Row): string | undefined {
  const url = row.imageUrl?.trim();
  if (url) return url;
  return row.image ?? undefined;
}

export function ProjectsManager({
  rows,
  role,
  testimonials = [],
}: {
  rows: Row[];
  role: Role;
  testimonials?: Testimonial[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const canEdit = canMutateContent(role);
  const canDel = canDeleteContent(role);
  const [q, setQ] = React.useState("");
  const dq = useDebouncedValue(q, 220);
  const [catFilter, setCatFilter] = React.useState<string>("all");
  const [pubFilter, setPubFilter] = React.useState<string>("all");
  const [featuredFilter, setFeaturedFilter] = React.useState<string>("all");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [view, setView] = React.useState<"table" | "grid">("table");
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Row | "new" | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = React.useState(false);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [pending, setPending] = React.useState(false);
  const [gridPage, setGridPage] = React.useState(0);
  const gridPageSize = 8;

  const [form, setForm] = React.useState<ProjectFormValues>(emptyProjectForm);
  const [slugAuto, setSlugAuto] = React.useState(true);
  const [formErrors, setFormErrors] = React.useState<ProjectFormErrors>({});

  React.useEffect(() => {
    if (searchParams.get("new") === "1" && canEdit) {
      openNew();
      router.replace("/admin/projects");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- open ?new= once
  }, []);

  React.useEffect(() => {
    setGridPage(0);
  }, [dq, catFilter, pubFilter, rows.length]);

  function openNew() {
    setEditing("new");
    setForm(emptyProjectForm());
    setSlugAuto(true);
    setFormErrors({});
    setOpen(true);
  }

  function openEdit(row: Row) {
    setEditing(row);
    const scopeItems = parseJsonStringArray(row.scope);
    setForm({
      slug: row.slug,
      title: row.title,
      category: (PROJECT_CATEGORIES.includes(row.category as ProjectFormValues["category"])
        ? row.category
        : "Commercial") as ProjectFormValues["category"],
      location: row.location ?? "",
      year: row.year ?? "",
      summary: row.summary ?? "",
      scope: scopeItems.map((s) => `• ${s}`).join("\n"),
      image: row.image ?? "",
      imageUrl: row.imageUrl ?? "",
      imageAlt: row.imageAlt ?? "",
      galleryImageUrls: parseJsonStringArray(row.galleryImageUrls),
      beforeImage: row.beforeImage ?? "",
      afterImage: row.afterImage ?? "",
      beforeImageUrl: row.beforeImageUrl ?? "",
      afterImageUrl: row.afterImageUrl ?? "",
      equipmentUsed: parseJsonStringArray(row.equipmentUsed).join("\n"),
      installationDuration: row.installationDuration ?? "",
      challenge: row.challenge ?? "",
      solution: row.solution ?? "",
      results: parseJsonStringArray(row.results).join("\n"),
      published: row.published,
      featured: row.featured,
      clientLabel: row.clientLabel ?? "",
      status: normalizeProjectStatus(row.status),
      stats: parseProjectStatsJson(row.statsJson),
      testimonialId: row.testimonialId ?? "",
      sortOrder: row.sortOrder,
    });
    setSlugAuto(false);
    setFormErrors({});
    setOpen(true);
  }

  const processed = React.useMemo(() => {
    const needle = dq.trim().toLowerCase();
    return rows
      .filter((r) => {
        if (needle) {
          const hay = `${r.title} ${r.slug} ${r.category} ${r.location}`.toLowerCase();
          if (!hay.includes(needle)) return false;
        }
        if (catFilter !== "all" && r.category !== catFilter) return false;
        if (pubFilter === "live" && !r.published) return false;
        if (pubFilter === "draft" && r.published) return false;
        if (featuredFilter === "featured" && !r.featured) return false;
        if (featuredFilter === "standard" && r.featured) return false;
        if (statusFilter !== "all" && normalizeProjectStatus(r.status) !== statusFilter) return false;
        return true;
      })
      .sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title));
  }, [rows, dq, catFilter, pubFilter, featuredFilter, statusFilter]);

  const stats = React.useMemo(() => {
    const publishedN = rows.filter((r) => r.published).length;
    return {
      total: rows.length,
      published: publishedN,
      draft: rows.length - publishedN,
    };
  }, [rows]);

  const gridSlice = React.useMemo(() => {
    const start = gridPage * gridPageSize;
    return processed.slice(start, start + gridPageSize);
  }, [processed, gridPage]);
  const gridPageCount = Math.max(1, Math.ceil(processed.length / gridPageSize));

  async function save() {
    if (!runProjectFormValidation(form, setFormErrors)) {
      toast.error("Please fix the highlighted fields.");
      return;
    }
    setPending(true);
    const imageAlt = form.imageAlt.trim() || form.title.trim();
    const res = await upsertProjectAction({
      id: editing !== "new" && editing ? editing.id : undefined,
      slug: form.slug.trim(),
      title: form.title.trim(),
      category: form.category,
      location: form.location.trim(),
      year: form.year.trim(),
      summary: form.summary.trim(),
      scope: lines(form.scope),
      image: form.image.trim(),
      imageUrl: form.imageUrl.trim() === "" ? null : form.imageUrl.trim(),
      imageAlt,
      beforeImage: form.beforeImage.trim() || undefined,
      afterImage: form.afterImage.trim() || undefined,
      beforeImageUrl: form.beforeImageUrl.trim() === "" ? null : form.beforeImageUrl.trim(),
      afterImageUrl: form.afterImageUrl.trim() === "" ? null : form.afterImageUrl.trim(),
      galleryImageUrls: form.galleryImageUrls.map((u) => u.trim()).filter(Boolean).length
        ? form.galleryImageUrls.map((u) => u.trim()).filter(Boolean)
        : undefined,
      equipmentUsed: lines(form.equipmentUsed),
      installationDuration: form.installationDuration,
      challenge: form.challenge,
      solution: form.solution,
      results: lines(form.results),
      published: form.published,
      featured: form.featured,
      clientLabel: form.clientLabel.trim() === "" ? "" : form.clientLabel.trim(),
      status: form.status,
      stats: form.stats.filter((s) => s.label.trim() && s.value.trim()),
      testimonialId: form.testimonialId.trim() === "" ? null : form.testimonialId.trim(),
      sortOrder: form.sortOrder,
    });
    setPending(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success(editing === "new" ? "Project created successfully" : "Project updated successfully");
    setOpen(false);
    setFormErrors({});
    router.refresh();
  }

  async function confirmDelete() {
    if (!deleteId) return;
    setPending(true);
    const res = await deleteProjectAction({ id: deleteId });
    setPending(false);
    setDeleteId(null);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success(res.message ?? "Deleted");
    router.refresh();
  }

  async function confirmBulkDelete() {
    const ids = [...selectedIds];
    if (ids.length === 0) return;
    setPending(true);
    let ok = 0;
    for (const id of ids) {
      const res = await deleteProjectAction({ id });
      if (res.ok) ok++;
      else toast.error(res.error);
    }
    setPending(false);
    setBulkDeleteOpen(false);
    setSelectedIds([]);
    if (ok) toast.success(ok === ids.length ? "Selected projects removed" : `Removed ${ok} project(s)`);
    router.refresh();
  }

  const columns: AdminTableColumn<Row>[] = [
    {
        id: "thumb",
        header: "",
        className: "w-16",
        cell: (row) => (
          <div className="h-11 w-14 overflow-hidden rounded-lg border border-border bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element -- admin CMS preview */}
            <img src={coverSrc(row)} alt="" className="h-full w-full object-cover" loading="lazy" />
          </div>
        ),
      },
      {
        id: "title",
        header: "Project",
        sortable: true,
        sortValue: (r) => r.title,
        cell: (row) => (
          <div>
            <div className="font-semibold text-foreground">{row.title}</div>
            <div className="text-xs text-muted-foreground">{row.slug}</div>
          </div>
        ),
      },
      {
        id: "category",
        header: "Category",
        sortable: true,
        sortValue: (r) => r.category,
        cell: (row) => <AdminBadge variant="navy">{row.category}</AdminBadge>,
      },
      {
        id: "lifecycle",
        header: "Lifecycle",
        sortable: true,
        sortValue: (r) => r.status,
        cell: (row) => (
          <AdminBadge variant="default">{PROJECT_STATUS_LABELS[normalizeProjectStatus(row.status)]}</AdminBadge>
        ),
      },
      {
        id: "featured",
        header: "Featured",
        sortable: true,
        sortValue: (r) => (r.featured ? 1 : 0),
        cell: (row) =>
          row.featured ? (
            <Star className="h-4 w-4 fill-amber-400 text-amber-500" aria-label="Featured" />
          ) : (
            <span className="text-xs text-muted-foreground">—</span>
          ),
      },
      {
        id: "published",
        header: "Publish",
        sortable: true,
        sortValue: (r) => (r.published ? 1 : 0),
        cell: (row) => (
          <AdminBadge variant={row.published ? "success" : "warning"}>{row.published ? "Published" : "Draft"}</AdminBadge>
        ),
      },
      {
        id: "updated",
        header: "Updated",
        sortable: true,
        sortValue: (r) => r.updatedAt.getTime(),
        cell: (row) => (
          <span className="whitespace-nowrap text-xs text-muted-foreground">
            {row.updatedAt.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
          </span>
        ),
      },
      {
        id: "actions",
        header: "",
        headerClassName: "w-12 text-right",
        className: "text-right",
        cell: (row) => {
          const menuItems: AdminActionMenuEntry[] = [];
          if (canEdit) {
            menuItems.push({
              key: "edit",
              label: "Edit",
              icon: <Pencil className="h-4 w-4" />,
              onSelect: () => openEdit(row),
            });
          }
          if (canDel) {
            menuItems.push({ type: "separator", key: "s1" });
            menuItems.push({
              key: "del",
              label: "Delete",
              icon: <Trash2 className="h-4 w-4" />,
              destructive: true,
              onSelect: () => setDeleteId(row.id),
            });
          }
          if (menuItems.length === 0) return null;
          return <AdminActionMenu items={menuItems} label={`Actions for ${row.title}`} />;
        },
      },
    ];

  const drawerTitle = editing === "new" ? "New project" : "Edit project";

  const previewSlug = form.slug.trim();

  const drawerFooter = (
    <AdminDrawerFooter className="gap-2 sm:flex-wrap">
      {previewSlug ? (
        <Button type="button" variant="ghost" className="rounded-xl" asChild>
          <a href={`/projects/${previewSlug}`} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            {form.published ? "View live" : "Preview (publish to go live)"}
          </a>
        </Button>
      ) : null}
      <Button
        type="button"
        variant="outline"
        className="rounded-xl border-border/80"
        onClick={() => {
          setOpen(false);
          setFormErrors({});
        }}
      >
        Cancel
      </Button>
      <Button
        type="button"
        className="rounded-xl bg-sky-600 text-white shadow-sm hover:bg-sky-600/90"
        disabled={pending || !canEdit}
        onClick={() => void save()}
      >
        {pending ? "Saving…" : editing === "new" ? "Create project" : "Save changes"}
      </Button>
    </AdminDrawerFooter>
  );

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Projects"
        description="Case studies and portfolio work shown on the public site — manage publishing, imagery, and scope from one operations desk."
        actions={
          canEdit ? (
            <Button type="button" className="rounded-xl bg-primary text-primary-foreground shadow-sm hover:bg-primary/90" onClick={openNew}>
              <Plus className="mr-2 h-4 w-4" />
              Add project
            </Button>
          ) : null
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <AdminCard className="p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Library</p>
          <p className="mt-1 font-display text-2xl font-semibold tabular-nums text-foreground">{stats.total}</p>
          <p className="text-xs text-muted-foreground">Total case studies</p>
        </AdminCard>
        <AdminCard className="p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Live</p>
          <p className="mt-1 font-display text-2xl font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">{stats.published}</p>
          <p className="text-xs text-muted-foreground">Published to website</p>
        </AdminCard>
        <AdminCard className="p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Drafts</p>
          <p className="mt-1 font-display text-2xl font-semibold tabular-nums text-amber-700 dark:text-amber-300">{stats.draft}</p>
          <p className="text-xs text-muted-foreground">Unpublished / in review</p>
        </AdminCard>
      </div>

      {rows.length > 0 ? (
        <AdminCard className="p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Recent previews</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {rows
              .slice()
              .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
              .slice(0, 4)
              .map((row) => (
                <button
                  key={row.id}
                  type="button"
                  onClick={() => canEdit && openEdit(row)}
                  className={cn(
                    "overflow-hidden rounded-xl border border-border/80 bg-muted/20 text-left transition hover:border-accent/40 hover:bg-accent/5",
                    !canEdit && "cursor-default opacity-90",
                  )}
                >
                  <div className="aspect-[5/3] bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={coverSrc(row)} alt="" className="h-full w-full object-cover" loading="lazy" />
                  </div>
                  <div className="space-y-1 p-2">
                    <p className="line-clamp-2 text-xs font-semibold text-foreground">{row.title}</p>
                    <AdminBadge variant={row.published ? "success" : "warning"} className="text-[9px]">
                      {row.published ? "Live" : "Draft"}
                    </AdminBadge>
                  </div>
                </button>
              ))}
          </div>
        </AdminCard>
      ) : null}

      {rows.length === 0 ? (
        <AdminEmptyState
          title="No projects yet"
          description="Create your first case study to populate the public portfolio and this operations board."
          action={
            canEdit ? (
              <Button type="button" className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90" onClick={openNew}>
                Create your first project
              </Button>
            ) : null
          }
        />
      ) : (
        <Tabs value={view} onValueChange={(v) => setView(v as "table" | "grid")} className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <TabsList className="w-full max-w-md lg:w-auto">
              <TabsTrigger value="table" className="gap-2 rounded-lg px-4">
                <Table2 className="h-4 w-4" />
                Table
              </TabsTrigger>
              <TabsTrigger value="grid" className="gap-2 rounded-lg px-4">
                <LayoutGrid className="h-4 w-4" />
                Cards
              </TabsTrigger>
            </TabsList>
            <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
              <div className="relative max-w-md flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search projects…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="h-10 border-border bg-background pl-9"
                  aria-label="Search projects"
                />
              </div>
              <select
                className="h-10 rounded-xl border border-border bg-background px-3 text-sm font-medium"
                value={catFilter}
                onChange={(e) => setCatFilter(e.target.value)}
                aria-label="Filter by category"
              >
                <option value="all">All categories</option>
                {PROJECT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <select
                className="h-10 rounded-xl border border-border bg-background px-3 text-sm font-medium"
                value={pubFilter}
                onChange={(e) => setPubFilter(e.target.value)}
                aria-label="Filter by publish status"
              >
                <option value="all">All statuses</option>
                <option value="live">Published</option>
                <option value="draft">Draft</option>
              </select>
              <select
                className="h-10 rounded-xl border border-border bg-background px-3 text-sm font-medium"
                value={featuredFilter}
                onChange={(e) => setFeaturedFilter(e.target.value)}
                aria-label="Filter by featured"
              >
                <option value="all">All featured</option>
                <option value="featured">Featured only</option>
                <option value="standard">Not featured</option>
              </select>
              <select
                className="h-10 rounded-xl border border-border bg-background px-3 text-sm font-medium"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter by project status"
              >
                <option value="all">All job status</option>
                {PROJECT_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {PROJECT_STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <TabsContent value="table" className="mt-0 outline-none">
            <AdminDataTable<Row>
              rows={processed}
              columns={columns}
              getRowId={(r) => r.id}
              suppressToolbar
              pageSize={10}
              enableSelection={canDel}
              onSelectionChange={setSelectedIds}
              bulkActions={
                canDel ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-lg border-red-500/50 bg-red-600 text-white hover:bg-red-600/90 hover:text-white"
                    disabled={selectedIds.length === 0}
                    onClick={() => setBulkDeleteOpen(true)}
                  >
                    Delete selected ({selectedIds.length})
                  </Button>
                ) : null
              }
              emptyState={
                <div className="py-6 text-center">
                  <p className="text-sm font-medium text-foreground">No matches</p>
                  <p className="mt-1 text-xs text-muted-foreground">Adjust search or filters.</p>
                </div>
              }
            />
          </TabsContent>

          <TabsContent value="grid" className="mt-0 outline-none">
            {processed.length === 0 ? (
              <AdminCard className="p-10 text-center text-sm text-muted-foreground">No matches for this view.</AdminCard>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {gridSlice.map((row) => (
                    <AdminCard key={row.id} className="group overflow-hidden p-0">
                      <div className="relative aspect-[4/3] bg-muted">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={coverSrc(row)} alt="" className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]" loading="lazy" />
                        <div className="absolute left-2 top-2 flex flex-wrap gap-1">
                          <AdminBadge variant="navy" className="text-[9px]">
                            {row.category}
                          </AdminBadge>
                          <AdminBadge variant={row.published ? "success" : "warning"} className="text-[9px]">
                            {row.published ? "Live" : "Draft"}
                          </AdminBadge>
                        </div>
                      </div>
                      <div className="space-y-2 p-3">
                        <p className="line-clamp-2 font-display text-sm font-semibold text-foreground">{row.title}</p>
                        <p className="text-[11px] text-muted-foreground">{row.location}</p>
                        <div className="flex justify-end gap-1">
                          {canEdit ? (
                            <Button type="button" size="sm" variant="secondary" className="rounded-lg" onClick={() => openEdit(row)}>
                              Edit
                            </Button>
                          ) : null}
                          {canDel ? (
                            <Button type="button" size="sm" variant="ghost" className="rounded-lg text-destructive" onClick={() => setDeleteId(row.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          ) : null}
                        </div>
                      </div>
                    </AdminCard>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-lg"
                    disabled={gridPage <= 0}
                    onClick={() => setGridPage((p) => Math.max(0, p - 1))}
                  >
                    Previous
                  </Button>
                  <span className="text-xs font-medium text-muted-foreground">
                    Page {gridPage + 1} / {gridPageCount}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-lg"
                    disabled={gridPage >= gridPageCount - 1}
                    onClick={() => setGridPage((p) => Math.min(gridPageCount - 1, p + 1))}
                  >
                    Next
                  </Button>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      )}

      <AdminDrawer
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) setFormErrors({});
        }}
      >
        <AdminDrawerContent
          title={drawerTitle}
          size="wide"
          footer={drawerFooter}
          className="border-sky-200/40 dark:border-sky-900/30"
        >
          <ProjectFormDrawerContent
            key={editing === "new" ? "new" : editing?.id ?? "closed"}
            values={form}
            errors={formErrors}
            slugAuto={slugAuto}
            disabled={!canEdit}
            onSlugAutoChange={setSlugAuto}
            onErrorsChange={setFormErrors}
            onChange={(patch) => setForm((prev) => ({ ...prev, ...patch }))}
            testimonials={testimonials}
          />
        </AdminDrawerContent>
      </AdminDrawer>

      <AlertDialog open={Boolean(deleteId)} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="border-border bg-background text-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">Delete project?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">Removes the case study from the public site.</AlertDialogDescription>
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

      <AlertDialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
        <AlertDialogContent className="border-border bg-background text-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">Delete {selectedIds.length} project(s)?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This permanently removes the selected case studies from the CMS and the public website.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border bg-muted/50 text-foreground">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600"
              onClick={(e) => {
                e.preventDefault();
                void confirmBulkDelete();
              }}
            >
              Delete all
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
