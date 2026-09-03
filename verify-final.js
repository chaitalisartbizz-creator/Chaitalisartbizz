const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  // Simulate real user - no notification permission (blocked scenario)
  const context = await browser.newContext({ 
    viewport: { width: 390, height: 844 },
    permissions: []
  });
  const page = await context.newPage();
  let errors = [];
  page.on('console', msg => { 
    if (msg.type() === 'error') errors.push(msg.text());
  });

  console.log('[1] Loading live site...');
  await page.goto('https://chaitalisartbizzz.vercel.app/', { waitUntil: 'domcontentloaded', timeout: 25000 });
  await page.waitForTimeout(2000);

  // Check which build is deployed
  const buildHash = await page.evaluate(() => {
    const s = document.querySelector('script[src*="index-"]');
    return s ? s.src : 'not found';
  });
  console.log('[2] Build loaded:', buildHash);

  // Verify Enter Gallery button is visible
  const enterBtn = page.locator('button', { hasText: 'Enter Gallery' });
  await enterBtn.waitFor({ state: 'visible', timeout: 8000 });
  console.log('[3] ✅ Enter Gallery button visible');

  // Screenshot - entry gate
  await page.screenshot({ path: 'step1-entry.png', fullPage: false });

  // Click the button and measure time to dismiss
  const t0 = Date.now();
  await enterBtn.click({ force: true });
  console.log('[4] Clicked Enter Gallery');

  // Wait for the loader to fully disappear (phase === done)
  try {
    await page.waitForFunction(() => {
      // Loader is gone when the fixed inset-0 z-[500] element is no longer in DOM or hidden
      const loaderEls = [...document.querySelectorAll('[class*="z-\\[500\\]"], [style*="z-index: 500"]')];
      return loaderEls.length === 0 || loaderEls.every(el => !el.offsetParent);
    }, { timeout: 8000 });
    const elapsed = ((Date.now() - t0) / 1000).toFixed(2);
    console.log(`[5] ✅ Loader dismissed in ${elapsed}s`);
  } catch(e) {
    // Check what's on screen
    const loaderState = await page.evaluate(() => {
      const els = [...document.querySelectorAll('.fixed')];
      return els.map(el => ({ z: getComputedStyle(el).zIndex, text: el.textContent.substring(0,60), op: getComputedStyle(el).opacity }));
    });
    console.log('[5] ❌ Loader still showing:', JSON.stringify(loaderState));
  }

  // Short wait then screenshot the homepage
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'step2-homepage.png', fullPage: false });

  // Full page screenshot
  await page.screenshot({ path: 'step3-fullpage.png', fullPage: true });

  // Check what's rendered
  const pageInfo = await page.evaluate(() => {
    const main = document.querySelector('main');
    const imgs = main ? [...main.querySelectorAll('img')].length : 0;
    const sections = main ? [...main.querySelectorAll('section')].length : 0;
    const hasHeader = !!document.querySelector('header, [class*="Header"]');
    const bodyText = document.body.innerText.substring(0, 300);
    return { hasMail: !!main, imgs, sections, hasHeader, bodyText };
  });

  console.log('[6] Page info:', JSON.stringify(pageInfo, null, 2));
  console.log('[7] JS Errors (excl. notification):', errors.filter(e => !e.includes('permission-blocked') && !e.includes('notification')));
  console.log('[8] Done!');
  await browser.close();
})();
