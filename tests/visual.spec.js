import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  test('Home Page matches snapshot', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); 
    await expect(page).toHaveScreenshot('home-page.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.1, 
    });
  });

  test('Offers Page matches snapshot', async ({ page }) => {
    await page.goto('http://localhost:5173/offers');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await expect(page).toHaveScreenshot('offers-page.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.1,
    });
  });
});
