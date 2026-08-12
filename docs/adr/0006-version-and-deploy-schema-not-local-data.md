# Version and deploy schema, not local data

Supabase migrations are the source of truth for database structure, constraints, SQL functions, and RLS policies in local and production environments. Production releases apply only reviewed migrations; `seed.sql`, test fixtures, and local data remain local and are never promoted, allowing the service boundary and raw-vote privacy rules to be enforced rather than bypassed through the Data API.
