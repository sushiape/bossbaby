import assert from "node:assert/strict";
import test from "node:test";
import { getRouteByPath, navigationRoutes, routes } from "./routes.ts";

test("places the App document navigation between Bossbabes and About", () => {
  assert.deepEqual(
    navigationRoutes.map(({ navigationLabel }) => navigationLabel),
    ["Drinks", "AI machine", "Bossbabes", "App", "About"],
  );
  assert.deepEqual(
    navigationRoutes.find(({ id }) => id === "app"),
    {
      id: "app",
      path: "/app",
      navigationLabel: "App",
      documentNavigation: true,
    },
  );
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
