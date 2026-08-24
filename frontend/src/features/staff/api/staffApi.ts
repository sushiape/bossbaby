import { currentStaffSession, requireStaffConfig } from "./staffClient";
import type { StaffAccess } from "../model/types";

interface ErrorPayload {
  error?: { code?: string; message?: string; details?: Record<string, string> };
}

export class StaffApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: Record<string, string>,
  ) {
    super(message);
    this.name = "StaffApiError";
  }
}

export async function staffRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const { url, anonKey } = requireStaffConfig();
  const session = await currentStaffSession();
  if (!session?.access_token) {
    throw new StaffApiError(401, "AUTHENTICATION_REQUIRED", "Staff sign-in is required.");
  }

  const response = await fetch(`${url}/functions/v1/staff${path}`, {
    ...options,
    headers: {
      apikey: anonKey,
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
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
    throw new StaffApiError(
      response.status,
      payload.error?.code ?? "REQUEST_FAILED",
      payload.error?.message ?? "Staff service request failed.",
      payload.error?.details,
    );
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export async function fetchAccess(): Promise<StaffAccess> {
  const { access } = await staffRequest<{ access: StaffAccess }>("/me");
  return access;
}
