import { createClient, type SupabaseClient, type User } from "npm:@supabase/supabase-js@2.112.3";
import { ApiError } from "./errors.ts";

function requiredEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) throw new ApiError(500, "INTERNAL_ERROR", `Missing server configuration: ${name}.`);
  return value;
}

function publicKey(): string {
  return Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? requiredEnv("SUPABASE_ANON_KEY");
}

export function adminClient(): SupabaseClient {
  const secret = Deno.env.get("SUPABASE_SECRET_KEY") ?? requiredEnv("SUPABASE_SERVICE_ROLE_KEY");
  return createClient(requiredEnv("SUPABASE_URL"), secret, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function bearerToken(request: Request): string | null {
  const authorization = request.headers.get("authorization");
  if (!authorization) return null;
  const match = /^Bearer\s+(.+)$/i.exec(authorization.trim());
  if (!match) throw new ApiError(401, "INVALID_TOKEN", "Authorization token is invalid.");
  return match[1];
}

export async function participant(request: Request, required: boolean): Promise<User | null> {
  const token = bearerToken(request);
  if (!token) {
    if (required) {
      throw new ApiError(401, "AUTHENTICATION_REQUIRED", "Participant identity is required.");
    }
    return null;
  }

  const authClient = createClient(requiredEnv("SUPABASE_URL"), publicKey(), {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data, error } = await authClient.auth.getUser(token);
  if (error || !data.user) {
    throw new ApiError(401, "INVALID_TOKEN", "Authorization token is invalid or expired.");
  }
  return data.user;
}
