import { useState, type FormEvent } from "react";
import { importSubscriptions } from "../api/staffApi";
import { STAFF_THEME } from "../model/theme";
import type { ImportSummary } from "../model/types";

interface StaffImportDialogProps {
  onClose: () => void;
  onImported: () => void;
}

export default function StaffImportDialog({ onClose, onImported }: StaffImportDialogProps) {
  const [text, setText] = useState("");
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<ImportSummary | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const result = await importSubscriptions(text);
      setSummary(result);
      onImported();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Import failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50">
      <div
        className="w-full max-w-lg bg-white border rounded-lg p-6"
        style={{ borderColor: STAFF_THEME.border }}
      >
        <h3 className="text-lg font-semibold text-black">Import subscriptions</h3>

        {summary ? (
          <div className="mt-4 text-sm">
            <p className="text-black">
              Added {summary.added}, skipped {summary.skippedDuplicate} already on the list.
            </p>
            {summary.rejected.length > 0 && (
              <>
                <p className="mt-3 font-medium text-black">
                  {summary.rejected.length} could not be read:
                </p>
                <ul className="mt-1 max-h-40 overflow-y-auto text-black/60">
                  {summary.rejected.map((row) => (
                    <li key={`${row.line}-${row.value}`}>
                      Line {row.line}: {row.value} ({row.reason})
                    </li>
                  ))}
                </ul>
              </>
            )}
            <button
              type="button"
              onClick={onClose}
              className="mt-5 w-full text-white text-sm font-medium rounded px-4 py-2"
              style={{ backgroundColor: STAFF_THEME.accent }}
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <p className="mt-1 text-sm text-black/60">One email address per line.</p>
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              rows={8}
              required
              className="mt-3 w-full border rounded px-3 py-2 text-sm font-mono focus:outline-none"
              style={{ borderColor: STAFF_THEME.border }}
              placeholder={"someone@example.com\nanother@example.com"}
            />

            <label className="mt-3 flex items-start gap-2 text-sm text-black/70">
              <input
                type="checkbox"
                checked={consent}
                onChange={(event) => setConsent(event.target.checked)}
                className="mt-0.5"
              />
              <span>These people consented to be contacted by Bossbaby.</span>
            </label>

            {error && <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>}

            <div className="mt-5 flex gap-2">
              <button
                type="submit"
                disabled={busy || !consent || !text.trim()}
                className="flex-1 text-white text-sm font-medium rounded px-4 py-2 disabled:opacity-50"
                style={{ backgroundColor: STAFF_THEME.accent }}
              >
                {busy ? "Importing…" : "Import"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border text-black text-sm font-medium rounded px-4 py-2"
                style={{ borderColor: STAFF_THEME.border }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
