# Version and deploy schema, not local data

Supabase migrations are the source of truth for database structure, constraints, SQL functions, and RLS policies in local and production environments. Production releases apply only reviewed migrations; `seed.sql`, test fixtures, and local data remain local and are never promoted, allowing the service boundary and raw-vote privacy rules to be enforced rather than bypassed through the Data API.

What this bars from a migration is *test* data: sample rows that exist to make local development or a test run convenient. Those belong in `seed.sql`, where they stay local.

It does not bar a row that a deployed feature cannot function without. Where the schema alone leaves a feature broken — a survey the landing page asks for by family and has nowhere to send answers until it exists — that row is production data, not a fixture, and it arrives the same way the schema does. Such a migration says in a comment why the row is bootstrap rather than convenience, and is written to survive a replay (`on conflict do nothing`), so that re-running it never clobbers a row that has since superseded it. The question set is then *not* mirrored into `seed.sql`: one definition, in the migration.
