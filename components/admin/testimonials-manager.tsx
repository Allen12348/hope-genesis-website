"use client";

import * as React from "react";
import type { Role, Testimonial } from "@prisma/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  CheckCircle2,
  Eye,
  ExternalLink,
  Pencil,
  Plus,
  Star,
  Trash2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  deleteTestimonialAction,
  toggleTestimonialApprovedAction,
  toggleTestimonialFeaturedAction,
  toggleTestimonialRejectedAction,
  upsertTestimonialAction,
} from "@/lib/actions/testimonials";
import { canDeleteContent, canMutateContent } from "@/lib/permissions";
import {
  TestimonialsFormDrawerContent,
  type TestimonialFormValues,
} from "@/components/admin/testimonials-form-drawer-content";
import { cn } from "@/lib/utils";
import { AdminHeader } from "@/components/admin/ui/admin-header";
import { AdminCard } from "@/components/admin/ui/admin-card";
import { AdminDataTable, type AdminTableColumn } from "@/components/admin/ui/admin-data-table";
import { AdminDrawer, AdminDrawerContent, AdminDrawerFooter } from "@/components/admin/ui/admin-drawer";
import { AdminBadge } from "@/components/admin/ui/admin-badge";
import { AdminEmptyState } from "@/components/admin/ui/admin-empty-state";

function displayImageUrl(row: Testimonial): string {
  return row.imageUrl?.trim() ?? "";
}

function clientInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] ?? "";
  const b =
    parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : (parts[0]?.[1] ?? "");
  const s = (a + b).toUpperCase();
  return s || "?";
}

export function TestimonialsManager({ rows, role }: { rows: Testimonial[]; role: Role }) {
  const router = useRouter();
  const canEdit = canMutateContent(role);
  const canDel = canDeleteContent(role);
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Testimonial | "new" | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState(false);
  const [clientName, setClientName] = React.useState("");
  const [roleTitle, setRoleTitle] = React.useState("");
  const [company, setCompany] = React.useState("");
  const [review, setReview] = React.useState("");
  const [rating, setRating] = React.useState(5);
  const [imageUrl, setImageUrl] = React.useState("");
  const [serviceType, setServiceType] = React.useState("General");
  const [approved, setApproved] = React.useState(false);
  const [featured, setFeatured] = React.useState(false);
  const [rejected, setRejected] = React.useState(false);
  const [previewRow, setPreviewRow] = React.useState<Testimonial | null>(null);

  const formValues: TestimonialFormValues = {
    clientName,
    roleTitle,
    company,
    review,
    rating,
    imageUrl,
    serviceType,
    approved,
    featured,
    rejected,
  };

  function patchForm(patch: Partial<TestimonialFormValues>) {
    if (patch.clientName !== undefined) setClientName(patch.clientName);
    if (patch.roleTitle !== undefined) setRoleTitle(patch.roleTitle);
    if (patch.company !== undefined) setCompany(patch.company);
    if (patch.review !== undefined) setReview(patch.review);
    if (patch.rating !== undefined) setRating(patch.rating);
    if (patch.imageUrl !== undefined) setImageUrl(patch.imageUrl);
    if (patch.serviceType !== undefined) setServiceType(patch.serviceType);
    if (patch.approved !== undefined) setApproved(patch.approved);
    if (patch.featured !== undefined) setFeatured(patch.featured);
    if (patch.rejected !== undefined) setRejected(patch.rejected);
  }

  const tableRows = React.useMemo(() => {
    return [...rows].sort((a, b) => {
      const af = a.featured === b.featured ? 0 : a.featured ? -1 : 1;
      if (af !== 0) return af;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [rows]);

  function openNew() {
    setEditing("new");
    setClientName("");
    setRoleTitle("");
    setCompany("");
    setReview("");
    setRating(5);
    setImageUrl("");
    setServiceType("General");
    setApproved(false);
    setFeatured(false);
    setRejected(false);
    setOpen(true);
  }

  function openEdit(row: Testimonial) {
    setEditing(row);
    setClientName(row.clientName);
    setRoleTitle(row.role);
    setCompany(row.company);
    setReview(row.review);
    setRating(row.rating);
    setImageUrl(displayImageUrl(row));
    setServiceType(row.serviceType || "General");
    setApproved(row.approved);
    setFeatured(row.featured);
    setRejected(row.rejected);
    setOpen(true);
  }

  async function save() {
    setPending(true);
    const res = await upsertTestimonialAction({
      id: editing !== "new" && editing ? editing.id : undefined,
      clientName,
      role: roleTitle,
      company,
      review,
      rating,
      imageUrl: imageUrl.trim() === "" ? null : imageUrl.trim(),
      serviceType,
      approved,
      featured,
      rejected,
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
    const res = await deleteTestimonialAction({ id: deleteId });
    setPending(false);
    setDeleteId(null);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success(res.message ?? "Deleted");
    router.refresh();
  }

  async function toggleApproved(id: string) {
    setPending(true);
    const res = await toggleTestimonialApprovedAction({ id });
    setPending(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success(res.message ?? "Updated");
    router.refresh();
  }

  async function toggleFeatured(id: string) {
    setPending(true);
    const res = await toggleTestimonialFeaturedAction({ id });
    setPending(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success(res.message ?? "Updated");
    router.refresh();
  }

  async function toggleRejected(id: string) {
    setPending(true);
    const res = await toggleTestimonialRejectedAction({ id });
    setPending(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success(res.message ?? "Updated");
    router.refresh();
  }

  const hasPending = rows.some((r) => !r.approved && !r.rejected);

  const columns: AdminTableColumn<Testimonial>[] = [
    {
      id: "client",
      header: "Client",
      sortable: true,
      sortValue: (r) => r.clientName,
      cell: (row) => (
        <div className="min-w-0">
          <div className="flex items-start gap-2">
            <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
              {displayImageUrl(row) ? (
                // eslint-disable-next-line @next/next/no-img-element -- admin CMS
                <img src={displayImageUrl(row)} alt="" className="h-full w-full object-cover" loading="lazy" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-muted-foreground">
                  {clientInitials(row.clientName)}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-foreground">{row.clientName}</div>
              <div className="text-xs text-muted-foreground">{row.role}</div>
              {row.source === "PUBLIC_SUBMISSION" ? (
                <div className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Public submission</div>
              ) : null}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "company",
      header: "Company",
      sortable: true,
      sortValue: (r) => r.company,
      cell: (r) => (
        <span className="line-clamp-2 max-w-[140px] text-sm text-muted-foreground">{r.company.trim() ? r.company : "—"}</span>
      ),
    },
    {
      id: "service",
      header: "Service",
      sortable: true,
      sortValue: (r) => r.serviceType,
      cell: (r) => <span className="text-sm text-muted-foreground">{r.serviceType}</span>,
    },
    {
      id: "rating",
      header: "Rating",
      sortable: true,
      sortValue: (r) => r.rating,
      cell: (r) => (
        <span className="inline-flex items-center gap-0.5 text-amber-500">
          <Star className="h-3.5 w-3.5 fill-current" />
          {r.rating}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      sortable: true,
      sortValue: (r) => (r.approved ? 1 : 0) * 10 + (r.featured ? 1 : 0),
      cell: (r) => (
        <div className="flex flex-wrap gap-1">
          {r.rejected ? <AdminBadge variant="danger">Rejected</AdminBadge> : null}
          {!r.rejected && !r.approved ? (
            <AdminBadge variant="warning">Pending</AdminBadge>
          ) : null}
          {!r.rejected && r.approved ? (
            <AdminBadge variant="success">Approved</AdminBadge>
          ) : null}
          {r.featured ? <AdminBadge variant="info">Featured</AdminBadge> : null}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      headerClassName: "min-w-[260px]",
      className: "align-top",
      cell: (row) => (
        <div className="flex max-w-[320px] flex-wrap items-center justify-end gap-1">
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-8 gap-1 rounded-lg border-border text-xs"
            onClick={() => setPreviewRow(row)}
          >
            <Eye className="h-3.5 w-3.5" />
            View
          </Button>
          <Button type="button" size="sm" variant="ghost" className="h-8 px-2 text-muted-foreground" asChild>
            <a href="/testimonials" target="_blank" rel="noopener noreferrer" title="Open public testimonials page">
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="sr-only">Open public page</span>
            </a>
          </Button>
          {canEdit ? (
            <>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-8 gap-1 rounded-lg border-border text-xs"
                disabled={pending}
                onClick={() => void toggleApproved(row.id)}
              >
                {row.approved ? (
                  <>
                    <XCircle className="h-3.5 w-3.5 text-amber-500" />
                    Unapprove
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    Approve
                  </>
                )}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-8 rounded-lg border-border px-2 text-xs"
                disabled={pending}
                onClick={() => void toggleFeatured(row.id)}
              >
                {row.featured ? "Unfeature" : "Feature"}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-8 gap-1 rounded-lg border-border text-xs"
                disabled={pending}
                onClick={() => void toggleRejected(row.id)}
              >
                {row.rejected ? "Unreject" : "Reject"}
              </Button>
              <Button type="button" size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground" onClick={() => openEdit(row)}>
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
            </>
          ) : null}
          {canDel ? (
            <Button type="button" size="icon" variant="ghost" className="h-8 w-8 text-red-400" onClick={() => setDeleteId(row.id)}>
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          ) : null}
        </div>
      ),
    },
  ];

  const drawerTitle = editing === "new" ? "Add testimonial" : "Edit testimonial";
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
        title="Testimonials"
        description="Only approved entries appear on the public site. Featured items sort first in public lists."
        actions={
          canEdit ? (
            <Button type="button" className="rounded-xl bg-primary text-primary-foreground shadow-sm hover:bg-primary/90" onClick={openNew}>
              <Plus className="h-4 w-4" />
              Add testimonial
            </Button>
          ) : null
        }
      />

      {hasPending ? (
        <AdminCard className="border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm font-medium text-foreground">
          Some testimonials are pending approval — filter by “Pending” below to clear the queue.
        </AdminCard>
      ) : null}

      {rows.length === 0 ? (
        <AdminEmptyState
          title="No testimonials yet"
          description="Approved reviews power trust on the marketing site. Add entries or wait for public submissions."
          action={
            canEdit ? (
              <Button type="button" className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90" onClick={openNew}>
                <Plus className="h-4 w-4" />
                Add testimonial
              </Button>
            ) : null
          }
        />
      ) : (
        <AdminDataTable<Testimonial>
          rows={tableRows}
          columns={columns}
          getRowId={(r) => r.id}
          searchPlaceholder="Search client, company, review, service…"
          searchKeys={(r) => [
            r.clientName,
            r.company,
            r.role,
            r.review,
            r.serviceType ?? "",
            r.approved ? "approved" : "pending",
            r.rejected ? "rejected" : "",
            r.featured ? "featured" : "",
            r.source ?? "",
          ]}
          filterOptions={[
            { value: "pending", label: "Pending", predicate: (r) => !r.approved && !r.rejected },
            { value: "approved", label: "Approved", predicate: (r) => r.approved && !r.rejected },
            { value: "rejected", label: "Rejected", predicate: (r) => r.rejected },
            { value: "featured", label: "Featured", predicate: (r) => r.featured },
          ]}
          pageSize={10}
          emptyState={
            <div className="py-2 text-center">
              <p className="text-sm font-medium text-foreground">No matches</p>
              <p className="mt-1 text-xs text-muted-foreground">Try a different search or filter.</p>
            </div>
          }
        />
      )}

      <AdminDrawer open={open} onOpenChange={setOpen}>
        <AdminDrawerContent title={drawerTitle} size="lg" footer={drawerFooter}>
          <TestimonialsFormDrawerContent values={formValues} onChange={patchForm} disabled={!canEdit} />
        </AdminDrawerContent>
      </AdminDrawer>

      <Dialog open={previewRow !== null} onOpenChange={(o) => !o && setPreviewRow(null)}>
        <DialogContent className="border-border bg-background text-foreground sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">View testimonial</DialogTitle>
          </DialogHeader>
          {previewRow ? (
            <div className="space-y-4 rounded-xl border border-border bg-muted/20 p-4">
              <div className="flex gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-border bg-muted">
                  {displayImageUrl(previewRow) ? (
                    // eslint-disable-next-line @next/next/no-img-element -- admin preview of arbitrary URL
                    <img src={displayImageUrl(previewRow)} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted font-display text-xs font-semibold text-muted-foreground">
                      {clientInitials(previewRow.clientName)}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-display font-semibold text-foreground">{previewRow.clientName}</p>
                  <p className="text-sm text-muted-foreground">
                    {previewRow.role}
                    {previewRow.company.trim() ? `, ${previewRow.company}` : ""}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">Service: {previewRow.serviceType}</p>
                  <div className="mt-2 flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-3.5 w-3.5",
                          i < previewRow.rating
                            ? "fill-[hsl(var(--brand-gold))] text-[hsl(var(--brand-gold))]"
                            : "text-muted-foreground/40",
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <blockquote className="border-l-2 border-accent pl-3 text-sm leading-relaxed text-foreground">“{previewRow.review}”</blockquote>
              <p className="text-xs text-muted-foreground">
                {previewRow.rejected
                  ? "Rejected — hidden from the public site."
                  : previewRow.approved
                    ? "Approved — visible on the site when published with other approved reviews."
                    : "Pending — hidden on the public site until approved."}
              </p>
            </div>
          ) : null}
          <DialogFooter>
            <Button type="button" variant="outline" className="border-border" onClick={() => setPreviewRow(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(deleteId)} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="border-border bg-background text-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">Delete testimonial?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">This permanently removes the testimonial.</AlertDialogDescription>
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
