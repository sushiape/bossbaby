import { assertAllowedOrigin, corsHeaders } from "../_shared/cors.ts";
import { ApiError } from "../_shared/errors.ts";
import { jsonResponse } from "../_shared/response.ts";
import { subscribe } from "./subscriptions.ts";
import type { WaitlistSubscriptionRepository } from "./types.ts";

type RepositoryFactory = () => WaitlistSubscriptionRepository;

function routePath(url: URL): string {
  const marker = "/waitlist";
  const markerIndex = url.pathname.lastIndexOf(marker);
  if (markerIndex < 0) return url.pathname;
  return url.pathname.slice(markerIndex + marker.length) || "/";
}

async function jsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw new ApiError(400, "VALIDATION_FAILED", "Request body must be valid JSON.");
  }
}

export async function handleWaitlistRequest(
  request: Request,
  repositoryFactory: RepositoryFactory,
): Promise<Response> {
  assertAllowedOrigin(request);
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(request) });
  }

  const path = routePath(new URL(request.url));
  if (request.method === "POST" && path === "/subscriptions") {
    const body = await jsonBody(request);
    const subscription = await subscribe(repositoryFactory(), body);
    return jsonResponse(request, { subscription }, 202);
  }

  if (["GET", "POST", "PUT", "DELETE"].includes(request.method)) {
    throw new ApiError(404, "NOT_FOUND", "Route was not found.");
  }
  throw new ApiError(405, "METHOD_NOT_ALLOWED", "Method is not allowed.");
}
