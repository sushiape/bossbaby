---
status: accepted
---

# Split production releases by change boundary

BossBaby uses a Production Release Dispatcher on each promoted `main` commit to detect three independent release units: database migrations, Supabase Edge Functions, and the Vercel webapp. Each unit owns validation and manual fallback deployment in a reusable workflow. Selected validations run in parallel against the promoted commit. Automated production deployment jobs run directly in the dispatcher so they can bind to the `Production` environment and access its secrets, then execute database migrations, Edge Functions, and webapp in that order, stopping on failure. Single-unit changes release alone. This supersedes ADR 0007's always-coordinated workflow so frontend-only and backend-only development can ship independently without surrendering ordered compatibility when a promotion spans multiple units.
