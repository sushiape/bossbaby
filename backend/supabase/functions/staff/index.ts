import { adminClient } from "../_shared/auth.ts";
import { toApiError } from "../_shared/errors.ts";
import { errorResponse } from "../_shared/response.ts";
import { handleStaffRequest } from "./route.ts";

Deno.serve(async (request) => {
  try {
    return await handleStaffRequest(request, adminClient);
  } catch (error) {
    return errorResponse(request, toApiError(error));
  }
});
