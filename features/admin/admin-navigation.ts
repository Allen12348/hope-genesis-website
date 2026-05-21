import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  FolderOpen,
  ImageIcon,
  LayoutDashboard,
  LayoutPanelTop,
  LibraryBig,
  MessageSquareQuote,
  PanelLeft,
  Settings,
  Tags,
  Wrench,
} from "lucide-react";

export type AdminNavGroupId = "overview" | "content" | "website" | "system";

export const ADMIN_NAV_GROUP_ORDER: AdminNavGroupId[] = ["overview", "content", "website", "system"];

export const ADMIN_NAV_GROUP_LABEL: Record<AdminNavGroupId, string> = {
  overview: "Overview",
  content: "Content",
  website: "Website",
  system: "System",
};

export type AdminNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  group: AdminNavGroupId;
};

/** Single source for admin sidebar + future role-based filtering. */
export const ADMIN_DASHBOARD_NAV: AdminNavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, group: "overview" },
  { href: "/admin/content", label: "Content CMS", icon: LibraryBig, group: "content" },
  { href: "/admin/media", label: "Media library", icon: FolderOpen, group: "content" },
  { href: "/admin/services", label: "Services", icon: Wrench, group: "content" },
  { href: "/admin/projects", label: "Projects", icon: PanelLeft, group: "content" },
  { href: "/admin/gallery", label: "Gallery", icon: ImageIcon, group: "content" },
  { href: "/admin/brands", label: "Brands", icon: Tags, group: "content" },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote, group: "content" },
  { href: "/admin/blog", label: "Blog", icon: BookOpen, group: "content" },
  { href: "/admin/settings/header", label: "Header & nav", icon: LayoutPanelTop, group: "website" },
  { href: "/admin/settings", label: "Settings", icon: Settings, group: "system" },
];
