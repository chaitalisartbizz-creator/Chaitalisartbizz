const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();

  let consoleErrors = [];
  page.on('console', msg => { 
    if (msg.type() === 'error') consoleErrors.push(msg.text());
    if (msg.type() === 'log') console.log('[PAGE LOG]', msg.text());
  });

  await page.goto('https://chaitalisartbizzz.vercel.app/', { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForTimeout(3000);

  // Check buttons + index bundle hash  
  const state = await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button')].map(b => ({
      text: b.textContent.trim().substring(0, 40),
      rect: JSON.stringify(b.getBoundingClientRect()),
      pointer: getComputedStyle(b).pointerEvents,
    }));
    const scripts = [...document.querySelectorAll('script[src]')].map(s => s.src);
    return { btns, scripts };
  });
  
  console.log('Scripts:', state.scripts);
  console.log('Buttons:', JSON.stringify(state.btns, null, 2));

  // Click the enter gallery button
  const enterBtn = page.locator('button', { hasText: 'Enter Gallery' });
  const box = await enterBtn.boundingBox();
  console.log('Enter Gallery box:', box);

  // Force click by JS
  await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button')];
    const enter = btns.find(b => b.textContent.includes('Enter Gallery'));
    if (enter) {
      enter.click();
      console.log('JS click fired on Enter Gallery');
    } else {
      console.log('Enter Gallery button NOT found');
    }
  });

  await page.waitForTimeout(5000);

  const afterState = await page.evaluate(() => {
    const loader = document.querySelector('.fixed.inset-0[style*="z-index: 500"], [class*="z-\\[500\\]"]');
    const fixedEls = [...document.querySelectorAll('[class*="fixed"]')];
    return {
      fixedCount: fixedEls.length,
      fixedTexts: fixedEls.map(el => el.textContent.substring(0, 60)),
      bodyText: document.body.innerText.substring(0, 200)
    };
  });

  console.log('After state:', JSON.stringify(afterState, null, 2));
  console.log('Errors:', consoleErrors);

  await page.screenshot({ path: 'debug-after-click.png' });
  console.log('Screenshot saved');
  await browser.close();
})();
