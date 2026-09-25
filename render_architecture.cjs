const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900, deviceScaleFactor: 2 });

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Architecture Diagram</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Bangers&family=Bebas+Neue&family=Outfit:wght@400;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: radial-gradient(circle at 50% 20%, #0d1527 0%, #050811 100%);
      font-family: 'Outfit', sans-serif;
      color: #f8fafc;
      padding: 40px;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
    }
    
    /* Comic Halftone Overlay */
    body::before {
      content: "";
      position: absolute;
      inset: 0;
      background-image: radial-gradient(rgba(220, 38, 38, 0.12) 1.5px, transparent 1.5px);
      background-size: 24px 24px;
      pointer-events: none;
    }

    .header-box {
      text-align: center;
      margin-bottom: 30px;
      position: relative;
      z-index: 10;
    }
    .badge {
      display: inline-block;
      background: #dc2626;
      color: #fef08a;
      font-family: 'Bangers', cursive;
      font-size: 18px;
      letter-spacing: 2px;
      padding: 4px 16px;
      border-radius: 9999px;
      border: 2px solid #facc15;
      box-shadow: 0 4px 12px rgba(220, 38, 38, 0.4);
      margin-bottom: 8px;
    }
    .title {
      font-family: 'Bangers', cursive;
      font-size: 46px;
      letter-spacing: 3px;
      color: #facc15;
      text-shadow: 3px 3px 0 #dc2626, 6px 6px 0 #000;
      margin-bottom: 6px;
    }
    .subtitle {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 20px;
      color: #94a3b8;
      letter-spacing: 2px;
    }

    .grid-container {
      display: grid;
      grid-template-columns: 1.25fr 1fr 1fr;
      gap: 24px;
      width: 100%;
      max-width: 1320px;
      position: relative;
      z-index: 10;
    }

    .layer-card {
      background: rgba(15, 23, 42, 0.85);
      border: 3px solid #334155;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1);
      position: relative;
      overflow: hidden;
    }

    .layer-card.primary {
      border-color: #dc2626;
      box-shadow: 0 0 20px rgba(220, 38, 38, 0.25);
    }
    .layer-card.secondary {
      border-color: #2563eb;
      box-shadow: 0 0 20px rgba(37, 99, 235, 0.25);
    }
    .layer-card.accent {
      border-color: #eab308;
      box-shadow: 0 0 20px rgba(234, 179, 8, 0.25);
    }

    .layer-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
      padding-bottom: 12px;
      border-bottom: 2px dashed rgba(255, 255, 255, 0.15);
    }
    .layer-icon {
      width: 38px;
      height: 38px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }
    .primary .layer-icon { background: #dc2626; color: #fff; }
    .secondary .layer-icon { background: #2563eb; color: #fff; }
    .accent .layer-icon { background: #eab308; color: #000; }

    .layer-title {
      font-family: 'Bangers', cursive;
      font-size: 24px;
      letter-spacing: 1.5px;
    }
    .primary .layer-title { color: #f87171; }
    .secondary .layer-title { color: #60a5fa; }
    .accent .layer-title { color: #fde047; }

    .component-box {
      background: rgba(30, 41, 59, 0.7);
      border: 1.5px solid #475569;
      border-radius: 10px;
      padding: 12px 14px;
      margin-bottom: 12px;
    }
    .comp-name {
      font-family: 'JetBrains Mono', monospace;
      font-size: 14px;
      font-weight: 700;
      color: #38bdf8;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 4px;
    }
    .comp-desc {
      font-size: 12px;
      color: #cbd5e1;
      line-height: 1.4;
    }
    .comp-tag {
      font-size: 10px;
      font-family: 'Bebas Neue', sans-serif;
      letter-spacing: 1px;
      padding: 2px 6px;
      border-radius: 4px;
      background: #1e293b;
      border: 1px solid #64748b;
      color: #94a3b8;
    }

    .flow-footer {
      margin-top: 24px;
      width: 100%;
      max-width: 1320px;
      background: rgba(15, 23, 42, 0.9);
      border: 2px solid #facc15;
      border-radius: 12px;
      padding: 16px 24px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      position: relative;
      z-index: 10;
    }
    .flow-item {
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: 'Bebas Neue', sans-serif;
      font-size: 18px;
      letter-spacing: 1.5px;
      color: #e2e8f0;
    }
    .flow-arrow {
      color: #facc15;
      font-size: 20px;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="header-box">
    <div class="badge">DC COMICS EDITION</div>
    <div class="title">SUPERMAN UNO : SYSTEM ARCHITECTURE</div>
    <div class="subtitle">UNIDIRECTIONAL STATE FLOW • PURE LOGIC ENGINE • PROCEDURAL WEB AUDIO</div>
  </div>

  <div class="grid-container">
    <!-- UI LAYER -->
    <div class="layer-card primary">
      <div class="layer-header">
        <div class="layer-icon">🖥️</div>
        <div>
          <div class="layer-title">UI & Presentation Layer</div>
          <div style="font-size: 12px; color: #94a3b8;">React 19 + Tailwind CSS</div>
        </div>
      </div>

      <div class="component-box" style="border-color: #ef4444; background: rgba(239, 68, 68, 0.1);">
        <div class="comp-name" style="color: #fca5a5;">App.jsx <span class="comp-tag" style="background:#dc2626; color:#fff;">MASTER ROOT</span></div>
        <div class="comp-desc">Single source of truth. Holds game state, turn loops, dialog visibility, and AI turn coordination.</div>
      </div>

      <div class="component-box">
        <div class="comp-name">GameBoard.jsx <span class="comp-tag">ARENA</span></div>
        <div class="comp-desc">3D draw deck, stacked discard pile, orbit direction ring, and action burst popups.</div>
      </div>

      <div class="component-box">
        <div class="comp-name">PlayerHand.jsx <span class="comp-tag">HERO</span></div>
        <div class="comp-desc">Superman's fanned card shelf with hover physics, playable glow states, and CALL UNO button.</div>
      </div>

      <div class="component-box">
        <div class="comp-name">BotPlayer.jsx <span class="comp-tag">AI STATIONS</span></div>
        <div class="comp-desc">Opponent stations for Batman, Wonder Woman, and Lex Luthor with speech bubbles and face-down cards.</div>
      </div>

      <div class="component-box">
        <div class="comp-name">Modals & Overlays <span class="comp-tag">DIALOGS</span></div>
        <div class="comp-desc">ColorPickerModal (Solar Colors), RulesModal (Field Manual), and GameOverModal (Victory + Confetti).</div>
      </div>
    </div>

    <!-- LOGIC LAYER -->
    <div class="layer-card secondary">
      <div class="layer-header">
        <div class="layer-icon">⚙️</div>
        <div>
          <div class="layer-title">Game Logic Engine</div>
          <div style="font-size: 12px; color: #94a3b8;">src/logic/unoEngine.js (Pure JS)</div>
        </div>
      </div>

      <div class="component-box">
        <div class="comp-name">Deck Generator & Shuffler</div>
        <div class="comp-desc">Generates 110 Superman & DC-themed cards with Fisher-Yates randomizer.</div>
      </div>

      <div class="component-box">
        <div class="comp-name">Card Validator (canPlayCard)</div>
        <div class="comp-desc">Validates matches by color frequency, number, action type, and wild card rules.</div>
      </div>

      <div class="component-box">
        <div class="comp-name">Turn Orbit Manager</div>
        <div class="comp-desc">Controls play rotation direction (clockwise/counter-clockwise), skips, and +2/+4 penalty stacking.</div>
      </div>

      <div class="component-box">
        <div class="comp-name">AI Decision Engine (getBotMove)</div>
        <div class="comp-desc">
          • <strong>Batman</strong>: Conservative tactician, saves wilds.<br/>
          • <strong>Wonder Woman</strong>: Balanced high-tempo plays.<br/>
          • <strong>Lex Luthor</strong>: Aggressive +4 Kryptonite nemesis.
        </div>
      </div>

      <div class="component-box">
        <div class="comp-name">UNO Shouting & Penalty</div>
        <div class="comp-desc">Detects 1-card states, evaluates call timing, and applies +2 penalty cards when challenged.</div>
      </div>
    </div>

    <!-- AUDIO & ASSET LAYER -->
    <div class="layer-card accent">
      <div class="layer-header">
        <div class="layer-icon">🔊</div>
        <div>
          <div class="layer-title">Audio & Visual FX</div>
          <div style="font-size: 12px; color: #94a3b8;">Zero External Audio Dependencies</div>
        </div>
      </div>

      <div class="component-box">
        <div class="comp-name" style="color: #fde047;">soundEffects.js (Web Audio API)</div>
        <div class="comp-desc">
          • <strong>Laser Sweep</strong>: Heat Vision 880Hz to 120Hz<br/>
          • <strong>Punch Boom</strong>: Sub-bass 160Hz exponential decay<br/>
          • <strong>Kryptonite Hum</strong>: 65Hz ring-modulated sawtooth<br/>
          • <strong>Heroic Fanfare</strong>: Polyphonic brass trumpet chords
        </div>
      </div>

      <div class="component-box">
        <div class="comp-name" style="color: #fde047;">Comic Action Bursts</div>
        <div class="comp-desc">Explosive DOM overlays: "BAM!", "POW!", "HEAT VISION FREEZE!", "BATTLE FOR METROPOLIS".</div>
      </div>

      <div class="component-box">
        <div class="comp-name" style="color: #fde047;">Victory Confetti Engine</div>
        <div class="comp-desc">Hardware-accelerated canvas particle system triggered on Superman victory.</div>
      </div>

      <div class="component-box">
        <div class="comp-name" style="color: #fde047;">Comic Graphic System</div>
        <div class="comp-desc">Custom inline SVG hero crests (Superman Shield, Bat-Symbol, Wonder Woman Eagle, LexCorp L).</div>
      </div>
    </div>
  </div>

  <div class="flow-footer">
    <div class="flow-item"><span>🦸‍♂️ USER INTERACTION</span></div>
    <div class="flow-arrow">➔</div>
    <div class="flow-item"><span>⚡ APP.JSX ORCHESTRATOR</span></div>
    <div class="flow-arrow">➔</div>
    <div class="flow-item"><span>⚙️ UNO ENGINE VALIDATION</span></div>
    <div class="flow-arrow">➔</div>
    <div class="flow-item"><span>🔊 WEB AUDIO SYNTH</span></div>
    <div class="flow-arrow">➔</div>
    <div class="flow-item"><span>💥 COMIC BURST RENDER</span></div>
  </div>
</body>
</html>
  `;

  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  const outputPath = '/config/Desktop/Session1/superman-uno/media/architecture_diagram.png';
  await page.screenshot({ path: outputPath, fullPage: true });
  console.log('Architecture diagram saved to:', outputPath);

  // Also copy to parent media
  fs.copyFileSync(outputPath, '/config/Desktop/Session1/media_architecture_diagram.png');

  await browser.close();
})().catch(err => {
  console.error('Failed to render architecture diagram:', err);
  process.exit(1);
});
