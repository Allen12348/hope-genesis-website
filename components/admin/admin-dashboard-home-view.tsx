import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  FolderKanban,
  ImageIcon,
  LayoutPanelTop,
  LibraryBig,
  MessageSquareQuote,
  Tags,
  Wrench,
} from "lucide-react";
import type { AdminDashboardHomePayload } from "@/lib/services/admin-dashboard-data";
import { Button } from "@/components/ui/button";
import { AdminCard } from "@/components/admin/ui/admin-card";
import { AdminStatsCard } from "@/components/admin/ui/admin-stats-card";
import { AdminBadge } from "@/components/admin/ui/admin-badge";
import { Separator } from "@/components/ui/separator";

function fmtDate(d: Date) {
  return d.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function AdminDashboardHomeView({ data }: { data: AdminDashboardHomePayload }) {
  const { metrics, recentLogs, recentTestimonials, pendingTestimonialRows, recentProjects } = data;

  return (
    <div className="space-y-8 lg:space-y-10">
      {data.partialError ? (
        <div
          role="status"
          className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-foreground"
        >
          Unable to load some dashboard data. Counts and lists may be empty until the database is reachable and
          migrations are applied.
        </div>
      ) : null}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Website CMS</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Manage Hope Genesis Enterprises public content — pages, media, testimonials, and site settings.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm" className="rounded-xl bg-primary text-primary-foreground shadow-sm hover:bg-primary/90">
            <Link href="/admin/content">Content hub</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-xl border-border">
            <Link href="/admin/content/homepage/visual">Homepage editor</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatsCard
          label="Published projects"
          value={data.publishedProjects}
          icon={FolderKanban}
          sparkSeed={303 + data.publishedProjects}
          sparkTone="navy"
          trendLabel={`${metrics.unpublishedProjects} unpublished`}
          trendVariant="neutral"
          badge="Portfolio"
          badgeVariant="success"
        />
        <AdminStatsCard
          label="Testimonials pending"
          value={metrics.pendingTestimonials}
          icon={MessageSquareQuote}
          sparkSeed={404 + metrics.pendingTestimonials}
          sparkTone="violet"
          trendLabel={`${data.approvedTestimonials} approved live`}
          trendVariant={metrics.pendingTestimonials ? "negative" : "positive"}
          badge="Moderation"
          badgeVariant={metrics.pendingTestimonials ? "warning" : "success"}
        />
        <AdminStatsCard
          label="Gallery items"
          value={metrics.galleryItems}
          icon={ImageIcon}
          sparkSeed={505}
          sparkTone="emerald"
          trendLabel="Media library"
          trendVariant="neutral"
        />
        <AdminStatsCard
          label="Service pages"
          value={metrics.totalServices}
          icon={Wrench}
          sparkSeed={707}
          sparkTone="gold"
          trendLabel="CMS service entries"
          trendVariant="neutral"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <AdminStatsCard
          label="Brand partners"
          value={metrics.brandPartners}
          icon={Tags}
          sparkSeed={606}
          sparkTone="navy"
          trendLabel="Homepage trust row"
          trendVariant="neutral"
        />
        <AdminStatsCard
          label="Draft blog posts"
          value={metrics.draftBlogPosts}
          icon={BookOpen}
          sparkSeed={808 + metrics.draftBlogPosts}
          sparkTone="sky"
          trendLabel={metrics.draftBlogPosts ? "Unpublished drafts" : "All posts published"}
          trendVariant={metrics.draftBlogPosts ? "negative" : "positive"}
        />
      </div>

      <AdminCard className="p-5">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-display text-lg font-semibold text-foreground">Pending approvals</h2>
          <Button asChild variant="ghost" size="sm" className="rounded-lg text-primary hover:text-primary">
            <Link href="/admin/testimonials" className="gap-1">
              Moderate <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
        <Separator className="my-4" />
        <ul className="space-y-2">
          {pendingTestimonialRows.length === 0 ? (
            <li className="text-sm text-muted-foreground">No testimonials awaiting approval.</li>
          ) : (
            pendingTestimonialRows.map((t) => (
              <li
                key={t.id}
                className="flex items-center justify-between rounded-xl border border-border/80 bg-muted/30 px-3 py-2 text-sm"
              >
                <span className="font-medium text-foreground">{t.clientName}</span>
                <AdminBadge variant="warning">Pending</AdminBadge>
              </li>
            ))
          )}
        </ul>
      </AdminCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <AdminCard className="p-5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display text-lg font-semibold text-foreground">Recent testimonials</h2>
            <Link href="/admin/testimonials" className="text-xs font-semibold text-primary hover:underline">
              Open
            </Link>
          </div>
          <Separator className="my-4" />
          <ul className="space-y-2">
            {recentTestimonials.length === 0 ? (
              <li className="text-sm text-muted-foreground">No testimonials yet.</li>
            ) : (
              recentTestimonials.map((t) => (
                <li
                  key={t.id}
                  className="flex items-center justify-between gap-2 rounded-xl border border-border/80 bg-muted/25 px-3 py-2 text-sm"
                >
                  <span className="font-medium text-foreground">{t.clientName}</span>
                  <AdminBadge variant={t.approved ? "success" : "warning"}>{t.approved ? "Live" : "Review"}</AdminBadge>
                </li>
              ))
            )}
          </ul>
        </AdminCard>

        <AdminCard className="p-5">
          <h2 className="font-display text-lg font-semibold text-foreground">Content shortcuts</h2>
          <p className="mt-1 text-sm text-muted-foreground">Jump to common editors.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild size="sm" variant="secondary" className="rounded-xl border-border">
              <Link href="/admin/content/homepage/hero">
                <LibraryBig className="mr-1.5 h-3.5 w-3.5" />
                Hero
              </Link>
            </Button>
            <Button asChild size="sm" variant="secondary" className="rounded-xl border-border">
              <Link href="/admin/settings/header">
                <LayoutPanelTop className="mr-1.5 h-3.5 w-3.5" />
                Header
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="rounded-xl border-border">
              <Link href="/admin/content/builder">Page builder</Link>
            </Button>
          </div>
        </AdminCard>
      </div>

      <AdminCard className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-lg font-semibold text-foreground">Recent projects</h2>
          <Link href="/admin/projects" className="text-xs font-semibold text-primary hover:underline">
            Manage projects
          </Link>
        </div>
        <Separator className="my-4" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {recentProjects.length === 0 ? (
            <p className="text-sm text-muted-foreground">No projects in the library.</p>
          ) : (
            recentProjects.slice(0, 4).map((p) => (
              <Link
                key={p.id}
                href="/admin/projects"
                className="group rounded-xl border border-border/80 bg-muted/20 p-3 transition-colors hover:border-accent/40 hover:bg-accent/5"
              >
                <div className="aspect-video overflow-hidden rounded-lg bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element -- admin preview; remote URLs */}
                  <img
                    src={p.imageUrl?.trim() || p.image || undefined}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </div>
                <div className="mt-2 flex items-start justify-between gap-2">
                  <span className="line-clamp-2 text-sm font-semibold text-foreground">{p.title}</span>
                  <AdminBadge variant={p.published ? "success" : "default"} className="shrink-0">
                    {p.published ? "Live" : "Draft"}
                  </AdminBadge>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">{p.category}</p>
              </Link>
            ))
          )}
        </div>
      </AdminCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <AdminCard className="p-5">
          <h2 className="font-display text-lg font-semibold text-foreground">Quick actions</h2>
          <p className="mt-1 text-sm text-muted-foreground">Create or update public content.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild size="sm" className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/admin/projects?new=1">New project</Link>
            </Button>
            <Button asChild size="sm" variant="secondary" className="rounded-xl border-border">
              <Link href="/admin/services?new=1">New service</Link>
            </Button>
            <Button asChild size="sm" variant="secondary" className="rounded-xl border-border">
              <Link href="/admin/gallery?new=1">Gallery image</Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="rounded-xl border-border">
              <Link href="/admin/blog">Blog editor</Link>
            </Button>
          </div>
        </AdminCard>

        <AdminCard className="p-5">
          <h2 className="font-display text-lg font-semibold text-foreground">Activity log</h2>
          <p className="mt-1 text-sm text-muted-foreground">Audit trail across admin accounts.</p>
          <ul className="mt-4 max-h-80 space-y-2 overflow-y-auto pr-1 text-sm">
            {recentLogs.length === 0 ? (
              <li className="text-muted-foreground">No activity yet.</li>
            ) : (
              recentLogs.map((log) => (
                <li key={log.id} className="rounded-xl border border-border/80 bg-muted/30 px-3 py-2">
                  <div className="flex flex-wrap items-center gap-2 text-foreground">
                    <AdminBadge variant="navy" className="normal-case">
                      {log.action}
                    </AdminBadge>
                    <span className="text-muted-foreground">{log.entity}</span>
                    {log.entityId ? (
                      <span className="font-mono text-[10px] text-muted-foreground">{log.entityId}</span>
                    ) : null}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {log.user?.email ?? "System"} · {fmtDate(log.createdAt)}
                  </div>
                </li>
              ))
            )}
          </ul>
        </AdminCard>
      </div>

      {metrics.draftBlogPosts > 0 ? (
        <AdminCard className="flex flex-wrap items-center justify-between gap-3 border-amber-500/25 bg-amber-500/5 p-4">
          <div className="text-sm">
            <span className="font-semibold text-foreground">{metrics.draftBlogPosts} blog post(s) </span>
            <span className="text-muted-foreground">unpublished — finish drafts before going live.</span>
          </div>
          <Button asChild size="sm" variant="outline" className="rounded-xl border-amber-500/40">
            <Link href="/admin/blog">Open blog</Link>
          </Button>
        </AdminCard>
      ) : null}
    </div>
  );
}
