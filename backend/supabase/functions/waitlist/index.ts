import { adminClient } from "../_shared/auth.ts";
import { toApiError } from "../_shared/errors.ts";
import { errorResponse } from "../_shared/response.ts";
import { createWaitlistSubscriptionRepository } from "./repository.ts";
import { handleWaitlistRequest } from "./route.ts";

Deno.serve(async (request) => {
  try {
    return await handleWaitlistRequest(
      request,
      () => createWaitlistSubscriptionRepository(adminClient()),
    );
  } catch (error) {
    return errorResponse(request, toApiError(error));
  }
});
