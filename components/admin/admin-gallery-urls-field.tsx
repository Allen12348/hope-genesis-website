"use client";

import * as React from "react";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  type DragEndEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FolderOpen, GripVertical, ImagePlus, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isSafeImageSource } from "@/lib/validations/image-url";
import { ImageFallbackPlaceholder } from "@/components/media/image-fallback-placeholder";
import type { MediaFolderId } from "@/lib/domain/media/constants";
import { MediaPickerDialog } from "@/components/admin/media/media-picker-dialog";

function previewSrc(url: string): string {
  const t = url.trim();
  if (!t) return "";
  if (t.startsWith("http")) return t;
  if (typeof window !== "undefined" && t.startsWith("/")) return `${window.location.origin}${t}`;
  return t;
}

type RowState = { id: string; url: string; status: "idle" | "ok" | "error" };

function newRow(url = ""): RowState {
  return { id: crypto.randomUUID(), url, status: "idle" };
}

function SortableGalleryRow({
  row,
  index,
  disabled,
  canRemove,
  onUrlChange,
  onRemove,
}: {
  row: RowState;
  index: number;
  disabled?: boolean;
  canRemove: boolean;
  onUrlChange: (url: string) => void;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: row.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.65 : 1 };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="rounded-xl border border-sky-200/50 bg-white/50 p-3 backdrop-blur-sm dark:border-sky-900/30 dark:bg-slate-950/30"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
        <button
          type="button"
          className="mt-1 cursor-grab touch-none self-start rounded p-1 text-muted-foreground hover:text-foreground active:cursor-grabbing"
          aria-label="Drag to reorder"
          disabled={disabled}
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <div className="min-w-0 flex-1 space-y-1">
          <Input
            value={row.url}
            disabled={disabled}
            onChange={(e) => onUrlChange(e.target.value)}
            placeholder="https://example.com/site-photo-01.jpg"
            className="rounded-xl border-border/80 bg-white/80 font-mono text-xs dark:bg-slate-900/50"
            aria-label={`Gallery image URL ${index + 1}`}
          />
          {row.status === "error" ? (
            <p className="text-xs font-medium text-destructive">Invalid or unreachable image URL.</p>
          ) : null}
        </div>
        <div className="flex shrink-0 gap-1">
          {canRemove ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-xl text-muted-foreground hover:text-destructive"
              disabled={disabled}
              onClick={onRemove}
              aria-label="Remove image"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          ) : null}
        </div>
      </div>
      <div className="relative mt-2 aspect-[16/10] overflow-hidden rounded-lg border border-border/60 bg-muted/20">
        {row.url.trim() && isSafeImageSource(row.url.trim()) && row.status !== "error" ? (
          // eslint-disable-next-line @next/next/no-img-element -- admin preview
          <img src={previewSrc(row.url)} alt="" className="h-full w-full object-cover" />
        ) : row.url.trim() && row.status === "idle" ? (
          <div className="flex h-full min-h-[80px] items-center justify-center text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : (
          <ImageFallbackPlaceholder className="h-full min-h-[80px]" />
        )}
      </div>
    </div>
  );
}

type Props = {
  urls: string[];
  onChange: (urls: string[]) => void;
  disabled?: boolean;
  mediaFolder?: MediaFolderId;
};

export function AdminGalleryUrlsField({ urls, onChange, disabled, mediaFolder = "gallery" }: Props) {
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [rows, setRows] = React.useState<RowState[]>(() =>
    urls.length ? urls.map((url) => newRow(url)) : [newRow()],
  );

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  function sync(next: RowState[]) {
    setRows(next);
    onChange(next.map((r) => r.url));
  }

  function probeRow(index: number, url: string) {
    const u = url.trim();
    if (!u) return;
    if (!isSafeImageSource(u)) {
      setRows((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], url: u, status: "error" };
        return next;
      });
      return;
    }
    const img = new window.Image();
    img.onload = () => {
      setRows((prev) => {
        const next = [...prev];
        if (next[index]?.url.trim() !== u) return prev;
        next[index] = { ...next[index], status: "ok" };
        return next;
      });
    };
    img.onerror = () => {
      setRows((prev) => {
        const next = [...prev];
        if (next[index]?.url.trim() !== u) return prev;
        next[index] = { ...next[index], status: "error" };
        return next;
      });
    };
    img.src = previewSrc(u);
  }

  React.useEffect(() => {
    rows.forEach((row, i) => {
      if (row.url.trim() && isSafeImageSource(row.url.trim()) && row.status === "idle") {
        probeRow(i, row.url);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- preview per URL
  }, [rows.map((r) => `${r.id}:${r.url}`).join("|")]);

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = rows.findIndex((r) => r.id === active.id);
    const newIndex = rows.findIndex((r) => r.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    sync(arrayMove(rows, oldIndex, newIndex));
  }

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <Label className="text-sm font-semibold">Gallery images</Label>
        <p className="text-xs text-muted-foreground">
          Drag to reorder, select from the media library, or paste URLs — shown on the public case study page.
        </p>
      </div>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="rounded-xl"
        disabled={disabled || rows.length >= 12}
        onClick={() => setPickerOpen(true)}
      >
        <FolderOpen className="mr-2 h-4 w-4" />
        Add from media library
      </Button>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={rows.map((r) => r.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {rows.map((row, index) => (
              <SortableGalleryRow
                key={row.id}
                row={row}
                index={index}
                disabled={disabled}
                canRemove={rows.length > 1}
                onUrlChange={(url) => {
                  const next = [...rows];
                  next[index] = { ...next[index], url, status: "idle" };
                  sync(next);
                }}
                onRemove={() => sync(rows.filter((_, j) => j !== index))}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="rounded-xl border-dashed border-sky-300/80 bg-sky-50/50 text-sky-900 hover:bg-sky-100/80 dark:border-sky-800 dark:bg-sky-950/30 dark:text-sky-100"
        disabled={disabled || rows.length >= 12}
        onClick={() => sync([...rows, newRow()])}
      >
        <ImagePlus className="mr-2 h-4 w-4" />
        Add another image
      </Button>
      <MediaPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        defaultFolder={mediaFolder}
        title="Add gallery image"
        onSelect={(url) => {
          const emptyIdx = rows.findIndex((r) => !r.url.trim());
          if (emptyIdx >= 0) {
            const next = [...rows];
            next[emptyIdx] = { ...next[emptyIdx], url, status: "ok" };
            sync(next);
          } else {
            sync([...rows, { ...newRow(url), status: "ok" }]);
          }
        }}
      />
    </div>
  );
}
