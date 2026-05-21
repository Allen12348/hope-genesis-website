"use client";

import Link from "next/link";
import { ArrowRight, PhoneCall } from "lucide-react";
import { useMarketingSite } from "@/components/providers/marketing-site-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  title?: string;
  description?: string;
  className?: string;
};

export function PageCta({
  title = "Ready to scope your next HVAC or refrigeration project?",
  description = "Tell us your facility type, operating hours, and constraints — we’ll respond with a clear plan and timeline.",
  className,
}: Props) {
  const { site } = useMarketingSite();
  return (
    <section
      className={cn(
        "border-t border-border/70 bg-gradient-to-b from-muted/25 via-background to-muted/15 py-16 sm:py-20",
        className,
      )}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="glass-panel flex flex-col items-start justify-between gap-8 rounded-3xl border-primary/10 p-6 sm:flex-row sm:items-center sm:p-8 lg:p-10">
          <div className="max-w-2xl">
            <h2 className="font-display text-2xl font-bold tracking-display text-foreground sm:text-3xl">
              {title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {description}
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:shrink-0">
            <Button asChild variant="default" className="rounded-2xl sm:min-w-[180px]">
              <Link href="/contact">
                Contact us
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-2xl sm:min-w-[180px]">
              <a href={site.phoneTel}>
                <PhoneCall className="h-4 w-4" />
                Call {site.phoneDisplay}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
