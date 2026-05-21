"use client";

import { X } from "lucide-react";
import type { HomepageCanvasSectionId, HomepageEditorState } from "@/lib/cms/homepage-visual-editor/types";
import { HOMEPAGE_BLOCK_BY_ID } from "@/lib/cms/homepage-visual-editor/registry";
import type { HomepageEditableField } from "@/lib/cms/homepage-visual-editor/registry";
import { readEditorFieldValue, writeEditorFieldValue } from "@/lib/cms/homepage-visual-editor/field-path";
import { InlineEditableText } from "@/components/admin/homepage-visual-editor/inline-editable-text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { AdminImageUrlField } from "@/components/admin/admin-image-url-field";
import { BeforeAfterItemsEditor } from "@/components/admin/homepage-visual-editor/before-after-items-editor";
import { BusinessTrustGroupsEditor } from "@/components/admin/homepage-visual-editor/business-trust-groups-editor";
import {
  DEFAULT_TESTIMONIALS_DISPLAY,
  type TestimonialsDisplayCms,
} from "@/lib/cms/marketing-cms-defaults";

type Props = {
  sectionId: HomepageCanvasSectionId | null;
  state: HomepageEditorState;
  onChange: (next: HomepageEditorState) => void;
  onClose: () => void;
  validationErrors: { path: string; message: string }[];
};

function TestimonialsDisplayFields({
  value,
  onChange,
}: {
  value: TestimonialsDisplayCms;
  onChange: (v: TestimonialsDisplayCms) => void;
}) {
  return (
    <>
      <div className="flex items-center gap-2">
        <Checkbox
          id="testimonials-featured-only"
          checked={value.featuredOnly}
          onCheckedChange={(c) => onChange({ ...value, featuredOnly: c === true })}
        />
        <Label htmlFor="testimonials-featured-only" className="text-sm">
          Show featured testimonials only
        </Label>
      </div>
      <div className="space-y-1">
        <Label htmlFor="testimonials-layout">Layout</Label>
        <select
          id="testimonials-layout"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          value={value.layout}
          onChange={(e) =>
            onChange({ ...value, layout: e.target.value === "grid" ? "grid" : "carousel" })
          }
        >
          <option value="carousel">Carousel spotlight</option>
          <option value="grid">Grid cards</option>
        </select>
      </div>
    </>
  );
}

function FieldControl({
  field,
  value,
  onChange,
  error,
}: {
  field: HomepageEditableField;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  const id = `hve-${field.key}`;
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-semibold text-foreground">
        {field.label}
        {field.required ? <span className="text-destructive"> *</span> : null}
      </Label>
      {field.helper ? <p className="text-[11px] text-muted-foreground">{field.helper}</p> : null}
      {field.type === "textarea" ? (
        <Textarea id={id} value={value} rows={4} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder} />
      ) : field.type === "imageUrl" ? (
        <AdminImageUrlField
          id={id}
          label={field.label}
          value={value}
          onChange={onChange}
          placeholder={field.placeholder}
          mediaFolder={
            field.path.includes("heroBackground") ? "hero-backgrounds" : field.path.includes("about") ? "team" : "gallery"
          }
        />
      ) : field.type === "overlayOpacity" ? (
        <Input id={id} type="number" min={0} max={1} step={0.05} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <Input id={id} value={value} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder} />
      )}
      {error ? <p className="text-[11px] text-destructive">{error}</p> : null}
    </div>
  );
}

export function HomepageSectionDrawer({ sectionId, state, onChange, onClose, validationErrors }: Props) {
  if (!sectionId) return null;
  const block = HOMEPAGE_BLOCK_BY_ID[sectionId];
  const visible =
    sectionId === "hero" || !block.visibilityKey ? true : state.visibility[block.visibilityKey] !== false;

  const errorsByPath = Object.fromEntries(validationErrors.map((e) => [e.path, e.message]));

  function patchField(path: string, raw: string) {
    onChange(writeEditorFieldValue(state, path, raw));
  }

  const primaryFields = block.fields.filter(
    (f) => ["text", "textarea"].includes(f.type) && !f.path.includes("Url") && !f.path.includes("Image"),
  );
  const mediaFields = block.fields.filter((f) => f.type === "imageUrl" || f.type === "url" || f.type === "overlayOpacity");

  return (
    <>
      <button type="button" className="fixed inset-0 z-40 bg-black/25 lg:hidden" aria-label="Close panel" onClick={onClose} />
      <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-border/70 bg-background shadow-2xl">
        <div className="flex items-center justify-between gap-3 border-b border-border/60 px-5 py-4">
          <div>
            <h2 className="font-display text-lg font-semibold text-foreground">{block.label}</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">{block.description}</p>
          </div>
          <Button type="button" size="icon" variant="ghost" className="shrink-0 rounded-xl" onClick={onClose} aria-label="Close">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {sectionId !== "hero" && block.visibilityKey ? (
            <div className="mb-5 flex items-center gap-2 rounded-xl border border-border/60 bg-muted/20 px-3 py-3">
              <Checkbox
                id="section-visible"
                checked={visible}
                onCheckedChange={(c) => {
                  onChange({
                    ...state,
                    visibility: { ...state.visibility, [block.visibilityKey!]: c === true },
                  });
                }}
              />
              <Label htmlFor="section-visible" className="text-sm font-medium">
                Show this section on the homepage
              </Label>
            </div>
          ) : null}

          {sectionId === "hero" ? (
            <div className="mb-6 space-y-3 rounded-xl border border-sky-200/60 bg-sky-50/50 p-4 dark:border-sky-900/50 dark:bg-sky-950/20">
              <p className="text-xs font-semibold uppercase tracking-wide text-sky-800 dark:text-sky-200">Quick edit</p>
              <InlineEditableText
                label="Headline"
                value={state.home.hero.titleLine1}
                onChange={(v) => patchField("hero.titleLine1", v)}
                className="font-display text-xl font-bold"
              />
              <InlineEditableText
                label="Subtitle"
                value={state.home.hero.subtitle}
                onChange={(v) => patchField("hero.subtitle", v)}
                multiline
                className="text-sm"
              />
            </div>
          ) : null}

          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Copy & content</p>
            {primaryFields.map((field) => (
              <FieldControl
                key={field.path}
                field={field}
                value={readEditorFieldValue(state, field.path)}
                onChange={(v) => patchField(field.path, v)}
                error={errorsByPath[field.path]}
              />
            ))}
          </div>

          {mediaFields.length > 0 ? (
            <div className="mt-6 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Media & links</p>
              {mediaFields.map((field) => (
                <FieldControl
                  key={field.path}
                  field={field}
                  value={readEditorFieldValue(state, field.path)}
                  onChange={(v) => patchField(field.path, v)}
                  error={errorsByPath[field.path]}
                />
              ))}
            </div>
          ) : null}

          {sectionId === "hero" && state.home.hero.stats.length > 0 ? (
            <div className="mt-6 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Hero stats</p>
              {state.home.hero.stats.map((stat, idx) => (
                <div key={stat.id} className="space-y-2 rounded-xl border border-border/60 p-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`stat-vis-${stat.id}`}
                      checked={stat.visible}
                      onCheckedChange={(c) => {
                        const stats = [...state.home.hero.stats];
                        stats[idx] = { ...stats[idx]!, visible: c === true };
                        onChange({ ...state, home: { ...state.home, hero: { ...state.home.hero, stats } } });
                      }}
                    />
                    <Label htmlFor={`stat-vis-${stat.id}`} className="text-xs">
                      Visible
                    </Label>
                  </div>
                  <Input
                    placeholder="Label"
                    value={stat.label}
                    onChange={(e) => {
                      const stats = [...state.home.hero.stats];
                      stats[idx] = { ...stats[idx]!, label: e.target.value };
                      onChange({ ...state, home: { ...state.home, hero: { ...state.home.hero, stats } } });
                    }}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      placeholder="Value"
                      value={String(stat.value)}
                      onChange={(e) => {
                        const stats = [...state.home.hero.stats];
                        stats[idx] = { ...stats[idx]!, value: Number.parseInt(e.target.value, 10) || 0 };
                        onChange({ ...state, home: { ...state.home, hero: { ...state.home.hero, stats } } });
                      }}
                    />
                    <Input
                      placeholder="Suffix"
                      value={stat.suffix ?? ""}
                      onChange={(e) => {
                        const stats = [...state.home.hero.stats];
                        stats[idx] = { ...stats[idx]!, suffix: e.target.value };
                        onChange({ ...state, home: { ...state.home, hero: { ...state.home.hero, stats } } });
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : null}
          {sectionId === "beforeAfter" ? (
            <div className="mt-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Before / after slides
              </p>
              <BeforeAfterItemsEditor
                data={state.home.beforeAfter}
                onChange={(beforeAfter) => onChange({ ...state, home: { ...state.home, beforeAfter } })}
              />
            </div>
          ) : null}

          {sectionId === "businessTrust" ? (
            <div className="mt-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Trust groups</p>
              <BusinessTrustGroupsEditor
                data={state.home.businessTrust}
                onChange={(businessTrust) => onChange({ ...state, home: { ...state.home, businessTrust } })}
              />
            </div>
          ) : null}

          {sectionId === "testimonials" ? (
            <div className="mt-6 space-y-4 rounded-xl border border-border/60 bg-muted/20 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Display options</p>
              <TestimonialsDisplayFields
                value={state.home.testimonialsDisplay ?? DEFAULT_TESTIMONIALS_DISPLAY}
                onChange={(testimonialsDisplay) =>
                  onChange({ ...state, home: { ...state.home, testimonialsDisplay } })
                }
              />
            </div>
          ) : null}
        </div>
      </aside>
    </>
  );
}

