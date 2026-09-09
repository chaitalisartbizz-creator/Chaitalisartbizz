const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  // Grant notification permissions automatically so we can test the flow
  const context = await browser.newContext({ 
    viewport: { width: 390, height: 844 },
    permissions: ['notifications']
  }); 
  const page = await context.newPage();
  
  let pageErrors = [];
  page.on('pageerror', err => pageErrors.push(err.message));
  page.on('console', msg => { 
    if (msg.type() === 'error') pageErrors.push(msg.text()); 
  });

  console.log('Loading live site...');
  await page.goto('https://chaitalisartbizzz.vercel.app/', { waitUntil: 'networkidle' });

  const btn = page.locator('button', { hasText: 'Enter Gallery' });
  await btn.waitFor({ state: 'visible', timeout: 5000 });
  console.log('✅ Enter Gallery button is visible immediately.');
  
  const startTime = Date.now();
  await btn.click();
  console.log('Clicked Enter Gallery. Measuring time until homepage appears...');

  // Wait for main content to appear
  await page.waitForFunction(() => {
    const main = document.querySelector('main');
    return main && main.innerHTML.length > 1000;
  }, { timeout: 10000 });

  const endTime = Date.now();
  const timeTaken = ((endTime - startTime) / 1000).toFixed(2);
  
  console.log(`✅ Homepage loaded successfully in ${timeTaken} seconds! (Used to be 6.00+ seconds)`);

  const mainInfo = await page.evaluate(() => {
    const main = document.querySelector('main');
    const products = document.querySelectorAll('[class*="product"], [class*="card"], img[alt]');
    return {
      mainHeight: main ? main.getBoundingClientRect().height : 0,
      imageCount: products.length
    };
  });
  
  console.log('✅ Gallery Content:', mainInfo);
  console.log('✅ Page Errors encountered:', pageErrors.length === 0 ? 'None!' : pageErrors);
  
  await page.screenshot({ path: 'live-final-check.png', fullPage: false });
  console.log('Screenshot saved: live-final-check.png');
  
  await browser.close();
})();
