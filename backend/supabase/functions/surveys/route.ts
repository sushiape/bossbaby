import { assertAllowedOrigin, corsHeaders } from "../_shared/cors.ts";
import { ApiError } from "../_shared/errors.ts";
import { jsonResponse } from "../_shared/response.ts";
import type { SurveyRepository } from "./repository.ts";
import { getOpenSurvey, getSurvey, submitResponse } from "./surveys.ts";

type RepositoryFactory = () => SurveyRepository;
type ParticipantResolver = (request: Request) => Promise<string | null>;

function routePath(url: URL): string {
  const marker = "/surveys";
  const markerIndex = url.pathname.lastIndexOf(marker);
  if (markerIndex < 0) return url.pathname;
  return url.pathname.slice(markerIndex + marker.length) || "/";
}

async function jsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw new ApiError(400, "VALIDATION_FAILED", "Request body must contain valid JSON.");
  }
}

const KEY_PATTERN = /^[a-z][a-z0-9_]*$/;

function assertKeyShape(value: string, label: string): string {
  if (!KEY_PATTERN.test(value)) {
    throw new ApiError(400, "VALIDATION_FAILED", `${label} is not a valid key.`);
  }
  return value;
}

export async function handleSurveyRequest(
  request: Request,
  repositoryFactory: RepositoryFactory,
  resolveParticipant: ParticipantResolver,
): Promise<Response> {
  assertAllowedOrigin(request);
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(request) });
  }

  const url = new URL(request.url);
  const path = routePath(url);

  // The open survey for a family: what the landing page asks for, since it
  // knows which survey it is running but not which version is current.
  if (request.method === "GET" && path === "/open") {
    const family = url.searchParams.get("family");
    if (!family) {
      throw new ApiError(400, "VALIDATION_FAILED", "A survey family is required.");
    }
    const survey = await getOpenSurvey(
      repositoryFactory(),
      assertKeyShape(family, "Survey family"),
    );
    return jsonResponse(request, { survey });
  }

  const surveyMatch = /^\/([^/]+)$/.exec(path);
  if (request.method === "GET" && surveyMatch) {
    const survey = await getSurvey(
      repositoryFactory(),
      assertKeyShape(surveyMatch[1], "Survey key"),
    );
    return jsonResponse(request, { survey });
  }

  const responseMatch = /^\/([^/]+)\/responses$/.exec(path);
  if (request.method === "POST" && responseMatch) {
    const body = await jsonBody(request);
    const response = await submitResponse(
      repositoryFactory(),
      assertKeyShape(responseMatch[1], "Survey key"),
      body,
      await resolveParticipant(request),
    );
    return jsonResponse(request, { response }, 201);
  }

  if (["GET", "POST", "PUT", "DELETE"].includes(request.method)) {
    throw new ApiError(404, "NOT_FOUND", "Route was not found.");
  }
  throw new ApiError(405, "METHOD_NOT_ALLOWED", "Method is not allowed.");
}
