"use client";

import Link from "next/link";
import { FileText, MessageSquare, PhoneCall } from "lucide-react";
import { useMarketingSite } from "@/components/providers/marketing-site-provider";
import { DEFAULT_MOBILE_STICKY_CTA } from "@/lib/cms/marketing-cms-defaults";
import { cn } from "@/lib/utils";

export function MobileStickyCta() {
  const { site, cms } = useMarketingSite();
  const labels = cms.floating.mobileSticky ?? DEFAULT_MOBILE_STICKY_CTA;
  const quoteHref = labels.quoteHref;

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-[44] border-t border-border/60 bg-background/88 p-3 shadow-[0_-12px_40px_-12px_rgba(15,23,42,0.14)] backdrop-blur-2xl",
        "pb-[max(0.75rem,env(safe-area-inset-bottom))]",
        "md:hidden",
      )}
      role="region"
      aria-label="Quick contact actions"
    >
      <div className="mx-auto flex max-w-lg gap-2">
        <a
          href={site.phoneTel}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/92"
        >
          <PhoneCall className="h-4 w-4 shrink-0" aria-hidden />
          {labels.callLabel}
        </a>
        <a
          href={site.messenger}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card/90 px-3 py-2.5 text-sm font-semibold text-foreground shadow-sm transition hover:border-primary/35"
        >
          <MessageSquare className="h-4 w-4 shrink-0 text-primary" aria-hidden />
          {labels.messengerLabel}
        </a>
        {quoteHref.startsWith("http") ? (
          <a
            href={quoteHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card/90 px-3 py-2.5 text-sm font-semibold text-foreground shadow-sm transition hover:border-primary/35"
          >
            <FileText className="h-4 w-4 shrink-0 text-primary" aria-hidden />
            {labels.quoteLabel}
          </a>
        ) : (
          <Link
            href={quoteHref}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card/90 px-3 py-2.5 text-sm font-semibold text-foreground shadow-sm transition hover:border-primary/35"
          >
            <FileText className="h-4 w-4 shrink-0 text-primary" aria-hidden />
            {labels.quoteLabel}
          </Link>
        )}
      </div>
    </div>
  );
}
