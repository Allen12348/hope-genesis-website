"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { AdminFormField } from "@/components/admin/ui/admin-form-field";
import { cn } from "@/lib/utils";

/** Strip leading bullet markers only — preserve spaces inside the line. */
function stripBulletPrefix(line: string): string {
  return line.replace(/^[\s•\-*]+/, "");
}

/** Normalize bullets on blur — do not call while the user is typing. */
function withBullets(raw: string): string {
  return raw
    .split("\n")
    .map((line) => {
      const content = stripBulletPrefix(line).trim();
      return content ? `• ${content}` : "";
    })
    .join("\n");
}

type Props = {
  id: string;
  value: string;
  onChange: (next: string) => void;
  disabled?: boolean;
  error?: string | null;
};

export function AdminScopeField({ id, value, onChange, disabled, error }: Props) {
  return (
    <AdminFormField
      id={id}
      label="Scope"
      helper="One scope item per line. Bullets are added automatically."
      error={error}
    >
      <Textarea
        id={id}
        value={value}
        disabled={disabled}
        rows={5}
        placeholder={
          "• Supply and installation\n• Copper tubing and insulation\n• Vacuum and leak testing\n• Electrical works\n• System commissioning"
        }
        className={cn(
          "rounded-xl border-border/80 bg-white/80 font-mono text-sm leading-relaxed backdrop-blur-sm focus-visible:ring-sky-500/30 dark:bg-slate-900/50",
        )}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => onChange(withBullets(value))}
      />
    </AdminFormField>
  );
}
