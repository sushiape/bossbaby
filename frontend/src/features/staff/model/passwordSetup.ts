/**
 * The link types that carry a Staff Member into Password Setup.
 *
 * An invite and a reset are the same step with two entrances, and both arrive
 * as a Supabase link whose fragment names its type. `signup` is included
 * because the type on an invite link has never been observed in production:
 * matching one type too many costs nothing, while matching one too few drops a
 * Staff Member on the homepage holding an unspent credential.
 */
const PASSWORD_SETUP_TYPES = ["invite", "recovery", "signup"];

/**
 * True when the URL fragment is a Supabase password-setup return.
 *
 * Read from the fragment rather than waiting for the PASSWORD_RECOVERY event,
 * which can fire before the workspace's auth listener attaches.
 */
export function isPasswordSetupUrl(hash: string): boolean {
  if (!hash) return false;
  const type = new URLSearchParams(hash.replace(/^#/, "")).get("type");
  return type !== null && PASSWORD_SETUP_TYPES.includes(type);
}
