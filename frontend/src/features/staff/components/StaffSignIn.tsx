import { useState, type FormEvent } from "react";

interface StaffSignInProps {
  onSignIn: (email: string, password: string) => Promise<void>;
  onRecover: (email: string) => Promise<void>;
}

/**
 * Signed-out state. Deliberately offers no sign-up affordance: staff identities
 * are provisioned in Supabase by hand, never self-registered.
 */
export default function StaffSignIn({ onSignIn, onRecover }: StaffSignInProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      await onSignIn(email.trim(), password);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Sign-in failed.");
    } finally {
      setBusy(false);
    }
  }

  async function handleRecover() {
    if (!email.trim()) {
      setError("Enter your email address first.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await onRecover(email.trim());
      setNotice("If that address has an account, a password reset link is on its way.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not send a reset link.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm border border-black/10 rounded-lg p-8"
      >
        <h1 className="text-xl font-semibold text-black">Staff sign-in</h1>
        <p className="mt-1 text-sm text-black/60">Bossbaby Staff Workspace.</p>

        <label className="block mt-6 text-sm font-medium text-black" htmlFor="staff-email">
          Email
        </label>
        <input
          id="staff-email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-1 w-full border border-black/20 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#FF4FA3]"
        />

        <label className="block mt-4 text-sm font-medium text-black" htmlFor="staff-password">
          Password
        </label>
        <input
          id="staff-password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-1 w-full border border-black/20 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#FF4FA3]"
        />

        {error && <p role="alert" className="mt-4 text-sm text-red-600">{error}</p>}
        {notice && <p className="mt-4 text-sm text-black/70">{notice}</p>}

        <button
          type="submit"
          disabled={busy}
          className="mt-6 w-full bg-black text-white text-sm font-medium rounded px-4 py-2 disabled:opacity-50"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>

        <button
          type="button"
          onClick={handleRecover}
          disabled={busy}
          className="mt-3 w-full text-sm text-black/60 underline disabled:opacity-50"
        >
          Forgot your password?
        </button>
      </form>
    </main>
  );
}
