"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ProjectStat } from "@/types";

const inputClass =
  "rounded-xl border-border/80 bg-white/80 text-sm dark:bg-slate-900/50";

function emptyStat(): ProjectStat {
  return { label: "", value: "", suffix: "" };
}

type Props = {
  stats: ProjectStat[];
  onChange: (stats: ProjectStat[]) => void;
  disabled?: boolean;
};

export function AdminProjectStatsField({ stats, onChange, disabled }: Props) {
  const rows = stats.length ? stats : [emptyStat()];

  function update(index: number, patch: Partial<ProjectStat>) {
    const next = [...rows];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  }

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <Label className="text-sm font-semibold">Project stats</Label>
        <p className="text-xs text-muted-foreground">
          Optional highlight metrics on the case study page (e.g. Capacity, Energy savings).
        </p>
      </div>
      <div className="space-y-2">
        {rows.map((row, index) => (
          <div
            key={index}
            className="grid gap-2 rounded-xl border border-border/60 bg-muted/20 p-3 sm:grid-cols-[1fr_1fr_80px_auto]"
          >
            <Input
              value={row.label}
              disabled={disabled}
              onChange={(e) => update(index, { label: e.target.value })}
              placeholder="Label (e.g. Capacity)"
              className={inputClass}
              aria-label="Stat label"
            />
            <Input
              value={row.value}
              disabled={disabled}
              onChange={(e) => update(index, { value: e.target.value })}
              placeholder="Value (e.g. 24)"
              className={inputClass}
              aria-label="Stat value"
            />
            <Input
              value={row.suffix ?? ""}
              disabled={disabled}
              onChange={(e) => update(index, { suffix: e.target.value })}
              placeholder="HP"
              className={inputClass}
              aria-label="Stat suffix"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-xl text-muted-foreground hover:text-destructive"
              disabled={disabled || rows.length <= 1}
              onClick={() => onChange(rows.filter((_, j) => j !== index))}
              aria-label="Remove stat"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="rounded-xl border-dashed"
        disabled={disabled || rows.length >= 6}
        onClick={() => onChange([...rows, emptyStat()])}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add stat
      </Button>
    </div>
  );
}
