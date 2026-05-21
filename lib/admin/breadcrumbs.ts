const SEGMENT_LABEL: Record<string, string> = {
  content: "Content",
  services: "Services",
  projects: "Projects",
  gallery: "Gallery",
  brands: "Brands",
  testimonials: "Testimonials",
  blog: "Blog",
  settings: "Settings",
  header: "Header & nav",
  homepage: "Homepage",
  visual: "Visual editor",
  "hero-stats": "Hero stats",
};

export type AdminBreadcrumb = { href: string; label: string };

/** Builds hierarchy under `/admin` for the workspace topbar. */
export function getAdminBreadcrumbs(pathname: string): AdminBreadcrumb[] {
  const normalized = pathname.replace(/\/$/, "") || "/admin";
  if (normalized === "/admin") {
    return [{ href: "/admin", label: "Overview" }];
  }
  const segments = normalized.split("/").filter(Boolean);
  if (segments[0] !== "admin") {
    return [{ href: "/admin", label: "Overview" }];
  }
  const crumbs: AdminBreadcrumb[] = [{ href: "/admin", label: "Dashboard" }];
  let acc = "/admin";
  for (let i = 1; i < segments.length; i++) {
    const seg = segments[i];
    acc += `/${seg}`;
    crumbs.push({
      href: acc,
      label: SEGMENT_LABEL[seg] ?? seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " "),
    });
  }
  return crumbs;
}
