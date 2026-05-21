"use client";

import * as React from "react";
import { getSiteUrl } from "@/lib/seo-defaults";
import { PROJECT_CATEGORIES, type ProjectCategoryValue } from "@/lib/cms/project-categories";
import { PROJECT_STATUSES, PROJECT_STATUS_LABELS, type ProjectStatusValue } from "@/lib/cms/project-status";
import { AdminProjectStatsField } from "@/components/admin/admin-project-stats-field";
import type { ProjectStat } from "@/types";
import type { Testimonial } from "@prisma/client";
import { slugifyTitle, validateProjectForm, type ProjectFormErrors } from "@/lib/cms/project-form-validation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { AdminFormField } from "@/components/admin/ui/admin-form-field";
import { AdminFormSection } from "@/components/admin/ui/admin-form-section";
import { AdminImageUrlField } from "@/components/admin/admin-image-url-field";
import { AdminFallbackImageField } from "@/components/admin/admin-fallback-image-field";
import { AdminScopeField } from "@/components/admin/admin-scope-field";
import { AdminGalleryUrlsField } from "@/components/admin/admin-gallery-urls-field";
import { AdminProjectPreviewCard } from "@/components/admin/admin-project-preview-card";
import { FORM_TOOLTIPS, PROJECT_GUIDANCE } from "@/lib/cms/form-guidance";
import { cn } from "@/lib/utils";

const LOCATION_SUGGESTIONS = [
  "Calamba, Laguna",
  "Sta. Rosa, Laguna",
  "San Pablo, Laguna",
  "Batangas City",
  "Metro Manila",
] as const;

const inputClass =
  "rounded-xl border-border/80 bg-white/80 backdrop-blur-sm transition focus-visible:border-sky-400/60 focus-visible:ring-sky-500/25 dark:bg-slate-900/50";

export type ProjectFormValues = {
  slug: string;
  title: string;
  category: ProjectCategoryValue;
  location: string;
  year: string;
  summary: string;
  scope: string;
  image: string;
  imageUrl: string;
  imageAlt: string;
  galleryImageUrls: string[];
  beforeImage: string;
  afterImage: string;
  beforeImageUrl: string;
  afterImageUrl: string;
  equipmentUsed: string;
  installationDuration: string;
  challenge: string;
  solution: string;
  results: string;
  published: boolean;
  featured: boolean;
  clientLabel: string;
  status: ProjectStatusValue;
  stats: ProjectStat[];
  testimonialId: string;
  sortOrder: number;
};

type Props = {
  values: ProjectFormValues;
  onChange: (patch: Partial<ProjectFormValues>) => void;
  errors: ProjectFormErrors;
  onErrorsChange: (errors: ProjectFormErrors) => void;
  slugAuto: boolean;
  onSlugAutoChange: (auto: boolean) => void;
  disabled?: boolean;
  showAdvanced?: boolean;
  testimonials?: Pick<Testimonial, "id" | "clientName" | "company" | "approved" | "rejected">[];
};

export function ProjectFormDrawerContent({
  values,
  onChange,
  errors,
  onErrorsChange,
  slugAuto,
  onSlugAutoChange,
  disabled,
  showAdvanced = true,
  testimonials = [],
}: Props) {
  const siteOrigin = React.useMemo(() => getSiteUrl(), []);
  const slugPreview = values.slug.trim() || "your-project-slug";

  function patch(partial: Partial<ProjectFormValues>) {
    onChange(partial);
    const keys = Object.keys(partial) as (keyof ProjectFormValues)[];
    const nextErrors = { ...errors };
    let touched = false;
    for (const key of keys) {
      if (key in nextErrors) {
        delete nextErrors[key as keyof ProjectFormErrors];
        touched = true;
      }
    }
    if (touched) onErrorsChange(nextErrors);
  }

  function handleTitle(next: string) {
    if (slugAuto) {
      patch({ title: next, slug: slugifyTitle(next) });
    } else {
      patch({ title: next });
    }
  }

  function handleYear(raw: string) {
    const digits = raw.replace(/\D/g, "").slice(0, 4);
    patch({ year: digits });
  }

  const coverPreview = values.imageUrl.trim() || values.image.trim();

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px] xl:grid-cols-[minmax(0,1fr)_280px]">
      <div className="min-w-0 space-y-6 scroll-smooth">
        <AdminFormSection title="Basics" description="Core details shown on the public project page.">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AdminFormField
              id="proj-year"
              label="Year"
              required
              helper="When the project was completed."
              error={errors.year}
            >
              <Input
                id="proj-year"
                inputMode="numeric"
                value={values.year}
                disabled={disabled}
                onChange={(e) => handleYear(e.target.value)}
                placeholder="2026"
                className={cn(inputClass, errors.year && "border-destructive/60")}
              />
            </AdminFormField>
            <AdminFormField
              id="proj-category"
              label="Category"
              required
              helper="Choose the type of work for filtering on the site."
            >
              <select
                id="proj-category"
                className={cn("h-11 w-full px-3 text-sm font-medium", inputClass)}
                value={values.category}
                disabled={disabled}
                onChange={(e) => patch({ category: e.target.value as ProjectCategoryValue })}
              >
                {PROJECT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </AdminFormField>
            <AdminFormField id="proj-status" label="Project status" helper="Lifecycle label on the case study page.">
              <select
                id="proj-status"
                className={cn("h-11 w-full px-3 text-sm font-medium", inputClass)}
                value={values.status}
                disabled={disabled}
                onChange={(e) => patch({ status: e.target.value as ProjectStatusValue })}
              >
                {PROJECT_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {PROJECT_STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </AdminFormField>
          </div>

          <AdminFormField
            id="proj-title"
            label="Title"
            required
            helper={PROJECT_GUIDANCE.title.helper}
            example={PROJECT_GUIDANCE.title.placeholder}
            error={errors.title}
          >
            <Input
              id="proj-title"
              value={values.title}
              disabled={disabled}
              onChange={(e) => handleTitle(e.target.value)}
              placeholder={PROJECT_GUIDANCE.title.placeholder}
              className={cn(inputClass, errors.title && "border-destructive/60")}
            />
          </AdminFormField>

          <AdminFormField
            id="proj-slug"
            label="Slug"
            required
            tooltip={FORM_TOOLTIPS.slug}
            helper={
              <>
                Used for the project page URL. Example:{" "}
                <span className="font-mono text-[11px] text-foreground/80">
                  {siteOrigin}/projects/{slugPreview}
                </span>
              </>
            }
            error={errors.slug}
          >
            <Input
              id="proj-slug"
              value={values.slug}
              disabled={disabled}
              onChange={(e) => {
                onSlugAutoChange(false);
                patch({ slug: e.target.value.toLowerCase().replace(/\s+/g, "-") });
              }}
              placeholder="daikin-vrf-installation-sm-calamba"
              className={cn(inputClass, "font-mono text-sm", errors.slug && "border-destructive/60")}
            />
            {slugAuto ? (
              <p className="text-[11px] text-sky-700 dark:text-sky-300">Auto-generated from title — edit anytime.</p>
            ) : null}
          </AdminFormField>

          <AdminFormField
            id="proj-location"
            label="Location"
            required
            helper="City and province where the work was done."
            error={errors.location}
          >
            <Input
              id="proj-location"
              list="proj-location-suggestions"
              value={values.location}
              disabled={disabled}
              onChange={(e) => patch({ location: e.target.value })}
              placeholder="San Pablo, Laguna"
              className={cn(inputClass, errors.location && "border-destructive/60")}
            />
            <datalist id="proj-location-suggestions">
              {LOCATION_SUGGESTIONS.map((loc) => (
                <option key={loc} value={loc} />
              ))}
            </datalist>
          </AdminFormField>

          <AdminFormField
            id="proj-summary"
            label="Summary"
            required
            helper="Short overview of the project."
            error={errors.summary}
          >
            <Textarea
              id="proj-summary"
              value={values.summary}
              disabled={disabled}
              rows={3}
              onChange={(e) => patch({ summary: e.target.value })}
              placeholder="Installed a complete Daikin inverter system for a two-storey residential property including testing, commissioning, and refrigerant balancing."
              className={cn(inputClass, errors.summary && "border-destructive/60")}
            />
          </AdminFormField>

          <AdminScopeField
            id="proj-scope"
            value={values.scope}
            disabled={disabled}
            error={errors.scope}
            onChange={(scope) => patch({ scope })}
          />
        </AdminFormSection>

        <AdminFormSection title="Images" description="Cover and gallery photos for this case study.">
          <AdminImageUrlField
            id="proj-cover-remote"
            label="Main cover image (URL)"
            value={values.imageUrl}
            onChange={(imageUrl) => patch({ imageUrl })}
            disabled={disabled}
            mediaFolder="projects"
            placeholder="https://example.com/project-image.jpg"
            className="border-sky-200/40 bg-sky-50/30 dark:border-sky-900/30 dark:bg-sky-950/20"
          />

          <AdminFallbackImageField
            id="proj-cover-fallback"
            label="Fallback cover image"
            value={values.image}
            disabled={disabled}
            error={errors.image}
            onChange={(image) => patch({ image })}
          />

          <AdminFormField
            id="proj-cover-alt"
            label="Cover image alt"
            required
            helper="Describe the cover for accessibility and SEO."
            error={errors.imageAlt}
          >
            <Input
              id="proj-cover-alt"
              value={values.imageAlt}
              disabled={disabled}
              onChange={(e) => patch({ imageAlt: e.target.value })}
              placeholder={values.title.trim() || "Daikin VRF installation exterior view"}
              className={cn(inputClass, errors.imageAlt && "border-destructive/60")}
            />
          </AdminFormField>

          <AdminGalleryUrlsField
            urls={values.galleryImageUrls}
            disabled={disabled}
            mediaFolder="projects"
            onChange={(galleryImageUrls) => patch({ galleryImageUrls })}
          />
        </AdminFormSection>

        {showAdvanced ? (
          <AdminFormSection
            title="Case study details"
            description="Optional depth for the project page — challenge, results, and before/after."
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <AdminFormField id="proj-before-fallback" label="Before image fallback (optional)">
                <Input
                  id="proj-before-fallback"
                  value={values.beforeImage}
                  disabled={disabled}
                  onChange={(e) => patch({ beforeImage: e.target.value })}
                  className={inputClass}
                />
              </AdminFormField>
              <AdminFormField id="proj-after-fallback" label="After image fallback (optional)">
                <Input
                  id="proj-after-fallback"
                  value={values.afterImage}
                  disabled={disabled}
                  onChange={(e) => patch({ afterImage: e.target.value })}
                  className={inputClass}
                />
              </AdminFormField>
            </div>
            <AdminImageUrlField
              id="proj-before-remote"
              label="Remote before image URL (optional)"
              value={values.beforeImageUrl}
              onChange={(beforeImageUrl) => patch({ beforeImageUrl })}
              disabled={disabled}
              mediaFolder="before-after"
            />
            <AdminImageUrlField
              id="proj-after-remote"
              label="Remote after image URL (optional)"
              value={values.afterImageUrl}
              onChange={(afterImageUrl) => patch({ afterImageUrl })}
              disabled={disabled}
              mediaFolder="before-after"
            />
            <AdminProjectStatsField
              stats={values.stats}
              disabled={disabled}
              onChange={(stats) => patch({ stats })}
            />
            <AdminFormField id="proj-equipment" label="Equipment used (one per line)">
              <Textarea
                id="proj-equipment"
                value={values.equipmentUsed}
                disabled={disabled}
                rows={3}
                onChange={(e) => patch({ equipmentUsed: e.target.value })}
                placeholder={"Daikin VRV IV outdoor unit\nBranch selector boxes\nInsulated copper line sets"}
                className={inputClass}
              />
            </AdminFormField>
            <AdminFormField id="proj-duration" label="Installation duration">
              <Input
                id="proj-duration"
                value={values.installationDuration}
                disabled={disabled}
                onChange={(e) => patch({ installationDuration: e.target.value })}
                placeholder="5 working days"
                className={inputClass}
              />
            </AdminFormField>
            <AdminFormField id="proj-challenge" label="Challenge">
              <Textarea
                id="proj-challenge"
                value={values.challenge}
                disabled={disabled}
                rows={3}
                onChange={(e) => patch({ challenge: e.target.value })}
                placeholder="Legacy split systems could not keep up with peak cooling loads during business hours."
                className={inputClass}
              />
            </AdminFormField>
            <AdminFormField id="proj-solution" label="Solution">
              <Textarea
                id="proj-solution"
                value={values.solution}
                disabled={disabled}
                rows={3}
                onChange={(e) => patch({ solution: e.target.value })}
                placeholder="Designed and installed a VRF system with zoned control and documented commissioning."
                className={inputClass}
              />
            </AdminFormField>
            <AdminFormField id="proj-results" label="Results (one per line)">
              <Textarea
                id="proj-results"
                value={values.results}
                disabled={disabled}
                rows={3}
                onChange={(e) => patch({ results: e.target.value })}
                placeholder={"Stable room temperatures across floors\nLower peak demand vs. legacy units\nFull turnover documentation delivered"}
                className={inputClass}
              />
            </AdminFormField>
            <AdminFormField id="proj-client" label="Client / company label (optional)">
              <Input
                id="proj-client"
                value={values.clientLabel}
                disabled={disabled}
                onChange={(e) => patch({ clientLabel: e.target.value })}
                placeholder="South Luzon Logistics — Calamba hub"
                className={inputClass}
              />
            </AdminFormField>
            <AdminFormField
              id="proj-testimonial"
              label="Linked testimonial"
              helper="Approved testimonials only appear on the public case study."
            >
              <select
                id="proj-testimonial"
                className={cn("h-11 w-full px-3 text-sm font-medium", inputClass)}
                value={values.testimonialId}
                disabled={disabled}
                onChange={(e) => patch({ testimonialId: e.target.value })}
              >
                <option value="">None</option>
                {testimonials.map((t) => (
                  <option key={t.id} value={t.id} disabled={!t.approved || t.rejected}>
                    {t.clientName}
                    {t.company ? ` — ${t.company}` : ""}
                    {!t.approved || t.rejected ? " (not public)" : ""}
                  </option>
                ))}
              </select>
            </AdminFormField>
            <AdminFormField id="proj-sort" label="Sort order" tooltip={FORM_TOOLTIPS.sortOrder}>
              <Input
                id="proj-sort"
                type="number"
                min={0}
                max={9999}
                value={values.sortOrder}
                disabled={disabled}
                onChange={(e) => patch({ sortOrder: Number(e.target.value) || 0 })}
                placeholder="0"
                className={inputClass}
              />
            </AdminFormField>
            <label className="flex items-center gap-2 text-sm font-semibold">
              <Checkbox
                checked={values.featured}
                disabled={disabled}
                onCheckedChange={(c) => patch({ featured: Boolean(c) })}
              />
              Featured on homepage strip
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold">
              <Checkbox
                checked={values.published}
                disabled={disabled}
                onCheckedChange={(c) => patch({ published: Boolean(c) })}
              />
              Published
            </label>
          </AdminFormSection>
        ) : null}
      </div>

      <div className="lg:sticky lg:top-2 lg:self-start">
        <AdminProjectPreviewCard
          title={values.title}
          category={values.category}
          location={values.location}
          summary={values.summary}
          coverUrl={coverPreview}
          galleryUrls={values.galleryImageUrls}
        />
      </div>
    </div>
  );
}

export function runProjectFormValidation(
  values: ProjectFormValues,
  onErrors: (e: ProjectFormErrors) => void,
): boolean {
  const next = validateProjectForm(values);
  onErrors(next);
  return Object.keys(next).length === 0;
}
