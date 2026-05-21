"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  Building2,
  Droplets,
  Refrigerator,
  Settings2,
  Wind,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { HeroServicePreviewCms } from "@/lib/cms/marketing-cms-defaults";
import { cn } from "@/lib/utils";

const iconMap: Record<HeroServicePreviewCms["icon"], LucideIcon> = {
  installation: Wind,
  cleaning: Droplets,
  maintenance: Settings2,
  refrigeration: Refrigerator,
  commercial: Building2,
  repair: Wrench,
};

export function HeroServicesStrip({ items }: { items: HeroServicePreviewCms[] }) {
  const reduce = useReducedMotion();

  return (
    <section
      aria-label="HVAC services overview"
      className="relative -mt-6 border-b border-border/40 bg-gradient-to-b from-background via-background to-muted/20 pb-16 pt-4 sm:-mt-8 sm:pb-20 lg:pb-24"
    >
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background to-transparent"
        aria-hidden
      />
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent"
        aria-hidden
      />
      <motion.div
        className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8"
        initial={reduce ? false : { opacity: 0, y: 12 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-5">
          {(Array.isArray(items) ? items : []).map((item, i) => {
            const Icon = iconMap[item.icon] ?? Wind;
            return (
              <motion.div
                key={item.title}
                initial={reduce ? false : { opacity: 0, y: 10 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "group relative flex h-full flex-col gap-3 overflow-hidden rounded-2xl border border-border/50",
                    "bg-card/80 p-5 shadow-sm backdrop-blur-xl transition-all duration-300",
                    "hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-[0_16px_48px_-20px_rgba(56,189,248,0.28)]",
                  )}
                >
                  <span
                    className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/8 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                    aria-hidden
                  />
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15 transition group-hover:bg-primary group-hover:text-primary-foreground group-hover:ring-primary/30">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-display text-base font-semibold tracking-tight text-foreground">{item.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
