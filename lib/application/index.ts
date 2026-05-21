/**
 * Application layer — use cases that orchestrate domain + data.
 *
 * - `queries/` — read models (marketing site, admin lists, catalog fallbacks)
 * - `commands/` — write models (mutations + audit)
 *
 * UI (`app/`, `components/`) should depend on this layer, not Prisma.
 */
export * as queries from "./queries";
export * as commands from "./commands";
