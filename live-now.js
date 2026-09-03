const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('https://chaitalisartbizzz.vercel.app/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  const btn = await page.$('button:has-text("Enter Gallery")');
  if (btn) { await btn.click(); await page.waitForTimeout(5000); }
  await page.screenshot({ path: 'live-now.png', fullPage: false });
  console.log('Done');
  await browser.close();
})();
