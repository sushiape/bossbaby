/**
 * True when the URL fragment is a Supabase password-recovery return.
 *
 * Read from the fragment rather than waiting for the PASSWORD_RECOVERY event,
 * which can fire before the workspace's auth listener attaches.
 */
export function isRecoveryUrl(hash: string): boolean {
  if (!hash) return false;
  return new URLSearchParams(hash.replace(/^#/, "")).get("type") === "recovery";
}
