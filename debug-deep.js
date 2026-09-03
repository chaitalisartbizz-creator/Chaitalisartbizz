const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  
  const errors = [];
  page.on('pageerror', err => errors.push('PAGE ERROR: ' + err.message));
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push('CONSOLE ERROR: ' + msg.text());
    if (msg.type() === 'log') console.log('CONSOLE:', msg.text());
  });
  
  await page.goto('https://chaitalisartbizzz.vercel.app/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  await page.screenshot({ path: 'step1-entry-gate.png' });
  console.log('Screenshot 1: Entry gate');
  
  // Click the Enter Gallery button
  const btn = await page.$('button:has-text("Enter Gallery")');
  if (btn) {
    await btn.click();
    console.log('Clicked Enter Gallery');
  } else {
    console.log('No Enter Gallery button found - checking page state...');
    const bodyText = await page.evaluate(() => document.body.innerText.substring(0, 300));
    console.log('Body text:', bodyText);
  }
  
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'step2-after-click.png' });
  console.log('Screenshot 2: After click');
  
  // Wait for loader to dismiss
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'step3-after-loader.png' });
  console.log('Screenshot 3: After loader should dismiss');

  // Check what's in the DOM
  const heroCarousel = await page.evaluate(() => {
    const hero = document.querySelector('[class*="HeroCarousel"], .hero-carousel');
    const main = document.querySelector('main');
    const allSections = document.querySelectorAll('section');
    const motionDivs = document.querySelectorAll('[data-framer-component-type], .framer-motion');
    
    return {
      hasMain: !!main,
      mainChildCount: main?.children.length || 0,
      mainHTML: main?.innerHTML.substring(0, 500) || 'NO MAIN',
      sectionCount: allSections.length,
      hasHero: !!hero,
      bodyClasses: document.body.className,
      visibleImages: Array.from(document.querySelectorAll('img')).filter(img => {
        const rect = img.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      }).length
    };
  });
  
  console.log('DOM state:', JSON.stringify(heroCarousel, null, 2));
  
  console.log('Errors caught:');
  console.log(JSON.stringify(errors, null, 2));
  
  await browser.close();
})();
