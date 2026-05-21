"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, Star } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export const REVIEW_SERVICE_OPTIONS = [
  "Aircon Installation",
  "Aircon Cleaning",
  "Preventive Maintenance",
  "Repair & Diagnostics",
  "Refrigeration Services",
  "HVAC Installation",
] as const;

type FieldErrors = Partial<
  Record<"clientName" | "serviceType" | "review" | "rating" | "company" | "imageUrl", string>
>;

const SUCCESS_MESSAGE =
  "Thank you for your feedback. Your review has been submitted and is waiting for admin approval.";

type TestimonialsRatingCardProps = {
  /** Called after a successful API submission (e.g. refresh server data). */
  onSubmitted?: () => void;
};

export function TestimonialsRatingCard({ onSubmitted }: TestimonialsRatingCardProps) {
  const [rating, setRating] = React.useState(0);
  const [hoverRating, setHoverRating] = React.useState(0);
  const [clientName, setClientName] = React.useState("");
  const [company, setCompany] = React.useState("");
  const [serviceType, setServiceType] = React.useState<string>("");
  const [review, setReview] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState("");
  const [errors, setErrors] = React.useState<FieldErrors>({});
  const [success, setSuccess] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const displayStars = hoverRating || rating;

  const validate = (): boolean => {
    const next: FieldErrors = {};
    if (!clientName.trim()) next.clientName = "Please enter your name.";
    if (!serviceType) next.serviceType = "Please choose a service type.";
    if (rating < 1) next.rating = "Please select a star rating.";
    const trimmed = review.trim();
    if (!trimmed) next.review = "Please share a short review.";
    else if (trimmed.length < 8) next.review = "A few more words help other clients (min. 8 characters).";
    const co = company.trim();
    if (co.length > 200) next.company = "Company must be at most 200 characters.";
    const img = imageUrl.trim();
    if (img) {
      try {
        const u = new URL(img);
        if (u.protocol !== "http:" && u.protocol !== "https:") {
          next.imageUrl = "Please use an http or https image link.";
        }
      } catch {
        next.imageUrl = "Please enter a valid image URL.";
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: clientName.trim(),
          company: company.trim() || undefined,
          serviceType,
          rating,
          review: review.trim(),
          imageUrl: imageUrl.trim() || null,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setServerError(data.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      setSuccess(true);
      setRating(0);
      setHoverRating(0);
      setClientName("");
      setCompany("");
      setServiceType("");
      setReview("");
      setImageUrl("");
      setErrors({});
      onSubmitted?.();
      window.setTimeout(() => setSuccess(false), 8000);
    } catch {
      setServerError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-border/60 bg-card p-6 shadow-[0_18px_50px_-12px_rgba(15,23,42,0.12)] sm:p-8",
        "ring-1 ring-black/[0.03] dark:shadow-black/30 dark:ring-white/[0.06]",
      )}
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/15 blur-3xl" />

      <div className="relative">
        <h3 className="font-display text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          Rate Hope Genesis Enterprises
        </h3>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Your feedback helps us improve and helps other clients choose with confidence.
        </p>

        <form className="mt-6 space-y-5" onSubmit={(e) => void handleSubmit(e)} noValidate>
          <div>
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="review-rating" className="text-foreground">
                Your rating
              </Label>
              {errors.rating ? (
                <span className="text-xs text-destructive">{errors.rating}</span>
              ) : null}
            </div>
            <div
              id="review-rating"
              className="mt-2 flex items-center gap-1"
              role="group"
              aria-label="Star rating"
              onMouseLeave={() => setHoverRating(0)}
            >
              {Array.from({ length: 5 }).map((_, i) => {
                const value = i + 1;
                const active = displayStars >= value;
                return (
                  <button
                    key={value}
                    type="button"
                    className={cn(
                      "rounded-lg p-1.5 outline-none transition-transform duration-200 ease-out",
                      "hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    )}
                    aria-label={`${value} star${value > 1 ? "s" : ""}`}
                    aria-pressed={rating >= value}
                    onMouseEnter={() => setHoverRating(value)}
                    onClick={() => {
                      setRating(value);
                      setErrors((er) => ({ ...er, rating: undefined }));
                    }}
                  >
                    <Star
                      className={cn(
                        "h-8 w-8 transition-colors duration-200",
                        active
                          ? "fill-primary text-primary drop-shadow-[0_1px_2px_rgba(56,189,248,0.35)]"
                          : "text-muted-foreground/35 hover:text-muted-foreground/55",
                      )}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-end justify-between gap-2">
              <Label htmlFor="review-name">Name</Label>
              {errors.clientName ? (
                <span className="text-xs text-destructive">{errors.clientName}</span>
              ) : null}
            </div>
            <Input
              id="review-name"
              name="clientName"
              autoComplete="name"
              placeholder="e.g. Maria Santos"
              value={clientName}
              onChange={(e) => {
                setClientName(e.target.value);
                setErrors((er) => ({ ...er, clientName: undefined }));
              }}
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-end justify-between gap-2">
              <Label htmlFor="review-company">Company (optional)</Label>
              {errors.company ? <span className="text-xs text-destructive">{errors.company}</span> : null}
            </div>
            <Input
              id="review-company"
              name="company"
              autoComplete="organization"
              placeholder="e.g. Acme Logistics"
              value={company}
              onChange={(e) => {
                setCompany(e.target.value);
                setErrors((er) => ({ ...er, company: undefined }));
              }}
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-end justify-between gap-2">
              <Label htmlFor="review-service">Service type</Label>
              {errors.serviceType ? (
                <span className="text-xs text-destructive">{errors.serviceType}</span>
              ) : null}
            </div>
            <select
              id="review-service"
              name="serviceType"
              value={serviceType}
              onChange={(e) => {
                setServiceType(e.target.value);
                setErrors((er) => ({ ...er, serviceType: undefined }));
              }}
              className={cn(
                "flex h-11 w-full appearance-none rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-sm",
                "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                !serviceType ? "text-muted-foreground" : "text-foreground",
              )}
            >
              <option value="" disabled>
                Select a service
              </option>
              {REVIEW_SERVICE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <div className="flex items-end justify-between gap-2">
              <Label htmlFor="review-text">Short review</Label>
              {errors.review ? <span className="text-xs text-destructive">{errors.review}</span> : null}
            </div>
            <Textarea
              id="review-text"
              name="review"
              placeholder="What stood out about the service, team, or results?"
              value={review}
              onChange={(e) => {
                setReview(e.target.value);
                setErrors((er) => ({ ...er, review: undefined }));
              }}
              className="min-h-[108px] resize-y bg-background"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-end justify-between gap-2">
              <Label htmlFor="review-image-url">Image URL (optional)</Label>
              {errors.imageUrl ? <span className="text-xs text-destructive">{errors.imageUrl}</span> : null}
            </div>
            <Input
              id="review-image-url"
              name="imageUrl"
              type="url"
              inputMode="url"
              placeholder="https://…"
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value);
                setErrors((er) => ({ ...er, imageUrl: undefined }));
              }}
              className="bg-background"
            />
          </div>

          {serverError ? <p className="text-sm text-destructive">{serverError}</p> : null}

          <Button type="submit" size="lg" className="w-full rounded-2xl font-semibold shadow-md" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting…
              </>
            ) : (
              "Submit Review"
            )}
          </Button>
        </form>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="review-success"
              role="status"
              aria-live="polite"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/[0.06] px-4 py-3 text-sm text-foreground dark:bg-primary/15 dark:text-foreground"
            >
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary dark:text-accent" />
              <p className="leading-relaxed text-muted-foreground dark:text-muted-foreground/90">{SUCCESS_MESSAGE}</p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
