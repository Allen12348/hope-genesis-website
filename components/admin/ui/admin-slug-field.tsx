"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { AdminFormField } from "@/components/admin/ui/admin-form-field";
import { FORM_TOOLTIPS, inputClass } from "@/lib/cms/form-guidance";
import { slugifyTitle } from "@/lib/cms/slug";
import { cn } from "@/lib/utils";

type Props = {
  id: string;
  slug: string;
  onSlugChange: (value: string) => void;
  title: string;
  slugAuto: boolean;
  onSlugAutoChange: (auto: boolean) => void;
  urlPrefix?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string | null;
};

export function AdminSlugField({
  id,
  slug,
  onSlugChange,
  title,
  slugAuto,
  onSlugAutoChange,
  urlPrefix = "",
  placeholder = "how-to-clean-aircon-filter",
  disabled,
  error,
}: Props) {
  const previewSlug = slug.trim() || "your-slug";

  React.useEffect(() => {
    if (slugAuto && title.trim()) {
      onSlugChange(slugifyTitle(title));
    }
    // Only react to title/auto toggles — manual slug edits disable auto
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, slugAuto]);

  return (
    <AdminFormField
      id={id}
      label="Slug"
      tooltip={FORM_TOOLTIPS.slug}
      helper={
        urlPrefix ? (
          <>
            Public URL:{" "}
            <span className="font-mono text-foreground/80">
              {urlPrefix}
              {previewSlug}
            </span>
          </>
        ) : (
          "Used in the page URL. Lowercase letters, numbers, and hyphens only."
        )
      }
      example={placeholder}
      error={error}
    >
      <Input
        id={id}
        value={slug}
        disabled={disabled}
        onChange={(e) => {
          onSlugAutoChange(false);
          onSlugChange(e.target.value);
        }}
        placeholder={placeholder}
        className={cn(inputClass, "font-mono text-sm", error && "border-destructive/60")}
      />
      <label className="mt-2 flex cursor-pointer items-center gap-2 text-xs font-medium text-muted-foreground">
        <Checkbox
          checked={slugAuto}
          disabled={disabled}
          onCheckedChange={(c) => onSlugAutoChange(Boolean(c))}
        />
        Auto-generate from title
      </label>
    </AdminFormField>
  );
}
