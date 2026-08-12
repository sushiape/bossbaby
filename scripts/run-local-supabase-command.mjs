import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, unlinkSync } from "node:fs";

const command = process.argv[2];
const args = process.argv.slice(3);
if (!command) {
  console.error("Usage: node scripts/run-local-supabase-command.mjs <command> [...args]");
  process.exit(2);
}

function run(executable, executableArgs, options = {}) {
  return spawnSync(executable, executableArgs, { stdio: "inherit", ...options });
}

const existing = spawnSync("npx", ["supabase", "--workdir", "backend", "status", "-o", "json"], {
  stdio: "ignore",
});
const startedHere = existing.status !== 0;
let exitCode = 1;
const lockdownSource = "backend/supabase/lockdown/202608120002_lock_down_direct_access.sql";
const localLockdown = "backend/supabase/migrations/202608129999_local_lockdown.sql";

try {
  if (startedHere) {
    const start = run("npm", ["run", "dev:backend"]);
    if (start.status !== 0) throw { exitCode: start.status ?? 1 };
  }
  copyFileSync(lockdownSource, localLockdown);
  const reset = run("npm", ["run", "db:reset"]);
  if (reset.status !== 0) throw { exitCode: reset.status ?? 1 };

  const result = run("node", ["scripts/run-with-local-supabase.mjs", command, ...args]);
  exitCode = result.status ?? 1;
} catch (error) {
  exitCode = typeof error === "object" && error && "exitCode" in error ? error.exitCode : 1;
} finally {
  if (existsSync(localLockdown)) unlinkSync(localLockdown);
  if (startedHere) run("npm", ["run", "stop:backend"]);
}
process.exitCode = exitCode;
