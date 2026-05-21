"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Eye, EyeOff } from "lucide-react";
import {
  DEFAULT_MOBILE_STICKY_CTA,
  DEFAULT_SECTION_VISIBILITY,
  type FloatingActionsCms,
  type HomeSectionVisibility,
} from "@/lib/cms/marketing-cms-defaults";
import {
  HOME_LEGACY_SECTION_IDS,
  HOME_SECTION_LABELS,
  type HomeLegacySectionId,
  normalizeHomeSectionOrder,
  serializeSiteLayoutPayload,
} from "@/lib/cms/homepage-sections";
import { upsertSiteSettingsCmsAction } from "@/lib/actions/cms-site";
import { AdminCard } from "@/components/admin/ui/admin-card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const VISIBILITY_KEYS = Object.keys(DEFAULT_SECTION_VISIBILITY) as (keyof HomeSectionVisibility)[];

const VISIBILITY_LABELS: Record<keyof HomeSectionVisibility, string> = {
  customerPlatformStrip: "Quick links strip",
  heroServicesStrip: "Hero service cards",
  aboutPreview: "About preview",
  servicesPreview: "Services preview",
  businessTrust: "Business trust",
  beforeAfter: "Before & after",
  coverageMap: "Coverage map",
  projectsPreview: "Projects preview",
  testimonials: "Testimonials",
  lifecycleSubscriptions: "Maintenance subscriptions",
  technicianShowcase: "Technician showcase",
  brands: "Partner brands",
  instantEstimateBanner: "Instant estimate banner",
  contactCta: "Contact CTA",
  mobileStickyCta: "Mobile sticky bar",
};

type Props = {
  initialVisibility: HomeSectionVisibility;
  initialOrder: HomeLegacySectionId[];
  initialFloating: FloatingActionsCms;
  canEdit: boolean;
};

export function HomepageLayoutForm({ initialVisibility, initialOrder, initialFloating, canEdit }: Props) {
  const router = useRouter();
  const [visibility, setVisibility] = React.useState(initialVisibility);
  const [order, setOrder] = React.useState(() => normalizeHomeSectionOrder(initialOrder));
  const [floating, setFloating] = React.useState(initialFloating);
  const [pending, setPending] = React.useState(false);
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const sticky = floating.mobileSticky ?? DEFAULT_MOBILE_STICKY_CTA;

  function moveSection(id: HomeLegacySectionId, dir: -1 | 1) {
    setOrder((prev) => {
      const i = prev.indexOf(id);
      if (i < 0) return prev;
      const j = i + dir;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j]!, next[i]!];
      return next;
    });
  }

  function toggleVisibility(key: keyof HomeSectionVisibility) {
    setVisibility((v) => ({ ...v, [key]: !v[key] }));
  }

  async function save() {
    if (!canEdit) return;
    setPending(true);
    const sectionVisibilityJson = serializeSiteLayoutPayload(visibility, order);
    const floatingActionsJson = JSON.stringify(floating, null, 2);
    const res = await upsertSiteSettingsCmsAction({ sectionVisibilityJson, floatingActionsJson });
    setPending(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success(res.message ?? "Homepage layout saved");
    router.refresh();
  }

  function resetOrder() {
    setOrder([...HOME_LEGACY_SECTION_IDS]);
    toast.message("Section order reset — click Save to apply");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">Homepage layout</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Reorder sections, show or hide blocks, and configure the mobile sticky bar. Hero copy and background are in{" "}
            <Link href="/admin/content/homepage/hero" className="font-medium text-accent hover:underline">
              Hero settings
            </Link>
            ; extra blocks use the{" "}
            <Link href="/admin/content/builder/homepage" className="font-medium text-accent hover:underline">
              page builder
            </Link>
            .
          </p>
        </div>
        <Button type="button" disabled={!canEdit || pending} onClick={() => void save()}>
          Save & publish layout
        </Button>
      </div>

      {!canEdit ? (
        <p className="text-sm text-amber-700 dark:text-amber-400">View-only — layout changes are disabled for your role.</p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <AdminCard className="space-y-4 p-5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display text-base font-semibold text-foreground">Section order</h2>
            <Button type="button" variant="outline" size="sm" className="rounded-lg" disabled={!canEdit} onClick={resetOrder}>
              Reset order
            </Button>
          </div>
          <ul className="space-y-2">
            {order.map((id, index) => (
              <li
                key={id}
                className="flex items-center justify-between gap-2 rounded-xl border border-border/60 bg-muted/20 px-3 py-2.5"
              >
                <span className="text-sm font-medium text-foreground">
                  <span className="mr-2 text-xs text-muted-foreground">{index + 1}.</span>
                  {HOME_SECTION_LABELS[id]}
                </span>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    disabled={!canEdit || index === 0}
                    onClick={() => moveSection(id, -1)}
                    aria-label={`Move ${HOME_SECTION_LABELS[id]} up`}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    disabled={!canEdit || index === order.length - 1}
                    onClick={() => moveSection(id, 1)}
                    aria-label={`Move ${HOME_SECTION_LABELS[id]} down`}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted-foreground">Hero and builder blocks are fixed above and below this list on the live site.</p>
        </AdminCard>

        <AdminCard className="space-y-4 p-5">
          <h2 className="font-display text-base font-semibold text-foreground">Section visibility</h2>
          <ul className="space-y-2">
            {VISIBILITY_KEYS.map((key) => (
              <li key={key}>
                <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-border/50 px-3 py-2.5 text-sm transition hover:bg-muted/30">
                  <span className="font-medium text-foreground">{VISIBILITY_LABELS[key]}</span>
                  <span className="flex items-center gap-2">
                    {visibility[key] ? (
                      <Eye className="h-4 w-4 text-emerald-600" aria-hidden />
                    ) : (
                      <EyeOff className="h-4 w-4 text-muted-foreground" aria-hidden />
                    )}
                    <Checkbox
                      checked={visibility[key]}
                      disabled={!canEdit}
                      onCheckedChange={() => toggleVisibility(key)}
                    />
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </AdminCard>
      </div>

      <AdminCard className="space-y-4 p-5">
        <h2 className="font-display text-base font-semibold text-foreground">Mobile sticky bar</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="sticky-call">Call label</Label>
            <Input
              id="sticky-call"
              value={sticky.callLabel}
              disabled={!canEdit}
              onChange={(e) =>
                setFloating((f) => ({
                  ...f,
                  mobileSticky: { ...sticky, callLabel: e.target.value },
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sticky-msg">Messenger label</Label>
            <Input
              id="sticky-msg"
              value={sticky.messengerLabel}
              disabled={!canEdit}
              onChange={(e) =>
                setFloating((f) => ({
                  ...f,
                  mobileSticky: { ...sticky, messengerLabel: e.target.value },
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sticky-quote-l">Quote label</Label>
            <Input
              id="sticky-quote-l"
              value={sticky.quoteLabel}
              disabled={!canEdit}
              onChange={(e) =>
                setFloating((f) => ({
                  ...f,
                  mobileSticky: { ...sticky, quoteLabel: e.target.value },
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sticky-quote-h">Quote link</Label>
            <Input
              id="sticky-quote-h"
              value={sticky.quoteHref}
              disabled={!canEdit}
              onChange={(e) =>
                setFloating((f) => ({
                  ...f,
                  mobileSticky: { ...sticky, quoteHref: e.target.value },
                }))
              }
            />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox
            checked={visibility.mobileStickyCta}
            disabled={!canEdit}
            onCheckedChange={() => toggleVisibility("mobileStickyCta")}
          />
          Show sticky bar on mobile
        </label>
      </AdminCard>

      <AdminCard className="space-y-3 p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-semibold text-foreground">Floating actions (desktop)</h2>
          <Button type="button" variant="ghost" size="sm" onClick={() => setShowAdvanced((v) => !v)}>
            {showAdvanced ? "Hide" : "Show"} toggles
          </Button>
        </div>
        {showAdvanced ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {(["showMessenger", "showWhatsapp", "showCall", "showQuote", "showScrollTop"] as const).map((key) => (
              <label key={key} className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={floating[key]}
                  disabled={!canEdit}
                  onCheckedChange={(v) => setFloating((f) => ({ ...f, [key]: v === true }))}
                />
                {key}
              </label>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">Messenger, WhatsApp, call, and scroll-to-top FABs on larger screens.</p>
        )}
      </AdminCard>
    </div>
  );
}
