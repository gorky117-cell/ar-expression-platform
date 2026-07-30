const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const delay = ms => new Promise(r => setTimeout(r, ms));

async function compile() {
  const targetDir = path.join(__dirname, '..', 'public', 'data', 'targets');
  const png1 = path.join(__dirname, '..', 'public', 'overlays', 'cosmic-butterfly-target.png');
  const png2 = path.join(__dirname, '..', 'public', 'overlays', 'tree-birds-target.png');

  console.log('Testing Dropzone upload for both images:', png1, png2);

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  const client = await page.target().createCDPSession();
  await client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: targetDir,
  });

  await page.goto('https://hiukim.github.io/mind-ar-js-doc/tools/compile/', { waitUntil: 'networkidle2' });

  // Upload file 1
  const fileInput = await page.$('input[type=file]');
  await fileInput.uploadFile(png1, png2);

  await delay(3000);

  const previewCount = await page.evaluate(() => {
    return document.querySelectorAll('.dz-preview').length;
  });

  console.log('Dropzone previews created count:', previewCount);

  if (previewCount < 2) {
    console.log('Only 1 preview created via single upload. Attempting secondary upload for png2...');
    await fileInput.uploadFile(png2);
    await delay(3000);
    const newCount = await page.evaluate(() => document.querySelectorAll('.dz-preview').length);
    console.log('New preview count after secondary upload:', newCount);
  }

  console.log('Clicking Start button...');
  const startBtn = await page.$('button.startButton_OY2G');
  if (startBtn) {
    await startBtn.click();
  }

  console.log('Compiling multi-target binary... waiting for Download button');

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
    const stats = fs.statSync(downloadedFile);
    console.log(`SUCCESS! Downloaded multi-target file (${stats.size} bytes)`);
    if (fs.existsSync(finalFile)) fs.unlinkSync(finalFile);
    fs.renameSync(downloadedFile, finalFile);
  }

  await browser.close();
}

compile().catch(console.error);
