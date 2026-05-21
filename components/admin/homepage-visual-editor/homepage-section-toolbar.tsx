"use client";

import {
  ArrowDown,
  ArrowUp,
  Copy,
  Eye,
  EyeOff,
  Pencil,
  RotateCcw,
  Trash2,
} from "lucide-react";
import type { HomepageCanvasSectionId } from "@/lib/cms/homepage-visual-editor/types";
import { HOMEPAGE_BLOCK_BY_ID } from "@/lib/cms/homepage-visual-editor/registry";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  sectionId: HomepageCanvasSectionId;
  label: string;
  visible: boolean;
  selected: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  canDelete: boolean;
  onSelect: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onToggleVisible: () => void;
  onDuplicate: () => void;
  onReset: () => void;
  onDelete: () => void;
};

export function HomepageSectionToolbar({
  sectionId,
  label,
  visible,
  selected,
  canMoveUp,
  canMoveDown,
  canDelete,
  onSelect,
  onMoveUp,
  onMoveDown,
  onToggleVisible,
  onDuplicate,
  onReset,
  onDelete,
}: Props) {
  const block = HOMEPAGE_BLOCK_BY_ID[sectionId];

  return (
    <div
      className={cn(
        "pointer-events-auto flex flex-wrap items-center gap-1 rounded-xl border border-sky-200/80 bg-white/95 px-2 py-1.5 shadow-lg backdrop-blur-sm dark:border-sky-800/60 dark:bg-slate-950/95",
        selected && "border-sky-500 ring-2 ring-sky-400/35",
      )}
    >
      <span className="mr-1 max-w-[140px] truncate text-[11px] font-bold uppercase tracking-wide text-sky-800 dark:text-sky-200">
        {label}
      </span>
      {!visible ? (
        <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-amber-800">Hidden</span>
      ) : null}
      <div className="ml-auto flex flex-wrap items-center gap-0.5">
        <Button type="button" size="icon" variant="ghost" className="h-7 w-7" onClick={onSelect} aria-label="Edit section">
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button type="button" size="icon" variant="ghost" className="h-7 w-7" disabled={!canMoveUp} onClick={onMoveUp} aria-label="Move up">
          <ArrowUp className="h-3.5 w-3.5" />
        </Button>
        <Button type="button" size="icon" variant="ghost" className="h-7 w-7" disabled={!canMoveDown} onClick={onMoveDown} aria-label="Move down">
          <ArrowDown className="h-3.5 w-3.5" />
        </Button>
        {sectionId !== "hero" ? (
          <Button type="button" size="icon" variant="ghost" className="h-7 w-7" onClick={onToggleVisible} aria-label="Toggle visibility">
            {visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />}
          </Button>
        ) : null}
        {block.duplicatable ? (
          <Button type="button" size="icon" variant="ghost" className="h-7 w-7" onClick={onDuplicate} aria-label="Duplicate">
            <Copy className="h-3.5 w-3.5" />
          </Button>
        ) : null}
        <Button type="button" size="icon" variant="ghost" className="h-7 w-7" onClick={onReset} aria-label="Reset section">
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>
        {canDelete ? (
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-7 w-7 text-destructive"
            onClick={onDelete}
            aria-label="Delete section"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        ) : null}
      </div>
    </div>
  );
}
