"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { AdminFieldTooltip } from "@/components/admin/ui/admin-field-tooltip";
import { cn } from "@/lib/utils";

type AdminFormFieldProps = {
  id: string;
  label: string;
  required?: boolean;
  helper?: React.ReactNode;
  tooltip?: string;
  example?: string;
  hint?: string;
  error?: string | null;
  children: React.ReactNode;
  className?: string;
};

export function AdminFormField({
  id,
  label,
  required,
  helper,
  tooltip,
  example,
  hint,
  error,
  children,
  className,
}: AdminFormFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center gap-1.5">
        <Label htmlFor={id} className="text-sm font-semibold text-foreground">
          {label}
          {required ? <span className="ml-0.5 text-sky-600 dark:text-sky-400">*</span> : null}
        </Label>
        {tooltip ? <AdminFieldTooltip content={tooltip} /> : null}
      </div>
      {children}
      {example ? (
        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground/70">Example: </span>
          <span className="italic">{example}</span>
        </p>
      ) : null}
      {helper ? <p className="text-xs leading-relaxed text-muted-foreground">{helper}</p> : null}
      {hint && !error ? <p className="text-xs text-sky-700/80 dark:text-sky-400/90">{hint}</p> : null}
      {error ? (
        <p className="text-xs font-medium text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
