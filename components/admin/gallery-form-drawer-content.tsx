"use client";

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
import { FORM_TOOLTIPS, GALLERY_GUIDANCE, inputClass } from "@/lib/cms/form-guidance";

export type GalleryFormValues = {
  src: string;
  imageUrl: string;
  alt: string;
  caption: string;
  published: boolean;
  category: string;
  featured: boolean;
};

type Props = {
  values: GalleryFormValues;
  onChange: (patch: Partial<GalleryFormValues>) => void;
  disabled?: boolean;
};

export function GalleryFormDrawerContent({ values, onChange, disabled }: Props) {
  const previewSrc = values.imageUrl.trim() || values.src.trim();

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_220px]">
      <div className="space-y-6">
        <AdminFormIntro>
          Add project photos for the public gallery. Use a caption as the title and alt text to describe the image for
          accessibility.
        </AdminFormIntro>

        <AdminFormSection title="Image">
          <AdminFallbackImageField
            id="gal-fallback"
            label="Fallback image source"
            value={values.src}
            onChange={(src) => onChange({ src })}
            disabled={disabled}
          />
          <AdminImageUrlField
            id="gal-remote"
            label="Remote image URL (optional)"
            value={values.imageUrl}
            onChange={(imageUrl) => onChange({ imageUrl })}
            disabled={disabled}
            mediaFolder="gallery"
            placeholder={GALLERY_GUIDANCE.imageUrl.placeholder}
          />
          <AdminFormField
            id="gal-alt"
            label="Alt text"
            required
            tooltip={FORM_TOOLTIPS.altText}
            example={GALLERY_GUIDANCE.alt.placeholder}
          >
            <Input
              id="gal-alt"
              value={values.alt}
              disabled={disabled}
              onChange={(e) => onChange({ alt: e.target.value })}
              placeholder={GALLERY_GUIDANCE.alt.placeholder}
              className={inputClass}
            />
          </AdminFormField>
        </AdminFormSection>

        <AdminFormSection title="Details">
          <AdminFormField
            id="gal-caption"
            label="Title / caption"
            required
            helper={GALLERY_GUIDANCE.caption.helper}
            example={GALLERY_GUIDANCE.caption.placeholder}
          >
            <Textarea
              id="gal-caption"
              value={values.caption}
              disabled={disabled}
              onChange={(e) => onChange({ caption: e.target.value })}
              placeholder={GALLERY_GUIDANCE.caption.placeholder}
              className={inputClass}
              rows={2}
            />
          </AdminFormField>
          <AdminFormField
            id="gal-category"
            label="Category"
            helper={GALLERY_GUIDANCE.category.helper}
            example={GALLERY_GUIDANCE.category.placeholder}
          >
            <Input
              id="gal-category"
              value={values.category}
              disabled={disabled}
              onChange={(e) => onChange({ category: e.target.value })}
              placeholder={GALLERY_GUIDANCE.category.placeholder}
              className={inputClass}
            />
          </AdminFormField>
        </AdminFormSection>

        <AdminFormSection title="Visibility">
          <AdminGuidedCheckbox
            id="gal-featured"
            label="Featured"
            checked={values.featured}
            disabled={disabled}
            tooltip={FORM_TOOLTIPS.featured}
            onCheckedChange={(featured) => onChange({ featured })}
          />
          <AdminGuidedCheckbox
            id="gal-published"
            label="Published"
            checked={values.published}
            disabled={disabled}
            tooltip={FORM_TOOLTIPS.published}
            onCheckedChange={(published) => onChange({ published })}
          />
        </AdminFormSection>
      </div>

      <AdminLivePreviewCard title="Gallery card">
        <div className="overflow-hidden rounded-lg border border-border bg-background shadow-sm">
          {previewSrc ? (
            // eslint-disable-next-line @next/next/no-img-element -- admin preview
            <img src={previewSrc} alt="" className="aspect-[4/3] w-full object-cover" />
          ) : (
            <div className="flex aspect-[4/3] items-center justify-center bg-muted text-xs text-muted-foreground">
              No image
            </div>
          )}
          <div className="space-y-1 p-2">
            {values.category ? <AdminBadge variant="navy">{values.category}</AdminBadge> : null}
            <p className="line-clamp-2 text-xs font-semibold text-foreground">{values.caption || "Caption"}</p>
          </div>
        </div>
      </AdminLivePreviewCard>
    </div>
  );
}
