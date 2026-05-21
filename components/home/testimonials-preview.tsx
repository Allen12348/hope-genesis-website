"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { fadeSlideMotion, defaultTransition } from "@/components/motion/motion-presets";
import { ArrowRight, ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import * as React from "react";
import type { SectionShellCms } from "@/lib/cms/marketing-cms-defaults";
import { DEFAULT_HOME_PAGE_PUBLISHED } from "@/lib/cms/marketing-cms-defaults";
import type { Testimonial } from "@/types";
import { Button } from "@/components/ui/button";
import { SectionShell } from "@/components/sections/section-shell";
import { cn } from "@/lib/utils";

const defaultShell = DEFAULT_HOME_PAGE_PUBLISHED.homeSectionShells.testimonialsPreview;

function testimonialInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] ?? "";
  const b =
    parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : (parts[0]?.[1] ?? "");
  const s = (a + b).toUpperCase();
  return s || "?";
}

function TestimonialGrid({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {testimonials.slice(0, 4).map((t) => (
        <article key={t.id} className="rounded-2xl border border-border/55 bg-card p-5 shadow-sm">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn("h-3.5 w-3.5", i < t.rating ? "fill-primary text-primary" : "text-muted-foreground/35")}
              />
            ))}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-foreground">“{t.quote}”</p>
          <p className="mt-3 text-xs font-semibold text-foreground">{t.name}</p>
          <p className="text-xs text-muted-foreground">{t.company || t.role}</p>
        </article>
      ))}
    </div>
  );
}

export function TestimonialsPreviewSection({
  testimonials,
  shell = defaultShell,
  layout = "carousel",
}: {
  testimonials: Testimonial[];
  shell?: SectionShellCms;
  layout?: "carousel" | "grid";
}) {
  const reduce = useReducedMotion();
  const len = testimonials.length;
  const [idx, setIdx] = React.useState(0);
  const safeIdx = len ? Math.min(idx, len - 1) : 0;
  const t = len ? (testimonials[safeIdx] ?? testimonials[0]) : null;

  const prev = () => {
    if (!len) return;
    setIdx((i) => (i - 1 + len) % len);
  };
  const next = () => {
    if (!len) return;
    setIdx((i) => (i + 1) % len);
  };

  React.useEffect(() => {
    if (reduce || len <= 1) return;
    const id = window.setInterval(() => {
      setIdx((i) => (i + 1) % len);
    }, 6800);
    return () => window.clearInterval(id);
  }, [reduce, len]);

  const hasPhoto = Boolean(t?.avatar.trim());

  if (!t) {
    return (
      <SectionShell eyebrow={shell.eyebrow} title={shell.title} description={shell.description}>
        <div className="rounded-2xl border border-border/55 bg-card p-8 text-center shadow-premium">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Testimonials will appear here once published from the admin console.
          </p>
          <Button asChild variant="outline" className="mt-4 rounded-2xl">
            <Link href="/contact">Share your experience</Link>
          </Button>
        </div>
      </SectionShell>
    );
  }

  if (layout === "grid") {
    return (
      <SectionShell eyebrow={shell.eyebrow} title={shell.title} description={shell.description}>
        <TestimonialGrid testimonials={testimonials} />
      </SectionShell>
    );
  }

  return (
    <SectionShell eyebrow={shell.eyebrow} title={shell.title} description={shell.description}>
      <div className="relative overflow-hidden rounded-2xl border border-border/55 bg-card p-6 shadow-premium sm:p-10 lg:p-12">
        <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-primary/[0.06] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -right-10 h-44 w-44 rounded-full bg-accent/20 blur-3xl" />

        <div className="relative grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-10">
          <div className="flex flex-col gap-5 lg:col-span-4">
            <div className="flex items-center gap-3">
              <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-border/50 shadow-sm sm:h-16 sm:w-16 sm:rounded-2xl">
                {hasPhoto ? (
                  <Image src={t.avatar} alt="" fill className="object-cover" sizes="64px" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted text-sm font-semibold text-muted-foreground">
                    {testimonialInitials(t.name)}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <div className="font-display text-base font-semibold text-foreground">{t.name}</div>
                <div className="text-xs text-muted-foreground sm:text-sm">
                  {t.role}
                  {t.company ? ` · ${t.company}` : ""}
                </div>
                <div className="mt-1.5 flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-3.5 w-3.5 sm:h-4 sm:w-4",
                        i < t.rating ? "fill-primary text-primary" : "text-muted-foreground/35",
                      )}
                      aria-hidden
                    />
                  ))}
                </div>
              </div>
            </div>

            {len > 1 ? (
              <div className="flex flex-wrap items-center gap-2">
                <Button type="button" variant="outline" size="icon" className="rounded-xl" onClick={prev} aria-label="Previous testimonial">
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button type="button" variant="outline" size="icon" className="rounded-xl" onClick={next} aria-label="Next testimonial">
                  <ChevronRight className="h-5 w-5" />
                </Button>
                <span className="text-xs text-muted-foreground">
                  {safeIdx + 1} / {len}
                </span>
              </div>
            ) : null}
          </div>

          <div className="lg:col-span-8">
            <Quote className="h-7 w-7 text-primary/45 sm:h-8 sm:w-8" aria-hidden />
            <AnimatePresence mode="wait" initial={false}>
              <motion.blockquote
                key={t.id}
                {...fadeSlideMotion(reduce, "y")}
                transition={defaultTransition}
                className="mt-3 text-base leading-relaxed text-foreground sm:text-lg sm:leading-relaxed"
              >
                “{t.quote}”
              </motion.blockquote>
            </AnimatePresence>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                variant="outline"
                className="rounded-2xl border-border/70 bg-background/80 hover:border-primary/30 hover:bg-primary/[0.04]"
              >
                <Link href="/testimonials">
                  Read testimonials
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
