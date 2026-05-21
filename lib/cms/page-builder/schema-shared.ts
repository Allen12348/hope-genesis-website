import { z } from "zod";

export const flexibleMediaUrlSchema = z
  .string()
  .max(2000)
  .optional()
  .default("")
  .refine(
    (s) => {
      const t = s.trim();
      if (!t) return true;
      if (t.startsWith("/")) return true;
      try {
        const u = new URL(t);
        return u.protocol === "http:" || u.protocol === "https:";
      } catch {
        return false;
      }
    },
    { message: "Use https URL, site path starting with /, or leave empty" },
  );

export const hrefSchema = z.string().max(2000).default("#");

export const buttonSchema = z.object({
  label: z.string().min(1).max(120),
  href: hrefSchema,
  variant: z.enum(["accent", "outline", "ghost"]).optional().default("accent"),
});
