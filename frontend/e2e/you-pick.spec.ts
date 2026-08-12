import { expect, test } from "@playwright/test";

test.describe("You Pick full-stack workflow", () => {
  test("anonymous participant votes, changes vote, paginates, creates, and removes suggestion", async ({ page }) => {
    await page.goto("/you-pick");
    await expect(page.getByRole("heading", { name: "You pick. We make." })).toBeVisible();
    await expect(page.getByText(/log in|register/i)).toHaveCount(0);

    const feed = page.getByTestId("suggestions-scroll-area");
    await expect(feed.locator("article")).toHaveCount(8);
    await feed.getByRole("button", { name: "Show more" }).click();
    await expect(feed.locator("article")).toHaveCount(16);
    await feed.getByRole("button", { name: "Show more" }).click();
    await expect(feed.locator("article")).toHaveCount(18);
    await expect(feed.getByRole("button", { name: "Show more" })).toHaveCount(0);

    await page.getByRole("button", { name: /100 ml Bottle/ }).click();
    await page.getByRole("button", { name: "Submit vote" }).click();
    await expect(page.getByText("Thank you. Your vote is counted. ✨ Changed your mind? Vote again.")).toBeVisible();

    await page.reload();
    await expect(page.getByRole("button", { name: "Change my vote" })).toBeVisible();
    await page.getByRole("button", { name: "Change my vote" }).click();
    await page.getByRole("button", { name: /250 ml Can.*More to sip/ }).click();
    await page.getByRole("button", { name: "Submit vote" }).click();
    await expect(page.getByRole("button", { name: "Change my vote" })).toBeVisible();

    const idea = `E2E mango idea ${Date.now()}`;
    await page.getByLabel("What should we make next?").fill(idea);
    await page.getByLabel("Name").fill("E2E participant");
    await page.getByRole("button", { name: "Submit suggestion" }).click();
    await expect(page.getByText("Thanks — suggestion saved and shared.")).toBeVisible();
    const ownSuggestion = page.locator("article").filter({ hasText: idea });
    await expect(ownSuggestion).toBeVisible();
    await ownSuggestion.getByRole("button", { name: "Remove" }).click();
    await expect(ownSuggestion).toHaveCount(0);
  });

  test("backend failure renders inline retry UI while route remains usable", async ({ page }) => {
    await page.route("**/functions/v1/you-pick/suggestions**", (route) => route.abort("failed"));
    await page.route("**/functions/v1/you-pick/vote-results**", (route) => route.abort("failed"));
    await page.goto("/you-pick");
    await expect(page.getByRole("heading", { name: "You pick. We make." })).toBeVisible();
    await expect(page.getByRole("button", { name: "Retry suggestions" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Retry", exact: true })).toBeVisible();
  });
});
