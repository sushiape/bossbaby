# Separate frontend and backend workspaces

BossBaby uses explicit `frontend/` and `backend/` workspaces in one repository. Existing Vite code and static assets move under `frontend/`, while Supabase configuration, migrations, seed data, Edge Functions, and backend tests live under `backend/supabase/`; this makes deployment ownership and local commands clear without splitting repository history or coordinating multiple repositories.
