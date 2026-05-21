/** Generate a unique id for entities and storage keys. */
export function createId(): string {
  return crypto.randomUUID();
}
