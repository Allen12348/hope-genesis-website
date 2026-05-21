import Link from "next/link";
import { ArrowLeft, ArrowUpRight, CheckCircle2 } from "lucide-react";
import type { Service } from "@/types";
import type { BreadcrumbItem } from "@/components/layout/breadcrumbs";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { getResolvedSite } from "@/lib/services/marketing";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CmsImage } from "@/components/media/cms-image";

type Props = {
  service: Service;
  breadcrumbs: BreadcrumbItem[];
  backHref?: string;
  backLabel?: string;
};

export async function ServiceDetailView({
  service,
  breadcrumbs,
  backHref = "/services",
  backLabel = "Back to services",
}: Props) {
  const site = await getResolvedSite();
  const Icon = service.icon;

  return (
    <div>
      <div className="relative min-h-[42vh] overflow-hidden border-b border-border/70">
        <CmsImage
          src={service.heroImage}
          alt={service.heroImageAlt}
          fill
          priority
          fetchPriority="high"
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/75 to-brand-navy-deep/55" />
        <div className="absolute inset-x-0 bottom-0 top-0 mx-auto flex max-w-6xl flex-col justify-end px-4 pb-10 pt-24 sm:px-6 sm:pb-12 lg:px-8">
          <div className="mb-6">
            <Breadcrumbs items={breadcrumbs} variant="inverse" />
          </div>
          <Button asChild variant="secondary" className="w-fit rounded-2xl">
            <Link href={backHref}>
              <ArrowLeft className="h-4 w-4" />
              {backLabel}
            </Link>
          </Button>
          <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lift ring-1 ring-white/15">
                <Icon className="h-6 w-6" />
              </span>
              <div>
                <h1 className="font-display text-3xl font-semibold tracking-display text-balance text-white sm:text-4xl lg:text-5xl">
                  {service.title}
                </h1>
                <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
                  {service.shortDescription}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="default" className="rounded-2xl shadow-lg">
                <Link href="/contact">
                  Request a quote
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-2xl border-2 border-white/35 bg-white/8 text-white backdrop-blur hover:bg-white/15">
                <a href={site.phoneTel}>Call {site.phoneDisplay}</a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-7">
          <Card className="rounded-3xl border-border/70 p-6 sm:p-8">
            <h2 className="font-display text-xl font-semibold tracking-display">Overview</h2>
            <Separator className="my-4" />
            <p className="leading-relaxed text-muted-foreground">{service.description}</p>
          </Card>
        </div>
        <div className="space-y-6 lg:col-span-5">
          <Card className="rounded-3xl border-border/70 p-6">
            <h3 className="font-display text-lg font-semibold tracking-display">Highlights</h3>
            <Separator className="my-4" />
            <ul className="space-y-3 text-sm text-muted-foreground">
              {service.highlights.map((h) => (
                <li key={h} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <span className="leading-relaxed">{h}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card className="rounded-3xl border-border/70 p-6">
            <h3 className="font-display text-lg font-semibold tracking-display">Ideal for</h3>
            <Separator className="my-4" />
            <div className="flex flex-wrap gap-2">
              {service.idealFor.map((x) => (
                <span
                  key={x}
                  className="rounded-full border border-border/70 bg-muted/20 px-3 py-1 text-xs font-semibold text-foreground"
                >
                  {x}
                </span>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
