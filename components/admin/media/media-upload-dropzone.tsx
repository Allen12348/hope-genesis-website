"use client";

import * as React from "react";
import { ImagePlus, Loader2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MediaFolderId } from "@/lib/domain/media/constants";
import { optimizeImageFile } from "@/lib/media/client-optimize";

type Props = {
  folder: MediaFolderId;
  disabled?: boolean;
  onUploaded?: () => void;
  className?: string;
};

export function MediaUploadDropzone({ folder, disabled, onUploaded, className }: Props) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);

  async function uploadFiles(files: FileList | File[]) {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!list.length) {
      setError("Please choose image files (JPG, PNG, WebP).");
      return;
    }

    setError(null);
    setUploading(true);

    for (let i = 0; i < list.length; i++) {
      const file = list[i]!;
      setProgress(Math.round((i / list.length) * 100));
      try {
        const optimized = await optimizeImageFile(file);
        const ext = optimized.mimeType === "image/webp" ? "webp" : "jpg";
        const form = new FormData();
        form.set("folder", folder);
        form.set("filename", file.name);
        form.set("mimeType", optimized.mimeType);
        form.set("width", String(optimized.width));
        form.set("height", String(optimized.height));
        form.append("full", optimized.full, `full.${ext}`);
        form.append("thumb", optimized.thumb, `thumb.${ext}`);

        const res = await fetch("/api/admin/media", { method: "POST", body: form });
        const json = (await res.json()) as { error?: string };
        if (!res.ok) {
          throw new Error(json.error ?? "Upload failed");
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Upload failed");
        setUploading(false);
        setProgress(0);
        return;
      }
    }

    setProgress(100);
    setUploading(false);
    setProgress(0);
    onUploaded?.();
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (disabled || uploading) return;
    if (e.dataTransfer.files?.length) void uploadFiles(e.dataTransfer.files);
  }

  return (
    <div
      className={cn(
        "relative rounded-2xl border-2 border-dashed p-6 text-center transition-colors",
        dragOver ? "border-primary bg-primary/5" : "border-border bg-muted/20",
        disabled || uploading ? "pointer-events-none opacity-60" : "cursor-pointer hover:border-primary/50",
        className,
      )}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled && !uploading) setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
      onClick={() => !disabled && !uploading && inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        disabled={disabled || uploading}
        onChange={(e) => {
          if (e.target.files?.length) void uploadFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <div className="mx-auto flex max-w-sm flex-col items-center gap-2">
        {uploading ? (
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        ) : dragOver ? (
          <Upload className="h-8 w-8 text-primary" />
        ) : (
          <ImagePlus className="h-8 w-8 text-muted-foreground" />
        )}
        <p className="text-sm font-medium text-foreground">
          {uploading ? "Uploading & optimizing…" : "Drag images here or click to browse"}
        </p>
        <p className="text-xs text-muted-foreground">
          Images are compressed to WebP and thumbnails are generated automatically.
        </p>
        {uploading ? (
          <div className="mt-2 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${Math.max(progress, 8)}%` }}
            />
          </div>
        ) : null}
      </div>
      {error ? <p className="mt-3 text-sm font-medium text-destructive">{error}</p> : null}
    </div>
  );
}
