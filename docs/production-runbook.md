# Production release runbook

## Bootstrap gate

Do not enable `.github/workflows/release.yml` until all checks pass:

1. Merge a normal `main` → `dev` synchronization PR. Never force-push `dev`.
2. Confirm administrators can manage rulesets, Actions workflow permissions, environments, and auto-merge.
3. Allow GitHub Actions to create/update pull requests.
4. Verify Vercel project, production domain, project ID, and org/team ID.
5. Verify hosted Supabase project ref and database access.
6. Pull authoritative hosted schema and reconcile `supabase_migrations.schema_migrations`; first migration check must be a no-op against known production state.
7. Back up and verify existing production data.
8. Set `ALLOWED_ORIGINS` on `you-pick` to exact local and verified production origins.
9. Add protected `production` environment secrets listed in README.
10. Disable Vercel and Supabase native Git production deployment.
11. Let workflows publish stable check names, then configure `dev` and `main` rulesets.

## Release order

`release.yml` is sole production owner:

1. Apply reviewed schema/security migrations.
2. Deploy `you-pick` Edge Function with platform JWT verification disabled; handler performs route-level optional/required auth.
3. Build and deploy `frontend/` to Vercel.

Failure at step 1 or 2 blocks Vercel. Never run `db reset`, seed, integration, or E2E commands against hosted Supabase.

## Initial service cutover

Foundation migration keeps legacy direct grants only for an old deployed frontend. Deploy service-compatible frontend and verify public reads, anonymous writes, aggregate results, and owner deletion before applying direct-access lockdown as a separate reviewed release.

Lockdown SQL remains staged in `backend/supabase/lockdown/` so the service-switch release cannot apply it accidentally. After production verification, move that SQL unchanged into `backend/supabase/migrations/` in a separate reviewed PR. After it runs:

- anonymous/authenticated Data API table requests fail;
- service-secret Edge Function access continues;
- raw votes and participant IDs remain unavailable to browsers.

If initial cutover fails, repair forward. Audited temporary grant restoration is described in migration comments and must be manually approved; never automate reverse database migration.

## Smoke checks

After each production stage, use synthetic test participants only:

- public suggestions return display fields without `user_id`;
- public vote results return counts/total only;
- invalid bearer token returns `401`;
- anonymous participant can create suggestion and vote;
- same participant can replace vote without increasing total participant count;
- owner deletes own suggestion;
- second participant gets `404` deleting it;
- direct table requests fail after lockdown;
- website static routes work if backend is unavailable.
