# HGE Site — Architecture

Next.js 14 marketing site + admin CMS. Data flows through explicit layers so UI never talks to Prisma directly.

## Layer overview

```
┌─────────────────────────────────────────────────────────────┐
│  app/ · components/          (presentation)                 │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│  lib/actions/                (server actions: auth, Zod,     │
│                               revalidatePath)                 │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│  lib/application/            (use cases)                    │
│    queries/  · reads (marketing, admin lists, catalog)      │
│    commands/ · writes (CMS site + audit)                    │
└───────────────────────────┬─────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────────┐
│ lib/domain/   │  │ lib/cms/      │  │ lib/data/         │
│ page keys,    │  │ defaults,     │  │ repositories/     │
│ types (grow)  │  │ merge, builder│  │ thin Prisma       │
└───────────────┘  └───────────────┘  └─────────┬─────────┘
                                                  ▼
                                        ┌───────────────────┐
                                        │ lib/db/prisma     │
                                        └───────────────────┘
```

## Dependency rules

| From | May import | Must not import |
|------|------------|-----------------|
| `app/`, `components/` | `lib/application/queries`, `lib/actions`, `lib/cms` (types/defaults) | `lib/db/prisma` |
| `lib/actions/` | `lib/application/commands`, `lib/services/commands`, auth, validations | — |
| `lib/application/` | `lib/data/repositories`, `lib/services/*` (implementations), `lib/domain` | React, `app/` |
| `lib/data/repositories/` | `lib/db/prisma` | actions, components |
| `lib/domain/` | constants only | prisma, React |

## Folder map

```
lib/
├── application/           # ← preferred entry for new code
│   ├── queries/
│   │   ├── marketing.ts   # public CMS + catalog reads
│   │   ├── catalog.ts     # DB + static fallback (home bundles)
│   │   └── admin.ts       # admin entity list pages
│   └── commands/
│       └── cms-site.commands.ts
├── domain/
│   └── cms/page-keys.ts   # CMS_PAGE_KEYS, CmsPageKey
├── data/
│   ├── repositories/      # barrel export
│   ├── cms/*.repository.ts
│   └── user.repository.ts
├── services/
│   ├── marketing/         # cached read model (implementation)
│   ├── commands/          # entity CRUD + audit (legacy path, stable)
│   └── public-data.ts     # fallback policy for catalog
├── actions/               # Next.js server actions
├── cms/                   # defaults, merge, page-builder, resolved-site
└── db/prisma.ts
```

## Read paths

**Marketing layout / pages**

1. `getPublicMarketingCms()` — page JSON, footer, visibility
2. `getResolvedSite()` — company + navigation
3. `getPublicServices()` / projects / etc. — published entities

Import: `@/lib/application/queries/marketing` or `@/lib/services/marketing`.

**Homepage catalog with fallback**

`getHomePageData()` → `@/lib/application/queries/catalog` (DB first, then `mock/serialized-fallback`).

**Admin entity tables**

`getAdminProjects()`, `getAdminServices()`, … → `@/lib/application/queries/admin` → repositories.

## Write paths

**Entity CRUD** (services, projects, …)

`components/admin/*-manager` → `lib/actions/{entity}` → `lib/services/commands/{entity}.commands` → Prisma + audit.

**CMS site** (page content, footer, SEO, site settings)

`lib/actions/cms-site` → `lib/application/commands/cms-site.commands` → repositories + audit.

## Legacy compatibility

| Old import | New import |
|------------|------------|
| `@/lib/cms/queries` | `@/lib/application/queries/marketing` |
| `@/lib/services` only catalog | also exports marketing queries |
| `@/lib/cms/marketing-cms-defaults` `CMS_PAGE_KEYS` | `@/lib/domain/cms/page-keys` (re-exported) |

## Scope

This repo is a **public marketing website + admin CMS** only. Operational ERP (inventory, dispatch, billing, etc.) belongs in a separate application. Prisma models cover CMS content, company settings, and admin users — not field operations.

## Marketing cache tags

`lib/cms/cache-tags.ts` — `marketing-cms`, `resolved-site`, `home-catalog`. CMS and layout saves call `revalidateTag` so `unstable_cache` read models refresh without redeploy.

## Next refactors (optional)

1. Split `lib/cms/marketing-cms-defaults.ts` into `lib/domain/cms/types` + per-page defaults
2. Move `lib/services/commands/*` → `lib/application/commands/entities/`
3. Extract page-builder block registry from monolithic editor/renderer files
4. Run `ensure-*-seeded` in seed/migration only, not on hot read paths
