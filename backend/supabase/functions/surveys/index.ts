import { adminClient, participant } from "../_shared/auth.ts";
import { toApiError } from "../_shared/errors.ts";
import { errorResponse } from "../_shared/response.ts";
import { createSurveyRepository } from "./repository.ts";
import { handleSurveyRequest } from "./route.ts";

Deno.serve(async (request) => {
  try {
    return await handleSurveyRequest(
      request,
      () => createSurveyRepository(adminClient()),
      // Surveys are anonymous: a signed-in participant is honoured when a token
      // is present, but no token is not an error.
      async (incoming) => (await participant(incoming, false))?.id ?? null,
    );
  } catch (error) {
    return errorResponse(request, toApiError(error));
  }
});
