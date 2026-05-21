"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import type { Role } from "@prisma/client";
import {
  Bell,
  ChevronRight,
  ImageIcon,
  LogOut,
  Menu,
  MessageSquareQuote,
  PanelLeft,
  PanelLeftClose,
  PenLine,
  Plus,
  Settings,
  Wrench,
  X,
} from "lucide-react";
import {
  ADMIN_DASHBOARD_NAV,
  ADMIN_NAV_GROUP_LABEL,
  ADMIN_NAV_GROUP_ORDER,
  type AdminNavGroupId,
} from "@/features/admin";
import { getAdminBreadcrumbs } from "@/lib/admin/breadcrumbs";
import { canEditCompanySettings } from "@/lib/permissions";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ThemeToggle } from "@/components/theme-toggle";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AdminGlobalSearch } from "@/components/admin/admin-global-search";
import { AdminQuickFab } from "@/components/admin/admin-quick-fab";
import type { AdminOpsAlertsDetail } from "@/lib/services/admin-ops-alerts";

function navForRole() {
  return ADMIN_DASHBOARD_NAV;
}

function userInitials(name?: string | null, email?: string | null) {
  const base = (name?.trim() || email?.trim() || "?").split(/\s+/).filter(Boolean);
  const a = base[0]?.[0] ?? "?";
  const b = base.length > 1 ? (base[base.length - 1]?.[0] ?? "") : (base[0]?.[1] ?? "");
  return (a + b).toUpperCase().slice(0, 2);
}

function resolveActiveNavHref(pathname: string, navItems: typeof ADMIN_DASHBOARD_NAV): string {
  const pathOnly = pathname.split("?")[0] || "/admin";
  const exact = navItems.find((i) => i.href === pathOnly);
  if (exact) return exact.href;
  if (pathOnly === "/admin") return "/admin";
  let best = "";
  for (const i of navItems) {
    if (i.href === "/admin") continue;
    if (pathOnly === i.href || pathOnly.startsWith(`${i.href}/`)) {
      if (i.href.length > best.length) best = i.href;
    }
  }
  return best;
}

export function AdminDashboardShell({
  user,
  children,
  opsAlerts,
}: {
  user: { name?: string | null; email?: string | null; role: Role };
  children: React.ReactNode;
  opsAlerts: AdminOpsAlertsDetail;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(false);
  const items = navForRole();
  const role = user?.role ?? "ADMIN";
  const settingsIsAdminOnly = !canEditCompanySettings(role);
  const crumbs = getAdminBreadcrumbs(pathname);
  const activeNavHref = React.useMemo(() => resolveActiveNavHref(pathname, items), [pathname, items]);

  const byGroup = React.useMemo(() => {
    const m = new Map<AdminNavGroupId, typeof items>();
    for (const g of ADMIN_NAV_GROUP_ORDER) m.set(g, []);
    for (const it of items) {
      const list = m.get(it.group) ?? [];
      list.push(it);
      m.set(it.group, list);
    }
    return m;
  }, [items]);

  return (
    <ThemeProvider>
    <TooltipProvider delayDuration={250}>
      <div className="flex min-h-dvh flex-col bg-background text-foreground lg:flex-row">
        <aside
          className={cn(
            "z-40 flex flex-col border-r border-border/60 bg-card text-foreground shadow-sm transition-all duration-200",
            "max-lg:fixed max-lg:inset-y-0 max-lg:left-0 max-lg:shadow-xl",
            collapsed ? "max-lg:w-64 lg:w-[72px]" : "w-64",
            mobileOpen ? "max-lg:translate-x-0" : "max-lg:-translate-x-full",
            "lg:sticky lg:top-0 lg:h-dvh lg:translate-x-0 lg:self-start lg:shrink-0",
          )}
        >
          <div
            className={cn(
              "flex items-center gap-2 border-b border-border/60 bg-card px-3 py-4",
              collapsed && "lg:justify-center lg:px-2",
            )}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-sm ring-1 ring-primary/12">
              HGE
            </div>
            {!collapsed ? (
              <div className="min-w-0 flex-1">
                <div className="truncate font-display text-sm font-semibold tracking-tight text-foreground">Hope Genesis</div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">HVAC Operations</div>
              </div>
            ) : null}
            <button
              type="button"
              className={cn(
                "hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground lg:flex",
                !collapsed && "ml-auto",
                collapsed && "mx-auto",
              )}
              onClick={() => setCollapsed((c) => !c)}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={collapsed ? "Expand" : "Collapse"}
            >
              {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            </button>
          </div>

          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-2">
            {ADMIN_NAV_GROUP_ORDER.map((group) => {
              const groupItems = byGroup.get(group) ?? [];
              if (groupItems.length === 0) return null;
              return (
                <div key={group} className="space-y-0.5">
                  {!collapsed ? (
                    <p className="px-3 pb-1 pt-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      {ADMIN_NAV_GROUP_LABEL[group]}
                    </p>
                  ) : (
                    <div className="mx-2 my-1 h-px bg-border" aria-hidden />
                  )}
                  {groupItems.map((item) => {
                    const isActive = item.href === activeNavHref;
                    const Icon = item.icon;
                    const link = (
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
                          isActive
                            ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                          collapsed && "justify-center px-0",
                        )}
                      >
                        <Icon className={cn("h-4 w-4 shrink-0", isActive && "text-primary")} />
                        {!collapsed ? item.label : null}
                      </Link>
                    );
                    return collapsed ? (
                      <Tooltip key={item.href}>
                        <TooltipTrigger asChild>{link}</TooltipTrigger>
                        <TooltipContent side="right" className="font-medium">
                          {item.label}
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <React.Fragment key={item.href}>{link}</React.Fragment>
                    );
                  })}
                </div>
              );
            })}
          </nav>

          <div className={cn("border-t border-border p-2", collapsed && "flex flex-col items-center gap-2")}>
            <div
              className={cn(
                "mb-1 flex items-center gap-3 rounded-xl px-2 py-2 text-foreground",
                collapsed && "flex-col px-0",
              )}
            >
              <div className="relative shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-muted text-xs font-bold text-primary">
                  {userInitials(user.name, user.email)}
                </div>
                {opsAlerts.total > 0 ? (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground ring-2 ring-card">
                    {opsAlerts.total > 9 ? "9+" : opsAlerts.total}
                  </span>
                ) : null}
              </div>
              {!collapsed ? (
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-semibold text-foreground">{user.name || "Team member"}</div>
                  <div className="truncate text-[10px] text-muted-foreground">{user.email}</div>
                </div>
              ) : null}
            </div>
            <Link
              href="/"
              className={cn(
                "block rounded-xl px-3 py-2 text-center text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                collapsed && "px-0",
              )}
            >
              {!collapsed ? "← Public website" : "←"}
            </Link>
          </div>
        </aside>

        {mobileOpen ? (
          <button
            type="button"
            className="fixed inset-0 z-30 bg-foreground/20 backdrop-blur-sm lg:hidden"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex min-h-14 flex-wrap items-center gap-2 border-b border-border/60 bg-card/95 px-3 py-2.5 shadow-sm backdrop-blur-xl sm:gap-3 sm:px-6">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0 text-muted-foreground hover:bg-muted lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>

            <nav aria-label="Breadcrumb" className="order-last flex w-full min-w-0 items-center gap-1 text-xs font-medium text-muted-foreground lg:order-none lg:mr-2 lg:w-auto lg:max-w-[220px] xl:max-w-xs">
              {crumbs.map((c, i) => (
                <React.Fragment key={c.href}>
                  {i > 0 ? <ChevronRight className="h-3 w-3 shrink-0 opacity-50" aria-hidden /> : null}
                  {i === crumbs.length - 1 ? (
                    <span className="truncate font-semibold text-foreground">{c.label}</span>
                  ) : (
                    <Link href={c.href} className="truncate hover:text-foreground">
                      {c.label}
                    </Link>
                  )}
                </React.Fragment>
              ))}
            </nav>

            <div className="order-1 flex min-w-0 flex-1 flex-wrap items-center gap-2 sm:gap-3 lg:order-none">
              <AdminGlobalSearch />
            </div>

            <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="relative rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground"
                    aria-label="Content notifications"
                  >
                    <Bell className="h-5 w-5" />
                    {opsAlerts.total > 0 ? (
                      <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-accent ring-2 ring-card" />
                    ) : null}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72 border-border bg-popover p-0">
                  <DropdownMenuLabel className="px-3 py-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Content inbox
                  </DropdownMenuLabel>
                  <div className="max-h-80 overflow-y-auto py-1">
                    {opsAlerts.total === 0 ? (
                      <p className="px-3 py-6 text-center text-sm text-muted-foreground">You are caught up. Nice work.</p>
                    ) : (
                      <>
                        {opsAlerts.pendingTestimonials > 0 ? (
                          <DropdownMenuItem asChild className="cursor-pointer gap-2 py-2.5">
                            <Link href="/admin/testimonials">
                              <MessageSquareQuote className="h-4 w-4 text-violet-500" />
                              <div className="flex flex-1 flex-col gap-0.5">
                                <span className="text-sm font-semibold">Testimonials to approve</span>
                                <span className="text-xs text-muted-foreground">{opsAlerts.pendingTestimonials} in moderation</span>
                              </div>
                            </Link>
                          </DropdownMenuItem>
                        ) : null}
                      </>
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    className="hidden h-10 gap-2 rounded-xl border border-border/80 bg-background px-3 text-foreground shadow-sm sm:inline-flex"
                  >
                    <Plus className="h-4 w-4 text-accent" />
                    <span className="text-sm font-semibold">Create</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 border-border bg-popover">
                  <DropdownMenuLabel className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Quick create
                  </DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/projects?new=1" className="gap-2 font-medium">
                      <PanelLeft className="h-4 w-4" />
                      Project
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/services?new=1" className="gap-2 font-medium">
                      <Wrench className="h-4 w-4" />
                      Service
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/testimonials" className="gap-2 font-medium">
                      <MessageSquareQuote className="h-4 w-4" />
                      Testimonial
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/gallery?new=1" className="gap-2 font-medium">
                      <ImageIcon className="h-4 w-4" />
                      Gallery item
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/blog" className="gap-2 font-medium">
                      <PenLine className="h-4 w-4" />
                      Blog post
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <ThemeToggle />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-10 gap-2 rounded-xl border-primary/15 bg-background px-2 text-foreground sm:px-3"
                  >
                    <span className="hidden max-w-[120px] truncate text-sm font-medium sm:inline">{user.name || user.email}</span>
                    <span className="rounded-md bg-primary/12 px-1.5 py-0.5 text-[10px] font-bold uppercase text-primary">
                      {role}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 border-border bg-popover text-popover-foreground">
                  <DropdownMenuLabel className="font-normal">
                    <div className="text-sm font-semibold">{user.name || "Team member"}</div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="gap-2 font-medium">
                    <Link href="/admin/settings">
                      <Settings className="h-4 w-4" />
                      Workspace settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
                    onClick={() => signOut({ callbackUrl: "/admin/login" })}
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:bg-muted lg:hidden"
                onClick={() => setMobileOpen(false)}
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </header>

          <div className="border-b border-border/50 bg-card/80 px-3 py-2 text-[11px] text-muted-foreground sm:px-6">
            {settingsIsAdminOnly && pathname.startsWith("/admin/settings") ? (
              <span>View-only access to workspace settings.</span>
            ) : (
              <span>
                Signed in as <span className="font-semibold text-foreground">{user.email}</span> — website content workspace.
              </span>
            )}
          </div>

          <main className="relative flex-1 bg-gradient-to-b from-background via-background to-muted/15 px-3 py-6 sm:px-8 sm:py-10 lg:px-12 dark:via-slate-950 dark:to-slate-900/40">
            <div className="mx-auto w-full max-w-[1600px]">{children}</div>
          </main>
        </div>
      </div>
      <AdminQuickFab />
    </TooltipProvider>
    </ThemeProvider>
  );
}
