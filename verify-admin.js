const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  // Wait a moment before capturing to ensure Vercel has deployed the latest code.
  // We'll give it a good timeout.
  await page.goto('https://chaitalisartbizzz.vercel.app/admin/site-editor', { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(5000); // give it time to load data if any

  await page.screenshot({ path: 'verify-admin.png', fullPage: true });
  console.log('Saved verify-admin.png');
  
  await browser.close();
})();
