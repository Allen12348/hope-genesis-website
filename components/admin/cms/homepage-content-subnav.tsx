import Link from "next/link";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin/content/homepage/visual", label: "Visual editor", key: "visual" as const },
  { href: "/admin/content/builder/homepage", label: "Page builder", key: "builder" as const },
  { href: "/admin/content/homepage/hero", label: "Hero settings", key: "hero" as const },
  { href: "/admin/content/site-settings", label: "Homepage layout", key: "layout" as const },
  { href: "/admin/content/homepage/hero-stats", label: "Hero stats", key: "hero-stats" as const },
] as const;

export function HomepageContentSubnav({
  active,
}: {
  active: "visual" | "builder" | "hero" | "hero-stats" | "layout";
}) {
  return (
    <nav className="flex flex-wrap gap-2" aria-label="Homepage CMS sections">
      {LINKS.map((link) => {
        const isActive = active === link.key;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-semibold transition",
              isActive
                ? "border-accent bg-accent/10 text-accent"
                : "border-border/70 text-muted-foreground hover:border-accent/40 hover:text-foreground",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
