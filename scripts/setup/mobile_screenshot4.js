const { chromium, devices } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const pixel5 = devices['Pixel 5'];
  const context = await browser.newContext({ ...pixel5 });
  const page = await context.newPage();
  
  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(4000);
  await page.screenshot({ path: 'mobile_home.png', fullPage: true });

  await page.goto('http://localhost:5173/admin');
  await page.waitForTimeout(4000);
  await page.screenshot({ path: 'mobile_admin.png', fullPage: true });

  await browser.close();
  console.log('Done!');
})();
