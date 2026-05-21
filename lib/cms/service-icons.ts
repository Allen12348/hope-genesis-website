import type { LucideIcon } from "lucide-react";
import {
  Building2,
  Factory,
  Fan,
  Home,
  Refrigerator,
  ShieldCheck,
  Snowflake,
  Sparkles,
  Wrench,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  snowflake: Snowflake,
  sparkles: Sparkles,
  fan: Fan,
  shieldcheck: ShieldCheck,
  wrench: Wrench,
  refrigerator: Refrigerator,
  factory: Factory,
  home: Home,
  building2: Building2,
};

export function iconKeyToLucide(iconKey: string): LucideIcon {
  const key = iconKey.trim().toLowerCase();
  return ICONS[key] ?? Sparkles;
}
