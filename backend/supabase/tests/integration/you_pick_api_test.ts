import { createClient } from "npm:@supabase/supabase-js@2.112.3";

const url = Deno.env.get("SUPABASE_URL")!;
const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const endpoint = `${url}/functions/v1/you-pick`;

function assert(
  condition: unknown,
  message = "Assertion failed",
): asserts condition {
  if (!condition) throw new Error(message);
}

async function participantToken(): Promise<string> {
  const client = createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
  const { data, error } = await client.auth.signInAnonymously();
  if (error || !data.session) {
    throw error ?? new Error("Anonymous sign-in returned no session");
  }
  return data.session.access_token;
}

async function request(
  path: string,
  options: {
    method?: string;
    token?: string;
    body?: unknown;
    origin?: string;
  } = {},
): Promise<{ response: Response; value: Record<string, unknown> | null }> {
  const response = await fetch(`${endpoint}${path}`, {
    method: options.method ?? "GET",
    headers: {
      apikey: anonKey,
      "Content-Type": "application/json",
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      ...(options.origin ? { Origin: options.origin } : {}),
    },
    ...(options.body === undefined ? {} : { body: JSON.stringify(options.body) }),
  });
  const value = response.status === 204 ? null : await response.json() as Record<string, unknown>;
  return { response, value };
}

Deno.test("You Pick API enforces public safety, participant ownership, replacement, and pagination", async () => {
  assert(
    url?.startsWith("http://127.0.0.1") || url?.startsWith("http://localhost"),
    "Tests may target local Supabase only",
  );

  const publicSuggestions = await request("/suggestions?limit=8");
  assert(publicSuggestions.response.status === 200);
  assert(!JSON.stringify(publicSuggestions.value).includes("user_id"));
  assert(!JSON.stringify(publicSuggestions.value).includes("userId"));
  assert(!JSON.stringify(publicSuggestions.value).includes("canDelete"));

  const publicResultsBefore = await request("/vote-results");
  assert(publicResultsBefore.response.status === 200);
  assert(
    !JSON.stringify(publicResultsBefore.value).includes("participantHasVoted"),
  );
  assert(!JSON.stringify(publicResultsBefore.value).includes("user_id"));

  const invalid = await request("/vote-results", { token: "invalid-token" });
  assert(invalid.response.status === 401);
  const unauthenticatedWrite = await request("/suggestions", {
    method: "POST",
    body: { authorName: "No token", text: "Must fail" },
  });
  assert(unauthenticatedWrite.response.status === 401);
  const forbiddenOrigin = await request("/vote-results", {
    origin: "https://evil.example",
  });
  assert(forbiddenOrigin.response.status === 403);

  const ownerToken = await participantToken();
  const otherToken = await participantToken();
  const createdIds: string[] = [];
  const created = await request("/suggestions", {
    method: "POST",
    token: ownerToken,
    body: { authorName: "Integration owner", text: "Owner-only deletion" },
  });
  assert(created.response.status === 201);
  const createdSuggestion = created.value?.suggestion as Record<
    string,
    unknown
  >;
  const createdId = createdSuggestion.id as string;
  createdIds.push(createdId);
  assert(createdSuggestion.canDelete === true);
  assert(!JSON.stringify(createdSuggestion).includes("user_id"));

  const ownerRead = await request("/suggestions?limit=8", {
    token: ownerToken,
  });
  assert(ownerRead.response.status === 200);
  const ownerRows = ownerRead.value?.suggestions as Array<
    Record<string, unknown>
  >;
  assert(ownerRows.find((item) => item.id === createdId)?.canDelete === true);
  assert(!JSON.stringify(ownerRead.value).includes("user_id"));

  const otherDelete = await request(`/suggestions/${createdId}`, {
    method: "DELETE",
    token: otherToken,
  });
  assert(otherDelete.response.status === 404);
  const spoofedCreate = await request("/suggestions", {
    method: "POST",
    token: ownerToken,
    body: {
      authorName: "Spoof",
      text: "Rejected",
      user_id: crypto.randomUUID(),
    },
  });
  assert(spoofedCreate.response.status === 400);
  const longName = await request("/suggestions", {
    method: "POST",
    token: ownerToken,
    body: { authorName: "x".repeat(61), text: "Rejected" },
  });
  assert(longName.response.status === 400);
  const longText = await request("/suggestions", {
    method: "POST",
    token: ownerToken,
    body: { authorName: "Rejected", text: "x".repeat(501) },
  });
  assert(longText.response.status === 400);

  const emptyVote = await request("/vote", {
    method: "PUT",
    token: ownerToken,
    body: { pack: [], flavour: [] },
  });
  assert(emptyVote.response.status === 400);
  const unknownVote = await request("/vote", {
    method: "PUT",
    token: ownerToken,
    body: { pack: ["Tampered"], flavour: [] },
  });
  assert(unknownVote.response.status === 400);

  const firstVote = await request("/vote", {
    method: "PUT",
    token: ownerToken,
    body: {
      pack: ["100 ml Bottle · A concentrated daily shot"],
      flavour: ["Mixed Berries"],
    },
  });
  assert(
    firstVote.response.status === 200,
    `First vote returned ${firstVote.response.status}: ${JSON.stringify(firstVote.value)}`,
  );
  const ownerResults = await request("/vote-results", { token: ownerToken });
  assert(ownerResults.response.status === 200);
  assert(ownerResults.value?.participantHasVoted === true);
  const firstTotal = ownerResults.value?.totalParticipants as number;

  const replacement = await request("/vote", {
    method: "PUT",
    token: ownerToken,
    body: {
      pack: ["250 ml Can · More to sip, still sleek"],
      flavour: ["Mango Peach"],
    },
  });
  assert(replacement.response.status === 200);
  const afterReplacement = await request("/vote-results", {
    token: ownerToken,
  });
  assert(
    afterReplacement.value?.totalParticipants === firstTotal,
    "Replacing a vote must not increase participant total",
  );
  const replacementCounts = afterReplacement.value?.counts as Record<
    string,
    Record<string, number>
  >;
  assert(replacementCounts.pack["100 ml Bottle · A concentrated daily shot"] === 0);
  assert(replacementCounts.pack["250 ml Can · More to sip, still sleek"] === 1);
  assert(replacementCounts.flavour["Mixed Berries"] === 1);
  assert(replacementCounts.flavour["Mango Peach"] === 2);

  for (let index = 0; index < 17; index += 1) {
    const result = await request("/suggestions", {
      method: "POST",
      token: ownerToken,
      body: { authorName: "Pagination test", text: `Pagination idea ${index}` },
    });
    assert(result.response.status === 201);
    createdIds.push(
      (result.value?.suggestion as Record<string, unknown>).id as string,
    );
  }

  const seen = new Set<string>();
  let cursor: string | undefined;
  let reachedEnd = false;
  for (let pageNumber = 0; pageNumber < 100; pageNumber += 1) {
    const page = await request(
      `/suggestions?limit=8${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ""}`,
      {
        token: ownerToken,
      },
    );
    assert(page.response.status === 200);
    const rows = page.value?.suggestions as Array<Record<string, unknown>>;
    for (const row of rows) {
      assert(
        !seen.has(row.id as string),
        "Cursor pages must not contain duplicates",
      );
      seen.add(row.id as string);
    }
    if (page.value?.hasMore === false) {
      reachedEnd = true;
      break;
    }
    cursor = page.value?.nextCursor as string;
    assert(Boolean(cursor), "Non-final page requires cursor");
  }
  assert(reachedEnd, "Pagination must terminate with hasMore=false");
  assert(
    createdIds.every((id) => seen.has(id)),
    "Pagination must expose every created suggestion",
  );

  const admin = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  const ownerUser = await admin.auth.getUser(ownerToken);
  assert(ownerUser.data.user?.id);
  const databaseLimit = await admin.from("suggestions").insert({
    user_id: ownerUser.data.user.id,
    author_name: "DB check",
    text: "x".repeat(501),
  });
  assert(
    databaseLimit.error?.code === "23514",
    "Database must enforce suggestion text limit",
  );
  const databaseNameLimit = await admin.from("suggestions").insert({
    user_id: ownerUser.data.user.id,
    author_name: "x".repeat(61),
    text: "DB name check",
  });
  assert(
    databaseNameLimit.error?.code === "23514",
    "Database must enforce suggestion name limit",
  );
  const databaseVoteLimit = await admin.from("youpick_votes").insert({
    poll_id: "default",
    user_id: crypto.randomUUID(),
    selections: { pack: ["Tampered"], flavour: [] },
  });
  assert(
    databaseVoteLimit.error?.code === "23514",
    "Database must reject unknown vote options",
  );
  const voteRows = await admin
    .from("youpick_votes")
    .select("id", { count: "exact", head: true })
    .eq("user_id", ownerUser.data.user.id);
  assert(voteRows.count === 1, "Database must preserve one vote per participant and poll");

  const browserClient = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  const directRead = await browserClient.from("suggestions").select("id").limit(
    1,
  );
  assert(
    Boolean(directRead.error),
    "Direct browser table reads must be revoked",
  );

  for (const id of createdIds) {
    const removed = await request(`/suggestions/${id}`, {
      method: "DELETE",
      token: ownerToken,
    });
    assert(removed.response.status === 204);
  }
});
