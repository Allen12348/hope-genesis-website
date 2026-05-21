"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { AdminFieldTooltip } from "@/components/admin/ui/admin-field-tooltip";
import { cn } from "@/lib/utils";

export function AdminGuidedCheckbox({
  id,
  label,
  checked,
  onCheckedChange,
  tooltip,
  helper,
  disabled,
  className,
}: {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  tooltip?: string;
  helper?: string;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1", className)}>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-2 text-sm font-medium text-foreground">
        <Checkbox
          id={id}
          checked={checked}
          disabled={disabled}
          onCheckedChange={(c) => onCheckedChange(Boolean(c))}
          className="mt-0.5"
        />
        <span className="flex flex-1 flex-wrap items-center gap-1.5">
          {label}
          {tooltip ? <AdminFieldTooltip content={tooltip} /> : null}
        </span>
      </label>
      {helper ? <p className="pl-6 text-xs text-muted-foreground">{helper}</p> : null}
    </div>
  );
}
