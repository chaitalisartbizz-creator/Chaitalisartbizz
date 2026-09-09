const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('https://chaitalisartbizzz.vercel.app/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  const btn = await page.$('button:has-text("Enter Gallery")');
  if (btn) {
    await btn.click();
    console.log('Clicked Enter Gallery, waiting for loader...');
    await page.waitForTimeout(4000);
  } else {
    console.log('No entry gate found');
  }
  await page.screenshot({ path: 'final-verify.png', fullPage: false });
  
  // Check for blocking overlay
  const overlay = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('*'));
    const blocking = all.find(el => {
      const s = window.getComputedStyle(el);
      return s.position === 'fixed' && parseInt(s.zIndex) >= 400 && el.offsetWidth > 800 && el.offsetHeight > 400 && parseFloat(s.opacity) > 0.5;
    });
    return blocking ? ('OVERLAY STILL BLOCKING: ' + blocking.className.substring(0, 150)) : 'No blocking overlay - GOOD!';
  });
  console.log('Overlay check:', overlay);
  await browser.close();
})();
