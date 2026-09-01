import { test, expect } from '@playwright/test';

test.describe('Chaitali Artbizz Rebrand Visual & E2E Tests', () => {
  test('homepage has correct branding and colors', async ({ page }) => {
    // Go to homepage
    await page.goto('http://localhost:5173/');

    // Ensure the page loads and loader finishes
    // PageLoader has a button "Enter Gallery ✨"
    const enterBtn = page.getByRole('button', { name: /Enter Gallery/i });
    await expect(enterBtn).toBeVisible({ timeout: 10000 });
    await enterBtn.click();
    
    // Check page title
    await expect(page).toHaveTitle(/Chaitali's Artbizz/i);

    // Verify brand name in Header
    await expect(page.getByText("CHAITALI'S", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("ARTBIZZ", { exact: true }).first()).toBeVisible();

    // Verify art categories exist (instead of food)
    await expect(page.getByText(/Custom Portraits/i).first()).toBeVisible();
    await expect(page.getByText(/Resin Art/i).first()).toBeVisible();

    // Take a screenshot of the homepage for visual testing
    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: false,
      maxDiffPixelRatio: 0.1
    });
  });

  test('offers page has art deals', async ({ page }) => {
    await page.goto('http://localhost:5173/offers');

    // Loader might appear here too
    const enterBtn = page.getByRole('button', { name: /Enter Gallery/i });
    if (await enterBtn.isVisible()) {
      await enterBtn.click();
    }

    // Check specific coupon codes are present
    await expect(page.getByText('ARTFEST25')).toBeVisible();
    await expect(page.getByText('PORTRAIT20')).toBeVisible();
    
    // Screenshot
    await expect(page).toHaveScreenshot('offers.png', {
      fullPage: false,
      maxDiffPixelRatio: 0.1
    });
  });
});
