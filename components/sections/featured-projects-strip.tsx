"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin, Star } from "lucide-react";
import type { Project } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function FeaturedProjectsStrip({ projects, className }: { projects: Project[]; className?: string }) {
  const featured = projects.filter((p) => p.featured);
  if (!featured.length) return null;

  return (
    <section className={cn("mb-10", className)} aria-labelledby="featured-projects-heading">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
            <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
            Featured work
          </p>
          <h2 id="featured-projects-heading" className="mt-1 font-display text-xl font-semibold text-foreground sm:text-2xl">
            Signature HVAC case studies
          </h2>
        </div>
        <Link
          href={`/projects/${featured[0].slug}`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
        >
          View featured case study
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {featured.slice(0, 3).map((p) => (
          <Link
            key={p.slug}
            href={`/projects/${p.slug}`}
            className="group overflow-hidden rounded-3xl border border-border/70 bg-card shadow-sm transition hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md"
          >
            <div className="relative aspect-[16/10]">
              <Image
                src={p.image}
                alt={p.imageAlt}
                fill
                className="object-cover transition duration-500 group-hover:scale-[1.03]"
                sizes="(min-width: 1024px) 33vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-deep/85 via-brand-navy-deep/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <Badge className="rounded-full bg-white/12 text-white ring-1 ring-white/20">{p.category}</Badge>
                <p className="mt-2 font-display text-base font-semibold leading-snug">{p.title}</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-white/80">
                  <MapPin className="h-3.5 w-3.5 text-sky-300" />
                  {p.location}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
