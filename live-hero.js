const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('https://chaitalisartbizzz.vercel.app/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);

  // Click Enter Gallery
  const btn = await page.$('button:has-text("Enter Gallery")');
  if (btn) {
    await btn.click();
    console.log('Clicked Enter Gallery');
    // Wait for loader to fully dismiss and content to paint
    await page.waitForTimeout(6000);
  }

  // Wait for at least one image to be visible
  try {
    await page.waitForSelector('img[alt="Hero Banner"]', { timeout: 8000 });
    console.log('Hero image found!');
    await page.waitForTimeout(1000);
  } catch(e) {
    console.log('Hero image timeout, screenshotting anyway');
  }

  await page.screenshot({ path: 'live-hero.png', fullPage: false });
  console.log('Screenshot saved');
  await browser.close();
})();
