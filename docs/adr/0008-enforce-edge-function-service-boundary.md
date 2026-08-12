# Enforce the Edge Function service boundary

Every visitor may participate through a silently created anonymous Supabase identity, but browsers cannot access You Pick tables directly. The Edge Function validates participant JWTs, derives ownership from the verified identity, uses a server-only Supabase secret for database access, and returns only safe public representations; database grants deny `anon` and `authenticated` direct table access.
