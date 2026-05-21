import { services } from "@/data/services";

/** Service-type labels for testimonial admin (aligned with public service catalog). */
export const TESTIMONIAL_SERVICE_TYPES: readonly string[] = [
  "General",
  ...services.map((s) => s.title),
];
