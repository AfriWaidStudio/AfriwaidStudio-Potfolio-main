import { expect, test } from "@playwright/test";

test("production server loads homepage and portal deep link", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#root")).toBeAttached();
  await expect(page).toHaveTitle(/Afriwaid Studio/i);

  await page.goto("/portal/projects");
  await expect(page.locator("#root")).toBeAttached();
  await expect(page).not.toHaveURL(/\/assets\//);
});
