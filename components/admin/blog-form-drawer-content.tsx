"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AdminFallbackImageField } from "@/components/admin/admin-fallback-image-field";
import { AdminImageUrlField } from "@/components/admin/admin-image-url-field";
import { AdminBadge } from "@/components/admin/ui/admin-badge";
import { AdminFormField } from "@/components/admin/ui/admin-form-field";
import { AdminFormIntro } from "@/components/admin/ui/admin-form-intro";
import { AdminFormSection } from "@/components/admin/ui/admin-form-section";
import { AdminGuidedCheckbox } from "@/components/admin/ui/admin-guided-checkbox";
import { AdminLivePreviewCard } from "@/components/admin/ui/admin-live-preview-card";
import { AdminSeoFields } from "@/components/admin/ui/admin-seo-fields";
import { AdminSlugField } from "@/components/admin/ui/admin-slug-field";
import { BLOG_GUIDANCE, FORM_TOOLTIPS, inputClass } from "@/lib/cms/form-guidance";
import { blogEditorialCategories } from "@/lib/services/marketing/constants";

export type BlogFormValues = {
  slug: string;
  title: string;
  description: string;
  category: (typeof blogEditorialCategories)[number];
  publishedAt: string;
  readingMinutes: number;
  featured: boolean;
  coverImage: string;
  coverImageUrl: string;
  coverAlt: string;
  body: string;
  published: boolean;
  tags: string;
  metaTitle: string;
  metaDescription: string;
};

type Props = {
  values: BlogFormValues;
  onChange: (patch: Partial<BlogFormValues>) => void;
  slugAuto: boolean;
  onSlugAutoChange: (auto: boolean) => void;
  disabled?: boolean;
};

export function BlogFormDrawerContent({ values, onChange, slugAuto, onSlugAutoChange, disabled }: Props) {
  const coverPreview = values.coverImageUrl.trim() || values.coverImage.trim();

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_240px]">
      <div className="min-w-0 space-y-6">
        <AdminFormIntro>
          Fill in the title and description first — we can suggest the URL slug and SEO fields. Use blank lines in
          the body for new paragraphs.
        </AdminFormIntro>

        <AdminFormSection title="Post details" description="What readers see on the blog listing and article page.">
          <AdminSlugField
            id="blog-slug"
            slug={values.slug}
            onSlugChange={(slug) => onChange({ slug })}
            title={values.title}
            slugAuto={slugAuto}
            onSlugAutoChange={onSlugAutoChange}
            urlPrefix="/blog/"
            placeholder={BLOG_GUIDANCE.slug.placeholder}
            disabled={disabled}
          />
          <AdminFormField
            id="blog-title"
            label="Title"
            required
            helper={BLOG_GUIDANCE.title.helper}
            example={BLOG_GUIDANCE.title.placeholder}
          >
            <Input
              id="blog-title"
              value={values.title}
              disabled={disabled}
              onChange={(e) => onChange({ title: e.target.value })}
              placeholder={BLOG_GUIDANCE.title.placeholder}
              className={inputClass}
            />
          </AdminFormField>
          <AdminFormField
            id="blog-description"
            label="Description"
            required
            helper={BLOG_GUIDANCE.description.helper}
            example={BLOG_GUIDANCE.description.placeholder}
          >
            <Textarea
              id="blog-description"
              value={values.description}
              disabled={disabled}
              onChange={(e) => onChange({ description: e.target.value })}
              placeholder={BLOG_GUIDANCE.description.placeholder}
              className={inputClass}
              rows={3}
            />
          </AdminFormField>
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminFormField id="blog-category" label="Category" helper="Helps readers browse related articles.">
              <select
                id="blog-category"
                className={`h-11 w-full px-3 text-sm font-medium ${inputClass}`}
                value={values.category}
                disabled={disabled}
                onChange={(e) =>
                  onChange({ category: e.target.value as (typeof blogEditorialCategories)[number] })
                }
              >
                {blogEditorialCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </AdminFormField>
            <AdminFormField id="blog-date" label="Published date" helper="Format: YYYY-MM-DD" example="2026-05-19">
              <Input
                id="blog-date"
                value={values.publishedAt}
                disabled={disabled}
                onChange={(e) => onChange({ publishedAt: e.target.value })}
                placeholder="2026-05-19"
                className={inputClass}
              />
            </AdminFormField>
          </div>
          <AdminFormField
            id="blog-reading"
            label="Reading time (minutes)"
            tooltip={FORM_TOOLTIPS.readingMinutes}
            helper={BLOG_GUIDANCE.readingMinutes.helper}
            example={BLOG_GUIDANCE.readingMinutes.placeholder}
          >
            <Input
              id="blog-reading"
              type="number"
              min={1}
              value={values.readingMinutes}
              disabled={disabled}
              onChange={(e) => onChange({ readingMinutes: Number(e.target.value) })}
              placeholder={BLOG_GUIDANCE.readingMinutes.placeholder}
              className={inputClass}
            />
          </AdminFormField>
        </AdminFormSection>

        <AdminFormSection title="Cover image" description="Shown on blog cards and at the top of the article.">
          <AdminFallbackImageField
            id="blog-cover-fallback"
            label="Fallback cover image"
            value={values.coverImage}
            onChange={(coverImage) => onChange({ coverImage })}
            disabled={disabled}
          />
          <AdminImageUrlField
            id="blog-cover-remote"
            label="Remote cover image URL (optional)"
            value={values.coverImageUrl}
            onChange={(coverImageUrl) => onChange({ coverImageUrl })}
            disabled={disabled}
            mediaFolder="blog-covers"
            placeholder="https://example.com/blog-cover.jpg"
          />
          <AdminFormField id="blog-cover-alt" label="Cover alt text" tooltip={FORM_TOOLTIPS.altText}>
            <Input
              id="blog-cover-alt"
              value={values.coverAlt}
              disabled={disabled}
              onChange={(e) => onChange({ coverAlt: e.target.value })}
              placeholder="Technician cleaning an air conditioner filter"
              className={inputClass}
            />
          </AdminFormField>
        </AdminFormSection>

        <AdminFormSection title="Article body">
          <AdminFormField id="blog-body" label="Body" helper={BLOG_GUIDANCE.body.helper}>
            <Textarea
              id="blog-body"
              value={values.body}
              disabled={disabled}
              onChange={(e) => onChange({ body: e.target.value })}
              placeholder={BLOG_GUIDANCE.body.placeholder}
              className={inputClass}
              rows={10}
            />
          </AdminFormField>
          <AdminFormField id="blog-tags" label="Tags" tooltip={FORM_TOOLTIPS.tags} example="hvac, maintenance, laguna">
            <Input
              id="blog-tags"
              value={values.tags}
              disabled={disabled}
              onChange={(e) => onChange({ tags: e.target.value })}
              placeholder="hvac, maintenance, laguna"
              className={inputClass}
            />
          </AdminFormField>
        </AdminFormSection>

        <AdminSeoFields
          metaTitle={values.metaTitle}
          metaDescription={values.metaDescription}
          onMetaTitleChange={(metaTitle) => onChange({ metaTitle })}
          onMetaDescriptionChange={(metaDescription) => onChange({ metaDescription })}
          sourceTitle={values.title}
          sourceDescription={values.description}
          disabled={disabled}
          titleLabel="SEO title override"
          descriptionLabel="SEO description override"
        />

        <AdminFormSection title="Visibility">
          <AdminGuidedCheckbox
            id="blog-featured"
            label="Featured"
            checked={values.featured}
            disabled={disabled}
            tooltip={FORM_TOOLTIPS.featured}
            onCheckedChange={(featured) => onChange({ featured })}
          />
          <AdminGuidedCheckbox
            id="blog-published"
            label="Published"
            checked={values.published}
            disabled={disabled}
            tooltip={FORM_TOOLTIPS.published}
            onCheckedChange={(published) => onChange({ published })}
          />
        </AdminFormSection>
      </div>

      <AdminLivePreviewCard>
        <article className="overflow-hidden rounded-lg border border-border bg-background shadow-sm">
          {coverPreview ? (
            // eslint-disable-next-line @next/next/no-img-element -- admin preview
            <img src={coverPreview} alt="" className="aspect-[16/9] w-full object-cover" />
          ) : (
            <div className="flex aspect-[16/9] items-center justify-center bg-muted text-xs text-muted-foreground">
              No cover image
            </div>
          )}
          <div className="space-y-2 p-3">
            <AdminBadge variant="navy">{values.category}</AdminBadge>
            <h3 className="line-clamp-2 font-display text-sm font-semibold text-foreground">
              {values.title || "Post title"}
            </h3>
            <p className="line-clamp-3 text-xs text-muted-foreground">
              {values.description || "Short description appears here…"}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {values.readingMinutes} min read · {values.publishedAt || "Date"}
            </p>
          </div>
        </article>
      </AdminLivePreviewCard>
    </div>
  );
}
