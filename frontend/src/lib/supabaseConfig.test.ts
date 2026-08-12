import assert from "node:assert/strict";
import test from "node:test";
import { resolveSupabaseConfig } from "./supabaseConfig.ts";

test("accepts and normalizes an HTTP Supabase configuration", () => {
  assert.deepEqual(resolveSupabaseConfig("  https://project.supabase.co/  ", "  anon-key  "), {
    url: "https://project.supabase.co/",
    anonKey: "anon-key",
  });
});

test("rejects malformed Supabase URLs before client creation", () => {
  assert.equal(resolveSupabaseConfig("not-a-url", "anon-key"), null);
  assert.equal(resolveSupabaseConfig('"https://project.supabase.co"', "anon-key"), null);
  assert.equal(resolveSupabaseConfig("ftp://project.supabase.co", "anon-key"), null);
});

test("rejects missing configuration values", () => {
  assert.equal(resolveSupabaseConfig(undefined, "anon-key"), null);
  assert.equal(resolveSupabaseConfig("https://project.supabase.co", "  "), null);
});
