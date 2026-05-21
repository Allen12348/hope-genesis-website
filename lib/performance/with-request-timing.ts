export async function withRequestTiming<T>(
  label: string,
  fn: () => Promise<T>,
): Promise<T> {
  const start = performance.now();

  try {
    return await fn();
  } finally {
    const duration = Math.round(performance.now() - start);

    console.log("[REQUEST_TIMING]", {
      label,
      durationMs: duration,
      timestamp: new Date().toISOString(),
    });
  }
}
