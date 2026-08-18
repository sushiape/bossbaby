# Production release runbook

## Bootstrap order

The workflow files must reach GitHub before their checks can be made mandatory. Bootstrap in this order:

1. Restrict the `Production` environment to deployments from `main` only, with no administrator bypass. No separate reviewer approval is required.
2. Confirm the `Production` environment contains all required secret names:
   - `SUPABASE_ACCESS_TOKEN`
   - `SUPABASE_PROJECT_REF`
   - `SUPABASE_DB_PASSWORD`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`
   - `VERCEL_TOKEN`

3. Confirm Supabase native Git deployment is disabled. Root `vercel.json` disables every Vercel Git deployment once this change reaches Vercel.
4. Open the CI/CD implementation as a feature PR into `dev`, let `Feature CI` complete, obtain one approval, and merge it.
5. Manually open the first `dev` → `main` Promotion PR so `Promote Dev` publishes its stable check names.
6. Protect `dev`: require pull requests, the observed `Feature CI / Gate` check, one approval, conversation resolution, and no force pushes or administrator bypass.
7. Protect `main`: require pull requests, the observed `Promote Dev / Gate` check, conversation resolution, and no force pushes or administrator bypass.

Do not add required checks before their first GitHub run; an incorrect or unpublished check name can lock a protected branch.

## Delivery flow

### Feature pull requests

Feature branches enter `dev` only through a pull request. `Feature CI` detects affected units and invokes their reusable workflows in validation-only mode:

- Database: existing production migrations are immutable, and a clean local Postgres database must rebuild from all migrations without seed data.
- Edge Functions: Deno formatting, linting, type-checking, and unit tests must pass.
- Webapp: clean install, lint, TypeScript checking, unit tests, and a production build must pass.

The PR requires one human approval. Feature PRs may use squash merge.

### Promotion

When the integrated `dev` state is ready for production, a maintainer manually opens a `dev` → `main` Promotion PR. `Promote Dev` verifies that its head is the exact current `dev` SHA and runs all three validations. The maintainer merges it with a regular merge commit only after the `Promote Dev / Gate` check passes.

The resulting push to `main` starts `Production Release` automatically with the previous and new `main` SHAs from the push event.

### Production

`Production Release` runs only for pushes to `main`, validates the ordered push range, and detects runtime changes. It first validates every affected unit in parallel and requires the Production Validation Gate to pass. It then invokes affected deployment modes in this order:

1. Database migrations
2. Edge Functions
3. Vercel webapp

A unit with no deployment change is skipped. Documentation, tests, lint configuration, and workflow-only changes never cause an application deployment. Each deploy mode reads its declared credentials from the main-only `Production` environment and fails before mutation when a required secret is unavailable. Production dispatchers queue with cancellation disabled, so promotions release in commit order.

## Failure and recovery

- A failed database release blocks affected Edge Function and webapp releases.
- A failed Edge Function release blocks an affected webapp release.
- Successful migrations are never rolled back automatically. Add a reviewed corrective migration and repair forward.
- Direct manual runs of a unit release workflow may deploy only the current `main` commit.
- The `Production` environment's `main`-only deployment policy prevents feature-branch workflow edits from receiving production secrets.
- A historical failed Actions run may be rerun when its commit remains compatible and reachable from `main`.
- Do not rerun an old release when the failure came from its workflow definition: GitHub reuses that run's workflow revision. Merge the workflow correction through `dev`, then manually run the affected unit workflows against current `main` in database → Edge Functions → webapp order.
- Never run `db reset`, seed, destructive integration, or E2E commands against linked production Supabase.

## Automated smoke checks

Each production unit verifies its remote result:

- Database lists linked migration history and confirms a second `db push --dry-run` succeeds.
- Edge Functions retry a safe read-only request to `you-pick/suggestions`.
- Webapp retries `https://hibossbaby.com/` and `https://hibossbaby.com/app`.

A smoke failure marks the unit failed and blocks downstream work without rollback.

## Service-boundary cutovers

Breaking backend changes still use expand-contract releases from ADR 0009. Add the compatible backend path first, switch the webapp in a later compatible release, verify production, and remove the old path only in a final release.

Lockdown SQL remains staged in `backend/supabase/lockdown/` until its own reviewed migration release. Use synthetic participants for deeper manual verification of anonymous writes, vote replacement, ownership isolation, aggregate-only results, and direct-table lockdown.
