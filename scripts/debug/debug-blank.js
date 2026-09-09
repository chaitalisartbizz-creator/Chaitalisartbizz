const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  
  let consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', err => consoleErrors.push('PAGE ERROR: ' + err.message));

  await page.goto('https://chaitalisartbizzz.vercel.app/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  
  const btn = page.locator('button', { hasText: 'Enter Gallery' });
  await btn.click({ force: true });
  await page.waitForTimeout(5000);
  
  const domInfo = await page.evaluate(() => {
    const main = document.querySelector('main');
    
    // Children of main
    const children = main ? [...main.children].map(el => ({
      tag: el.tagName,
      cls: (el.className || '').toString().substring(0, 80),
      height: el.offsetHeight,
      display: getComputedStyle(el).display,
      opacity: getComputedStyle(el).opacity,
      overflow: getComputedStyle(el).overflow,
      childCount: el.children.length
    })) : [];
    
    // Large covering elements (fixed/absolute, >200px)
    const coveringEls = [...document.querySelectorAll('*')].filter(el => {
      const s = getComputedStyle(el);
      return (s.position === 'fixed' || s.position === 'absolute') && 
             el.offsetHeight > 200 && el.offsetWidth > 200;
    }).map(el => ({
      tag: el.tagName,
      cls: (el.className || '').toString().substring(0, 60),
      z: parseInt(getComputedStyle(el).zIndex) || 0,
      h: el.offsetHeight,
      w: el.offsetWidth,
      bg: getComputedStyle(el).backgroundColor,
      op: getComputedStyle(el).opacity
    }));
    
    // Check what the API returned
    return { mainExists: !!main, children, coveringEls };
  });
  
  console.log('=== MAIN CHILDREN ===');
  domInfo.children.forEach(c => console.log(JSON.stringify(c)));
  
  console.log('\n=== LARGE COVERING ELEMENTS ===');
  domInfo.coveringEls.forEach(el => console.log(JSON.stringify(el)));
  
  console.log('\n=== JS ERRORS ===');
  console.log(consoleErrors.join('\n'));
  
  await page.screenshot({ path: 'debug-blank.png', fullPage: false });
  await browser.close();
})();
