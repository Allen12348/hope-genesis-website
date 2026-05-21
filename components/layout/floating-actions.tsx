"use client";

import { ArrowUp, FileText, MessageCircle, MessageSquare, PhoneCall } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { useMarketingSite } from "@/components/providers/marketing-site-provider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type FabButtonProps = {
  href: string;
  label: string;
  children: React.ReactNode;
  className?: string;
};

function FabLink({ href, label, children, className }: FabButtonProps) {
  return (
    <Button
      asChild
      size="icon"
      className={cn(
        "h-12 w-12 rounded-2xl shadow-card-hge ring-1 ring-primary/10",
        className,
      )}
    >
      <a href={href} target="_blank" rel="noreferrer" aria-label={label}>
        {children}
      </a>
    </Button>
  );
}

export function FloatingActions() {
  const { site, cms } = useMarketingSite();
  const f = cms.floating;
  const stickyOn = cms.sectionVisibility.mobileStickyCta !== false;
  const [showScroll, setShowScroll] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setShowScroll(window.scrollY > 520);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const quoteHref = f.mobileSticky?.quoteHref ?? "/estimate";

  return (
    <div
      className={cn(
        "fixed right-4 z-[60] flex flex-col items-end gap-3 sm:right-6",
        stickyOn ? "bottom-[calc(5.25rem+env(safe-area-inset-bottom))] md:bottom-6" : "bottom-6",
      )}
    >
      {f.showScrollTop && showScroll ? (
        <Button
          type="button"
          size="icon"
          variant="secondary"
          className="h-11 w-11 rounded-2xl border border-slate-200 bg-white/85 text-slate-950 shadow-card-hge backdrop-blur dark:border-white/15 dark:bg-slate-950/70 dark:text-white"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      ) : null}

      <div className="flex flex-col gap-3">
        {f.showMessenger ? (
          <FabLink
            href={site.messenger}
            label="Open Facebook Messenger"
            className="bg-[#0866FF] text-white hover:bg-[#0866FF]/90"
          >
            <MessageSquare className="h-5 w-5" />
          </FabLink>
        ) : null}
        {f.showWhatsapp ? (
          <FabLink
            href={site.whatsapp}
            label="Open WhatsApp chat"
            className="bg-[#25D366] text-white hover:bg-[#25D366]/90"
          >
            <MessageCircle className="h-5 w-5" />
          </FabLink>
        ) : null}
        {f.showCall ? (
          <FabLink
            href={site.phoneTel}
            label="Call Hope Genesis Enterprises"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <PhoneCall className="h-5 w-5" />
          </FabLink>
        ) : null}
        {f.showQuote !== false ? (
          quoteHref.startsWith("http") ? (
            <FabLink
              href={quoteHref}
              label="Get a quote"
              className="bg-amber-500 text-white hover:bg-amber-500/90"
            >
              <FileText className="h-5 w-5" />
            </FabLink>
          ) : (
            <Button
              asChild
              size="icon"
              className="h-12 w-12 rounded-2xl bg-amber-500 text-white shadow-card-hge hover:bg-amber-500/90"
            >
              <Link href={quoteHref} aria-label="Get a quote">
                <FileText className="h-5 w-5" />
              </Link>
            </Button>
          )
        ) : null}
      </div>
    </div>
  );
}
