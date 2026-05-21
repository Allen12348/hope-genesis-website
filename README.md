# Hope Genesis Enterprises — website

Next.js 14 marketing site and admin CMS for Hope Genesis Enterprises.

- **Local (Node):** `npm run dev` + SQLite via `DATABASE_URL` and Prisma Migrate (`db:migrate:dev`, `db:seed`).
- **Production (Railway / VPS):** PostgreSQL via `DATABASE_URL` — `npm run db:migrate:deploy` + seed in production only ([docs/DATABASE.md](docs/DATABASE.md)).
- **Production (Cloudflare):** **OpenNext** on **Workers** with **D1** for the database (same Prisma schema; runtime uses `@prisma/adapter-d1`).

## Prerequisites

- Node.js 20+ recommended
- npm
- For Cloudflare: a Cloudflare account and [Wrangler](https://developers.cloudflare.com/workers/wrangler/) (installed with this repo)

This repo uses **Next.js 14.2.35** and **React 18.2.0**.

## Local development (SQLite)

1. Copy environment files:

   ```bash
   cp .env.example .env
   ```

   Set `DATABASE_URL` (e.g. `file:./dev.db` — resolves to `prisma/dev.db`), **`NEXTAUTH_SECRET`**, and **`NEXTAUTH_URL`** (e.g. `http://localhost:3000`).

2. Install and prepare the database:

   ```bash
   npm install
   npm run db:migrate:dev
   npm run db:seed:baseline
   ```

   Quick alternative without migration history: `npm run db:setup` (`db:push` + full seed).

3. Start the app:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

If you see missing-manifest or webpack cache errors after upgrades, delete `.next` and `node_modules/.cache`, then run `npm run dev` again.

## Cloudflare Workers + D1

### One-time: create the D1 database

```bash
npx wrangler d1 create hope-genesis-website
```

Paste the returned **`database_id`** into `wrangler.toml` (replace `REPLACE_ME`). The `database_name` must stay **`hope-genesis-website`** to match the npm scripts.

### Apply schema to D1

Migrations are in `migrations/` (initial SQL generated from `prisma/schema.prisma`).

```bash
npm run db:migrate:d1          # local D1 (used by wrangler dev)
npm run db:migrate:d1:remote   # production D1
```

### Environment on Cloudflare

In the Worker **Settings → Variables**, set at least:

- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` (e.g. `https://your-domain.com`)
- `NEXT_PUBLIC_SITE_URL` (same origin, no trailing slash)

Use **Secrets** for `NEXTAUTH_SECRET`. Prisma on Workers uses the **`DB`** binding from `wrangler.toml` (no `DATABASE_URL` there).

### Preview (Workers runtime locally)

```bash
cp .dev.vars.example .dev.vars
# Edit .dev.vars for your preview origin (often http://localhost:8787).

npm run preview
```

### Deploy

```bash
npm run deploy
```

Point **DNS** at Cloudflare and attach your **custom domain** to this worker (or use Workers & Pages as documented by Cloudflare).

### Seeding D1

`npm run db:seed` runs against **local `DATABASE_URL` (SQLite)**. For D1, either migrate data from SQLite (export/import), re-enter content via **Admin**, or run custom SQL with `wrangler d1 execute` after your first deploy.

**First-time admin on production D1:** after `db:migrate:d1:remote`, create the dev users on the remote database (same credentials as `prisma/seed.ts`):

```bash
npm run db:seed:d1:remote
```

Then sign in as `admin@localhost` / `ChangeMe_Admin123!` and change the password. Do **not** use this script on a database that already has real users unless you intend to add the seed rows only where missing (`INSERT OR IGNORE` in `scripts/d1-seed-dev-users.sql`).

## Node-only production (Railway, VPS, Docker)

Set `DATABASE_URL` to PostgreSQL (see `.env.production.example`). **On the production host** (not local SQLite):

```bash
npm run build:node
npm run db:deploy:production   # migrate deploy + baseline seed
npm run start
```

See [docs/DATABASE.md](docs/DATABASE.md) for migration layout and env separation.

Local production-style preview on port 3000:

```bash
npm run preview:node
```

## Production metadata

- **Title, description, Open Graph, favicon:** `lib/metadata-config.ts`, `constants/site.ts`, `seo/`, and `app/layout.tsx`.
- **`/robots.txt`:** `app/robots.ts`
- **`/sitemap.xml`:** `app/sitemap.ts`
- **Static favicon:** `public/favicon.svg`

## Deployment checklist (GitHub → Cloudflare)

- `npm install`
- Put real `database_id` in `wrangler.toml`
- `npm run db:migrate:d1:remote` (after first deploy or schema change)
- Set Worker secrets/vars in the Cloudflare dashboard
- `npm run deploy` (or connect GitHub and use the same build command in CI)
- Attach custom domain and fix DNS (nameservers / records)

## Learn more

- [Next.js documentation](https://nextjs.org/docs)
- [OpenNext Cloudflare](https://opennext.js.org/cloudflare)
- [Prisma + D1](https://www.prisma.io/docs/orm/overview/databases/cloudflare-d1)
