import { corsHeaders } from "./cors.ts";
import { type ApiError } from "./errors.ts";

export function jsonResponse(request: Request, body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(request) },
  });
}

export function errorResponse(request: Request, error: ApiError): Response {
  return jsonResponse(
    request,
    {
      error: {
        code: error.code,
        message: error.message,
        ...(error.details ? { details: error.details } : {}),
      },
    },
    error.status,
  );
}
