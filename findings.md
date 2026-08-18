# Findings & Decisions

## Requirements
- Explain the repository's CI/CD pipeline as a report.
- Include a process flow graph.
- Base the description on the implementation present in the repository.
- Design a CI/CD split so Vercel webapp releases and Supabase backend/database releases can occur independently when only one side changes.
- Interview one decision at a time, recommend an answer, maintain domain language/ADRs as decisions crystallize, and do not implement before explicit confirmation of shared understanding.

## Research Findings
- Current GitHub documentation says most events caused by `GITHUB_TOKEN` do not create new workflow runs, while `workflow_dispatch` and `repository_dispatch` do. Automated promotion must therefore explicitly dispatch the production workflow instead of assuming its merge-generated `push` will start deployment: https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow
- GitHub environment secrets cannot be passed through `workflow_call`; a called workflow may instead attach its deployment job to the environment and consume that environment's secrets directly: https://docs.github.com/en/actions/how-tos/reuse-automations/reuse-workflows
- Current Supabase guidance validates migration reproducibility with a local reset, deploys pending migrations with `db push`, supports `db push --dry-run`, and compares histories with `migration list`: https://supabase.com/docs/guides/local-development/cli-workflows
- Verified current tool releases on 2026-08-17: `actions/checkout` v7.0.1, `actions/setup-node` v7.0.0, `denoland/setup-deno` v2.0.5, `supabase/setup-cli` v3.0.0, Supabase CLI 2.114.0, and Vercel CLI 59.1.3.
- Supabase CLI 2.114.0 supports `db reset --local --no-seed`, deploying all local Edge Functions when `functions deploy` omits names, `migration list --linked`, and destructive local cleanup with `stop --no-backup`.
- Local verification has Node, npm, Docker, and GitHub CLI; Deno, actionlint, and yq are absent and will require temporary or Actions-based validation paths.
- Vercel's current primary documentation confirms that `git.deploymentEnabled: false` disables automatic Git deployments for every branch: https://vercel.com/docs/project-configuration/git-configuration
- Revalidation on 2026-08-17 found the production workflow still unchanged: one sequential job applies Supabase migrations, deploys the `you-pick` Edge Function, and only then builds/deploys the Vercel frontend.
- Existing ADR 0007 explicitly requires that coordinated single-path release; independently deployable release paths would supersede that architectural decision rather than merely refactor workflow syntax.
- ADRs 0009 and 0011 already require backward-compatible expand-contract changes and forward fixes, which are important prerequisites for safe independent frontend/backend releases.
- `backend/supabase/` contains both database migrations and Edge Functions, so the user's word “backend” is broader than “database” and the second deployment boundary must be made explicit.
- The working tree contains unrelated in-progress changes, including Restricted App work, that must be preserved.
- Two GitHub Actions workflows are present: `promotion-source.yml` and `release.yml`.
- `promotion-source.yml` runs only for pull requests targeting `main` when opened, synchronized, or reopened. Its single job checks that the PR head branch is exactly `dev` and that the PR head SHA equals the current remote `dev` SHA.
- `release.yml` runs on every push to `main`, serializes runs through the `production-release` concurrency group without cancelling an active run, has a 30-minute timeout, and targets the protected `production` environment.
- The production release is one sequential job: checkout → Node 24/npm cache → `npm ci` → link Supabase → apply migrations → deploy the `you-pick` Edge Function → pull/build Vercel production settings → deploy the prebuilt frontend.
- Supabase release credentials come from `SUPABASE_ACCESS_TOKEN`, `SUPABASE_PROJECT_REF`, and `SUPABASE_DB_PASSWORD`; Vercel uses `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, and `VERCEL_TOKEN`.
- Backend failure stops later frontend steps because all release operations are sequential in one job.
- The runbook says `release.yml` is the sole production owner and native Git production deployment in Vercel and Supabase must be disabled.
- The runbook defines manual post-stage smoke checks, but the workflow currently contains no automated smoke-test step.
- ADR 0005 describes feature-branch CI plus automatic creation/update and auto-merge of a `dev`→`main` PR, but no workflow implementing those actions was found in `.github/workflows/`; this must be presented as a documented target process or gap, not current automation.
- The runbook describes a bootstrap gate and warns not to enable the release workflow until prerequisites are satisfied; repository files alone cannot prove external GitHub rulesets, environments, secrets, auto-merge settings, or native Vercel/Supabase Git integration state.
- Root `package.json` exposes `build`, `lint`, `test`, and `typecheck` scripts for the frontend workspace, but neither checked-in workflow invokes these quality gates directly. The Vercel build step runs the frontend production build indirectly.
- Root `vercel.json` explicitly disables Vercel Git deployment for `main` and declares `frontend/dist` as the output directory, supporting the single-owner release design.
- Live GitHub verification on 2026-08-13 showed both workflows active. The two latest production releases (2026-08-12) succeeded; an earlier release the same day failed.
- Live GitHub verification returned no repository rulesets and no classic branch protection for either `main` or `dev`. Therefore, the documented required CI, approval, and protected-branch governance is not currently enforced by GitHub repository settings visible to the authenticated account.
- The repository default branch is `main`; the local working branch is `dev`.
- The GitHub repository setting `allow_auto_merge` is false, confirming that the ADR 0005 auto-merge design is not enabled at repository level.
- The `Production` GitHub environment exists, but it has no protection rules, no deployment branch policy, and permits administrator bypass.
- All six secret names required by `release.yml` are configured on the `Production` environment as of 2026-08-12; values were not inspected.
- Rechecked on 2026-08-17: GitHub has `Production` and `Preview` environments. `Production` contains `SUPABASE_ACCESS_TOKEN`, `SUPABASE_DB_PASSWORD`, `SUPABASE_PROJECT_REF`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, and `VERCEL_TOKEN`; `Preview` is empty, and there are no repository-level Actions secrets.
- Existing GitHub secret values cannot be retrieved or copied into new environments. Splitting `Production` into unit-specific environments would require the user to enter the values again.
- Rechecked on 2026-08-17: neither `dev` nor `main` is protected, no repository rulesets exist, and repository auto-merge is disabled. The agreed promotion policy therefore cannot yet be enforced by GitHub settings.
- The connected GitHub account has `WRITE`, not `ADMIN`, permission. It can author repository files but cannot read or change repository Actions policy, branch protection, auto-merge, or the `Production` environment's deployment policy.
- The `Production` environment must be restricted to `main` at the GitHub settings layer; workflow-local SHA checks alone cannot stop a malicious feature-branch workflow edit from requesting environment secrets.
- Current `dev` and deployed `origin/main` have no differences in pipeline-relevant files, so the checked-in workflow analysis applies to the production workflow revision.
- The failed 2026-08-12 release stopped at schema migration validation because existing data violated `youpick_votes_valid_selections`; Edge Function and Vercel steps were skipped. A subsequent forward-fix release succeeded, demonstrating the sequential fail-closed behavior described in ADR 0011.
- Recent promotion PRs into `main` came from `dev`, but GitHub metadata showed no active auto-merge request; earlier historical PRs came from another branch, which is possible because current branch protection is absent and the source check only runs rather than enforcing merge restrictions on its own.
- The final Mermaid flowchart rendered successfully with Mermaid CLI 11.12.0, and all repository-relative source links in the report resolve to existing files.

## Technical Decisions
| Decision | Rationale |
|----------|-----------|
| Mermaid flowchart embedded in Markdown | It is readable in source form and rendered by common repository viewers. |
| Use three production release units: webapp, database migrations, and Edge Functions | The user wants table/schema changes to trigger migrations, function changes to trigger Edge Function deployment, and frontend-only work to deploy neither backend unit. |
| Use three separate GitHub Actions workflows rather than conditional jobs in one workflow | The user confirmed that each release unit should have independent triggers, permissions, concurrency, status, and reruns. |
| Gate production through `feature branch → dev → main` promotion | Feature work merges into `dev`; automated tests run before the `dev`-to-`main` promotion is merged; only `main` starts production deployments. |
| Protect `dev` with feature pull requests, relevant CI, and one approval | Direct feature merges to `dev` are not allowed; the complete test suite is repeated on the Promotion PR. |
| Automate the Promotion PR and its merge after full CI passes | Automation creates or updates the `dev`-to-`main` PR and enables auto-merge; no second approval is required for already-reviewed history. This confirms existing ADR 0005. |
| Order cross-cutting production releases as database migrations → Edge Functions → webapp | Each affected unit deploys in order to avoid races; when only one unit changes, only that release runs. |
| Trigger reusable release workflows through a Production Release Dispatcher | The dispatcher runs for `main`, detects affected units, and invokes the three release workflows in order. Each release workflow also exposes manual dispatch for recovery. |
| Co-locate validation with each release-unit workflow | The webapp, database migration, and Edge Function workflows each validate their own unit. PR CI calls them without deployment; the production dispatcher calls them with deployment enabled, and deployment follows successful validation. |
| Re-run unit validation in production mode | Each affected workflow validates the exact merged `main` commit immediately before deployment, even when PR validation already passed. |
| Separate validation paths from deployment paths | Documentation and CI-workflow changes can trigger checks but never an application deployment; only runtime artifacts and runtime configuration count as releasable changes. |
| Reconstruct the database from migrations during database validation | CI starts a clean local Supabase database and applies every migration without production credentials or seed data; production mode runs `db push` only after reconstruction succeeds. |
| Require Edge Function unit tests and Deno static checks | Add focused tests for request validation, cursor handling, CORS, and error behavior; require formatting, linting, type-checking, and tests before function deployment. |
| Deploy the validated webapp build artifact | Webapp validation runs a clean install, lint, TypeScript check, unit tests, and production build in order; the resulting artifact is promoted unchanged to Vercel. |
| Enforce migration immutability after promotion to `main` | Existing production-history migration files cannot be modified or deleted; schema corrections require a new migration. |
| Fail closed between affected release units and repair forward | Later affected units do not deploy after an upstream failure; successful migrations remain applied and failures are corrected forward before rerunning. This preserves ADR 0011. |
| Queue production dispatchers with cancellation disabled | Concurrent promotions are serialized in commit order; a newer release never cancels or overtakes an active release. |
| Allow manual production deployment only for current `main` | Manual dispatch cannot deploy arbitrary branches or revisions; historical failed runs may be rerun from their original Actions run when appropriate. |
| Deploy automatically after the Promotion PR reaches `main` | The production dispatcher starts immediately without a separate environment approval because feature review, promotion CI, and pre-deployment revalidation already gate the release. |
| Reuse the single `Production` GitHub environment | Each unit workflow explicitly references only its needed secret names, avoiding user re-entry of non-readable secret values. |
| Enforce the delivery policy with GitHub settings | Implementation includes enabling auto-merge and protecting `dev` and `main`: feature PRs require relevant CI and one approval, Promotion PRs require exact-current-`dev` plus full CI, and direct pushes are blocked. |
| Use a regular merge commit for `dev`-to-`main` promotion | It preserves the exact reviewed `dev` history and a visible production boundary; feature PRs into `dev` may still use squash merge. |
| Disable Vercel native Git deployment for every branch | GitHub Actions is the sole webapp deployment owner. Preview deployment is deferred until a non-production backend prevents preview code from interacting with production data. |
| Smoke-test every deployed release unit | Database verifies remote migration state, Edge Functions receive a safe read-only request, and the webapp's production homepage and `/app` route must respond successfully. A failure blocks downstream work but never rolls back automatically. |
| Keep Supabase native Git deployment disabled | Database migrations and Edge Functions deploy only through GitHub Actions so platform-native automation cannot race or duplicate the ordered dispatcher. |
| Detect deployment changes with release-unit-specific runtime paths | Database: new migration files only. Edge Functions: runtime code, Deno configuration, and relevant function configuration, excluding test-only changes. Webapp: runtime/assets, build dependencies/configuration, and Vercel configuration, excluding tests, lint-only configuration, docs, and workflows. Broader paths may still trigger validation. |
| Do not allow administrator bypass of branch protections | Administrators use the same feature PR and Promotion PR path, preserving review history and release assumptions during emergency changes. |
| Record the split release architecture in ADR 0013 and supersede ADR 0007 | The decision changes deployment ownership and coordinates independent releases through a dispatcher, meeting the ADR threshold. |

## Domain-Language Notes
- “Database Migration Release” means applying versioned changes under `backend/supabase/migrations/` to production.
- “Edge Function Release” means deploying production function code when `backend/supabase/functions/` changes, including shared function code.
- “Webapp Release” means building and deploying the Vercel frontend independently of both Supabase release units.
- “Promotion PR” means the pull request from `dev` to `main` that gates production deployment after feature work has already entered `dev`.
- “Production Release Dispatcher” means the non-deploying workflow that detects affected release units for a `main` update and invokes their reusable workflows in dependency order.
- “Deployment Change” means a change to a release unit's runtime artifact or runtime configuration; documentation and workflow-only edits are excluded even when they require CI validation.
- “Database Validation” means successfully reconstructing a clean local database from the complete migration history without seed or production data.
- “Edge Function Validation” means passing Deno formatting, linting, type-checking, and the checked-in Edge Function unit tests.
- “Webapp Validation” means passing a clean dependency install, lint, TypeScript check, unit tests, and production build; the validated build output is the release artifact.
- “Production Migration” means a migration file already present on `main`; it is immutable and may only be followed by a corrective migration.
- These are delivery/implementation terms, so they belong in CI/CD documentation rather than the domain-only `CONTEXT.md` glossary.

## Issues Encountered
| Issue | Resolution |
|-------|------------|
| README setup/script information is stale relative to the current workspace manifests | Treat `package.json` and workflow files as authoritative for the pipeline report and call out documentation drift only where relevant. |
| GitHub Actions permission-policy endpoints returned HTTP 403 for the authenticated account | Avoid claims about repository-wide Actions permission defaults; report only settings that could be verified. |
| GitHub environment secrets are write-only | Verified names and timestamps only; never attempted to expose values. Any environment split requires the user to repopulate secrets. |
| Connected GitHub account lacks `ADMIN` permission | Completed and verified repository implementation; documented the required admin-only Actions, environment, auto-merge, and branch-protection bootstrap instead of attempting unsafe partial governance. |

## Resources
- Repository root: `/Users/liyanfeng/github/bossbaby`
- GitHub workflow triggering: https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow
- GitHub reusable workflows: https://docs.github.com/en/actions/how-tos/reuse-automations/reuse-workflows
- Supabase local-development workflow: https://supabase.com/docs/guides/local-development/cli-workflows
- Vercel Git configuration: https://vercel.com/docs/project-configuration/git-configuration

## Visual/Browser Findings
- No browser or image sources used.

## Implementation Verification
- actionlint 1.7.12 reported no findings across all six workflow files.
- Shell syntax, YAML parsing, JSON parsing, documentation links, whitespace, and Mermaid 11.12.0 rendering passed.
- Edge Function formatting, linting, type-checking, and 9 unit tests passed with Deno 2.9.5.
- Frontend linting, type-checking, 4 unit tests, and the Vite production build passed.
- An isolated Supabase CLI 2.114.0 project rebuilt both migrations from zero without seed data; the pre-existing local BossBaby stack remained running and unchanged.
- Change-detection fixtures correctly distinguished webapp runtime, Edge test-only, and database migration changes.
- Migration immutability accepted unchanged production history and rejected a modified production migration.
- Live read-only smoke checks passed for the production Edge Function, homepage, and `/app`.
- The 2026-08-18 correction passes Actionlint 1.7.12, shell syntax, whitespace, frontend lint/type-check/4 tests/build, Deno format/lint/type-check/9 tests, change-classification fixtures, and Mermaid 11.12.0 rendering.

## Production incident: 2026-08-18
- PR #10 merged into `dev`; `Promote Dev` validated database, Edge Functions, and webapp concurrently, merged promotion PR #11 into `main`, and dispatched Production Release.
- The deployment rows shown as skipped in `Promote Dev` were intentional because all three calls used `deploy: false`.
- Production Release run `32119036908` selected all three release units. Database validation passed, but database deployment failed while linking Supabase because `SUPABASE_ACCESS_TOKEN` and `SUPABASE_PROJECT_REF` evaluated to empty strings.
- The `Production` environment contained all six expected secret names, the deployment was admitted for `main`, and the same secrets predated successful legacy release runs. The failure is therefore in the new reusable-workflow secret contract rather than change detection or the environment branch policy.
- GitHub documents that reusable workflows declare consumed secrets under `on.workflow_call.secrets`; secrets are not automatically passed merely because the called file references the `secrets` context. A called deployment job may remain attached to an environment and use that environment's secrets.
- Edge Functions and Webapp were skipped after the database failure by the dispatcher's fail-closed dependency conditions.
- The initial dispatcher serialized each complete validate-and-deploy reusable workflow. This preserves deployment order but unnecessarily serializes production validation. The correction must run selected validations in parallel, then run selected deployments in database → Edge Functions → webapp order.
- The correction declares each reusable workflow's secret contract, retains the deployment job's `Production` environment, and checks every required value before the first remote mutation.
- The correction adds separate validation and deployment modes. Production calls selected validation modes concurrently, gates their exact results, then calls deploy-only modes in dependency order.
- The old failed Actions run must not be rerun because it remains bound to the faulty workflow revision. The corrective promotion is workflow-only and intentionally deploys no application unit, so recovery requires current-`main` manual unit runs in database → Edge Functions → webapp order.
