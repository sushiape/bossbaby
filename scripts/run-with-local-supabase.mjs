import { spawnSync } from "node:child_process";

const command = process.argv[2];
const args = process.argv.slice(3);
if (!command) {
  console.error("Usage: node scripts/run-with-local-supabase.mjs <command> [...args]");
  process.exit(2);
}

const status = spawnSync("npx", ["supabase", "--workdir", "backend", "status", "-o", "json"], {
  encoding: "utf8",
});
if (status.status !== 0) {
  console.error("Local Supabase is not running. Start it with `npm run dev:backend`.");
  process.exit(status.status ?? 1);
}

let local;
try {
  local = JSON.parse(status.stdout);
} catch {
  console.error("Could not read local Supabase status JSON.");
  process.exit(1);
}

const url = local.API_URL ?? local.api_url;
const anonKey = local.ANON_KEY ?? local.anon_key ?? local.PUBLISHABLE_KEY ?? local.publishable_key;
const serviceKey = local.SERVICE_ROLE_KEY ?? local.service_role_key ?? local.SECRET_KEY ?? local.secret_key;
if (!url || !anonKey || !serviceKey) {
  console.error("Local Supabase status did not include API, anonymous, and service keys.");
  process.exit(1);
}

const child = spawnSync(command, args, {
  stdio: "inherit",
  env: {
    ...process.env,
    SUPABASE_URL: url,
    SUPABASE_ANON_KEY: anonKey,
    SUPABASE_SERVICE_ROLE_KEY: serviceKey,
    VITE_SUPABASE_URL: url,
    VITE_SUPABASE_ANON_KEY: anonKey,
  },
});
process.exit(child.status ?? 1);
