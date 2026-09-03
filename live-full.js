const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  // First visit to warm up CDN
  await page.goto('https://chaitalisartbizzz.vercel.app/', { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(3000);

  // Click Enter Gallery
  const btn = await page.$('button:has-text("Enter Gallery")');
  if (btn) {
    await btn.click();
    console.log('Clicked Enter Gallery');
  }

  // Wait generously for everything to fully render
  await page.waitForTimeout(8000);

  await page.screenshot({ path: 'live-full.png', fullPage: false });
  console.log('Done');
  await browser.close();
})();
