"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import type { SectionShellCms } from "@/lib/cms/marketing-cms-defaults";
import { DEFAULT_HOME_PAGE_PUBLISHED } from "@/lib/cms/marketing-cms-defaults";
import type { Project } from "@/types";
import { Button } from "@/components/ui/button";
import { SectionShell } from "@/components/sections/section-shell";
import { Badge } from "@/components/ui/badge";

const defaultShell = DEFAULT_HOME_PAGE_PUBLISHED.homeSectionShells.projectsPreview;

export function ProjectsPreviewSection({
  projects,
  shell = defaultShell,
}: {
  projects: Project[];
  shell?: SectionShellCms;
}) {
  const featured = (() => {
    const flagged = projects.filter((p) => p.featured);
    if (flagged.length >= 3) return flagged.slice(0, 3);
    if (flagged.length > 0) {
      const rest = projects.filter((p) => !p.featured).slice(0, 3 - flagged.length);
      return [...flagged, ...rest];
    }
    return projects.slice(0, 3);
  })();
  return (
    <SectionShell eyebrow={shell.eyebrow} title={shell.title} description={shell.description}>
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
        {featured.map((p) => (
          <Link
            key={p.slug}
            href={`/projects/${p.slug}`}
            className="group overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition duration-300 ease-out hover:-translate-y-1 hover:border-primary/20 hover:shadow-premium"
          >
            <div className="relative aspect-[16/11]">
              <Image
                src={p.image}
                alt={p.imageAlt}
                fill
                className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
                sizes="(min-width: 768px) 33vw, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/15 to-transparent opacity-95 transition-opacity duration-300 group-hover:from-slate-950/88" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
                <Badge className="rounded-full border border-white/15 bg-white/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/95 backdrop-blur-sm">
                  {p.category}
                </Badge>
                <div className="mt-2 font-display text-base font-semibold leading-snug tracking-tight sm:text-lg">{p.title}</div>
                <div className="mt-1 flex items-center gap-1 text-xs text-white/75">
                  <MapPin className="h-3.5 w-3.5 text-accent" />
                  {p.location}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-10">
        <Button asChild size="lg" variant="secondary" className="rounded-2xl px-7 shadow-sm">
          <Link href="/projects">
            View Projects
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </SectionShell>
  );
}
