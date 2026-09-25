const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

(async () => {
  const framesDir = '/tmp/superman_uno_frames';
  if (fs.existsSync(framesDir)) {
    fs.rmSync(framesDir, { recursive: true, force: true });
  }
  fs.mkdirSync(framesDir, { recursive: true });

  console.log('Launching browser for demo recording...');
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--window-size=1280,720',
      '--autoplay-policy=no-user-gesture-required'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });

  // Injected Animated Comic Pointer Cursor & Ripple
  await page.evaluate(() => {
    const cursor = document.createElement('div');
    cursor.id = 'demo-cursor-container';
    cursor.innerHTML = `
      <div id="demo-cursor" style="
        position: fixed;
        top: 0;
        left: 0;
        width: 32px;
        height: 32px;
        z-index: 999999;
        pointer-events: none;
        transform: translate(-100px, -100px);
        transition: transform 0.08s linear;
        filter: drop-shadow(0 4px 6px rgba(0,0,0,0.6));
      ">
        <svg viewBox="0 0 32 32" width="32" height="32" fill="none">
          <path d="M4 2 L26 14 L16 17 L21 28 L16 30 L11 19 L4 24 Z" fill="#EAB308" stroke="#DC2626" stroke-width="2" stroke-linejoin="round"/>
          <circle cx="14" cy="14" r="3" fill="#DC2626" />
        </svg>
      </div>
      <div id="demo-ripple" style="
        position: fixed;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 3px solid #FACC15;
        z-index: 999998;
        pointer-events: none;
        transform: translate(-100px, -100px) scale(0);
        opacity: 0;
        transition: transform 0.3s ease-out, opacity 0.3s ease-out;
      "></div>
    `;
    document.body.appendChild(cursor);

    window.__updateCursor = (x, y) => {
      const c = document.getElementById('demo-cursor');
      if (c) c.style.transform = `translate(${x}px, ${y}px)`;
    };

    window.__triggerClickAnim = (x, y) => {
      const r = document.getElementById('demo-ripple');
      if (r) {
        r.style.transition = 'none';
        r.style.transform = `translate(${x - 20}px, ${y - 20}px) scale(0.2)`;
        r.style.opacity = '1';
        setTimeout(() => {
          r.style.transition = 'transform 0.4s ease-out, opacity 0.4s ease-out';
          r.style.transform = `translate(${x - 20}px, ${y - 20}px) scale(2.2)`;
          r.style.opacity = '0';
        }, 20);
      }
    };
  });

  // Start CDP Screencast to capture high-rate frames
  const client = await page.target().createCDPSession();
  let frameIndex = 0;

  client.on('Page.screencastFrame', async ({ data, sessionId }) => {
    try {
      const frameNum = String(frameIndex).padStart(5, '0');
      const filePath = path.join(framesDir, `frame_${frameNum}.jpg`);
      fs.writeFileSync(filePath, Buffer.from(data, 'base64'));
      frameIndex++;
      await client.send('Page.screencastFrameAck', { sessionId });
    } catch (e) {
      // ignore frame write race during shutdown
    }
  });

  await client.send('Page.startScreencast', {
    format: 'jpeg',
    quality: 88,
    maxWidth: 1280,
    maxHeight: 720,
    everyNthFrame: 1
  });

  console.log('Screencast started, beginning choreographed 24-second product demo...');

  // Helper smooth cursor glider
  async function glideCursor(startX, startY, endX, endY, durationMs, steps = 15) {
    for (let i = 0; i <= steps; i++) {
      const progress = i / steps;
      // Smooth easeInOutQuad
      const ease = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      const curX = startX + (endX - startX) * ease;
      const curY = startY + (endY - startY) * ease;
      await page.evaluate((x, y) => window.__updateCursor(x, y), curX, curY);
      await new Promise(r => setTimeout(r, durationMs / steps));
    }
  }

  async function clickAt(x, y) {
    await page.evaluate((x, y) => window.__triggerClickAnim(x, y), x, y);
    await page.mouse.click(x, y);
  }

  // 1. Initial Scene: 4-Player Justice League Table
  console.log('Phase 1: Table exploration...');
  await glideCursor(200, 100, 480, 600, 1200); // Glides to Superman hand
  await glideCursor(480, 600, 620, 580, 1000); // Hovers along hand cards
  await glideCursor(620, 580, 780, 580, 1000); // Hovers other cards
  await new Promise(r => setTimeout(r, 1200));

  // 2. Rules Scene: Open Hero's Field Manual
  console.log('Phase 2: Hero Field Manual...');
  await glideCursor(780, 580, 1140, 30, 1000); // Moves to RULES button
  await clickAt(1140, 30);
  await page.evaluate(() => window.__unoDemo.openRules());
  await new Promise(r => setTimeout(r, 800));

  // Hover over superhero cards in rules modal
  await glideCursor(1140, 30, 400, 340, 1000); // Heat Vision
  await new Promise(r => setTimeout(r, 800));
  await glideCursor(400, 340, 650, 480, 1000); // Legendary Solar Burst
  await new Promise(r => setTimeout(r, 900));

  // Click Close Rules
  await glideCursor(650, 480, 670, 680, 900); // "GOT IT, LET'S PLAY!"
  await clickAt(670, 680);
  await page.evaluate(() => window.__unoDemo.closeRules());
  await new Promise(r => setTimeout(r, 800));

  // 3. Mode Switch: Switch to 2P Duel (Superman vs Lex Luthor)
  console.log('Phase 3: 2P Duel Switch...');
  await glideCursor(670, 680, 440, 30, 1000); // "2P DUEL" button in header
  await clickAt(440, 30);
  await page.evaluate(() => window.__unoDemo.setMode(2));
  await new Promise(r => setTimeout(r, 2200)); // Admire the "BATTLE FOR METROPOLIS BEGINS!" burst

  // 4. Wild Action Play
  console.log('Phase 4: Playing card and color picker...');
  await page.evaluate(() => {
    window.__unoDemo.setSupermanHand([
      { id: 'demo-wild', type: 'wild', value: 'wild', color: 'wild', name: 'Fortress Spectrum (Wild)' },
      { id: 'demo-crimson-7', type: 'number', value: 7, color: 'red', name: 'Solar Crimson 7' }
    ]);
  });
  await new Promise(r => setTimeout(r, 800));

  // Click the Wild Card in hand
  await glideCursor(440, 30, 580, 620, 1000);
  await clickAt(580, 620);
  await page.evaluate(() => {
    const playable = document.querySelector('.playable-glow');
    if (playable) playable.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // Pick Solar Crimson
  await page.evaluate(() => {
    const crimsonBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('SOLAR CRIMSON'));
    if (crimsonBtn) crimsonBtn.click();
  });
  await page.evaluate(() => window.__unoDemo.triggerBurst('FORTRESS SPECTRUM!'));
  await new Promise(r => setTimeout(r, 1800));

  // 5. Lex Luthor Turn & Taunt
  console.log('Phase 5: Lex Luthor reaction...');
  await page.evaluate(() => {
    window.__unoDemo.setSpeech('lex', 'Metropolis will bow to LexCorp!');
  });
  await glideCursor(580, 620, 500, 160, 1100); // Look at Lex Luthor
  await new Promise(r => setTimeout(r, 1800));

  // 6. Calling UNO!
  console.log('Phase 6: CALL UNO...');
  await glideCursor(500, 160, 390, 680, 1100); // Glides to "CALL UNO!" button
  await clickAt(390, 680);
  await page.evaluate(() => {
    const unoBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('CALL UNO'));
    if (unoBtn) unoBtn.click();
  });
  await new Promise(r => setTimeout(r, 1800));

  // 7. Victory Finale
  console.log('Phase 7: Final winning play & Victory explosion...');
  await glideCursor(390, 680, 640, 380, 800); // Center table
  await page.evaluate(() => {
    window.__unoDemo.triggerWin();
  });
  await new Promise(r => setTimeout(r, 3200));

  console.log(`Demo completed! Total frames captured: ${frameIndex}`);
  await client.send('Page.stopScreencast');
  await browser.close();

  // Compile with ffmpeg
  const outputMp4 = '/config/Desktop/Session1/superman_uno_demo.mp4';
  const audioWav = '/config/Desktop/Session1/superman_uno_soundtrack.wav';

  console.log('Encoding MP4 video with ffmpeg...');
  const ffmpegCmd = `ffmpeg -y -framerate 30 -i ${framesDir}/frame_%05d.jpg -i ${audioWav} -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest ${outputMp4}`;
  execSync(ffmpegCmd, { stdio: 'inherit' });

  // Also copy to brain artifacts directory
  const brainDir = '/config/.gemini/antigravity/brain/d991d435-5ed2-4cfc-96bf-956f220f7e6e';
  fs.copyFileSync(outputMp4, path.join(brainDir, 'superman_uno_demo.mp4'));

  console.log(`Video created successfully: ${outputMp4}`);
})().catch(err => {
  console.error('Recording failed:', err);
  process.exit(1);
});
