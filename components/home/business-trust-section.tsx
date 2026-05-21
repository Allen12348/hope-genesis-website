"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Award,
  BadgeCheck,
  Building2,
  FileCheck,
  MapPin,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import type { BusinessTrustCms, SectionShellCms } from "@/lib/cms/marketing-cms-defaults";
import { SectionShell } from "@/components/sections/section-shell";
import { cn } from "@/lib/utils";

const groupIcon: Record<BusinessTrustCms["groups"][number]["icon"], LucideIcon> = {
  partners: Building2,
  permits: FileCheck,
  certifications: BadgeCheck,
  awards: Award,
  areas: MapPin,
  clients: ShieldCheck,
};

export function BusinessTrustSection({
  shell,
  data,
}: {
  shell: SectionShellCms;
  data: BusinessTrustCms;
}) {
  const reduce = useReducedMotion();

  return (
    <SectionShell
      eyebrow={shell.eyebrow}
      title={shell.title}
      description={shell.description}
      className="section-divider-top bg-gradient-to-b from-muted/20 via-background to-background"
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {(Array.isArray(data?.groups) ? data.groups : []).map((group, gi) => {
          const Icon = groupIcon[group.icon] ?? ShieldCheck;
          return (
            <motion.div
              key={group.title}
              initial={reduce ? false : { opacity: 0, y: 14 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-24px" }}
              transition={{ delay: gi * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "rounded-2xl border border-border/55 bg-card/70 p-6 shadow-sm backdrop-blur-xl",
                "transition-all duration-300 hover:border-primary/20 hover:shadow-[0_12px_40px_-18px_rgba(56,189,248,0.2)]",
              )}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/12">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">{group.title}</h3>
              </div>
              <ul className="mt-4 space-y-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground"
                  >
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary/70" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>
    </SectionShell>
  );
}
