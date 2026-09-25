const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err.message));

  console.log('Navigating to game...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });

  // 1. Screenshot initial game
  await page.screenshot({ path: '/config/Desktop/Session1/test_initial.png' });
  console.log('Initial screenshot saved');

  // 2. Open Rules Modal
  console.log('Clicking Rules...');
  const rulesBtn = await page.waitForSelector('button[title="How to Play"]');
  await rulesBtn.click();
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: '/config/Desktop/Session1/test_rules_modal.png' });
  console.log('Rules modal screenshot saved');

  // Close Rules Modal
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const gotItBtn = buttons.find(b => b.textContent.includes('GOT IT') || b.textContent.includes('LET\'S PLAY'));
    if (gotItBtn) gotItBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  // 3. Switch to 2P Duel Mode
  console.log('Switching to 2P Duel Mode...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const duelBtn = buttons.find(b => b.textContent.includes('2P DUEL'));
    if (duelBtn) duelBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: '/config/Desktop/Session1/test_duel_mode.png' });
  console.log('Duel mode screenshot saved');

  // 4. Test playing a playable card or drawing
  console.log('Checking for playable card or drawing...');
  const playableCard = await page.$('.playable-glow');
  if (playableCard) {
    console.log('Found playable card! Clicking it...');
    await playableCard.click();
    await new Promise(r => setTimeout(r, 800));

    // If color picker opened
    const colorPickerOption = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const crimsonBtn = buttons.find(b => b.textContent.includes('SOLAR CRIMSON'));
      if (crimsonBtn) {
        crimsonBtn.click();
        return true;
      }
      return false;
    });
    if (colorPickerOption) {
      console.log('Wild card color picker handled!');
      await new Promise(r => setTimeout(r, 600));
    }
  } else {
    console.log('No playable card, clicking Draw Pile...');
    await page.evaluate(() => {
      const drawText = Array.from(document.querySelectorAll('div, span')).find(el => el.textContent.includes('DRAW CARD'));
      if (drawText) drawText.click();
    });
    await new Promise(r => setTimeout(r, 800));
  }

  // 5. Open News Wire
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const newsBtn = buttons.find(b => b.textContent.includes('DAILY PLANET'));
    if (newsBtn) newsBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  await page.screenshot({ path: '/config/Desktop/Session1/test_after_action.png' });
  console.log('After action screenshot saved');

  await browser.close();
  console.log('Automated UI test completed successfully!');
})().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
