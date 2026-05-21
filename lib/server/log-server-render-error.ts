/**
 * Structured server-side logging for RSC / data-loader failures (visible in Node stdout / Railway logs).
 */
export function logServerRenderError(route: string, source: string, error: unknown): void {
  console.error("[SERVER_RENDER_ERROR]", {
    route,
    source,
    error,
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
  });
}
