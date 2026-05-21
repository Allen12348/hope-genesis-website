import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import type { AboutPreviewCms } from "@/lib/cms/marketing-cms-defaults";
import { DEFAULT_HOME_PAGE_PUBLISHED } from "@/lib/cms/marketing-cms-defaults";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionShell } from "@/components/sections/section-shell";

const defaultCopy = DEFAULT_HOME_PAGE_PUBLISHED.aboutPreview;

export function AboutPreviewSection({ copy = defaultCopy }: { copy?: AboutPreviewCms }) {
  return (
    <SectionShell eyebrow={copy.eyebrow} title={copy.title} description={copy.description}>
      <div className="grid items-start gap-8 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <div className="relative overflow-hidden rounded-2xl border border-border/55 shadow-sm">
            <div className="relative aspect-[4/3]">
              <Image
                src={copy.imageUrl}
                alt={copy.imageAlt}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
                loading="lazy"
              />
            </div>
          </div>
        </div>
        <div className="space-y-4 lg:col-span-6">
          <Card className="rounded-2xl border-border/55 p-6 shadow-sm">
            <ul className="space-y-3 text-sm text-muted-foreground">
              {copy.pillars.map((p) => (
                <li key={p} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <span className="leading-relaxed">{p}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Button asChild size="lg" className="rounded-2xl">
            <Link href={copy.ctaHref}>
              {copy.ctaLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </SectionShell>
  );
}
