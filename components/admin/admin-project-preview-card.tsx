"use client";

import * as React from "react";
import { MapPin } from "lucide-react";
import { AdminBadge } from "@/components/admin/ui/admin-badge";
import { cn } from "@/lib/utils";
import { isSafeImageSource } from "@/lib/validations/image-url";
import { ImageFallbackPlaceholder } from "@/components/media/image-fallback-placeholder";

type Props = {
  title: string;
  category: string;
  location: string;
  summary: string;
  coverUrl: string;
  galleryUrls?: string[];
  className?: string;
};

export function AdminProjectPreviewCard({
  title,
  category,
  location,
  summary,
  coverUrl,
  galleryUrls = [],
  className,
}: Props) {
  const hero = coverUrl.trim();
  const showHero = hero && isSafeImageSource(hero);

  return (
    <aside
      className={cn(
        "overflow-hidden rounded-xl border border-sky-200/70 bg-gradient-to-b from-sky-50/90 to-white/90 shadow-lg backdrop-blur-md dark:border-sky-900/50 dark:from-sky-950/40 dark:to-slate-950/60",
        className,
      )}
    >
      <div className="border-b border-sky-200/50 px-3 py-2 dark:border-sky-900/40">
        <p className="text-[10px] font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300">Live preview</p>
        <p className="text-xs text-muted-foreground">Updates as you type</p>
      </div>
      <div className="relative aspect-[16/10] bg-muted/40">
        {showHero ? (
          // eslint-disable-next-line @next/next/no-img-element -- admin preview
          <img src={hero} alt="" className="h-full w-full object-cover" />
        ) : (
          <ImageFallbackPlaceholder className="h-full min-h-[140px]" />
        )}
        {category ? (
          <div className="absolute left-2 top-2">
            <AdminBadge variant="navy" className="text-[9px]">
              {category || "Category"}
            </AdminBadge>
          </div>
        ) : null}
      </div>
      <div className="space-y-2 p-3">
        <h4 className="line-clamp-2 font-display text-sm font-semibold text-foreground">
          {title.trim() || "Project title"}
        </h4>
        <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <MapPin className="h-3 w-3 shrink-0 text-sky-600" />
          {location.trim() || "Location"}
        </p>
        <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">
          {summary.trim() || "Summary will appear here…"}
        </p>
        {galleryUrls.filter(Boolean).length > 0 ? (
          <div className="flex gap-1.5 overflow-x-auto pt-1">
            {galleryUrls
              .filter((u) => u.trim() && isSafeImageSource(u.trim()))
              .slice(0, 4)
              .map((u) => (
                // eslint-disable-next-line @next/next/no-img-element -- admin preview
                <img
                  key={u}
                  src={u.trim()}
                  alt=""
                  className="h-10 w-14 shrink-0 rounded-md border border-border/60 object-cover"
                />
              ))}
          </div>
        ) : null}
      </div>
    </aside>
  );
}
