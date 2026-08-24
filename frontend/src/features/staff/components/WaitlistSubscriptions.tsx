import { useState } from "react";
import { removeSubscription } from "../api/staffApi";
import { useSubscriptions } from "../hooks/useSubscriptions";
import { hasCapability } from "../model/access";
import { STAFF_THEME } from "../model/theme";
import type { StaffAccess } from "../model/types";
import StaffImportDialog from "./StaffImportDialog";

interface WaitlistSubscriptionsProps {
  access: StaffAccess;
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function WaitlistSubscriptions({ access }: WaitlistSubscriptionsProps) {
  const { page, search, setSearch, selected, toggle, loading, error, refresh } =
    useSubscriptions(true);
  const [importing, setImporting] = useState(false);
  const [pendingRemoval, setPendingRemoval] = useState<string | null>(null);
  const canManage = hasCapability(access, "waitlist.manage");

  async function handleRemove(id: string) {
    await removeSubscription(id);
    setPendingRemoval(null);
    refresh();
  }

  const rows = page?.subscriptions ?? [];

  return (
    <section
      className="bg-white border rounded-lg"
      style={{ borderColor: STAFF_THEME.border }}
    >
      <div
        className="flex flex-wrap items-center gap-3 px-6 py-4 border-b"
        style={{ borderColor: STAFF_THEME.border }}
      >
        <div className="flex-1 min-w-[200px]">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search email…"
            aria-label="Search subscriptions by email"
            className="w-full border rounded px-3 py-1.5 text-sm focus:outline-none"
            style={{ borderColor: STAFF_THEME.border }}
          />
        </div>
        <p className="text-sm text-black/60">
          {page ? `${page.total} subscription${page.total === 1 ? "" : "s"}` : "…"}
          {selected.size > 0 && ` · ${selected.size} selected`}
        </p>
        {canManage && (
          <button
            type="button"
            onClick={() => setImporting(true)}
            className="text-white text-sm font-medium rounded px-3 py-1.5"
            style={{ backgroundColor: STAFF_THEME.accent }}
          >
            Import
          </button>
        )}
      </div>

      {error && <p role="alert" className="px-6 py-4 text-sm text-red-600">{error}</p>}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-black/50">
              <th className="w-10 px-6 py-2" />
              <th className="px-3 py-2 font-medium">Email</th>
              <th className="px-3 py-2 font-medium">Source</th>
              <th className="px-3 py-2 font-medium">Joined</th>
              {canManage && <th className="px-3 py-2 font-medium text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((subscription) => (
              <tr
                key={subscription.id}
                className="border-t"
                style={{ borderColor: STAFF_THEME.border }}
              >
                <td className="px-6 py-2">
                  <input
                    type="checkbox"
                    checked={selected.has(subscription.id)}
                    onChange={() => toggle(subscription.id)}
                    aria-label={`Select ${subscription.email}`}
                  />
                </td>
                <td className="px-3 py-2 text-black">{subscription.email}</td>
                <td className="px-3 py-2 text-black/60">{subscription.source}</td>
                <td className="px-3 py-2 text-black/60">{formatDate(subscription.createdAt)}</td>
                {canManage && (
                  <td className="px-3 py-2 text-right">
                    {pendingRemoval === subscription.id ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="text-black/60">Delete permanently?</span>
                        <button
                          type="button"
                          onClick={() => void handleRemove(subscription.id)}
                          className="text-red-600 underline"
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          onClick={() => setPendingRemoval(null)}
                          className="text-black/50 underline"
                        >
                          Cancel
                        </button>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setPendingRemoval(subscription.id)}
                        className="text-black/50 hover:text-red-600 underline"
                      >
                        Remove
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {!loading && rows.length === 0 && (
          <p className="px-6 py-8 text-sm text-black/50 text-center">
            {search ? "No subscriptions match that search." : "No subscriptions yet."}
          </p>
        )}
        {loading && <p className="px-6 py-8 text-sm text-black/50 text-center">Loading…</p>}
      </div>

      {importing && (
        <StaffImportDialog onClose={() => setImporting(false)} onImported={refresh} />
      )}
    </section>
  );
}
