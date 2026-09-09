const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  
  await page.goto('https://chaitalisartbizzz.vercel.app/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);
  
  // What is ACTUALLY rendered right now?
  const state = await page.evaluate(() => {
    // 1. Force the app state to show content (bypassing loader)
    const loader = document.querySelector('[class*="z-\\[500\\]"]');
    if (loader) loader.remove();
    
    const root = document.getElementById('root');
    const main = document.querySelector('main');
    
    // Check all motion elements for stuck opacities
    const motionEls = [...document.querySelectorAll('[style*="opacity"]')].map(el => ({
      tag: el.tagName,
      className: el.className.substring(0, 50),
      opacity: el.style.opacity,
      transform: el.style.transform
    }));
    
    return {
      hasRoot: !!root,
      hasMain: !!main,
      mainHtml: main ? main.innerHTML.substring(0, 300) : null,
      motionEls: motionEls.filter(m => m.opacity === '0' || parseFloat(m.opacity) < 1)
    };
  });
  
  console.log('App State:', JSON.stringify(state, null, 2));
  
  await page.screenshot({ path: 'forced-view.png' });
  console.log('Screenshot saved to forced-view.png');
  await browser.close();
})();
