"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Eye, EyeOff, Plus, RotateCcw, Trash2 } from "lucide-react";
import {
  CMS_PAGE_KEYS,
  HERO_STAT_ICON_IDS,
  type HeroStatCms,
  type HeroStatIcon,
  type HomePagePublishedV1,
} from "@/lib/cms/marketing-cms-defaults";
import {
  createEmptyHeroStat,
  DEFAULT_HERO_STATS,
  HERO_STAT_ICON_LABELS,
  normalizeHeroStats,
  reindexHeroStats,
} from "@/lib/cms/hero-stats";
import { upsertPageContentAction } from "@/lib/actions/cms-site";
import { HomepageContentSubnav } from "@/components/admin/cms/homepage-content-subnav";
import { HeroStatsPreviewCards } from "@/components/admin/cms/hero-stats-preview-cards";
import { AdminCard } from "@/components/admin/ui/admin-card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function cloneHome(h: HomePagePublishedV1): HomePagePublishedV1 {
  return structuredClone(h);
}

function patchStats(prev: HomePagePublishedV1, stats: HeroStatCms[]): HomePagePublishedV1 {
  return { ...prev, hero: { ...prev.hero, stats } };
}

type StatRowEditorProps = {
  row: HeroStatCms;
  index: number;
  total: number;
  canEdit: boolean;
  pending: boolean;
  onMove: (id: string, dir: -1 | 1) => void;
  onToggleVisible: (id: string) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, patch: Partial<HeroStatCms>) => void;
};

function StatRowEditor(props: StatRowEditorProps) {
  const { row, index, total, canEdit, pending, onMove, onToggleVisible, onRemove, onUpdate } = props;
  return (
    <li className="rounded-xl border border-border/70 bg-muted/20 p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Stat {index + 1}</span>
        <div className="flex items-center gap-0.5">
          <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-lg" disabled={!canEdit || pending || index === 0} onClick={() => onMove(row.id, -1)} aria-label="Move up"><ArrowUp className="h-4 w-4" /></Button>
          <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-lg" disabled={!canEdit || pending || index === total - 1} onClick={() => onMove(row.id, 1)} aria-label="Move down"><ArrowDown className="h-4 w-4" /></Button>
          <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-lg" disabled={!canEdit || pending} onClick={() => onToggleVisible(row.id)} aria-label={row.visible ? "Hide stat" : "Show stat"}>{row.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}</Button>
          <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-destructive hover:text-destructive" disabled={!canEdit || pending} onClick={() => onRemove(row.id)} aria-label="Delete stat"><Trash2 className="h-4 w-4" /></Button>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`stat-value-${row.id}`}>Value</Label>
          <Input id={`stat-value-${row.id}`} type="number" min={0} step={1} disabled={!canEdit} value={row.value} onChange={(e) => onUpdate(row.id, { value: Math.max(0, Math.round(Number(e.target.value) || 0)) })} />
        </div>
        <StatFieldSuffix row={row} canEdit={canEdit} onUpdate={onUpdate} />
        <StatFieldLabel row={row} canEdit={canEdit} onUpdate={onUpdate} />
        <StatFieldIcon row={row} canEdit={canEdit} onUpdate={onUpdate} />
        <StatFieldOrder row={row} canEdit={canEdit} onUpdate={onUpdate} />
        <StatFieldVisible row={row} canEdit={canEdit} onUpdate={onUpdate} />
      </div>
    </li>
  );
}

function StatFieldSuffix({ row, canEdit, onUpdate }: { row: HeroStatCms; canEdit: boolean; onUpdate: StatRowEditorProps["onUpdate"] }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={`stat-suffix-${row.id}`}>Suffix</Label>
      <Input id={`stat-suffix-${row.id}`} disabled={!canEdit} placeholder='e.g. "+" or leave empty' value={row.suffix ?? ""} onChange={(e) => onUpdate(row.id, { suffix: e.target.value })} />
    </div>
  );
}

function StatFieldLabel({ row, canEdit, onUpdate }: { row: HeroStatCms; canEdit: boolean; onUpdate: StatRowEditorProps["onUpdate"] }) {
  return (
    <div className="space-y-2 sm:col-span-2">
      <Label htmlFor={`stat-label-${row.id}`}>Label</Label>
      <Input id={`stat-label-${row.id}`} disabled={!canEdit} value={row.label} onChange={(e) => onUpdate(row.id, { label: e.target.value })} />
    </div>
  );
}

function StatFieldIcon({ row, canEdit, onUpdate }: { row: HeroStatCms; canEdit: boolean; onUpdate: StatRowEditorProps["onUpdate"] }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={`stat-icon-${row.id}`}>Icon</Label>
      <select id={`stat-icon-${row.id}`} disabled={!canEdit} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" value={row.icon ?? "briefcase"} onChange={(e) => onUpdate(row.id, { icon: e.target.value as HeroStatIcon })}>
        {HERO_STAT_ICON_IDS.map((id) => (
          <option key={id} value={id}>{HERO_STAT_ICON_LABELS[id]}</option>
        ))}
      </select>
    </div>
  );
}

function StatFieldOrder({ row, canEdit, onUpdate }: { row: HeroStatCms; canEdit: boolean; onUpdate: StatRowEditorProps["onUpdate"] }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={`stat-order-${row.id}`}>Sort order</Label>
      <Input id={`stat-order-${row.id}`} type="number" min={0} disabled={!canEdit} value={row.sortOrder} onChange={(e) => onUpdate(row.id, { sortOrder: Math.max(0, Math.round(Number(e.target.value) || 0)) })} />
    </div>
  );
}

function StatFieldVisible({ row, canEdit, onUpdate }: { row: HeroStatCms; canEdit: boolean; onUpdate: StatRowEditorProps["onUpdate"] }) {
  return (
    <div className="flex items-center gap-2 sm:col-span-2">
      <Checkbox id={`stat-visible-${row.id}`} disabled={!canEdit} checked={row.visible} onCheckedChange={(v) => onUpdate(row.id, { visible: v === true })} />
      <Label htmlFor={`stat-visible-${row.id}`} className="cursor-pointer text-sm font-normal">Visible on homepage</Label>
    </div>
  );
}

export function HeroStatsCmsForm({ initialHome, canEdit }: { initialHome: HomePagePublishedV1; canEdit: boolean }) {
  const router = useRouter();
  const [home, setHome] = React.useState(() => cloneHome(initialHome));
  const [pending, setPending] = React.useState(false);

  React.useEffect(() => { setHome(cloneHome(initialHome)); }, [initialHome]);

  const stats = React.useMemo(() => normalizeHeroStats(home.hero.stats), [home.hero.stats]);

  function setStats(next: HeroStatCms[]) { setHome((prev) => patchStats(prev, reindexHeroStats(next))); }
  function updateStat(id: string, patch: Partial<HeroStatCms>) { setStats(stats.map((s) => (s.id === id ? { ...s, ...patch } : s))); }
  function moveStat(id: string, dir: -1 | 1) {
    const i = stats.findIndex((s) => s.id === id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= stats.length) return;
    const copy = [...stats];
    const t = copy[i]!;
    copy[i] = copy[j]!;
    copy[j] = t;
    setStats(copy);
  }
  function removeStat(id: string) {
    if (stats.length <= 1) { toast.error("Keep at least one stat row."); return; }
    setStats(stats.filter((s) => s.id !== id));
  }
  function addStat() {
    const maxOrder = stats.length ? Math.max(...stats.map((s) => s.sortOrder)) + 1 : 0;
    setStats([...stats, createEmptyHeroStat(maxOrder)]);
  }
  function resetToDefaults() {
    setStats(DEFAULT_HERO_STATS.map((s) => ({ ...s })));
    toast.success("Reset to defaults locally — click Save & publish to apply.");
  }
  async function savePublish() {
    if (!canEdit) return;
    const payload = patchStats(home, normalizeHeroStats(stats));
    setPending(true);
    const res = await upsertPageContentAction({ pageKey: CMS_PAGE_KEYS.home, publishedData: JSON.stringify(payload, null, 2), draftData: JSON.stringify(payload, null, 2), status: "PUBLISHED" });
    setPending(false);
    if (!res.ok) { toast.error(res.error); return; }
    toast.success(res.message ?? "Hero stats saved");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Content CMS · Homepage</p>
            <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">Hero stats</h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">Edit the animated metric cards in the homepage hero. Changes publish to the live site when you save.</p>
          </div>
          <HomepageContentSubnav active="hero-stats" />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" className="rounded-lg" disabled={!canEdit || pending} onClick={resetToDefaults}><RotateCcw className="mr-1.5 h-3.5 w-3.5" />Reset to defaults</Button>
          <Button type="button" size="sm" className="rounded-lg" disabled={!canEdit || pending} onClick={() => void savePublish()}>Save & publish</Button>
        </div>
      </div>
      {!canEdit ? <p className="text-sm text-amber-700 dark:text-amber-400">Your role is view-only — hero stat changes are disabled.</p> : null}
      <div className="grid gap-6 lg:grid-cols-2">
        <AdminCard className="space-y-4 p-5">
          <div>
            <h2 className="font-display text-base font-semibold text-foreground">Live preview</h2>
            <p className="text-xs text-muted-foreground">Hidden stats appear faded. Visitors only see visible cards.</p>
          </div>
          <HeroStatsPreviewCards stats={stats} showHidden />
        </AdminCard>
        <AdminCard className="space-y-4 p-5">
          <StatFieldIntro />
          <ul className="space-y-4">
            {stats.map((row, index) => (
              <StatRowEditor key={row.id} row={row} index={index} total={stats.length} canEdit={canEdit} pending={pending} onMove={moveStat} onToggleVisible={(id) => { const target = stats.find((s) => s.id === id); if (target) updateStat(id, { visible: !target.visible }); }} onRemove={removeStat} onUpdate={updateStat} />
            ))}
          </ul>
          <Button type="button" variant="outline" size="sm" className="w-full rounded-lg" disabled={!canEdit || pending} onClick={addStat}><Plus className="mr-1.5 h-3.5 w-3.5" />Add stat</Button>
        </AdminCard>
      </div>
      <p className="text-xs text-muted-foreground">Need hero background and copy? Use <Link href="/admin/content/homepage/hero" className="font-medium text-accent hover:underline">Homepage hero settings</Link>.</p>
    </div>
  );
}

function StatFieldIntro() {
  return (
    <div>
      <h2 className="font-display text-base font-semibold text-foreground">Stat rows</h2>
      <p className="text-xs text-muted-foreground">Value is the animated number; suffix is text after it (e.g. &quot;+&quot;). Reorder with arrows.</p>
    </div>
  );
}
