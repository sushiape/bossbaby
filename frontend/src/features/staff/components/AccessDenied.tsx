import { STAFF_THEME } from "../model/theme";

interface AccessDeniedProps {
  message: string | null;
  onSignOut: () => void;
}

/** An authenticated identity holding no grants is an App User, not a Staff Member. */
export default function AccessDenied({ message, onSignOut }: AccessDeniedProps) {
  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: STAFF_THEME.background }}
    >
      <div
        className="w-full max-w-sm bg-white border rounded-lg p-8 text-center shadow-sm"
        style={{ borderColor: STAFF_THEME.border }}
      >
        <h1 className="text-xl font-semibold text-black">No staff access</h1>
        <p className="mt-2 text-sm text-black/70">
          {message ?? "This account has no staff capabilities."}
        </p>
        <button
          type="button"
          onClick={onSignOut}
          className="mt-6 w-full text-white text-sm font-medium rounded px-4 py-2 hover:brightness-105 transition"
          style={{ backgroundColor: STAFF_THEME.accent }}
        >
          Sign out
        </button>
      </div>
    </main>
  );
}
