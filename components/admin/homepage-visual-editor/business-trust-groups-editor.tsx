"use client";

import * as React from "react";
import { Plus, Trash2 } from "lucide-react";
import type { BusinessTrustCms } from "@/lib/cms/marketing-cms-defaults";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ICON_OPTIONS = [
  { value: "certifications", label: "Certifications" },
  { value: "partners", label: "Partners" },
  { value: "permits", label: "Permits" },
  { value: "awards", label: "Awards" },
  { value: "areas", label: "Service areas" },
  { value: "clients", label: "Clients" },
] as const;

type Props = {
  data: BusinessTrustCms;
  onChange: (next: BusinessTrustCms) => void;
};

export function BusinessTrustGroupsEditor({ data, onChange }: Props) {
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Edit trust badges, certifications, and service area lines shown in the Business Trust section.
      </p>
      {data.groups.map((group, gi) => (
        <div key={`${group.title}-${gi}`} className="space-y-3 rounded-xl border border-border/70 bg-muted/15 p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase text-muted-foreground">Group {gi + 1}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive"
              onClick={() => onChange({ groups: data.groups.filter((_, i) => i !== gi) })}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label>Title</Label>
              <Input
                value={group.title}
                onChange={(e) => {
                  const groups = [...data.groups];
                  groups[gi] = { ...groups[gi]!, title: e.target.value };
                  onChange({ groups });
                }}
              />
            </div>
            <div className="space-y-1">
              <Label>Icon</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={group.icon}
                onChange={(e) => {
                  const groups = [...data.groups];
                  groups[gi] = {
                    ...groups[gi]!,
                    icon: e.target.value as BusinessTrustCms["groups"][number]["icon"],
                  };
                  onChange({ groups });
                }}
              >
                {ICON_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <Label>Items (one per line)</Label>
            <textarea
              className="min-h-[88px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={group.items.join("\n")}
              onChange={(e) => {
                const groups = [...data.groups];
                groups[gi] = {
                  ...groups[gi]!,
                  items: e.target.value
                    .split("\n")
                    .map((l) => l.trim())
                    .filter(Boolean),
                };
                onChange({ groups });
              }}
            />
          </div>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="rounded-xl"
        onClick={() =>
          onChange({
            groups: [
              ...data.groups,
              { icon: "certifications", title: "New group", items: ["Add a trust line"] },
            ],
          })
        }
      >
        <Plus className="mr-2 h-4 w-4" />
        Add trust group
      </Button>
    </div>
  );
}
