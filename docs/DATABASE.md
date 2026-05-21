# Database & migrations

This repo supports **two** database targets:

| Target | Schema sync | Seed |
|--------|-------------|------|
| **Local Node (SQLite)** | `npm run db:migrate:dev` or `npm run db:push` | `npm run db:seed` (dev reset) / `npm run db:seed:baseline` |
| **Railway / VPS (PostgreSQL)** | `npm run db:migrate:deploy` | Run **inside production** — see below |

Prisma Migrate history lives in:

- `prisma/migrations/` — **SQLite** (local development)
- `deploy/prisma/migrations/` — **PostgreSQL** (Railway / Node production)

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
2. **On the production server / Railway shell** (recommended), or from your laptop with `.env.production`:

   ```bash
   # Laptop only: copy Railway Postgres URL into .env.production first
   copy .env.production.example .env.production
   # Paste DATABASE_URL from Railway → Postgres → Connect (not HOST/USER placeholders)

   npm run db:check:production   # fails fast if URL is missing or still a template
   npm run db:migrate:sync-postgres-schema
   npm run db:migrate:deploy
   npm run db:seed:production
   ```

   `db:migrate:deploy` does **not** read `.env` (SQLite). If you see P1012 “URL must start with postgresql://”, you’re still pointing at `file:./dev.db` — use `.env.production` or Railway’s shell.

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

