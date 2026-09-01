const { chromium, devices } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const pixel5 = devices['Pixel 5'];
  const context = await browser.newContext({
    ...pixel5,
  });
  
  const page = await context.newPage();
  
  // Navigate to a blank page to set sessionStorage for localhost
  await page.goto('http://localhost:5173/');
  
  // Set hasVisited to skip splash screen
  await page.evaluate(() => {
    sessionStorage.setItem('hasVisited', 'true');
  });

  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'mobile_home.png', fullPage: true });

  await page.goto('http://localhost:5173/offers');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'mobile_offers.png', fullPage: true });

  await page.goto('http://localhost:5173/hub');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'mobile_hub.png', fullPage: true });

  await page.goto('http://localhost:5173/admin');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'mobile_admin.png', fullPage: true });

  await browser.close();
  console.log('Mobile screenshots saved!');
})();
