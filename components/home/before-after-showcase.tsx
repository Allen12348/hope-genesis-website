"use client";

import * as React from "react";
import { CmsImage } from "@/components/media/cms-image";
import { motion, useReducedMotion } from "framer-motion";
import type { BeforeAfterCms, SectionShellCms } from "@/lib/cms/marketing-cms-defaults";
import { SectionShell } from "@/components/sections/section-shell";

function CompareSlide({ item }: { item: BeforeAfterCms["items"][number] }) {
  const [position, setPosition] = React.useState(50);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const onMove = React.useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(98, Math.max(2, pct)));
  }, []);

  return (
    <div className="space-y-3">
      <div
        ref={containerRef}
        className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-border/50 bg-muted shadow-premium select-none touch-none"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          onMove(e.clientX);
        }}
        onPointerMove={(e) => {
          if (e.buttons !== 1 && e.pointerType !== "touch") return;
          onMove(e.clientX);
        }}
      >
        <CmsImage src={item.afterImageUrl} alt={item.afterAlt} fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" />
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${position}%` }}>
          <CmsImage
            src={item.beforeImageUrl}
            alt={item.beforeAlt}
            fill
            className="object-cover"
            sizes="(max-width:768px) 100vw, 50vw"
          />
        </div>
        <motion.div
          className="absolute inset-y-0 z-10 w-0.5 bg-white/90 shadow-[0_0_12px_rgba(56,189,248,0.5)]"
          style={{ left: `${position}%` }}
          aria-hidden
        />
        <motion.div
          className="absolute top-1/2 z-20 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-white/95 text-xs font-semibold text-foreground shadow-lg"
          style={{ left: `${position}%` }}
          aria-hidden
        >
          ↔
        </motion.div>
        <span className="absolute left-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
          Before
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-primary/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground">
          After
        </span>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">{item.category}</p>
        <h3 className="mt-1 font-display text-lg font-semibold text-foreground">{item.title}</h3>
        {item.caption ? <p className="mt-1 text-sm text-muted-foreground">{item.caption}</p> : null}
      </div>
    </div>
  );
}

export function BeforeAfterShowcase({
  shell,
  data,
}: {
  shell: SectionShellCms;
  data: BeforeAfterCms;
}) {
  const reduce = useReducedMotion();
  const items = (Array.isArray(data?.items) ? data.items : []).slice(0, 4);

  return (
    <SectionShell
      eyebrow={shell.eyebrow}
      title={shell.title}
      description={shell.description}
      className="section-divider-top"
    >
      <div className="grid gap-8 md:grid-cols-2">
        {items.map((item, i) => (
          <motion.div
            key={item.title}
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <CompareSlide item={item} />
          </motion.div>
        ))}
      </div>
    </SectionShell>
  );
}
