"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Expand, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { CmsImage } from "@/components/media/cms-image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

type CompareProps = {
  beforeSrc: string;
  afterSrc: string;
  alt: string;
  className?: string;
  showChrome?: boolean;
};

function BeforeAfterCompare({
  beforeSrc,
  afterSrc,
  alt,
  className,
  showChrome = true,
}: CompareProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [pct, setPct] = React.useState(50);
  const [dragging, setDragging] = React.useState(false);

  const setFromClientX = React.useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = clientX - r.left;
    const p = (x / r.width) * 100;
    setPct(Math.min(99, Math.max(1, p)));
  }, []);

  React.useEffect(() => {
    if (!dragging) return;
    const up = () => setDragging(false);
    window.addEventListener("pointerup", up);
    return () => window.removeEventListener("pointerup", up);
  }, [dragging]);

  return (
    <div
      ref={ref}
      className={cn(
        "group relative aspect-[16/10] w-full overflow-hidden rounded-3xl border border-border/70 bg-muted/20 shadow-sm",
        className,
      )}
      onPointerMove={(e) => dragging && setFromClientX(e.clientX)}
      onPointerDown={(e) => {
        setDragging(true);
        setFromClientX(e.clientX);
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
      }}
    >
      <CmsImage
        src={afterSrc}
        alt={`${alt} — after`}
        fill
        className="object-cover transition duration-500 group-hover:scale-[1.02]"
        sizes="(min-width: 1024px) 900px, 100vw"
        loading="lazy"
      />

      <div
        className="absolute inset-y-0 left-0 overflow-hidden"
        style={{ width: `${pct}%` }}
      >
        <CmsImage
          src={beforeSrc}
          alt={`${alt} — before`}
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.02]"
          sizes="(min-width: 1024px) 900px, 100vw"
          loading="lazy"
        />
      </div>

      <div
        className="absolute inset-y-0 w-px bg-white/90 shadow-[0_0_0_1px_rgba(0,0,0,0.35)]"
        style={{ left: `${pct}%` }}
      >
        <div className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/55 text-white backdrop-blur">
          <GripVertical className="h-5 w-5" />
        </div>
      </div>

      {showChrome ? (
        <>
          <div className="pointer-events-none absolute left-4 top-4 flex gap-2">
            <span className="rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
              Before
            </span>
            <span className="rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
              After
            </span>
          </div>
        </>
      ) : null}
    </div>
  );
}

type Props = CompareProps & {
  showFullscreen?: boolean;
};

export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  alt,
  className,
  showFullscreen = true,
}: Props) {
  const reduce = useReducedMotion();
  const [fullscreen, setFullscreen] = React.useState(false);

  if (reduce) {
    return (
      <div className={cn("grid gap-3 sm:grid-cols-2", className)}>
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border/70">
          <CmsImage src={beforeSrc} alt={`${alt} before`} fill className="object-cover" sizes="50vw" />
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border/70">
          <CmsImage src={afterSrc} alt={`${alt} after`} fill className="object-cover" sizes="50vw" />
        </div>
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        <BeforeAfterCompare
          beforeSrc={beforeSrc}
          afterSrc={afterSrc}
          alt={alt}
          className={className}
        />
        {showFullscreen ? (
          <div className="absolute right-3 top-3">
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="h-10 w-10 rounded-2xl border border-border/70 bg-background/80 backdrop-blur"
              onClick={() => setFullscreen(true)}
              aria-label="Open fullscreen comparison"
            >
              <Expand className="h-4 w-4" />
            </Button>
          </div>
        ) : null}
      </motion.div>

      <Dialog open={fullscreen} onOpenChange={setFullscreen}>
        <DialogContent className="max-w-5xl border-border/70 bg-background/95 p-4 sm:rounded-3xl">
          <DialogTitle className="sr-only">{alt} comparison</DialogTitle>
          <BeforeAfterCompare
            beforeSrc={beforeSrc}
            afterSrc={afterSrc}
            alt={alt}
            className="rounded-2xl border-border/70"
            showChrome
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
