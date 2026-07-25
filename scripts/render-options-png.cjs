const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function renderPNGs() {
  const brainDir = path.join('C:', 'Users', 'lenovo', '.gemini', 'antigravity-ide', 'brain', '7ad69edb-74a5-45e0-9cf8-6a7c193fb4ea');
  
  const files = [
    'option1_pure_markerless',
    'option2_poster_frame',
    'option3_tap_to_place'
  ];

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 400, height: 400, deviceScaleFactor: 2 });

  for (const f of files) {
    const svgPath = path.join(brainDir, f + '.svg');
    const pngPath = path.join(brainDir, f + '.png');

    const svgContent = fs.readFileSync(svgPath, 'utf8');
    const html = `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#121218;display:flex;justify-content:center;align-items:center;height:100vh;">${svgContent}</body></html>`;

    await page.setContent(html, { waitUntil: 'networkidle0' });
    const element = await page.$('svg');
    await element.screenshot({ path: pngPath });
    console.log('Saved:', pngPath);
  }

  await browser.close();
}

renderPNGs().catch(console.error);
