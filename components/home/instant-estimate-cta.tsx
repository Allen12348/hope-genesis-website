"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useMarketingSite } from "@/components/providers/marketing-site-provider";
import { Button } from "@/components/ui/button";
import { SectionShell } from "@/components/sections/section-shell";
import { cn } from "@/lib/utils";

export function InstantEstimateCtaSection({ className }: { className?: string }) {
  const { cms } = useMarketingSite();
  const shell = cms.home.homeSectionShells.instantEstimate;

  return (
    <SectionShell
      eyebrow={shell.eyebrow}
      title={shell.title}
      description={shell.description}
      className={cn("bg-gradient-to-b from-muted/25 via-background to-background", className)}
    >
      <div className="flex justify-center pt-2">
        <Button asChild size="lg" variant="accent" className="rounded-2xl px-8">
          <Link href="/estimate">
            Get instant estimate
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </Button>
      </div>
    </SectionShell>
  );
}
