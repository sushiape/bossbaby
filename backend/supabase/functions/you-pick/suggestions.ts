import type { SupabaseClient } from "npm:@supabase/supabase-js@2.112.3";
import { ApiError } from "../_shared/errors.ts";
import type { CursorValue, SuggestionResource, SuggestionRow } from "./types.ts";
import { validateSuggestion } from "./validation.ts";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function encodeCursor(value: CursorValue): string {
  return btoa(JSON.stringify(value)).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

export function decodeCursor(value: string): CursorValue {
  try {
    const normalized = value.replaceAll("-", "+").replaceAll("_", "/");
    const decoded = JSON.parse(atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=")));
    if (
      !decoded ||
      typeof decoded.createdAt !== "string" ||
      Number.isNaN(Date.parse(decoded.createdAt)) ||
      typeof decoded.id !== "string" ||
      !UUID_PATTERN.test(decoded.id)
    ) {
      throw new Error("invalid cursor fields");
    }
    return { createdAt: new Date(decoded.createdAt).toISOString(), id: decoded.id };
  } catch {
    throw new ApiError(400, "VALIDATION_FAILED", "Suggestion cursor is invalid.", {
      cursor: "invalid",
    });
  }
}

export function normalizeSuggestion(
  row: SuggestionRow,
  participantId?: string,
): SuggestionResource {
  return {
    id: row.id,
    authorName: row.author_name,
    text: row.text,
    createdAt: row.created_at,
    ...(participantId ? { canDelete: row.user_id === participantId } : {}),
  };
}

export async function listSuggestions(
  client: SupabaseClient,
  participantId: string | undefined,
  cursorValue: string | null,
  requestedLimit: string | null,
): Promise<{ suggestions: SuggestionResource[]; nextCursor: string | null; hasMore: boolean }> {
  const parsedLimit = requestedLimit === null ? 8 : Number(requestedLimit);
  if (!Number.isInteger(parsedLimit) || parsedLimit < 1 || parsedLimit > 50) {
    throw new ApiError(400, "VALIDATION_FAILED", "Suggestion limit must be between 1 and 50.", {
      limit: "invalid",
    });
  }
  const cursor = cursorValue ? decodeCursor(cursorValue) : null;
  let query = client
    .from("suggestions")
    .select("id,user_id,author_name,text,created_at")
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .limit(parsedLimit + 1);

  if (cursor) {
    query = query.or(
      `created_at.lt.${cursor.createdAt},and(created_at.eq.${cursor.createdAt},id.lt.${cursor.id})`,
    );
  }

  const { data, error } = await query;
  if (error) throw new ApiError(500, "INTERNAL_ERROR", "Suggestions could not be loaded.");
  const rows = (data ?? []) as SuggestionRow[];
  const hasMore = rows.length > parsedLimit;
  const pageRows = rows.slice(0, parsedLimit);
  const last = pageRows.at(-1);
  return {
    suggestions: pageRows.map((row) => normalizeSuggestion(row, participantId)),
    hasMore,
    nextCursor: hasMore && last ? encodeCursor({ createdAt: last.created_at, id: last.id }) : null,
  };
}

export async function createSuggestion(
  client: SupabaseClient,
  participantId: string,
  value: unknown,
): Promise<SuggestionResource> {
  const input = validateSuggestion(value);
  const { data, error } = await client
    .from("suggestions")
    .insert({ user_id: participantId, author_name: input.authorName, text: input.text })
    .select("id,user_id,author_name,text,created_at")
    .single();
  if (error || !data) throw new ApiError(500, "INTERNAL_ERROR", "Suggestion could not be saved.");
  return normalizeSuggestion(data as SuggestionRow, participantId);
}

export async function deleteSuggestion(
  client: SupabaseClient,
  participantId: string,
  id: string,
): Promise<void> {
  if (!UUID_PATTERN.test(id)) throw new ApiError(404, "NOT_FOUND", "Suggestion was not found.");
  const { data, error } = await client
    .from("suggestions")
    .delete()
    .eq("id", id)
    .eq("user_id", participantId)
    .select("id")
    .maybeSingle();
  if (error) throw new ApiError(500, "INTERNAL_ERROR", "Suggestion could not be removed.");
  if (!data) throw new ApiError(404, "NOT_FOUND", "Suggestion was not found.");
}
