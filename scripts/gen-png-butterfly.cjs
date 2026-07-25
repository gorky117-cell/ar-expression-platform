const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function renderPNG() {
  const svgPath = path.join(__dirname, '..', 'public', 'overlays', 'cosmic-butterfly.svg');
  const pngPath = path.join(__dirname, '..', 'public', 'overlays', 'cosmic-butterfly-target.png');

  console.log('Rendering high-resolution target PNG from:', svgPath);
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1000, height: 1000, deviceScaleFactor: 1 });

  const svgContent = fs.readFileSync(svgPath, 'utf8');
  const html = `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#0B0B12;display:flex;justify-content:center;align-items:center;height:100vh;">${svgContent}</body></html>`;

  await page.setContent(html, { waitUntil: 'networkidle0' });
  const element = await page.$('svg');
  await element.screenshot({ path: pngPath });
  console.log('[SUCCESS] Saved high-resolution target PNG to:', pngPath);

  await browser.close();
}

renderPNG().catch(console.error);
