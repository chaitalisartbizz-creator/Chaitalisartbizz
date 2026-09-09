const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  
  const errors = [];
  page.on('pageerror', err => errors.push('PAGE ERROR: ' + err.message));
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push('CONSOLE ERROR: ' + msg.text());
  });
  
  await page.goto('https://chaitalisartbizzz.vercel.app/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  
  // Click enter gallery
  const btn = await page.$('button:has-text("Enter Gallery")');
  if (btn) {
    await btn.click();
    await page.waitForTimeout(3000);
  } else {
    console.log("No Enter Gallery button found.");
  }
  
  await page.screenshot({ path: 'debug-desktop.png', fullPage: true });
  
  console.log('Errors caught:');
  console.log(JSON.stringify(errors, null, 2));
  
  await browser.close();
})();
