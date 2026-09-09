const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 1800 }
  });
  const page = await context.newPage();
  
  await page.goto('http://localhost:5173/');
  
  // Wait for and click the enter button if it exists
  try {
    await page.waitForSelector('text=ENTER GALLERY', { timeout: 3000 });
    await page.click('text=ENTER GALLERY');
    await page.waitForTimeout(2000); // wait for animation
  } catch (e) {
    console.log("No enter button found");
  }

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
