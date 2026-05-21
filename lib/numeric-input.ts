/**
 * Shared helpers for positive measurement-style numeric fields (decimals allowed).
 */

/** Keeps digits and at most one decimal point; excludes negatives and symbols. */
export function sanitizePositiveDecimalInput(raw: string): string {
  return raw.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
}

export function isValidPositiveDecimalInput(value: string): boolean {
  const n = parseFloat(value);
  return !Number.isNaN(n) && n > 0;
}

/** Parsed value for calculations; incomplete or invalid input becomes 0. */
export function parsePositiveMeasurement(value: string): number {
  const n = parseFloat(value);
  return !Number.isNaN(n) && n > 0 ? n : 0;
}
