"use client";

import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AdminFormField } from "@/components/admin/ui/admin-form-field";
import { AdminFormSection } from "@/components/admin/ui/admin-form-section";
import { FORM_TOOLTIPS, SEO_GUIDANCE, inputClass } from "@/lib/cms/form-guidance";
import { suggestMetaDescription, suggestMetaTitle } from "@/lib/cms/seo-suggestions";

type Props = {
  metaTitle: string;
  metaDescription: string;
  onMetaTitleChange: (v: string) => void;
  onMetaDescriptionChange: (v: string) => void;
  sourceTitle?: string;
  sourceDescription?: string;
  disabled?: boolean;
  titleLabel?: string;
  descriptionLabel?: string;
};

export function AdminSeoFields({
  metaTitle,
  metaDescription,
  onMetaTitleChange,
  onMetaDescriptionChange,
  sourceTitle = "",
  sourceDescription = "",
  disabled,
  titleLabel = "SEO title",
  descriptionLabel = "SEO description",
}: Props) {
  const suggestedTitle = suggestMetaTitle(sourceTitle);
  const suggestedDescription = suggestMetaDescription(sourceDescription);

  return (
    <AdminFormSection
      title="Search & sharing (SEO)"
      description="Controls how this page appears in Google and when shared on social media. Leave blank to use the main title and description."
    >
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 rounded-xl border-sky-500/30 text-xs"
          disabled={disabled || !suggestedTitle}
          onClick={() => onMetaTitleChange(suggestedTitle)}
        >
          <Sparkles className="h-3.5 w-3.5 text-sky-600" />
          Suggest title
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 rounded-xl border-sky-500/30 text-xs"
          disabled={disabled || !suggestedDescription}
          onClick={() => onMetaDescriptionChange(suggestedDescription)}
        >
          <Sparkles className="h-3.5 w-3.5 text-sky-600" />
          Suggest description
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <AdminFormField
          id="seo-title"
          label={titleLabel}
          tooltip={FORM_TOOLTIPS.seoTitle}
          helper={`${metaTitle.length}/60 characters recommended`}
          example={SEO_GUIDANCE.metaTitle.placeholder}
          className="sm:col-span-2"
        >
          <Input
            id="seo-title"
            value={metaTitle}
            disabled={disabled}
            onChange={(e) => onMetaTitleChange(e.target.value)}
            placeholder={SEO_GUIDANCE.metaTitle.placeholder}
            className={inputClass}
          />
        </AdminFormField>
        <AdminFormField
          id="seo-description"
          label={descriptionLabel}
          tooltip={FORM_TOOLTIPS.seoDescription}
          helper={`${metaDescription.length}/160 characters recommended`}
          example={SEO_GUIDANCE.metaDescription.placeholder}
          className="sm:col-span-2"
        >
          <Textarea
            id="seo-description"
            value={metaDescription}
            disabled={disabled}
            onChange={(e) => onMetaDescriptionChange(e.target.value)}
            placeholder={SEO_GUIDANCE.metaDescription.placeholder}
            className={inputClass}
            rows={3}
          />
        </AdminFormField>
      </div>
    </AdminFormSection>
  );
}
