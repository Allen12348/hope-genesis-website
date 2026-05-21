import { z } from "zod";
import { isHttpOrHttpsUrl } from "@/lib/validations/image-url";

export const publicTestimonialSubmissionSchema = z.object({
  clientName: z.string().trim().min(1, "Name is required").max(120),
  rating: z.coerce.number().int().min(1).max(5),
  serviceType: z.string().trim().min(1, "Service type is required").max(120),
  review: z.string().trim().min(8, "Review is required").max(2000),
  company: z
    .union([z.string(), z.null(), z.undefined()])
    .transform((v) => {
      if (v === null || v === undefined) return "";
      return String(v).trim();
    })
    .pipe(z.string().max(200)),
  imageUrl: z
    .union([z.string(), z.null(), z.undefined()])
    .transform((v) => {
      if (v === null || v === undefined) return null;
      const t = String(v).trim();
      return t === "" ? null : t;
    })
    .refine((v) => v === null || isHttpOrHttpsUrl(v), {
      message: "Image URL must be a valid http or https link",
    }),
});

export type PublicTestimonialSubmission = z.infer<typeof publicTestimonialSubmissionSchema>;
