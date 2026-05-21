import Link from "next/link";
import { ArrowLeft, ArrowUpRight, MapPin } from "lucide-react";
import type { Project } from "@/types";
import type { BreadcrumbItem } from "@/components/layout/breadcrumbs";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { getResolvedSite } from "@/lib/services/marketing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BeforeAfterSlider } from "@/components/media/before-after-slider";
import { CmsImage } from "@/components/media/cms-image";
import { ProjectGalleryGrid } from "@/components/projects/project-gallery-grid";
import { ProjectStatsRow } from "@/components/projects/project-stats-row";
import { ProjectTestimonialCard } from "@/components/projects/project-testimonial-card";
import { PROJECT_STATUS_LABELS } from "@/lib/cms/project-status";

type Props = {
  project: Project;
  breadcrumbs: BreadcrumbItem[];
};

export async function ProjectDetailView({ project, breadcrumbs }: Props) {
  const site = await getResolvedSite();
  return (
    <div>
      <div className="relative h-[46vh] min-h-[320px]">
        <CmsImage
          src={project.image}
          alt={project.imageAlt}
          fill
          priority
          fetchPriority="high"
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/65 to-brand-navy-deep/35" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-4 pb-10 sm:px-6 lg:px-8">
          <Button asChild variant="secondary" className="rounded-2xl">
            <Link href="/projects">
              <ArrowLeft className="h-4 w-4" />
              Back to portfolio
            </Link>
          </Button>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Badge className="rounded-full bg-white/15 text-white ring-1 ring-white/20">{project.category}</Badge>
            {project.status ? (
              <Badge variant="secondary" className="rounded-full bg-black/30 text-white/95">
                {PROJECT_STATUS_LABELS[project.status]}
              </Badge>
            ) : null}
            {project.clientLabel ? (
              <Badge variant="outline" className="rounded-full border-white/30 text-white/90">
                {project.clientLabel}
              </Badge>
            ) : null}
            <div className="flex items-center gap-2 text-sm text-white/85">
              <MapPin className="h-4 w-4 text-sky-300" />
              {project.location} · {project.year}
            </div>
          </div>
          <h1 className="mt-4 max-w-3xl font-display text-3xl font-semibold tracking-tight text-balance text-white sm:text-4xl">
            {project.title}
          </h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-white/80">
            {project.summary}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Button asChild variant="default" className="rounded-2xl shadow-lg">
              <Link href="/contact">
                Discuss a similar scope
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-2xl border-2 border-white/35 bg-white/8 text-white backdrop-blur hover:bg-white/15">
              <a href={site.phoneTel}>Call {site.phoneDisplay}</a>
            </Button>
          </div>
        </div>
      </div>

      <div className="border-b border-border/70 bg-background px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-12 lg:px-8">
        {project.stats?.length ? (
          <div className="lg:col-span-12">
            <ProjectStatsRow stats={project.stats} />
          </div>
        ) : null}

        <Card className="rounded-3xl border-border/70 p-6 sm:p-8 lg:col-span-7">
          <h2 className="font-display text-xl font-semibold">Delivery scope</h2>
          <Separator className="my-4" />
          <ul className="space-y-3 text-muted-foreground leading-relaxed">
            {project.scope.map((s) => (
              <li key={s}>— {s}</li>
            ))}
          </ul>
        </Card>

        <Card className="rounded-3xl border-border/70 p-6 lg:col-span-5">
          <h2 className="font-display text-xl font-semibold">Outcome focus</h2>
          <Separator className="my-4" />
          <p className="text-sm leading-relaxed text-muted-foreground">
            Every portfolio engagement includes documented QA checkpoints, commissioning evidence, and client training — so your team can operate confidently after turnover.
          </p>
        </Card>

        {project.equipmentUsed?.length ? (
          <Card className="rounded-3xl border-border/70 p-6 sm:p-8 lg:col-span-12">
            <h2 className="font-display text-xl font-semibold">Equipment used</h2>
            <Separator className="my-4" />
            <ul className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
              {project.equipmentUsed.map((e) => (
                <li key={e}>— {e}</li>
              ))}
            </ul>
            {project.installationDuration ? (
              <p className="mt-4 text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Installation duration:</span>{" "}
                {project.installationDuration}
              </p>
            ) : null}
          </Card>
        ) : null}

        {project.challenge || project.solution ? (
          <div className="grid gap-6 lg:col-span-12 lg:grid-cols-2">
            {project.challenge ? (
              <Card className="rounded-3xl border-border/70 p-6 sm:p-8">
                <h2 className="font-display text-xl font-semibold">Challenge</h2>
                <Separator className="my-4" />
                <p className="text-sm leading-relaxed text-muted-foreground">{project.challenge}</p>
              </Card>
            ) : null}
            {project.solution ? (
              <Card className="rounded-3xl border-border/70 p-6 sm:p-8">
                <h2 className="font-display text-xl font-semibold">Solution</h2>
                <Separator className="my-4" />
                <p className="text-sm leading-relaxed text-muted-foreground">{project.solution}</p>
              </Card>
            ) : null}
          </div>
        ) : null}

        {project.results?.length ? (
          <Card className="rounded-3xl border-border/70 p-6 sm:p-8 lg:col-span-12">
            <h2 className="font-display text-xl font-semibold">Results</h2>
            <Separator className="my-4" />
            <ul className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2 lg:grid-cols-3">
              {project.results.map((r) => (
                <li key={r}>— {r}</li>
              ))}
            </ul>
          </Card>
        ) : null}

        {project.beforeImage && project.afterImage ? (
          <div className="lg:col-span-12">
            <h2 className="font-display text-xl font-semibold text-foreground">Before / after</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Interactive comparison with drag reveal — representative site documentation; actual deliverables vary by contract.
            </p>
            <div className="mt-6">
              <BeforeAfterSlider
                beforeSrc={project.beforeImage}
                afterSrc={project.afterImage}
                alt={project.title}
              />
            </div>
          </div>
        ) : null}

        {project.galleryImages?.length ? (
          <div className="lg:col-span-12">
            <h2 className="font-display text-xl font-semibold text-foreground">Project gallery</h2>
            <p className="mt-2 text-sm text-muted-foreground">On-site documentation from commissioning and turnover.</p>
            <div className="mt-6">
              <ProjectGalleryGrid images={project.galleryImages} title={project.title} />
            </div>
          </div>
        ) : null}

        {project.testimonial ? (
          <div className="lg:col-span-12">
            <h2 className="mb-4 font-display text-xl font-semibold text-foreground">Client feedback</h2>
            <ProjectTestimonialCard testimonial={project.testimonial} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
