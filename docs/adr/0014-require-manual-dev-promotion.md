---
status: accepted
---

# Require manual dev promotion

BossBaby keeps `dev` as a long-lived integration branch where multiple reviewed feature branches can accumulate and their conflicts and interactions can be resolved. A maintainer manually opens the exact-current-`dev` pull request to `main` when that integrated state is ready for production. GitHub Actions validates the complete promotion but neither creates nor merges it. After the maintainer merges the promotion with a regular merge commit, the resulting push to `main` automatically starts the change-aware production release. This supersedes ADR 0005's automatic promotion decision.
