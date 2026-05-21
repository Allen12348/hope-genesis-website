"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Props = {
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  label?: string;
};

/** Click-to-edit text for the visual homepage CMS preview. */
export function InlineEditableText({
  value,
  onChange,
  multiline = false,
  className,
  placeholder = "Click to edit",
  disabled = false,
  label,
}: Props) {
  const [editing, setEditing] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  if (disabled) {
    return <span className={className}>{value || placeholder}</span>;
  }

  if (editing) {
    const shared =
      "w-full rounded-lg border border-sky-400/60 bg-white px-2 py-1 text-inherit shadow-sm outline-none ring-2 ring-sky-400/30 dark:bg-slate-950";
    return (
      <span className="block min-w-[8rem]">
        {label ? <span className="mb-0.5 block text-[10px] font-semibold uppercase tracking-wide text-sky-700">{label}</span> : null}
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            className={cn(shared, "min-h-[4rem] resize-y", className)}
            value={value}
            rows={3}
            onChange={(e) => onChange(e.target.value)}
            onBlur={() => setEditing(false)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setEditing(false);
            }}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            className={cn(shared, className)}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={() => setEditing(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter") setEditing(false);
              if (e.key === "Escape") setEditing(false);
            }}
          />
        )}
      </span>
    );
  }

  return (
    <button
      type="button"
      className={cn(
        "group relative cursor-text rounded-md text-left transition hover:bg-sky-500/10 hover:ring-1 hover:ring-sky-400/40",
        !value && "text-muted-foreground italic",
        className,
      )}
      onClick={() => setEditing(true)}
      title="Click to edit"
    >
      {value || placeholder}
      <span className="pointer-events-none absolute -right-1 -top-1 hidden rounded bg-sky-600 px-1 py-0.5 text-[9px] font-bold uppercase text-white group-hover:block">
        Edit
      </span>
    </button>
  );
}
