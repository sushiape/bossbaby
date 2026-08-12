import { ApiError } from "./errors.ts";

const LOCAL_ORIGIN = "http://localhost:3000";

function allowedOrigins(): Set<string> {
  const configured = Deno.env.get("ALLOWED_ORIGINS") ?? LOCAL_ORIGIN;
  return new Set(configured.split(",").map((origin) => origin.trim()).filter(Boolean));
}

export function assertAllowedOrigin(request: Request): void {
  const origin = request.headers.get("origin");
  if (origin && !allowedOrigins().has(origin)) {
    throw new ApiError(403, "FORBIDDEN_ORIGIN", "This browser origin is not allowed.");
  }
}

export function corsHeaders(request: Request): HeadersInit {
  const origin = request.headers.get("origin");
  return {
    ...(origin && allowedOrigins().has(origin) ? { "Access-Control-Allow-Origin": origin } : {}),
    "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}
