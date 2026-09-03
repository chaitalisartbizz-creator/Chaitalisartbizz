const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  page.on('console', msg => {
    console.log(`[${msg.type()}]`, msg.text());
  });
  page.on('pageerror', err => {
    console.log('[PAGE ERROR]', err.message, err.stack);
  });
  
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  
  console.log('Waiting for Enter Gallery button...');
  try {
    const btn = page.locator('button', { hasText: 'Enter Gallery' });
    await btn.waitFor({ state: 'visible', timeout: 5000 });
    console.log('Button found! Clicking...');
    await btn.click();
    console.log('Clicked. Waiting for navigation/render...');
    await page.waitForTimeout(3000);
  } catch(e) {
    console.log('Error finding/clicking button:', e.message);
  }
  
  await page.screenshot({ path: 'local-screenshot.png', fullPage: true });
  console.log('Screenshot saved.');
  
  const mainInfo = await page.evaluate(() => {
    const main = document.querySelector('main');
    return main ? {
      height: main.getBoundingClientRect().height,
      htmlLength: main.innerHTML.length
    } : null;
  });
  console.log(`Main element info:`, mainInfo);
  
  await browser.close();
})();
