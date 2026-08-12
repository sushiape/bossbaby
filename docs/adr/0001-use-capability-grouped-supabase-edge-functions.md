# Use capability-grouped Supabase Edge Functions

BossBaby routes existing You Pick data operations through one capability-grouped Supabase Edge Function instead of calling Supabase tables directly from React. This creates a stable serverless API and shared authentication boundary while avoiding speculative CRUD operations and function-per-operation fragmentation; frontend repositories consume the service, while database constraints preserve data integrity.
