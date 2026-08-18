import assert from "node:assert/strict";
import { ApiError } from "./errors.ts";
import { assertAllowedOrigin, corsHeaders } from "./cors.ts";

function withDefaultOrigins(test: () => void): void {
  const previous = Deno.env.get("ALLOWED_ORIGINS");
  Deno.env.delete("ALLOWED_ORIGINS");
  try {
    test();
  } finally {
    if (previous === undefined) Deno.env.delete("ALLOWED_ORIGINS");
    else Deno.env.set("ALLOWED_ORIGINS", previous);
  }
}

Deno.test("local browser origin is allowed by default", () => {
  withDefaultOrigins(() => {
    const request = new Request("http://localhost/", {
      headers: { Origin: "http://localhost:3000" },
    });
    assert.doesNotThrow(() => assertAllowedOrigin(request));
    assert.equal(
      new Headers(corsHeaders(request)).get("Access-Control-Allow-Origin"),
      "http://localhost:3000",
    );
  });
});

Deno.test("unknown browser origin is rejected", () => {
  withDefaultOrigins(() => {
    const request = new Request("http://localhost/", {
      headers: { Origin: "https://untrusted.example" },
    });
    assert.throws(
      () => assertAllowedOrigin(request),
      (error: unknown) => error instanceof ApiError && error.status === 403,
    );
  });
});
