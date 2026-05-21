"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { fadeSlideMotion, defaultTransition } from "@/components/motion/motion-presets";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { useRouter } from "next/navigation";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { SectionShell } from "@/components/sections/section-shell";
import { TestimonialsRatingCard } from "@/components/sections/testimonials-rating-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Testimonial } from "@/types";
import type { SectionShellCms } from "@/lib/cms/marketing-cms-defaults";

const DEFAULT_TESTIMONIALS_SHELL: SectionShellCms = {
  eyebrow: "Client proof",
  title: "Trusted by operators who cannot afford downtime",
  description: "",
};

function testimonialInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] ?? "";
  const b =
    parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : (parts[0]?.[1] ?? "");
  const s = (a + b).toUpperCase();
  return s || "?";
}

function TestimonialAvatar({
  name,
  avatar,
  sizes,
  priority,
}: {
  name: string;
  avatar: string;
  sizes: string;
  priority?: boolean;
}) {
  const hasPhoto = Boolean(avatar.trim());
  return (
    <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-border/70 shadow-sm">
      {hasPhoto ? (
        <Image
          src={avatar}
          alt={name}
          fill
          className="object-cover"
          sizes={sizes}
          priority={priority}
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/15 via-muted/50 to-[hsl(var(--brand-gold-soft))]/40 font-display text-lg font-semibold tracking-tight text-foreground"
          aria-hidden
        >
          {testimonialInitials(name)}
        </div>
      )}
    </div>
  );
}

export function TestimonialsSection({
  testimonials,
  intro = true,
  shellCopy,
}: {
  testimonials: Testimonial[];
  intro?: boolean;
  shellCopy?: Partial<SectionShellCms>;
}) {
  const router = useRouter();
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
    if (reduce || !len) return;
    const id = window.setInterval(() => {
      setIdx((i) => (i + 1) % len);
    }, 7200);
    return () => window.clearInterval(id);
  }, [reduce, len]);

  const defaultDescription = len
    ? "Real feedback from facilities, retail, cold chain, and residential clients — the kind of partnerships we build through consistency."
    : "Testimonials will appear here once published from the admin console.";

  const shell: SectionShellCms = {
    eyebrow: shellCopy?.eyebrow ?? DEFAULT_TESTIMONIALS_SHELL.eyebrow,
    title: shellCopy?.title ?? DEFAULT_TESTIMONIALS_SHELL.title,
    description:
      shellCopy?.description !== undefined && shellCopy.description !== ""
        ? shellCopy.description
        : defaultDescription,
  };

  return (
    <SectionShell intro={intro} eyebrow={shell.eyebrow} title={shell.title} description={shell.description}>
      <ScrollReveal>
        <div className="grid w-full gap-8 lg:grid-cols-12 lg:items-start lg:gap-10">
          <div className="relative w-full overflow-hidden rounded-2xl border border-border/55 bg-card shadow-premium card-sky-hover lg:col-span-7">
            <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
            <div className="absolute -bottom-28 -right-28 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

            {t ? (
              <div className="relative grid gap-8 p-6 sm:p-10 lg:grid-cols-12 lg:items-center">
                <div className="lg:col-span-4">
                  <div className="flex items-center gap-3">
                    <TestimonialAvatar
                      name={t.name}
                      avatar={t.avatar}
                      sizes="64px"
                      priority={safeIdx === 0}
                    />
                    <div>
                      <div className="font-display text-base font-semibold text-foreground">{t.name}</div>
                      <div className="text-sm text-muted-foreground">
                      {t.company ? `${t.role}, ${t.company}` : t.role}
                    </div>
                      <div className="mt-2 flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "h-4 w-4 transition-colors duration-200",
                              i < t.rating
                                ? "fill-primary text-primary"
                                : "text-muted-foreground/40",
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="rounded-xl"
                      onClick={prev}
                      aria-label="Previous testimonial"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="rounded-xl"
                      onClick={next}
                      aria-label="Next testimonial"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                    <div className="ml-2 text-xs text-muted-foreground">
                      {safeIdx + 1} / {len}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-8">
                  <div className="flex items-start gap-4">
                    <Quote className="mt-1 h-8 w-8 shrink-0 text-primary/85" />
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.blockquote
                        key={t.id}
                        {...fadeSlideMotion(reduce, "y")}
                        transition={defaultTransition}
                        className="text-lg leading-relaxed text-foreground sm:text-xl"
                      >
                        “{t.quote}”
                      </motion.blockquote>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative space-y-4 p-6 sm:p-10">
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  No published testimonials yet. When your team approves entries in admin, they will appear here automatically.
                </p>
                <Button asChild variant="outline" className="rounded-2xl">
                  <Link href="/contact">Contact us for references</Link>
                </Button>
              </div>
            )}
          </div>

          <div className="lg:col-span-5">
            <TestimonialsRatingCard onSubmitted={() => router.refresh()} />
          </div>
        </div>
      </ScrollReveal>
    </SectionShell>
  );
}
