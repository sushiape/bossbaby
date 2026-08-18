# Task Plan: CI/CD Pipeline Design and Review

## Goal
First document the repository's existing CI/CD pipeline, then use a decision-by-decision interview to design independently deployable Vercel webapp and Supabase backend/database delivery paths. Capture resolved domain language and only qualifying architectural decisions; do not implement until the user confirms shared understanding.

## Current Phase
Phase 13 in progress: replace automatic promotion with user-created `dev` → `main` PRs

## Phases

### Phase 1: Repository discovery
- [x] Locate CI/CD configuration, scripts, deployment manifests, and project instructions
- [x] Record the observed pipeline behavior and unresolved gaps
- **Status:** complete

### Phase 2: Pipeline reconstruction
- [x] Trace triggers, jobs, dependencies, artifacts, environments, and deployment steps
- [x] Distinguish implemented behavior from recommendations or assumptions
- **Status:** complete

### Phase 3: Report authoring
- [x] Write a concise report in Markdown
- [x] Add a Mermaid flow graph matching the actual configuration
- **Status:** complete

### Phase 4: Verification and delivery
- [x] Cross-check every report claim against repository files
- [x] Validate Mermaid syntax and review the final diff
- **Status:** complete

### Phase 5: Revalidate repository state
- [x] Check for changes since the prior CI/CD report
- [x] Inspect domain glossary and existing ADRs
- **Status:** complete

### Phase 6: Grill deployment requirements
- [x] Resolve one deployment decision at a time, with a recommendation for each
- [x] Capture domain terms inline as they are agreed
- **Status:** complete

### Phase 7: Record the agreed architecture
- [x] Update the CI/CD design documentation
- [x] Create an ADR only if the final split meets the ADR threshold
- [x] Confirm shared understanding before any implementation
- **Status:** complete

### Phase 8: Implement workflows and tests
- [x] Add reusable validation/deployment workflows for database, Edge Functions, and webapp
- [x] Add feature PR CI, automated promotion, and production dispatcher workflows
- [x] Add Edge Function unit tests and migration immutability validation
- [x] Update operational documentation
- **Status:** complete

### Phase 9: Verify and bootstrap governance
- [x] Validate YAML, scripts, tests, builds, and migration reconstruction
- [x] Review the complete diff without disturbing unrelated user changes
- [x] Determine whether any GitHub settings are safe and authorized before workflow files reach the remote repository
- [x] Document the remaining bootstrap sequence for required checks
- **Status:** complete

### Phase 10: Diagnose the first split production release
- [x] Trace the promotion and production runs after PR #10
- [x] Distinguish intentional validation-only skips from failure-dependent skips
- [x] Identify missing reusable-workflow secret contracts
- **Status:** complete

### Phase 11: Correct the production release workflow
- [x] Keep all credentials in the main-only `Production` environment
- [x] Run selected production validations in parallel
- [x] Run only selected deployments in database → Edge Functions → webapp order
- [x] Fail clearly when a required production secret is unavailable
- **Status:** complete

### Phase 12: Verify and hand off recovery
- [x] Lint workflows and exercise validation/deployment selection fixtures
- [x] Update operational documentation and the incident record
- [x] Review the diff and identify the safe recovery sequence for the failed release
- **Status:** complete

### Phase 13: Make promotion user-controlled
- [x] Replace push-triggered PR creation and auto-merge with validation of manually opened `dev` → `main` PRs
- [x] Trigger production automatically from the resulting `main` push
- [x] Update delivery documentation and ADRs to match the new policy
- [x] Validate workflows, commit to `dev`, and stop before creating the promotion PR
- **Status:** complete

## Key Questions
1. What events trigger the pipeline, and which stages/jobs run for each event?
2. What quality gates, build artifacts, environments, secrets, and deployment targets are used?
3. What operational risks or undocumented gaps are visible in the current implementation?

## Decisions Made
| Decision | Rationale |
|----------|-----------|
| Deliver as a repository Markdown report | The user did not request a binary office format; Markdown keeps configuration references and Mermaid source reviewable. |
| Use Mermaid for the flow graph | The pipeline is a static labeled process, which Mermaid represents directly and portably. |
| Treat the webapp, database migrations, and Edge Functions as three independent production release units | Each should deploy only when files belonging to that unit change. |
| Implement each release unit as a separate GitHub Actions workflow | Separate workflows provide independent triggers, permissions, concurrency, visibility, and reruns. |
| Use `feature branch → dev → main → production` as the delivery sequence | Automated tests must pass before `dev` is promoted to `main`; deployments start only from the resulting `main` update. |
| Require feature-to-`dev` pull requests with relevant CI and one approval | Changes should be validated before they can destabilize the shared development branch; the complete suite runs again on promotion to `main`. |
| Superseded: automatically maintain and auto-merge the `dev`-to-`main` Promotion PR | ADR 0014 replaces this with maintainer-controlled promotion so `dev` can serve as a deliberate integration branch. |
| For a cross-cutting promotion, deploy database migrations, then Edge Functions, then the webapp | Ordered deployment avoids races; promotions that affect only one release unit deploy only that unit. |
| Use a Production Release Dispatcher to invoke the three reusable deployment workflows | A lightweight dispatcher can detect changed units and guarantee their order; each release workflow remains independently callable for recovery. |
| Make each release-unit workflow own both validation and deployment | PR CI invokes affected workflows in validation-only mode; the production dispatcher invokes them in deployment mode, where validation must pass before deployment. |
| Revalidate the exact merged `main` commit before each production deployment | PR checks alone do not cover manual redeployments or every final merge-state risk; production validation must succeed before mutation. |
| Do not deploy application units for documentation- or workflow-only changes | Such changes should still receive relevant validation, but deployment detection is limited to runtime artifacts and runtime configuration. |
| Validate database migrations by reconstructing a clean local Supabase database without seed data | This proves the complete migration chain is executable without exposing production credentials before `db push`. |
| Add an Edge Function unit-test suite and require it with Deno static checks | Request validation, cursor handling, CORS, and error behavior are testable boundaries; formatting, linting, and type-checking alone are insufficient release gates. |
| Validate the webapp with install, lint, type-check, unit tests, and a production build, then deploy that same build artifact | Deploying the validated artifact avoids rebuilding different bits after the gate passes. |
| Make migrations immutable after they reach `main` | CI rejects modification or deletion of production-history migrations; corrections are expressed as new additive migrations. |
| Stop downstream units after a production failure and repair forward | A database failure blocks Edge Functions and webapp; an Edge Function failure blocks webapp. Applied migrations are not automatically rolled back. |
| Serialize production dispatchers without cancelling active runs | Main commits deploy in order so a newer promotion cannot overtake an unfinished database, function, or webapp release. |
| Restrict manual production dispatch to the current `main` commit | Manual dispatch is for recovery or redeployment, not for bypassing review with arbitrary branches or incompatible old revisions. |
| Start production deployment immediately after promotion reaches `main` | Human approval occurs on the feature PR and CI gates promotion; no duplicate production approval is required. |
| Reuse the existing GitHub `Production` environment | Existing secrets are write-only and cannot be copied; each workflow references only the secret names required by its release unit. |
| Configure GitHub governance as part of implementation | Protect `dev` and `main`; require feature PR CI and one approval; require an exact-current-`dev` Promotion PR with full CI; block direct pushes. Promotion remains manually controlled. |
| Merge the Promotion PR with a regular merge commit | This preserves exact reviewed `dev` history in `main`, makes promotion boundaries visible, and supports reliable production change detection. |
| Disable all Vercel native Git deployments, including previews | GitHub Actions remains the sole webapp deployment owner; previews require a future isolated non-production backend to avoid production-data interaction. |
| Require post-deployment smoke checks for each release unit | Verify remote migration state, a safe read-only Edge Function request, and production web routes; smoke failures block downstream units without rollback. |
| Keep Supabase native Git deployment disabled | GitHub Actions remains the sole owner of database and Edge Function releases, preventing duplicated or racing deployment paths. |
| Use a narrow per-unit deployment change map and a broader validation map | Migrations deploy only for new migration files; functions deploy for runtime or relevant function configuration; webapp deploys for runtime, assets, build dependencies/configuration, or Vercel configuration; test/lint/docs/workflow-only changes never deploy. |
| Apply branch protection rules to administrators | Emergency fixes follow the same reviewed feature-to-`dev` and manual promotion path; there is no routine direct-push bypass. |
| Supersede ADR 0007 with ADR 0013 | The split release topology is hard to reverse, surprising relative to the existing workflow, and resolves a real independence-versus-ordering trade-off. |
| Parallelize production validation but keep deployments ordered | Only production mutations have cross-unit ordering constraints; static and local validation can run concurrently against the same merged `main` commit. |
| Keep credentials as `Production` environment secrets and declare each reusable-workflow secret contract | Repository-level secrets would weaken the main-only environment boundary; called workflows must explicitly declare the credentials their deployment jobs consume. |
| Require the user to create and merge each `dev`-to-`main` Promotion PR | `dev` is a shared integration branch where multiple features can accumulate and conflicts can be resolved before an intentional production promotion. |

## Errors Encountered
| Error | Attempt | Resolution |
|-------|---------|------------|
| GitHub Actions permission-settings endpoints returned HTTP 403 | 1 | Recorded the permission limitation; used workflow files, visible run metadata, repository settings, and environment metadata for all supported claims. |
| A shell verification loop used zsh's special `path` variable and hid `git` from command lookup | 1 | Renamed the loop variable and reran verification in a fresh shell. |
| Initial planning-file patch targeted `progress.md` one directory above the repository | 1 | Corrected all paths to the repository root and reapplied the patch. |
| A planning update used an incorrect anchor location in `findings.md` | 1 | Inspected the relevant sections and reapplied the update against exact anchors. |
| `gh repo view` did not expose the requested `autoMergeAllowed` field | 1 | Queried the repository REST endpoint instead and verified `allow_auto_merge` directly. |
| A combined planning update failed despite a visible `findings.md` anchor | 1 | Split the update into smaller exact-file patches. |
| Deno 2.9 lint rejected existing version-pinned `npm:` imports with `no-import-prefix` | 1 | Excluded that style-only rule in the project Deno configuration; all other lint rules remain enabled. |
| Isolated database validation command was rejected because it used recursive deletion for copied `.temp` metadata | 1 | Replaced deletion with a recoverable move inside the temporary directory before retrying. |
| Migration immutability negative fixture cloned stale local `main` without the backend workspace | 1 | Switched the fixture source to authoritative GitHub `main` rather than repeating the stale local clone. |
| Security-hardening documentation patch used an inexact runbook bullet anchor | 1 | Reapplied the update against the exact manual-recovery wording. |
| Final whitespace scan found an intentional Markdown hard-break | 1 | Replaced trailing spaces with a blank paragraph separator and reran validation. |
| Final multi-file planning update used a progress-section anchor that did not apply | 1 | Split completion updates by file and reapplied them to exact sections. |
| Corrective completion update used an out-of-order `findings.md` anchor | 1 | Located the actual section order and split the update into exact-file patches. |
| `apply_patch` rejected delete-and-add operations for `promote-dev.yml` in one patch | 1 | Split replacement into separate delete and add patch calls before updating the second workflow. |
| Mermaid CLI reported a relative SVG name, but the attempted repository cleanup path did not exist | 1 | Treat the Markdown output directory as the likely location, locate the generated asset explicitly, and avoid repeating the incorrect move. |
| A double-quoted `rg` pattern contained backticks, causing zsh to attempt command substitution | 1 | Avoid backticks in shell search patterns and use single-quoted arguments for all subsequent literal searches. |

## Notes
- Preserve unrelated user changes.
- Cite repository paths and line numbers where practical.
- The requested `grill-with-docs` workflow forbids implementation until the user confirms shared understanding.
- The connected account has only GitHub `WRITE` permission; an administrator must perform the documented environment and branch-governance bootstrap after publication.
