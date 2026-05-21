"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { SectionShellCms } from "@/lib/cms/marketing-cms-defaults";
import { DEFAULT_HOME_PAGE_PUBLISHED } from "@/lib/cms/marketing-cms-defaults";
import type { SerializedService } from "@/types";
import { iconKeyToLucide } from "@/lib/cms/service-icons";
import { serviceDetailHref } from "@/constants/routes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { SectionShell } from "@/components/sections/section-shell";
import { cn } from "@/lib/utils";

const defaultShell = DEFAULT_HOME_PAGE_PUBLISHED.homeSectionShells.servicesPreview;

export function ServicesPreviewSection({
  services,
  shell = defaultShell,
}: {
  services: SerializedService[];
  shell?: SectionShellCms;
}) {
  const reduce = useReducedMotion();
  const display = services.slice(0, 5);

  return (
    <SectionShell eyebrow={shell.eyebrow} title={shell.title} description={shell.description}>
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {display.map((s) => {
          const Icon = iconKeyToLucide(s.iconKey);
          return (
            <motion.div
              key={s.slug}
              whileHover={
                reduce
                  ? undefined
                  : { y: -3, transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] } }
              }
            >
              <Card
                className={cn(
                  "group h-full overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm card-sky-hover",
                )}
              >
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm ring-1 ring-primary/10 sm:h-11 sm:w-11 sm:rounded-2xl">
                        <Icon className="h-[1.15rem] w-[1.15rem] sm:h-5 sm:w-5" aria-hidden />
                      </span>
                      <div>
                        <h3 className="font-display text-base font-semibold leading-snug sm:text-lg">{s.title}</h3>
                      </div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground/70 transition group-hover:text-primary sm:h-5 sm:w-5" aria-hidden />
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:mt-4">{s.shortDescription}</p>
                </CardContent>
                <CardFooter className="border-t border-border/50 bg-muted/[0.35] px-5 py-3.5 sm:px-6 sm:py-4">
                  <Button asChild variant="ghost" size="sm" className="rounded-xl px-0 text-primary hover:bg-transparent hover:text-primary/85">
                    <Link href={serviceDetailHref(s.slug)}>
                      View service
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          );
        })}
      </div>
      <div className="mt-10">
        <Button asChild size="lg" variant="secondary" className="rounded-2xl px-7 shadow-sm">
          <Link href="/services">
            View all services
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </SectionShell>
  );
}
