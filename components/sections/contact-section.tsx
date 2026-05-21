"use client";

import { Camera, Link2, MapPin, Phone, Share2 } from "lucide-react";
import type { ResolvedSite } from "@/lib/cms/resolved-site";
import type { SectionShellCms } from "@/lib/cms/marketing-cms-defaults";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { SectionShell } from "@/components/sections/section-shell";
import { ContactForm } from "@/components/sections/contact-form";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const DEFAULT_CONTACT_SHELL: SectionShellCms = {
  eyebrow: "Contact",
  title: "Request a survey — we respond fast",
  description:
    "Share your requirements and site context. Our team will route you to the right engineer and propose a clear scope, timeline, and investment range.",
};

export function ContactSection({
  intro = true,
  site,
  shellCopy,
}: {
  intro?: boolean;
  site: ResolvedSite;
  shellCopy?: Partial<SectionShellCms>;
}) {
  const shell = {
    eyebrow: shellCopy?.eyebrow ?? DEFAULT_CONTACT_SHELL.eyebrow,
    title: shellCopy?.title ?? DEFAULT_CONTACT_SHELL.title,
    description: shellCopy?.description ?? DEFAULT_CONTACT_SHELL.description,
  };

  return (
    <SectionShell intro={intro} eyebrow={shell.eyebrow} title={shell.title} description={shell.description}>
      <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-12">
        <ScrollReveal className="lg:col-span-5">
          <Card className="rounded-3xl border-border/70 p-6 shadow-glass">
            <div className="font-display text-lg font-semibold">Company information</div>
            <Separator className="my-4" />
            <div className="space-y-4 text-sm text-muted-foreground">
              <div className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <div>
                  <div className="font-semibold text-foreground">Service area</div>
                  <div>{site.fullAddress}</div>
                </div>
              </div>
              <div className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <div>
                  <div className="font-semibold text-foreground">Phone</div>
                  <a className="hover:text-foreground" href={site.phoneTel}>
                    {site.phoneDisplay}
                  </a>
                </div>
              </div>
              <div>
                <div className="font-semibold text-foreground">Email</div>
                <a className="hover:text-foreground" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
              </div>
              <div>
                <div className="font-semibold text-foreground">Business hours</div>
                <div>{site.hours}</div>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="font-display text-sm font-semibold">Social</div>
            <div className="mt-3 flex flex-wrap gap-2">
              <a
                className="inline-flex items-center gap-2 rounded-2xl border border-border/70 bg-background/60 px-4 py-2 text-sm font-semibold hover:bg-muted/70"
                href={site.social.facebook}
                target="_blank"
                rel="noreferrer"
              >
                <Share2 className="h-4 w-4" />
                Facebook
              </a>
              <a
                className="inline-flex items-center gap-2 rounded-2xl border border-border/70 bg-background/60 px-4 py-2 text-sm font-semibold hover:bg-muted/70"
                href={site.social.instagram}
                target="_blank"
                rel="noreferrer"
              >
                <Camera className="h-4 w-4" />
                Instagram
              </a>
              <a
                className="inline-flex items-center gap-2 rounded-2xl border border-border/70 bg-background/60 px-4 py-2 text-sm font-semibold hover:bg-muted/70"
                href={site.social.linkedin}
                target="_blank"
                rel="noreferrer"
              >
                <Link2 className="h-4 w-4" />
                LinkedIn
              </a>
            </div>
          </Card>
        </ScrollReveal>

        <ScrollReveal delay={0.05} className="lg:col-span-7">
          <Card className="rounded-3xl border-border/70 p-6 shadow-sm">
            <div className="font-display text-lg font-semibold">Send a message</div>
            <p className="mt-2 text-sm text-muted-foreground">
              Typical response time: same business day for urgent service calls.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </Card>

          <div className="mt-6 overflow-hidden rounded-3xl border border-border/70 shadow-sm">
            <iframe
              title="Hope Genesis Enterprises service area map"
              src={site.mapEmbedUrl}
              className="h-[320px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </ScrollReveal>
      </div>
    </SectionShell>
  );
}
