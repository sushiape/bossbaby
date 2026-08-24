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

export interface StaffIdentity {
  user: User;
  capabilities: string[];
}

/**
 * Verifies the caller's identity and asserts one capability.
 *
 * Authorization is decided here, on the verified JWT, before any data access.
 * The frontend's capability knowledge is presentation only.
 */
export async function staffMember(
  request: Request,
  admin: SupabaseClient,
  requiredCapability: string,
): Promise<StaffIdentity> {
  const identity = await staffIdentity(request, admin);
  if (!identity.capabilities.includes(requiredCapability)) {
    throw new ApiError(403, "FORBIDDEN", "This account lacks the required capability.");
  }
  return identity;
}

/**
 * Verifies the caller and loads their capabilities without asserting a specific
 * one. Any identity holding at least one grant is a Staff Member; an identity
 * holding none is an App User and is refused.
 */
export async function staffIdentity(
  request: Request,
  admin: SupabaseClient,
): Promise<StaffIdentity> {
  let user: User | null;
  try {
    user = await participant(request, true);
  } catch (error) {
    // participant() speaks for the public site; restate it for this surface.
    if (error instanceof ApiError && error.status === 401) {
      throw new ApiError(401, error.code, "Staff sign-in is required.");
    }
    throw error;
  }
  if (!user) throw new ApiError(401, "AUTHENTICATION_REQUIRED", "Staff sign-in is required.");

  const { data, error } = await admin
    .from("staff_capability_grants")
    .select("capability")
    .eq("user_id", user.id);
  if (error) throw error;

  const capabilities = (data ?? []).map((row) => row.capability as string);
  if (capabilities.length === 0) {
    throw new ApiError(403, "FORBIDDEN", "This account has no staff capabilities.");
  }
  return { user, capabilities };
}
