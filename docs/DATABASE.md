# Database & migrations

This repo supports **three** database targets:

| Target | Schema sync | Seed |
|--------|-------------|------|
| **Local Node (SQLite)** | `npm run db:migrate:dev` or `npm run db:push` | `npm run db:seed` (dev reset) / `npm run db:seed:baseline` |
| **Railway / VPS (PostgreSQL)** | `npm run db:migrate:deploy` | Run **inside production** — see below |
| **Cloudflare D1** | `npm run db:migrate:d1:remote` | `npm run db:seed:d1:remote` |

Prisma Migrate history lives in:

- `prisma/migrations/` — **SQLite** (local development)
- `deploy/prisma/migrations/` — **PostgreSQL** (Railway / Node production)

The repo-root `migrations/` folder is **Wrangler D1 SQL**, not Prisma Migrate.

---

## Local development (SQLite)

1. Copy `.env.example` → `.env` with `DATABASE_URL=file:./dev.db`
2. Apply migrations (creates/updates `prisma/dev.db`):

   ```bash
   npm run db:migrate:dev
   ```

   Or quick sync without migration history: `npm run db:push`

3. Seed (destructive — wipes content tables):

   ```bash
   npm run db:seed
   ```

   Safe upsert (keeps existing rows): `npm run db:seed:baseline`

**Do not** run `npx prisma migrate deploy` against local SQLite after the initial baseline — use `db:migrate:dev` for schema changes.

---

## Production (Railway / PostgreSQL)

1. Set `DATABASE_URL` to your Railway Postgres URL in the hosting dashboard (see `.env.production.example`).
2. **On the production server / Railway deploy hook** (not your laptop’s SQLite `.env`):

   ```bash
   npm run db:migrate:sync-postgres-schema   # keep deploy/prisma/schema.prisma in sync
   npm run db:migrate:deploy                 # applies deploy/prisma/migrations
   npm run db:seed:baseline                  # first deploy — safe upsert
   ```

   Or one command:

   ```bash
   npm run db:deploy:production
   ```

3. `npm run db:seed` **without** `SEED_MODE=upsert` deletes and recreates data — use only on an empty dev database, not on live production.

**Important:** Local `npm run db:seed` only affects `DATABASE_URL` in your local `.env`. It does **not** seed Railway.

---

## After changing `prisma/schema.prisma`

1. **Local SQLite:** `npm run db:migrate:dev -- --name describe_change`
2. **Postgres deploy copy:** `npm run db:migrate:sync-postgres-schema`
3. **New Postgres migration** (when models changed):

   ```bash
   npx prisma migrate diff --from-migrations deploy/prisma/migrations --to-schema-datamodel deploy/prisma/schema.prisma --script -o deploy/prisma/migrations/<timestamp>_change/migration.sql
   ```

   Or with a live Postgres URL: `npx prisma migrate dev --config prisma.config.postgres.ts --name describe_change`

4. Commit `prisma/migrations`, `deploy/prisma/migrations`, and `deploy/prisma/schema.prisma`.

---

## Cloudflare D1

Unchanged: use `npm run db:migrate:d1:remote` and D1 seed scripts. Do not run Prisma Migrate deploy against D1.
