import { test, expect } from "@playwright/test";

test("homepage loads with correct title", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/MidRange/);
});

test("homepage displays store name", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("MidRange")).toBeVisible();
});
