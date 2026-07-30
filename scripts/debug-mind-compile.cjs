const puppeteer = require('puppeteer');

async function debug() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto('https://hiukim.github.io/mind-ar-js-doc/tools/compile/', { waitUntil: 'networkidle2' });

  const inputs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('input, button, div')).map(el => ({
      tagName: el.tagName,
      type: el.type,
      text: el.textContent.trim().substring(0, 40),
      className: el.className
    }));
  });

  console.log('UI Elements on MindAR Compiler:', JSON.stringify(inputs, null, 2));
  await browser.close();
}

debug();
