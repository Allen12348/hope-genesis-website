"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { SectionShellCms } from "@/lib/cms/marketing-cms-defaults";
import { DEFAULT_HOME_PAGE_PUBLISHED } from "@/lib/cms/marketing-cms-defaults";
import type { Brand } from "@/types";
import { BrandMarquee } from "@/components/sections/brands-section";
import { Button } from "@/components/ui/button";
import { SectionShell } from "@/components/sections/section-shell";

const defaultShell = DEFAULT_HOME_PAGE_PUBLISHED.homeSectionShells.brandsPreview;

export function BrandsPreviewSection({
  brands,
  shell = defaultShell,
}: {
  brands: Brand[];
  shell?: SectionShellCms;
}) {
  return (
    <SectionShell eyebrow={shell.eyebrow} title={shell.title} description={shell.description}>
      <div className="w-full space-y-3">
        <BrandMarquee brands={brands} />
      </div>
      <div className="mt-8">
        <Button asChild size="lg" variant="secondary" className="rounded-2xl">
          <Link href="/brands">
            View Brands
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </SectionShell>
  );
}
