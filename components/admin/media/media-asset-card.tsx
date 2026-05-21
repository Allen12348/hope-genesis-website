"use client";

import * as React from "react";
import { Check, Copy, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { MediaAssetDto } from "@/lib/domain/media/types";
import { mediaFolderLabel } from "@/lib/domain/media/constants";
import { ImageFallbackPlaceholder } from "@/components/media/image-fallback-placeholder";

type Props = {
  asset: MediaAssetDto;
  selected?: boolean;
  selectable?: boolean;
  onSelect?: (asset: MediaAssetDto) => void;
  onDelete?: (id: string) => void;
  onAltChange?: (id: string, alt: string) => void;
  disabled?: boolean;
};

export function MediaAssetCard({
  asset,
  selected,
  selectable,
  onSelect,
  onDelete,
  onAltChange,
  disabled,
}: Props) {
  const [alt, setAlt] = React.useState(asset.alt ?? "");
  const thumb = asset.thumbnailUrl ?? asset.publicUrl;

  React.useEffect(() => {
    setAlt(asset.alt ?? "");
  }, [asset.alt, asset.id]);

  async function copyUrl() {
    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const full = asset.publicUrl.startsWith("http")
        ? asset.publicUrl
        : `${origin}${asset.publicUrl}`;
      await navigator.clipboard.writeText(full);
      toast.success("Image URL copied");
    } catch {
      toast.error("Could not copy URL");
    }
  }

  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow",
        selected ? "border-primary ring-2 ring-primary/30" : "border-border",
        selectable && !disabled && "cursor-pointer hover:border-primary/40",
      )}
      onClick={() => {
        if (selectable && onSelect && !disabled) onSelect(asset);
      }}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && selectable && onSelect) {
          e.preventDefault();
          onSelect(asset);
        }
      }}
      role={selectable ? "button" : undefined}
      tabIndex={selectable ? 0 : undefined}
    >
      <div className="relative aspect-[4/3] bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={thumb} alt={alt || asset.filename} className="h-full w-full object-cover" />
        {selected ? (
          <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow">
            <Check className="h-4 w-4" />
          </span>
        ) : null}
        {!thumb ? <ImageFallbackPlaceholder className="absolute inset-0" /> : null}
      </div>
      <div className="space-y-2 p-3" onClick={(e) => e.stopPropagation()}>
        <p className="truncate text-xs font-medium text-foreground" title={asset.filename}>
          {asset.filename}
        </p>
        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
          {mediaFolderLabel(asset.folder)}
          {asset.width && asset.height ? ` · ${asset.width}×${asset.height}` : ""}
        </p>
        {onAltChange ? (
          <Input
            value={alt}
            disabled={disabled}
            placeholder="Alt text"
            className="h-8 text-xs"
            onChange={(e) => setAlt(e.target.value)}
            onBlur={() => {
              if (alt !== (asset.alt ?? "")) onAltChange(asset.id, alt);
            }}
          />
        ) : null}
        <div className="flex gap-1">
          <Button type="button" variant="outline" size="sm" className="h-8 flex-1 text-xs" onClick={() => void copyUrl()}>
            <Copy className="mr-1 h-3 w-3" />
            Copy URL
          </Button>
          {onDelete ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              disabled={disabled}
              onClick={() => onDelete(asset.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          ) : null}
        </div>
      </div>
    </article>
  );
}

