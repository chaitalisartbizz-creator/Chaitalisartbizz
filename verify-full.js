const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  
  await page.goto('https://chaitalisartbizzz.vercel.app/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  // Screenshot 1: Entry gate
  await page.screenshot({ path: 'v1-entry.png' });
  console.log('1. Entry gate captured');
  
  // Click enter
  const btn = await page.$('button:has-text("Enter Gallery")');
  if (btn) {
    await btn.click();
    console.log('2. Clicked Enter Gallery');
  }
  
  // Wait generously for all animations to complete
  await page.waitForTimeout(6000);
  
  // Screenshot 2: Should be full homepage now  
  await page.screenshot({ path: 'v2-homepage.png', fullPage: false });
  console.log('3. Homepage captured');
  
  // Get visible content stats
  const stats = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('img')).filter(i => {
      const r = i.getBoundingClientRect();
      return r.top >= 0 && r.top < window.innerHeight && r.width > 10;
    });
    const h1s = Array.from(document.querySelectorAll('h1, h2')).map(h => h.textContent.trim().substring(0, 50));
    const body = document.body.style.cssText;
    return { visibleImgs: imgs.length, headings: h1s.slice(0, 5), bodyStyle: body };
  });
  console.log('Visible images in viewport:', stats.visibleImgs);
  console.log('Headings:', stats.headings);
  
  await browser.close();
})();
