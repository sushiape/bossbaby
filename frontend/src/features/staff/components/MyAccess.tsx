import type { StaffAccess } from "../model/types";

interface MyAccessProps {
  access: StaffAccess;
  onSignOut: () => void;
}

/** Read-only by construction: there is no grant or revoke path in the workspace. */
export default function MyAccess({ access, onSignOut }: MyAccessProps) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-black">My access</h2>
      <p className="mt-1 text-sm text-black/60">
        Signed in as <span className="font-medium text-black">{access.email ?? access.userId}</span>
      </p>

      <ul className="mt-6 border border-black/10 rounded divide-y divide-black/10">
        {access.capabilities.map((capability) => (
          <li key={capability.name} className="px-4 py-3">
            <p className="text-sm font-medium text-black">{capability.name}</p>
            <p className="text-sm text-black/60">{capability.description}</p>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-sm text-black/50">
        Capabilities are granted by hand in Supabase. Ask an administrator to change yours.
      </p>

      <button
        type="button"
        onClick={onSignOut}
        className="mt-6 border border-black/20 text-black text-sm font-medium rounded px-4 py-2"
      >
        Sign out
      </button>
    </section>
  );
}
