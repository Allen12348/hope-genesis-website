import { z } from "zod";

/**
 * Single-`@` check only (no Zod `.email()`): accepts `*@localhost` and internal hosts
 * that strict RFC validators reject, and avoids false negatives across Zod versions.
 */
function isLoginEmail(val: string): boolean {
  const s = val.trim();
  if (s.length < 3 || s.length > 254) return false;
  const at = s.indexOf("@");
  if (at <= 0 || at !== s.lastIndexOf("@")) return false;
  const local = s.slice(0, at);
  const domain = s.slice(at + 1);
  if (!local || !domain || local.length > 64 || domain.length > 253) return false;
  if (/[\s@]/.test(local) || /\s/.test(domain)) return false;
  return true;
}

/** Admin / credentials sign-in (client-side shape check before `signIn`). */
export const loginFormSchema = z.object({
  email: z.string().trim().min(1, "Email is required").refine(isLoginEmail, "Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

/** Public marketing contact form (wire to API / CRM later). */
export const contactInquirySchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(120),
  phone: z.string().trim().min(5, "Phone is required").max(40),
  email: z.string().trim().email("Valid email is required").max(120),
  service: z.string().trim().min(2, "Service is required").max(200),
  message: z.string().trim().min(10, "Please add a bit more detail").max(8000),
  consent: z.boolean().refine((v) => v === true, { message: "Consent is required" }),
});

export type ContactInquiryValues = z.infer<typeof contactInquirySchema>;

/** Optional future “suggest a testimonial” — admin still uses CMS schema. */
export const testimonialSuggestionSchema = z.object({
  name: z.string().trim().min(1).max(120),
  role: z.string().trim().min(1).max(120),
  company: z.string().trim().min(1).max(200),
  quote: z.string().trim().min(10).max(2000),
  rating: z.coerce.number().int().min(1).max(5),
  email: z.string().trim().email().max(120).optional().or(z.literal("")),
});

export type TestimonialSuggestionValues = z.infer<typeof testimonialSuggestionSchema>;
