import { z } from "zod";

/**
 * Prisma entity ids — accepts standard cuid() values and legacy D1 seed ids
 * (e.g. seed-user-admin) so admin mutations do not fail on older rows.
 */
export const entityIdField = z
  .string()
  .min(1, "Id is required")
  .max(128)
  .refine((id) => z.string().cuid().safeParse(id).success || /^[a-zA-Z0-9_-]+$/.test(id), {
    message: "Invalid id",
  });

export const optionalEntityIdField = entityIdField.optional();
