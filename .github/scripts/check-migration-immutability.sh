#!/usr/bin/env bash

set -euo pipefail

git fetch --no-tags origin main

changed_production_migrations=()
while IFS= read -r migration_file; do
  [[ -n "$migration_file" ]] || continue
  if ! git diff --quiet origin/main -- "$migration_file"; then
    changed_production_migrations+=("$migration_file")
  fi
done < <(git ls-tree -r --name-only origin/main -- backend/supabase/migrations)

if (( ${#changed_production_migrations[@]} > 0 )); then
  printf 'Production migrations are immutable. Add a corrective migration instead:\n' >&2
  printf '  %s\n' "${changed_production_migrations[@]}" >&2
  exit 1
fi

printf 'All migrations already present on main are unchanged.\n'
