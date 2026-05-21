import {
  DEFAULT_HOME_PAGE_PUBLISHED,
  HERO_STAT_ICON_IDS,
  type HeroStatCms,
  type HeroStatIcon,
} from "@/lib/cms/marketing-cms-defaults";

export const DEFAULT_HERO_STATS: HeroStatCms[] = DEFAULT_HOME_PAGE_PUBLISHED.hero.stats;

export const HERO_STAT_ICON_LABELS: Record<HeroStatIcon, string> = {
  briefcase: "Briefcase (projects)",
  clock: "Clock (experience)",
  users: "Users (clients)",
  shield: "Shield (certifications)",
};

function isHeroStatIcon(v: unknown): v is HeroStatIcon {
  return typeof v === "string" && (HERO_STAT_ICON_IDS as readonly string[]).includes(v);
}

function newStatId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `stat-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Coerce stored JSON into canonical hero stat rows (ids, sort order, visibility). */
export function normalizeHeroStats(input: unknown): HeroStatCms[] {
  if (!Array.isArray(input) || input.length === 0) {
    return DEFAULT_HERO_STATS.map((s) => ({ ...s }));
  }

  const out: HeroStatCms[] = [];

  for (let i = 0; i < input.length; i++) {
    const raw = input[i];
    if (!raw || typeof raw !== "object") continue;
    const o = raw as Record<string, unknown>;

    const label = typeof o.label === "string" ? o.label.trim() : "";
    if (!label) continue;

    const value =
      typeof o.value === "number" && Number.isFinite(o.value)
        ? Math.max(0, Math.round(o.value))
        : typeof o.value === "string"
          ? Math.max(0, Math.round(Number.parseFloat(o.value.replace(/[^\d.]/g, "")) || 0))
          : 0;

    const suffix = typeof o.suffix === "string" ? o.suffix : o.suffix === undefined ? "+" : "";
    const icon = isHeroStatIcon(o.icon) ? o.icon : undefined;
    const sortOrder =
      typeof o.sortOrder === "number" && Number.isFinite(o.sortOrder) ? o.sortOrder : i;
    const visible = o.visible !== false;
    const id = typeof o.id === "string" && o.id.trim() ? o.id.trim() : newStatId();

    out.push({ id, label, value, suffix, icon, sortOrder, visible });
  }

  if (out.length === 0) {
    return DEFAULT_HERO_STATS.map((s) => ({ ...s }));
  }

  return [...out].sort((a, b) => a.sortOrder - b.sortOrder || a.label.localeCompare(b.label));
}

/** Stats shown on the public hero — visible rows only; falls back when CMS has no valid stats. */
export function resolveVisibleHeroStats(stats: unknown): HeroStatCms[] {
  const normalized = normalizeHeroStats(stats);
  const visible = normalized.filter((s) => s.visible);
  return visible.length > 0 ? visible : DEFAULT_HERO_STATS.map((s) => ({ ...s }));
}

export function createEmptyHeroStat(sortOrder: number): HeroStatCms {
  return {
    id: newStatId(),
    label: "New stat",
    value: 0,
    suffix: "+",
    icon: "briefcase",
    sortOrder,
    visible: true,
  };
}

export function reindexHeroStats(stats: HeroStatCms[]): HeroStatCms[] {
  return stats.map((s, i) => ({ ...s, sortOrder: i }));
}
