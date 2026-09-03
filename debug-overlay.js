const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  
  await page.goto('https://chaitalisartbizzz.vercel.app/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  // Click the Enter Gallery button
  const btn = await page.$('button:has-text("Enter Gallery")');
  if (btn) {
    await btn.click();
    console.log('Clicked Enter Gallery');
  }
  
  // Wait for the loader to finish
  await page.waitForTimeout(4000);
  
  // Check if PageLoader is still in DOM
  const loaderInfo = await page.evaluate(() => {
    // Find ALL fixed elements
    const allFixed = Array.from(document.querySelectorAll('*')).filter(el => {
      const style = window.getComputedStyle(el);
      return style.position === 'fixed' && style.zIndex !== 'auto';
    }).map(el => ({
      tag: el.tagName,
      class: el.className.substring(0, 100),
      zIndex: window.getComputedStyle(el).zIndex,
      opacity: window.getComputedStyle(el).opacity,
      background: window.getComputedStyle(el).background.substring(0, 100),
      width: el.offsetWidth,
      height: el.offsetHeight
    }));
    
    return {
      fixedElements: allFixed,
      bodyBg: window.getComputedStyle(document.body).background.substring(0, 100),
      appDivBg: window.getComputedStyle(document.querySelector('.mesh-bg')).background.substring(0, 100),
    };
  });
  
  console.log('Fixed elements covering viewport:');
  loaderInfo.fixedElements.forEach(el => {
    if (el.width > 100 && el.height > 100) {
      console.log(JSON.stringify(el, null, 2));
    }
  });
  
  console.log('\nBody bg:', loaderInfo.bodyBg);
  console.log('App div bg:', loaderInfo.appDivBg);
  
  await browser.close();
})();
