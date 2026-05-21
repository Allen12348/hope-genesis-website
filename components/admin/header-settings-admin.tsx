"use client";

import * as React from "react";
import type { CompanySettings, NavigationItem, Role } from "@prisma/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
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
import { canEditCompanySettings } from "@/lib/permissions";
import {
  deleteNavigationItemAction,
  reorderNavigationItemsAction,
  resetMarketingHeaderAction,
  saveMarketingHeaderSettingsAction,
  upsertNavigationItemAction,
} from "@/lib/actions/marketing-header";
import type { ResolvedNavLink, ResolvedSite } from "@/lib/cms/resolved-site";
import { MarketingHeaderPreview } from "@/components/admin/marketing-header-preview";
import { AdminImageUrlField } from "@/components/admin/admin-image-url-field";
import { AdminFormField } from "@/components/admin/ui/admin-form-field";
import { AdminFormIntro } from "@/components/admin/ui/admin-form-intro";
import { HEADER_GUIDANCE, inputClass } from "@/lib/cms/form-guidance";

function sortedNav(nav: NavigationItem[]) {
  return [...nav].sort((a, b) => a.sortOrder - b.sortOrder || a.label.localeCompare(b.label));
}

function toPreviewLinks(nav: NavigationItem[]): ResolvedNavLink[] {
  return sortedNav(nav)
    .filter((i) => i.isVisible && i.isActive)
    .map((i) => ({ href: i.href, label: i.label, isExternal: i.isExternal }));
}

export function HeaderSettingsAdmin({
  company,
  navItems: initialNav,
  resolved,
  role,
}: {
  company: CompanySettings | null;
  navItems: NavigationItem[];
  resolved: ResolvedSite;
  role: Role;
}) {
  const router = useRouter();
  const canEdit = canEditCompanySettings(role);
  const [pending, setPending] = React.useState(false);
  const [navItems, setNavItems] = React.useState(() => sortedNav(initialNav));

  React.useEffect(() => {
    setNavItems(sortedNav(initialNav));
  }, [initialNav]);

  const [logoText, setLogoText] = React.useState(resolved.headerLogoText);
  const [logoImageUrl, setLogoImageUrl] = React.useState(resolved.headerLogoImageUrl ?? "");
  const [companyName, setCompanyName] = React.useState(
    company?.companyName?.trim() ?? resolved.headerCompanyName,
  );
  const [companySubtitle, setCompanySubtitle] = React.useState(resolved.headerCompanySubtitle);
  const [primaryCtaLabel, setPrimaryCtaLabel] = React.useState(resolved.primaryCtaLabel);
  const [primaryCtaUrl, setPrimaryCtaUrl] = React.useState(resolved.primaryCtaUrl);
  const [callButtonLabel, setCallButtonLabel] = React.useState(resolved.callButtonLabel);
  const [showPrimaryCta, setShowPrimaryCta] = React.useState(resolved.showPrimaryCta);
  const [showCallButton, setShowCallButton] = React.useState(resolved.showCallButton);
  const [showThemeToggle, setShowThemeToggle] = React.useState(resolved.showThemeToggle);
  const [defaultTheme, setDefaultTheme] = React.useState<"light" | "dark" | "system">(resolved.defaultTheme);

  const [navOpen, setNavOpen] = React.useState(false);
  const [editingNav, setEditingNav] = React.useState<NavigationItem | "new" | null>(null);
  const [navLabel, setNavLabel] = React.useState("");
  const [navHref, setNavHref] = React.useState("");
  const [navSort, setNavSort] = React.useState(0);
  const [navVisible, setNavVisible] = React.useState(true);
  const [navActive, setNavActive] = React.useState(true);
  const [navExternal, setNavExternal] = React.useState(false);
  const [deleteNavId, setDeleteNavId] = React.useState<string | null>(null);

  const previewLinks = React.useMemo(() => toPreviewLinks(navItems), [navItems]);

  async function saveHeader() {
    if (!company) {
      toast.error("Create company settings on the main Settings page first.");
      return;
    }
    setPending(true);
    const res = await saveMarketingHeaderSettingsAction({
      logoText,
      logoImageUrl: logoImageUrl.trim() === "" ? null : logoImageUrl.trim(),
      companyName: companyName.trim() === "" ? null : companyName.trim(),
      companySubtitle: companySubtitle.trim() === "" ? null : companySubtitle.trim(),
      primaryCtaLabel,
      primaryCtaUrl,
      callButtonLabel,
      showPrimaryCta,
      showCallButton,
      showThemeToggle,
      defaultTheme,
    });
    setPending(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success(res.message ?? "Saved");
    router.refresh();
  }

  async function resetAll() {
    setPending(true);
    const res = await resetMarketingHeaderAction();
    setPending(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success(res.message ?? "Reset");
    router.refresh();
  }

  function openNewNav() {
    setEditingNav("new");
    setNavLabel("");
    setNavHref("/");
    setNavSort(navItems.length ? Math.max(...navItems.map((n) => n.sortOrder)) + 1 : 0);
    setNavVisible(true);
    setNavActive(true);
    setNavExternal(false);
    setNavOpen(true);
  }

  function openEditNav(row: NavigationItem) {
    setEditingNav(row);
    setNavLabel(row.label);
    setNavHref(row.href);
    setNavSort(row.sortOrder);
    setNavVisible(row.isVisible);
    setNavActive(row.isActive);
    setNavExternal(row.isExternal);
    setNavOpen(true);
  }

  async function saveNav() {
    setPending(true);
    const res = await upsertNavigationItemAction({
      id: editingNav !== "new" && editingNav ? editingNav.id : undefined,
      label: navLabel,
      href: navHref,
      sortOrder: navSort,
      isVisible: navVisible,
      isActive: navActive,
      isExternal: navExternal,
    });
    setPending(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success(res.message ?? "Saved");
    setNavOpen(false);
    router.refresh();
  }

  async function confirmDeleteNav() {
    if (!deleteNavId) return;
    setPending(true);
    const res = await deleteNavigationItemAction({ id: deleteNavId });
    setPending(false);
    setDeleteNavId(null);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success(res.message ?? "Removed");
    router.refresh();
  }

  async function persistOrder(next: NavigationItem[]) {
    const ids = sortedNav(next).map((n) => n.id);
    setPending(true);
    const res = await reorderNavigationItemsAction({ orderedIds: ids });
    setPending(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success("Order updated");
    router.refresh();
  }

  function moveNav(id: string, dir: -1 | 1) {
    const s = sortedNav(navItems);
    const i = s.findIndex((n) => n.id === id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= s.length) return;
    const copy = [...s];
    const t = copy[i]!;
    copy[i] = copy[j]!;
    copy[j] = t;
    setNavItems(copy);
    void persistOrder(copy);
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">Header / Navigation</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Control the public site navbar, CTAs, and theme defaults.{" "}
            <a href="/admin/settings" className="font-semibold text-primary underline">
              ← Back to Settings
            </a>
          </p>
        </div>
        {canEdit ? (
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" className="rounded-xl border-border" disabled={pending} onClick={() => void resetAll()}>
              Reset to default
            </Button>
            <Button
              type="button"
              className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={pending || !company}
              onClick={() => void saveHeader()}
            >
              Save header &amp; CTAs
            </Button>
          </div>
        ) : null}
      </div>

      {!company ? (
        <Card className="border-amber-500/40 bg-amber-500/10 p-4 text-sm text-foreground">
          Company settings are missing. Open{" "}
          <a href="/admin/settings" className="font-semibold underline">
            Settings
          </a>{" "}
          and save company information once, then return here.
        </Card>
      ) : null}

      <Card className="border-border bg-card p-6">
        <h2 className="font-display text-lg font-semibold text-foreground">Live preview</h2>
        <p className="mt-1 text-sm text-muted-foreground">Updates as you edit fields below.</p>
        <div className="mt-4">
          <MarketingHeaderPreview
            logoText={logoText}
            logoImageUrl={logoImageUrl}
            companyName={companyName || resolved.legalName}
            companySubtitle={companySubtitle}
            navLinks={previewLinks}
            primaryCtaLabel={primaryCtaLabel}
            showPrimaryCta={showPrimaryCta}
            callButtonLabel={callButtonLabel}
            showCallButton={showCallButton}
            showThemeToggle={showThemeToggle}
          />
        </div>
      </Card>

      <Card className="border-border bg-card p-6">
        <h2 className="font-display text-lg font-semibold text-foreground">Brand</h2>
        <AdminFormIntro className="mt-3" title="Tip">
          Logo image overrides logo text. Keep menu labels short. Use paths like /contact for internal pages.
        </AdminFormIntro>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <AdminFormField id="hdr-logo-text" label="Logo text (fallback)" example={HEADER_GUIDANCE.logoText.placeholder}>
            <Input
              id="hdr-logo-text"
              value={logoText}
              disabled={!canEdit}
              onChange={(e) => setLogoText(e.target.value)}
              className={inputClass}
              maxLength={12}
              placeholder={HEADER_GUIDANCE.logoText.placeholder}
            />
          </AdminFormField>
          <AdminFormField id="hdr-company" label="Company name (header)" example={HEADER_GUIDANCE.companyName.placeholder}>
            <Input
              id="hdr-company"
              value={companyName}
              disabled={!canEdit}
              onChange={(e) => setCompanyName(e.target.value)}
              className={inputClass}
              placeholder={HEADER_GUIDANCE.companyName.placeholder}
            />
          </AdminFormField>
          <AdminFormField
            id="hdr-subtitle"
            label="Company subtitle"
            className="sm:col-span-2"
            example={HEADER_GUIDANCE.companySubtitle.placeholder}
          >
            <Input
              id="hdr-subtitle"
              value={companySubtitle}
              disabled={!canEdit}
              onChange={(e) => setCompanySubtitle(e.target.value)}
              className={inputClass}
              placeholder={HEADER_GUIDANCE.companySubtitle.placeholder}
            />
          </AdminFormField>
        </div>
        <AdminImageUrlField
          id="header-logo-url"
          label="Logo image URL (optional)"
          value={logoImageUrl}
          onChange={setLogoImageUrl}
          disabled={!canEdit}
          mediaFolder="brands"
          className="mt-6"
        />
      </Card>

      <Card className="border-border bg-card p-6">
        <h2 className="font-display text-lg font-semibold text-foreground">CTA &amp; call</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <Label>Primary CTA label</Label>
            <Input value={primaryCtaLabel} disabled={!canEdit} onChange={(e) => setPrimaryCtaLabel(e.target.value)} className="border-border bg-background" />
          </div>
          <div className="space-y-1">
            <Label>Primary CTA URL</Label>
            <Input value={primaryCtaUrl} disabled={!canEdit} onChange={(e) => setPrimaryCtaUrl(e.target.value)} className="border-border bg-background font-mono text-sm" />
          </div>
          <div className="space-y-1">
            <Label>Call button label</Label>
            <Input value={callButtonLabel} disabled={!canEdit} onChange={(e) => setCallButtonLabel(e.target.value)} className="border-border bg-background" />
          </div>
          <div className="space-y-1 text-sm text-muted-foreground sm:col-span-2">
            Call uses the company phone from{" "}
            <a href="/admin/settings" className="font-semibold text-primary underline">
              Settings → Company information
            </a>
            .
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-3 rounded-xl border border-border bg-muted/20 p-4 sm:flex-row sm:flex-wrap">
          <label className="flex items-center gap-2 text-sm font-medium">
            <Checkbox checked={showPrimaryCta} disabled={!canEdit} onCheckedChange={(c) => setShowPrimaryCta(Boolean(c))} />
            Show primary CTA
          </label>
          <label className="flex items-center gap-2 text-sm font-medium">
            <Checkbox checked={showCallButton} disabled={!canEdit} onCheckedChange={(c) => setShowCallButton(Boolean(c))} />
            Show call button
          </label>
          <label className="flex items-center gap-2 text-sm font-medium">
            <Checkbox checked={showThemeToggle} disabled={!canEdit} onCheckedChange={(c) => setShowThemeToggle(Boolean(c))} />
            Show theme toggle
          </label>
        </div>
      </Card>

      <Card className="border-border bg-card p-6">
        <h2 className="font-display text-lg font-semibold text-foreground">Theme</h2>
        <p className="mt-1 text-sm text-muted-foreground">Used when the visitor has not chosen a theme yet (no saved preference).</p>
        <div className="mt-4 max-w-xs space-y-1">
          <Label htmlFor="default-theme">Default theme</Label>
          <select
            id="default-theme"
            disabled={!canEdit}
            value={defaultTheme}
            onChange={(e) => setDefaultTheme(e.target.value as "light" | "dark" | "system")}
            className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </div>
      </Card>

      <Card className="border-border bg-card p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold text-foreground">Navigation items</h2>
            <p className="mt-1 text-sm text-muted-foreground">Visible + active items appear on the public site, ordered by sort order.</p>
          </div>
          {canEdit ? (
            <Button type="button" className="rounded-xl bg-primary text-primary-foreground" onClick={openNewNav}>
              <Plus className="h-4 w-4" />
              Add item
            </Button>
          ) : null}
        </div>
        <div className="mt-4 overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-3 py-2">Order</th>
                <th className="px-3 py-2">Label</th>
                <th className="px-3 py-2">URL</th>
                <th className="px-3 py-2">Visible</th>
                <th className="px-3 py-2">Active</th>
                <th className="px-3 py-2">External</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-foreground">
              {sortedNav(navItems).map((row, idx) => (
                <tr key={row.id} className="hover:bg-muted/30">
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1">
                      <Button type="button" size="icon" variant="ghost" className="h-8 w-8" disabled={!canEdit || pending || idx === 0} onClick={() => moveNav(row.id, -1)}>
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        disabled={!canEdit || pending || idx === sortedNav(navItems).length - 1}
                        onClick={() => moveNav(row.id, 1)}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <span className="ml-1 font-mono text-xs text-muted-foreground">{row.sortOrder}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 font-medium">{row.label}</td>
                  <td className="max-w-[200px] truncate px-3 py-2 font-mono text-xs text-muted-foreground">{row.href}</td>
                  <td className="px-3 py-2">{row.isVisible ? "Yes" : "No"}</td>
                  <td className="px-3 py-2">{row.isActive ? "Yes" : "No"}</td>
                  <td className="px-3 py-2">{row.isExternal ? "Yes" : "No"}</td>
                  <td className="px-3 py-2 text-right">
                    {canEdit ? (
                      <>
                        <Button type="button" size="icon" variant="ghost" onClick={() => openEditNav(row)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button type="button" size="icon" variant="ghost" className="text-red-400" onClick={() => setDeleteNavId(row.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={navOpen} onOpenChange={setNavOpen}>
        <DialogContent className="border-border bg-background text-foreground sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">{editingNav === "new" ? "Add link" : "Edit link"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="space-y-1">
              <Label>Label</Label>
              <Input value={navLabel} onChange={(e) => setNavLabel(e.target.value)} className="border-border bg-muted/50" />
            </div>
            <div className="space-y-1">
              <Label>URL</Label>
              <Input value={navHref} onChange={(e) => setNavHref(e.target.value)} className="border-border bg-muted/50 font-mono text-sm" />
            </div>
            <div className="space-y-1">
              <Label>Sort order</Label>
              <Input type="number" min={0} max={999} value={navSort} onChange={(e) => setNavSort(Number(e.target.value))} className="border-border bg-muted/50" />
            </div>
            <label className="flex items-center gap-2 text-sm font-medium">
              <Checkbox checked={navVisible} onCheckedChange={(c) => setNavVisible(Boolean(c))} />
              Visible
            </label>
            <label className="flex items-center gap-2 text-sm font-medium">
              <Checkbox checked={navActive} onCheckedChange={(c) => setNavActive(Boolean(c))} />
              Active
            </label>
            <label className="flex items-center gap-2 text-sm font-medium">
              <Checkbox checked={navExternal} onCheckedChange={(c) => setNavExternal(Boolean(c))} />
              External link
            </label>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setNavOpen(false)}>
              Cancel
            </Button>
            <Button type="button" className="bg-primary text-primary-foreground" disabled={pending || !canEdit} onClick={() => void saveNav()}>
              Save link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(deleteNavId)} onOpenChange={() => setDeleteNavId(null)}>
        <AlertDialogContent className="border-border bg-background">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete navigation item?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">This removes the link from the admin list.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600"
              onClick={(e) => {
                e.preventDefault();
                void confirmDeleteNav();
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
