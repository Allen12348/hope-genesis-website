"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { upsertSiteSettingsCmsAction } from "@/lib/actions/cms-site";
import { AdminCard } from "@/components/admin/ui/admin-card";

export function CmsSiteSettingsForm({
  initialSectionVisibility,
  initialFloating,
}: {
  initialSectionVisibility: string;
  initialFloating: string;
}) {
  const router = useRouter();
  const [sectionVisibilityJson, setSectionVisibilityJson] = React.useState(initialSectionVisibility);
  const [floatingActionsJson, setFloatingActionsJson] = React.useState(initialFloating);
  const [pending, setPending] = React.useState(false);

  async function save() {
    setPending(true);
    const res = await upsertSiteSettingsCmsAction({ sectionVisibilityJson, floatingActionsJson });
    setPending(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success(res.message ?? "Saved");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <AdminCard className="space-y-3 p-4">
        <div>
          <h2 className="font-display text-lg font-semibold">Section visibility</h2>
          <p className="text-xs text-muted-foreground">JSON object merged with defaults — toggles homepage sections, testimonials, brands, map, CTAs.</p>
        </div>
        <Label>sectionVisibilityJson</Label>
        <Textarea
          value={sectionVisibilityJson}
          onChange={(e) => setSectionVisibilityJson(e.target.value)}
          spellCheck={false}
          className="min-h-[220px] font-mono text-xs"
        />
      </AdminCard>
      <AdminCard className="space-y-3 p-4">
        <div>
          <h2 className="font-display text-lg font-semibold">Floating actions</h2>
          <p className="text-xs text-muted-foreground">Messenger, WhatsApp, call, scroll-top toggles.</p>
        </div>
        <Label>floatingActionsJson</Label>
        <Textarea
          value={floatingActionsJson}
          onChange={(e) => setFloatingActionsJson(e.target.value)}
          spellCheck={false}
          className="min-h-[160px] font-mono text-xs"
        />
      </AdminCard>
      <Button type="button" disabled={pending} onClick={() => void save()}>
        Save site settings
      </Button>
    </div>
  );
}
