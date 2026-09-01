const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();
  
  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'home.png' });

  await page.goto('http://localhost:5173/offers');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'offers.png' });

  await page.goto('http://localhost:5173/hub');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'hub.png' });

  await browser.close();
  console.log('Screenshots saved!');
})();
