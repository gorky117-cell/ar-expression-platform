const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const delay = ms => new Promise(r => setTimeout(r, ms));

async function compile() {
  const targetDir = path.join(__dirname, '..', 'public', 'data', 'targets');
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const pngPath = path.join(__dirname, '..', 'public', 'overlays', 'tree-birds-target.png');
  console.log('Launching headless browser to compile MindAR target from:', pngPath);

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  const client = await page.target().createCDPSession();
  await client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: targetDir,
  });

  await page.goto('https://hiukim.github.io/mind-ar-js-doc/tools/compile/', { waitUntil: 'networkidle2' });
  console.log('Page loaded. Uploading target image...');

  const fileInput = await page.$('input[type=file]');
  await fileInput.uploadFile(pngPath);

  await delay(2000);

  console.log('Clicking Start button...');
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('Start')) {
      await btn.click();
      break;
    }
  }

  console.log('Compiling target... waiting for Download button');

  await page.waitForFunction(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.some(b => b.textContent.includes('Download'));
  }, { timeout: 120000 });

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
  const finalFile = path.join(targetDir, 'tree-birds.mind');

  if (fs.existsSync(downloadedFile)) {
    if (fs.existsSync(finalFile)) fs.unlinkSync(finalFile);
    fs.renameSync(downloadedFile, finalFile);
    console.log('SUCCESS! Saved tree-birds.mind target at:', finalFile);
  } else {
    console.error('Downloaded file not found at:', downloadedFile);
  }

  await browser.close();
}

compile().catch(console.error);
