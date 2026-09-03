const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  
  await page.goto('https://chaitalisartbizzz.vercel.app/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  
  const btn = page.locator('button', { hasText: 'Enter Gallery' });
  await btn.click({ force: true });
  
  await page.waitForTimeout(6000);
  
  const state = await page.evaluate(() => {
    const main = document.querySelector('main');
    const header = document.querySelector('header') || document.querySelector('[class*="Header"]');
    return {
      mainExists: !!main,
      headerExists: !!header,
      imgs: main ? main.querySelectorAll('img').length : 0,
      text: document.body.innerText.substring(0, 150)
    };
  });
  
  console.log('Final Page State:', state);
  await browser.close();
})();
