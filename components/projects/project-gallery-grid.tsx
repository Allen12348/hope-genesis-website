"use client";

import * as React from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type Props = {
  images: string[];
  title: string;
  className?: string;
};

export function ProjectGalleryGrid({ images, title, className }: Props) {
  const [lightbox, setLightbox] = React.useState<string | null>(null);

  if (!images.length) return null;

  return (
    <>
      <div className={cn("grid grid-cols-2 gap-3 sm:grid-cols-3 lg:gap-4", className)}>
        {images.map((src, i) => (
          <button
            key={`${src}-${i}`}
            type="button"
            className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/70 bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => setLightbox(src)}
            aria-label={`View gallery image ${i + 1} for ${title}`}
          >
            <Image
              src={src}
              alt={`${title} — gallery ${i + 1}`}
              fill
              className="object-cover transition duration-500 group-hover:scale-[1.03]"
              sizes="(min-width: 1024px) 25vw, 50vw"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
          </button>
        ))}
      </div>

      <Dialog open={Boolean(lightbox)} onOpenChange={(open) => !open && setLightbox(null)}>
        <DialogContent className="max-w-4xl border-border/80 bg-background p-2 sm:p-3">
          <button
            type="button"
            className="absolute right-3 top-3 z-10 rounded-full border border-border/80 bg-background/90 p-2 text-foreground shadow-sm backdrop-blur"
            onClick={() => setLightbox(null)}
            aria-label="Close gallery"
          >
            <X className="h-4 w-4" />
          </button>
          {lightbox ? (
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element -- lightbox full res */}
              <img src={lightbox} alt={title} className="h-full w-full object-contain" />
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
