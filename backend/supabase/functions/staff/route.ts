import type { SupabaseClient } from "npm:@supabase/supabase-js@2.112.3";
import { staffIdentity } from "../_shared/auth.ts";
import { assertAllowedOrigin, corsHeaders } from "../_shared/cors.ts";
import { ApiError } from "../_shared/errors.ts";
import { jsonResponse } from "../_shared/response.ts";
import { describeAccess } from "./access.ts";
import { createStaffRepository } from "./repository.ts";

function routePath(url: URL): string {
  const marker = "/staff";
  const markerIndex = url.pathname.lastIndexOf(marker);
  if (markerIndex < 0) return url.pathname;
  return url.pathname.slice(markerIndex + marker.length) || "/";
}

export async function handleStaffRequest(
  request: Request,
  adminFactory: () => SupabaseClient,
): Promise<Response> {
  assertAllowedOrigin(request);
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(request) });
  }

  const path = routePath(new URL(request.url));

  if (request.method === "GET" && path === "/me") {
    const admin = adminFactory();
    const identity = await staffIdentity(request, admin);
    const access = await describeAccess(createStaffRepository(admin), identity);
    return jsonResponse(request, { access });
  }

  if (["GET", "POST", "PUT", "DELETE"].includes(request.method)) {
    throw new ApiError(404, "NOT_FOUND", "Route was not found.");
  }
  throw new ApiError(405, "METHOD_NOT_ALLOWED", "Method is not allowed.");
}
