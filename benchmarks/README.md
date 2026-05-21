# Performance benchmarks

Tooling to measure Web Vitals, Prisma query behavior, concurrent load, and client bundle composition. This does not change product behavior beyond logging and optional dev-only instrumentation.

## Benchmark process

### 1. Build production

```bash
npm run build
```

### 2. Start production

```bash
npm run start
```

### 3. Test Web Vitals manually

Open these routes in the browser (Chrome DevTools console helps):

- `/`
- `/blog`
- `/blog/<any-published-slug>` (use a real slug from the CMS or seed data)
- `/admin` after signing in (session cookie required)

In the console you should see logs prefixed with `[Web Vital]` for metrics such as **LCP**, **INP**, **CLS**, **FCP**, and **TTFB** (names depend on browser and Next.js `web-vitals` reporting).

In production builds, the same metrics are also sent to `POST /api/metrics/web-vitals` via `sendBeacon` and echoed on the server as `[WEB_VITALS]`.

### 4. Enable Prisma query logs

```bash
set PRISMA_LOG_QUERIES=true
npm run start
```

On macOS or Linux:

```bash
PRISMA_LOG_QUERIES=true npm run start
```

Watch stdout for `[PRISMA_QUERY]` entries. Pay attention to:

- Layout / resolved site queries (`getCompanySettings` timing wraps `getResolvedSite`)
- Homepage `getHomePageData` and nested fetches
- `/admin` dashboard (`getAdminDashboardData`)
- `/sitemap.xml` (`sitemap.xml` request timing + underlying Prisma calls)

The Prisma client is configured in `lib/db/prisma.ts` (also re-exported from `lib/prisma.ts`). Query logging applies to Node SQLite and to D1-backed Workers when `PRISMA_LOG_QUERIES=true` is set in that environment.

### 5. Run load tests

**k6** — install the binary from [https://k6.io](https://k6.io) (there is no supported `npm install k6` workflow for running the real engine on all platforms). Then, with the production server already running on port 3000:

```bash
npm run bench:k6:local
```

Default target for `npm run bench:k6` is `http://localhost:3000` unless you override `BASE_URL` (the `bench:k6:local` script sets it for Windows-friendly use via `cross-env`).

**Artillery**:

```bash
npm run bench:artillery
```

Ensure `config.target` in `benchmarks/artillery/public-routes.yml` matches your server if not using localhost.

### 6. Run the bundle analyzer

```bash
npm run analyze
```

Optional variants (when you need to separate reports):

```bash
npm run analyze:server
npm run analyze:browser
```

Use the report to inspect **Framer Motion**, **Radix / shadcn** chunks, **admin-only** code paths leaking into marketing routes, heavy **carousel / dialog** imports, and **icon** tree-shaking.

## Target budgets (guidance)

| Area | Target |
|------|--------|
| LCP | Under 2.5s |
| INP | Under 200ms |
| CLS | Under 0.1 |
| Public route p95 response | Under 1000ms (mirrors k6 / Artillery thresholds) |
| Prisma | Avoid duplicate work between marketing `layout` and `page` where possible |
| JS | Keep marketing routes lean; keep admin chunks isolated by route group |

## Files

| Piece | Location |
|-------|----------|
| Web Vitals client | `app/_components/web-vitals.tsx` |
| Web Vitals API | `app/api/metrics/web-vitals/route.ts` |
| Request timing helper | `lib/performance/with-request-timing.ts` |
| Prisma client | `lib/db/prisma.ts`, `lib/prisma.ts` |
| k6 script | `benchmarks/k6/public-routes.js` |
| Artillery scenario | `benchmarks/artillery/public-routes.yml` |
