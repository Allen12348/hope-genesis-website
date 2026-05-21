"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { SerializedService } from "@/types";
import { iconKeyToLucide } from "@/lib/cms/service-icons";
import { serviceDetailHref } from "@/constants/routes";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { SectionShell } from "@/components/sections/section-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import type { SectionShellCms } from "@/lib/cms/marketing-cms-defaults";

const DEFAULT_SERVICES_SHELL: SectionShellCms = {
  eyebrow: "Capabilities",
  title: "Premium HVAC & refrigeration services — end to end",
  description:
    "Every engagement is structured: discovery, engineered recommendation, disciplined installation, and lifecycle support. Select a service to view scope, ideal applications, and highlights.",
};

export function ServicesSection({
  services,
  intro = true,
  shellCopy,
}: {
  services: SerializedService[];
  intro?: boolean;
  /** When set, overrides the default SectionShell copy (visual page builder). */
  shellCopy?: Partial<SectionShellCms>;
}) {
  const reduce = useReducedMotion();
  const shell = {
    eyebrow: shellCopy?.eyebrow ?? DEFAULT_SERVICES_SHELL.eyebrow,
    title: shellCopy?.title ?? DEFAULT_SERVICES_SHELL.title,
    description: shellCopy?.description ?? DEFAULT_SERVICES_SHELL.description,
  };

  return (
    <SectionShell
      intro={intro}
      eyebrow={shell.eyebrow}
      title={shell.title}
      description={shell.description}
    >
      {services.length === 0 ? (
        <p className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          Services will appear here once published from the admin console.
        </p>
      ) : (
      <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {services.map((s, idx) => {
          const Icon = iconKeyToLucide(s.iconKey);
          return (
            <ScrollReveal key={s.slug} delay={idx * 0.03}>
              <motion.div
                whileHover={
                  reduce
                    ? undefined
                    : { y: -6, transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] } }
                }
              >
                <Card
                  className={cn(
                    "group relative h-full overflow-hidden rounded-3xl border-border/70 bg-gradient-to-b from-card to-muted/20 shadow-sm",
                  )}
                >
                  <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="absolute -left-24 -top-24 h-56 w-56 rounded-full bg-accent/10 blur-2xl" />
                    <div className="absolute -bottom-28 -right-24 h-64 w-64 rounded-full bg-primary/10 blur-2xl" />
                  </div>

                  <CardContent className="relative p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm ring-1 ring-black/5">
                          <Icon className="h-6 w-6" />
                        </span>
                        <div>
                          <div className="font-display text-lg font-semibold tracking-tight">
                            {s.title}
                          </div>
                          <div className="mt-2 text-sm leading-relaxed text-muted-foreground">
                            {s.shortDescription}
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="rounded-full">
                        HVAC
                      </Badge>
                    </div>
                  </CardContent>

                  <CardFooter className="relative p-6 pt-0">
                    <Button
                      asChild
                      variant="secondary"
                      className="w-full justify-between rounded-2xl"
                    >
                      <Link href={serviceDetailHref(s.slug)}>
                        View details
                        <ArrowUpRight className="h-4 w-4 opacity-80" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </ScrollReveal>
          );
        })}
      </div>
      )}
    </SectionShell>
  );
}
