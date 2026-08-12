# BossBaby Community

BossBaby website plus public community participation. Only **Bossbabes → It's Your Call, Babe** (`/you-pick`) uses Supabase. Other destinations remain static or keep page-local React state.

## Architecture

```text
frontend/                         Vite + React website
  src/app/                        app shell and route configuration
  src/pages/                      route-level static pages
  src/features/you-pick/          API, hooks, models, and UI for You Pick
  src/shared/                     shared components, services, and UI primitives
backend/supabase/                 Supabase CLI project
  migrations/                     reviewed production schema changes
  seed.sql                        deterministic local-only data
  functions/you-pick/             grouped Edge Function
  functions/_shared/              auth, CORS, errors, and response helpers
  tests/                          Deno unit and local-stack integration tests
```

You Pick browser code uses Supabase JS only for persistent anonymous Auth. All suggestions and vote behavior crosses one Edge Function boundary:

```text
GET    /functions/v1/you-pick/suggestions
POST   /functions/v1/you-pick/suggestions
DELETE /functions/v1/you-pick/suggestions/:id
GET    /functions/v1/you-pick/vote-results
PUT    /functions/v1/you-pick/vote
```

Public reads need no identity. A valid optional participant token adds `canDelete` or `participantHasVoted`. Writes require a verified anonymous participant token. Responses never expose participant IDs or raw vote rows.

## Prerequisites

- Node 24 LTS (`.nvmrc`)
- npm 11+
- Docker-compatible runtime for local Supabase
- Playwright Chromium for browser tests (`npx playwright install chromium`)

Deno 2.2 LTS and Supabase CLI are pinned root dev dependencies; no global install required.

## Setup

```bash
nvm use
npm install
cp frontend/.env.example frontend/.env.local
npm run dev:backend
npx supabase --workdir backend status
```

Copy local `API URL` and anonymous/publishable key from status into `frontend/.env.local`. Never put service-role, secret, or database credentials in any `VITE_*` variable.

Configure local Edge Function browser origins only when overriding default `http://localhost:3000`:

```bash
cp backend/supabase/.env.example backend/supabase/.env
```

Then run frontend:

```bash
npm run dev:frontend
```

Open <http://localhost:3000>. Static pages still render when Supabase is stopped; You Pick shows inline retry/error states and never switches to browser storage.

## Commands

```bash
npm run dev:backend      # starts local Postgres/Auth/API/Edge stack
npm run dev:frontend     # starts Vite on port 3000
npm run dev              # starts backend, then frontend
npm run stop:backend
npm run db:reset         # local database only; applies migrations + seed
npm test                 # frontend, Deno unit, and local integration tests
npm run test:e2e         # resets local stack, runs Playwright workflow
npm run check            # lint + typecheck + tests + production build
npm run build
```

Integration/E2E launch and stop local Supabase when needed, refuse non-local API URLs, and reset local data before running. `seed.sql` is invoked only by local reset; production release never passes a seed flag.

## Environment

Browser-safe variables in `frontend/.env.local`:

```dotenv
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=local_publishable_or_anon_key
```

Edge runtime variable:

```dotenv
ALLOWED_ORIGINS=http://localhost:3000,https://production.example.com
```

Supabase injects its URL and server keys into Edge Functions. Production browser origins must be verified before release.

## Tests

- Vitest + React Testing Library: validation, percentage rounding, API mapping, hooks, mutations, pagination, and Show more behavior.
- Deno: Edge validation, cursor mapping, safe normalization, lint, format, and type-check.
- Local Supabase integration: public/optional/protected auth, ownership isolation, vote replacement, aggregates, DB limits, cursor exhaustion, and direct-access lockdown.
- Playwright: anonymous vote/refresh/change, suggestion create/delete, 8-row pagination, and backend failure UI.

Tests may mutate or reset only a local URL (`127.0.0.1` or `localhost`).

## Git and release

Expected flow:

```text
feature PR → dev (squash, one approval) → full promotion CI
→ automated exact-dev PR → main (merge commit) → production release
```

- `feature-ci.yml`: PRs to `dev`; local Supabase, lint, type-check, unit/integration tests, build.
- `promotion.yml`: push to `dev`; full suite plus Playwright, then create/update `dev` → `main` PR and enable merge-commit auto-merge.
- `promotion-source.yml`: rejects promotion when source is not exact current `dev` head.
- `release.yml`: `main` only; migrations first, grouped Edge Function second, Vercel frontend third. Any earlier failure stops later deployment.

Required protected `production` environment secrets:

- `SUPABASE_ACCESS_TOKEN`
- `SUPABASE_PROJECT_REF`
- `SUPABASE_DB_PASSWORD`
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

Before enabling production workflow: reconcile hosted migration history, verify current schema/data, configure `ALLOWED_ORIGINS`, disable native Vercel/Supabase Git deployments, verify project/domain IDs, enable Actions PR writes/auto-merge, then apply repository rulesets described below.

### Branch rules

`dev`: block direct pushes/admin bypass, require feature CI and one approval, dismiss stale approvals, require current checks, squash feature PRs, delete merged branches.

`main`: block direct pushes/admin bypass, allow only exact `dev` promotion, require Promotion Source and Promotion CI, require merge commits, no second approval.

## Production data safety

- `backend/supabase/seed.sql` is local-only.
- Migrations are forward-only. Never auto-reverse a failed production migration.
- Supabase finishes before Vercel deploy starts.
- Hosted schema and migration history must be pulled/reconciled before first production run; checked-in legacy SQL was removed because it was not authoritative.
- Lockdown SQL is staged under `backend/supabase/lockdown/`. After the service release is verified, promote it into `migrations/` in a separate reviewed PR. Local integration/E2E temporarily applies it to test the final boundary. During initial cutover only, audited recovery SQL is documented there; restore through a reviewed forward fix, never an automated rollback.

Domain vocabulary is in `CONTEXT.md`; architectural rationale is in `docs/adr/`.
