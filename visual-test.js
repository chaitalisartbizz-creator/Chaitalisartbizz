const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  
  console.log('Loading live site...');
  await page.goto('https://chaitalisartbizzz.vercel.app/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  
  console.log('Taking screenshot of the Entry Gate...');
  await page.screenshot({ path: '1-entry-gate.png' });
  
  const btn = page.locator('button', { hasText: 'Enter Gallery' });
  await btn.click({ force: true });
  console.log('Clicked Enter Gallery');
  
  await page.waitForTimeout(1000);
  console.log('Taking screenshot of the Loading Phase...');
  await page.screenshot({ path: '2-loading-phase.png' });
  
  await page.waitForTimeout(4000);
  console.log('Taking screenshot of the fully loaded Homepage...');
  await page.screenshot({ path: '3-homepage.png', fullPage: true });
  
  await browser.close();
})();
