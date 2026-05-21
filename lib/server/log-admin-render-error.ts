/**
 * Structured logging for admin RSC / data-loader failures.
 */
export function logAdminRenderError(source: string, error: unknown): void {
  console.error("[ADMIN_RENDER_ERROR]", {
    source,
    error,
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
  });
}
