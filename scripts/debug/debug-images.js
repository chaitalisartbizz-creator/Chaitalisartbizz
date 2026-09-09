const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await page.goto('https://chaitalisartbizzz.vercel.app/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  
  const btn = page.locator('button', { hasText: 'Enter Gallery' });
  await btn.click({ force: true });
  await page.waitForTimeout(5000);
  
  const info = await page.evaluate(() => {
    // Check every image on the page
    const imgs = [...document.querySelectorAll('img')].map(img => ({
      src: img.src.substring(0, 80),
      width: img.offsetWidth,
      height: img.offsetHeight,
      opacity: getComputedStyle(img).opacity,
      display: getComputedStyle(img).display,
      naturalW: img.naturalWidth,
      naturalH: img.naturalHeight,
      complete: img.complete
    }));
    
    // Get the hero carousel container specifically
    const heroDiv = document.querySelector('[class*="max-w-\\[1600px\\]"]');
    const heroImg = heroDiv ? heroDiv.querySelector('img') : null;
    
    // Check what's the actual visible content vs hidden
    const main = document.querySelector('main');
    const mainRect = main ? main.getBoundingClientRect() : null;
    const mainBg = main ? getComputedStyle(main).backgroundColor : null;
    
    // App root
    const appRoot = document.getElementById('root');
    const appBg = appRoot ? getComputedStyle(appRoot).backgroundColor : null;
    
    return { imgs: imgs.slice(0, 10), mainRect, mainBg, appBg };
  });
  
  console.log('=== IMAGES ===');
  info.imgs.forEach(img => console.log(JSON.stringify(img)));
  console.log('\nmain rect:', JSON.stringify(info.mainRect));
  console.log('main bg:', info.mainBg);
  console.log('app root bg:', info.appBg);
  
  // Take a screenshot with full page to see what's actually rendering
  await page.screenshot({ path: 'deep-debug.png', fullPage: false });
  console.log('\nScreenshot taken: deep-debug.png');
  await browser.close();
})();
