"use client";

import { Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AdminImageUrlField } from "@/components/admin/admin-image-url-field";
import { AdminFormField } from "@/components/admin/ui/admin-form-field";
import { AdminFormIntro } from "@/components/admin/ui/admin-form-intro";
import { AdminFormSection } from "@/components/admin/ui/admin-form-section";
import { AdminGuidedCheckbox } from "@/components/admin/ui/admin-guided-checkbox";
import { AdminLivePreviewCard } from "@/components/admin/ui/admin-live-preview-card";
import { FORM_TOOLTIPS, TESTIMONIAL_GUIDANCE, inputClass } from "@/lib/cms/form-guidance";
import { TESTIMONIAL_SERVICE_TYPES } from "@/lib/constants/testimonial-service-types";
import { cn } from "@/lib/utils";

export type TestimonialFormValues = {
  clientName: string;
  roleTitle: string;
  company: string;
  review: string;
  rating: number;
  imageUrl: string;
  serviceType: string;
  approved: boolean;
  featured: boolean;
  rejected: boolean;
};

type Props = {
  values: TestimonialFormValues;
  onChange: (patch: Partial<TestimonialFormValues>) => void;
  disabled?: boolean;
};

export function TestimonialsFormDrawerContent({ values, onChange, disabled }: Props) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_240px]">
      <div className="space-y-6">
        <AdminFormIntro>
          Approved reviews appear on the public site. Use real customer quotes — approve only after verifying the
          submission.
        </AdminFormIntro>

        <AdminFormSection title="Client">
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminFormField
              id="tm-client"
              label="Client name"
              required
              example={TESTIMONIAL_GUIDANCE.clientName.placeholder}
            >
              <Input
                id="tm-client"
                value={values.clientName}
                disabled={disabled}
                onChange={(e) => onChange({ clientName: e.target.value })}
                placeholder={TESTIMONIAL_GUIDANCE.clientName.placeholder}
                className={inputClass}
              />
            </AdminFormField>
            <AdminFormField id="tm-company" label="Company (optional)" example={TESTIMONIAL_GUIDANCE.company.placeholder}>
              <Input
                id="tm-company"
                value={values.company}
                disabled={disabled}
                onChange={(e) => onChange({ company: e.target.value })}
                placeholder={TESTIMONIAL_GUIDANCE.company.placeholder}
                className={inputClass}
              />
            </AdminFormField>
          </div>
          <AdminFormField id="tm-role" label="Role / title" example={TESTIMONIAL_GUIDANCE.role.placeholder}>
            <Input
              id="tm-role"
              value={values.roleTitle}
              disabled={disabled}
              onChange={(e) => onChange({ roleTitle: e.target.value })}
              placeholder={TESTIMONIAL_GUIDANCE.role.placeholder}
              className={inputClass}
            />
          </AdminFormField>
          <AdminFormField id="tm-service" label="Service type" helper="Which service this review relates to.">
            <select
              id="tm-service"
              value={values.serviceType}
              disabled={disabled}
              onChange={(e) => onChange({ serviceType: e.target.value })}
              className={`h-11 w-full px-3 text-sm font-medium ${inputClass}`}
            >
              {TESTIMONIAL_SERVICE_TYPES.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </AdminFormField>
        </AdminFormSection>

        <AdminFormSection title="Review">
          <AdminFormField id="tm-rating" label="Rating" helper="Click a star to set 1–5.">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  disabled={disabled}
                  onClick={() => onChange({ rating: n })}
                  className="rounded-lg p-1 transition-opacity hover:opacity-90 disabled:pointer-events-none"
                  aria-label={`${n} stars`}
                >
                  <Star
                    className={cn(
                      "h-8 w-8",
                      n <= values.rating
                        ? "fill-[hsl(var(--brand-gold))] text-[hsl(var(--brand-gold))]"
                        : "text-muted-foreground/35",
                    )}
                  />
                </button>
              ))}
            </div>
          </AdminFormField>
          <AdminFormField
            id="tm-review"
            label="Review"
            required
            helper={TESTIMONIAL_GUIDANCE.review.helper}
            example={TESTIMONIAL_GUIDANCE.review.placeholder}
          >
            <Textarea
              id="tm-review"
              value={values.review}
              disabled={disabled}
              onChange={(e) => onChange({ review: e.target.value })}
              placeholder={TESTIMONIAL_GUIDANCE.review.placeholder}
              className={inputClass}
              rows={4}
            />
          </AdminFormField>
          <AdminImageUrlField
            id="testimonial-image-url"
            label="Client photo URL (optional)"
            value={values.imageUrl}
            onChange={(imageUrl) => onChange({ imageUrl })}
            disabled={disabled}
            mediaFolder="testimonials"
            placeholder="https://example.com/client-photo.jpg"
          />
        </AdminFormSection>

        <AdminFormSection title="Visibility">
          <AdminGuidedCheckbox
            id="tm-approved"
            label="Approved (visible on public site)"
            checked={values.approved}
            disabled={disabled}
            tooltip={FORM_TOOLTIPS.published}
            onCheckedChange={(approved) => onChange({ approved, rejected: approved ? false : values.rejected })}
          />
          <AdminGuidedCheckbox
            id="tm-featured"
            label="Featured"
            checked={values.featured}
            disabled={disabled}
            tooltip={FORM_TOOLTIPS.featured}
            onCheckedChange={(featured) => onChange({ featured })}
          />
          <AdminGuidedCheckbox
            id="tm-rejected"
            label="Rejected (hidden)"
            checked={values.rejected}
            disabled={disabled}
            helper="Rejected reviews never appear on the site."
            onCheckedChange={(rejected) => onChange({ rejected, approved: rejected ? false : values.approved })}
          />
        </AdminFormSection>
      </div>

      <AdminLivePreviewCard>
        <blockquote className="rounded-lg border border-border bg-background p-3 text-sm shadow-sm">
          <div className="mb-2 flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-3.5 w-3.5",
                  i < values.rating ? "fill-[hsl(var(--brand-gold))] text-[hsl(var(--brand-gold))]" : "text-muted-foreground/40",
                )}
              />
            ))}
          </div>
          <p className="line-clamp-4 text-foreground">“{values.review || "Review text…"}”</p>
          <footer className="mt-2 text-xs text-muted-foreground">
            — {values.clientName || "Client"}
            {values.company.trim() ? `, ${values.company}` : ""}
          </footer>
        </blockquote>
      </AdminLivePreviewCard>
    </div>
  );
}
