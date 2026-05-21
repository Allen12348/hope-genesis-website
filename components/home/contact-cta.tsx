"use client";

import Link from "next/link";
import { ArrowRight, Clock, MapPin, MessageCircle, PhoneCall } from "lucide-react";
import { useMarketingSite } from "@/components/providers/marketing-site-provider";
import { Button } from "@/components/ui/button";
import { SectionShell } from "@/components/sections/section-shell";

export function ContactCtaSection() {
  const { site, cms } = useMarketingSite();
  const copy = cms.home.contactCta;

  return (
    <SectionShell eyebrow={copy.eyebrow} title={copy.title} description={copy.description}>
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <ul className="space-y-4 text-sm text-muted-foreground">
          <li className="flex gap-3">
            <PhoneCall className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
            <div>
              <div className="font-semibold text-foreground">Phone</div>
              <a className="mt-0.5 inline-block font-medium text-foreground hover:text-primary" href={site.phoneTel}>
                {site.phoneDisplay}
              </a>
            </div>
          </li>
          <li className="flex gap-3">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
            <div>
              <div className="font-semibold text-foreground">Service area</div>
              <p className="mt-0.5 leading-relaxed">{site.fullAddress}</p>
            </div>
          </li>
          <li className="flex gap-3">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
            <div>
              <div className="font-semibold text-foreground">Business hours</div>
              <p className="mt-0.5">{site.hours}</p>
            </div>
          </li>
        </ul>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:flex-col xl:flex-row">
          <Button asChild size="lg" variant="default" className="rounded-2xl">
            <a href={site.phoneTel}>
              <PhoneCall className="h-4 w-4" aria-hidden />
              Call now
            </a>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-2xl border-primary/25 bg-background/80">
            <Link href="/contact">
              Contact us
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary" className="rounded-2xl">
            <a href={site.whatsapp} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4" aria-hidden />
              Message on WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </SectionShell>
  );
}
