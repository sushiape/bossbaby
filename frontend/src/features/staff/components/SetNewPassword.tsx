import { useState, type FormEvent } from "react";
import { STAFF_THEME } from "../model/theme";

interface SetNewPasswordProps {
  onSetPassword: (password: string) => Promise<void>;
}

/**
 * Reached by following a recovery link. Supabase signs the identity in when the
 * link's fragment is consumed, so without this screen the password would never
 * actually change and the Staff Member would be locked out again at expiry.
 */
export default function SetNewPassword({ onSetPassword }: SetNewPasswordProps) {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (password !== confirmation) {
      setError("The two passwords do not match.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await onSetPassword(password);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not set the password.");
      setBusy(false);
    }
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: STAFF_THEME.background }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white border rounded-lg p-8 shadow-sm"
        style={{ borderColor: STAFF_THEME.border }}
      >
        <h1 className="text-xl font-semibold text-black">Choose a new password</h1>
        <p className="mt-1 text-sm text-black/60">This replaces the password on your staff account.</p>

        <label className="block mt-6 text-sm font-medium text-black" htmlFor="new-password">
          New password
        </label>
        <input
          id="new-password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-1 w-full border border-black/20 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#FF4FA3]"
        />

        <label className="block mt-4 text-sm font-medium text-black" htmlFor="confirm-password">
          Confirm new password
        </label>
        <input
          id="confirm-password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={confirmation}
          onChange={(event) => setConfirmation(event.target.value)}
          className="mt-1 w-full border border-black/20 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#FF4FA3]"
        />

        {error && <p role="alert" className="mt-4 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="mt-6 w-full text-white text-sm font-medium rounded px-4 py-2 disabled:opacity-50 hover:brightness-105 transition"
          style={{ backgroundColor: STAFF_THEME.accent }}
        >
          {busy ? "Saving…" : "Save password"}
        </button>
      </form>
    </main>
  );
}
