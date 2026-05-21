"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, CornerDownLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ADMIN_DASHBOARD_NAV } from "@/features/admin";
import { cn } from "@/lib/utils";

const QUICK = [
  { href: "/admin/content", label: "Content CMS hub" },
  { href: "/admin/testimonials", label: "Testimonial approvals" },
  { href: "/admin/projects?new=1", label: "New project" },
  { href: "/admin/blog", label: "Blog posts" },
  { href: "/admin/content/homepage/visual", label: "Homepage visual editor" },
];

export function AdminGlobalSearch() {
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState("");
  const router = useRouter();

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const needle = q.trim().toLowerCase();
  const navHits = needle
    ? ADMIN_DASHBOARD_NAV.filter(
        (item) =>
          item.label.toLowerCase().includes(needle) || item.href.toLowerCase().includes(needle),
      )
    : ADMIN_DASHBOARD_NAV;
  const quickHits = needle
    ? QUICK.filter((x) => x.label.toLowerCase().includes(needle) || x.href.includes(needle))
    : QUICK;

  function go(href: string) {
    setOpen(false);
    setQ("");
    router.push(href);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-9 max-w-sm flex-1 items-center gap-2 rounded-xl border border-border bg-muted/50 px-3 text-left text-xs font-medium text-muted-foreground transition-colors hover:border-border hover:bg-muted md:min-w-[220px]"
      >
        <Search className="h-3.5 w-3.5 shrink-0" />
        <span className="truncate">Search workspace…</span>
        <kbd className="ml-auto hidden shrink-0 rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline">
          ⌘K
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg gap-0 overflow-hidden border-border p-0 sm:rounded-2xl">
          <DialogHeader className="border-b border-border px-4 py-3 text-left">
            <DialogTitle className="font-display text-base">Workspace search</DialogTitle>
          </DialogHeader>
          <div className="p-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search pages, content, settings…"
                className="rounded-xl border-border bg-muted/40 pl-9"
                autoFocus
              />
            </div>
          </div>
          <div className="max-h-[min(50vh,360px)] overflow-y-auto border-t border-border px-2 py-2">
            {quickHits.length > 0 ? (
              <div className="mb-3">
                <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Quick</p>
                <ul>
                  {quickHits.map((item) => (
                    <li key={item.href}>
                      <button
                        type="button"
                        onClick={() => go(item.href)}
                        className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-sm hover:bg-muted"
                      >
                        <span>{item.label}</span>
                        <CornerDownLeft className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Navigation</p>
            <ul>
              {navHits.map((item) => (
                <li key={item.href}>
                  <button
                    type="button"
                    onClick={() => go(item.href)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-sm hover:bg-muted",
                    )}
                  >
                    <span>{item.label}</span>
                    <span className="font-mono text-[10px] text-muted-foreground">{item.href}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
