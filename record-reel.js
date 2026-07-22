const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

// Configuration
const FPS = 30;
const DURATION = 10; // seconds
const TOTAL_FRAMES = FPS * DURATION;
const WIDTH = 1080;
const HEIGHT = 1920;
const FRAMES_DIR = path.join(__dirname, 'frames');
const OUTPUT_FILE = path.join(__dirname, 'reel-invitacion.mp4');

// iPhone screen dimensions for internal rendering
const PHONE_SCREEN_WIDTH = 350;
const PHONE_SCREEN_HEIGHT = 720;

async function main() {
  // Clean/create frames directory
  if (fs.existsSync(FRAMES_DIR)) {
    fs.rmSync(FRAMES_DIR, { recursive: true });
  }
  fs.mkdirSync(FRAMES_DIR);

  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-web-security']
  });

  // Read the invitation HTML content
  const invitationHTML = fs.readFileSync(path.join(__dirname, 'invitacion.html'), 'utf8');
  
  // Extract just the body and style content from invitation
  const styleMatch = invitationHTML.match(/<style>([\s\S]*?)<\/style>/);
  const bodyMatch = invitationHTML.match(/<body>([\s\S]*?)<\/body>/);
  const invitationStyles = styleMatch ? styleMatch[1] : '';
  const invitationBody = bodyMatch ? bodyMatch[1] : '';

  // First, measure scroll height
  console.log('Measuring scroll height...');
  const measurePage = await browser.newPage();
  await measurePage.setViewport({ width: PHONE_SCREEN_WIDTH, height: PHONE_SCREEN_HEIGHT });
  
  const measureHTML = `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>${invitationStyles}</style></head><body>${invitationBody}</body></html>`;
  
  await measurePage.setContent(measureHTML, { waitUntil: 'networkidle0' });
  const scrollHeight = await measurePage.evaluate(() => document.body.scrollHeight - window.innerHeight);
  console.log(`Total scroll distance: ${scrollHeight}px`);
  await measurePage.close();

  // Create the composite page with iPhone mockup + embedded invitation
  console.log('Creating reel mockup page...');
  const page = await browser.newPage();
  await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 1 });

  const compositeHTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  width: ${WIDTH}px;
  height: ${HEIGHT}px;
  background: linear-gradient(160deg, #f5ede6 0%, #e8ddd4 30%, #d4c5b0 60%, #c9b89e 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}

body::before {
  content: '';
  position: absolute;
  top: -100px;
  right: -100px;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(139,158,124,0.15) 0%, transparent 70%);
  border-radius: 50%;
}

body::after {
  content: '';
  position: absolute;
  bottom: -150px;
  left: -100px;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(232,196,184,0.2) 0%, transparent 70%);
  border-radius: 50%;
}

.petal {
  position: absolute;
  width: 20px;
  height: 30px;
  background: rgba(232,196,184,0.3);
  border-radius: 50% 50% 50% 0;
  transform: rotate(45deg);
}
.petal:nth-child(1) { top: 150px; left: 80px; width: 25px; height: 35px; opacity: 0.4; }
.petal:nth-child(2) { top: 300px; right: 120px; width: 18px; height: 26px; opacity: 0.3; transform: rotate(120deg); }
.petal:nth-child(3) { bottom: 400px; left: 150px; width: 22px; height: 32px; opacity: 0.35; transform: rotate(200deg); }
.petal:nth-child(4) { bottom: 200px; right: 80px; width: 16px; height: 24px; opacity: 0.25; transform: rotate(80deg); }
.petal:nth-child(5) { top: 600px; left: 60px; width: 20px; height: 28px; opacity: 0.3; transform: rotate(160deg); }

.iphone-container {
  position: relative;
  z-index: 10;
}

.iphone {
  position: relative;
  width: 380px;
  height: 780px;
  background: #1a1a1a;
  border-radius: 55px;
  padding: 12px;
  box-shadow: 
    0 50px 100px rgba(0,0,0,0.3),
    0 20px 60px rgba(0,0,0,0.2),
    inset 0 0 0 2px #2a2a2a,
    inset 0 0 0 4px #1a1a1a;
}

.iphone::before {
  content: '';
  position: absolute;
  right: -3px;
  top: 180px;
  width: 4px;
  height: 80px;
  background: #2a2a2a;
  border-radius: 0 3px 3px 0;
}

.dynamic-island {
  position: absolute;
  top: 18px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 34px;
  background: #000;
  border-radius: 20px;
  z-index: 100;
}

.screen {
  width: 100%;
  height: 100%;
  border-radius: 44px;
  overflow: hidden;
  background: #fff;
  position: relative;
}

#scrollContent {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}

#innerContent {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}

/* Scroll finger on screen */
.scroll-finger {
  position: absolute;
  top: 55%;
  right: 45px;
  width: 36px;
  height: 36px;
  background: radial-gradient(circle at 40% 40%, rgba(232,184,156,0.85), rgba(212,160,136,0.75));
  border-radius: 50%;
  z-index: 50;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

/* Hand */
.hand-container {
  position: absolute;
  bottom: -60px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 5;
}

.thumb {
  position: absolute;
  bottom: 340px;
  right: -28px;
  width: 42px;
  height: 110px;
  background: linear-gradient(to right, #e8b89c, #d4a088);
  border-radius: 20px 22px 18px 15px;
  transform: rotate(-10deg);
  z-index: 15;
  box-shadow: -2px 0 8px rgba(0,0,0,0.1);
}

.fingers {
  position: absolute;
  bottom: 220px;
  left: -22px;
  width: 38px;
  height: 230px;
  background: linear-gradient(to left, #e8b89c, #d4a088);
  border-radius: 15px 18px 18px 15px;
  transform: rotate(5deg);
  z-index: 5;
  box-shadow: 2px 0 8px rgba(0,0,0,0.1);
}

.palm {
  width: 180px;
  height: 160px;
  background: linear-gradient(135deg, #e8b89c 0%, #d4a088 50%, #c89478 100%);
  border-radius: 30px 30px 60px 60px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
}

/* Invitation content styles (scoped) */
#innerContent {
  font-family: 'Lato', sans-serif;
  color: #4a4a4a;
}
</style>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400;700&family=Great+Vibes&display=swap" rel="stylesheet">
<style>
/* Scoped invitation styles */
#innerContent {
  ${invitationStyles.replace(/html,\s*body/g, '#innerContent').replace(/body/g, '#innerContent')}
}
</style>
</head>
<body>
  <div class="petal"></div>
  <div class="petal"></div>
  <div class="petal"></div>
  <div class="petal"></div>
  <div class="petal"></div>

  <div class="iphone-container">
    <div class="iphone">
      <div class="dynamic-island"></div>
      <div class="screen">
        <div id="scrollContent">
          <div id="innerContent">
            ${invitationBody}
          </div>
        </div>
      </div>
    </div>
    <div class="scroll-finger" id="scrollFinger"></div>
    <div class="hand-container">
      <div class="thumb"></div>
      <div class="fingers"></div>
      <div class="palm"></div>
    </div>
  </div>
</body>
</html>`;

  await page.setContent(compositeHTML, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));

  // Get actual scroll height inside the mockup
  const innerScrollHeight = await page.evaluate(() => {
    const inner = document.getElementById('innerContent');
    const container = document.getElementById('scrollContent');
    return inner.scrollHeight - container.clientHeight;
  });
  console.log(`Inner scroll distance: ${innerScrollHeight}px`);

  console.log(`Recording ${TOTAL_FRAMES} frames at ${FPS}fps...`);

  // Capture frames with smooth scroll
  for (let i = 0; i < TOTAL_FRAMES; i++) {
    const t = i / (TOTAL_FRAMES - 1);
    // Ease-in-out cubic for smooth scrolling
    const eased = t < 0.5 
      ? 4 * t * t * t 
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
    
    const scrollPos = Math.round(eased * innerScrollHeight);
    
    // Move the inner content up (simulate scroll)
    await page.evaluate((pos) => {
      const inner = document.getElementById('innerContent');
      inner.style.transform = `translateY(-${pos}px)`;
    }, scrollPos);

    // Animate scroll finger (moves down as scrolling progresses)
    const fingerTop = 45 + (t * 20); // 45% to 65%
    await page.evaluate((top) => {
      document.getElementById('scrollFinger').style.top = top + '%';
    }, fingerTop);

    // Small delay for rendering
    await new Promise(r => setTimeout(r, 15));

    // Screenshot
    const frameNum = String(i).padStart(5, '0');
    await page.screenshot({
      path: path.join(FRAMES_DIR, `frame_${frameNum}.png`),
      clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT }
    });

    if (i % 30 === 0) {
      console.log(`  Frame ${i}/${TOTAL_FRAMES} (${Math.round(t * 100)}%)`);
    }
  }

  await browser.close();
  console.log('Browser closed. Encoding video...');

  // Encode to MP4 with ffmpeg (H.264 for Instagram compatibility)
  const ffmpegCmd = `ffmpeg -y -framerate ${FPS} -i "${FRAMES_DIR}/frame_%05d.png" -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p -movflags +faststart "${OUTPUT_FILE}"`;
  
  console.log('Running ffmpeg...');
  execSync(ffmpegCmd, { stdio: 'inherit' });

  // Cleanup frames
  console.log('Cleaning up frames...');
  fs.rmSync(FRAMES_DIR, { recursive: true });

  // Show file info
  const stats = fs.statSync(OUTPUT_FILE);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);

  console.log(`\n✅ Done! Video saved to: ${OUTPUT_FILE}`);
  console.log(`   Format: ${WIDTH}x${HEIGHT} (9:16 Instagram Reel)`);
  console.log(`   Duration: ${DURATION}s at ${FPS}fps`);
  console.log(`   Size: ${sizeMB} MB`);
  console.log(`   Codec: H.264 (compatible with Instagram)`);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
