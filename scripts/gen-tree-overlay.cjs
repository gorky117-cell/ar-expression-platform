const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function genOverlay() {
  const treeTargetPng = path.join(__dirname, '..', 'public', 'overlays', 'tree-birds-target.png');
  const overlayPng = path.join(__dirname, '..', 'public', 'overlays', 'tree-birds-overlay.png');

  console.log('Generating crisp WebGL PNG overlay from tree target...');

  // Copy tree target to overlay PNG so Three.js loads it as a crisp WebGL texture
  fs.copyFileSync(treeTargetPng, overlayPng);
  console.log('SUCCESS! Saved tree-birds-overlay.png at:', overlayPng);
}

genOverlay().catch(console.error);
