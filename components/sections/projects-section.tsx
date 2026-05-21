"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { fadeSlideMotion, defaultTransition } from "@/components/motion/motion-presets";
import { ArrowUpRight, MapPin, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import type { Project, ProjectCategory } from "@/types";
import type { SectionShellCms } from "@/lib/cms/marketing-cms-defaults";
import { PROJECT_CATEGORIES } from "@/lib/cms/project-categories";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { FeaturedProjectsStrip } from "@/components/sections/featured-projects-strip";
import { SectionShell } from "@/components/sections/section-shell";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const filters: Array<"All" | ProjectCategory> = ["All", ...PROJECT_CATEGORIES];

const DEFAULT_PROJECTS_SHELL: SectionShellCms = {
  eyebrow: "Portfolio",
  title: "Projects engineered for performance — and proof",
  description:
    "Filter by category, search by location or equipment, and open full case studies with scope, stats, gallery, and interactive before/after comparisons.",
};

function ProjectCard({
  project,
  reduce,
}: {
  project: Project;
  reduce: boolean;
}) {
  return (
    <motion.div
      whileHover={
        reduce ? undefined : { y: -4, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } }
      }
    >
      <Link
        href={`/projects/${project.slug}`}
        className={cn(
          "group block w-full overflow-hidden rounded-3xl border border-border/70 bg-card text-left shadow-sm",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        )}
      >
        <div className="relative aspect-[16/11]">
          <Image
            src={project.image}
            alt={project.imageAlt}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.04]"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-deep/80 via-brand-navy-deep/10 to-transparent opacity-90" />
          <div className="absolute inset-x-0 bottom-0 p-5 text-white">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap gap-1.5">
                  <Badge className="rounded-full bg-white/10 text-white ring-1 ring-white/15">{project.category}</Badge>
                  {project.featured ? (
                    <Badge className="rounded-full bg-amber-500/20 text-amber-100 ring-1 ring-amber-400/30">Featured</Badge>
                  ) : null}
                </div>
                <p className="mt-3 font-display text-lg font-semibold leading-snug">{project.title}</p>
                <div className="mt-2 flex items-center gap-2 text-xs text-white/80">
                  <MapPin className="h-4 w-4 text-sky-300" />
                  {project.location} · {project.year}
                </div>
              </div>
              <span className="rounded-2xl border border-white/15 bg-white/10 p-2 backdrop-blur transition group-hover:bg-white/15">
                <ArrowUpRight className="h-5 w-5" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function ProjectsSection({
  projects,
  intro = true,
  shellCopy,
}: {
  projects: Project[];
  intro?: boolean;
  shellCopy?: Partial<SectionShellCms>;
}) {
  const reduce = useReducedMotion();
  const [filter, setFilter] = React.useState<(typeof filters)[number]>("All");
  const [search, setSearch] = React.useState("");

  const shell = {
    eyebrow: shellCopy?.eyebrow ?? DEFAULT_PROJECTS_SHELL.eyebrow,
    title: shellCopy?.title ?? DEFAULT_PROJECTS_SHELL.title,
    description: shellCopy?.description ?? DEFAULT_PROJECTS_SHELL.description,
  };

  const filtered = React.useMemo(() => {
    const needle = search.trim().toLowerCase();
    return projects.filter((p) => {
      if (filter !== "All" && p.category !== filter) return false;
      if (!needle) return true;
      const hay = `${p.title} ${p.location} ${p.category} ${p.summary} ${(p.equipmentUsed ?? []).join(" ")}`.toLowerCase();
      return hay.includes(needle);
    });
  }, [projects, filter, search]);

  const featuredSlug = projects.find((p) => p.featured)?.slug ?? projects[0]?.slug;

  return (
    <SectionShell intro={intro} eyebrow={shell.eyebrow} title={shell.title} description={shell.description}>
      <FeaturedProjectsStrip projects={projects} />

      <ScrollReveal>
        <div className="mb-4 relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects, locations, equipment…"
            className="h-11 rounded-2xl border-border/80 bg-card pl-9"
            aria-label="Search projects"
          />
        </div>

        <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
          <TabsList className="flex w-full flex-wrap justify-start gap-2 rounded-2xl p-2">
            {filters.map((f) => (
              <TabsTrigger key={f} value={f} className="rounded-xl px-3 text-xs sm:px-4 sm:text-sm data-[state=active]:shadow-sm">
                {f}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={filter} className="mt-6">
            {filtered.length === 0 ? (
              <p className="rounded-2xl border border-border bg-muted/40 px-4 py-8 text-center text-sm text-muted-foreground">
                No projects match your search. Try another category or clear the search field.
              </p>
            ) : (
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={`${filter}-${search}`}
                  {...fadeSlideMotion(reduce, "y")}
                  transition={defaultTransition}
                  className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {filtered.map((p) => (
                    <ProjectCard key={p.slug} project={p} reduce={!!reduce} />
                  ))}
                </motion.div>
              </AnimatePresence>
            )}
          </TabsContent>
        </Tabs>
      </ScrollReveal>

      {featuredSlug ? (
        <ScrollReveal delay={0.05} className="mt-8 flex justify-center">
          <Link
            href={`/projects/${featuredSlug}`}
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-border bg-card px-6 text-sm font-semibold text-foreground shadow-sm transition hover:bg-muted/50"
          >
            View a featured case study
          </Link>
        </ScrollReveal>
      ) : null}
    </SectionShell>
  );
}
