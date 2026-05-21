"use client";

import * as React from "react";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { useMarketingSite } from "@/components/providers/marketing-site-provider";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { contactInquirySchema } from "@/validators/forms";

type FieldErrors = Partial<Record<"name" | "phone" | "email" | "service" | "message" | "consent", string>>;

/**
 * Client-side inquiry form — validated with Zod; wire to email API / CRM when ready.
 */
export function ContactForm() {
  const { site } = useMarketingSite();
  const [status, setStatus] = React.useState<"idle" | "submitting" | "success">("idle");
  const [fieldErrors, setFieldErrors] = React.useState<FieldErrors>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFieldErrors({});
    const form = e.currentTarget;
    const fd = new FormData(form);
    const consentChecked = fd.get("consent") === "on";
    const raw = {
      name: String(fd.get("name") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      email: String(fd.get("email") ?? ""),
      service: String(fd.get("service") ?? ""),
      message: String(fd.get("message") ?? ""),
      consent: consentChecked,
    };

    const parsed = contactInquirySchema.safeParse(raw);
    if (!parsed.success) {
      const next: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (
          key === "name" ||
          key === "phone" ||
          key === "email" ||
          key === "service" ||
          key === "message" ||
          key === "consent"
        ) {
          if (!next[key]) next[key] = issue.message;
        }
      }
      setFieldErrors(next);
      toast.error("Please fix the highlighted fields.");
      return;
    }

    setStatus("submitting");
    try {
      await new Promise((r) => window.setTimeout(r, 900));
      toast.success("Inquiry received — we will contact you shortly.");
      form.reset();
      setStatus("success");
    } catch {
      toast.error("Something went wrong. Please call us or try again.");
      setStatus("idle");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-3xl border border-border/70 bg-muted/20 p-8 text-sm leading-relaxed text-muted-foreground">
        <div className="font-display text-lg font-semibold text-foreground">Thank you — your inquiry is received.</div>
        <p className="mt-3">
          For fastest scheduling, call{" "}
          <a className="font-semibold text-foreground" href={site.phoneTel}>
            {site.phoneDisplay}
          </a>{" "}
          or message us on WhatsApp.
        </p>
        <Button type="button" className="mt-5 rounded-2xl" onClick={() => setStatus("idle")}>
          Send another message
        </Button>
      </div>
    );
  }

  const disabled = status === "submitting";

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" name="name" autoComplete="name" required disabled={disabled} aria-invalid={!!fieldErrors.name} />
          {fieldErrors.name ? <p className="text-xs text-destructive">{fieldErrors.name}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            inputMode="tel"
            autoComplete="tel"
            required
            disabled={disabled}
            aria-invalid={!!fieldErrors.phone}
          />
          {fieldErrors.phone ? <p className="text-xs text-destructive">{fieldErrors.phone}</p> : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required disabled={disabled} aria-invalid={!!fieldErrors.email} />
        {fieldErrors.email ? <p className="text-xs text-destructive">{fieldErrors.email}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="service">Service needed</Label>
        <Input
          id="service"
          name="service"
          placeholder="e.g., VRF maintenance, cold room install, residential split-type"
          required
          disabled={disabled}
          aria-invalid={!!fieldErrors.service}
        />
        {fieldErrors.service ? <p className="text-xs text-destructive">{fieldErrors.service}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Project details</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Tell us about your space, timeline, and any constraints."
          required
          disabled={disabled}
          aria-invalid={!!fieldErrors.message}
        />
        {fieldErrors.message ? <p className="text-xs text-destructive">{fieldErrors.message}</p> : null}
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-border/70 bg-muted/15 p-4">
        <Checkbox id="consent" name="consent" required disabled={disabled} aria-invalid={!!fieldErrors.consent} />
        <Label htmlFor="consent" className="text-sm leading-relaxed text-muted-foreground">
          I agree to be contacted by {site.name} regarding this inquiry.
        </Label>
      </div>
      {fieldErrors.consent ? <p className="text-xs text-destructive">{fieldErrors.consent}</p> : null}

      <Button type="submit" variant="default" className="w-full rounded-2xl sm:w-auto" disabled={disabled}>
        {disabled ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Submit inquiry
          </>
        )}
      </Button>
    </form>
  );
}
