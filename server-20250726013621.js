const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false }); // Set to true to run headless
  const page = await browser.newPage();

  let videoUrl = '';

  // Setup network request listener BEFORE navigation
  page.on('request', (req) => {
    const url = req.url();
    if (url.includes('valiw.hakunaymatata.com') && url.endsWith('.mp4')) {
      console.log('🎬 Final video URL found:', url);
      videoUrl = url;
    }
  });

  console.log('🌐 Navigating to start page...');
  await page.goto('https://moviebox.ph/web/film', { waitUntil: 'networkidle2' });

  // Step 1: Click first movie poster
  console.log('🎯 Waiting for movie poster...');
  await page.waitForSelector('.cover-mask.pot');
  await page.click('.cover-mask.pot');
  console.log('✅ Poster clicked, navigating to detail page...');

  // Step 2: Wait for navigation to movie detail page
  await page.waitForNavigation({ waitUntil: 'networkidle2' });

  // Step 3: Click "Watch Free" button
  console.log('🎬 Waiting for "Watch Free" button...');
  await page.waitForSelector('button.pc-watch-btn');
  await page.click('button.pc-watch-btn');
  console.log('✅ "Watch Free" button clicked, loading movie player page...');

  // Step 4: Wait for player page
  await page.waitForNavigation({ waitUntil: 'networkidle2' });

  // Step 5: Give time for video URL request to appear
  console.log('⏳ Waiting for network activity...');
  await page.waitForTimeout(7000);

  if (!videoUrl) {
    console.log('❌ Video URL not found.');
  }

  await browser.close();
})();
