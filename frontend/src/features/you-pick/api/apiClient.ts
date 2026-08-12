import { currentSession, requireSupabaseConfig } from "../../../lib/supabaseClient";

interface ErrorPayload {
  error?: { code?: string; message?: string; details?: Record<string, string> };
}

export class YouPickApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: Record<string, string>,
  ) {
    super(message);
    this.name = "YouPickApiError";
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  auth: "optional" | "required" = "optional",
): Promise<T> {
  const { url, anonKey } = requireSupabaseConfig();
  const session = await currentSession();
  if (auth === "required" && !session?.access_token) {
    throw new YouPickApiError(401, "AUTHENTICATION_REQUIRED", "Anonymous participation is not ready.");
  }
  const response = await fetch(`${url}/functions/v1/you-pick${path}`, {
    ...options,
    headers: {
      apikey: anonKey,
      "Content-Type": "application/json",
      ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
      ...options.headers,
    },
  });
  if (!response.ok) {
    let payload: ErrorPayload = {};
    try {
      payload = (await response.json()) as ErrorPayload;
    } catch {
      // Non-JSON gateway failures still map to stable client errors.
    }
    throw new YouPickApiError(
      response.status,
      payload.error?.code ?? "REQUEST_FAILED",
      payload.error?.message ?? "You Pick service request failed.",
      payload.error?.details,
    );
  }
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}
