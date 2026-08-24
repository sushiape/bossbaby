interface AccessDeniedProps {
  message: string | null;
  onSignOut: () => void;
}

/** An authenticated identity holding no grants is an App User, not a Staff Member. */
export default function AccessDenied({ message, onSignOut }: AccessDeniedProps) {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm border border-black/10 rounded-lg p-8 text-center">
        <h1 className="text-xl font-semibold text-black">No staff access</h1>
        <p className="mt-2 text-sm text-black/70">
          {message ?? "This account has no staff capabilities."}
        </p>
        <button
          type="button"
          onClick={onSignOut}
          className="mt-6 w-full bg-black text-white text-sm font-medium rounded px-4 py-2"
        >
          Sign out
        </button>
      </div>
    </main>
  );
}
