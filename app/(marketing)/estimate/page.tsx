import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/page-hero";
import { PageCta } from "@/components/layout/page-cta";
import { HvacEstimator } from "@/components/platform/hvac-estimator";
import { pageMeta } from "@/lib/page-meta";
import { SITE } from "@/constants/site";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = pageMeta({
  title: "Instant HVAC Estimate",
  description: `Premium multi-step HVAC sizing and budget planner from ${SITE.name} — indicative pricing until formal site survey.`,
  path: "/estimate",
});

export default function EstimatePage() {
  return (
    <>
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Instant estimate" },
        ]}
        eyebrow="Estimate & inquiry"
        title="Get instant estimate"
        description="Property-aware ballparks for HP class, install bands, annual PMS budgets, and indicative kWh — non-binding until a licensed site survey."
      />
      <section className="border-b border-border/60 bg-gradient-to-b from-muted/15 to-background py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              Prefer a human review? Contact us for a site survey after you run the numbers.
            </p>
            <Button asChild variant="outline" className="rounded-2xl">
              <Link href="/contact">Contact for survey</Link>
            </Button>
          </div>
          <div className="mt-8">
            <HvacEstimator />
          </div>
        </div>
      </section>
      <PageCta />
    </>
  );
}
