export type ErrorCode =
  | "AUTHENTICATION_REQUIRED"
  | "INVALID_TOKEN"
  | "FORBIDDEN_ORIGIN"
  | "NOT_FOUND"
  | "VALIDATION_FAILED"
  | "METHOD_NOT_ALLOWED"
  | "INTERNAL_ERROR";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: ErrorCode,
    message: string,
    public readonly details?: Record<string, string>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;
  console.error("Unhandled you-pick error", error);
  return new ApiError(500, "INTERNAL_ERROR", "The service could not complete the request.");
}
