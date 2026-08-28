import assert from "node:assert/strict";
import test from "node:test";
import { getRouteByPath, navigationRoutes, routes } from "./routes.ts";

test("places App between Bossbabes and About", () => {
  assert.deepEqual(
    navigationRoutes.map(({ navigationLabel }) => navigationLabel),
    ["Drinks", "Bossbabes", "App", "About"],
  );
});

// BBDEV-46: the "AI machine" page described the formula engine and the modular
// cartridge dosing. It stays off the public site until the patent application is
// filed -- unlike /admin, being unlisted is not enough, the URL must not resolve.
test("the AI machine page is unreachable, not merely unlisted", () => {
  assert.equal(getRouteByPath("/how-it-works"), undefined);
  assert.equal(
    navigationRoutes.some(({ navigationLabel }) => navigationLabel === "AI machine"),
    false,
    "the AI machine tab must not appear in public navigation",
  );
});

test("/app is a real page that keeps the public header", () => {
  const app = getRouteByPath("/app");
  assert.ok(app, "/app must resolve to a route");
  assert.equal(app?.navigationLabel, "App");
  // standalone would strip the public header -- the opposite of what /app needs.
  assert.equal(app?.standalone, undefined);
});

test("the Staff Workspace is reachable at /admin but never listed in navigation", () => {
  const admin = getRouteByPath("/admin");
  assert.ok(admin, "/admin must resolve to a route");
  assert.equal(admin?.standalone, true);
  assert.equal(
    navigationRoutes.some(({ id }) => id === "admin"),
    false,
    "/admin must not appear in public navigation",
  );
});

test("only the admin route is standalone", () => {
  assert.deepEqual(
    routes.filter((route) => route.standalone).map((route) => route.id),
    ["admin"],
  );
});
