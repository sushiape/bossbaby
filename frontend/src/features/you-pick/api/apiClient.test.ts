import { beforeEach, describe, expect, it, vi } from "vitest";

const { currentSession } = vi.hoisted(() => ({ currentSession: vi.fn() }));
vi.mock("../../../lib/supabaseClient", () => ({
  currentSession,
  requireSupabaseConfig: () => ({ url: "http://local.test", anonKey: "anon-key" }),
}));

import { apiRequest } from "./apiClient";

describe("apiRequest", () => {
  beforeEach(() => {
    currentSession.mockResolvedValue({ access_token: "participant-token" });
    vi.stubGlobal("fetch", vi.fn());
  });

  it("returns JSON and attaches safe browser credentials", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    await expect(apiRequest<{ ok: true }>("/vote-results")).resolves.toEqual({ ok: true });
    expect(fetch).toHaveBeenCalledWith(
      "http://local.test/functions/v1/you-pick/vote-results",
      expect.objectContaining({
        headers: expect.objectContaining({ apikey: "anon-key", Authorization: "Bearer participant-token" }),
      }),
    );
  });

  it("maps structured service errors", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ error: { code: "VALIDATION_FAILED", message: "Bad vote" } }), { status: 400 }),
    );
    await expect(apiRequest("/vote")).rejects.toMatchObject({
      status: 400,
      code: "VALIDATION_FAILED",
      message: "Bad vote",
    });
  });

  it("rejects protected calls before network when identity is absent", async () => {
    currentSession.mockResolvedValue(null);
    await expect(apiRequest("/vote", { method: "PUT" }, "required")).rejects.toMatchObject({ status: 401 });
    expect(fetch).not.toHaveBeenCalled();
  });
});
