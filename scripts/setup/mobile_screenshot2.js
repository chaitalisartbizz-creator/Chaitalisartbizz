const { chromium, devices } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const pixel5 = devices['Pixel 5'];
  const context = await browser.newContext({
    ...pixel5,
  });
  const page = await context.newPage();
  
  await page.goto('http://localhost:5173/');
  
  try {
    await page.waitForSelector('text=Enter Gallery', { timeout: 3000 });
    await page.click('text=Enter Gallery');
    await page.waitForTimeout(2000);
  } catch (e) {
    console.log("No splash screen");
  }

  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'mobile_home.png', fullPage: true });

  // Use the bottom nav to go to Offers
  await page.click('text=Deals');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'mobile_offers.png', fullPage: true });

  // Use the bottom nav to go to Hub
  await page.click('text=Hub');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'mobile_hub.png', fullPage: true });

  await page.goto('http://localhost:5173/admin');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'mobile_admin.png', fullPage: true });

  await browser.close();
  console.log('Mobile screenshots saved!');
})();
