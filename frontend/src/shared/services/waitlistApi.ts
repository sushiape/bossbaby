import { requireSupabaseConfig } from "../../lib/supabaseClient";

interface ErrorPayload {
  error?: { code?: string; message?: string; details?: Record<string, string> };
}

export class WaitlistApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: Record<string, string>,
  ) {
    super(message);
    this.name = "WaitlistApiError";
  }
}

export async function createWaitlistSubscription(email: string): Promise<void> {
  const { url, anonKey } = requireSupabaseConfig();
  const response = await fetch(`${url}/functions/v1/waitlist/subscriptions`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      apikey: anonKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: email.trim() }),
  });

  if (response.ok) return;

  let payload: ErrorPayload = {};
  try {
    payload = (await response.json()) as ErrorPayload;
  } catch {
    // Gateway failures may not return the service's JSON error contract.
  }
  throw new WaitlistApiError(
    response.status,
    payload.error?.code ?? "REQUEST_FAILED",
    payload.error?.message ?? "Waitlist signup failed.",
    payload.error?.details,
  );
}
