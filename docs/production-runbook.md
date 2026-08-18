# Production release runbook

## Bootstrap order

The workflow files must reach GitHub before their checks can be made mandatory. Bootstrap in this order:

1. Have a repository administrator enable auto-merge and allow GitHub Actions to create and approve pull requests.
2. Restrict the `Production` environment to deployments from `main` only, with no administrator bypass. No separate reviewer approval is required.
3. Confirm the `Production` environment contains all required secret names:
   - `SUPABASE_ACCESS_TOKEN`
   - `SUPABASE_PROJECT_REF`
   - `SUPABASE_DB_PASSWORD`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`
   - `VERCEL_TOKEN`

4. Confirm Supabase native Git deployment is disabled. Root `vercel.json` disables every Vercel Git deployment once this change reaches Vercel.
5. Open the CI/CD implementation as a feature PR into `dev`, let `Feature CI` complete, obtain one approval, and merge it.
6. Let `Promote Dev` create the Promotion PR and publish its stable check names. Its own gate still prevents merge before full CI passes.
7. Protect `dev`: require pull requests, the observed `Feature CI / Gate` check, one approval, conversation resolution, and no force pushes or administrator bypass.
8. Protect `main`: require pull requests, the observed `Promote Dev / Gate` check, conversation resolution, and no force pushes or administrator bypass.

Do not add required checks before their first GitHub run; an incorrect or unpublished check name can lock a protected branch.

## Delivery flow

### Feature pull requests

Feature branches enter `dev` only through a pull request. `Feature CI` detects affected units and invokes their reusable workflows in validation-only mode:

- Database: existing production migrations are immutable, and a clean local Postgres database must rebuild from all migrations without seed data.
- Edge Functions: Deno formatting, linting, type-checking, and unit tests must pass.
- Webapp: clean install, lint, TypeScript checking, unit tests, and a production build must pass.

The PR requires one human approval. Feature PRs may use squash merge.

### Promotion

Every update to `dev` starts `Promote Dev`. It creates or updates one `dev` → `main` Promotion PR, verifies that its head is the exact current `dev` SHA, runs all three validations, and enables a regular merge commit only after the `Promote Dev / Gate` check passes.

After merge, the workflow explicitly dispatches `Production Release` with the previous and new `main` SHAs. This explicit handoff is required because GitHub suppresses most workflow events created by `GITHUB_TOKEN`.

### Production

`Production Release` accepts dispatches only from `github-actions[bot]`, validates the ordered `main` range, and detects runtime changes. It invokes affected release workflows in this order:

1. Database migrations
2. Edge Functions
3. Vercel webapp

A unit with no deployment change is skipped. Documentation, tests, lint configuration, and workflow-only changes never cause an application deployment. Production dispatchers queue with cancellation disabled, so promotions release in commit order.

## Failure and recovery

- A failed database release blocks affected Edge Function and webapp releases.
- A failed Edge Function release blocks an affected webapp release.
- Successful migrations are never rolled back automatically. Add a reviewed corrective migration and repair forward.
- Direct manual runs of a unit release workflow may deploy only the current `main` commit.
- The `Production` environment's `main`-only deployment policy prevents feature-branch workflow edits from receiving production secrets.
- A historical failed Actions run may be rerun when its commit remains compatible and reachable from `main`.
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
