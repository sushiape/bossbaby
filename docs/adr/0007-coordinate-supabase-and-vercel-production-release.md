# Coordinate Supabase and Vercel production release

A single GitHub Actions workflow releases each `main` commit by applying reviewed Supabase migrations, deploying Supabase Edge Functions, then deploying the Vercel frontend. Vercel deployment does not start when a backend step fails, and competing platform-native production deployments are disabled so one commit has one ordered release path.
