"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AdminFallbackImageField } from "@/components/admin/admin-fallback-image-field";
import { AdminImageUrlField } from "@/components/admin/admin-image-url-field";
import { AdminFormField } from "@/components/admin/ui/admin-form-field";
import { AdminFormIntro } from "@/components/admin/ui/admin-form-intro";
import { AdminFormSection } from "@/components/admin/ui/admin-form-section";
import { AdminGuidedCheckbox } from "@/components/admin/ui/admin-guided-checkbox";
import { AdminSeoFields } from "@/components/admin/ui/admin-seo-fields";
import { AdminSlugField } from "@/components/admin/ui/admin-slug-field";
import { FORM_TOOLTIPS, SERVICE_GUIDANCE, inputClass } from "@/lib/cms/form-guidance";

const ICON_KEYS = [
  "snowflake",
  "sparkles",
  "fan",
  "shieldcheck",
  "wrench",
  "refrigerator",
  "factory",
  "home",
  "building2",
] as const;

export type ServiceFormValues = {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  iconKey: string;
  highlights: string;
  idealFor: string;
  heroImage: string;
  imageUrl: string;
  heroImageAlt: string;
  published: boolean;
  category: string;
  faqJson: string;
  pricingNote: string;
  seoTitle: string;
  seoDescription: string;
};

type Props = {
  values: ServiceFormValues;
  onChange: (patch: Partial<ServiceFormValues>) => void;
  slugAuto: boolean;
  onSlugAutoChange: (auto: boolean) => void;
  disabled?: boolean;
};

export function ServicesFormDrawerContent({ values, onChange, slugAuto, onSlugAutoChange, disabled }: Props) {
  return (
    <div className="space-y-6">
      <AdminFormIntro>
        Describe what you offer in plain language. Add bullet highlights — one per line. The slug auto-fills from the
        title unless you edit it manually.
      </AdminFormIntro>

      <AdminFormSection title="Service basics" description="Shown on the public services page.">
        <AdminSlugField
          id="svc-slug"
          slug={values.slug}
          onSlugChange={(slug) => onChange({ slug })}
          title={values.title}
          slugAuto={slugAuto}
          onSlugAutoChange={onSlugAutoChange}
          urlPrefix="/services/"
          placeholder="aircon-cleaning"
          disabled={disabled}
        />
        <AdminFormField
          id="svc-title"
          label="Title"
          required
          helper={SERVICE_GUIDANCE.title.helper}
          example={SERVICE_GUIDANCE.title.placeholder}
        >
          <Input
            id="svc-title"
            value={values.title}
            disabled={disabled}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder={SERVICE_GUIDANCE.title.placeholder}
            className={inputClass}
          />
        </AdminFormField>
        <AdminFormField
          id="svc-short"
          label="Short description"
          required
          helper={SERVICE_GUIDANCE.shortDescription.helper}
          example={SERVICE_GUIDANCE.shortDescription.placeholder}
        >
          <Textarea
            id="svc-short"
            value={values.shortDescription}
            disabled={disabled}
            onChange={(e) => onChange({ shortDescription: e.target.value })}
            placeholder={SERVICE_GUIDANCE.shortDescription.placeholder}
            className={inputClass}
            rows={2}
          />
        </AdminFormField>
        <AdminFormField id="svc-desc" label="Full description" helper="Longer copy for the service detail page.">
          <Textarea
            id="svc-desc"
            value={values.description}
            disabled={disabled}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="Explain the process, what's included, and why customers choose you…"
            className={inputClass}
            rows={4}
          />
        </AdminFormField>
        <AdminFormField id="svc-icon" label="Icon" helper="Visual icon on service cards.">
          <select
            id="svc-icon"
            className={`h-11 w-full px-3 text-sm font-medium ${inputClass}`}
            value={values.iconKey}
            disabled={disabled}
            onChange={(e) => onChange({ iconKey: e.target.value })}
          >
            {ICON_KEYS.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </AdminFormField>
        <AdminFormField id="svc-category" label="Category" example="General" helper="Groups services on the listing page.">
          <Input
            id="svc-category"
            value={values.category}
            disabled={disabled}
            onChange={(e) => onChange({ category: e.target.value })}
            placeholder="General"
            className={inputClass}
          />
        </AdminFormField>
      </AdminFormSection>

      <AdminFormSection title="Highlights & audience">
        <AdminFormField
          id="svc-highlights"
          label="Features / highlights"
          helper={SERVICE_GUIDANCE.highlights.helper}
          example="One bullet per line"
        >
          <Textarea
            id="svc-highlights"
            value={values.highlights}
            disabled={disabled}
            onChange={(e) => onChange({ highlights: e.target.value })}
            placeholder={SERVICE_GUIDANCE.highlights.placeholder}
            className={inputClass}
            rows={4}
          />
        </AdminFormField>
        <AdminFormField id="svc-ideal" label="Ideal for" helper={SERVICE_GUIDANCE.idealFor.helper}>
          <Textarea
            id="svc-ideal"
            value={values.idealFor}
            disabled={disabled}
            onChange={(e) => onChange({ idealFor: e.target.value })}
            placeholder={SERVICE_GUIDANCE.idealFor.placeholder}
            className={inputClass}
            rows={3}
          />
        </AdminFormField>
      </AdminFormSection>

      <AdminFormSection title="Hero image">
        <AdminFallbackImageField
          id="svc-hero-fallback"
          label="Fallback hero image"
          value={values.heroImage}
          onChange={(heroImage) => onChange({ heroImage })}
          disabled={disabled}
        />
        <AdminImageUrlField
          id="svc-hero-remote"
          label="Remote hero image URL (optional)"
          value={values.imageUrl}
          onChange={(imageUrl) => onChange({ imageUrl })}
          disabled={disabled}
          mediaFolder="gallery"
          placeholder="https://example.com/service-hero.jpg"
        />
        <AdminFormField id="svc-hero-alt" label="Hero alt text" tooltip={FORM_TOOLTIPS.altText}>
          <Input
            id="svc-hero-alt"
            value={values.heroImageAlt}
            disabled={disabled}
            onChange={(e) => onChange({ heroImageAlt: e.target.value })}
            placeholder="Technician servicing a split-type air conditioner"
            className={inputClass}
          />
        </AdminFormField>
      </AdminFormSection>

      <AdminFormSection title="FAQ & pricing">
        <AdminFormField
          id="svc-faq"
          label="FAQ (JSON)"
          tooltip={FORM_TOOLTIPS.faqJson}
          helper='Array of {"q":"Question","a":"Answer"} objects.'
          example='[{"q":"How long?","a":"About 2 hours."}]'
        >
          <Textarea
            id="svc-faq"
            value={values.faqJson}
            disabled={disabled}
            onChange={(e) => onChange({ faqJson: e.target.value })}
            className={`font-mono text-xs ${inputClass}`}
            rows={6}
            spellCheck={false}
          />
        </AdminFormField>
        <AdminFormField id="svc-pricing" label="Pricing note" helper="Optional note about pricing (e.g. starts at ₱X)." example="Starting at ₱1,500 for standard units">
          <Textarea
            id="svc-pricing"
            value={values.pricingNote}
            disabled={disabled}
            onChange={(e) => onChange({ pricingNote: e.target.value })}
            className={inputClass}
            rows={2}
          />
        </AdminFormField>
      </AdminFormSection>

      <AdminSeoFields
        metaTitle={values.seoTitle}
        metaDescription={values.seoDescription}
        onMetaTitleChange={(seoTitle) => onChange({ seoTitle })}
        onMetaDescriptionChange={(seoDescription) => onChange({ seoDescription })}
        sourceTitle={values.title}
        sourceDescription={values.shortDescription}
        disabled={disabled}
      />

      <AdminFormSection title="Visibility">
        <AdminGuidedCheckbox
          id="svc-published"
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
