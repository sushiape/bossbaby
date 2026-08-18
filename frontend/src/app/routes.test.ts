import assert from "node:assert/strict";
import test from "node:test";
import { navigationRoutes } from "./routes.ts";

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
