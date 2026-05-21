import type { ActionResult } from "@/lib/actions/types";

/** Wraps admin mutations so Prisma failures return ActionResult instead of throwing. */
export async function withCommandError(
  fn: () => Promise<ActionResult>,
  fallback = "Could not save changes. Please try again.",
): Promise<ActionResult> {
  try {
    return await fn();
  } catch (error) {
    console.error("[COMMAND_ERROR]", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : fallback,
    };
  }
}
