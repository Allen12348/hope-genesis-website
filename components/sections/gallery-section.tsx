"use client";

import Image from "next/image";
import * as React from "react";
import type { GalleryImage } from "@/types";
import type { SectionShellCms } from "@/lib/cms/marketing-cms-defaults";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { SectionShell } from "@/components/sections/section-shell";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const DEFAULT_GALLERY_SHELL: SectionShellCms = {
  eyebrow: "Field gallery",
  title: "Real workmanship — captured on-site",
  description:
    "Tap any frame to zoom. These are representative of our routing discipline, insulation quality, and commissioning culture.",
};

export function GallerySection({
  galleryImages,
  intro = true,
  shellCopy,
}: {
  galleryImages: GalleryImage[];
  intro?: boolean;
  shellCopy?: Partial<SectionShellCms>;
}) {
  const [open, setOpen] = React.useState(false);
  const [activeId, setActiveId] = React.useState<string | null>(null);

  const active = galleryImages.find((g) => g.id === activeId) ?? null;

  const shell = {
    eyebrow: shellCopy?.eyebrow ?? DEFAULT_GALLERY_SHELL.eyebrow,
    title: shellCopy?.title ?? DEFAULT_GALLERY_SHELL.title,
    description: shellCopy?.description ?? DEFAULT_GALLERY_SHELL.description,
  };

  return (
    <SectionShell intro={intro} eyebrow={shell.eyebrow} title={shell.title} description={shell.description}>
      {galleryImages.length === 0 ? (
        <p className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          Gallery images will appear here once uploaded from the admin console.
        </p>
      ) : (
      <div className="gallery-masonry columns-1 sm:columns-2 lg:columns-3">
        {galleryImages.map((g, idx) => (
          <ScrollReveal key={g.id} delay={idx * 0.03}>
            <button
              type="button"
              onClick={() => {
                setActiveId(g.id);
                setOpen(true);
              }}
              className={cn(
                "group w-full overflow-hidden rounded-2xl border border-border/55 bg-card text-left shadow-sm transition-[box-shadow,transform,border-color] duration-300",
                "hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-premium",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              )}
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={g.src}
                  alt={g.alt}
                  fill
                  className="object-cover transition duration-700 ease-out group-hover:scale-[1.035]"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 translate-y-2 p-3 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:p-4">
                  <div className="rounded-xl border border-white/12 bg-white/10 p-2.5 text-xs text-white/95 backdrop-blur-md sm:p-3">
                    {g.caption}
                  </div>
                </div>
              </div>
            </button>
          </ScrollReveal>
        ))}
      </div>
      )}

      <Dialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) setActiveId(null);
        }}
      >
        <DialogContent className="max-w-4xl border-border/70 bg-background/95 p-0 sm:p-0">
          {active ? (
            <>
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-2xl">
                <Image
                  src={active.src}
                  alt={active.alt}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority
                />
              </div>
              <DialogHeader className="p-6">
                <DialogTitle className="text-xl">{active.alt}</DialogTitle>
                <DialogDescription className="text-base leading-relaxed">
                  {active.caption}
                </DialogDescription>
              </DialogHeader>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </SectionShell>
  );
}
