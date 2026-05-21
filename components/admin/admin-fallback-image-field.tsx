"use client";

import * as React from "react";
import { ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminFormField } from "@/components/admin/ui/admin-form-field";
import { cn } from "@/lib/utils";
import { isSafeImageSource } from "@/lib/validations/image-url";
import { ImageFallbackPlaceholder } from "@/components/media/image-fallback-placeholder";

type Props = {
  id: string;
  label: string;
  value: string;
  onChange: (next: string) => void;
  disabled?: boolean;
  error?: string | null;
};

export function AdminFallbackImageField({ id, label, value, onChange, disabled, error }: Props) {
  const [previewOk, setPreviewOk] = React.useState<boolean | null>(null);
  const [testing, setTesting] = React.useState(false);
  const [loadError, setLoadError] = React.useState<string | null>(null);

  const trimmed = value.trim();
  const formatInvalid = trimmed.length > 0 && !isSafeImageSource(trimmed);

  React.useEffect(() => {
    setPreviewOk(null);
    setLoadError(null);
    if (!trimmed || formatInvalid) return;
    const img = new window.Image();
    img.onload = () => setPreviewOk(true);
    img.onerror = () => {
      setPreviewOk(false);
      setLoadError("Image could not be loaded from this URL or path.");
    };
    img.src = trimmed;
  }, [trimmed, formatInvalid]);

  function runTest() {
    setLoadError(null);
    if (!trimmed) {
      setLoadError("Enter a URL or path first.");
      return;
    }
    if (formatInvalid) {
      setLoadError("Use a public https URL or a path starting with /.");
      return;
    }
    setTesting(true);
    const img = new window.Image();
    img.onload = () => {
      setPreviewOk(true);
      setTesting(false);
    };
    img.onerror = () => {
      setPreviewOk(false);
      setLoadError("Image could not be loaded from this URL or path.");
      setTesting(false);
    };
    img.src = trimmed;
  }

  return (
    <AdminFormField
      id={id}
      label={label}
      helper="Paste a public image URL or upload later. Used if the remote cover URL is empty or fails."
      error={error ?? (formatInvalid ? "Use a public https URL or a path starting with /." : loadError)}
    >
      <Input
        id={id}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://example.com/project-image.jpg"
        className={cn(
          "rounded-xl border-border/80 bg-white/80 font-mono text-xs backdrop-blur-sm transition focus-visible:ring-sky-500/30 sm:text-sm dark:bg-slate-900/50",
          (formatInvalid || loadError) && "border-destructive/60",
        )}
      />
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-xl border-sky-200/80 bg-white/70 hover:bg-sky-50 dark:border-sky-800 dark:bg-slate-900/60"
          disabled={disabled || testing}
          onClick={() => runTest()}
        >
          {testing ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
          Test image
        </Button>
      </div>
      <div className="relative mt-2 aspect-video w-full max-w-sm overflow-hidden rounded-xl border border-border/70 bg-muted/30">
        {trimmed && !formatInvalid && previewOk !== false ? (
          // eslint-disable-next-line @next/next/no-img-element -- admin preview
          <img src={trimmed} alt="" className="h-full w-full object-cover" />
        ) : (
          <ImageFallbackPlaceholder className="h-full min-h-[120px]" />
        )}
      </div>
    </AdminFormField>
  );
}
