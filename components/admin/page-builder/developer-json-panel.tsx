"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { safeJsonParse } from "@/lib/utils/safe-json-parse";

type Props = {
  json: string;
  onApply: (json: string) => void;
  defaultOpen?: boolean;
};

/** Advanced developer mode — raw JSON editing hidden from normal admin flow. */
export function DeveloperJsonPanel({ json, onApply, defaultOpen = false }: Props) {
  const [open, setOpen] = React.useState(defaultOpen);
  const [draft, setDraft] = React.useState(json);

  React.useEffect(() => {
    setDraft(json);
  }, [json]);

  return (
    <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="text-xs font-bold uppercase tracking-wide text-amber-800 dark:text-amber-200">
          Advanced developer mode
        </span>
        <ChevronDown className={cn("h-4 w-4 transition", open && "rotate-180")} />
      </button>
      {open ? (
        <div className="space-y-3 border-t border-amber-500/20 px-4 pb-4">
          <p className="text-xs text-muted-foreground">
            Edit the full page JSON. Normal admins should use drag-and-drop blocks above. Invalid JSON will be rejected on apply.
          </p>
          <Label className="sr-only">Page JSON</Label>
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            spellCheck={false}
            className="min-h-[240px] font-mono text-xs"
          />
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => {
              const parsed = safeJsonParse<unknown>(draft, null);
              if (parsed === null && draft.trim()) {
                window.alert("Invalid JSON — fix syntax before applying.");
                return;
              }
              onApply(draft);
            }}
          >
            Apply JSON to canvas
          </Button>
        </div>
      ) : null}
    </div>
  );
}

