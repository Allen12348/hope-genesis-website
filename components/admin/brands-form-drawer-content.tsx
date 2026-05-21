"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AdminImageUrlField } from "@/components/admin/admin-image-url-field";
import { AdminFormField } from "@/components/admin/ui/admin-form-field";
import { AdminFormIntro } from "@/components/admin/ui/admin-form-intro";
import { AdminFormSection } from "@/components/admin/ui/admin-form-section";
import { AdminGuidedCheckbox } from "@/components/admin/ui/admin-guided-checkbox";
import { AdminSlugField } from "@/components/admin/ui/admin-slug-field";
import { BRAND_GUIDANCE, FORM_TOOLTIPS, inputClass } from "@/lib/cms/form-guidance";

export type BrandFormValues = {
  slug: string;
  name: string;
  monogram: string;
  imageUrl: string;
  imageAlt: string;
  published: boolean;
  description: string;
  category: string;
  featured: boolean;
};

type Props = {
  values: BrandFormValues;
  onChange: (patch: Partial<BrandFormValues>) => void;
  slugAuto: boolean;
  onSlugAutoChange: (auto: boolean) => void;
  disabled?: boolean;
};

export function BrandsFormDrawerContent({ values, onChange, slugAuto, onSlugAutoChange, disabled }: Props) {
  return (
    <div className="space-y-6">
      <AdminFormIntro>
        Add manufacturer or partner brands shown on the homepage trust row. Upload a logo URL or use a monogram (2–3
        letters) as a fallback.
      </AdminFormIntro>

      <AdminFormSection title="Brand details">
        <AdminSlugField
          id="brand-slug"
          slug={values.slug}
          onSlugChange={(slug) => onChange({ slug })}
          title={values.name}
          slugAuto={slugAuto}
          onSlugAutoChange={onSlugAutoChange}
          urlPrefix="/brands/"
          placeholder="daikin"
          disabled={disabled}
        />
        <AdminFormField
          id="brand-name"
          label="Brand name"
          required
          helper={BRAND_GUIDANCE.name.helper}
          example={BRAND_GUIDANCE.name.placeholder}
        >
          <Input
            id="brand-name"
            value={values.name}
            disabled={disabled}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder={BRAND_GUIDANCE.name.placeholder}
            className={inputClass}
          />
        </AdminFormField>
        <AdminFormField
          id="brand-monogram"
          label="Monogram"
          tooltip={FORM_TOOLTIPS.monogram}
          helper="Shown when no logo image is set."
          example={BRAND_GUIDANCE.monogram.placeholder}
        >
          <Input
            id="brand-monogram"
            value={values.monogram}
            disabled={disabled}
            onChange={(e) => onChange({ monogram: e.target.value.toUpperCase().slice(0, 4) })}
            placeholder={BRAND_GUIDANCE.monogram.placeholder}
            className={inputClass}
          />
        </AdminFormField>
        <AdminImageUrlField
          id="brand-logo-url"
          label="Logo image URL (optional)"
          value={values.imageUrl}
          onChange={(imageUrl) => onChange({ imageUrl })}
          mediaFolder="brands"
          altLabel="Logo alt text"
          altValue={values.imageAlt}
          onAltChange={(imageAlt) => onChange({ imageAlt })}
          disabled={disabled}
          placeholder="https://example.com/daikin-logo.png"
        />
        <AdminFormField
          id="brand-desc"
          label="Description"
          helper={BRAND_GUIDANCE.description.helper}
          example={BRAND_GUIDANCE.description.placeholder}
        >
          <Textarea
            id="brand-desc"
            value={values.description}
            disabled={disabled}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder={BRAND_GUIDANCE.description.placeholder}
            className={inputClass}
            rows={3}
          />
        </AdminFormField>
        <AdminFormField id="brand-category" label="Category" example="Air conditioning" helper="Optional grouping label.">
          <Input
            id="brand-category"
            value={values.category}
            disabled={disabled}
            onChange={(e) => onChange({ category: e.target.value })}
            placeholder="Air conditioning"
            className={inputClass}
          />
        </AdminFormField>
      </AdminFormSection>

      <AdminFormSection title="Visibility">
        <AdminGuidedCheckbox
          id="brand-featured"
          label="Featured"
          checked={values.featured}
          disabled={disabled}
          tooltip={FORM_TOOLTIPS.featured}
          onCheckedChange={(featured) => onChange({ featured })}
        />
        <AdminGuidedCheckbox
          id="brand-published"
          label="Published"
          checked={values.published}
          disabled={disabled}
          tooltip={FORM_TOOLTIPS.published}
          onCheckedChange={(published) => onChange({ published })}
        />
      </AdminFormSection>
    </div>
  );
}
