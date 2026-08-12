import { adminClient, participant } from "../_shared/auth.ts";
import { assertAllowedOrigin, corsHeaders } from "../_shared/cors.ts";
import { ApiError, toApiError } from "../_shared/errors.ts";
import { errorResponse, jsonResponse } from "../_shared/response.ts";
import { createSuggestion, deleteSuggestion, listSuggestions } from "./suggestions.ts";
import { jsonBody } from "./validation.ts";
import { getVoteResults, replaceVote } from "./votes.ts";

function routePath(url: URL): string {
  const marker = "/you-pick";
  const markerIndex = url.pathname.lastIndexOf(marker);
  if (markerIndex < 0) return url.pathname;
  return url.pathname.slice(markerIndex + marker.length) || "/";
}

async function handle(request: Request): Promise<Response> {
  assertAllowedOrigin(request);
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(request) });
  }

  const url = new URL(request.url);
  const path = routePath(url);
  const client = adminClient();

  if (request.method === "GET" && path === "/suggestions") {
    const user = await participant(request, false);
    const result = await listSuggestions(
      client,
      user?.id,
      url.searchParams.get("cursor"),
      url.searchParams.get("limit"),
    );
    return jsonResponse(request, result);
  }

  if (request.method === "POST" && path === "/suggestions") {
    const user = await participant(request, true);
    const suggestion = await createSuggestion(client, user!.id, await jsonBody(request));
    return jsonResponse(request, { suggestion }, 201);
  }

  const suggestionMatch = /^\/suggestions\/([^/]+)$/.exec(path);
  if (request.method === "DELETE" && suggestionMatch) {
    const user = await participant(request, true);
    await deleteSuggestion(client, user!.id, suggestionMatch[1]);
    return new Response(null, { status: 204, headers: corsHeaders(request) });
  }

  if (request.method === "GET" && path === "/vote-results") {
    const user = await participant(request, false);
    return jsonResponse(request, await getVoteResults(client, user?.id));
  }

  if (request.method === "PUT" && path === "/vote") {
    const user = await participant(request, true);
    await replaceVote(client, user!.id, await jsonBody(request));
    return jsonResponse(request, { ok: true });
  }

  if (["GET", "POST", "PUT", "DELETE"].includes(request.method)) {
    throw new ApiError(404, "NOT_FOUND", "Route was not found.");
  }
  throw new ApiError(405, "METHOD_NOT_ALLOWED", "Method is not allowed.");
}

Deno.serve(async (request) => {
  try {
    return await handle(request);
  } catch (error) {
    return errorResponse(request, toApiError(error));
  }
});
