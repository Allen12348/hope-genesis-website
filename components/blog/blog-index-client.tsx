"use client";

import Link from "next/link";
import * as React from "react";
import type { BlogPostSummary } from "@/types";
import { blogCategories } from "@/lib/services/marketing/constants";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CmsImage } from "@/components/media/cms-image";

export function BlogIndexClient({ blogPosts }: { blogPosts: BlogPostSummary[] }) {
  const [q, setQ] = React.useState("");
  const [cat, setCat] = React.useState<(typeof blogCategories)[number]>("All");

  const featured = blogPosts.filter((p) => p.featured);
  const list = blogPosts.filter((p) => {
    const matchesCat = cat === "All" || p.category === cat;
    const hay = `${p.title} ${p.description}`.toLowerCase();
    const matchesQ = !q.trim() || hay.includes(q.toLowerCase());
    return matchesCat && matchesQ;
  });

  if (blogPosts.length === 0) {
    return (
      <p className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
        Blog articles will appear here once published from the admin console.
      </p>
    );
  }

  return (
    <div className="space-y-10">
      {featured.length ? (
        <section className="grid gap-4 lg:grid-cols-2">
          {featured.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="group block">
              <Card className="h-full overflow-hidden rounded-3xl border-border/70 bg-card/80 shadow-glass backdrop-blur transition-transform hover:-translate-y-1">
                <div className="relative aspect-[16/9]">
                  <CmsImage
                    src={p.coverImage}
                    alt={p.coverAlt}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                  <div className="absolute left-4 top-4">
                    <Badge className="rounded-full">Featured</Badge>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <div className="text-xs font-semibold uppercase tracking-wide text-accent">
                      {p.category}
                    </div>
                    <div className="mt-2 font-display text-2xl font-semibold leading-snug text-slate-900 dark:text-white">
                      {p.title}
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      {p.readingMinutes} min read ·{" "}
                      {new Date(p.publishedAt).toLocaleDateString("en-PH")}
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </section>
      ) : null}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search articles…"
          className="max-w-xl rounded-2xl"
        />
        <div className="flex flex-wrap gap-2">
          {blogCategories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
                c === cat
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border/70 bg-muted/30 hover:bg-muted/50",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {list.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="group block">
            <Card className="overflow-hidden rounded-3xl border-border/70 bg-card/70 transition-transform hover:-translate-y-1">
              <div className="grid gap-0 sm:grid-cols-5">
                <div className="relative aspect-[16/10] sm:col-span-2">
                  <CmsImage
                    src={p.coverImage}
                    alt={p.coverAlt}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    sizes="(min-width: 640px) 240px, 100vw"
                    loading="lazy"
                  />
                </div>
                <div className="space-y-2 p-5 sm:col-span-3">
                  <Badge variant="outline" className="rounded-full">
                    {p.category}
                  </Badge>
                  <div className="font-display text-lg font-semibold leading-snug text-slate-900 dark:text-white">{p.title}</div>
                  <p className="text-sm text-muted-foreground line-clamp-3">{p.description}</p>
                  <div className="text-xs text-muted-foreground">
                    {p.readingMinutes} min read · {new Date(p.publishedAt).toLocaleDateString("en-PH")}
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {!list.length ? (
        <p className="text-sm text-muted-foreground">No articles match your filters.</p>
      ) : null}
    </div>
  );
}
