const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const delay = ms => new Promise(r => setTimeout(r, ms));

async function compile() {
  const targetDir = path.join(__dirname, '..', 'public', 'data', 'targets');
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const png1 = path.join(__dirname, '..', 'public', 'overlays', 'cosmic-butterfly-target.png');
  const png2 = path.join(__dirname, '..', 'public', 'overlays', 'tree-birds-target.png');
  
  console.log('Launching headless browser to compile multi-target MindAR file from:', png1, png2);

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  const client = await page.target().createCDPSession();
  await client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: targetDir,
  });

  await page.goto('https://hiukim.github.io/mind-ar-js-doc/tools/compile/', { waitUntil: 'networkidle2' });
  console.log('Page loaded. Uploading multi-target images...');

  const fileInput = await page.$('input[type=file]');
  await fileInput.uploadFile(png1, png2);

  await delay(2500);

  console.log('Clicking Start button...');
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('Start')) {
      await btn.click();
      break;
    }
  }

  console.log('Compiling multi-target file... waiting for Download button');

  await page.waitForFunction(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.some(b => b.textContent.includes('Download'));
  }, { timeout: 180000 });

  console.log('Compilation complete! Clicking Download button...');
  const downloadBtns = await page.$$('button');
  for (const btn of downloadBtns) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('Download')) {
      await btn.click();
      break;
    }
  }

  await delay(4000);

  const downloadedFile = path.join(targetDir, 'targets.mind');
  const finalFile = path.join(targetDir, 'all-targets.mind');

  if (fs.existsSync(downloadedFile)) {
    if (fs.existsSync(finalFile)) fs.unlinkSync(finalFile);
    fs.renameSync(downloadedFile, finalFile);
    console.log('SUCCESS! Saved all-targets.mind multi-target file at:', finalFile);
  } else {
    console.error('Downloaded file not found at:', downloadedFile);
  }

  await browser.close();
}

compile().catch(console.error);
