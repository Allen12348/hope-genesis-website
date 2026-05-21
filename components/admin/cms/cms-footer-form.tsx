"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { upsertFooterCmsAction } from "@/lib/actions/cms-site";
import { AdminCard } from "@/components/admin/ui/admin-card";

export function CmsFooterForm({ initialPayload }: { initialPayload: string }) {
  const router = useRouter();
  const [payloadJson, setPayloadJson] = React.useState(initialPayload);
  const [pending, setPending] = React.useState(false);

  async function save() {
    setPending(true);
    const res = await upsertFooterCmsAction({ payloadJson });
    setPending(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success(res.message ?? "Saved");
    router.refresh();
  }

  return (
    <AdminCard className="space-y-3 p-4">
      <div>
        <h2 className="font-display text-lg font-semibold">Footer payload</h2>
        <p className="text-xs text-muted-foreground">JSON merged with defaults — branding, service links, platform links, copyright template.</p>
      </div>
      <Label>payloadJson</Label>
      <Textarea value={payloadJson} onChange={(e) => setPayloadJson(e.target.value)} spellCheck={false} className="min-h-[480px] font-mono text-xs" />
      <Button type="button" disabled={pending} onClick={() => void save()}>
        Save footer
      </Button>
    </AdminCard>
  );
}
