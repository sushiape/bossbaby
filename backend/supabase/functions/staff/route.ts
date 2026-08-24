import type { SupabaseClient } from "npm:@supabase/supabase-js@2.112.3";
import { staffIdentity, staffMember } from "../_shared/auth.ts";
import { assertAllowedOrigin, corsHeaders } from "../_shared/cors.ts";
import { ApiError } from "../_shared/errors.ts";
import { jsonResponse } from "../_shared/response.ts";
import { describeAccess } from "./access.ts";
import { createStaffRepository, createSubscriptionRepository } from "./repository.ts";
import { assertConsent, parseImport, parseSubscriptionQuery } from "./validation.ts";

async function readJsonBody(request: Request): Promise<Record<string, unknown>> {
  try {
    const body = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      throw new ApiError(400, "VALIDATION_FAILED", "Send a JSON object.");
    }
    return body as Record<string, unknown>;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(400, "VALIDATION_FAILED", "Send a valid JSON body.");
  }
}

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

  if (request.method === "GET" && path === "/waitlist/subscriptions") {
    const admin = adminFactory();
    await staffMember(request, admin, "waitlist.read");
    const query = parseSubscriptionQuery(new URL(request.url));
    const page = await createSubscriptionRepository(admin).listSubscriptions(query);
    return jsonResponse(request, page);
  }

  if (request.method === "POST" && path === "/waitlist/subscriptions") {
    const admin = adminFactory();
    const identity = await staffMember(request, admin, "waitlist.manage");
    const body = await readJsonBody(request);
    assertConsent(body);

    const { emails, rejected } = parseImport(body.emails);
    const added = await createSubscriptionRepository(admin)
      .importSubscriptions(emails, identity.user.id);

    return jsonResponse(request, {
      added: added.length,
      skippedDuplicate: emails.length - added.length,
      rejected,
    });
  }

  const removalMatch = path.match(/^\/waitlist\/subscriptions\/([^/]+)$/);
  if (request.method === "DELETE" && removalMatch) {
    const admin = adminFactory();
    await staffMember(request, admin, "waitlist.manage");
    const removed = await createSubscriptionRepository(admin)
      .removeSubscription(decodeURIComponent(removalMatch[1]));
    if (!removed) throw new ApiError(404, "NOT_FOUND", "That subscription no longer exists.");
    return jsonResponse(request, { removed: true });
  }

  if (["GET", "POST", "PUT", "DELETE"].includes(request.method)) {
    throw new ApiError(404, "NOT_FOUND", "Route was not found.");
  }
  throw new ApiError(405, "METHOD_NOT_ALLOWED", "Method is not allowed.");
}
