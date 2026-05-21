# Hope Genesis Enterprises — website

Next.js 14 marketing site and admin CMS for Hope Genesis Enterprises.

- **Local (Node):** `npm run dev` + SQLite via `DATABASE_URL` and Prisma Migrate (`db:migrate:dev`, `db:seed`).
- **Production (Railway / VPS):** PostgreSQL via `DATABASE_URL` — `npm run build`, `npm run db:deploy:production`, `npm run start` ([docs/DATABASE.md](docs/DATABASE.md)).

## Prerequisites

- Node.js 20+ recommended
- npm

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

## Production (Railway, VPS, Docker)

Set `DATABASE_URL` to PostgreSQL (see `.env.production.example`). **On the production host** (not local SQLite):

```bash
npm run build
npm run db:check:production  # from laptop: validates .env.production first
npm run db:deploy:production   # migrate deploy + baseline seed
npm run start
```

### Railway environment variables

| Variable | Example |
|----------|---------|
| `DATABASE_URL` | `postgresql://…` from Railway Postgres |
| `NEXTAUTH_SECRET` | Random 32+ char secret |
| `NEXTAUTH_URL` | `https://your-domain.com` |
| `NEXT_PUBLIC_SITE_URL` | Same origin, no trailing slash |

**Build command:** `npm run build`  
**Start command:** `npm run start`

See [docs/DATABASE.md](docs/DATABASE.md) for migration layout and env separation.

Local production-style preview on port 3000:

```bash
npm run preview
```

## Production metadata

- **Title, description, Open Graph, favicon:** `lib/metadata-config.ts`, `constants/site.ts`, `seo/`, and `app/layout.tsx`.
- **`/robots.txt`:** `app/robots.ts`
- **`/sitemap.xml`:** `app/sitemap.ts`
- **Static favicon:** `public/favicon.svg`

## Deployment checklist (GitHub → Railway)

- Connect repo; set env vars above
- `npm run build` in CI or Railway build step
- Run `npm run db:deploy:production` once after Postgres is provisioned (or as a release command)
- `npm run start` as the web process
- Point custom domain at Railway

## Learn more

- [Next.js documentation](https://nextjs.org/docs)
- [Prisma + PostgreSQL](https://www.prisma.io/docs/orm/overview/databases/postgresql)
