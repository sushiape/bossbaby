#!/usr/bin/env bash

set -euo pipefail

base_sha="${1:?base SHA is required}"
head_sha="${2:?head SHA is required}"
mode="${3:-feature}"

if [[ "$base_sha" =~ ^0+$ ]]; then
  base_sha="$(git rev-list --max-parents=0 "$head_sha" | tail -1)"
fi

git cat-file -e "${base_sha}^{commit}"
git cat-file -e "${head_sha}^{commit}"

validate_database=false
validate_edge_functions=false
validate_webapp=false
deploy_database=false
deploy_edge_functions=false
deploy_webapp=false

is_test_file() {
  case "$1" in
    *_test.ts | *.test.* | *.spec.* | */test/* | */tests/*) return 0 ;;
    *) return 1 ;;
  esac
}

while IFS= read -r changed_file; do
  [[ -n "$changed_file" ]] || continue
  printf '%s\n' "$changed_file"

  case "$changed_file" in
    backend/supabase/migrations/*.sql)
      validate_database=true
      deploy_database=true
      ;;
    backend/supabase/config.toml)
      validate_database=true
      validate_edge_functions=true
      deploy_edge_functions=true
      ;;
    backend/supabase/deno.json | backend/supabase/deno.lock)
      validate_edge_functions=true
      deploy_edge_functions=true
      ;;
    backend/supabase/functions/*)
      validate_edge_functions=true
      if ! is_test_file "$changed_file"; then
        deploy_edge_functions=true
      fi
      ;;
    frontend/*)
      validate_webapp=true
      case "$changed_file" in
        frontend/eslint.config.js) ;;
        *)
          if ! is_test_file "$changed_file"; then
            deploy_webapp=true
          fi
          ;;
      esac
      ;;
    package.json | package-lock.json | vercel.json)
      validate_webapp=true
      deploy_webapp=true
      ;;
    .github/scripts/check-migration-immutability.sh | .github/workflows/database-release.yml)
      validate_database=true
      ;;
    .github/workflows/edge-functions-release.yml)
      validate_edge_functions=true
      ;;
    .github/workflows/webapp-release.yml)
      validate_webapp=true
      ;;
    .github/scripts/detect-changes.sh | .github/workflows/feature-ci.yml | \
      .github/workflows/promote-dev.yml | .github/workflows/production-release.yml)
      validate_database=true
      validate_edge_functions=true
      validate_webapp=true
      ;;
  esac
done < <(git diff --name-only "$base_sha" "$head_sha")

if [[ "$mode" == "promotion" ]]; then
  validate_database=true
  validate_edge_functions=true
  validate_webapp=true
fi

emit() {
  local name="$1"
  local value="$2"
  printf '%s=%s\n' "$name" "$value"
  if [[ -n "${GITHUB_OUTPUT:-}" ]]; then
    printf '%s=%s\n' "$name" "$value" >> "$GITHUB_OUTPUT"
  fi
}

emit validate_database "$validate_database"
emit validate_edge_functions "$validate_edge_functions"
emit validate_webapp "$validate_webapp"
emit deploy_database "$deploy_database"
emit deploy_edge_functions "$deploy_edge_functions"
emit deploy_webapp "$deploy_webapp"
